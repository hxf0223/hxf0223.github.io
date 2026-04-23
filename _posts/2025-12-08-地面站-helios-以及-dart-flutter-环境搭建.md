---
layout: post
title: 地面站 Helios 以及 Dart/Flutter 环境搭建
date: 2025-12-08 +0900 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Ardupilot]
tags: [Ardupilot, QGC, Helios, Dart, Flutter]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. Flutter 环境搭建

从[Flutter 南京大学镜像](https://mirror.nju.edu.cn/flutter/flutter_infra/releases/stable/windows/)下载并解压 Flutter SDK，当前最新版本3.41.7。

随后，将其子目录bin添加到系统环境变量Path中。并添加如下两个环境变量（以Linux环境为例）：

```bash
export FLUTTER_STORAGE_BASE_URL="https://mirrors.cernet.edu.cn/flutter"
export PUB_HOSTED_URL="https://mirrors.cernet.edu.cn/dart-pub"          # pub get
```

## 2. Helios 地面站

从[Helios GitHub 仓库](https://github.com/jamesagarside/helios)下载源码。

## A. 资源

- [Dart中文网站](https://dart.cn/)
- [Flutter 文档](https://docs.fluttercn.cn/)
- [Helios 官方网站](https://heliosgcs.com/)
