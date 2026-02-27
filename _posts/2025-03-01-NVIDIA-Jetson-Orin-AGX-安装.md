---
layout: post
title: NVIDIA Jetson Orin AGX 安装
date: 2025-03-01 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [NVIDIA, Jetson]
tags: [NVIDIA, Jetson, Orin]

# 以下默认false
math: true
mermaid: true
# pin: true

toc:
  sidebar: right
---

使用 Nvidia Jetson SDK Manager 安装 Jetson Orin AGX 系列设备的系统镜像。截止目前最新版为 6.2.2，系统镜像为 Ubuntu 22.04（SDK Manager 7.2 将升级到 Ubuntu 24.03）。安装完成之后，安装如下软件包：

```bash
# 安装 Python
sudo apt update
sudo apt install python3
sudo apt install python3-pip

# 安装 jtop
sudo pip3 install -U pip
sudo pip3 install jetson-stats
```

```bash
sudo apt install nvidia-jetpack
```

查看已经安装的组件：

```bash
 git clone https://github.com/jetsonhacks/jetsonUtilities.git
 # python jetsonInfo.py
```

## 参考资料

- [NVIDIA Jetson Linux 36.4](https://developer.nvidia.cn/embedded/jetson-linux-r3640)：官方资料页面，包含组件以及驱动源码下载列表
- [Nvidia Jetson AGX Orin开发板配置与使用](https://zhaoxuhui.top/blog/2024/03/27/notes-on-nvidia-jetson-agx-orin-installation.html)：安装更多软件包，比如 SLAM，深度学习框架等。
- [Nvidia Jetson AGX Orin系统刷写](https://yanjingang.com/blog/?p=9092)
