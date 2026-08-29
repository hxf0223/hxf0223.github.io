---
layout: post
title: perf性能分析(7) -- Top-down 分析方法及VTune工具
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

## 1. CPU 流水线

![intel_five-stage-pipeline](/assets/images/perf/20241110-top-down-method/intel_basic_five-stage_pipeline.webp)

Intel `CPU`流水线一般分为5级。其中解码(`ID`)，意思是将指令操作分解为多个`uOp`(即拆分为多个更低级的硬件操作)，如`ADD eax, [mem1]`，可以拆分成两个微指令：从内存读取数据，再执行`ADD`操作。

## 2. CPU 架构及流水线的执行过程

执行过程：`前端`执行完`IF` -> `ID`之后，然后在一个名为`allocation`的过程中（下图中星标处），`uOps`被输送到`后端`。`后端`监控`uOp`的操作数(`data operand`)何时可用，并在可用的执行单元中执行`uOps`。

当`uOp`执行完成之后，称之为执行完成(`retirement`)，且将`uOp`的结果被写会寄存器或者内存（经过`Store Buffer`写入内存）。

大多数`uOps`都会完全通过流水线并退出，但有些投机指令`uOps`可能会在退出前被取消--如预测错误的分支。

![cpu_micro_arch](/assets/images/perf/20241110-top-down-method/CPU-micro-arch.png)

在Intel处理器中，一个`core`一般有四个执行端口，即每个`cycle`最多可以执行四个`uOps`。

在处理器架构中，有一个抽象概念：`pipeline slot`（`流水线槽`），用来表示用于执行一个`uOp`所需要的硬件资源。在每个时钟周期，有四个`流水线槽`可用，`流水线槽`可以是空的，也可以是被`uOp`填充。`流水线槽`在`Allocation`阶段（上图中的星号标记处），将`uOp`从前端分配到后端执行单元。

`PMU`监控`流水线槽`的状态，在每个时钟周期，衡量`流水线槽`的利用率（是否填充有`uOp`），并对`流水线槽`进行分类，确定是前端瓶颈还是后端瓶颈。

## 3. Top-down 分析方法

从性能分析的角度看，一条微指令在流水线中的性能指标可以分为：

- 退出(`Retiring`) -- `Micro Sequencer`(微指令调度器)可能会成为瓶颈，例如调度浮点指令。
- 分支预测错误(`Bad Speculation`) -- 分支预测错误，或者`memory ordering violation`(多核多线程共享数据情形)，导致`Machine Clears`(清除流水线)。
- 前端瓶颈(`Front-End Bottleneck`)
- 后端瓶颈(`Back-End Bottleneck`)

`Top-down`分析思想根据上述的流水执行阶段及过程，首先从Top-level分类分析步骤：

![top_level_breakdown_flowchart](/assets/images/perf/20241110-top-down-method/top_level_breakdown_flowchart.png)

然后，继续细分（Breakdown），确定是哪个阶段中的哪个资源导致的`stall`：

![top-down-hierarchy](/assets/images/perf/20241110-top-down-method/The_Top-Down_Analysis_Hierarchy.png)

> 相比以前基于事件的度量的方式，基于`Top-down`分析方法，可以更准确地定位性能瓶颈的根源，指导开发者进行针对性的优化。

### 3.1. `Frontend Bound` -- 前端瓶颈

前端主要职责为读取指令，解码之后，发送给后端。遇到分支指令，需要经过预测器预测下一个指令的地址，这意味着会出现由于分支预测错误并清除流水线导致的`ICache Miss`而引起前端阻塞。

而在取指/解码过程中，如果代码的局部性不好，由于`ICache Miss`，或者`iTLB Miss`，引起前端`Stall`。过高的`miss`率导致前端瓶颈。

> `L1/L2 Cache`分为`DCache`和`ICache`。`TLB`也分为`iTLB`、`dTLB`和`Second-Level TLB`，地址从`iTLB`/`dTLB`中找不到则再从`Second-Level TLB`中查找。

### 3.2. `Back-End Bound` -- 后端瓶颈

后端主要职责为执行指令，包括`ALU`、`FPU`、`Memory`等。后端瓶颈分为：

- `Core Bound`
  - 除法指令过多，因为除法指令执行时间长；
  - `Execution Port Utilzation`过高，导致执行单元饱和；
  - 指令的数据依赖，即依赖上一个指令的结果，导致`Stall`；
- `Memory Bound`
  - `L1/L2/L3 Cache Miss`引起的`Stall`，需要改进数据访问的局部性，或者减小数据的访问规模（如分块处理数据），或者`False-Sharing`引起的`Cache Miss`；
  - `Memory Bound`：分为`Memory BandWidth`和`Memory Latency`，前者是指内存带宽不足，后者是指内存访问延迟过高；

### 3.3. 优化指令的处理能力（Throughput）

例如，改用向量指令（如`AVX`）。或者使用更高效的算法。

## 4. 一些优化手段

### 4.1. `Frontend`

1. 减少代码的`footprint`，如`-fomit-frame-pointer`
2. 调整代码布局：如是用`-fprofile-generate -fprofile-use`
3. 调整代码布局：如用`__attribute__((hot))`
4. 分支预测优化：如`loop unrolling`，特别是小的循环，如小于64次循环
5. 分支预测优化：是用`if`代替三目运算符；避免`if-elses`结构，`switch-case`排序

### 4.2. `Back-End`

1. 减少`function call`，如`inline`
2. 多线程避免`false-sharing`，使用内存对齐
3. gcc优化：如`__builtin_expect`

### 4.3. 示例

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

## 5. Hazard 介绍

### 5.1. StructuralHazards -- 结构性冲突

结构性冲突本质是`CPU`中硬件资源的竞争，比如流水线中，前后指令之间都需要经过译码器，访问内存，形成对译码器的争用。

### 5.2. DataHazards -- 数据依赖

五级流水线：取指`IF` -> 解码`ID` -> 执行`EX` -> 内存访问`MEM` -> 写回`WB`。

`Data Hazard`是指后一条指令的操作数，依赖于前一条指令的结果。操作数依赖分为三种关系：

- 先写后读(`Write-after-Read`) -- `Data Denpendency`
- 先读后写(`Read-after-Write`) -- `Anti-Dependency`
- 写后写(`Write-after-Write`) -- `Output Dependency`

`CPU`处理`Data Hazard`办法有两种：

- 插入`NOP`指令，流水线停顿(`Pipeline Stall`)，或者叫流水线冒泡(`Pipeline Bubbling`)。
- `Operand Forwarding` -- 操作数转发。

`Operand Forwarding`：在第一条指令的执行阶段完成之后，直接将结果数据传输给到下一条指令的 `ALU`。然后，下一条指令不需要再插入两个 `NOP` 阶段，就可以继续正常走到执行阶段。这样的解决方案，我们就叫作操作数前推(`Operand Forwarding`)，或者操作数旁路(`Operand Bypassing`)。其实更合适的名字应该叫操作数转发。这里的 Forward，其实就是我们写 Email 时的“转发”（Forward）的意思。

![pipeline_bubbling](/assets/images/perf/20241110-top-down-method/pipeline-bububle.jpg)
![operand_forwarding](/assets/images/perf/20241110-top-down-method/operand-forwarding.jpg)

### 5.3. ControlHazards -- 控制依赖

主要使用分支预测。

### 5.4. 流水线 -- 乱序执行

![instruction_out_of_order](/assets/images/perf/20241110-top-down-method/pipeline_out-of-order_execution.jpg)

更详细资料：[cnblogs -- 计算机组成原理——原理篇 处理器（中）](https://www.cnblogs.com/wwj99/p/12830844.html)

## 6. 使用VTune工具进行Top-down分析

对一个应用程序进行profile，一般首先使用`Hotspots`，获取测量得到的分类性能指标。以官方matrix_mul示例为例（以Windows为例，VTune自带样例的路径为`C:\Users\Administrator\Documents\VTune\Samples`）：

![demo_hotspots](/assets/images/perf/20241110-top-down-method/demo_matrix_mul_hotspots.png)
![demo_hotspots_vec](/assets/images/perf/20241110-top-down-method/demo_matrix_mul_hotspots_vectorization.png)

然后，使用`Microarchitecture Exploration`，再次进行测试。测试完成之后，在`Bottom-up`页面查看`Top-down Tree`，获取更细粒度的性能指标：

![demo_top_down_tree](/assets/images/perf/20241110-top-down-method/demo_matrix_mul_micro_arch_bottom_up.png)
![demo_top_down_tree_frontend_backend_zoomin](/assets/images/perf/20241110-top-down-method/demo_matrix_mul_micro_arch_bottom_up_zoomin_frontend_backend.png)
![demo_top_down_tree_backend_zoomin2](/assets/images/perf/20241110-top-down-method/demo_matrix_mul_micro_arch_bottom_up_zoomin2_backend.png)

> 1. 下图为局部展开的`Front-End Bound`、`Back-End Bound`。
> 2. 从图中看，`Front-End Bound`为`44.0%`，即`流水线槽`（`Pipeline Slot`）由于前端没能及时提供指令而产生`44.0%`的空闲。
> 3. `Back-End Bound`为`100.0%`，意味着后端由于内存带宽限制、指令的数据依赖（比如指令依赖上一条指令的计算结果）、`L1/L2/L3`缓存访问延迟严重，或者执行单元饱和，导致流水线停顿。
> 4. 综合前后端的瓶颈分析，前端应该是由于后端的瓶颈导致的。

### 6.1. Back-End Bound

在`Top-down`的顶层分类中，使用`流水线槽`（`Pipeline-Slot`）来测量瓶颈：`Front-End Bound`、`Back-End Bound`、`Bad Speculation`、`Retiring`。在深入到`Back-End`之后，使用`PMU`来测量后端的性能指标值，比如测量一个指令的时钟周期或者事件，进而度量其`Stall`来源并算比例值。其测量值，与使用`流水线槽`度量及计算得到的值会有差异。

另外，`Back-End Bound`又分为两个子类：`Memory Bound`与`Core Bound`，分别度量来自内存/Cache的`Stall`，以及来自`Execution Port`的`Stall`。

### 6.2. 微架构优化方法

在进行性能优化的时候，一般关注应用程序的顶层热点函数，即占用CPU最多的函数。`VTune`工具展示的profile结果也是**热点 + 层次定位**，比如`Bottom-up`页面，可以按照占用CPU时间排序查看，即查看热点函数以及其耗时占比。

按照最优优化顺序，首先优化程序算法，以及并行化，即优化大头。之后，再进行微架构性能`profile`，并按照`Top-down`方法，针对性的优化瓶颈。

在Top-down视图中，`VTune`会高亮显示`Top-down`分类中的瓶颈类型（如上面`Bottom-up`页面所示）。下表给出了不同分类应程序，其`Top-down`分类中各指标的合理范围，超出该范围`5%`则在`VTune`的`profile`结果页面中高亮显示：

![top_down_threshold](/assets/images/perf/20241110-top-down-method/top_down_threshold.png)

> 1. 这个阈值表是基于对Intel实验室中的一些工作负载的分析总结出来的，作为一般指导原则。
> 2. 在Top-down分析过程中，没有高亮的指标，不需要花费时间优化，优化这一部分一般不会有太多的改善。
> 3. 大多数未调优的应用程序都是后端瓶颈的。 解决后端问题通常与解决延迟源有关，延迟源会导致执行完成所需的时间超过必要时间。

### 6.3. 第三方优化示例

- <https://github.com/yao-matrix/mblog/blob/main/mips.md>
- <https://weedge.github.io/perf-book-cn/zh/chapters/7-Overview-Of-Performance-Analysis-Tools/7-1_Intel_Vtune_cn.html>

## A. 资料

- [自顶向下的微架构分析方法](https://www.intel.cn/content/www/cn/zh/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html)：官方文档，介绍了`Top-down`分析方法的原理和步骤。
- [pdf -- A Top-Down Method for Performance Analysis and Counters Architecture](/assets/pdf/perf/perf_docs_20241110/A%20Top-Down%20Method%20for%20Performance%20Analysis%20and%20Counters%20Architecture.pdf)
- [cnblogs --C/C++ 性能优化背后的方法论：TMAM](https://www.cnblogs.com/vivotech/p/14547399.html)
- [调优指南: Xeon E5 v3](https://zzqcn.github.io/perf/intel_vtune/tunning_guide_e5v3.html)
- [pdf -- intel lectures: Intel_VTune_Amplifier-jackson](/assets/pdf/perf/perf_docs_20241110/Intel_VTune_Amplifier-jackson.pdf)：PPT文档
- [github -- pmu-tools](https://github.com/andikleen/pmu-tools)
- [User Interface Reference](https://www.intel.com/content/www/us/en/docs/vtune-profiler/user-guide/2025-4/user-interface-reference.html)：VTune官方参考文档，该章节的子章节详细介绍了VTune的每个页面。

### A.1. 更多阅读

- [Yasin's Publications](https://sites.google.com/site/analysismethods/yasin-pubs)：Intel Yasin 教授的论文列表
- [视频：From Top-down Microarchitecture Analysis to Structured Performance Optimizations](https://cassyni.com/events/YKbqoE4axHCgvQ9vuQq7Cy)
- [Software Optimizations Become Simple with Top-Down Analysis on Intel Skylake - Ahmad Yasin @ IDF'15](https://www.youtube.com/watch?v=kjufVhyuV_A)
- [译：内存分析](https://weedge.github.io/post/cpu/memory_profiling/)
- [pdf -- perf books cn -- 第二部分：源代码优化](/assets/pdf/perf/perf_docs_20241110/perf-book-cn.pdf)
