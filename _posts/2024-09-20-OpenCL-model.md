---
title: OpenCL 平台模型、执行模型
date: 2024-09-20 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OpenCL]
tags: [OpenCL, c++]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. 平台模型 ##

关键词：

* `OpenCL Device`
  * `CU` -- `Compute Unit`
    * `PE` -- `Processing Element`

![OpenCL 平台模型](/assets/images/opencl/OpenCL平台模型.png)

## 2. 执行模型 ##

### 2.1 Context ###

`Context` 是针对`Host`端编程而产生的概念，表示设备的执行环境，包含：

* `Devices`：一个或多个`OpenCL`物理设备；
* `Memory Objects`：`Host` 端和/或 `Device` 端可见的内存对象；
* `Program Objects`: 包含源码及编译后的二进制代码；
* `kernel Objects`：`Device` 端执行的函数对象；

![OpenCL 执行模型-Context](/assets/images/opencl/OpenCL执行模型--Context.png)

### 2.2 NDRange -- 索引空间 ###

表示一维 / 二维 / 三维索引空间：global index, group index, local index。

`OpenCL` 软件调度将全局 `work items` 按 `group` 为单位，分配给 `CU`（一个 `CU` 包含多个 `PE`）。`CU`执行完当前 `group` 后，再调度下一个 `group` 到 `CU` 上执行。

![OpenCL 执行模型-NDRange](/assets/images/opencl/OpenCL执行模型--NDRange.png)

### 2.3 Work-Item index 关系 ###

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

## 3. 编程模型 ##

### 3.1 编程模型 ###

![OpenCL 编程模型](/assets/images/opencl/OpenCL编程模型.png)

### 3.2 编程流程 ###

![OpenCL 编程流程](/assets/images/opencl/OpenCL编程流程.png)

## 4. 参考资料 ##

* [一文说清OpenCL框架](https://www.cnblogs.com/LoyenWang/p/15085664.html)
* [OpenCL 平台模型 - 执行模型 - 内存模型 - 编程模型](https://blog.csdn.net/chengyq116/article/details/108045936)