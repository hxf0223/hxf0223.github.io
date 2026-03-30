---
layout: post
title: Intel TBB malloc 内存分配器
date: 2024-08-28 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [TBB, Cpp]
tags: [TBB, Cpp, Performance, HPC]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. TBB Malloc 介绍

### 1.1. TBB Malloc 使用入门

有两种方式使用`TBB Malloc`：`Run-Time`替换，`Link-Time`替换。替换的函数(routines)包括：

| routines                              | Linux | MacOS | Windows |
| ------------------------------------- | ----- | ----- | ------- |
| global C++ new / delete               | √     | √     | √       |
| C库：malloc / calloc / realloc / free | √     | √     | √       |
| C库(C11)：aligned_alloc               | √     | -     | -       |
| POSIX：posix_memalign                 | √     | √     | -       |

`Run-Time`替换方法：

| 平台  | 替换方法                                                                          |
| ----- | --------------------------------------------------------------------------------- |
| Linux | export LD_PRELOAD=$TBBROOT/lib/intel64/gcc4.8/libtbbmalloc_proxy.so.2             |
| MacOS | export DYLD_INSERT_LIBRARIES=$TBBROOT/lib/intel64/gcc4.8/libtbbmalloc_proxy.dylib |

`Link-Time`替换方法：

| 平台          | 替换方法                                            |
| ------------- | --------------------------------------------------- |
| Linux & MacOS | `-L$TBBROOT/lib/intel64/gcc4.8 -ltbbmalloc_proxy`   |
| Windows       | `tbbmalloc_proxy.lib /INCLUDE:"__TBB_malloc_proxy"` |

`Link-Time`替换，需要添加编译flags。不添加这些编译flags，可能导致malloc等这些函数被内联为汇编，即失去了符号，也就没有办法替换了。需要添加的flags如下：

Linux/MacOS平台下，添加如下编译flags（适用于Linux/MacOS）：

```text
-fno-builtin-malloc
-fno-builtin-calloc
-fno-builtin-realloc
-fno-builtin-free
```

Windows平台下，icc编译器添加如下编译flags：

```text
- /Qfno-builtin-malloc
- /Qfno-builtin-calloc
- /Qfno-builtin-realloc
- /Qfno-builtin-free
```

> 替换Proxy入口代码文件为`src/tbbmalloc_proxy/proxy.cpp`。

#### 1.1.1. 直接使用TBB malloc（Compile-Time）

| Allocation Routine                                 | Deallocation Routine  | 对应系统运行时库    |
| -------------------------------------------------- | --------------------- | ------------------- |
| scalable_malloc, scalable_calloc, scalable_realloc | scalable_free         | C Standard library  |
| scalable_aligned_malloc, scalable_aligned_realloc  | scalable_aligned_free | Microsoft C runtime |

与C++ STL对应的allocator：

![table_tbb_stl_allocator](/assets/images/intel_tbb/20240828/table_tbb_stl_allocator.png)

一个简单使用示例：

```cpp
#include <vector>
#include <algorithm>
#include <execution>
#include <tbb/scalable_allocator.h>

std::vector<int, tbb::scalable_allocator<int>> v{…};
std::sort(std::execution::par, v.begin(), v.end());
```

#### 1.1.2. Huge Pages

TBB malloc支持Huge Pages，可以通过设置环境变量`TBB_MALLOC_USE_HUGE_PAGES`来启用，或者在代码中设置：

```cpp
scalable_allocation_mode( TBBMALLOC_USE_HUGE_PAGES,1);
```

Huage Pages可以减少malloc调用，减少TLB Miss，提高性能，尤其是在分配大块内存时。

#### 1.1.3. memory_pool_allocator

TBB malloc提供了一个`memory_pool_allocator`，它通过预先分配一大块内存，避免TBB Malloc模块的管理开销。管理器需要查找空闲块、分割块、记录元数据（这块内存多大、是否在用等）。

其约束为，每次分配的大小为固定的`P`，因为它是通过简单的**基于 P 取模的偏移量**获取内存块的。适用于作为`STL`容器的分配器。一个示例如下：

```cpp
#define TBB_PREVIEW_MEMORY_POOL 1
#include "oneapi/tbb/memory_pool.h"
#include <list>

int main() {
    oneapi::tbb::memory_pool<std::allocator<int>> my_pool;

    typedef oneapi::tbb::memory_pool_allocator<int> pool_allocator_t;
    std::list<int, pool_allocator_t> my_list(pool_allocator_t{my_pool});

    my_list.emplace_back(1);
}
```

当`memory_pool`中内存用尽之后，将向底层`Alloc`申请内存进行扩容。新增的内存切分成若干`FreeBlock`，并添加到pool内部的空闲链表。扩容大小由`extMemPool->granularity`决定，扩容的内存可能来自其他线程丢弃的的`orphaned blocks`，也可能来自底层`Alloc`分配的内存。其类声明如下：

```cpp
//! Thread-safe growable pool allocator for variable-size requests
template <typename Alloc>
class memory_pool : public pool_base
```

另外，定义了一个`fixed_pool`，内存池耗尽之后不会扩展。

#### 1.1.4. 局部替代 new & delete

当某些模块需要自定义allocator时，可以通过局部替代`new`和`delete`来实现：

```cpp
#include <tbb/parallel_for.h>
#include <tbb/tbb_allocator.h>

// No retry loop because we assume that
// scalable_malloc does all it takes to allocate the memory,
// so calling it repeatedly will not improve the situation at all

// No use of std::new handler because it cannot bedone in portable and
// thread-safe way We throw std::bad alloc() when scalable mallocreturns NULL
// (we return NULL if it is a no-throw implementation)

void *operator new(size_t size) throw(std::bad_alloc) {
  if (size == 0) size = 1;
  if (void *ptr = scalable_malloc(size))
    return ptr;
  throw std::bad_alloc();
}

void *operator new[](size_t size) throw(std::bad_alloc) {
  return operator new(size);
}

void *operator new(size_t size, const std::nothrow_t &) throw {
  if (size == 0) size = 1;
  if (void *ptr = scalable_malloc(size))
    return ptr;
  return NULL;
}

void *operator new[](size_t size, const std::nothrow_t &) throw {
  return operator new(size, std::nothrow);
}

void operator delete(void *ptr) throw() {
  if (ptr != 0) scalable_free(ptr);
}

void operator delete[](void *ptr) throw() { operator delete(ptr); }

void operator delete(void *ptr, const std::nothrow_t &) throw() {
  if (ptr != 0) scalable_free(ptr);
}

void operator delete[](void *ptr, const std::nothrow_t &) throw() {
  operator delete(ptr, std::nothrow);
}

int main(int argc, char **argv) {
  const size_t size = 1000;
  const size_t chunk = 100;

  // scalable malloc will be called to allocate
  // the memory for this array of integers
  int *p = new int[size];

  tbb::parallel_for(size_t{0}, size, [=](size_t chunk) {
    // scalable_malloc will be called to allocate the memory for this
    // array of integers
    int *p = new int[chunk];

    // scalable_free will be called to deallocate the memory for this
    // array of integers
    delete[] p;
  });

  return 0;
}
```

> 代码示例来自`Pro TBB`第七章：Scalable Memory Allocation。

### 1.2. TBB Malloc 架构分析

`TBB Malloc`基于前后端两层分层架构：分为`Frontend`和`Backend`两层。`Frontend`负责处理基于线程的内存分配请求，`Backend`负责物理内存分配和全局内存管理（线程分配及回收）。

每个线程都有一个自己独立的本地缓存（local cache）。当线程请求内存时，首先检查本地缓存中分配，如果有空闲块，则直接返回本地的空闲块，这个查询及分配操作是**无锁的**。另外，本地维护的空闲链表，被分类为不同大小的内存块（size class），每个size class维护一个空闲链表，比如8字节、16字节、2KB等。

`Frontend`代码路径：`src/tbbmalloc/frontend.cpp`。

`Backend`负责物理内存分配/释放、处理碎片。当某个线程的缓存空了，会向`Backend`请求内存块，当线程本地的缓存太多时，会将多余的内存块返回给`Backend`。

由于`Backend`是共享的，所有访问`Backend`需要加锁。另外，`Huge Pages`的支持也是在`Backend`实现的。

`Backend`代码路径：`src/tbbmalloc/backend.cpp`。

这套前端/后端的分层架构，特点为：

- Thread-Local Storage (TLS): 利用 TLS 存储每个线程的分配器状态，避免全局锁。
- Cross-Thread Recycling: 如果线程 A 释放了内存，而线程 B 需要内存，分配器需要能安全地将 A 释放的块转交给 B。TBB malloc 使用一种延迟回收或集中式回收的机制来处理这种跨线程转移，同时尽量减少锁竞争。
- Object Caching: 释放的内存不会立即还给 OS，而是保留在缓存中，以便下次快速重用。

> tbbmalloc相关的部分高层代码路径：
> `include/oneapi/tbb/memory_pool.h`
> `src/tbb/allocator.cpp`
> `src/tbbmalloc_proxy/proxy.cpp`。

#### 1.2.1. Linux系统符号替换

ELF 格式中，符号有三种绑定类型（st_bind）：

| 类型 | 说明 |
| --- | --- |
| STB_GLOBAL | 强符号，全局可见，重复定义时链接报错 |
| STB_WEAK | 弱符号，可被强符号覆盖，未覆盖时使用弱版本 |
| STB_LOCAL |	局部符号，仅文件内可见 |

`dlopen`以及动态链接器只加载找到的第一个强符号，在`proxy.cpp`中，定义这些符号（部分定义截图）：

![tbbmalloc_proxy_strong_symbol](/assets/images/intel_tbb/20240828/tbbmalloc_proxy_strong_symbol.png)

并调用`dlsym(RTLD_NEXT, ...)`保留系统原始的symbol，用作初始化阶段bootstrap调用：

```cpp
inline void InitOrigPointers()
{
    // race is OK here, as different threads found same functions
    if (!origFuncSearched.load(std::memory_order_acquire)) {
        orig_free = dlsym(RTLD_NEXT, "free");
        orig_realloc = dlsym(RTLD_NEXT, "realloc");
        orig_msize = dlsym(RTLD_NEXT, "malloc_usable_size");
        orig_libc_free = dlsym(RTLD_NEXT, "__libc_free");
        orig_libc_realloc = dlsym(RTLD_NEXT, "__libc_realloc");

        origFuncSearched.store(true, std::memory_order_release);
    }
}
```

另外，使用`__attribute__((alias))`将`libc`库中的`__libc_*`等函数替换为对应的routines：

![tbbmalloc_symbol_alias_replace](/assets/images/intel_tbb/20240828/tbbmalloc_symbol_alias_replace.png)

> alias("sym") 让当前符号成为 sym 的别名，两个名字指向同一段代码。即将`__libc_free`等符号截获并替换为`free`等符号。

## A. 资料

- [Memory Allocation](https://uxlfoundation.github.io/oneTBB/main/tbb_userguide/Memory_Allocation.html)：官方文档
- [Scalable Memory Allocation for Parallel Algorithms](/assets/pdf/perf/intel_tbb/Scalable_Memory_Allocation_for_Parallel_Algorithms.pdf)
- [scalable_allocators](https://github.com/arminms/scalable_allocators)：Intel TBB scalable_malloc benchmark
- [2007-vol11-iss-4-intel-technology-journal](/assets/pdf/perf/intel_tbb/2007-vol11-iss-4-intel-technology-journal.pdf)：早期讲述TBB Malloc设计的文章（`Scalable Memory Allocator Architecture`），介绍了当时的设计思路和实现细节。搜索`allocator`
