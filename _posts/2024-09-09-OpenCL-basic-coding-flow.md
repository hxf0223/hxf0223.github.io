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

## 1. 编程流程

![OpenCL 端编程流程](/assets/drawio/opencl-programing-flow.drawio.svg)

## 2. OpenCL 内存模型

![opencl-memory-model](/assets/images/opencl/opencl内存模型.png)

* `kernel` 函数中，使用关键字 `__global` 标示的变量，存储在上图中的 `Global Memory` 中；`__local` 标示的变量，存储在 `Local Memory` 中。
* `OpenCL` 也分 `WorkGroup`，使用`__local`修饰的变量，存储在`Local Memory`中，仅限于同一个 `WorkGroup` 中的 `Work Item` 可以共享访问该变量。
* `kernel` 函数中定义的变量，存储在 `Private Memory` 中，仅限于 `Work Item` 内可访问。
* `kernel` 函数也可以使用`值传参`，以及 `指针传参` ，一般不推荐值传参。

## 3. OpenCL work size -- 2D处理举例

