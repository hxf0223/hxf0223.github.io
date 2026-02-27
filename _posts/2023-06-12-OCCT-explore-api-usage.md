---
layout: post
title: OCC TopExp_Explorer 用法
date: 2023-06-12 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OCCT]
tags: [OCCT]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

```cpp
#include <iostream>
#include <TopoDS_Shape.hxx>
#include <TopExp_Explorer.hxx>

using namespace std;

int main()
{
  // Create a TopoDS_Shape object.
  TopoDS_Shape shape;

  // Create a TopExp_Explorer object and explore the shape.
  TopExp_Explorer exp(shape, TopAbs_FACE);

  // While there are more faces, print the face's name.
  while (exp.More())
  {
    cout << exp.Current().Name() << endl;
    exp.Next();
  }

  return 0;
}
```
