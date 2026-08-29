---
layout: post
title: Ampere GPU 新特性
date: 2025-02-28 +0900
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true

toc:
  sidebar: right
---

## 1. Async Copy

![ampere_async_copy](/assets/images/cuda/20250228/ampere_async_copy.png)

异步拷贝`cp.async`（即指令`LDGSTS`）支持`4`/`8`/`16`字节单位的拷贝，其中：

- `4`/`8`字节单位的拷贝：`L2` -> `L1` -> `SMEM`；
- `16`字节单位的拷贝(`Bypass L1`)：`L2` -> `SMEM`。

明显的，`16`字节单位的拷贝性能最高。

另外，`cp.async`需要使用`commit`/`wait`指令来配合使用。

## A. 资料

- [4.11. Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html#asynchronous-data-copies)：官方文档，介绍cp.async
- [CUDA 11 NEW FEATURES(pdf)](/assets/pdf/cuda/arch/CNS20940-CUDA-11-NEW-FEATURES.pdf)：Ampere 新特性介绍
- [CUDA on NVIDIA GPU AMPERE MICROARCHITECTURE Taking your algorithms to the next level of performance(pdf)](/assets/pdf/cuda/arch/s21170-cuda-on-nvidia-ampere-gpu-architecture-taking-your-algorithms-to-the-next-level-of-performance.pdf)
