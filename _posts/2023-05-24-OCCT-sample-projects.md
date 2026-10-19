---
layout: post
title: OCCT projects on github
date: 2023-05-24 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OCCT]
tags: [OCCT, CAD]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## OCCT samples

需要安装 `OpenGL`： [基于Ubuntu搭建OpenGL开发环境](https://www.cnblogs.com/jiujiubashiyi/p/16429717.html)

```bash
sudo apt-get install libglfw3-dev
sudo apt install mesa-utils
```

以下两个项目均来自 [github gkv311](https://github.com/gkv311)

- [occt-samples-qopenglwidget](https://gitee.com/occt/occt-samples-qopenglwidget.git)
- [occt-hello](https://gitee.com/occt/occt-hello)

## OCCT 文章

### Boolean

一些`http`链接：

```txt
Open Cascade中的布尔操作 http://cppblog.com/eryar/archive/2013/01/17/197357.html
```

- [OpenCASCADE 布尔运算简介](https://www.cnblogs.com/opencascade/p/OCCT_BO_Intro.html)
- [OpenCasCade拓扑几何的布尔运算](https://blog.csdn.net/qq_22642239/article/details/97271457)
- [Boolean Operations](https://dev.opencascade.org/doc/overview/html/occt_user_guides__modeling_algos.html#occt_modalg_5)
- [OpenCascade Modeling Algorithms Boolean Operations](https://www.cnblogs.com/opencascade/p/3511140.html)

### Fillet

- [autoCAD doc Fillet](https://help.autodesk.com/view/ACD/2023/ENU/?guid=GUID-64F8B700-23B3-4BD6-8C03-66121AA13E8F)

### Mesh

- [Mesh](https://dev.opencascade.org/doc/overview/html/occt_user_guides__mesh.html)

### 来自Nvidia的CAD内核

- [USD BRep](https://github.com/NVIDIA-Omniverse/usd-brep)：NVIDIA 已在 GitHub 公开包含三维 CAD 几何内核 SMLib 的 USD BRep
  - [NVIDIA 以 Apache 2.0 公开 CAD 内核 SMLib｜USD BRep 里有什么、可以怎么用](https://cldnavi.com/zh/blog/nvidia-smlib-usd-brep-2026/)
