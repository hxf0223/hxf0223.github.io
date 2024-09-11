---
title: 总结：内存访问优化
date: 2024-08-27 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp, perf]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. 虚拟内存分配 ##

### 1.1 mmap ###

`mmap`用于建立`文件映射`，或者`匿名映射`。

当用于`文件映射`时，`mmap`将文件内容缓存进内核空间的`page cache`里面，然后将用户的一段虚拟内存空间直接映射到`page cache`。用户通过访问这段虚拟内存，直接读写内核空间上的`page cache`，避免buffer拷贝开销及用户态的切换。

用`mmap`用户建立`匿名映射`时，将用户空间的一段虚拟内存空间直接映射到某段物理内存上，这段虚拟内存称为`匿名页`。`匿名映射`用于`malloc`操作（大于128KB）。

### 1.2 malloc / free ###

在现代操作系统中，`malloc`的作用是分配虚拟内存空间，并不实际分配物理内存。当分配的虚拟内存空间第一次被访问时，才会真正的分配物理内存（OS的写时分配行为）。

`mallo`行为：

1. 首先尝试在进程空间内存池中查找有没有可以重用的内存空间，如果没有才会进行系统调用。
2. 如果申请的内存小于`128KB`，会通过调用`brk()`函数申请内存：根据申请内存大小，将堆顶指针向上移动，并返回新申请的内存地址给用户；当`free`掉`brk()`分配的内存时，并不会将物理内存缓存归还给操作系统，而是放到`malloc`的内存池中，待下次再次申请时直接使用。
3. 申请的内存大于`128KB`，会通过调用`mmap()`函数申请内存：通过匿名映射获取虚拟内存；当`free`掉`mmap()`分配的内存时，会将物理内存缓存归还给操作系统。

![malloc-brk](/assets/images/os/malloc_20240827/malloc_brk.png)
![malloc-mmap](/assets/images/os/malloc_20240827/malloc_mmap1.png)

### 1.3 new / delete ###

`new` / `delete`操作时，在调用`malloc`/`free`基础上，对`non-trival`对象，调用其构造/析构函数；对于`trival`对象，不需要调用构造/析构函数，直接分配/释放内存。

## 2. 内存分配优化 ##

* 用户态内存分配：intel TBB malloc, tcmalloc，Vulkan Memory Allocator等。（ 经测试，microsoft mimalloc适配性不是很好，使用过程中会出错；intel TBB malloc overhead似乎比较大）
* 内存池。（见下面资料链接）
* 对象池。

### 2.1 参考资料 ###

* [Vulkan Memory Allocator](https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator)
* [Vulkan Memory Allocator -- docs](https://gpuopen-librariesandsdks.github.io/VulkanMemoryAllocator/html/quick_start.html)
* [游戏架构设计：内存管理](https://www.cnblogs.com/KillerAery/p/10765893.html)
* [游戏架构设计：高性能并行编程](https://www.cnblogs.com/KillerAery/p/16333348.html)

## 3. github -- 内存池仓库 ##

* [github -- memory](https://github.com/foonathan/memory)
* [github -- poolSTL](https://github.com/alugowski/poolSTL)
