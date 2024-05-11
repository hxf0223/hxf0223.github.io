---
title: OCC boundding box 以及 distance
date: 2023-06-12 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OCCT]
tags: [occt]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

# OCC boundding box 以及 distance

## bounding box 方式检测

```C++
#include <Bnd_Box.hxx>
#include <BRepBndLib.hxx>

TopoDS_Shape shape1, shape2; // Assume these shapes are already defined
Bnd_Box boundingBox1, boundingBox2;

BRepBndLib::Add(shape1, boundingBox1);
BRepBndLib::Add(shape2, boundingBox2);

bool isInterfering = !boundingBox1.IsOut(boundingBox2);
```

## distance 方式检测

```C++
#include <BRepExtrema_DistShapeShape.hxx>

BRepExtrema_DistShapeShape distShapeShape(shape1, shape2);
Standard_Real minDistance = distShapeShape.Value();
bool isInterfering = (minDistance <= Precision::Confusion());
```

* BRepExtrema_DistShapeShape 比 bounding box 方式费时；
* 如果`bouding box`方式检测出来出现干涉（interference, overlap），则可以使用`distance`检测方式确认；
