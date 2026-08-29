---
layout: post
title: Windows编译安装VTK, TCL/TK, OCC
date: 2025-03-11 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OCCT]
tags: [OCCT, VTK]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. 预编译及安装的三方库

- [zlib](https://zlib.net)
- [freeType](https://sourceforge.net/projects/freetype/files/freetype2/)
- [FreeImage](https://freeimage.sourceforge.io/download.html)

### 1.1. freeType

`freeType`在`Windows`下编译成动态库，需要做些修改：

根目录下`CMakeLists.txt`：

```bash
# add_library(freetype ....
add_library(freetype SHARED
...
)
```

- `freeType`编译之后，`cmake`配置`OCC`时找不到`freeType`相关库，使用官方提供的编译好的三方库替代[OCC Release](https://dev.opencascade.org/release)。

### 1.2. FreeImage

`FreeImage`选择下载编译好的文件（没有Debug版本）。或选择第三方修改的仓库[FreeImage-Cmake](https://github.com/swm8023/FreeImage-Cmake)

## 2. VTK

TODO

## 3. TCL/TK

下载及编译`TCL/TK 8.6.16`源码：

- TCL 8.6.16 http://prdownloads.sourceforge.net/tcl/tcl8616-src.zip
- TK 8.6.16 http://prdownloads.sourceforge.net/tcl/tk8616-src.zip

分别修改`TCL`及`TK`子目录`win`下的`rules.vc`文件：

```bash
# SUFX     = tsgx
# 修改为以下内容
SUFX     = sgx
```

编译及安装`TCL`：

```bash
nmake -f makefile.vc INSTALLDIR=d:\dev_libs\occ
nmake -f makefile.vc install INSTALLDIR=d:\dev_libs\occ
```

编译及安装`TK`：

```bash
nmake -f makefile.vc INSTALLDIR=d:\dev_libs\occ TCLDIR=D:\work\3rd\occ_packages\tcl8.6.16
nmake -f makefile.vc install INSTALLDIR=d:\dev_libs\occ TCLDIR=D:\work\3rd\occ_packages\tcl8.6.16
```

## 4. OCC

- [OCC Release](https://dev.opencascade.org/release)

## 参考

- [tcl/tk编译](https://www.cnblogs.com/gispathfinder/p/12183373.html)
- [Build 3rd-parties](https://dev.opencascade.org/doc/overview/html/build_upgrade_building_3rdparty.html)
