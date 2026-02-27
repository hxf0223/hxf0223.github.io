---
layout: post
title: 使用Nsight Compute分析Bank Conflict
date: 2025-02-25 +0800
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

测试用例：[github -- cuda_perf](https://github.com/HPC02/cuda_perf)

## 1. 启动配置 ##

使用`Nsight Compute`运行被测试`CUDA`程序，启动时，指定`metrics`为`full`：

![nsight-compute-metrics-full](/assets/images/cuda/20250225/nsight-compute-start-activity.png)

## 2. 分析Bank Conflicts ##

被测试`CUDA`程序运行结束后，打开`Nsight Compute`的结果页面（`Details`），进入`Memory Workload Analysis`章节，在章节标题右侧，选择`Memory Tables`，查看`Shared Memory`部分：

![nsight-compute-shared-memory-bank-conflict](/assets/images/cuda/20250225/nsight-compute-memory-workload-analysis-bank-conflicts.png)

`Details`页面里显示的`Shared Memory`的`Bank Conflicts`信息，由于其测量数据来源于硬件计数器，还可能包括`仲裁冲突`(`arbitration conflicts`)：

* `LDGSTS`的`Fill Return`（全局/共享内存加载的返回数据）
* `TMA`的`Fill Return`（Tensor Memory Accelerator的返回数据）
* `Tensor Core`对共享内存的读取

使用`Source`页面的`L1 Wavefonts Shared Excessive`结果，应该更准确：

![nsight-compute-source-l1-wavefronts-shared-excessive](/assets/images/cuda/20250225/nsight-compute-bank-conflict-source-page-l1-wavefronts-shared-excessive.png)

两个页面分析结果为什么会有差异？

| 指标         | 数据来源   | 测量内容                 | 用途         |
| ------------ | ---------- | ------------------------ | ------------ |
| Details Page | 硬件计数器 | Bank Conflict + 仲裁冲突 | 实际性能影响 |
| Source Page  | 代码分析   | 纯粹的 Bank Conflict     | 代码优化     |

如何识别可优化的Bank Conflict：

* 使用源页面（Source View）的Excessive计数器
* 这些是由地址发散和真实的Bank Conflict引起的
* 这些可以通过代码优化来消除

哪些冲突无法修复：

* 详情页面中显示的仲裁冲突无法通过代码优化解决
* 这些是系统级别的问题（Tensor Core、TMA、全局内存的更高优先级访问）
* 这些是硬件行为的自然结果

## 3. 参考资料 ##

* [Questions on L1 Bank Conflict statistic discrepancies between Details and Source pages](https://forums.developer.nvidia.com/t/nsight-compute-h100-questions-on-l1-bank-conflict-statistic-discrepancies-between-details-and-source-pages/351780)
* [Shared memory bank conflicts and nsight metric](https://forums.developer.nvidia.com/t/shared-memory-bank-conflicts-and-nsight-metric/115731)
