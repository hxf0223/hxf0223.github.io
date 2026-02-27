---
layout: post
title: OCC boolean operations
date: 2024-05-22 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OCCT]
tags: [OCCT]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

- [OpenCASCADE 布尔运算简介](https://www.cnblogs.com/opencascade/p/OCCT_BO_Intro.html)
- [Boolean Operations](https://dev.opencascade.org/doc/overview/html/specification__boolean_operations.html)
- [OpenCascade功能及模块简介](https://hustlei.github.io/2014/10/opencascade-module-introduction.html)

个人理解：由于`OCCT`采用`BRep（边界表示）`表示方式，在做`boolean`操作时，计算出诸如`edge/edge`，`face/face`的交界面/点等，并存储供后面使用。

## 1. 干涉检测

计算出`Objects`与`Tools`的各种干涉类型：如`vertex`与`vertex`/`edge`/`face`/`solid`之间的干涉数据，`edge`与`edge`/`face`/`solid`之间的干涉数据，`face`与`face`/`solid`之间的干涉数据。主要是`edge`与`edge`之间的干涉检查。

存储的干涉数据以`P_curves`，`Pave`形式存储。`P_Curves`是指比如一条边与一个面相交，需要在面上构建一条曲线来表示这条相交边。`P_Curves`存储边与面的相交信息（如交点、切线）。

`Pave`是表示边界点的数据结构，出了位置外，还包含了曲率、方向等信息。在`boolean`过程中，需要用`Pave`存储相交信息。`Pave`是构建`P_Curves`（以及其他数据）的基础。

## 2. General Fuse Algorithm (GFA)

步骤如下：

init -> calc vertex/vertex interferences -> calc vertex/edge interferences -> update Pave block -> calc edge/edge interferences -> calc vertex/face interferences -> calc edge/face interferences -> build split edges（构建分割边）-> calc face/face interferences -> build Section Edges（构建截面边）-> build P_Curves ->Process Degenerated Edges（处理退花边）。

### 2.1 分割边

其中，构建分割边，是指：

1. 识别形状之间的交线
2. 根据交线在`Objects`的形状上构建新的边
3. 将这些新构建的边作为分割边
4. 根据分割边，将`Objects`的形状划分为若干个子形状

构建好分割边后,后续的布尔运算就可以基于这些分割后的子形状进行计算,得到最终的结果形状。

### 2.2 截面边

