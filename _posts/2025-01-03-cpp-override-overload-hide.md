---
layout: post
title: C++面向对象三个概念——重载、覆盖和隐藏
date: 2025-01-03 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

![C++面向对象三个概念——重载、覆盖和隐藏](/assets/images/cpp/20250103/01-cpp-overload-override-hide.png)

## 1. overload 重载

- 同名函数，参数个数或类型不同；
- 相同作用域，即同一个类。

## 2. override 覆盖

- 不在一个作用域，即父类与子类；
- 子类函数与基类函数同名，参数个数和类型相同；
- 基类使用`virtual`关键字，子类使用`override`关键字。

例外的一个点是`协变`：基类返回基类指针，子类返回子类指针。此时也是`override`。

```cpp
#include <iostream>

class Base {
public:
    virtual Base* clone() const {
        std::cout << "Base::clone()" << std::endl;
        return new Base(*this);
    }
};

class Derived : public Base {
public:
    // 使用协变返回类型，返回类型是 Base 的派生类型 Derived*
    Derived* clone() const override {
        std::cout << "Derived::clone()" << std::endl;
        return new Derived(*this);
    }
};

int main() {
    Derived d;
    Base* ptr = &d;
    Base* newPtr = ptr->clone(); // 调用 Derived::clone()
    delete newPtr;
    return 0;
}
```

## 3. hide 隐藏

作用域不同，同名函数不能生成`override`，而是覆盖。子类中的`成员函数`、`数据成员`，将覆盖基类中的同名`成员函数`、`数据成员`。

如果要调用基类中的同名函数，需要使用`基类名::函数名`，或者使用`using`引入。

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    void func() { cout << "Base::func()" << endl; }
    void func(int) { cout << "Base::func(int)" << endl; }
};

class Derived : public Base {
public:
    void func() { cout << "Derived::func()" << endl; } // 隐藏基类所有 func 版本
    void callBaseFunc() { Base::func(); } // 显式调用基类的 func()
};

int main() {
    Derived d;

    d.func();        // 调用 Derived::func()
    // d.func(1);    // 编译错误，基类 func(int) 被隐藏
    d.Base::func(1); // 显式调用基类的 func(int)

    return 0;
}
```

## 4. 引用

- [c++三大概念要分清--重载，隐藏（重定义），覆盖（重写）](https://www.cnblogs.com/linuxAndMcu/p/10292417.html)
