---
layout: post
title: VTK学习资源收集
date: 2023-05-24 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [VTK]
tags: [VTK, Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 学习文档

- [VTK textbook -- online](https://book.vtk.org/en/latest/index.html)
- [VTK Book Figure Examples](https://examples.vtk.org/site/VTKBookFigures/)
- [VTK textbook -- pdf](/assets/pdf/vtk/VTKTextBook.pdf)
- [VTK Userguide -- pdf](/assets/pdf/vtk/VTKUsersGuide.pdf)

## 示例

关于CXX的示例说明，在官方examples代码的相关README里面有简单介绍，路径：src/Cxx.md

- github `HDF5` & `TDR`代码 [JosefWeinbub](https://github.com/JosefWeinbub?tab=stars)
- C++示例代码列表 [Cxx](https://examples.vtk.org/site/Cxx/)
- 演示`vtkUnstructureGrid`及mesh显示(`EdgeVisibilityOn`) [UGrid](https://examples.vtk.org/site/Cxx/UnstructuredGrid/UGrid/)

### Color a mesh by dotting a vector from the origin to each point with a specified vector

- [SimpleElevationFilter](https://examples.vtk.org/site/Cxx/Meshes/SimpleElevationFilter/)

### Vector field -- 显示矢量场箭头

- [VectorField](https://examples.vtk.org/site/Cxx/Visualization/VectorField/)
- [VectorFieldNonZeroExtraction](https://examples.vtk.org/site/Cxx/Filtering/VectorFieldNonZeroExtraction/)

### VTK blog

- [VTK入门范例2](https://www.michaelapp.com/posts/2019/2019-03-20-VTK%E5%85%A5%E9%97%A8%E8%8C%83%E4%BE%8B2/)
