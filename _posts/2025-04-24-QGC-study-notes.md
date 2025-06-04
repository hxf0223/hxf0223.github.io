---
title: QGC 学习资料
date: 2025-04-24 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [qgc]
tags: [qgc]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## QGC使用入门资料 ##

* [X-Mav QGroundControl快速上手指南](https://www.x-mav.cn/docs/QGroundControl-kuai-su-shang-shou-zhi-nan)
* [翼辉 QGroundControl](https://docs.acoinfo.com/dup/guide/qgc_usage.html)
* [官方user guide](https://docs.qgroundcontrol.com/Stable_V4.4/en/qgc-user-guide/)
* [官方dev guide](https://docs.qgroundcontrol.com/Stable_V4.4/en/qgc-dev-guide/)

## QGC开发入门资料 ##

* [QGC开发指南翻译+个人注解](https://zhuanlan.zhihu.com/p/647096410)
* [QGC分析（一）-整体分析和通信流程](https://blog.csdn.net/qaaaaaaz/article/details/130460042)

## 界面相关资料 ##

* [github FluentUI](https://github.com/zhuzichu520/FluentUI)
* [QianWindow](https://github.com/nuoqian-lgtm/QianWindow)
* [gitee amap](https://gitee.com/IOthellOI/amap)

## 其他地面站工程 ##

* [JAGCS -- 参考其代码架构](https://github.com/MishkaRogachev/JAGCS)
* [Simple GCS -- imGUI](https://github.com/Sanmopre/Simple_GCS)
* [ControlTower -- 基于 WayWise](https://github.com/RISE-Dependable-Transport-Systems/ControlTower)
* [WayWise: a rapid prototyping library for connected, autonomous vehicles](https://ccam-sunrise-project.eu/wp-content/uploads/2024/09/WayWise_Software_Impacts.pdf)

## QGC(master) 编译 ##

需要同时按照`runtime`版本和`devel`版本，安装完成之后，设置环境变量`GSTREAMER_1_0_ROOT_MSVC_X86_64`：

```bash
GSTREAMER_1_0_ROOT_MSVC_X86_64 = d:\dev_libs\gstreamer\1.0\msvc_x86_64\
```

* [Download GStreamer](https://gstreamer.freedesktop.org/download/#windows)
* [Gstreamer安装和使用](https://yadiq.github.io/2022/08/15/MediaGstreamerInstall/)
* [pkg-config for windows](https://github.com/lua-batteries/pkg-config/releases)
* [gstreamer 中文教程](https://www.cnblogs.com/O-ll-O/p/17438361.html)
* [常见问题：GStreamer的使用](https://kernel-zhang.github.io/posts/UsingGStreamer/)
* [PX4 -- Simulation](https://bresch.gitbooks.io/devguide/content/en/simulation/)

## QGC 核心架构图示 ##

UML 核心类图（下载本地放大查看）：

![QGC 主要 UML](/assets/images/qgc/20250604/qgc_uml.png)

核心系统分析图（下载本地放大查看）：

![QGC 主要系统分析](/assets/images/qgc/20250604/qgc_core_arch_call.png)

引用：

* [CSDN -- QGC(GGroundControl) 系统核心架构图](https://blog.csdn.net/qq_16504163/article/details/124005216)
