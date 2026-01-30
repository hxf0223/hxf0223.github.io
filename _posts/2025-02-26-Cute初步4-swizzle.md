---
title: CUTLASS-Cute 初步(4)：Swizzle
date: 2025-02-26 +1100
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true
---

给定 layout 范围内，swizzle 通过列异或操作（icol = irow ^ icol），周期性的 coord 重排，映射到新的物理地址 offset。swizzle 定义了三个参数：

* M：以 $2^M$ 个一维坐标连续的元素为单位，将其当做一个元素；
* S：定义列长度，即重排周期，$2^S$ 个元素为一组（以 M 个元素为单位）；
* B：定义行长度，即 swizzle 的周期长度，$2^B$行为一个周期。

引用reed解释及图示，其输入为一个一维坐标的 layout，通过 swizzle 将其拆分为二维坐标表示形式：

![swizzle 逻辑示意](/assets/images/cuda/20250226/cute_swizzle/swizzle_logic.jpg)

> 一般在设置 swizzle 参数时，按输入的 layout 一行为周期进行 swizzle，则需要 $2^{S+M}$ = 列长度。比如 half 类型的 layout (8, 32):(32, 1)，定义swizzle<3, 3, 3>，即 8 个元素形成新的最小单位（M），8 个最小单位为一行（S），所以 swizzle 从$8 \times 8 = 64$个元素开始。见下面示例。B 为 8，则整个 swizzle 周期为 8 行。

* 设计 swizzle 参数时，要求 S >= M。
* 异或操作数学符号为 $\oplus$。

## 1. Thread Block Swizzle ##

由于 CUDA 调度实际上是以 block id 的顺序进行调度的，有时候，通过对 thread block 映射的　tile 进行重新排序，最大限度的利用 L2 cache 中个的数据，提升性能。

![thread block swizzle 逻辑示意](/assets/images/cuda/20250226/cute_swizzle/thread_block_swizzle.jpg)

> Thread block swizzle，以及 block 调度顺序，见 github issue：[[QST]how to understand "block swizzling"](https://github.com/NVIDIA/cutlass/issues/1017)

> 关于使用 thread block swizzle 复用 L2 cache，见 NVIDIA 博客[Optimizing Compute Shaders for L2 Locality using Thread-Group ID Swizzling](https://developer.nvidia.com/blog/optimizing-compute-shaders-for-l2-locality-using-thread-group-id-swizzling/)。

## 2. Cute Swizzle 示例 ##

定义 layout (8, 32):(32, 1)，定义swizzle<3, 3, 3>。代码如下：

```python
from cutlass import cute
from cute_viz import render_layout_svg

@cute.jit
def test_swizzle_layout():
    layout_2d = cute.make_layout((8, 32), stride=(32, 1))
    sw = cute.make_swizzle(3, 3, 3) # 参数顺序：b=3, m=3, s=3
    swizzled_layout = cute.make_composed_layout(sw, 0, layout_2d)
    render_layout_svg(layout_2d, "out/original_layout.svg")
    render_layout_svg(swizzled_layout, "out/swizzled_layout.svg")

test_swizzle_layout()
```

结果如下：

![swizzle_8_32_3_3_3](/assets/images/cuda/20250226/cute_swizzle/swizzle_result_8_32_3_3_3.svg)

## A. 参考资料 ##

* [cute 之 Swizzle](https://zhuanlan.zhihu.com/p/671419093)：来自知乎 Reed 文章
* [Tensor Core MMA Swizzle Layout](https://yang-yifan.github.io/blogs/mma_swizzle/mma_swizzle.html)：来自 Yang Yifan 博客。**待学习**
* [CuTe Swizzle](https://leimao.github.io/blog/CuTe-Swizzle/)：来自 Lei Mao 博客，其中段落`Vectorized Memory Access`讲述如何设计连续内存访问的 swizzle 参数。**待学习**

### A.1. 其他资料 ###

* [github CUDA-Learn-Notes](https://github.com/DefTruth/CUDA-Learn-Notes/blob/main/kernels/hgemm/cutlass/hgemm_mma_stage_tn_cute.cu#L224)：很多学习用的 kernel 代码
