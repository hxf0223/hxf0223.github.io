---
layout: post
title: perf性能分析(7) -- Top-down 分析方法
date: 2024-11-10 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Performance]
tags: [Performance, VTune]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

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

从性能分析的角度看，一条微指令在流水线中的性能指标可以分为：

* 退出(`Retiring`) -- `Micro Sequencer`(微指令调度器)可能会成为瓶颈，例如调度浮点指令。
* 分支预测错误(`Bad Speculation`) -- 分支预测错误，或者`memory ordering violation`(多核多线程共享数据情形)，导致`Machine Clears`(清除流水线)。
* 前端瓶颈(`Front-End Bottleneck`)
* 后端瓶颈(`Back-End Bottleneck`)

![top-down-hierarchy](/assets/images/perf/20241110-top-down-method/The_Top-Down_Analysis_Hierarchy.png)

顶级分类分析步骤：

![top_level_breakdown_flowchart](/assets/images/perf/20241110-top-down-method/top_level_breakdown_flowchart.png)

### 3.1 `Frontend Bound` -- 前端瓶颈 ###

前端主要职责为读取指令，解码之后，发送给后端。遇到分支指令，需要经过预测器预测下一个指令的地址，这意味着会出现由于分支预测错误导致的`ICache Miss`而引起前端阻塞。

### 3.2 `Back-End Bound` -- 后端瓶颈 ###

后端主要职责为执行指令，包括`ALU`、`FPU`、`Memory`等。后端瓶颈分为：

* `Core Bound`
* `Memory Bound`

如`D Cache Miss`，浮点除法器过载，指令依赖、数据依赖等。

## 4. 一些优化手段 ##

### 4.1 `Frontend` ###

1. 减少代码的`footprint`，如`-fomit-frame-pointer`
2. 调整代码布局：如是用`-fprofile-generate -fprofile-use`
3. 调整代码布局：如用`__attribute__((hot))`
4. 分支预测优化：如`loop unrolling`，特别是小的循环，如小于64次循环
5. 分支预测优化：是用`if`代替三目运算符；避免`if-elses`结构，`switch-case`排序

### 4.2 `Back-End` ###

1. 减少`function call`，如`inline`
2. 多线程避免`false-sharing`，使用内存对齐
3. gcc优化：如`__builtin_expect`

### 4.3 示例 ###

```c++
#define likely(x) __builtin_expect(!!(x), 1) //gcc内置函数, 帮助编译器分支优化
 #define unlikely(x) __builtin_expect(!!(x), 0)
  
 if(likely(condition)) {
   // 这里的代码执行的概率比较高
 }
 if(unlikely(condition)) {
  // 这里的代码执行的概率比较高
 }
```

```c++
#define CACHE_LINE __attribute__((aligned(64)))

struct S1 {
    int r1;
    int r2;
    int r3;
    S1(): r1(1),r2(2),r3(3){}
  } CACHE_LINE;
```

## 5. Hazard 介绍 ##

### 5.1 StructuralHazards -- 结构性冲突 ###

结构性冲突本质是`CPU`中硬件资源的竞争，比如流水线中，前后指令之间都需要经过译码器，访问内存，形成对译码器的争用。

### 5.2 DataHazards -- 数据依赖 ###

五级流水线：取指`IF` -> 解码`ID` -> 执行`EX` -> 内存访问`MEM` -> 写回`WB`。

`Data Hazard`是指后一条指令的操作数，依赖于前一条指令的结果。操作数依赖分为三种关系：

* 先写后读(`Write-after-Read`) -- `Data Denpendency`
* 先读后写(`Read-after-Write`) -- `Anti-Dependency`
* 写后写(`Write-after-Write`) -- `Output Dependency`

`CPU`处理`Data Hazard`办法有两种：

* 插入`NOP`指令，流水线停顿(`Pipeline Stall`)，或者叫流水线冒泡(`Pipeline Bubbling`)。
* `Operand Forwarding` -- 操作数转发。

`Operand Forwarding`：在第一条指令的执行阶段完成之后，直接将结果数据传输给到下一条指令的 `ALU`。然后，下一条指令不需要再插入两个 `NOP` 阶段，就可以继续正常走到执行阶段。这样的解决方案，我们就叫作操作数前推(`Operand Forwarding`)，或者操作数旁路(`Operand Bypassing`)。其实更合适的名字应该叫操作数转发。这里的 Forward，其实就是我们写 Email 时的“转发”（Forward）的意思。

![pipeline_bubbling](/assets/images/perf/20241110-top-down-method/pipeline-bububle.jpg)
![operand_forwarding](/assets/images/perf/20241110-top-down-method/operand-forwarding.jpg)

### 5.3 ControlHazards -- 控制依赖 ###

主要使用分支预测。

### 5.4 流水线 -- 乱序执行 ###

![instruction_out_of_order](/assets/images/perf/20241110-top-down-method/pipeline_out-of-order_execution.jpg)

更详细资料：[cnblogs -- 计算机组成原理——原理篇 处理器（中）](https://www.cnblogs.com/wwj99/p/12830844.html)

## 资料 ##

* [自顶向下的微架构分析方法](https://www.intel.cn/content/www/cn/zh/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html)
* [Top-down Microarchitecture Analysis Method](https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html)
* [pdf -- A Top-Down Method for Performance Analysis and Counters Architecture](/assets/pdf/perf/perf_docs_20241110/A%20Top-Down%20Method%20for%20Performance%20Analysis%20and%20Counters%20Architecture.pdf)
* [cnblogs --C/C++ 性能优化背后的方法论：TMAM](https://www.cnblogs.com/vivotech/p/14547399.html)
* [调优指南: Xeon E5 v3](https://zzqcn.github.io/perf/intel_vtune/tunning_guide_e5v3.html)
* [pdf -- intel lectures: Intel_VTune_Amplifier-jackson](/assets/pdf/perf/perf_docs_20241110/Intel_VTune_Amplifier-jackson.pdf)

## 更多阅读 ##

* [译：内存分析](https://weedge.github.io/post/cpu/memory_profiling/)
* [pdf -- perf books cn -- 第二部分：源代码优化](/assets/pdf/perf/perf_docs_20241110/perf-book-cn.pdf)


