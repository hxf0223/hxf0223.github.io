---
title: std::shared_ptr 线程安全
date: 2024-05-16 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

根据[cppreference](https://en.cppreference.com/w/cpp/memory/shared_ptr)的描述，`std::shared_ptr`线程安全如下（机器翻译）：

1. 如果是每个线程都拥有自己的`std::shared_ptr`对象，则针对线程自己的`std::shared_ptr`对象，其所有成员函数都是线程安全的；
2. 如果多个线程共享同一个`std::shared_ptr`对象，其`const`成员函数的访问是线程安全的，但其非`const`成员函数的访问需要同步。
3. 多线程访问同一个`std::shared_ptr`对象时，使用`std::atomic<std::shared_ptr<T>>`可以防止数据竞争。

原文：

```text
All member functions (including copy constructor and copy assignment) can be called by multiple threads on different shared_ptr objects without additional synchronization even if these objects are copies and share ownership of the same object. If multiple threads of execution access the same shared_ptr object without synchronization and any of those accesses uses a non-const member function of shared_ptr then a data race will occur; the std::atomic<shared_ptr> can be used to prevent the data race.
```
