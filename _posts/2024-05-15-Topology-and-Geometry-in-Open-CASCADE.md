---
layout: post
title: OpenCascade拓扑与几何的关系
date: 2024-05-12 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OCCT]
tags: [OCCT]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. OPENCASCADE 中的拓扑结构（TopoDS包）

抽象结构是以`TopoDS`包的`C++`类来实现的。下面是一个继承图，取自`Doxygen`生成的文档。

![TopoDS_inheritance_diagram](/assets/images/occ/classTopoDS_Shape_inherit_graph.png)

`TopoDS_Shape` 是通过值来操作的，包含3个字段--`location`、`orientation` 和一个 `myTShape` 句柄 （`TopoDS_TShape`类型），见下图（只包含最重要的字段）：

![TopoDS_Shape_structure_diagram](/assets/images/occ/TopoDS_Shape_abstract_1.png)

`myTShape` 和 `Location` 被用来在各种形状之间共享数据，从而节省大量的内存。例如，两个连接在一起的面中间的边，这个边具有相同的位置（`location`）和 `myTShape`，但有不同的朝向（`orientation`）（在其中一个面是正向，在另一个面中是反向）。

## 2. OPENCASCADE 中的边界表示法（BRep包）

边界表示（Boundary Representation）也称为BRep表示，它是几何造型中最成熟、无二义的表示法。实体的边界通常是由面的并集表示，而每个面又由它所在曲面的定义加上其边界来表示，面的边界是边的并集，而边又是由点来表示。如下图1.1所示，曲面的汇合处形成曲线，而曲线的汇合处形成点。所以点、线、面是描述一个形状所需要的基本组成单元。

![BRep Shape demo](/assets/images/occ/BRep_Shape_demo.png)

几何信息（在`BRep`包中）通过继承`TopoDS_Shape`类来实现，只有3种类型的拓扑对象有几何特征--顶点（`vertex`）、边(`edge`)和面(`face`)（见下图）：

![BRep_Shape_inheritance_diagram](/assets/images/occ/TooDS_Geometry_abstract_2.png)

### 2.1 Brep 进一步说明

几何信息（`BRep`）描述了形状的形状、位置、方向、边界等信息，而拓扑信息（`TopoDS`）描述了形状的拓扑结构，如顶点、边、面的连接关系。以`BRep Edge`为例说明：
边有几种几何表示方式（参考上图，`BRep_TEdge`之下有节点`List of Edge Representions`）:

- 三维空间的`曲线C(t)`，用类`Geom_Curve`实现，这是基础表示方式。
- `曲线P(t)`为二维空间中的参数曲线，用于描述位于曲面上的曲线。这些通常被称为`pcurves`，用类`Geom2d_Curve`实现。
- 多边形（Polygonal representation）用一组三维点来描述，用类`Poly_Polygon3D`实现。
- 多边形（Polygonal representation），也可以用一组三维点的编号来描述，在类`Poly_PlygonOnTriangulation`实现。

## 3. OpenCascade 中拓扑（Topo）与几何（BRep）的关系

边界表示的一个重要特点是描述形状的信息包括几何信息（`geometry`）和拓朴（`topology`）信息两个方面：

1. 拓朴信息描述形状上的顶点、边、面的连接关系，它形成物体边界表示的“骨架”。
2. 形状的几何信息犹如附着在“骨架”上的肌肉。在`OpenCascade`中，形状的几何信息包含**曲线和曲面的参数解析**表示`Geom_Curve/Geom_Surface`。

这样我们就可以用平面方程和柱面方程来描述曲面，用直线或圆弧方程来描述曲线。这时会出现一个问题，即代数表达式只能定义无边界的几何体。除了单个点、圆以及球体，经典的解析几何仅能表示无限延伸的曲线和曲面。为了解决这个问题，边界表示法按下述方法明确地定义曲线或曲面的边界：

- 曲线的边界由位于曲线上的一对点来确定；
- 曲面的边界由位于曲面上的一组曲线来确定；

通过这个方法，就可以定义一段曲线或一片曲面。这时，不同几何元素之间的关系的组织问题就出现了，为此我们将记录如下信息：

- 哪些点界定哪些曲线；
- 哪些曲线界定哪些曲面；

这些关于谁关联谁的信息，就是几何造型系统经常提到的拓朴。在边界表示法中，理论上表示一个物理模型只需要三个拓朴体（顶点`TopoDS_Vertex`、边`TopoDS_Edge`和面`TopoDS_Face`），但在实际应用中，为了提高计算机处理的速度或提供高级的操作功能，还要引入其他一些概念，如环`TopoDS_Wire`、壳`TopoDS_Shell`、复合体`TopoDS_Compound`等。

## z. 原文及参考

### z.1 ROMAN LYGIN

- [TOPOLOGY AND GEOMETRY IN OPEN CASCADE. PART 1](https://opencascade.blogspot.com/2009/02/topology-and-geometry-in-open-cascade.html)
- [TOPOLOGY AND GEOMETRY IN OPEN CASCADE. PART 2](https://opencascade.blogspot.com/2009/02/topology-and-geometry-in-open-cascade_09.html)
- [TOPOLOGY AND GEOMETRY IN OPEN CASCADE. PART 3](https://opencascade.blogspot.com/2009/02/topology-and-geometry-in-open-cascade_12.html)
- [TOPOLOGY AND GEOMETRY IN OPEN CASCADE. PART 4](https://opencascade.blogspot.com/2009/02/continued.html)
- [TOPOLOGY AND GEOMETRY IN OPEN CASCADE. PART 5](https://opencascade.blogspot.com/2009/02/topology-and-geometry-in-open-cascade_27.html)

在`occ dev`上对应的讨论帖子：

- [Blog: Topology and Geometry in Open CASCADE](https://dev.opencascade.org/content/blog-topology-and-geometry-open-cascade)

### z.2 国内 eryar 等同文章系列

- [Topology Shapes of OpenCascade BRep](https://www.cppblog.com/eryar/archive/2013/12/21/204939.html)
- [Topology and Geometry in OpenCascade-Vertex](https://www.cnblogs.com/opencascade/p/3603004.html)
- [Topology and Geometry in OpenCascade-Edge](https://www.cnblogs.com/opencascade/p/3604052.html)
- [Topology and Geometry in OpenCascade-Face](https://www.cnblogs.com/opencascade/p/3605729.html)
- [Topology and Geometry in OpenCascade-Topology](https://www.cnblogs.com/opencascade/p/3608508.html)
- [Topology and Geometry in OpenCascade-Adapters](https://www.cnblogs.com/opencascade/p/3662581.html)

eryar 其他相关文章及代码：

- [Surface Normal Vector in OpenCascade](https://www.cnblogs.com/opencascade/p/3548667.html)
- [Surface Normal Averaging](https://www.cnblogs.com/opencascade/p/3572499.html)
- [Parametric Curves and Surfaces](https://www.cnblogs.com/opencascade/p/3592395.html)
- [PCurve - Curve on Surface](https://www.cnblogs.com/opencascade/p/3601859.html)

### z.3 ROMAN LYGIN 原文的中文翻译

- [【OpenCascade】拓扑与几何的关系](https://zhuanlan.zhihu.com/p/437332699)

### z.4 其他资料

- [OpenCasCade官方开发文档翻译(1)–occt整体介绍](https://www.caxkernel.com/8154.html)
- [Victoria Rudakova](https://vicrucann.github.io/tutorials)
