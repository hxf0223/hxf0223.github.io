---
layout: post
title: 自定义 operator new， placement new，以及释放内存
date: 2024-07-29 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. new 操作符(new operator)

new 操作符做两件事：分配内存 + 调用构造函数初始化。

## 2. operator new

通常声明如下：

`operator new` 操作符的职责仅仅是分配内存，操作符返回一个未经处理（raw）的指针，未初始化的内存。

```cpp
void* operator new(size_t size);
```

调用方式如下：

```cpp
void *rawMemory = operator new(sizeof(string));
```

注意，显式调用 operator new 时，几乎没有意义，因为不能显式调用构造函数。

### 2.1 对指定类型的 operator new, operator delete 进行重载

```cpp
#include <cstddef>
#include <iostream>
 
// class-specific allocation functions
struct X {
  static void* operator new(std::size_t count) {
    std::cout << "custom new for size " << count << '\n';
    return ::operator new(count);
  }
 
  static void* operator new[](std::size_t count) {
    std::cout << "custom new[] for size " << count << '\n';
    return ::operator new[](count);
  }

  static void operator delete(void* ptr, bool b){
    std::cout << "custom placement delete called, b = " << b << '\n';
    ::operator delete(ptr);
  }
};

int main() {
  X* p1 = new X;
  delete p1;
  X* p2 = new X[10];
  delete[] p2;
}
```

## 3. placement new

placement new 是一种特殊的 new 操作符，它允许在已分配的内存上调用构造函数。

```cpp
alignas(T) unsigned char buf[sizeof(T)];

// Construct a “T” object, placing it directly into your pre-allocated storage at memory address “buf”.
T* tptr = new(buf) T;

tptr->~T(); // 显式调用析构函数
```

## 参考

- [operator new, operator new[]](https://en.cppreference.com/w/cpp/memory/new/operator_new)
- [operator delete, operator delete[]](https://en.cppreference.com/w/cpp/memory/new/operator_delete)
- [new expression -- Placement new](https://en.cppreference.com/w/cpp/language/new)

