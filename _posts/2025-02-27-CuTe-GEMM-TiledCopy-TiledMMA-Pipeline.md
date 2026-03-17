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

达到峰值的`37.66 / 51 = 73.84%`。
