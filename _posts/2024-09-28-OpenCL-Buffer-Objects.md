---
layout: post
title: OpenCL Buffer Objects
date: 2024-09-28 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OpenCL]
tags: [OpenCL, Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. clCreateBuffer 分配内存 ##

创建 `OpenCL` 内存对象函数原型为：

```c++
clCreateBuffer(cl_context,   // 上下文
              cl_mem_flags,  // 内存对象的性质，见下表
              size_t,        // 内存对象数据块大小
              void *,        // host_ptr 主机数据内存地址（可以为空）
              cl_int *);
```

针对不同场景需求，`OpenCL`提供了不同的内存对象创建标志位。

### 1.1. CL_MEM_USE_HOST_PTR ###

```c++
auto src_matrix_ptr = aligned_malloc<int, 4096>(kMatrixSize * kMatrixSize);
// fill the matrix with data...

cl_mem clsrc = clCreateBuffer(context, CL_MEM_READ_ONLY | CL_MEM_USE_HOST_PTR, cl_buff_size, src_matrix_ptr, NULL);
```

由于是 `host malloc` 分配的内存，`runtime` 会分配一个相应的 `buffer`，`kernel`开始执行时，将从`host_ptr`拷贝到`OpenCL`的`buffer`中。<font color="#ff0000">应该避免使用该标志位</font>。

所谓`开始执行时`，是指`NDRangeKernel`创建的命令，在`device`上执行时，状态变为`Ready`的时候。

针对与`host`共享物理内存的`device`，如果`host_ptr`已经是地址对齐的，那么`runtime`应该不用分配内存了。如果`host_ptr`没有内存对齐，则`runtime`将进行拷贝操作。（要考虑物理内存页要连续？？）。

```text
Use this when an aligned buffer already exists on the host side.  It must be aligned to a 4096 byte boundary and be a multiple of 64 bytes or you don't actually get zero copy.
 Below clCreateBuffer takes a host address and returns a corresponding device address.
```

![CL_MEM_USE_HOST_PTR](/assets/images/opencl/clCreateBuffer/CL_MEM_USE_HOST_PTR.svg)

### 1.2. CL_MEM_ALLOC_HOST_PTR ###

```c++
cl_mem clsrc = clCreateBuffer(context, CL_MEM_READ_WRITE | CL_MEM_ALLOC_HOST_PTR, cl_buff_size, NULL, NULL);
int* map_cl_src = (int*)clEnqueueMapBuffer(queue, clsrc, CL_TRUE, CL_MAP_WRITE, 0, cl_buff_size, 0, NULL, NULL, &status);
memcpy(map_cl_src, src_matrix_ptr, cl_buff_size);
```

<font color="#ff0000">在`device`内存空间分配`buffer`。</font>通过使用`clEnqueueMapBuffer`提供对`host`的访问入口。这是最佳的内存分配方式，避免`runtime`内存拷贝操作。

![CL_MEM_ALLOC_HOST_PTR](/assets/images/opencl/clCreateBuffer/CL_MEM_ALLOC_HOST_PTR.svg)

### 1.3. CL_MEM_ALLOC_HOST_PTR | CL_MEM_COPY_HOST_PTR ###

添加 `CL_MEM_COPY_HOST_PTR` 标志位，`runtime` 会将 `host_ptr` 的数据拷贝到 `OpenCL` 的 `buffer` 中。<font color="#ff0000">适用于`host_ptr`没有内存地址对齐</font>。

### 1.4. 场景选择 ###

* 如果可能，尽量使用 `CL_MEM_ALLOC_HOST_PTR` 标志位，避免`runtime`内存拷贝操作。
* 如果`host_ptr`已经是地址对齐的，可以使用 `CL_MEM_USE_HOST_PTR` 标志位。
* 如果`host_ptr`没有内存地址对齐，可以使用 `CL_MEM_ALLOC_HOST_PTR | CL_MEM_COPY_HOST_PTR` 标志位。

### 1.5. 参考资料 ###

* [编程与调试 C++ -- OpenCL & CUDA 初探 -- 十三、内存问题探讨](https://sunocean.life/blog/blog/2022/04/16/opencl#%E5%86%85%E5%AD%98%E9%97%AE%E9%A2%98%E6%8E%A2%E8%AE%A8)
* [Intel Community -- Why is it needed to use CL_MEM_ALLOC_HOST_PTR | CL_MEM_COPY_HOST_PTR instead of just CL_MEM_COPY_HOST_PTR for Intel HD Graphics?](https://community.intel.com/t5/OpenCL-for-CPU/Why-is-it-needed-to-use-CL-MEM-ALLOC-HOST-PTR-CL-MEM-COPY-HOST/m-p/1070056)
* [Arm Guide to OpenCL Programming -- 8.3 Memory Allocation](/assets/pdf/opencl/Arm%20Guide%20to%20OpenCL%20Programming.pdf)
* [opencl-sdk_developer-guide-core-xeon_2018](/assets/pdf/opencl/opencl-sdk_developer-guide-core-xeon_2018-773005-773006.pdf)
* [Getting the Most from OpenCL™ 1.2: How to Increase Performance by Minimizing Buffer Copies on Intel® Processor Graphics](https://www.intel.com/content/www/us/en/developer/articles/training/getting-the-most-from-opencl-12-how-to-increase-performance-by-minimizing-buffer-copies-on-intel-processor-graphics.html)
