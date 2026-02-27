---
layout: post
title: Ubuntu 编译 Qt + VTK + OCCT + samples
date: 2023-05-25 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OCCT]
tags: [OCCT]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. 卸载安装的Qt，编译安装Qt

实践发现使用安装的`Qt`，编译带`samples`的`OCCT`在`CMake`阶段就出错（可能是Ubuntu系统中环境有问题，或者是没有完整设置`Qt`相关变量）。

使用手动编译安装的`Qt`，并设置好相关环境变量可正常编译带`samples`的`OCCT`。手动编译安装`Qt`见：[VTK（1）：ubuntu 22.04 源码编译安装 Qt5.15.6](https://www.cnblogs.com/vaughnhuang/articles/16678048.html) 。

## 2. 编译 VTK

[VTK （2）：ubuntu 22.04 编译 VTK 9.2 rc2](https://www.cnblogs.com/vaughnhuang/articles/16683118.html)

## 3. 编译 OCCT 及 samples

顶层`CMakeLists.txt`中有变量`BUILD_SAMPLES_QT`控制是否编译`samples`（包括qt相关samples）。

```bash
cmake -D3RDPARTY_QT_DIR=/usr/local/Qt-5.15.6 -DCMAKE_BUILD_TYPE=Debug -DBUILD_SAMPLES_QT=ON ..
make -j
```

## 4. windows 安装 Qt

下载在线安装包：[Qt downloads](https://download.qt.io/official_releases/online_installers/)

安装命令：

```bash
.\qt-unified-windows-x64-online.exe --mirror https://mirrors.ustc.edu.cn/qtproject
```
