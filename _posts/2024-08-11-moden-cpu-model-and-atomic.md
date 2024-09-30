---
title: 整理：内存模型
date: 2024-08-11 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp, cpu, linux]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. CPU Cache 内部结构 ##

![CPU structure](/assets/images/cpu/memory_order_20240811/cpu_structure.png)

一个core内部结构：cache, store buffer, invalidate queue，结构如下图所示：

![CPU cache structure](/assets/images/cpu/memory_order_20240811/core_structure_cache_store_buffer_inv_queue.png)

### 1.1 为什么需要 MESI ###

`MESI`是`CPU`内部多个`core`同步通讯协议，保证多个`core`中的`cache`的数据一致性。

通过给`cache line`设置状态位，以及`CPU core`（也可能有内存控制器参与）之间的消息同步逻辑，让多个`core`中的`cache`数据保持一致性。`core`之间通讯过程示例：[知乎 --为什么需要内存屏障](https://zhuanlan.zhihu.com/p/55767485)。

在没有`store buffer`之前，`MESI`可以保证不需要`memory fence`指令也可以保证数据的一致性（理解：但不能保证指令重排导致两个线程访问先后顺序）。

## 2. memory fence ##

### 2.1 概念及理论 ###

- 同步点：针对同一个`原子变量`的`load`操作与`store`操作，分别构成一个`同步点`。其概念有三要素：(1)：`load`/`store`操作，(2)：针对同一个原子变量，(3)：以及在不同线程中；
- `synchronize-with` 关系，该概念包含两个含义：(1)：同一个同步点，(2)：读取的值是另一个同步点写入的值；
- `happens-before` 关系；

### 2.2 为什么需要 memroy fence ###

例如有两个`CPU core`：`CPU0`，以及`CPU1`，`CPU0`写入，`CPU1`读取同一个变量。`CPU0`认为写入到`store buffer`就够了，而`CPU1`则认为必须写入到`cache`才叫写入。

所以，在`MESI`协议的基础上，再添加一个`memory fence`，以保证`CPU0`与`CPU1`的`cache`数据一致性。

#### 2.2.1 详细解释 ####

由于多核处理器 `CPU` 之间独立的`L1/L2 cache`，会出现`cache line`不一致的问题，为了解决这个问题，有相关协议模型，比如 `MESI` 协议来保证 `cache` 数据一致，同时由于 `CPU` 对 `MESI` 进行的异步优化，对写和读分别引入了「`store buffer`」和「`invalid queue`」，很可能导致后面的指令查不到前面指令的执行结果（各个指令的执行顺序非代码执行顺序），这种现象很多时候被称作「`CPU乱序执行`」。

为了解决乱序问题（也可以理解为可见性问题，修改完没有及时同步到其他的CPU），又引出了「`内存屏障`」的概念；内存屏障可以分为三种类型：`写屏障`，`读屏障`以及`全能屏障（包含了读写屏障）`，屏障可以简单理解为：在操作数据的时候，往数据插入一条”特殊的指令”。只要遇到这条指令，那前面的操作都得「完成」。

CPU当发现写屏障指令时，会把该指令「之前」存在于「`store Buffer`」所有写指令刷入高速缓存。就可以让`CPU`修改的数据马上暴露给其他`CPU`，达到「写操作」可见性的效果。

读屏障也是类似的：CPU当发现读屏障的指令时，会把该指令「之前」存在于「invalid queue」所有的指令都处理掉。通过这种方式就可以确保当前CPU的缓存状态是准确的，达到「读操作」一定是读取最新的效果。由于不同CPU架构的缓存体系不一样、缓存一致性协议不一样、重排序的策略不一样、所提供的内存屏障指令也有差异，所以一些语言c++/java/go/rust 都有实现自己的内存模型, 比如 golang大牛Russ Cox写的内存模型系列文章 Memory Models: https://research.swtch.com/mm 值得深入了解。

详细知识参考：

- [说透缓存一致性与内存屏障](https://www.cnblogs.com/chanmufeng/p/16523365.html)
- [CPU 缓存一致性与内存屏障](https://wingsxdu.com/posts/note/cpu-cache-and-memory-barriers/)
- [Cache一致性和内存一致性](https://wudaijun.com/2019/04/cache-coherence-and-memory-consistency/)
- [Acquire and Release Fences](https://preshing.com/20130922/acquire-and-release-fences/)

## 3. memory order seq_cst 与 release_acquire 区别 ##

[谈谈 C++ 中的内存顺序 (Memory Order)](https://luyuhuang.tech/2022/06/25/cpp-memory-order.html)

## 更多资料 ##

- [C++ Concurrency In Action 2ed 中文翻译](https://simonhancrew.github.io/CppConcurencyInAction/)
- [C++ Concurrency in Action, 2nd Edition](/assets/pdf/cpu/C++%20Concurrency%20in%20Action,%202nd%20Edition.pdf)

## HTTP 参考资料 ##

- [memory ordering](https://gavinchou.github.io/summary/c++/memory-ordering)
- [现代CPU性能分析与优化 -- 现代CPU设计](https://weedge.github.io/perf-book-cn/zh/chapters/3-CPU-Microarchitecture/3-8_Modern_CPU_design_cn.html)
- [现代CPU性能分析与优化 -- README](https://weedge.github.io/perf-book-cn/zh/)
- [现代CPU性能分析与优化 -- pdf](/assets/pdf/cpu/perf-book-cn.pdf)
