---
layout: post
title: std::shared_ptr 线程安全及性能考量
date: 2024-05-16 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. 线程安全

根据[cppreference](https://en.cppreference.com/w/cpp/memory/shared_ptr)的描述，`std::shared_ptr`线程安全如下（机器翻译）：

1. 如果是每个线程都拥有自己的`std::shared_ptr`对象，则针对线程自己的`std::shared_ptr`对象，其所有成员函数都是线程安全的；
2. 如果多个线程共享同一个`std::shared_ptr`对象，其`const`成员函数的访问是线程安全的，但其非`const`成员函数的访问需要同步。
3. 多线程访问同一个`std::shared_ptr`对象时，使用`std::atomic<std::shared_ptr<T>>`可以防止数据竞争。

原文：

All member functions (including copy constructor and copy assignment) can be called by multiple threads on different shared_ptr objects without additional synchronization even if these objects are copies and share ownership of the same object. If multiple threads of execution access the same shared_ptr object without synchronization and any of those accesses uses a non-const member function of shared_ptr then a data race will occur; the std::atomic<shared_ptr> can be used to prevent the data race.

总结：

1. 多线程拷贝同一个`std::shared_ptr`对象，是线程安全的(引用计数是线程安全的)。
2. 多线程访问`std::shared_ptr`指向的同一个内存对象时，访问`const`成员函数是线程安全的。
3. 其余情况，需要使用同步。

## 2. 性能考量

1. 使用`std::make_shared`，`std::make_shared`将被指向对象的内存分配与`控制块`的内存分配合并为一次分配；
2. `std::make_shared`的性能接近`new`；但`std::shared_ptr<T>(new T)`耗时较明显；
3. 在`x86`平台，`std::shared_ptr`的访问时间应该接近`T*`；但`ARM`平台应该会有明显的性能差异；

使用原始指针并赋值给`shared_ptr`，`shared_ptr`管理对象与控制块内存布局:

![shared_ptr_layout](/assets/images/cpp/2024-05-16-shared_ptr/shared_ptr_new_alloc.png)

而使用`std::make_shared`，`shared_ptr`管理对象与控制块内存布局:

![shared_ptr_layout_make_shared](/assets/images/cpp/2024-05-16-shared_ptr/make_shared_alloc.png)

## 3. 更多资料

- [合集 - C++系列(18) C++: weak_ptr到底有什么用？](https://www.cnblogs.com/qiangz/p/17843039.html)
- [合集 - C++系列(18) C++ 高效使用智能指针的8个建议](https://www.cnblogs.com/qiangz/p/17904768.html)
- [合集 - C++系列(18) C++: 16个基础的C++代码性能优化实例](https://www.cnblogs.com/qiangz/p/18270166)
