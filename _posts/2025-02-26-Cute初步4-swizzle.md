---
layout: post
title: CUTLASS-Cute 初步(4)：Swizzle
date: 2025-02-26 +1100
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

给定 layout 范围内，swizzle 通过列异或操作（icol = irow ^ icol），周期性的 coord 重排，映射到新的物理地址 offset。swizzle 定义了三个参数：

* M：以 $2^M$ 个一维坐标连续的元素为单位，将其当做一个元素；
* S：控制行号、列号提取的低位偏移；
* B：参与 XOR 的位数，即掩码位数，用于提取一维 index 中的行号、列号中的部分位。

引用reed解释及图示，其输入为一个一维坐标的 layout，通过 swizzle 将其拆分为二维坐标表示形式：

![swizzle 逻辑示意](/assets/images/cuda/20250226/cute_swizzle/swizzle_logic.jpg)

> 一般在设置 swizzle 参数时，按输入的 layout 一行为周期进行 swizzle，$2^{S+M}$ = 输入 layout 的列长度。比如 half 类型的 layout (8, 32):(32, 1)，定义swizzle<3, 3, 3>，即 8 个元素形成新的最小单位（M），8 个最小单位为一行（S），所以 swizzle 从$8 \times 8 = 64$个元素开始。见下面示例。B 为 8，则整个 swizzle 周期为 8 行。

* 设计 swizzle 参数时，要求 S >= B，即将掩码的源与目标分开（否则重合）。
* 异或操作数学符号为 $\oplus$。

## 1. Cute Swizzle 示例 ##

定义 layout (8, 32):(32, 1)，定义swizzle<3, 2, 3>，即 $2^{3+2}$ = 32（输入layout列宽）。代码如下：

```python
from cutlass import cute
from cute_viz import render_layout_svg, render_swizzle_layout_svg

@cute.jit
def test_swizzle_layout():
    layout_2d = cute.make_layout((8, 32), stride=(32, 1))
    sw = cute.make_swizzle(3, 2, 3)
    swizzled_layout = cute.make_composed_layout(sw, 0, layout_2d)
    render_layout_svg(layout_2d, "out/original_layout.svg")
    render_swizzle_layout_svg(swizzled_layout, "out/swizzled_layout.svg")

test_swizzle_layout()
```

结果如下：

![swizzle_8_32_3_3_3](/assets/images/cuda/20250226/cute_swizzle/swizzle_8_32_3_2_3_result.svg)

## 2. Swizzle 逻辑及规律 ##

```cpp
class Swizzle {
 public:
  Swizzle(int num_bits, int num_base, int num_shft) : m_num_bits(num_bits), m_num_base(num_base), m_num_shft(num_shft) {
    CHECK2(m_num_bits >= 0, "BBits must be positive.");
    CHECK2(m_num_base >= 0, "MBase must be positive.");
    CHECK2(std::abs(m_num_shft) >= m_num_bits, "abs(SShift) must be more than BBits.");
  }

  template <class Offset>
  auto apply(Offset offset) const noexcept {
    return offset ^ shiftr(offset & m_yyy_msk);  // ZZZ ^= YYY
  }

  template <class Offset>
  auto operator()(Offset offset) const noexcept {
    return apply(offset);
  }

 private:
  template <class Offset>
  auto shiftr(Offset offset) const noexcept {
    return m_msk_sft >= 0 ? offset >> m_msk_sft : offset << -m_msk_sft;
  }

  int m_num_bits;
  int m_num_base;
  int m_num_shft;

  int m_bit_msk = (1 << m_num_bits) - 1;
  int m_yyy_msk = m_bit_msk << (m_num_base + std::max(0, m_num_shft));
  int m_zzz_msk = m_bit_msk << (m_num_base - std::min(0, m_num_shft));
  int m_msk_sft = m_num_shft;
};
```

* m_zzz_msk 没有参与 swizzle计算，在 CuTe 库中用作检查作用。

Swizzle 根据参数 BBits、SShift，生成 offset 的掩码：高位部分提取掩码 yyy_msk、低位部分提取 zzz_msk，即分别对应行提取掩码、列提取掩码。此时，可以将 MBase 看作是 BBits 的一部分。直观展示如下：

```text
                 bits       bits
                  --         --
0bxxxxxxxxxxxxxxxxYYxxxxxxxxxZZxxx
                    <--------->--- 
                       shift   base
```

针对每个 offset，swizzle之后，异或更新低位掩码对应的值：

```text
0bxxxxxxxxxxxxxxxxYYxxxxxxxxxAAxxx
其中 AA = ZZ ^ YY。
```

### 2.1. Swizzle 参数影响规律分析 ###

分别以行混淆周期，以及列混淆周期，这两个层次来分析。

以一个 layout (32, 16):(16, 1) 为例，分析 swizzle<B=4, M=0, S=4> 参数变动对结果的影响规律。

经过 offset & yyy_msk 提取行号低四位（以及 shiftr 操作得到最终行号提取掩码），得到第 0 行、第 16 行（0x10）由于行号掩码提取过后的低 4 位为 0，导致 swizzle 无效。

#### 2.1.1. B 参数对周期的影响 ####

如果使用 swizzle<B=3, M=0, S=4>，导致高位掩码提取行号的低三位，行号为 0、8、16、24 时，得到的高位 YY 部分均为 0，swizzle 异或操作不生效。

如果设 S = 3，则 layout 的左半部分（列 0 ~ 8）呈现 0、8、16、24 的行混淆周期。右半部分暂没有理清规律。

#### 2.1.2. S 参数以及列长度对周期的影响 ####

如果使用 S = 5，行号提取范围扩大到 32，由于 layout 的行号、列号范围对应掩码为 4 位，导致的结果为行号有效的掩码位为 0bxxxx0 >> 1，即最低一位被丢弃，且有效的掩码位为 4 位（注意 shiftr 的实现是提取高位之后右移 S 位）。最终的规律为：第 0、1 行维持不变，行周期变为 32 行，即第32、33行维持不变。中间的行，则每两行异或计算结果一致，即如果应用于解决 bank conflicts，此时只能消除一半的 bank conflicts。

## 2.2. 测试代码 ###

```python
from cutlass import cute
from cute_viz import render_swizzle_layout_svg

@cute.jit
def test_swizzle_layout():
    layout_2d = cute.make_layout((32, 16), stride=(16, 1))
    sw = cute.make_swizzle(4, 0, 4)
    swizzled_layout = cute.make_composed_layout(sw, 0, layout_2d)
    # render_layout_svg(layout_2d, "out/original_layout.svg")
    render_swizzle_layout_svg(swizzled_layout, "out/swizzled_layout.svg")

test_swizzle_layout()
```

## 2. Swizzle 参数设计规则 ##

假定矩阵每个元素大小为 S-byte，向量化访问的宽度为 N 个元素，shared memory 的 fast dimension 为 X 个元素。即：

| 符号   | 含义                      |
| ------ | ------------------------- |
| S_elem | 每个元素的大小（bytes）   |
| N      | 向量化访问的元素个数      |
| X      | Fast dimension 的元素个数 |

$\text{MBase} = log_{2}\text{N}$，即向量化访问的元素个数。

$\text{SShift} = log_{2}\text{X} - \text{MBase}$，即 X = $2^{\text{MBase} + \text{SShift}}$，这样使得针对每一行的 swizzle 操作，掩码偏移对齐到行号的位置。即，将提取行号的掩码分为两部分：低 MBase 位不参与 swizzle，高 SShift 位参与 swizzle。

$\text{BBits} = log_{2}\text{(32 * 4 / S)} - \text{MBase}$。其原因为要确保 BBits 对应覆盖一次 shared memory 的访问字宽：128 字节，即 $\text{S} \times 2^\text{MBase + BBits}$ = 32 * 4 = 128B。

> 即要求 32 个连续的 word 地址，经过 swizzle 之后，分别落入 shared memory 的32个 bank 中。

### 2.1. Swizzle 参数设计示例１ ###

假定 half 类型（S_elem = 2 bytes）行主序矩阵，矩阵大小为 8 * 64。采用 128-bit 向量化访问指令，即每次访问 8 个 half 元素（4 个 word）。

MBase = log2(8) = 3。

SShift = log2(64) - MBase = 6 - 3 = 3。即其约束在于 shared memory 的 fast dimension 为 64 个元素，即掩码偏移量为 fast dimension 长度。

BBits = log2(32 * 2) - MBase = 6 - 3 = 3。即要求 32 个连续的 word 地址，经过 swizzle 之后，分别落入 shared memory 的32个 bank 中。

最终，得到 swizzle<3, 3, 3>。

## 3. Thread Block Swizzle ##

由于 CUDA 调度实际上是以 block id 的顺序进行调度的，有时候，通过对 thread block 映射的　tile 进行重新排序，最大限度的利用 L2 cache 中个的数据，提升性能。

![thread block swizzle 逻辑示意](/assets/images/cuda/20250226/cute_swizzle/thread_block_swizzle.jpg)

> Thread block swizzle，以及 block 调度顺序，见 github issue：[[QST]how to understand "block swizzling"](https://github.com/NVIDIA/cutlass/issues/1017)

> 关于使用 thread block swizzle 复用 L2 cache，见 NVIDIA 博客[Optimizing Compute Shaders for L2 Locality using Thread-Group ID Swizzling](https://developer.nvidia.com/blog/optimizing-compute-shaders-for-l2-locality-using-thread-group-id-swizzling/)。

## A. 参考资料 ##

* [cute 之 Swizzle](https://zhuanlan.zhihu.com/p/671419093)：来自知乎 Reed 文章
* [Tensor Core MMA Swizzle Layout](https://yang-yifan.github.io/blogs/mma_swizzle/mma_swizzle.html)：来自 Yang Yifan 博客。**待学习**
* [CuTe Swizzle](https://leimao.github.io/blog/CuTe-Swizzle/)：来自 Lei Mao 博客，其中段落`Vectorized Memory Access`讲述如何设计连续内存访问的 swizzle 参数。
* [CUDA 013 - Swizzle 的工作原理](https://wangyu.me/posts/cuda/swizzle/)：网页版 swizzle 可视化
* [SwizzleVis](https://github.com/LRlr239/SwizzleVis)：Python 实现的 swizzle 可视化工具，网页查看结果

### A.1. 其他资料 ###

* [github CUDA-Learn-Notes](https://github.com/DefTruth/CUDA-Learn-Notes/blob/main/kernels/hgemm/cutlass/hgemm_mma_stage_tn_cute.cu#L224)：很多学习用的 kernel 代码
