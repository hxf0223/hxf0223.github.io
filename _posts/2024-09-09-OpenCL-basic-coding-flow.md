---
title: OpenCL 端编程流程
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

