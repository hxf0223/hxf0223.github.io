---
layout: post
title: Ubuntu 及 Windows 系统下安装 Qt5
date: 2023-06-10 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Qt]
tags: [Qt]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. Ubuntu 安装 Qt5 命令

安装`Qt5`：

```bash
sudo apt install qtbase5-dev qtchooser qt5-qmake qtbase5-dev-tools qtmultimedia5-dev qttools5-dev qttools5-dev-tools qtcreator libqt5svg5-dev libqt5charts5 libqt5charts5-dev qtdeclarative5-dev libqt5xmlpatterns5-dev libqt5x11extras5-dev cmake-qt-gui
```

```bash
sudo apt-get -y install build-essential cmake gcc git lib32ncurses-dev lib32z1 libfox-1.6-dev libsdl1.2-dev software-properties-common wget zip python3-pip-whl python3-pil libgtest-dev python3-pip python3-tk python3-setuptools clang-14 python3-clang-14 libusb-1.0-0-dev stlink-tools openocd npm pv libncurses5:i386 libpython2.7:i386 libclang-14-dev python-is-python3
```

## 2. cmake find_package for Qt5

```cmake
find_package(
  Qt5
  COMPONENTS Core Gui Widgets Network Svg Charts
  REQUIRED)
```

## 3. 在线安装包 Qt5

同时适用于`windows`/`linux`平台：

下载在线安装包：[Qt downloads](https://download.qt.io/official_releases/online_installers/)

安装命令：

```bash
.\qt-unified-windows-x64-online.exe --mirror https://mirrors.ustc.edu.cn/qtproject
```

升级/维护时使用国内镜像：

```bash
# 可以创建快捷方式
MaintenanceTool.exe --mirror https://mirror.nju.edu.cn/qt
```

## 4. 额外链接

- [gist](https://gist.githubusercontent.com/simos/8de45464687d87407041e4c2d2f69500/raw/4530829479584f290a91020a75c4f6e360492704/setup_buildenv_ubuntu22.04.sh)
- [Which dev packages are needed to build a QtQuick application on Ubuntu 20.04?](https://stackoverflow.com/questions/64882226/which-dev-packages-are-needed-to-build-a-qtquick-application-on-ubuntu-20-04)
