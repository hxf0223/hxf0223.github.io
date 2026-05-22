---
layout: post
title: Ubuntu安装Intel GPU驱动
date: 2023-05-24 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Linux, GPU]
tags: [Ubuntu, Intel, GPU]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

安装命令：

```bash
sudo apt install intel-media-va-driver vainfo mesa-utils

# 添加用户组
sudo usermod -aG render,video hxf0223
```

安装完成后，使用`vainfo`命令检查是否正确安装：

```bash
# tty需要加上--display drm参数，否则会提示无法打开显示设备(无桌面会话)
vainfo --display drm --device /dev/dri/renderD128
```

顺便安装上FFmpeg：

```bash
sudo apt install libv4l-dev v4l-utils
sudo apt install mesa-common-dev
sudo apt install ffmpeg libavfilter-dev libavdevice-dev libavutil-dev libavformat-dev libswresample-dev libswscale-dev
```

- [FFmpeg tutorials](https://github.com/ffiirree/ffmpeg-tutorials)：github上的FFmpeg教程，包含了很多使用FFmpeg的示例代码，可以参考学习。
