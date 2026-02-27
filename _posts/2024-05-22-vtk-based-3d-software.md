---
layout: post
title: 基于VTK的3D软件
date: 2024-05-17 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [VTK]
tags: [VTK]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. VisIt

- [VisIt](https://visit-dav.github.io/visit-website/)。
- [github](https://github.com/visit-dav/visit)。

## 2. Inviwo

它支持微软的`Windows`、苹果的`Mac OS`和开源的`Linux`，核心模块采用`C++`开发，支持`Python 3.9`版本以上的调用。底层的图形渲染采用 `OpenGL 3.3` 以上的核心模式，图形用户界面已经支持`Qt6`。

- [Inviwo](https://inviwo.org/)。
- [github](https://github.com/inviwo/inviwo)。

## 3. Voreen

- [website](https://www.uni-muenster.de/Voreen/)
- [source](https://www.uni-muenster.de/Voreen/download/index.html)

## 4. MegaMol

- [website](https://megamol.org/)
- [github](https://github.com/UniStuttgart-VISUS/megamol)

## 5. ParaView

- [website](https://www.paraview.org/)
- [github](https://github.com/Kitware/ParaView)

## 6. ttk

- [website](https://topology-tool-kit.github.io/)
- [github](https://github.com/topology-tool-kit/ttk)

## 7. Polyscope

Polyscope是一个年轻、有趣的可视化软件包。

- [website](https://polyscope.run/)
- [github](https://github.com/nmwsharp/polyscope)

## 8. GLVis

- [website](https://glvis.org/)
- [github](https://github.com/GLVis/glvis)

## 9. libigl

libigl本身是一个轻量化的C++计算几何处理库，但是最终的处理结果会以可视化的方式呈现出来，因此笔者把它视为可视化软件。
很多大学和知名机构都使用libigl。

- [website](https://libigl.github.io/)
- [github](https://github.com/libigl/libigl)

## 10. morphologica

它是一个非常年轻的数据可视化工具包。它的定位有点类似之前介绍的VTK，是以C++头文件库方式提供的、底层渲染使用现代OpenGL、适用于各类数值模拟的可视化开发工具包。
目前orphologica可以结合GLFW、Qt和wxWidgets等图形用户界面库进行开发，从而可以提供比较友好的窗口管理和用户界面。

- [doc](https://abrg-models.github.io/morphologica/)
- [github](https://github.com/ABRG-Models/morphologica)

## 11. F3D

- [F3D](https://f3d.app/)
- [github](https://github.com/f3d-app/f3d)

## 引用

- [科学可视化软件介绍 – VTK](https://zhuanlan.zhihu.com/p/683795058)
