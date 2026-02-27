---
layout: post
title: Ubuntu 安装 OpenCV
date: 2024-08-23 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp, OpenCV]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 依赖项安装 ##

```bash
sudo apt-get update  
sudo apt-get install -y build-essential cmake pkg-config  
sudo apt-get install -y libjpeg-dev libpng-dev libtiff-dev  
sudo apt-get install -y libavcodec-dev libavformat-dev libswscale-dev libv4l-dev  
sudo apt-get install -y libxvidcore-dev libx264-dev  
sudo apt-get install -y libgtk2.0-dev libgtk-3-dev  
sudo apt-get install -y libatlas-base-dev gfortran  
sudo apt-get install -y python3-dev python3-numpy  
sudo apt-get install -y libtbb2 libtbb-dev libdc1394-22-dev  
sudo apt-get install -y libopencv-dev
```

## 下载 OpenCV 源码 ##

```bash
git clone https://github.com/opencv/opencv.git
git clone https://github.com/opencv/opencv_contrib.git  

# opencv opencv_contrib 检出同一个版本
```

## 编译 OpenCV ##

`cmake`配置过程中，需要下载依赖包。设置代理：

```bash
export http_proxy=http://192.168.9.165:10809
export https_proxy=http://192.168.9.165:10809
```

1. 编译选项`OPENCV_EXTRA_MODULES_PATH`设置extra模块路径：`~/tmp/opencv/opencv_contrib/modules`。
2. `OpenCV`还依赖其他第三方库：TBB、Eigen、VTK 等。可以先安装上。

## 参考 ##

- [cmake编译opencv指南](https://www.cnblogs.com/zjutzz/p/6714490.html)

