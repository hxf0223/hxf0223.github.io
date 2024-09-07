---
title: OpenCL 环境准备及资料
date: 2024-07-06 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OpenCL]
tags: [OpenCL，c++]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. OpenCL 环境准备

### 1.1 查看 OpenCL 设备

```bash
# 查看 GPU 设备
lspci | grep -i vga

sudo apt install clinfo
```

使用 `clinfo` 命令查看 OpenCL 版本。`C++` 程序需要定义`OpenCL`版本：

```c++
target_compile_definitions(${target_name} PRIVATE CL_TARGET_OPENCL_VERSION=300)
```

### 1.2 安装 OpenCL SDK

```bash
sudo apt install libstb-dev libsfml-dev libglew-dev libglm-dev libtclap-dev ruby doxygen -y

# 安装支持包：包括ICD Loader，SDK及头文件
sudo apt install ocl-icd-opencl-dev

git clone https://github.com/KhronosGroup/OpenCL-SDK.git --recursive
# 编译 & 安装 OpenCL SDK .....
```

* 额外安装：`Intel OpenCL Runtime`，用于支持在`CPU`上运行`OpenCL`程序（模拟`GPU` ??），需要先安装`OpenCL Loader`(Installable Client Driver Loader，`ICD Loader`)。参考 [ubuntu安装OpenCL运行及编译环境](http://liujiayi771.github.io/2019/01/18/ubuntu%E5%AE%89%E8%A3%85OpenCL%E8%BF%90%E8%A1%8C%E5%8F%8A%E7%BC%96%E8%AF%91%E7%8E%AF%E5%A2%83/)。

### 1.3 参考

* [Getting started with OpenCL on Ubuntu Linux](https://github.com/KhronosGroup/OpenCL-Guide/blob/main/chapters/getting_started_linux.md)
* [CMake Build System Support](https://github.com/KhronosGroup/OpenCL-Guide/blob/main/chapters/cmake_build-system_support.md)

## 参考资料

1. [OpenCL SDK](https://github.com/KhronosGroup/OpenCL-SDK)
2. [OpenCL C++ Bindings](https://github.com/KhronosGroup/OpenCL-CLHPP)
3. [OpenCL 2.0 异构计算 第三版](https://chenxiaowei.gitbook.io/heterogeneous-computing-with-opencl2-0)
4. [一文说清OpenCL框架](https://www.cnblogs.com/LoyenWang/p/15085664.html)
5. [Benchmarking OpenCL, OpenACC, OpenMP, and CUDA](https://arxiv.org/pdf/1704.05316)
