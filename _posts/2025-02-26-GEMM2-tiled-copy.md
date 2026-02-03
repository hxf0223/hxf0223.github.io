---
title: GEMM版本2：TiledCopy优化 GMEM 到 SMEM 传输
date: 2025-02-26 +1300
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true
---

第一个版本分块 GEMM 实现有如下待优化点：

A、B 矩阵皆为列矩阵，分块大小 BM = BN = 64，在 GMEM -> SMEM 传输时，无法实现访存合并，内存带宽利用率低：thread_num = BM/TM * BN/TN = 64，sA(64, 16):(1:16)，分块之后 tAsB(1, 16):(8, 64)。且每个线程每次只传输 1 个元素，不能使用向量传输指令（float4）。

在 partition 分块以及 Cute::gemm 过程中，tCsA 产生 bank conflict，tCsB broadcast 导致带宽利用率低：分块 tC(8, 8)，分块之后 tCsA(8, 16):(8, 64)，tCsB(8, 16):(8, 64)。

CTA 内部线程数较少，无法充分掩藏指令延迟。

总结如下：

| 问题          | 当前状态            | 优化建议                       | 优先级 |
| ------------- | ------------------- | ------------------------------ | ------ |
| GMEM 访问     | 单元素访问          | 向量化加载 (float4) + cp.async | 高     |
| Bank Conflict | 存在 2-way conflict | Padding 或 Swizzle             | 高     |
| 线程数        | 64 (太少)           | 增加到 128-256                 | 高     |
| BK 大小       | 16 (偏小)           | 增加到 32-64                   | 中     |
| 寄存器利用    | 隐式                | 显式寄存器分块                 | 中     |
| 流水线        | 单缓冲              | 双缓冲隐藏延迟                 | 中     |

## 1. TiledCopy 优化 GMEM -> SMEM 传输 ##

* [gemm_tile_naive_cute.cu](https://github.com/HPC02/cuda_perf/blob/master/src/cute_gemm/gemm_tile_naive_cute.cu)：使用 Cute 实现的 naive 分块 GEMM
* [gemm_tile_opt1_tiled_copy.cu](https://github.com/HPC02/cuda_perf/blob/master/src/cute_gemm/gemm_tile_opt1_tiled_copy.cu)：使用 TiledCopy 优化 GMEM -> SMEM 传输
* [tiled_copy.cu](https://github.com/NVIDIA/cutlass/blob/main/examples/cute/tutorial/tiled_copy.cu)：官方示例

在 CTA 处理过程中，GMEM -> SMEM 传输时，naive 版本使用 local_partition 计算得到 sub-tile（即所谓 outter-partition）：

```cpp
// tile 大小为 (64, 16)
// thread_num = BM / TM * BN / TN = 64
Layout tA_copy = make_layout(make_shape(Int<64>{}, Int<1>{}));
Tensor tAgA = local_partition(gA, tA_copy, tid);  // (1, 16, k)
Tensor tAsA = local_partition(sA, tA_copy, tid);  // (1, 16)
copy(tAgA(_, _, k), tAsA);  // 普通 copy
```

在 opt1 版本中，使用 TiledCopy、ThrCopy 进行分块拷贝：

```cpp
Layout thr_layout = make_layout(make_shape(Int<16>{}, Int<4>{}));
Layout val_layout = make_layout(make_shape(Int<4>{}, Int<1>{}));
using CopyOp = UniversalCopy<uint128_t>;
using Atom = Copy_Atom<CopyOp, T>;
auto tiled_copy = make_tiled_copy(Atom{}, thr_layout, val_layout);

auto thr_copy = tiled_copy.get_thread_slice(tid);
Tensor tAgA = thr_copy.partition_S(gA);  // (4, 4, 4, k) 
Tensor tAsA = thr_copy.partition_D(sA);  // (4, 4, 4)
copy(tiled_copy, tAgA(_, _, _, k), tAsA);  // 向量化 copy
```

首先，线程划分 layout 改变了，naive 版本为一维划分：一个线程复制一个元素（float）；使用 TiledCopy 之后，每个线程复制 4 个元素，实现了向量化加载，增加了加载指令的吞吐量。

由于每个线程一次复制 4 个元素，一列中就只能分配 64/4=16 个线程，因此线程布局变为二维：(16, 4)，即 16 行 4 列。线程-数据映射关系如下：

| 线程布局 (16, 4) | 数据覆盖         |
| ---------------- | ---------------- |
| (0, 0) → tid=0   | 行[0 - 3],   列0 |
| (1, 0) → tid=1   | 行[4 - 7],   列0 |
| ...              | ...              |
| (15, 0) → tid=15 | 行[60 - 63], 列0 |
| (0, 1) → tid=16  | 行[0 - 3],   列1 |
| ...              | ...              |
| (15, 3) → tid=63 | 行[60 - 63], 列3 |

![tv_layout](/assets/images/cuda/20250226/gemm_tile_opt1/tv_layout.svg)

使用 TiledCopy、ThrCopy 将划分步骤拆分成两步：线程布局划分 + 数据划分（即 thr_layout + val_layout），划分计算及操作更直观容易。

```text
┌─────────────┬─────────────────┬─────────────────────┐
│  Copy_Atom  │   thr_layout    │     val_layout      │
│  (指令)     │   (线程排布)     │   (每线程数据)       │
├─────────────┼─────────────────┼─────────────────────┤
│ LDG.128     │    (16, 4)      │      (4, 1)         │
│ 128-bit加载 │ 16行×4列的线程   │ 每线程4个连续float   │
└─────────────┴─────────────────┴─────────────────────┘
```

TiledCopy 划分之后 layout 如下：

```text
tAgA shape: ((_4,_1),_1,_4,512), stride: ((_1,_0),_0,4096,16384)
tAsA shape: ((_4,_1),_1,_4), stride: ((_1,_0),_0,_256)
```

## 2. 使用 TiledCopy 优势总结 ##

| 特性          | local_partition | TiledCopy                |
| ------------- | --------------- | ------------------------ |
| 向量化控制    | ❌ 无法指定      | ✅ 通过 CopyOp 显式指定   |
| 指令生成      | 编译器决定      | 程序员控制               |
| 线程-数据映射 | 简单划分        | 精细控制                 |
| 可组合性      | 低              | 高（Atom + Layout 分离） |