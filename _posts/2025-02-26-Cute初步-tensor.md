---
title: CUTLASS-Cute 初步(2)：Tensor
date: 2025-02-26 +0900
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true
---

* [github -- 测试代码](https://github.com/HPC02/cuda_perf/blob/master/src/cute_gemm/test_cute_shape.cu)
* [CuTe Tensors](https://github.com/NVIDIA/cutlass/blob/v4.0.0/media/docs/cpp/cute/03_tensor.md#inner-and-outer-partitioning)：官方文档

## 1. CuTe 中的 Tensor 划分 (Partitioning a Tensor) ##

在 GEMM 计算是，需要对矩阵进行划分（分块），以便线程块（Thread Block）和线程（Thread）能够并行处理数据。常用的有 Inner-Partitioning、Outer-Partitioning，以及 TV-layout-Partition。

## 1.1. Inner-Partitioning ###

GEMM 计算，先需要按照 Thread Block 划分为若干 Tile，即给每个 Thread Block 分配一个 Tile。如下所示：

```cpp
Tensor A = make_tensor(ptr, make_shape(8,24));  // (8,24)
auto tiler = Shape<_4,_8>{};                    // (_4,_8)

Tensor tiled_a = zipped_divide(A, tiler);       // ((_4,_8),(2,3))
```

在使用 tiler 对 A 进行切分之后，(_4, _8) 是第一个mode（first mode），(2, 3) 是第二个mode（second mode）。

* 第一个 mode (mode 0)：Tile 的 shape
* 第二个 mode (mode 1)：Tile 在全局中的排列

> mode 是`张量代数`（tensor algebra）中的一个概念，表示张量的不同维度，或者叫逻辑轴。为了避免与 tensor 中的维度（dimension）混淆，故使用不同的术语。

沿着第二个mode 切分之后，可以得到 2x3 个 Tile，每个 Tile 的 shape 是 4x8：

```cpp
Tensor cta_a = tiled_a(make_coord(_,_), make_coord(blockIdx.x, blockIdx.y));  // (_4,_8)
```

由于保留了内部 tile 的 shape 信息，这种切分方式叫做 `Inner-Partitioning`。CuTe 使用 `inner_partition(Tensor, Tiler, Coord)` 函数来实现内部分块，在实际使用时，则使用另外一个代替的函数 `local_tile(Tensor, Tiler, Coord)`来进行 tile 划分（分配给 Thread Block）。

### 1.2. Outer-Partitioning ###

在 Thread Block 划分好 tile 之后，下一步就是将 sub-tile 分配给线程（Thread）：

```cpp
Tensor thr_a = tiled_a(threadIdx.x, make_coord(_,_)); // (2,3)
```

这一步叫做 Outer-Partitioning，因为这种划分方式对 tile 进行划分，保留了分块的 shape 信息。在 CuTe 中，使用 `outer_partition(Tensor, Tiler, Coord)` 函数来实现外部分块，在实际使用时，则使用另外一个代替的函数 `local_partition(Tensor, Layout, Idx)` 来进行 sub-tile 划分（分配给 Thread）。

## 1.3. Layout Algebra ###

有关 `zipped_divide` 函数，以及其他针对 Layout 的数学操作，需要学习并参考：

* [CuTe Layout Algebra](https://github.com/NVIDIA/cutlass/blob/v4.0.0/media/docs/cpp/cute/02_layout_algebra.md#zipped-tiled-flat-divides)。官方文档
* [reed -- cute Layout 的代数和几何解释](https://zhuanlan.zhihu.com/p/662089556)
* [reed -- cute 之 Tensor](https://zhuanlan.zhihu.com/p/663093816?theme=light)
* [Yifan Yang (杨轶凡) -- CuTe Layout and Tensor](https://yang-yifan.github.io/blogs/cute_layout/cute_layout.html)
* [CUTLASS CUTE 1 Layout Algebra](https://declk.github.io/blog/CUDA/CUTLASS%20CUTE%201%20Layout%20Algebra.html)。一个中文博客，介绍 CuTe Layout 代数。

比如，`zipped_divide` 切分方式如下：

```cpp
Layout Shape : (M, N, L, ...)
Tiler Shape  : <TileM, TileN>

zipped_divide  : ((TileM,TileN), (RestM,RestN,L,...))
```
