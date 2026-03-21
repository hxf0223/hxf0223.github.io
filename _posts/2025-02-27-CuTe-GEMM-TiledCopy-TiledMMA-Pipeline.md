---
layout: post
title: 使用 CuTe Tiled Copy、Tiled MMA 以及 Multi-Stage 实现高性能 GEMM
date: 2025-02-27 +0900
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true

toc:
  sidebar: right
---

代码：

- <https://github.com/HPC02/cuda_perf/blob/master/src/cute_gemm_sm80/gemm_sm80.cu>
- <https://github.com/HPC02/cuda_perf/blob/master/src/cute_gemm_sm80/kernel_sm80.cuh>

TODO：GMEM -> SMEM 不会产生 bank conflicts？

配置流程及约束概览：

1. 定义 CTA tile 大小

TODO

2. 定义 GMEM -> SMEM 的 Tiled Copy 配置

TODO

3. 定义 Tiled MMA 配置（包含SMEM TiledCopy）

TODO

4. 定义 SMEM swizzle 配置，以及SMEM Layout（包含multi-stage）

TODO

## 1. 定义 block tile 大小

配置 CTA 大小为 MNK = `128 * 128 * 32`，数据类型为`FP16`：

```cpp
  constexpr auto bM        = cute::Int<128 * 2 / sizeof(TA)>{};
  constexpr auto bN        = cute::Int<128 * 2 / sizeof(TB)>{};
  constexpr auto bK        = cute::Int<32>{};
  constexpr auto cta_tiler = cute::make_shape(bM, bN, bK);  // (bM, bN, bK)
  constexpr auto bP        = cute::Int<3>{};                // pipeline
```

### 1.1. Roofline 计算

`RTX 3060` `Tensor Core` `FP16` 理论峰值为`51TFLOPS`，内存带宽为 360GB/s。`Roofline`临界点为：`51 * 1000 / 360 = 141.67 FLOPs/Byte`。

对于分块矩阵计算，`loop over k`的过程中，包含一次乘法、一次加法。每个 CTA tile 的计算量与 GMEM 搬运量之比（算术强度AI）：

$$
\text{AI}_{tile} = \frac{2 \times bM \times bN \times bK}{(bM \times bK + bN \times bK) \times sizeof(FP16)} = \frac{2 \times 128 \times 128 \times 32}{((128 \times 32) + (128 \times 32)) \times 2} = 64 \text{FLOP/Byte}
$$

TFLOPS 为：

$$
TFLOPS = \text{AI} \times \text{Bandwidth}_{\text{GMEM}} = 64 \times 360 / 1000 = 23.04 \text{TFLOPS}
$$

> 明显的，增大`bM`和`bN`可以提升算术强度，从而提升性能。

如上计算公式没有考虑到`L2 Cache`，如果考虑到`L2 Cache`，即`CTA`之间数据共享，理论计算公式为（以`M*N*K`=`4096*4096*4096`为例）：

$$
\text{AI}_{global} = \frac{2 \times M \times N \times K}{(M \times b + N \times K + M \times N) \times sizeof(FP16)} = \frac{2 \times 4096 \times 4096 \times 4096}{(4096 \times 4096 + 4096 \times 4096 + 4096 \times 4096) \times 2} = 1365 \text{FLOP/Byte}
$$

实测代码如下：

```cpp
double flops = 2.0 * M * N * K;
double tflops = flops / (elapsed_ms * 1e-3) / 1e12;
printf("%.2f TFLOPS\n", tflops);
```

实测结果：

```text
cuBLAS:  5.24442 ms, 26.2067 TFLOPS
Custom:  3.64926 ms, 37.6622 TFLOPS
```

达到理论峰值的`37.66 / 51 = 73.84%`。

## 2. Tiled MMA 配置

TiledMMA 使用`SM80_16x8x16_F16F16F16F16_TN`，对应 PTX 指令`m16n8k16`，使用一个`warp`（32个线程协作）完成子块的`MMA`计算。打印的`MMA Atom`配置信息如下：

```text
MMA_Atom
  ThrID:      _32:_1
  Shape_MNK:  (_16,_8,_16)
  LayoutA_TV: ((_4,_8),(_2,_2,_2)):((_32,_1),(_16,_8,_128))
  LayoutB_TV: ((_4,_8),(_2,_2)):((_16,_1),(_8,_64))
  LayoutC_TV: ((_4,_8),(_2,_2)):((_32,_1),(_16,_8))
```

![SM80_16x8x16_F16F16F16F16_TN](/assets/images/cuda/20250227/gemm_tiled_mma_tiled_copy_pipeline/SM80_16x8x16_F16F16F16F16_TN.webp)

在 SMEM -> REG 的过程中，使用`ldmatrix`拷贝（具体为使用 CopyTraits：`SM75_U16x8_LDSM_T`）。`ldmatrix`以`8 x FP16=128-bit`为单位进行拷贝（可理解为：每个线程指向的`SMEM`要求`8 x FP16`连续）。`SM75_U16x8_LDSM_T`使用`ldmatrix.x4`指令，使用一个`warp`（32个线程），一次拷贝四个`8x8 FP16=(32, 8)`。`SM75_U16x8_LDSM_T`的打印信息如下：

```text
Copy_Atom
  ThrID:        _32:_1
  ValLayoutSrc: (_32,_8):(_8,_1)
  ValLayoutDst: ((_4,_8),(_1,_2,_4)):((_16,_1),(_1,_8,_64))
  ValLayoutRef: ((_4,_8),(_1,_2,_4)):((_16,_1),(_1,_8,_64))
  ValueType:    16b
```

> 参考<https://zhuanlan.zhihu.com/p/696231622>，有如下表述：“矩阵中连续的两行无需在shared memory中连续，但1行是连续的128-bit。也就是说，ldmatrix读取shared memory的单元是128-bit。”。

`Tiled MMA`受上述`SMEM`的`Tiled Copy`约束，要求每个线程处理 `8 x FP16`数据，这个约束作用于`A sub-tile`和`B sub-tile`。`A sub-tile`已经满足要求，针对`B sub-tile`，`SM80_16x8x16_F16F16F16F16_TN`只给每个线程分配四个`FP16`，因此需要使用`permutation`参数（即`mma_layout`）使其满足`SMEM` `TiledCopy`要求：

```cpp
  using MMATraits               = cute::MMA_Traits<cute::SM80_16x8x16_F16F16F16F16_TN>;
  using MMAAtomShape            = MMATraits::Shape_MNK;
  constexpr auto mma_atom       = cute::MMA_Atom<MMATraits>{};
  constexpr auto mma_atom_shape = MMAAtomShape{};  // (16, 8, 16)

  constexpr auto MMA_LAYOUT_M = 2, MMA_LAYOUT_N = 2, MMA_LAYOUT_K = 1;                       // 线程数扩充
  constexpr auto NUM_MMA_TILE_M = 1, NUM_MMA_TILE_N = 2, NUM_MMA_TILE_K = 1;                 // 每个线程Atom数量扩充
  constexpr auto MMA_TILE_M = cute::get<0>(mma_atom_shape) * NUM_MMA_TILE_M * MMA_LAYOUT_M;  // 32
  constexpr auto MMA_TILE_N = cute::get<1>(mma_atom_shape) * NUM_MMA_TILE_N * MMA_LAYOUT_N;  // 32
  constexpr auto MMA_TILE_K = cute::get<2>(mma_atom_shape) * NUM_MMA_TILE_K * MMA_LAYOUT_K;  // 16

  constexpr auto mma_layout =
    cute::make_layout(cute::make_shape(cute::Int<MMA_LAYOUT_M>{}, cute::Int<MMA_LAYOUT_N>{}, cute::Int<MMA_LAYOUT_K>{}));

  constexpr auto mma_tile  = cute::make_tile(cute::Int<MMA_TILE_M>{}, cute::Int<MMA_TILE_N>{}, cute::Int<MMA_TILE_K>{});
  constexpr auto tiled_mma = cute::make_tiled_mma(mma_atom, mma_layout, mma_tile);
```

打印的`TiledMMA`配置信息如下：

```text
(MMA_Atom
  ThrID:      _32:_1
  Shape_MNK:  (_16,_8,_16)
  LayoutA_TV: ((_4,_8),(_2,_2,_2)):((_32,_1),(_16,_8,_128))
  LayoutB_TV: ((_4,_8),(_2,_2)):((_16,_1),(_8,_64))
  LayoutC_TV: ((_4,_8),(_2,_2)):((_32,_1),(_16,_8))
,(2,2,1):(_1,2,4),(32,32,16):(_1,32,1024))
```

- `(2,2,1):(_1,2,4)`：描述Atom的线程扩展配置，即在M、N、K三个维度上分别扩展2倍、2倍、1倍线程。
- `(32,32,16):(_1,32,1024)`：描述Tile的大小配置，即解决的MNK规模。

### 2.1. 约束

这个定义的`TiledMMA`针对线程做了配置：在`M`方向及`N`方向均使用`MMAAtom`的两倍线程，在`K`方向上保持不变。即使用 `2x2=4`个`warp`，共`128`个线程协作完成一个`MMA Tile`的计算。

`TiledMMA`的配置，对 GMEM -> SMEM 拷贝过程中的线程划分形成约束，即在`A/B`子块的 GMEM -> SMEM 过程中，配置的线程数量也是 128 个线程。

同时，`TildMMA`的配置，对输入`A/B`矩阵的`tiler`也形成约束，即要求分配给`CTA`的`tile`大小在 M、N、K 三个维度上分别是`MMA_TILE_M=32`、`MMA_TILE_N=32`、`MMA_TILE_K=16`的整数倍。

## A. 资料

- [cute 之 GEMM流水线](https://zhuanlan.zhihu.com/p/665082713)
- [cute 之 高效GEMM实现](https://zhuanlan.zhihu.com/p/675308830)
- [CUDA SGEMM优化笔记](https://linn-ylz.com/Computer-Science/CUDA/CUDA-SGEMM-optimization-notes/#fn3)
- [从 GEMM 实践 CUDA 优化](https://tom-jerr.github.io/notes/cuda/%E4%BB%8EGEMM%E5%AE%9E%E8%B7%B5CUDA%E4%BC%98%E5%8C%96/)

### A.1. 全流程优化参考资料

- [Nvidia Tensor Core-CUDA HGEMM Advanced Optimization](https://bruce-lee-ly.medium.com/nvidia-tensor-core-cuda-hgemm-advanced-optimization-5a17eb77dd85)：**待阅读**
- [Advanced Matrix Multiplication Optimization on NVIDIA GPUs](https://salykova.github.io/sgemm-gpu)：**待阅读**

- [Performance Analysis of CUDA-based General Matrix Multiplication through Memory Coalescing and Grid-Level Parallelization](https://www.diva-portal.org/smash/get/diva2:1985710/FULLTEXT01.pdf)
- [CUTLASS MMA Pipelined Header](https://github.com/NVIDIA/cutlass/blob/main/include/cutlass/gemm/threadblock/mma_pipelined.h)
- <https://github.com/NVIDIA/cutlass/blob/main/test/unit/gemm/device/default_gemm_configuration.hpp>
