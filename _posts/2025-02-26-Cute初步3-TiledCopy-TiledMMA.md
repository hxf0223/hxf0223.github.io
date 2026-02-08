---
title: CUTLASS-Cute 初步(3)：TiledCopy 以及 TiledMMA
date: 2025-02-26 +1000
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true
---

* [tiled_copy.cu](https://github.com/NVIDIA/cutlass/blob/main/examples/cute/tutorial/tiled_copy.cu)：官方示例

## 1. Cute TiledCopy ##

层次化的 copy 抽象，将 Copy_Atom 分为几个可组合的层次：

* CopyOperation：NVidia在不同的硬件架构、不同的存储层次之间数据搬运提供了不同的指令，如 ldmatrix 和 LDS 等，还有针对Ampere架构的 cp.async 等。
* Copy_Traits：和 MMA_Traits 类似，提供了 CopyOperation 类型没有提供，但是其使用者 Copy_Atom 却需要的起到桥梁作用的信息；
* Copy_Atom：封装了基本的拷贝指令，针对 SRC-DST 的一次搬运；

TiledCopy 则根据提供的 LayoutCopy_TV 执行 Copy_Atom，可能需要重复多次的 atom 搬运操作。

### 1.1. Copy_Atom ###

Copy_Atom 封装基本的拷贝指令，所以叫 Atom，即针对 SRC-DST 的一次搬运。适配不同的硬件指令集，比如通用拷贝/向量化 UniversalCopy<...>，cp.async（Ampere架构）。

![copy_atom_structure](/assets/images/cuda/20250226/cute_tiled_copy/Copy_Atom_Structure.png)

需要关注的两个模板参数是：CopyOperation 和 Copy_Traits。CopyOperation 定义了具体的拷贝指令，而 Copy_Traits 定义了拷贝的元信息，比如每次拷贝多少个元素（元素类型），SRC-DST 的 Layout 等。不同平台，实现不同的 Copy_Traits。（个人理解：一些 copy 操作也需要用到 layout 信息，以及 bits 位宽等信息）

![copy_traits_arch](/assets/images/cuda/20250226/cute_tiled_copy/Copy_Traits_Arch.png)

部分代码实现文件列表：

* [cute/atom/copy_atom.hpp -- Copy_Atom](https://github.com/NVIDIA/cutlass/blob/v4/include/cute/atom/copy_atom.hpp#L54)
* [cute/atom/copy_traits.hpp -- copy_unpack](https://github.com/NVIDIA/cutlass/blob/v4/include/cute/atom/copy_traits.hpp#L113)
* [cute/atom/copy_traits.hpp -- Copy_Traits](https://github.com/NVIDIA/cutlass/blob/v4/include/cute/atom/copy_traits.hpp#L66)
* [cute/arch/copy_sm90.hpp](https://github.com/NVIDIA/cutlass/blob/v4/include/cute/arch/copy_sm90.hpp)：针对 SM90 架构的 Copy_Traits 实现

### 1.2. TiledCopy ###

TiledCopy 封装 Copy_Atom，根据 LayoutCopy_TV 执行 Copy_Atom，可能需要重复多次的 atom 搬运操作。其 template 参数有：

* LayoutCopy_TV：定义 Thread Layout，以及 Value Layout；
* ShapeTiler_MN：切分器的 shape；
* Copy_Atom：定义复制指令；

ThrCopy 完成实际的生成线程对应的 tensor（软件工程功能划分需要，剥离出来的功能模块）。

### 1.3. make_tiled_copy ###

提供工厂函数，提供 thr_layout、val_layout、CopyOperation 参数生成 TiledCopy 实例。其中，thr_layout、val_layout 分别定义线程划分 layout 和每个线程拷贝数据的 layout。

```cpp
make_tiled_copy(copy_atom, thr_layout, val_layout)
```

### 1.4. copy 执行 ###

copy 函数是拷贝的实际执行函数，完成线程指令的执行：

```cpp
void copy(TiledCopy const& copy, Tensor const& src, Tensor& dst);
void copy_if(TiledCopy const& copy, PrdTensor const& pred, Tensor const& src, Tensor& dst);
```

### 1.5. 可视化工具 ###

* [cutlass-viz](https://github.com/flashinfer-ai/cutlass-viz)
* [cute_render](https://github.com/hxf0223/cute_render)
* [cute-viz](https://github.com/NTT123/cute-viz)

## 2. MMAAtom 以及 TiledMMA ##

分块 MMA 抽象，将 MMA_Atom 分为几个可组合的层次：

* MMAOperation：封装 D=A*B + C 的指令封装，以使用不同的数据类型以及 PTX 指令，包括使用 CUDA Core / Tensor Core。如 UniversalFMA<>、SM80_16x8x8_F32F16F16F32_TN。
* MMA_Traits：和 Copy_Traits 类似，提供了 MMAOperation 类型没有提供，但是其使用者 MMA_Atom 却需要的起到桥梁作用的信息。如数据类型信息，TV layout 信息。
* MMA_Atom：将 MMAOperation 和 MMA_Traits 结合，并提供 fragment 划分接口。
* TiledMMA：根据 LayoutTile_TV 切分的线程布局，重复使用 MMA_Atom 完成分块矩阵乘加计算。
* ThrMMA：完成实际的生成线程对应的 tensor。

### 2.1. MMAOperation ###

以**SM80_16x8x8_F32F16F16F32_TN**为例，封装了 SM80 架构下，16x8x8 大小的矩阵乘加指令 **D=A * B + C**，数据类型为 A:F16、B:F16、C:F32、D:F32。A 矩阵 row-major，B 矩阵 column-major。

> BLAS 中约定 normal 矩阵为列优先。T(transpose) 表示使用转置矩阵，即 row-major 存储。
> 下图原图见 Thakkar_BLISRetreat2023.pdf 第 30 页。

![SM80_16x8x8_F32F16F16F32_TN](/assets/images/cuda/20250226/cute_tiled_mma/abc_layout_SM80_16x8x8_F32F16F16F32_TN.png)

**SM80_16x8x8_F32F16F16F32_TN** 对应的 layout 信息如下：

```text
MMA Atom Layout:
ALayout: ((_4,_8),(_2,_2)):((_32,_1),(_16,_8))
BLayout: ((_4,_8),_2):((_16,_1),_8)
CLayout: ((_4,_8),(_2,_2)):((_32,_1),(_16,_8))
```

对应的代码如下：

```cpp
using MMA = MMA_Traits<SM80_16x8x8_F32F16F16F32_TN>;
print("ALayout: "), print(typename MMA::ALayout{}), print("\n");
print("BLayout: "), print(typename MMA::BLayout{}), print("\n");
print("CLayout: "), print(typename MMA::CLayout{}), print("\n");

MMA_Atom<SM80_16x8x8_F32F16F16F32_TN> mma;
print_latex(mma);

/* 或者如下写法
TiledMMA tiled_mma = make_tiled_mma(SM80_8x8x4_F64F64F64F64_TN{});
print_latex(tiled_mma);
*/
```

* **TODO: SM80_16x8x8_F32F16F16F32_TN 一条指令处理几个数据？**
* **TODO：Tensor Core 的指令是什么，对应的布局是什么规则？**

CUDA PTX 文档也给出了指令 m16n8k8 的布局信息：[9.7.14.5.7. Matrix Fragments for mma.m16n8k8](https://docs.nvidia.com/cuda/parallel-thread-execution/index.html#warp-level-matrix-fragment-mma-1688)。

### 2.2. MMA_Traits ###

MMA_Traits 提供数据类型信息，以及 TV layout 信息，比如需要根据 MMAOperation 中定义的指令，补充 A/B/C 的 layout 信息。需要提供的信息如下：

```cpp
using ElementDVal =  // Logical A-value type
using ElementAVal =  // Logical B-value type
using ElementBVal =  // Logical C-value type
using ElementCVal =  // Logical D-value type

using ElementAFrg =  // A-type consumed by MMA  (if ommitted, same as ElementAVal)
using ElementBFrg =  // B_type consumed by MMA  (if ommitted, same as ElementBVal)
using ElementCFrg =  // C_type consumed by MMA  (if ommitted, same as ElementCVal)

using Shape_MNK =    // Logical MxNxK shape of the MMA

using ThrID     =    // Logical thread id (tid) -> tidx

using ALayout =      // (Logical thread id (tid), Logical value id (vid)) -> Flat MK-coord
using BLayout =      // (Logical thread id (tid), Logical value id (vid)) -> Flat NK-coord
using CLayout =      // (Logical thread id (tid), Logical value id (vid)) -> Flat MN-coord
```

### 2.3. TiledMMA ###

TiledMMA 的模版参数表达了 TiledMMA 在 MMA_Atom 上的扩展逻辑：AtomLayoutMNK 表示 M、N、K 方向上分别重复几次 Atom，这种重复会要求更多的执行线程。get_slice、get_thread_slice 函数功过给定线程 id 则获取线程对应到 ThrMMA 结构。

```cpp
template <class MMA_Atom,
          class AtomLayoutMNK,
          class PermutationMNK = Tile<Underscore,Underscore,Underscore>>
struct TiledMMA : MMA_Atom {
  auto get_slice(ThrIdx const& thr_idx) const {
    auto thr_vmnk = thr_layout_vmnk_.get_flat_coord(thr_idx);
    return ThrMMA<TiledMMA, decltype(thr_vmnk)>{*this, thr_vmnk};
  }
  
  auto get_thread_slice(ThrIdx const& thr_idx) const {
    return get_slice(thr_idx);
  }

  auto thrfrg_C(CTensor&& ctensor) const {
    ....
  }
};
```

三个模板参数的含义：

| 参数名         | 类型                    | 说明                                              |
| -------------- | ----------------------- | ------------------------------------------------- |
| MMA_Atom       | 底层指令                | 定义单条 MMA 指令涉及的线程和值的布局             |
| AtomLayoutMNK  | Layout<Shape<_2,_2,_1>> | 在 M/N/K 方向上重复多少个 atom（分配更多线程）    |
| PermutationMNK | Layout<Shape<_1,_2,_1>> | 每个线程在 M/N/K 方向上处理更多的值（不增加线程） |

> 3.4 之前版本还有 ValLayoutMNK 参数，从 3.4 版本开始 去掉该模板参数。PermutationMNK 可以替代 ValLayoutMNK 的功能。即 AtomLayoutMNK 定义 Thread 扩展，PermutationMNK 定义 Value 级别的扩展，即执行多次 Atom，**使用 PermutationMNK 导致线程需要占用更多的寄存器**。

> PermutationMNK 的展开讲述见下面章节。

### 2.4. ThrMMA ###

TiledMMA 根据具体的线程 id 分解得到 ThrMMA 结构，提供 partition 函数接口，以及 partition_fragment 函数接口。

如 Tensor C 为 BLK_M x BLK_N，则 partition_C 可以得到线程级别的任务，维度为 (MMA, MMA_M, MMA_N), MMA 表达了 TileMMA 一次能计算的单元，MMA_M, MMA_N 表达了 M 方向和 N 方向需要分块数量。

partition_fragment 类函数是按照 partition 类函数返回的 Tensor 形状生成的对应的寄存器表示。

```cpp
template <class TiledMMA, class ThrVMNK>
struct ThrMMA : TiledMMA {
  Tensor partition_C(Tensor C);
  Tensor partition_A(Tensor A);
  Tensor partition_B(Tensor B);
  Tensor partition_fragment_C(Tensor C);
  Tensor partition_fragment_A(Tensor A);
  Tensor partition_fragment_B(Tensor B);
}
```

### 2.5. Permutation：置换 ###

Permutation 是一个 Tiler，由三个独立的分量组成，分别作用于 M、N、K 维度。它在 TV-layout 分配之前，对逻辑坐标进行重新映射。以 SM80_8x8x4_F64F64F64F64_TN 为例，其 layout 如下：

![SM80_8x8x4_F64F64F64F64_TN](/assets/images/cuda/20250226/cute_tiled_mma/abc_SM80_8x8x4_F64F64F64F64_TN.webp)

```text
ALayout: ((_4,_8),_1):((_8,_1),_0)
BLayout: ((_4,_8),_1):((_8,_1),_0)
CLayout: ((_4,_8),_2):((_16,_1),_8)
```

代码如下：

```cpp
TiledMMA tiled_mma = make_tiled_mma(SM80_8x8x4_F64F64F64F64_TN{});
/* TiledMMA tiled_mma = make_tiled_mma(SM80_8x8x4_F64F64F64F64_TN{}, Layout<Shape<_1, _1, _1>>{}, Tile<_8, _8, _4>{}); */

print("ALayout: "), print(typename decltype(tiled_mma)::ALayout{}), print("\n");
print("BLayout: "), print(typename decltype(tiled_mma)::BLayout{}), print("\n");
print("CLayout: "), print(typename decltype(tiled_mma)::CLayout{}), print("\n");

std::cout << "\nMMA Atom Layout:" << std::endl;
print_latex(tiled_mma);
```

使用 permuteation 参数将线程处理的单元 size 修改为 8x16x8，即 N、K 方向扩大为两倍，M 方向不变：

![Permutation 8x16x8](/assets/images/cuda/20250226/cute_tiled_mma/abc_SM80_8x8x4_F64F64F64F64_TN_permute_8_16_8.webp)

```text
ALayout: ((_4,_8),_1):((_8,_1),_0)
BLayout: ((_4,_8),_1):((_8,_1),_0)
CLayout: ((_4,_8),_2):((_16,_1),_8)
```

代码如下：

```cpp
TiledMMA tiled_mma = make_tiled_mma(SM80_8x8x4_F64F64F64F64_TN{},
                                        Layout<Shape<_1, _1, _1>>{},  // AtomLayout
                                        Tile<_8, _16, _8>{});         // Tiler

print("ALayout: "), print(typename decltype(tiled_mma)::ALayout{}), print("\n");
print("BLayout: "), print(typename decltype(tiled_mma)::BLayout{}), print("\n");
print("CLayout: "), print(typename decltype(tiled_mma)::CLayout{}), print("\n");

std::cout << "\nMMA Atom Layout:" << std::endl;
print_latex(tiled_mma);
```

* [[QST] What is PermutationMNK in TiledMMA in CUTLASS 3.4 changes?](https://github.com/NVIDIA/cutlass/discussions/1345#discussioncomment-8485429)
* [02_layout_algebra.md -- Logical Divide 2-D Example](https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/cute/02_layout_algebra.md#logical-divide-2-d-example)

### 2.6. UniversalFMA ###

> 可以参考 **Thakkar_BLISRetreat2023.pdf** 第 26 页。

UniversalFMA 是一个标量 FMA 操作的 MMAOperation 实现，定义如下：

```cpp
template <class D, class A = D, class B = A, class C = D>
struct UniversalFMA {
  using DRegisters = D[1];
  using ARegisters = A[1];
  using BRegisters = B[1];
  using CRegisters = C[1];

  CUTE_HOST_DEVICE static constexpr void
  fma(D& d, A const& a, B const& b, C const& c) {
    // Forward to an ADL/cute free function for these types
    using cute::fma;
    fma(d, a, b, c); // 这里的实现就是d = a * b + c;
  }
};
```

```cpp
template <class D, class A, class B, class C>
struct MMA_Traits<UniversalFMA<D,A,B,C>> {
  using ValTypeD = D;
  using ValTypeA = A;
  using ValTypeB = B;
  using ValTypeC = C;

  // Logical shape of the MMA
  using Shape_MNK = Shape<_1,_1,_1>;

  // Logical thread id (tid) -> tidx
  using ThrID   = Layout<_1>; // 只有一个thread参与

  // (Logical thread id (tid), Logical value id (vid)) -> coord

  // (tid,vid) -> (m,k)
  using ALayout = Layout<Shape<_1,_1>>;
  // (tid,vid) -> (n,k)
  using BLayout = Layout<Shape<_1,_1>>;
  // (tid,vid) -> (m,n)
  using CLayout = Layout<Shape<_1,_1>>;
};
```

参考官方示例函数**gemm_nt**：<https://github.com/NVIDIA/cutlass/blob/main/examples/cute/tutorial/sgemm_sm80.cu#L478>，从中提取部分代码如下：

```cpp
using TA      = float;
using TB      = float;
using TC      = float;
TiledMMA mmaC = make_tiled_mma(UniversalFMA<TC, TA, TB>{}, Layout<Shape<_16, _16, _1>>{});  // 16x16x1 TiledMMA
std::cout << "\nTiledMMA Layouts (UniversalFMA 16 16 1):" << std::endl;
print("ALayout: "), print(typename decltype(mmaC)::ALayout{}), print("\n");
print("BLayout: "), print(typename decltype(mmaC)::BLayout{}), print("\n");
print("CLayout: "), print(typename decltype(mmaC)::CLayout{}), print("\n");

std::cout << "\nMMA Atom Layout:" << std::endl;
print_latex(mmaC);
```

![UniversalFMA 16x16x1 TiledMMA](/assets/images/cuda/20250226/cute_tiled_mma/abc_layout_UniversalFMA_16_16_1.jpeg)

打印结果如下：

```text
ALayout: (_1,_1):(_0,_0)
BLayout: (_1,_1):(_0,_0)
CLayout: (_1,_1):(_0,_0)
```

## A. 资料 ##

### A.1. TiledCopy 资料 ###

* [CuTe Tiled Copy](https://leimao.github.io/blog/CuTe-Tiled-Copy/)：Mao Lei 博客介绍 CUTLASS-Cute Tiled Copy 文章
* [cute 之 Copy抽象](https://zhuanlan.zhihu.com/p/666232173)：知乎 reed 博客
* [cute/tutorial/tiled_copy.cu](https://github.com/NVIDIA/cutlass/blob/main/examples/cute/tutorial/tiled_copy.cu)：官方示例代码

### A.2. MMA Atom 资料 ###

* [0t_mma_atom.md](https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/cute/0t_mma_atom.md)：官方文档，MMA Atom 文档
* [cute 之 MMA抽象](https://zhuanlan.zhihu.com/p/663092747)：知乎 reed 博客
* [CuTe Tiled MMA](https://leimao.github.io/blog/CuTe-Tiled-MMA/)：Mao Lei 博客介绍 CUTLASS-Cute Tiled MMA 文章
* [Thakkar_BLISRetreat2023.pdf](https://www.cs.utexas.edu/users/flame/BLISRetreat2023/slides/Thakkar_BLISRetreat2023.pdf)
* [MMA Atoms and TiledMMA](https://deepwiki.com/NVIDIA/cutlass/2.3-mma-atoms-and-tiledmma)

### A.3. 参考代码 ###

* [sm80_mma_multistage.hpp](https://github.com/NVIDIA/cutlass/blob/main/include/cutlass/gemm/collective/sm80_mma_multistage.hpp)：官方示例代码
* [sgemm_sm80.cu](https://github.com/NVIDIA/cutlass/blob/main/examples/cute/tutorial/sgemm_sm80.cu)：官方示例代码

### A.3. 工具 ###

* [TeXPage](https://www.texpage.com/)
* [Aspose.TeX viewer](https://products.aspose.app/tex/viewer)
