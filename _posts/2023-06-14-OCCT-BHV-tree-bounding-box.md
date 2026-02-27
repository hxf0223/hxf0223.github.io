---
layout: post
title: OCCT 使用 BVH 树加速 bounding box 查找遍历
date: 2023-06-14 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OCCT]
tags: [OCCT]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## Demo code

### Demo code 1

```cpp
#include <BVH_Tree.hxx>
#include <TopoDS_Shape.hxx>
#include <vector>

// Assuming you have a vector of TopoDS_Shape objects called 'shapes'

// Create a BVH tree
Handle(BVH_Tree<Standard_Real, 3>) bvhTree = new BVH_Tree<Standard_Real, 3>();

// Insert the shapes into the BVH tree
for (const auto& shape : shapes) {
  // Compute the bounding box for the shape
  Bnd_Box box;
  BRepBndLib::Add(shape, box);

  // Insert the bounding box into the BVH tree
  bvhTree->Insert(box, shape);
}

// a query on the BVH tree to find possible interference
bvhTree->Select([](const TopoDS_Shape& shape1, const TopoDS_Shape& shape2) {
  // Check for interference between shape1 and shape2
  // If there is interference, process it accordingly
});

```

### Demo code 2

```cpp
#include <SpatialHash.hxx>
#include <TopoDS_Shape.hxx>

int main()
{
  // Create a spatial hash from the shapes.
  SpatialHash hash(shapes.size());
  for (TopoDS_Shape& shape : shapes)
  {
    hash.Add(shape);
  }

  // Find possibly interfering objects.
  for (TopoDS_Shape& shape : shapes)
  {
    std::vector<TopoDS_Shape> interferingObjects = hash.Find(shape);
    for (TopoDS_Shape& otherShape : interferingObjects)
    {
      // Check if the shapes interfere.
    }
  }

  return 0;
}
```

## References

* [几何体数据结构学习（6）BVH树](https://zhuanlan.zhihu.com/p/430469154)
