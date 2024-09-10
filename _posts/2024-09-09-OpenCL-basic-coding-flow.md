---
title: OpenCL 端编程流程及主要概念实践
date: 2024-09-09 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OpenCL]
tags: [OpenCL, c++]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 0. OpenCL 概念

* 平台 platform：`OpenCL` 实现的顶层容器，通常对应于一个 `OpenCL` 的实现厂商；
* 设备 device：执行 `OpenCL` 程序的硬件设备，可以是 `CPU`、`GPU`、`FPGA`，或其他计算加速设备；
* 上下文 context：管理设备和资源的的环境，`一个上下文可以包括多个 device`；
* 命令队列 command queue：向设备发送命令的队列，一个命令队列与一个给定的 `device` 相关联；
* 程序 program：CL 代码及其编译后的二进制，包含一个或多个 `kernel`；
* 内核 kernel：在设备上执行的函数，这是 OpenCL 程序的核心；
* 工作项 work item：`kernel` 执行的一个实例，类似于线程；
* 工作组 work group：工作项的集合，集合内的 work item 共享一个 `Local Memory`，以及进行同步；

## 1. 编程流程

![OpenCL 编程流程2](/assets/images/opencl/opencl_proram_flow_ref.png)

编程步骤如下：

![OpenCL 端编程流程](/assets/drawio/opencl-programing-flow.drawio.svg)

一个示例源码：[opencl_002_array_add](https://gitee.com/open-gl_3/opencl_002_array_add)

## 2. OpenCL 内存模型

![opencl-memory-model](/assets/images/opencl/opencl内存模型.png)

* `kernel` 函数中，使用关键字 `__global` 标示的变量，存储在上图中的 `Global Memory` 中；`__local` 标示的变量，存储在 `Local Memory` 中。
* `OpenCL` 也分 `WorkGroup`，使用`__local`修饰的变量，存储在`Local Memory`中，仅限于同一个 `WorkGroup` 中的 `Work Item` 可以共享访问该变量。
* `kernel` 函数中定义的变量，存储在 `Private Memory` 中，仅限于 `Work Item` 内可访问。
* `kernel` 函数也可以使用`值传参`，以及 `指针传参` ，一般不推荐值传参。

## 3. 概念解释：work group、work item 与 设置 index

使用 `clEnqueueNDRangeKernel` 时，需要设置维度参数，函数原型如下：

```c++
cl_int clEnqueueNDRangeKernel(
    cl_command_queue command_queue, // 命令队列
    cl_kernel kernel,               // 要执行的内核
    cl_uint work_dim,               // 工作维度，范围是1到3
    const size_t *global_work_offset, // 全局工作项的偏移
    const size_t *global_work_size,   // 全局工作项的大小
    const size_t *local_work_size,    // 局部工作项的大小
    cl_uint num_events_in_wait_list,  // 依赖的事件数量
    const cl_event *event_wait_list,  // 依赖事件的列表
    cl_event *event                  // 返回的事件
);
```

* `work_dim`: 工作维度，表示 `kernel` 函数的执行次数，可以是 1, 2,3；
* `global_work_offset`: 全局工作项的偏移量，可以设为 NULL，表示从 (0,0,0) 开始；
* `global_work_size`: 全局工作项的大小，例如对于一个 `1024x1024` 的矩阵/图像，设置为 `(1024, 1024)`；
* `local_work_size`：指定每个 `work group` 分配的 `work item` 数量；

例如如下代码设置 `global_work_size`，`local_work_size`：

```c++
size_t global_work_size[2] = {1024, 1024}; // 1024x1024 的全局工作区
size_t local_work_size[2] = {16, 16};      // 16x16 的局部工作区

// 启动 kernel
cl_int err = clEnqueueNDRangeKernel(
    queue,
    kernel,
    2,               // 2 维
    NULL,            // 全局偏移量设为 NULL
    global_work_size,// 全局工作区大小
    local_work_size, // 局部工作区大小
    0,               // 没有依赖的事件
    NULL,            // 没有依赖的事件列表
    NULL             // 不需要返回的事件句柄
);
```

