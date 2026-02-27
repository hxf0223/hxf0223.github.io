---
layout: post
title: OpenCL 同步操作
date: 2024-09-25 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OpenCL]
tags: [OpenCL, Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

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

### 1.2 work-group barrier ###

作用于同一个 `work-group` 内的所有 `work-item`。

```c++
void work_group_barrier(cl_mem_fence_flags flags);

void work_group_barrier(cl_mem_fence_flags flags,
                        memory_scope scope);
```

`flags` 含义：

* `CLK_LOCAL_MEM_FENCE`：The barrier function will either flush any variables stored in `local memory` or queue a memory fence to ensure correct ordering of memory operations to local memory.
* `CLK_GLOBAL_MEM_FENCE`：The barrier function will queue a memory fence to ensure correct ordering of memory operations to `global memory`. This can be useful when work-items, for example, write to buffer or image objects and then want to read the updated data.

参考：

* [Barriers in OpenCL](https://stackoverflow.com/questions/6890302/barriers-in-opencl)
* [OpenCL 1.2 man -- Barrier](https://manpages.debian.org/bullseye/opencl-1.2-man-doc/barrier.3clc.en.html)

## 2. 同步点 -- synchronization points ##

### 2.1 clFinish ###

```c++
cl_int clFinish(cl_command_queue command_queue);
```

`clFinish` 也会在命令队列里面添加一个`同步点`，与 `clEnqueueBarrierWithWaitList` 不同的是，`clFinish` 对 `host` 是阻塞的。

### 2.2 event ###

`event` 也是一种`同步点`：

1. 用于同步设备与 `host`，或者
2. 同一个 `context` 创建的不同 `command queue` 之间的同步。

所有 `clEnqueueXXXX` 函数，都可以设置 `event` 列表。

* `event` 可以适用于同一个 `context`(或者 `shared context`) 创建的不同 `command queue` 之间的同步；
* `event` 效率应该比较慢，因为要经过 `host` （个人理解）；

#### 2.2.1 场景：不同 `command queue` 之间的同步 ####

针对 `out-of-order` 命令队列里面的同步，使用 `event` 对象特别合适，执行如下操作并同步：

```c++
cl_event k_events[2]{};
err = clEnqueueNDRangeKernel(commands, kernel1, 1, NULL, &global, &local, 0, NULL, &k_events[0]);
err = clEnqueueNDRangeKernel(commands, kernel2, 1, NULL, &global, &local, 0, NULL, &k_events[1]);
err = clEnqueueNDRangeKernel(commands, kernel3, 1, NULL, &global, &local, 2, k_events, NULL);
```

#### 2.2.2 场景：`device` 代码等待 `host` 发送`event` ####

* `host` 创建 `event` 对象

使用 `clCreateUserEvent` 创建 `event` 对象：

```c++
cl_event clCreateUserEvent(cl_context context, cl_int
*errcode_ret);
```

* `host`在合适的时候设置 `event` 状态

```c++
cl_int clSetUserEventStatus(cl_event event, cl_int
execution_status);
```

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
* [OpenCL: A Hands-on Introduction](https://www.nersc.gov/assets/pubs_presos/MattsonTutorialSC14.pdf)

## 4. 更多资料 ##

* [OpenCL 3.0 man pages](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/)
* [OpenCL reference Guide](https://www.khronos.org/files/opencl30-reference-guide.pdf)
* [Intel Tools for OpenCL™ Applications](https://www.intel.com/content/www/us/en/developer/articles/tool/tools-for-opencl-applications.html)
* [CUDA Toolkit 4.0](https://developer.nvidia.com/cuda-toolkit-40)

论文资源：

* [Google Scholar](https://scholar.google.com/)
* [IEEE Xplore](https://ieeexplore.ieee.org/Xplore/guesthome.jsp?reload=true)
* [ACM Digital Library](https://dl.acm.org/)

