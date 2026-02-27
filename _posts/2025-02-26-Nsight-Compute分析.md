---
layout: post
title: 使用 Nsight Compute 进行 kernel 性能分析
date: 2025-02-26 +1200
categories: [CUDA]
tags: [CUDA, Nsight Compute]

# 以下默认false
math: true
mermaid: true
# pin: true

toc:
  sidebar: right
---

- [github -- 测试代码](https://github.com/HPC02/cuda_perf/blob/master/src/cute_gemm/gemm_tile_naive_cute.cu)

编译时，加上 `-lineinfo` 参数，Nsight Compute 分析时，可以看到具体的 C++/cu 代码。

## 1. 查看 Warp State Statistics

Warp State Statistics 表征从执行/issue当前指令到执行/issue下一条指令之间的周期数。导致指令周期长的原因有多种，比如等待内存访问、指令流水线Stall等（一个方法是需要更多 warp 来掩盖指令延迟）。见官方文档<https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#sections-and-rules> 并搜索 Warp State Statistics。

在 Warp State 图表中，有一个 Stall MIO Throttle 项，表示由于内存访问延迟，导致的指令 Stall：

![nsight_warp_state_statistics](/assets/images/cuda/20250226/nsight_compute/Warp_State_Statistics.png)

## 2. Bank Conflicts 分析

在 Memory Workload Analysis 这一节中，性能指标 Shared Load 这一行中，有如下几列，其含义如下表：

| 项目         | 解释                                                   |
| ------------ | ------------------------------------------------------ |
| Instructions | GMEM -> SMEM Load 指令总数                             |
| Requests     | GMEM -> SMEM Load 请求数，每条指令都会生成一个 Request |
| Wavefronts   | Wavefront 数量，一个 Wavefront 覆盖 128 字节数据       |

所以只要看 Requests / Wavefronts （>=1）比例，越低表示 Bank Conflicts 越多。从下图看，这两个值接近，即几乎 Warp 内每个线程之间都有 Bank Conflicts。

![nsight_shared_memory_load](/assets/images/cuda/20250226/nsight_compute/detail_memory_workload_analysis_shared_memory.png)

下一步，就是源码定位：

![nsight_source_viewer](/assets/images/cuda/20250226/nsight_compute/bank_conflict_source_view.png)

从左侧源码定位到 copy.hpp 文件中的 copy 函数，从右侧的汇编信息看到是 GMEM 加载，从右下角的窗口看其调用栈，最终定位到源码的第 144 行：

![nsight_call_stack](/assets/images/cuda/20250226/nsight_compute/test_source_bank_conflict.png)

查看 Bank Conflicts 是否严重，从 GPU Speed of Light 节中，查看 L1/TEX Cahce(%) 是否比较高，具体参考论坛帖子：[Shared memory bank conflicts and nsight metric](https://forums.developer.nvidia.com/t/shared-memory-bank-conflicts-and-nsight-metric/115731)。

相关资料：

- [Requests, Wavefronts, Sectors Metrics: Understanding and Optimizing Memory-Bound Kernels with Nsight Compute](https://www.nvidia.com/en-us/on-demand/session/gtcspring21-s32089/)。视频资料。
