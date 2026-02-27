---
layout: post
title: std::pmr -- 内存池
date: 2025-01-15 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. 介绍

使用`C++ 17`的多态内存管理器(PMR)，可以实现一个简单的内存池。根据选择(`std::pmr::memory_resource`)，可以在内存不够的时候，向`upstream`申请内存。

标准内存资源列表：

| memory_resource派生类                      | 效率                     | 线程安全   | 内存                                         |
| ------------------------------------------ | ------------------------ | ---------- | -------------------------------------------- |
| `std::pmr::synchronized_pool_resource()`   | 效率低（内部需要上锁）   | 线程安全   | 更少碎片化                                   |
| `std::pmr::unsynchronized_pool_resource()` | 效率较高(内部不需要上锁) | 非线程安全 | 更少碎片化                                   |
| `std::pmr::monotonic_buffer_resource()`    | 效率最高                 | 非线程安全 | “只进不出”（从不释放、可传递进可选的缓冲区） |

两个返回指向单例全局内存资源指针的函数：

| 函数名                             | 特点                                    |
| ---------------------------------- | --------------------------------------- |
| `std::pmr::new_delete_resource()`  | 默认的内存资源（转发给传统 new/delete） |
| `std::pmr::null_memory_resource()` | “永远拒绝”                              |

## 2. 示例

- 基本示例：`std::pmr::monotonic_buffer_resource`的基本用法：`src/hello_prm`。
- 使用`std::pmr::polymorphic_allocator`初始化对象（alloc + construct）：`src/polymorphic_allocator`。
- benchmark：不同`memory_resource`实现的性能对比：`src/benchmark`。

用户自定义类使用`PMR`分配之后的析构：

```c++
using user_class_alloc_traits = std::allocator_traits<std::pmr::polymorphic_allocator<UserClass>>;
user_class_alloc_traits::destroy(userclass_allocator, userclass);
user_class_alloc_traits::deallocate(userclass_allocator, userclass, 1);
```

## 3. 参考

- [cppreference -- pmr benchmark](https://en.cppreference.com/w/cpp/memory/monotonic_buffer_resource)
- [test source code](https://gitee.com/hpc_5/mem_pool_cpp17_pmr/tree/main)
- [C++17 the complete guide -- Chap 29. 多态内存资源(PMR)](/assets/pdf/C++17%20the%20complete%20guide.pdf)
