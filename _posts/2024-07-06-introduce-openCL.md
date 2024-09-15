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

## 0. GPU驱动相关

```bash
sudo add-apt-repository ppa:oibaf/graphics-drivers
```

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

* 额外安装：`Intel OpenCL Runtime`，用于支持在`CPU`上运行`OpenCL`程序（模拟`GPU` ??），需要先安装`OpenCL Loader`(Installable Client Driver Loader，`ICD Loader`)。参考 http://liujiayi771.github.io/2019/01/18/ubuntu%E5%AE%89%E8%A3%85OpenCL%E8%BF%90%E8%A1%8C%E5%8F%8A%E7%BC%96%E8%AF%91%E7%8E%AF%E5%A2%83/。

### 1.3 参考

* [Getting started with OpenCL on Ubuntu Linux](https://github.com/KhronosGroup/OpenCL-Guide/blob/main/chapters/getting_started_linux.md)
* [CMake Build System Support](https://github.com/KhronosGroup/OpenCL-Guide/blob/main/chapters/cmake_build-system_support.md)
* [Khronos Community -- OpenCL](https://community.khronos.org/c/opencl)
* [Intel Community -- OpenCL* for CPU](https://community.intel.com/t5/OpenCL-for-CPU/bd-p/opencl)

## 2. 资源

1. [OpenCL SDK](https://github.com/KhronosGroup/OpenCL-SDK)
2. [OpenCL C++ Bindings](https://github.com/KhronosGroup/OpenCL-CLHPP)
3. [OpenCL 2.0 异构计算 第三版](https://chenxiaowei.gitbook.io/heterogeneous-computing-with-opencl2-0)
4. [一文说清OpenCL框架](https://www.cnblogs.com/LoyenWang/p/15085664.html)

## 3. 安装 Intel OpenCL 支持(Ongoing)

### 3.1 安装 Intel OpenCL Runtime for GPU

安装步骤，以及遇到问题的解决办法：

* 安装 `Intel OpenCL Runtime`：[github -- Intel OpenCL Runtime](https://github.com/intel/compute-runtime/releases)
* [Intel ARC intel-i915-dkms dpkg error upgrading to HWE kernel 6.5](https://askubuntu.com/questions/1504148/intel-arc-intel-i915-dkms-dpkg-error-upgrading-to-hwe-kernel-6-5)
* [How To Deploy OpenCL™ Code on Intel® Hardware](https://www.intel.com/content/www/us/en/developer/tools/opencl/run.html)
* [openCL on Ubuntu still can't detect my intel graphics platform after I install some relevant drivers](https://community.intel.com/t5/GPU-Compute-Software/openCL-on-Ubuntu-still-can-t-detect-my-intel-graphics-platform/m-p/1164878)

### 3.2 安装额外支持包

安装如下包 (可能不是必须的)：

```bash
sudo apt-get install xserver-xorg-video-intel
sudo apt-get install mesa-utils
```

### 3.3 使能 User 用户权限

权限使能，并重启系统。(如果`GPU`已经使能，不添加权限只能使用`sudo`查看到`GPU`设备)

```bash
sudo usermod -a -G render $USER
sudo usermod -a -G video $USER
```

### 3.4 验证

```bash
clinfo -l

Platform #0: Intel(R) OpenCL
 `-- Device #0: Intel(R) Core(TM) i5-8260U CPU @ 1.60GHz
Platform #1: Intel(R) OpenCL Graphics
 `-- Device #0: Intel(R) UHD Graphics 620
```
