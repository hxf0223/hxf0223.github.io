---
layout: post
title: 复习：RVO NRVO and std::move
date: 2024-09-04 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## RVO 以及 NRVO ##

* RVO：返回值优化，其功能为：消除子函数返回的`临时对象`导致的拷贝构造。
* NRVO：其功能为：消除子函数中返回的`局部对象`导致的拷贝构造。

```c++
class Object {
  //...
};
 
Object getObjRVO() {
  return Object();  // RVO
}

Object getObjNRVO() {
  Object localObj;
  return localObj;  // NRVO
}
```

## std::move ##

使用场景：

* 局部对象赋值给长生命周期对象时，使用`std::move`。前提是该类里面有非`trival`成员，如`std::string`，或支持移动构造的自定义类成员；
* `std::vector`等容器使用`emplace_back`代替`push_back`，此时针对局部对象使用`std::move` + `emplace_back`可以避免拷贝构造 -- 代之以移动构造；
* `std::thread`线程不可复制，只能所有权转移。如将线程对象添加到`std::vector`中，则需要使用`std::move`转移所有权。

不要使用`std::move`：

* 对于返回值优化的函数，不要使用`std::move`。

