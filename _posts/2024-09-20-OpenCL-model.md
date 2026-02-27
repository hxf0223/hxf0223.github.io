---
layout: post
title: OpenCL 平台模型、执行模型
date: 2024-09-20 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OpenCL]
tags: [OpenCL, Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. 平台模型 ##

关键词：

* `OpenCL Device`
  * `CU` -- `Compute Unit`
    * `PE` -- `Processing Element`

![OpenCL 平台模型](/assets/images/opencl/OpenCL平台模型.png)

## 2. 内存模型 ##

![OpenCL 内存模型](/assets/images/opencl/opencl内存模型_OpenCL-Guide.jpg)

* [github -- OpenCL Guide --Memory Model](https://github.com/KhronosGroup/OpenCL-Guide/blob/main/chapters/opencl_programming_model.md#memory-model)

## 3. 执行模型 ##

### 3.1 Context ###

`Context` 是针对`Host`端编程而产生的概念，表示设备的执行环境，包含：

* `Devices`：一个或多个`OpenCL`物理设备；
* `Memory Objects`：`Host` 端和/或 `Device` 端可见的内存对象；
* `Program Objects`: 包含源码及编译后的二进制代码；
* `kernel Objects`：`Device` 端执行的函数对象；

![OpenCL 执行模型-Context](/assets/images/opencl/OpenCL执行模型--Context.png)

#### 3.1.1 命令队列 Command Queue ####

一个`Command Queue` 对应一个`Device`。一个 `Command Queue` 中的命令包含如下三种类型：

* `Kernel` 相关命令：执行 `Kernel` 函数；
* `Memory` 相关命令：
  * `host` <--> `device` 数据传输；
  * `host` <--> `device` memory map / unmap；
  * `Memory Objects` 之间数据传输；
* 同步相关命令；

除了主机端往命令队列中添加命令外，在设备端，`Kernel`执行的时候，也可以往`设备端`的命令队列中添加命令，比如启动 `Child kernel`。

如下图中的`Ended`表示所有该命令中的所有`Work Group`执行完毕，但可能`Child kernel`还没有执行完毕，以及更新`global memory`中的数据。

![OpenCL 执行模型-Command Queue State](/assets/images/opencl/OpenCL执行模型-Command_state.png)

关于每个状态的解释，参考 [OpenCL 3.0 Spec -- 3.2. Execution Model](https://registry.khronos.org/OpenCL/specs/3.0-unified/html/OpenCL_API.html#_execution_model)

1. `Queued`：初始状态；
2. `Submitted`：提交到`Device`，还没还有放入设备端的 `work pool` -- 比如需要的资源没有准备好，或者`work pool` 满；
3. `Ready`：命令提交到`work pool`，等待被调度；
4. `Running`：已经被调度器调度到 `CU` 开始执行；
5. `Ended`：所有 `work group` 执行完毕；
6. `Complete`：`Child kernel` 执行完毕，`global memory` 中的数据更新完毕；

* 个人理解：一个`Command Queue` 同时存在于主机端，以及设备端 ？？

### 3.2 NDRange -- 索引空间 ###

表示一维 / 二维 / 三维索引空间：global index, group index, local index。

`OpenCL` 软件调度将全局 `work items` 按 `group` 为单位，分配给 `CU`（一个 `CU` 包含多个 `PE`）。`CU`执行完当前 `group` 后，再调度下一个 `group` 到 `CU` 上执行。

![OpenCL 执行模型-NDRange](/assets/images/opencl/OpenCL执行模型--NDRange.png)

### 3.3 Work-Item index 关系 ###

划分好 `work group size` 之后，可以相互换算`global index` 和 `local index`，以及 `group index`。例如`matrix`大小为 $G_{x}$ x $G_{y}$，将其划分为 $W_{x}$ x $W_{y}$ 个工作组， 每个工作组的大小为 $L_{x}$ x $L_{y}$，则：

$$
\begin{cases}
L_{x} = G_{x} / W_{x} \\
L_{y} = G_{y} / W_{y}
\end{cases}
$$

根据工作项ID（$l_x$, $l_y$）可以计算出全局ID（$g_x$, $g_y$）：

$$
\begin{cases}
g_x = w_x * L_{x} + l_x \\
g_y = w_y * L_{y} + l_y
\end{cases}
$$

相反的，根据全局ID，计算出工作项ID，以及工作组ID，只需要分别进行取余、除法运算即可。

![OpenCL 执行模型-Work-Item index 关系](/assets/images/opencl/OpenCL执行模型--index.png)

## 4. 编程模型 ##

### 4.1 编程模型 ###

![OpenCL 编程模型](/assets/images/opencl/OpenCL编程模型.png)

### 4.2 编程流程 ###

![OpenCL 编程流程](/assets/images/opencl/OpenCL编程流程.png)

## 5. 参考资料 ##

* [一文说清OpenCL框架](https://www.cnblogs.com/LoyenWang/p/15085664.html)
* [OpenCL 平台模型 - 执行模型 - 内存模型 - 编程模型](https://blog.csdn.net/chengyq116/article/details/108045936)
* [OpenCL 3.0 Spec](https://registry.khronos.org/OpenCL/specs/3.0-unified/html/OpenCL_API.html)

## 6. 附加资料 ##

* [Emulating Command Buffer Extensions with OpenCL Layers](https://www.iwocl.org/wp-content/uploads/6895-James-Brodman-Intel.pdf)
* [github -- Intercept Layer for OpenCLTM Applications](https://github.com/intel/opencl-intercept-layer)

