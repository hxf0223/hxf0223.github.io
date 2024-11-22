---
title: 整理：内存模型
date: 2024-08-11 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp, cpu]
tags: [cpp, cpu]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. CPU Cache 内部结构 ##

![CPU structure](/assets/images/cpu/memory_order_20240811/cpu_structure.png)

一个`core`内部结构：

* `cache`
* `store buffer`
* `invalidate queue`

结构如下图所示：

![CPU cache structure](/assets/images/cpu/memory_order_20240811/core_structure_cache_store_buffer_inv_queue.png)

### 1.1 `Cahce`一致性协议 `MESI` ###

`MESI`是`CPU`内部多个`core`同步通讯协议，保证多个`core`中的`cache`的数据一致性。`MESI`这四个字母分别代表了每一个`cache line`可能处于的四种状态：`Modified`、`Exclusive`、`Shared` 和 `Invalid`。

通过给`cache line`设置状态位，以及`CPU core`（也可能有内存控制器参与）之间的消息同步逻辑，让多个`core`中的`cache`数据保持一致性。

在没有`store buffer`, `invalidate queue`之前，`MESI`可以保证不需要`memory fence`指令也可以保证数据的一致性。

### 1.2 `False sharing` ###

`False sharing`的原因是两个`CPU`访问的变量，在内存中的位置，同时落入一个`cache line`范围内，根据`MESI`协议，一个`CPU`写操作，将导致另一个`CPU`的读写操作之前，需要进行`memory`及两个`CPU`的`cache line`同步操作。通常发生在两个线程操作同一个数据结构体的时候。

![false sharing](/assets/images/cpu/memory_order_20240811/false_share.png)

```c++
#define CACHE_ALIGN_SIZE 64
#define CACHE_ALIGNED __attribute__((aligned(CACHE_ALIGN_SIZE)))

struct aligned_value {
  int64_t val;
} CACHE_ALIGNED; // Note: aligning the struct to a cache line size
aligned_value aligned_data[2] CACHE_ALIGNED;

// sizeof(aligned_value) == 128
```

### 1.3 现代`CPU`上`MESI`的局限 ###

由于`MESI`同步协议导致处理器之间同步的代价很高，现代处理器再每个`core`里面增加两个异步队列: `store buffer`和`invalidate queue`来减少`CPU`的空闲等待。这两个异步队列，导致`MESI`协议失效。

* `store buffer`: `CPU`将`write/store`操作数据放入`store buffer`，`cache`负责`flush`操作。
* `invalidate queue`: `cache`收到`Invalidate`消息，不是马上执行，而是放入`invalidate queue`，等待`CPU`空闲时，再执行。

其原因是：针对发起方`CPU`，其认为自己的`store` / `invalidate`操作已经完成，但是由于数据/消息是放在`store buffer` / `invalidate queue`中，所以可能还没来得及被其他`CPU`看到，导致数据不一致。

其中的一个解决办法是：发起方的`store buffer`被清空，接收方的`invalieate queue`被处理掉。在此之后，`MESI`协议可以正常工作。

## 2. memory barrier ##

### 2.1 概念及理论 ###

* 同步点：针对同一个`原子变量`的`load`操作与`store`操作，分别构成一个`同步点`。其概念有三要素：(1)：`load`/`store`操作，(2)：针对同一个原子变量，(3)：以及在不同线程中；
* `synchronize-with` 关系，该概念包含两个含义：(1)：同一个同步点，(2)：读取的值是另一个同步点写入的值；
* `happens-before` 关系；

`memory fence`定义的是同步点操作，即分别在`store`一方插入一个`write barrier`指令，在`load`一方插入一个`read barrier`指令。

因此，`memory barrier`需要成对出现，否则达不到同步效果。

#### 2.2 详细解释 ####

由于多核处理器 `CPU` 之间独立的`L1/L2 cache`，会出现`cache line`不一致的问题，为了解决这个问题，有相关协议模型，比如 `MESI` 协议来保证 `cache` 数据一致，同时由于 `CPU` 对 `MESI` 进行的异步优化，对写和读分别引入了「`store buffer`」和「`invalid queue`」，很可能导致后面的指令查不到前面指令的执行结果（各个指令的执行顺序非代码执行顺序），这种现象很多时候被称作「`CPU乱序执行`」。

为了解决乱序问题（也可以理解为可见性问题，修改完没有及时同步到其他的CPU），又引出了「`内存屏障`」的概念；内存屏障可以分为三种类型：`写屏障`，`读屏障`以及`全能屏障（包含了读写屏障）`，屏障可以简单理解为：在操作数据的时候，往数据插入一条`特殊的指令`。只要遇到这条指令，那前面的操作都得「完成」。

1. `CPU`当发现写屏障指令时，会把该指令「之前」存在于「`store Buffer`」所有写指令刷入`cache`。就可以让`CPU`修改的数据马上暴露给其他`CPU`，达到「写操作」可见性的效果。

2. 读屏障也是类似的：CPU当发现读屏障的指令时，会把该指令「之前」存在于「`invalid queue`」所有的指令都处理掉。通过这种方式就可以确保当前CPU的缓存状态是准确的，达到「读操作」一定是读取最新的效果。

由于不同CPU架构的缓存体系不一样、缓存一致性协议不一样、重排序的策略不一样、所提供的内存屏障指令也有差异，所以一些语言c++/java/go/rust 都有实现自己的内存模型, 比如golang大牛`Russ Cox`写的内存模型系列文章 [Memory Models](https://research.swtch.com/mm) 值得深入了解。

详细知识参考：

* [Sequential Consistency，Cache-Coherence及Memory barrier (HTTP)](https://blog.kongfy.com/2016/10/cache-coherence-sequential-consistency-and-memory-barrier/)
* [说透缓存一致性与内存屏障](https://www.cnblogs.com/chanmufeng/p/16523365.html)
* [CPU 缓存一致性与内存屏障](https://wingsxdu.com/posts/note/cpu-cache-and-memory-barriers/)
* [Cache一致性和内存一致性](https://wudaijun.com/2019/04/cache-coherence-and-memory-consistency/)
* [Acquire and Release Fences](https://preshing.com/20130922/acquire-and-release-fences/)

## 3. memory order seq_cst 与 release_acquire 区别 ##

[谈谈 C++ 中的内存顺序 (Memory Order)](https://luyuhuang.tech/2022/06/25/cpp-memory-order.html)

## 更多资料 ##

* [C++ Concurrency In Action 2ed 中文翻译](https://simonhancrew.github.io/CppConcurencyInAction/)
* [C++ Concurrency in Action, 2nd Edition](/assets/pdf/cpu/C++%20Concurrency%20in%20Action,%202nd%20Edition.pdf)

## HTTP 参考资料 ##

* [memory ordering](https://gavinchou.github.io/summary/c++/memory-ordering)
* [现代CPU性能分析与优化 -- 现代CPU设计](https://weedge.github.io/perf-book-cn/zh/chapters/3-CPU-Microarchitecture/3-8_Modern_CPU_design_cn.html)
* [现代CPU性能分析与优化 -- README](https://weedge.github.io/perf-book-cn/zh/)
* [现代CPU性能分析与优化 -- pdf](/assets/pdf/cpu/perf-book-cn.pdf)
