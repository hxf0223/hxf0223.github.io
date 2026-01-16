---
title: CUTLASS-Cute基础：Layout
date: 2025-02-26 +0800
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true
---

* [github -- 测试代码](https://github.com/HPC02/cuda_perf/blob/master/src/cute_gemm/test_cute_shape.cu)

Cute(CUDA Tensor) 是 CUBLASS 扩展，用于简化张量 BLAS 操作和内存布局的管理。

最主要的概念是 Tensor 和 Layout：

* Layout<Shape, Stride>: 定义张量的内存布局，用于将一维内存地址映射到多维张量索引。
* Tensor<Engine,Layout>: 定义张量的数据类型和布局。

映射公式：

```text
offset = Σ (index[i] * stride[i])
```

## 1. Layout ##

### 1.1. 例一：定义一个两行三列的矩阵布局，这个矩阵采用列主序存储 ###

```cpp
    auto tensor_shape = make_shape(2, 3);   // 两行三列
    auto tensor_stride = make_stride(1, 2); // 列主序存储
    auto tensor_layout = make_layout(tensor_shape, tensor_stride);
    print_layout(tensor_layout);
```

输出：

```text
(2,3):(1,2)
      0   1   2
    +---+---+---+
 0  | 0 | 2 | 4 |
    +---+---+---+
 1  | 1 | 3 | 5 |
    +---+---+---+
```

```cpp
const auto val = tensor_layout(1, 2); // 访问张量元素 (1,2)，值为 5
```

### 1.2. 例二：定义一个两行三列的矩阵，这个矩阵采用行主序存储 ###

```cpp
    auto tensor_shape = make_shape(2, 3);   // 两行三列
    auto tensor_stride = make_stride(3, 1); // 行主序存储
    auto tensor_layout = make_layout(tensor_shape, tensor_stride);
    print_layout(tensor_layout);
```

输出：

```text
(2,3):(3,1)
      0   1   2
    +---+---+---+
 0  | 0 | 1 | 2 |
    +---+---+---+
 1  | 3 | 4 | 5 |
    +---+---+---+
```

### 1.3. 例三：定义一个三维张量布局 ###

* 张量形状：(4,2,2)，dim0=4, dim1=2, dim2=2
* 张量步长：(4,1,2) 行主序存储，子 tensor 为列主序

```cpp
    auto tensor_shape = make_shape(4, make_shape(2, 2));
    auto tensor_stride = make_stride(4, make_stride(1, 2));
    auto tensor_layout = make_layout(tensor_shape, tensor_stride);
    print_layout(tensor_layout);
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
const auto val1 = tensor_layout(2, make_coord(1, 0)); // 访问张量元素 (2,(1,0))，值为 9
```

### 1.4. 例四：定义一个三维张量布局 ###

* 张量形状：(4,2,2)，dim0=4, dim1=2, dim2=2
* 张量步长：(2,1,8)

```cpp
    auto tensor_shape = make_shape(4, make_shape(2, 2));
    auto tensor_stride = make_stride(2, make_stride(1, 8));
    auto tensor_layout = make_layout(tensor_shape, tensor_stride);
    print_layout(tensor_layout);
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
const auto val1 = tensor_layout(2, make_coord(1, 0)); // 访问张量元素 (2,(1,0))，值为 5
```

几何解释：

```text
内存布局（一维）：
[0][1][2][3][4][5][6][7] | [8][9][10][11][12][13][14][15]
 ←───── 块 k=0 ─────→     ←────── 块 k=1 ──────→
```

| Stride 分量 | 值  | 含义                                             |
| ----------- | --- | ------------------------------------------------ |
| stride_i    | 2   | 沿 i 方向移动一步，offset 增加 2                 |
| stride_j    | 1   | 沿 j 方向移动一步，offset 增加 1                 |
| stride_k    | 8   | 沿 k 方向移动一步，offset 增加 8（跳到另一个块） |

> 关于几何解释，更多理解内容参考帖子 <https://note.gopoux.cc/hpc/cute/layout/>

### 1.1. Shape 以及 Stride 定义嵌套 ###

定义多维 Tensor 时，可以使用嵌套的 Shape 和 Stride 来定义子 Tensor 的形状和步长。在 Cute 中，使用 template tuple 表示表示嵌套的 Shape 和 Stride。

具体是使用 IntTule 表示：IntTuple 可以是一个整形，也可以是一个 tuple，并且可以嵌套。一下都是一个合法的 IntTuple：

* int{3}，运行时整数。
* Int<3>{}，Int<3>() 编译时整数，称为静态整数。另外，定义了一些字面量：比如 `_1`、`_2`、`_3` 分别定义为 Int<1>{}、Int<2>{}、Int<3>{}。
* 带有任何模板参数的 IntTuple，比如 make_tuple(int{2}, Int<3>{})。

## 参考 ##

* [NVIDIA -- CUTLASS：基于张量和空间微核处理多维数据的原理抽象](https://developer.nvidia.cn/blog/cutlass-principled-abstractions-for-handling-multidimensional-data-through-tensors-and-spatial-microkernels/)
* [reed -- cute Layout 的代数和几何解释](https://zhuanlan.zhihu.com/p/662089556)
* [Yifan Yang (杨轶凡) -- CuTe Layout and Tensor](https://yang-yifan.github.io/blogs/cute_layout/cute_layout.html)
