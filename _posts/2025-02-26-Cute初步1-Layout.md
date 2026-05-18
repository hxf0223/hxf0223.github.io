---
layout: post
title: CUTLASS-Cute 初步(1)：Layout
date: 2025-02-26 +0800
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true

toc:
  sidebar: right
---

- [github -- Layout 测试代码](https://github.com/HPC02/cuda_perf/blob/master/src/cute_gemm/test_cute_shape.cu)

## 1. Layout 核心概念

CuTe（CUDA Tensor）是 CUTLASS 3.x 引入的底层张量抽象库，用于简化 BLAS 操作和内存布局管理。最核心的概念是 **Layout**。

**Layout = (Shape, Stride)**，它是一个从**逻辑坐标空间**到**一维内存索引空间**的映射函数：

```text
offset = Σ (coord[i] * stride[i])
```

- **Shape**：逻辑维度，定义坐标空间（"domain"，定义域）。
- **Stride**：每个维度在内存中的步长，决定映射结果（"codomain"，值域）。

以 1D layout `8:2` 为例——8 个元素、stride 为 2：

![1d_map_stride2](/assets/images/cuda/20250226/cute_layout/1d_map_strider2.jpg)

- **size(layout)** = 8 —— 定义域大小（有多少个逻辑坐标）
- **cosize(layout)** = 16 —— 值域大小（映射到的最大 index + 1，即 `layout(size-1) + 1`）

Stride 为 0 时（如 `8:0`），所有坐标映射到同一个地址，此时 size=8, cosize=1。

> Layouts are functions from integers to integers.
>
> 这一总结来自官方文档。意味着：**每个 Layout 都可以用 1-D 坐标去索引**，无论它看起来是几维的。这是 CuTe 与 C++23 `mdspan` 的关键区别——`mdspan` 的 N-D 视图不接受 1-D 坐标，而 CuTe 的 Layout 原生支持。

### 1.1. IntTuple、rank 与 depth

Shape 和 Stride 都是 **IntTuple**——要么是单个整数，要么是 IntTuple 的 tuple（可嵌套）。IntTuple 中的整数可以是编译期静态整数（用 `Int<N>{}` 或别名 `_1`、`_2` 等表示），也可以是运行期动态整数。

Layout 的两个重要结构属性：

| 属性      | 含义                     | 示例                                   |
| --------- | ------------------------ | -------------------------------------- |
| **rank**  | 最外层有几个元素（mode） | `(4,2)` rank=2；`((2,2),2)` rank=2     |
| **depth** | 括号嵌套的最大深度       | `(4,3)` depth=1；`(3,(6,2),8)` depth=2 |

rank/depth 示例：

```text
Layout Shape        rank  depth   含义
────────────        ────  ─────   ────
(8)                  1     1      向量
(4,2)                2     1      矩阵（行和列）
(M,N,K)              3     1      3-D tensor
((2,2),2)            2     2      矩阵，但第一 mode 是嵌套的
(3,(6,2),8)          3     2      最深处 (6,2) 嵌套了 2 层
```

## 2. 构造 Layout

Layout 通过 `make_layout(shape, stride)` 构造。如果不指定 stride，默认按 `LayoutLeft`（列优先）生成紧凑 stride。

下面用 4 个递进式例子来展示 Layout 的表达能力。

### 2.1. 例一：1D 向量

```cpp
auto v1 = make_layout(Int<8>{});          // 8:_1  — 静态 shape，stride 默认 1
auto v2 = make_layout(8, 2);              // 8:2   — 动态 shape，stride 为 2
```

`8:1` 就是连续排列的 8 个元素，index = coord。`8:2` 则每个坐标步进 2。

### 2.2. 例二：2D 矩阵 — 列主序与行主序

```cpp
// 列主序（column-major）：沿列 stride=1，沿行 stride=M
auto col_major = make_layout(make_shape(2, 3), make_stride(1, 2));
// 行主序（row-major）：沿行 stride=1，沿列 stride=N
auto row_major = make_layout(make_shape(2, 3), make_stride(3, 1));
```

`(2,3):(1,2)` 列主序输出：

```text
      0   1   2
    +---+---+---+
 0  | 0 | 2 | 4 |
    +---+---+---+
 1  | 1 | 3 | 5 |
    +---+---+---+
```

`(2,3):(3,1)` 行主序输出：

```text
      0   1   2
    +---+---+---+
 0  | 0 | 1 | 2 |
    +---+---+---+
 1  | 3 | 4 | 5 |
    +---+---+---+
```

```cpp
auto val = col_major(1, 2);  // = 1*1 + 2*2 = 5
```

所谓"列主序"就是最左侧 mode 的 stride=1，colexicographical 遍历等价于逐列访问。

### 2.3. 例三：带嵌套 mode 的层级 Layout

当 mode 本身也是多维时，使用嵌套 tuple 来表达：

```cpp
auto shape  = make_shape(4, make_shape(2, 2));   // 4 行，(2,2) 的嵌套列
auto stride = make_stride(4, make_stride(1, 2)); // stride_i=4, stride_j=1, stride_k=2
auto layout = make_layout(shape, stride);
print_layout(layout);
```

输出：

```text
(4,(2,2)):(4,(1,2))
       0    1    2    3
    +----+----+----+----+
 0  |  0 |  1 |  2 |  3 |
    +----+----+----+----+
 1  |  4 |  5 |  6 |  7 |
    +----+----+----+----+
 2  |  8 |  9 | 10 | 11 |
    +----+----+----+----+
 3  | 12 | 13 | 14 | 15 |
    +----+----+----+----+
```

```cpp
auto val = layout(2, make_coord(1, 0));  // = 2*4 + 1*1 + 0*2 = 9
```

这里虽然 Shape 里嵌套了 `(2,2)`，但顶层 rank 仍然是 2（行 + 嵌套列）。`print_layout` 将其展示为 4×4 的表格，而嵌套的列 mode 被摊平为 4 列。

### 2.4. 例四：改变 stride 对数据排布的影响

保持 Shape 不变，将 stride 改为 `(2,(1,8))`：

```cpp
auto shape  = make_shape(4, make_shape(2, 2));
auto stride = make_stride(2, make_stride(1, 8));
auto layout = make_layout(shape, stride);
print_layout(layout);
```

输出：

```text
(4,(2,2)):(2,(1,8))
       0    1    2    3
    +----+----+----+----+
 0  |  0 |  1 |  8 |  9 |
    +----+----+----+----+
 1  |  2 |  3 | 10 | 11 |
    +----+----+----+----+
 2  |  4 |  5 | 12 | 13 |
    +----+----+----+----+
 3  |  6 |  7 | 14 | 15 |
    +----+----+----+----+
```

```cpp
auto val = layout(2, make_coord(1, 0));  // = 2*2 + 1*1 + 0*8 = 5
```

比较例三和例四：同样的 Shape `(4,(2,2))`，只改变 stride，就得到了完全不同的数据排布。例三中每一行的 4 个元素在内存中是连续的 `0,1,2,3`；例四中每一行的前两个和后两个元素在内存中相隔 8，呈现"分块"效果。

| Stride 分量 | 值  | 含义                                                     |
| ----------- | --- | -------------------------------------------------------- |
| stride_i    | 2   | 沿行移动一步，offset +2                                  |
| stride_j    | 1   | 沿内层列移动一步，offset +1                              |
| stride_k    | 8   | 沿外层列移动一步，offset +8（跳到另一个 4 元素的 block） |

> 关于层级 Layout 的几何直觉，可参考 <https://note.gopoux.cc/hpc/cute/layout/>

## 3. 层级 Layout 与 coordinate

### 3.1. 层级 Layout 的解读

层级 Layout 的核心思想：用嵌套的 Shape/Stride 表达"layout of layouts"。以 `(4,(2,4)):(2,(1,8))` 为例：

![hierarchy_layout](/assets/images/cuda/20250226/cute_layout/Hierarchy_Layout.jpg)

上图中 a 和 b 分别是无嵌套的列主序和行主序。c 和 d 则带有层级结构。

**示例 c** — 仅在列方向有嵌套：

![layout_424_218](/assets/images/cuda/20250226/cute_layout/layout_424_218.png)

- **内层 layout**（红色框内）：`(4,2):(2,1)` —— 4 行 2 列，列主序
- **外层 layout**：`(1,4):(4,1)` —— 1 行 4 列（每个"元素"是一个内层 layout）
- 合并 shape：`(4, (2, 4))`，stride：`(2, (1, 8))`
  - stride_i=2：内层行方向步长
  - stride_j=1：内层列方向步长
  - stride_k=8：外层列方向步长（等于一个完整内层 block 的 cosize）

**示例 d** — 行列方向均有嵌套：

![layout_2224_1428](/assets/images/cuda/20250226/cute_layout/layout_2224_1428.png)

- **内层 layout**（红色框内）：`(2,2):(2,2)`
- **外层 layout**：`(2,4):(4,1)`
- 合并 shape：`((2,2), (2,4))`，stride：`((1,4), (2,8))`

### 3.2. 坐标访问与 slice

访问层级 Layout 时，坐标也需对应嵌套结构：

![hierarchy_layout_coord](/assets/images/cuda/20250226/cute_layout/coord_visit_1.jpg)

```cpp
auto row_coord = make_coord(1, 3);          // 内层行=1, 外层行=3
auto col_coord = make_coord(2, 4);          // 内层列=2, 外层列=4
auto coord = make_coord(row_coord, col_coord);
auto val = layout(coord);
```

Slice 操作使用 `cute::_`（类似 Python 的 `:`）保留某个维度的所有元素：

![hierarchy_layout_slice](/assets/images/cuda/20250226/cute_layout/cute_slice_01.jpg)

```cpp
auto layout = make_layout(
    make_shape(make_shape(2, 4), make_shape(3, 5)),
    make_stride(make_stride(3, 6), make_stride(1, 24))
);

auto row_coord = make_coord(1, 1);              // 固定行坐标
auto col_coord = make_coord(cute::_, cute::_);  // 保留所有列
auto coord = make_coord(row_coord, col_coord);   // 获取子块 B
auto sub_layout = cute::slice(coord, layout);
```

## 4. Layout 的三种坐标空间

每个 Layout 天然拥有三套坐标系统：

- **1-D 坐标**：单个整数
- **R-D 坐标**：rank 维坐标（如 2D layout 的 `(m,n)`）
- **h-D 坐标**：层级坐标（自然坐标，与 Shape 的嵌套结构一致）

这三种坐标可以互相转换，前提是 **Shape 兼容**（size 相等且定义域相互包含）。

### 4.1. colexicographical order 坐标转换

CuTe 使用 **colexicographical order**（余字典序，从右往左变化更快）进行坐标映射。以 shape `(3,(2,3))` 为例：

| 1-D | 2-D     | Natural     |     | 1-D  | 2-D     | Natural     |
| --- | ------- | ----------- | --- | ---- | ------- | ----------- |
| `0` | `(0,0)` | `(0,(0,0))` |     | `9`  | `(0,3)` | `(0,(1,1))` |
| `1` | `(1,0)` | `(1,(0,0))` |     | `10` | `(1,3)` | `(1,(1,1))` |
| `2` | `(2,0)` | `(2,(0,0))` |     | `11` | `(2,3)` | `(2,(1,1))` |
| `3` | `(0,1)` | `(0,(1,0))` |     | `12` | `(0,4)` | `(0,(0,2))` |
| `4` | `(1,1)` | `(1,(1,0))` |     | `13` | `(1,4)` | `(1,(0,2))` |
| `5` | `(2,1)` | `(2,(1,0))` |     | `14` | `(2,4)` | `(2,(0,2))` |
| `6` | `(0,2)` | `(0,(0,1))` |     | `15` | `(0,5)` | `(0,(1,2))` |
| `7` | `(1,2)` | `(1,(0,1))` |     | `16` | `(1,5)` | `(1,(1,2))` |
| `8` | `(2,2)` | `(2,(0,1))` |     | `17` | `(2,5)` | `(2,(1,2))` |

转换算法：**从左到右逐级取模和除法**。

以 shape `(M, N)` 从 1-D 转到 2-D 为例：

```text
coord = (index % M, (index / M) % N)
```

以 shape `(M, (N, K))` 从 1-D 转到 h-D 为例：

```text
index = 7，M=3：
  mode_0 = 7 % 3 = 1， 7 / 3 = 2
  mode_1 = (2 % 2 = 0， 2 / 2 = 1 % 3 = 1)
  → (1, (0, 1))
```

坐标转换流程：

```text
        idx2crd                          crd2idx
1-D ──────────→ natural (h-D) coord ──────────→ index
                     ↑
        idx2crd      │
R-D ──────────→──────┘
```

C++ 示例：

```cpp
auto shape = Shape<_3,Shape<_2,_3>>{};
print(idx2crd(   16, shape));                                // (1,(1,2))
print(idx2crd(_16{}, shape));                                // (_1,(_1,_2))
print(idx2crd(make_coord(   1,5), shape));                   // (1,(1,2))
print(idx2crd(make_coord(_1{},5), shape));                   // (_1,(1,2))
print(idx2crd(make_coord(   1,make_coord(1,   2)), shape));  // (1,(1,2))
print(idx2crd(make_coord(_1{},make_coord(1,_2{})), shape));  // (_1,(1,_2))
```

可以看到无论用哪种坐标输入 `idx2crd`，只要指的是同一个逻辑位置，得到的 natural 坐标都等价。

> 坐标转换只依赖 Shape，不依赖 Stride。而调用 `layout(coord)` 计算 index 时才需要 Stride：

| 操作                                             | 依赖 Shape | 依赖 Stride |
| ------------------------------------------------ | ---------- | ----------- |
| 1-D ↔ R-D ↔ h-D 坐标转换（`idx2crd`）            | ✅         | ❌          |
| 坐标兼容性判断（compatibility）                  | ✅         | ❌          |
| 坐标 → 内存 index（`crd2idx` / `layout(coord)`） | ✅         | ✅          |

## A. 参考及资料

- [reed -- cute 之 Layout](https://zhuanlan.zhihu.com/p/661182311)
- [Yifan Yang (杨轶凡) -- CuTe Layout and Tensor](https://yang-yifan.github.io/blogs/cute_layout/cute_layout.html)
- [CUTLASS CUTE 1 Layout Algebra](https://declk.github.io/blog/CUDA/CUTLASS%20CUTE%201%20Layout%20Algebra.html)
- [01_layout.md](https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/cute/01_layout.md)：CUTLASS/CuTe 官方文档
- [CuTe-Copy for GPUMode PPT](/assets/pdf/cuda/CuTe-Copy_for_GPUMode_PPT.pdf)：NVIDIA 官方 PPT
- [CUTLASS: A CUDA C++ Template Library for Accelerating Deep Learning](https://www.youtube.com/watch?v=PWWOGrLZtZg&t=534s)：YouTube 视频

### A.1. 更多学习资料

- [AI Kernel Learning — Quick Start](https://github.com/Ammar-Alnagar/AI-Kernel-learning)
- [Learn CUTLASS the hard way 系列](https://www.kapilsharma.dev/tags/cuda/)
