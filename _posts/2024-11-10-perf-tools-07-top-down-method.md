---
title: perf性能分析(7) -- Top-down 分析方法
date: 2024-11-10 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [perf]
tags: [perf, vtune]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

现代性能分析，使用针对`pipeline`的分析办法(取代`CPU cycles`分析)。这源于现代`CPU`架构的复杂性。

现代`CPU`处理指令架构，分为`前端 Front-end`，`后端 Back-end`两部分。阻碍指令执行的因素，从硬件看，源于`前端`或`后端`的`Stall`。

## 1. CPU 流水线 ##

![intel_five-stage-pipeline](/assets/images/perf/20241110-top-down-method/intel_basic_five-stage_pipeline.webp)

Intel `CPU`流水线一般分为5级。其中解码(`ID`)，意思是将指令操作分解为多个`uOp`(即拆分为多个更低级的硬件操作)，如`ADD eax, [mem1]`，可以拆分成两个微指令：从内存读取数据，再执行`ADD`操作。

## 2. CPU 架构及流水线的执行过程 ##

执行过程：`前端`执行完`IF` -> `ID`之后，然后在一个名为`allocation`的过程中，`uOps`被输送到`后端`。`后端`监控`uOp`的操作数(`data operand`)何时可用，并在可用的执行单元中执行`uOps`。
当`uOp`执行完成之后，称之为执行完成(`retirement`)，且`uOp`的结果被写会寄存器或者内存。

大多数`uOps`都会完全通过流水线并退出，但有些投机指令`uOps`可能会在退出前被取消--如预测错误的分支。

![cpu_micro_arch](/assets/images/perf/20241110-top-down-method/CPU-micro-arch.png)

在处理器架构中，有一个抽象概念：`pipeline slot`，即`执行端口`。在Intel处理器中，一个`core`一般有四个执行端口，即每个`cycle`最多可以执行四个`uOps`。`VTune`在`allocation`阶段，可以测量`pipeline slot`的利用率(星号标注的地方)。

## 3. Top-down 分析方法 ##



## 资料 ##

* [自顶向下的微架构分析方法](https://www.intel.cn/content/www/cn/zh/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html)
* [Top-down Microarchitecture Analysis Method](https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html)
* [pdf -- A Top-Down Method for Performance Analysis and Counters Architecture](/assets/pdf/perf/perf_docs_20241110/A%20Top-Down%20Method%20for%20Performance%20Analysis%20and%20Counters%20Architecture.pdf)
* [C/C++ 性能优化背后的方法论：TMAM](https://www.cnblogs.com/vivotech/p/14547399.html)
* [调优指南: Xeon E5 v3](https://zzqcn.github.io/perf/intel_vtune/tunning_guide_e5v3.html)
* [pdf -- intel lectures: Intel_VTune_Amplifier-jackson](/assets/pdf/perf/perf_docs_20241110/Intel_VTune_Amplifier-jackson.pdf)
* [EE357Unit18_Pipelining_Notes](/assets/pdf/perf/perf_docs_20241110/EE357Unit18_Pipelining_Notes.pdf)