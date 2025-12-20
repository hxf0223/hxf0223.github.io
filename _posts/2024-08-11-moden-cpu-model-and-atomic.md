---
title: 整理：内存一致模型
date: 2024-08-11 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [CPU]
tags: [Cpp, CPU]

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

![CPU cache structure](/assets/images/cpu/memory_order_20240811/core_structure_cache_store_buffer_inv_queue2.png)

### 1.1. `Cahce`一致性协议 `MESI` ###

`MESI`是`CPU`内部多个`core`同步通讯协议，保证多个`core`中的`cache`的数据一致性。`MESI`这四个字母分别代表了每一个`cache line`可能处于的四种状态：`Modified`、`Exclusive`、`Shared` 和 `Invalid`。

通过给`cache line`设置状态位，以及`CPU core`（也可能有内存控制器参与）之间的消息同步逻辑，让多个`core`中的`cache`数据保持一致性。

在没有`store buffer`, `invalidate queue`之前，`MESI`可以保证不需要`memory fence`指令也可以保证数据的一致性。

### 1.2. `False sharing` ###

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

### 1.3. 现代`CPU`上`MESI`的局限 ###

由于`MESI`同步协议导致处理器之间同步的代价很高，现代处理器再每个`core`里面增加两个异步队列: `store buffer`和`invalidate queue`来减少`CPU`的空闲等待。这两个异步队列，导致`MESI`协议失效。

* `store buffer`: `CPU`将`write/store`操作数据放入`store buffer`，`cache`负责`flush`操作。
* `invalidate queue`: `cache`收到`Invalidate`消息，不是马上执行，而是放入`invalidate queue`，等待`CPU`空闲时，再执行。

其原因是：针对发起方`CPU`，其认为自己的`store` / `invalidate`操作已经完成，但是由于数据/消息是放在`store buffer` / `invalidate queue`中，所以可能还没来得及被其他`CPU`看到，导致数据不一致。

其中的一个解决办法是：发起方的`store buffer`被清空，接收方的`invalieate queue`被处理掉。在此之后，`MESI`协议可以正常工作。

## 2. `memory barrier` ##

### 2.1. 概念及理论 ###

* 同步点：针对同一个`原子变量`的`load`操作与`store`操作，分别构成一个`同步点`。其概念有三要素：(1)：`load`/`store`操作，(2)：针对同一个原子变量，(3)：以及在不同线程中；
* `synchronize-with` 关系，该概念包含两个含义：(1)：同一个同步点，(2)：读取的值是另一个同步点写入的值；
* `happens-before` 关系；

`memory fence`定义的是同步点操作，即分别在`store`一方插入一个`write barrier`指令，在`load`一方插入一个`read barrier`指令。

因此，`memory barrier`需要成对出现，否则达不到同步效果。

### 2.2. 详细解释 ###

由于多核处理器 `CPU` 之间独立的`L1/L2 cache`，会出现`cache line`不一致的问题，为了解决这个问题，有相关协议模型，比如 `MESI` 协议来保证 `cache` 数据一致，同时由于 `CPU` 对 `MESI` 进行的异步优化，对写和读分别引入了「`store buffer`」和「`invalid queue`」，很可能导致后面的指令查不到前面指令的执行结果（各个指令的执行顺序非代码执行顺序），这种现象很多时候被称作「`CPU乱序执行`」。

为了解决乱序问题（也可以理解为可见性问题，修改完没有及时同步到其他的CPU），又引出了「`内存屏障`」的概念；内存屏障可以分为三种类型：`写屏障`，`读屏障`以及`全能屏障（包含了读写屏障）`，屏障可以简单理解为：在操作数据的时候，往数据插入一条`特殊的指令`。只要遇到这条指令，那前面的操作都得「完成」。

1. `写屏障`指令(`write barrier`, or `sfence`)，等待之前的写操作完成，并把该指令「之前」存在于「`store Buffer`」中的所有写指令刷入`cache`。就可以让`CPU`修改的数据马上暴露给其他`CPU`(`MESI`)，达到「写操作」可见性的效果。

2. `读屏障`指令(`read barrier`, or `lfence`)，会把该指令「之前」存在于「`invalid queue`」中的所有的指令都处理掉。通过这种方式就可以确保当前CPU的缓存状态是准确的，达到「读操作」一定是读取最新的效果。

由于不同CPU架构的缓存体系不一样、缓存一致性协议不一样、重排序的策略不一样、所提供的内存屏障指令也有差异，所以一些语言c++/java/go/rust 都有实现自己的内存模型, 比如golang大牛`Russ Cox`写的内存模型系列文章 [Memory Models](https://research.swtch.com/mm) 值得深入了解。

### 2.3. `x86`上面的`fence`实操演示 ###

`ARM`架构CPU有`Store Buffer`、`Invalidate Queue`，是一个松散内存一致性模型。`x86`架构只有`Store Buffer`，是一个强内存一致性模型。

在`x86`架构下，对`StoreLoad`操作进行重排(乱序)。其余几种保持顺序：`StoreStore`, `LoadLoad`, `LoadStore`，即不需要设置`fence`指令也可以保持`CPU`之间的内存一致性。

禁止编译器重排：

```cpp
X = 1;
asm volatile("" ::: "memory"); // Prevent compiler reordering
r1 = Y;
```

禁止编译器及`CPU`重排：

```cpp
X = 1;
asm volatile("mfence" ::: "memory"); // Prevent compiler and CPU reordering
r1 = Y;
```

详细知识参考：

* [CPU 缓存一致性与内存屏障](https://wingsxdu.com/posts/note/cpu-cache-and-memory-barriers/)
* [Cache一致性和内存一致性](https://wudaijun.com/2019/04/cache-coherence-and-memory-consistency/)
* [Acquire and Release Fences](https://preshing.com/20130922/acquire-and-release-fences/)
* [從硬體觀點了解 memory barrier 的實作和效果](https://medium.com/fcamels-notes/%E5%BE%9E%E7%A1%AC%E9%AB%94%E8%A7%80%E9%BB%9E%E4%BA%86%E8%A7%A3-memry-barrier-%E7%9A%84%E5%AF%A6%E4%BD%9C%E5%92%8C%E6%95%88%E6%9E%9C-416ff0a64fc1)
* [CPU架构和MESI缓存一致性->内存模型一致性->内存屏障和原子操作->内存序->C++内存序](https://www.cnblogs.com/yiwanfengweng/articles/18657841)

## 3. C++11 内存一致性模型定义 ##

| 内存一致性模型       | 作用                                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| memory_order_release | 作用于`store`操作。约束：本线程在此操作之前的所有`R/W`操作，均不能重排到此操作之后。故其他线程中`acquire`操作之后，可以看见本线程中本操作之前的所有写入操作。 |

```cpp
#include <thread>
#include <atomic>
#include <cassert>
#include <string>

std::atomic<std::string*> ptr{nullptr};
int data{42};

void producer() {
  std::string* p  = new std::string("Hello");
  data = 42;
  ptr.store(p, std::memory_order_release);
}

void consumer() {
  std::string* p2;
  while (nullptr == (p2 = ptr.load(std::memory_order_acquire)));
  assert(*p2 == "Hello"); // never fires
  assert(data == 42); // never fires
}

int main() {
  std::thread t1(producer);
  std::thread t2(consumer);
  t1.join(); t2.join();
  return 0;
}
```

* [谈谈 C++ 中的内存顺序 (Memory Order)](https://luyuhuang.tech/2022/06/25/cpp-memory-order.html)
* [程序员的自我修养（⑫）：C++ 的内存顺序·中](https://liam.page/2021/12/11/memory-order-cpp-02/)

## 更多资料 ##

* [C++ Concurrency In Action 2ed 中文翻译](https://simonhancrew.github.io/CppConcurencyInAction/)
* [C++ Concurrency in Action, 2nd Edition](/assets/pdf/cpu/C++%20Concurrency%20in%20Action,%202nd%20Edition.pdf)
* [现代CPU性能分析与优化 -- 现代CPU设计](https://weedge.github.io/perf-book-cn/zh/chapters/3-CPU-Microarchitecture/3-8_Modern_CPU_design_cn.html)
* [现代CPU性能分析与优化 -- README](https://weedge.github.io/perf-book-cn/zh/)
* [现代CPU性能分析与优化 -- pdf](/assets/pdf/cpu/perf-book-cn.pdf)

