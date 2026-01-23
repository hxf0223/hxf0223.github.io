---
title: CUTLASS-Cute 初步(3)：Tiled Copy
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

### 1.4. 工具 ###

**cutlass-viz**

Tiled Copy Visualization 工具：

```bash
cutlass-viz --source examples/tiled_copy.cc
```

* [cutlass-viz](https://github.com/flashinfer-ai/cutlass-viz)：github 开源项目，用于可视化 CUTLASS 中的各种操作
* [deepwiki:cutlass-viz](https://deepwiki.com/flashinfer-ai/cutlass-viz/6.2-tiled-copy-visualization)

**Typst**

可视化 TiledCopy：

```python
print_typst(tiled_copy)
```

* [MoYe.jl -- TiledCopy & TiledMMA](https://yichengdwu.github.io/MoYe.jl/dev/manual/tiled_matmul/)

**cute-viz**

*[cute-viz](https://github.com/NTT123/cute-viz)

**print-cute-tv-layout**

* [print-cute-tv-layout](https://gist.github.com/NTT123/05f603c748e5f26bbc07bb636883e9ee)：gist Python 代码
* [[FEA] [CuTeDSL] print_latex in CuTeDSL #2453](https://github.com/NVIDIA/cutlass/issues/2453)

## 2. MMAAtom 以及 TiledMMA ##

*[MMA Atoms and TiledMMA](https://deepwiki.com/NVIDIA/cutlass/2.3-mma-atoms-and-tiledmma)
TBD

## 资料 ##

* [CuTe Tiled Copy](https://leimao.github.io/blog/CuTe-Tiled-Copy/)：Mao Lei 博客介绍 CUTLASS-Cute Tiled Copy 文章
* [cute 之 Copy抽象](https://zhuanlan.zhihu.com/p/666232173)：知乎 reed 博客
* [cute/tutorial/tiled_copy.cu](https://github.com/NVIDIA/cutlass/blob/main/examples/cute/tutorial/tiled_copy.cu)：官方示例代码
