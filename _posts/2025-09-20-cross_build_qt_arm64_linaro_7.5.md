---
layout: post
title: 交叉编译 Qt 5.15.2
date: 2025-09-20 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Qt]
tags: [Qt]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. 下载

交叉编译器下载地址目录：[aarch64-linux-gnu](https://releases.linaro.org/components/toolchain/binaries/7.5-2019.12/aarch64-linux-gnu/)

- [gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnus](https://releases.linaro.org/components/toolchain/binaries/7.5-2019.12/aarch64-linux-gnu/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu.tar.xz)
- [sysroot-glibc-linaro-2.25-2019.12-aarch64-linux-gnu](https://releases.linaro.org/components/toolchain/binaries/7.5-2019.12/aarch64-linux-gnu/sysroot-glibc-linaro-2.25-2019.12-aarch64-linux-gnu.tar.xz)

下载之后，将编译器及`sysroot`解压到`/opt`目录下：

```bash
/opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu
/opt/sysroot-glibc-linaro-2.25-2019.12-aarch64-linux-gnu
```

`Qt 5.15.2`下载目录：[Qt 5.15.2](https://download.qt.io/archive/qt/5.15/5.15.2/single/) 。选择下载` qt-everywhere-src-5.15.2.tar.xz`。

## 2. 修改Qt源码

修改头文件：`qtbase/src/corelib/global/qglobal.h`，`include`添加：

```cpp
// 第44行开始的地方添加 <limits>，解决configure的时候报错找不到<limits>以及limits相关错误
#  include <limits>
// ....
```

拷贝（不拷贝，configure 的时候报错：Invalid target platform 'aarch64-linux-gnu-g++'）：

```bash
cp -r qtbase/mkspecs/linux-aarch64-gnu-g++ qtbase/mkspecs/aarch64-linux-gnu-g++
```

修改文件`qtbase/mkspecs/aarch64-linux-gnu-g++/qmake.conf`：

```conf
# modifications to g++.conf
QMAKE_CC                = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc
QMAKE_CXX               = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++
QMAKE_LINK              = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++
QMAKE_LINK_SHLIB        = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++

# modifications to linux.conf
QMAKE_AR                = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-ar cqs
QMAKE_OBJCOPY           = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-objcopy
QMAKE_NM                = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-nm -P
QMAKE_STRIP             = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-strip
```

## 3. 编译 Qt 源码

如下为编译一个比较精简的`Qt`库，去掉了很多模块。

```bash
#!/bin/sh

cd build-qt5-qtbase
yes | rm -rf *

export SYSROOT=/opt/sysroot-glibc-linaro-2.25-2019.12-aarch64-linux-gnu
export CROSS_PREFIX=aarch64-linux-gnu-
export DEST_PREFIX=/opt/qt5-aarch64-gcc-linaro-7.5.0
export TOOLCHAIN_PREFIX=/opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin
export PATH=$TOOLCHAIN_PREFIX:$PATH
export PKG_CONFIG_LIBDIR=${SYSROOT}/lib/pkgconfig:${SYSROOT}/share/pkgconfig
export PKG_CONFIG_PATH=${SYSROOT}/lib/pkgconfig:${SYSROOT}/share/pkgconfig

../configure -pkg-config -xplatform aarch64-linux-gnu-g++ -prefix $DEST_PREFIX -release -opensource -confirm-license -sysroot $SYSROOT -nomake tests -nomake examples -skip qtwebengine -skip qt3d -skip qtwebview -skip qtnetworkauth -skip qtserialport -skip qtsensors -skip qtmultimedia -skip qtdoc -skip qtmacextras -skip qtandroidextras -no-opengl

# 添加skip qtlocation，qtlocation编译报错
# ../configure -pkg-config -xplatform aarch64-linux-gnu-g++ -prefix $DEST_PREFIX -release -opensource -confirm-license -sysroot $SYSROOT -nomake tests -nomake examples -skip qtwebengine -skip qt3d -skip qtwebview -skip qtnetworkauth -skip qtserialport -skip qtsensors -skip qtmultimedia -skip qtdoc -skip qtmacextras -skip qtandroidextras -skip qtlocation -no-opengl

# 去掉几乎所有界面相关模块，只保留QtGui，QtWidget界面组件
# ../configure -pkg-config -xplatform aarch64-linux-gnu-g++ -prefix $DEST_PREFIX -release -opensource -confirm-license -sysroot $SYSROOT -nomake tests -nomake examples -skip qtwebengine -skip qt3d -skip qtwebview -skip qtnetworkauth -skip qtserialport -skip qtsensors -skip qtmultimedia -skip qtdoc -skip qtmacextras -skip qtandroidextras -skip qtlocation -skip qtdeclarative -skip qtquickcontrols -skip qtquickcontrols2 -skip qtgraphicaleffects -no-opengl

make -j8
sudo make install
```

## 4. 资料

- [qt5.15.2 交叉编译 arm64](https://august295.github.io/posts/qt5.15.2%E4%BA%A4%E5%8F%89%E7%BC%96%E8%AF%91arm64/)
