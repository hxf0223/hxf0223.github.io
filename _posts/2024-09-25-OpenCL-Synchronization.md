---
title: OpenCL 同步操作
date: 2024-09-25 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OpenCL]
tags: [OpenCL, cpp]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. Barrier ##

### 1.1 clEnqueueBarrierWithWaitList ###

```c++
// Provided by CL_VERSION_1_2
cl_int clEnqueueBarrierWithWaitList(
    cl_command_queue command_queue,
    cl_uint num_events_in_wait_list,
    const cl_event* event_wait_list,
    cl_event* event);

cl_int clWaitForEvent(
  cl_uint num_events,
  const cl_event *event_list
);
```

用于在`OpenCL`命令队列中插入一个`同步点`。其作用对象限于一个 `command queue`。

* 如果 `event_wait_list` 为空，则需要该同步点命令(`clEnqueueBarrierWithWaitList`)之前的命令全部执行完成，才能执行其之后的命令。
* 如果 `event_wait_list` 不为空，则需要等到所有事件都完成（`CL_COMPLETE`），才能执行其之后的命令。

如果 `event` 不为空，可以用这个 `event` 阻塞`host`直到该命令执行完成(`CL_COMPLETE`)。

## 2. 同步点 ##

### 2.1 clFinish ###

```c++
cl_int clFinish(cl_command_queue command_queue);
```

`clFinish` 也会在命令队列里面添加一个`同步点`，与 `clEnqueueBarrierWithWaitList` 不同的是，`clFinish` 对 `host` 是阻塞的。

### 2.2 event ###

`event` 也是一种`同步点`，用于同步设备与 `host`。所有 `clEnqueueXXXX` 函数，都可以设置 `event` 列表。

### 2.3 其他阻塞操作 ###

其他几个 `clEnqueueXXXX` 命令，如果将同步参数设置为 `CL_TRUE`，则为阻塞执行

* `clEnqueueReadBuffer`，`clEnqueueReadBufferRect`，`clEnqueueReadImage`
* `clEnqueueWriteBuffer`，`clEnqueueWriteBufferRect`，`clEnqueueWriteImage`
* `clEnqueueSVMMemcpy`，`clEnqueueSVMMap`
* `clEnqueueMapBuffer`

其他阻塞命令：

* `clReleaseCommandQueue`
* `clWaitForEvents`

1. 所有 `阻塞命令` 都会调用 `clFlush`，将命令队列中的命令提交(`submit`)到设备。
2. 可以使用 `event` 对象实现不同命令队列之间的同步，不过需要显式/隐式调用 `clFlush` 提交命令到对应的命令队列/设备。
3. 一个命令队列只与一个设备关联。

## 3. 参考 ##

* [OpenCL API -- clEnqueueBarrierWithWaitList](https://registry.khronos.org/OpenCL/specs/3.0-unified/html/OpenCL_API.html#clEnqueueBarrierWithWaitList)
* [OpenCL API -- Flush and Finish](https://registry.khronos.org/OpenCL/specs/3.0-unified/html/OpenCL_API.html#_flush_and_finish)
