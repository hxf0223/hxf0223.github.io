---
layout: post
title: Windows 环境编译 VTK 
date: 2024-09-05 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp, CAD, VTK]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. 依赖项 ##

从`OpenCascade`官网下载编译好的包，提取里面的依赖包。下载地址：[OpenCascade](https://dev.opencascade.org/release)

## 批量编译 VTK -- 同时编译Debug/Release版本 ##

使用`CMake`生成完成之后，打开`Visual Studio`进行编译。

选择`生成` -> `批生成`，选取如下 `Debug Install`、`Release Install`即可，并开始编译。编译时间较长。

![batch_build_vtk_windows](/assets/images/vtk/vtk_batch_build_windows.png)
