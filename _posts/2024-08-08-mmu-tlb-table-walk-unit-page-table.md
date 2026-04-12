---
layout: post
title: 总结：MMU -- 包括 TLB 以及 Table Walk Unit ，以及内存 Page Table
date: 2024-08-08 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [CPU]
tags: [Linux, CPU]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. `MMU` 结构以及工作过程

大多数使用`MMU`的机器采用内存`分页机制`，虚拟地址空间以`页(Page)`为单位，相应的，物理地址空间也被划分为`页帧(Frame)`。`页帧`必须与`页`保持相同的大小，通常为`4KB`，对于大页，页帧可以是`2MB`或`1GB`。大页一般用于服务器，用于系统分配大量数据，减少缺页中断的发生。

`MMU`通过`页表(Page Table)`将虚拟地址映射到物理地址，页表存储在主存中，由`系统内核`创建及管理。

![CPU with MMU](/assets/images/cpu/mmu_20240808/cpu_with_mmu.webp)

`MMU`由两部分组成：`TLB(Translate Look-aside Buffer)`，以及`Table Walk Unit`：

1. `TLB (Translation Lookaside Buffer)`：缓存最近使用的 `VA` 到 `PA` 的映射；
2. `Table Walk Unit`：如果`TLB`没有命中CPU发出的`VA`，则由`Table Walk Unit`根据位于物理内存中的`页表(Page Table)`完成`VA`到`PA`的查找。

`CPU`访问内存的时候，将`VA`发给`MMU`，`MMU`先在`TLB`中查找是否有对应的`PA`，如果有，则直接返回对应的`PA`；如果没有，则由`Table Walk Unit`根据位于物理内存中的页表完成查找。

在上述过程中，如果`Table Walk Unit`没有找到对应的`PA`，则向CPU发出`Page fault`中断，CPU处理缺页中断（具体见后面章节描述）。

`MMU`的工作过程图示：

![MMU Work Process](/assets/images/cpu/mmu_20240808/workflow_of_mmu.webp)

CPU发出的`VA`由两部分组成：`VPN(Virtual Page Number)` + `offset`。对应的，转换之后的物理地址也有两部分：页框号`PFN(Physical Frame Number)` + `offset`。

![VPN to PFN](/assets/images/cpu/mmu_20240808/vpn_to_pfn.webp)

### 1.1 从`VA`到`PA`，MMU处理流程图

![MMU VA to PA Process](/assets/images/cpu/mmu_20240808/mmu_va_to_pa_procesure.png)

## 2. 页表结构

现代CPU一般采用四级页表结构。以32位地址空间的二级页表为例，CPU发出的虚拟地址被拆分分为：页目录(Page Directory)、页表(Page Table)、页内偏移(Page Offset)三级（以4k为例，即12位）。

`VPN`的最高10位用于索引页目录，紧接的10位用于索引页表索引，最低12位为页内偏移地址。拆分结构如下图所示：

![Page Table Structure](/assets/images/cpu/mmu_20240808/页表目录索引_页表索引_地址偏移.webp)

### 2.1 MMU查找过程

MMU先根据一级页表的物理地址和一级页表Index去一级页表中找PTE，PTE中的地址不再是最终的物理地址，而是二级页表的物理地址。

根据二级页表物理地址和二级页表index去二级页表中找PTE，此时PTE中的地址才是真实的物理地址。

根据此物理地址和offset找到最终的物理内存地址。

![MMU Lookup Process](/assets/images/cpu/mmu_20240808/MMU_LOOKUP_PAGE_TABLE.webp)

使用二级页表的好处是如果一级页表中的某一个PTE没有命中，那这一PTE对应的整个二级页表就不存在。

### 2.2 进程页表与 Address Space ID

`操作系统`会为`每个进程`分配一个`页表`，该`页表`使用`物理地址`存储。当`进程`使用类似`malloc`等需要`映射代码或数据`的操作时，`操作系统`会在随后马上`修改页表`以加入新的 `物理内存`。

每次`切换进程`都需要进行`TLB清理`。这样会导致切换的效率变低。为了解决问题，`TLB`引入了`ASID(Address Space ID)`。`ASID`的范围是`0-255`。`ASID`由操作系统分配，`当前进程的ASID值`被写在`ASID寄存器(使用CP15 c3访问)`。`TLB`在更新`页表项`时也会将`ASID`写入`TLB`。

`MMU`在查找`TLB`时， 只会查找`TLB`中具有`相同ASID值`的`TLB行`。且在切换进程时，`TLB`中被设置了`ASID`的`TLB行`不会被清理掉，当下次切换回来的时候还在。所以`ASID`的出现使得切换进程时不需要清理`TLB`中的所有数据，可以大大减少`切换开销`。

## 3. `页表项(PTE)` 与 `TLB` 中的标志位

在进程的虚拟内存空间中，每一个虚拟内存页在页表中都有一个`PTE`与之对应，在32位系统中，每个`PTE`占用4个字节大小，其中保存了虚拟内存页背后映射的物理内存页的起始地址，以及进程访问物理内存的一些权限标识位。

![PTE in Page Table](/assets/images/cpu/mmu_20240808/pte_table.png)

由于内核将整个物理内存划分为一页一页的单位，每个物理内存页大小为 4K，所以物理内存页的起始地址都是按照 4K 对齐的，也就导致物理内存页的起始地址的后 12 位全部是 0，我们只需要在`PTE`中存储物理内存地址的高 20 位就可以了，剩下的低 12 位可以用来标记一些权限位。

![PTE flags](/assets/images/cpu/mmu_20240808/pte_flags.png)

一些标志位的含义如下：

- `P(0)`：映射的物理内存是否在内存中。值为0表示可能被换出，需要从磁盘中读取。此时，其他bit位存放的是物理内存页在磁盘中的位置；
- `R/W(1)`：值为0表示该物理页只读，针对该页面的写操作触发`page fault`异常。比如，使用`fork`创建子进程之后，父子进程内存空间完全一样，页表中的内容也是一样的，父子进程中的PTE均指向同一物理内存。此时，内核将父子进程中的PTE均修改为只读的，并将父子进程共同映射的这个物理内存引用计数+1。当子进程需要进行写操作时，在内核的`page fault`异常处理时，发现这个物理页面的引用计数大于1，说明是多进程共享同一个物理内存，将进行`写时拷贝(Copy On Write， COW)`，内核为子进程重新分配一个物理页，复制原有物理页中的内容到新物理页，减少物理页面的引用计数，并修改子进程`PTE`中的`R/W`标志位。
- `PCD(2)`：`Page Cache Disable`，表示`PTE`指向的物理内存页面中的内容，是否可以被缓存到`Cache`中。在`SOC`异构处理器共享同一块物理内存时，可以使用`PCD`创建禁止`Cache`的`PTE`。
- `PWT(3)`: `Page Write-Through`，表示`PTE`指向的`CPU Cache`中的内容，是直接写入物理内存(Write-Through)，还是在`Cache-line`被中的内容被替换时写入物理内存(Write-Back)。

## 4. 缺页处理过程

当调用`malloc`时，内核**不会立即分配物理内存**，仅在进程的虚拟地址空间中创建`VMA(vm_area_struct)`，记录该段虚拟地址的范围和权限。此时`PTE`尚未建立或`P`位为`0`。当进程首次访问该虚拟地址时，`MMU`触发`Page Fault`异常，CPU陷入内核态。

内核根据异常地址查找进程的`VMA`，按以下三种情况处理：

**情况一：非法地址** —— 地址不属于任何`VMA`，内核向进程发送`SIGSEGV`（`Segmentation Fault`），进程被终止。

**情况二：首次访问（页面尚未分配物理内存）** —— `PTE`为空，内核分配物理页框、清零、建立`PTE`映射（读操作可先映射到共享零页，写时再分配，即`COW`）。

**情况三：页面被换出到 Swap** —— `PTE`的`P`位为0，其余位记录了`Swap`位置。内核分配新物理页框，从`Swap`读回数据，更新`PTE`并置`P`位为1。

### 4.1 物理内存分配完成之后

`PTE`映射建立后，内核刷新`TLB`使旧缓存失效，然后返回用户态**重新执行**触发异常的指令。`MMU`此次通过`Table Walk Unit`查到有效`PTE`，完成`VA → PA`转换并缓存到`TLB`，CPU正常访问物理内存。

![mmu_page_fault_process](/assets/images/cpu/mmu_20240808/mmu_malloc_flow.jpg)

## 参考

- [知乎 -- 图解MMU](https://zhuanlan.zhihu.com/p/487386274)
- [简书 -- ARM体系架构——MMU](https://www.jianshu.com/p/ef1e93e9d65b)
- [一步一图带你构建 Linux 页表体系 —— 详解虚拟内存如何与物理内存进行映射](https://www.cnblogs.com/binlovetech/p/17571929.html)
- [CPU入门扫盲篇之MMU内存管理单元------万字长文带你搞定MMU&TLB&TWU](https://blog.csdn.net/weixin_65286359/article/details/135577694)
- [一步一图带你深入理解Linux物理内存](https://mp.weixin.qq.com/s?__biz=Mzg2MzU3Mjc3Ng==&mid=2247486879&idx=1&sn=0bcc59a306d59e5199a11d1ca5313743&chksm=ce77cbd8f90042ce06f5086b1c976d1d2daa57bc5b768bac15f10ee3dc85874bbeddcd649d88&scene=178&cur_album_id=2559805446807928833#rd)
- [五万字 \| 深入理解Linux内存管理](https://mp.weixin.qq.com/s/nlMGEhuaDUYqV6r8A4cRlA)
- [How Does the Memory Management Unit (MMU) Work with the Unix/Linux Kernel?](https://chessman7.substack.com/p/how-does-the-memory-management-unit)
