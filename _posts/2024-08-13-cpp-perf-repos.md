---
layout: post
title: 总结：内存访问优化
date: 2024-08-27 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp, Performance, Memory]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

![process_stack](/assets/images/os/malloc_20240827/wfl3VM8icKWzunj.png)

## 1. 虚拟内存分配

### 1.1 mmap

`mmap`用于建立`文件映射`，或者`匿名映射`。

当用于`文件映射`时，`mmap`将文件内容缓存进内核空间的`page cache`里面，然后将用户的一段虚拟内存空间直接映射到`page cache`。用户通过访问这段虚拟内存，直接读写内核空间上的`page cache`，避免buffer拷贝开销及用户态的切换。

用`mmap`用户建立`匿名映射`时，将用户空间的一段虚拟内存空间直接映射到某段物理内存上，这段虚拟内存称为`匿名页`。`匿名映射`用于`malloc`操作（大于128KB）。

`mmap`文件知识点:

- 通常情况下(除了`MAP_POPULATE`)，`mmap`创建时，只是在用户空间分配一段地址空间(`VMA`)，只有访问地址空间时，才会分配物理地址空间(`Page fault`中断分配内存)，并更新映射到`VMA`，建立映射关系。
- `mmap`映射的物理内存，可以跨进程共享，但需要进程之间加锁访问(写操作)。如果多个进程写同一个`mmap`映射的物理内存，会触发`Copy On Write(COW)`，内核重新分配一个新的物理内存，并复制原有物理内存的内容。
- 通过`msync()`将内存写回硬盘，`munmap()`释放内存。

`MAP_POPULATE`标志位: 建立页表，这将使得内核进行一些预读(实测没有性能提升)。使用方式：

- 使用`open` + 选项`O_RDONLY | O_DIRECT`打开文件;
- 以及使用`mmap` + `MAP_POPULATE`选项，在打开文件时建立页表。

`MAP_LOCKED`标志位: 锁定映射内存，阻止被换出。类似于`mlock()`。

更多`I/O`相关: [about IO performance](https://www.cnblogs.com/stdpain/p/17646856.html)

### 1.2 malloc / free

在现代操作系统中，`malloc`的作用是分配虚拟内存空间，并不实际分配物理内存。当分配的虚拟内存空间第一次被访问时，才会真正的分配物理内存（OS的写时分配行为）。

`malloc`行为：

1. 首先尝试在进程空间内存池中查找有没有可以重用的内存空间，如果没有才会进行系统调用。
2. 如果申请的内存小于`128KB`，会通过调用`brk()`函数申请内存：根据申请内存大小，将堆顶指针向上移动，并返回新申请的内存地址给用户；当`free`掉`brk()`分配的内存时，并不会将物理内存缓存归还给操作系统，而是放到`malloc`的内存池中，待下次再次申请时直接使用。
3. 申请的内存大于`128KB`，会通过调用`mmap()`函数申请内存：通过匿名映射获取虚拟内存；当`free`掉`mmap()`分配的内存时，会将物理内存缓存归还给操作系统。

![malloc-brk](/assets/images/os/malloc_20240827/malloc_brk.png)
![malloc-mmap](/assets/images/os/malloc_20240827/malloc_mmap1.png)

### 1.3 new / delete

`new` / `delete`操作时，在调用`malloc`/`free`基础上，对`non-trival`对象，调用其构造/析构函数；对于`trival`对象，不需要调用构造/析构函数，直接分配/释放内存。

## 2. 用户态 malloc

- 用户态内存分配：intel TBB malloc, tcmalloc，Vulkan Memory Allocator等。（ 经测试，microsoft mimalloc适配性不是很好，使用过程中会出错；intel TBB malloc overhead似乎比较大）
- 内存池。（见下面资料链接）
- 对象池。

### 2.1 参考资料

- [Vulkan Memory Allocator](https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator)
- [Vulkan Memory Allocator -- docs](https://gpuopen-librariesandsdks.github.io/VulkanMemoryAllocator/html/quick_start.html)
- [游戏架构设计：内存管理](https://www.cnblogs.com/KillerAery/p/10765893.html)
- [游戏架构设计：高性能并行编程](https://www.cnblogs.com/KillerAery/p/16333348.html)

### 2.2 内存池仓库

- [github -- memory](https://github.com/foonathan/memory)
- [github -- poolSTL](https://github.com/alugowski/poolSTL)

## 3. Linux Huge page

设置`Huge Page`，减少内存访问需要的的缺页中断，提高内存访问效率。以及减少`TLB`未命中导致的性能下降 -- 未命中`TLB`则需要逐级查询`page table`。

`Linux`使用`Huge Page`有两种方式：

### 3.1 Transparent Huge Page

主流`Linux kernel`发布版本都是默认支持`THP`的（`TRANSPARENT_HUGEPAGE`）。但是在用户态使能，需要开启设置`khugepaged`: [kernel -- Transparent Hugepage Support](https://www.kernel.org/doc/html/latest/admin-guide/mm/transhuge.html)

```bash
$ cat /sys/kernel/mm/transparent_hugepage/enabled

always [madvise] never
```

设置`khugepaged`:

```bash
# run as root
echo "always" >! /sys/kernel/mm/transparent_hugepage/enabled
```

选项:

- `always`: 开启`THP`，内核尝试将连续的内存页合并成一个`THP`页。用户层不需要任何操作。
- `madvise`: 开启`THP`，内核尝试将连续的内存页合并成一个`THP`页。用户层可以使用`madvise()`系统调用，将内存标记为`THP`。

对`x86-64`系统，`THP`页大小为`2MB`。查看`Huge Page`的页大小:

```bash
cat /sys/kernel/mm/transparent_hugepage/hpage_pmd_size
```

使用`THP`，需要在分配内存时，需要将分配的内存对齐，比如`2MB`大页对齐:

```c++
#include <iostream>
#include <sys/mman.h>

// ... definition of is_huge() and is_thp() ...

constexpr size_t HPAGE_SIZE = 2 * 1024 * 1024;

int main() {
  auto size = 4 * HPAGE_SIZE;
  void *mem = aligned_alloc(HPAGE_SIZE, size);

  madvise(mem, size, MADV_HUGEPAGE);

  // Make sure the page is present
  static_cast<char *>(mem)[0] = 'x';

  std::cout << "Is huge? " << is_huge(mem) << "\n";
  std::cout << "Is THP? " << is_thp(mem) << "\n";
}
```

完整代码[thp.cpp](https://www.lukas-barth.net/blog/linux-allocating-huge-pages/files/thp.cpp)

```bash
g++ --std=c++17 thp.cpp -o thp
```

### 3.2 HugeTLB

可以通过仅仅链接`libhugetlbfs`，即可使用大页内存:

```bash
# https://github.com/libhugetlbfs/libhugetlbfs

sudo apt-get install libhugetlbfs-dev libhugetlbfs-bin -y
sudo ln -s /usr/bin/ld.hugetlbfs /usr/share/libhugetlbfs/ld

# 分配1000个大页，一个page大小为2MB，总共2GB. 需要管理员权限
echo 1000 > /proc/sys/vm/nr_hugepages

# 确认大页是否可用
cat /proc/meminfo | grep HugePages_
```

链接`libhugetlbfs`:

```bash
-B /usr/share/libhugetlbfs -Wl,--hugetlbfs-align -no-pie -Wl,--no-as-needed
```

参考 [ARM -- Introduction to libhugetlbfs](https://learn.arm.com/learning-paths/servers-and-cloud-computing/libhugetlbfs/libhugetlbfs_general/)

另外，使用`HugeTLB`分配一个`10MB`匿名映射:

```c++
void *addr = mmap(0, 10*1024*1024, (PROT_READ | PROT_WRITE),
                  (MAP_PRIVATE | MAP_ANONYMOUS | MAP_HUGETLB), 0, 0);
```

参考:

- [Linux HugeTLB: What is the advantage of the filesystem approach?](https://unix.stackexchange.com/questions/753039/linux-hugetlb-what-is-the-advantage-of-the-filesystem-approach)
- [Allocating Huge Pages on Linux](https://www.lukas-barth.net/blog/linux-allocating-huge-pages/)
