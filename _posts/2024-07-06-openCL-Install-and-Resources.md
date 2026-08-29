---
layout: post
title: OpenCL 环境准备及资料
date: 2024-07-06 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OpenCL]
tags: [OpenCL, Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
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

- 额外安装：`Intel OpenCL Runtime`，用于支持在`CPU`上运行`OpenCL`程序（模拟`GPU` ??），需要先安装`OpenCL Loader`(Installable Client Driver Loader，`ICD Loader`)。参考 [ubuntu安装OpenCL运行及编译环境](https://liujiayi771.github.io/2019/01/18/ubuntu%E5%AE%89%E8%A3%85OpenCL%E8%BF%90%E8%A1%8C%E5%8F%8A%E7%BC%96%E8%AF%91%E7%8E%AF%E5%A2%83/)。

### 1.3 参考

- [Getting started with OpenCL on Ubuntu Linux](https://github.com/KhronosGroup/OpenCL-Guide/blob/main/chapters/getting_started_linux.md)
- [CMake Build System Support](https://github.com/KhronosGroup/OpenCL-Guide/blob/main/chapters/cmake_build-system_support.md)
- [Khronos Community -- OpenCL](https://community.khronos.org/c/opencl)
- [Intel Community -- OpenCL\* for CPU](https://community.intel.com/t5/OpenCL-for-CPU/bd-p/opencl)

## 2. 资源

1. [官方 blog](https://www.khronos.org/blog/)
2. [Exploiting Task Parallelism with OpenCL: A Case Study](https://link.springer.com/content/pdf/10.1007/s11265-018-1416-1.pdf)
3. [OpenCL -- GPU 设备信息查询](https://opencl.gpuinfo.org/listdevices.php)

## 3. 安装 Intel OpenCL 支持

### 3.1 安装 Intel OpenCL Runtime for GPU

安装步骤，以及遇到问题的解决办法：

- 安装 `Intel OpenCL Runtime`：[github -- Intel OpenCL Runtime](https://github.com/intel/compute-runtime/releases)
- [Intel ARC intel-i915-dkms dpkg error upgrading to HWE kernel 6.5](https://askubuntu.com/questions/1504148/intel-arc-intel-i915-dkms-dpkg-error-upgrading-to-hwe-kernel-6-5)
- [How To Deploy OpenCL™ Code on Intel® Hardware](https://www.intel.com/content/www/us/en/developer/tools/opencl/run.html)
- [openCL on Ubuntu still can't detect my intel graphics platform after I install some relevant drivers](https://community.intel.com/t5/GPU-Compute-Software/openCL-on-Ubuntu-still-can-t-detect-my-intel-graphics-platform/m-p/1164878)

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

### 3.5 Intel OpenCL 调试

Intel OpenCL 调试，需要作一些设置。安装驱动以及调试符号等，对`GPU`硬件有要求（如要求GPU gen 12以上）；以及不同`GPU`硬件，支持的`Ubuntu`等linux发行版也不同。

- [Get Started with Intel® SDK for OpenCL™ Applications 2020 on Linux\* OS with Training Sample](https://www.intel.cn/content/www/cn/zh/developer/articles/guide/sdk-for-opencl-2020-gsg-linux-os.html)
- [Get Started with Intel® Distribution for GDB* on Linux* OS Host](https://www.intel.com/content/www/us/en/docs/distribution-for-gdb/get-started-guide-linux/2024-2/overview.html)

## 4. 升级 OpenCL 驱动，支持 OpenCL 3.0

```bash
# add PPA
sudo add-apt-repository ppa:kisak/kisak-mesa

# install MESA packages
sudo apt update
sudo apt full-upgrade
```

恢复默认MESA：

```bash
sudo apt install ppa-purge
sudo ppa-purge ppa:kisak/kisak-mesa
```

- [How to Install The Latest Mesa Graphics Driver in Ubuntu 20.04 / 21.04](https://ubuntuhandbook.org/index.php/2021/07/install-latest-mesa-ubuntu-20-04-21-04/#google_vignette)

## 5. AMD Windows 平台安装

`vcpkg`安装及`OpenCL`依赖包：

```bash
# 使用命令行终端，不能使用powershell终端
vcpkg --triplet x64-windows install sfml tclap glm
```

编译`OpenCL`：

```bash
git clone --recursive https://github.com/KhronosGroup/OpenCL-SDK.git

# 需要指定 vcpkg.cmake 路径
cmake -D CMAKE_TOOLCHAIN_FILE=D:\dev_libs\vcpkg\scripts\buildsystems\vcpkg.cmake -D VCPKG_TARGET_TRIPLET=x64-windows -D BUILD_TESTING=OFF -D BUILD_DOCS=OFF -D BUILD_EXAMPLES=OFF -D BUILD_TESTS=OFF -D OPENCL_SDK_BUILD_SAMPLES=ON -D OPENCL_SDK_TEST_SAMPLES=OFF -D CMAKE_INSTALL_PREFIX=D:\dev_libs\opencl ..
```
