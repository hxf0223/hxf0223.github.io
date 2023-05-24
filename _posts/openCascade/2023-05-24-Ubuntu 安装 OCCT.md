---
title: Ubuntu 安装 OCCT
date: 2023-05-24 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OCCT]
tags: [occt]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 编译命令

### 编译第三方库

* 注意要 `tcl-dev`, `tk-dev`, `tcllib`, `tklib`，除非自己编译安装，此时要设置TCL/TK相关的路径，比较麻烦。

```bash
sudo apt-get install tcllib tklib tcl-dev tk-dev libfreetype-dev libx11-dev libgl1-mesa-dev libfreeimage-dev
sudo apt-get install rapidjson-dev libdraco-dev
```

### 编译 OCCT

```bash
cd opencascade-7.7.0
mdkir build && cd build
make -j6
sudo make install
```

## 国内学习博客

* [OpenCascade基本框架介绍-昨夜星辰 (hustlei.github.io)](https://hustlei.github.io/2014/10/opencascade-introduction-and-compile.html)
* [OpenCASCADE入门指南 - opencascade - 博客园 (cnblogs.com)](https://www.cnblogs.com/opencascade/p/OpenCASCADE_StartGuide.html)
* [2.OpenCASCADE - eryar - C++博客 (cppblog.com)](http://cppblog.com/eryar/category/17808.html?Show=All)

## 引用资料

* [Build 3rd-parties - Open CASCADE Technology Documentation](https://dev.opencascade.org/doc/overview/html/build_upgrade_building_3rdparty.html#build_3rdparty_linux)
* [Build OCCT - Open CASCADE Technology Documentation](https://dev.opencascade.org/doc/occt-7.6.0/overview/html/build_upgrade__building_occt.html#build_occt_win_cmake)
* [Download - Open CASCADE Technology](https://dev.opencascade.org/release)
