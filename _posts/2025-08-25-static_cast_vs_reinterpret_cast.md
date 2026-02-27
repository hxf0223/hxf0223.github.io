---
layout: post
title: static_cast 与 reinterpret_cast
date: 2025-08-25 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. static_cast

- 编译时类型检查
- 只允许安全的、有意义的类型转换
- 会进行必要的类型转换计算

`static_cast`不能用于在不同类型的指针之间互相转换，也不能用于整型和指针之间的互相转换。

示例：

```cpp
// 数值类型转换
int i = 42;
double d = static_cast<double>(i);

// 基类与派生类之间的转换（向上转换总是安全的）
Derived* derived = new Derived();
Base* base = static_cast<Base*>(derived);

// void* 转换为具体类型指针
void* ptr = malloc(sizeof(int));
int* intPtr = static_cast<int*>(ptr);
```

## 2. reinterpret_cast

- 几乎不进行类型检查
- 直接重新解释内存中的位模式
- 非常危险，需要程序员确保安全性

示例：

```cpp
// 指针与整数之间的转换
int* ptr = new int(42);
uintptr_t addr = reinterpret_cast<uintptr_t>(ptr);

// 不相关类型指针之间的转换
char* charPtr = reinterpret_cast<char*>(ptr);

// 函数指针转换
void (*funcPtr)() = reinterpret_cast<void(*)()>(some_address);
```

## 3. 对比

| 特性     | static_cast        | reinterpret_cast   |
| -------- | ------------------ | ------------------ |
| 安全性   | 高，编译时检查     | 低，几乎无检查     |
| 性能     | 可能有运行时开销   | 无运行时开销       |
| 用途     | 合理的类型转换     | 位模式重解释       |
| 可移植性 | 好                 | 依赖平台           |
| 示例场景 | 数值转换、继承关系 | 指针转换、底层操作 |

## 4. ref

- [reinterpret_cast 和 static_cast](https://www.cnblogs.com/whcjob/p/17892691.html)
