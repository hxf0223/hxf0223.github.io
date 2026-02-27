---
layout: post
title: Ubuntu 安装 OCCT
date: 2023-05-24 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OCCT]
tags: [OCCT]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## OCCT 依赖库

* [Introduction -- Requirements](https://dev.opencascade.org/doc/overview/html/index.html)

## 下载OpenCascade

`OCC 7.7`编译有问题，使能`VTK`时编译错误，下载最新版的`OCC`修复该问题：

```bash
# https://dev.opencascade.org/resources/git_repository
git clone https://git.dev.opencascade.org/repos/occt.git occt
```

## 编译安装命令

### 1. 编译安装第三方库

* 注意要 `tcl-dev`, `tk-dev`, `tcllib`, `tklib`，除非自己编译安装，此时要设置TCL/TK相关的路径，比较麻烦。

```bash
sudo apt install doxygen doxygen-gui graphviz graphviz-doc libx11-xcb-dev
sudo apt-get install tcllib tklib tcl-dev tk-dev libfreetype-dev libx11-dev libgl1-mesa-dev libfreeimage-dev
sudo apt-get install rapidjson-dev libdraco-dev
```

`tcl 8.6`编译安装命令(`tk 8.6`相同的编译配置命令)：

```bash
# https://www.tcl.tk/software/tcltk/8.6.html

cd tcl8.6.13/unix
./configure --enable-gcc  --enable-shared --enable-threads --enable-64bit
make && sudo make install
```

`freeType`编译安装命令：

```bash
# https://freetype.org/download.html

CFLAGS='-m64 -fPIC' CPPFLAGS='-m64 -fPIC' ./configure
make && sudo make install
```

`FreeImage`编译安装命令：

```bash
# https://freeimage.sourceforge.io/download.html
# 修改 Makefile.fip：增加 CXXFLAGS += -std=c++11
make -f Makefile.fip
# 拷贝头文件及 .so, .a 到相应目录
```

编译安装`fdk-acc`及`ffmpeg`:

```bash
# install dependencies
sudo apt install libavformat-dev libavcodec-dev libswresample-dev libswscale-dev libavutil-dev libsdl1.2-dev libx264-dev nasm

# tdk-acc
./configure && make && sudo make install

# ffmpeg
./configure --enable-gpl --enable-nonfree --enable-libfdk-aac --enable-libx264 --enable-filter=delogo --enable-shared --enable-pthreads
make && sudo make install
```

### 2. 编译安装 OCCT

```bash
cd opencascade-7.7.0
mdkir build && cd build

# 配置OCC编译，使能VTK, ITK等功能
ccmake ..

make -j6
sudo make install
```

几次配置截图之后，配置如下

![ccmake1](/assets/images/occ/ccmake01.png)

![ccmake2](/assets/images/occ/ccmake02.png)

### 3. 安装或编译 Qt5

* 安装 Qt5

```bash
sudo apt-get install qtbase5-dev qtchooser qt5-qmake qtbase5-dev-tools
sudo apt-get install qtcreator
```

* 编译 Qt5

编译及设置环境变量见 [VTK（1）：ubuntu 22.04 源码编译安装 Qt5.15.6](https://www.cnblogs.com/vaughnhuang/articles/16678048.html)

## 国内学习博客

* [OpenCascade基本框架介绍-昨夜星辰 (hustlei.github.io)](https://hustlei.github.io/2014/10/opencascade-introduction-and-compile.html)
* [OpenCASCADE入门指南 - opencascade - 博客园 (cnblogs.com)](https://www.cnblogs.com/opencascade/p/OpenCASCADE_StartGuide.html)

`http` 链接：

```txt
2.OpenCASCADE - eryar - C++博客 (cppblog.com) http://cppblog.com/eryar/category/17808.html?Show=All
```

## 引用资料

* [Build 3rd-parties - Open CASCADE Technology Documentation](https://dev.opencascade.org/doc/overview/html/build_upgrade_building_3rdparty.html#build_3rdparty_linux)
* [Build OCCT - Open CASCADE Technology Documentation](https://dev.opencascade.org/doc/occt-7.6.0/overview/html/build_upgrade__building_occt.html#build_occt_win_cmake)
* [Download - Open CASCADE Technology](https://dev.opencascade.org/release)
* [3rd party Components](https://dev.opencascade.org/resources/download/3rd-party-components)
* [TCL/TK 8.6](https://www.tcl.tk/software/tcltk/download.html)