---
layout: post
title: C++ 中 auto 和 decltype 的用法 (update 20241106)
date: 2024-11-06 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. auto 占位符

### 1.1 规则

`auto`推导的原则为：保持原有变量的类型(如`cv`限定)，大致分两种情况:

* `auto`: `auto`含义是`创建了一个新的变量`:
  * 表达式为`T`或者`T&`或者`const T&` -- `auto`推导为`T` -- 即新变量的类型去除`cv`限定 (如果原有表达式有`cv`限定);
  * 表达式为`T* const`或者`T*` -- `auto`推导为`T*` -- 新变量去除`cv`限定;
  * 表达式为`const T*`或者`const T* const` -- `auto`推导为`const T*`，即保持指针指向的内存区域的`const`属性。
* `auto&`: `auto&`含义是`alias`，故`auto&`推导的结果是原有类型的的引用，不能少任何一个限定符，如:
  * `const T* const`推导为`const T* const &`；
  * `const T`推导为`const T&`；

![auto_deference](/assets/images/cpp/cpp_auto_deference.png)

### 1.2 一些应用场景

1. 范围循环

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};
for (const auto& num : numbers) {
    std::cout << num << std::endl; // num 的类型被推导为 const int&
}
```

2. lambda 表达式

```cpp
auto add_func = [](int a, int b) -> int {
    return a + b;
};
```

3. 结构化绑定（`c++17`新特性）

```cpp
std::pair<int, double> myPair = std::make_pair(42, 3.14);
auto [first, second] = myPair; // 结构化绑定，first 和 second 的类型被推导为 int 和 double
```

4. 返回类型后置

```cpp
template<typename T, typename U>
auto add(T t, U u) -> decltype(t + u) {
    return t + u;
}
```

## 2. decltype

`decltype` 类型推导规则：

### 2.1 decltype(entity)

如果 `entity` 是一个不被括号包围的标识符、类访问表达式，那么`decltype(entity)`与 `entity` 类型一致。

### 2.2 decltype((expression))

如果`expression`是一个表达式，计算结果为类型`T`，那么：

1. 如果 `expression` 为 `xvalue（将亡值）`，那么 `decltype` 的结果是 `T&&`。
2. 如果 `expression` 为 `lvalue`，那么 `decltype` 的结果是 `T&`。
3. 如果 `expression` 为 `prvalue（纯右值）`，那么 `decltype` 的结果是 `T`。

### 2.3 说明及示例

注意第一点中强调了 `entity` 是一个不被括号包围的标识符。因为当一个**标识符被括号包围时，它就是一个左值表达式了**，对应上面第二大点的第二小点。比如说 `int x = 0;`，`x` 是一个标识符，所以 `decltype(x)` 的结果为 `int`。但是 `(x)` 就是一个左值表达式，`decltype((x))` 的结果就是 `int&`。

## 3. 参考

* [C++11特性：decltype关键字](https://www.cnblogs.com/QG-whz/p/4952980.html)
* [c++11-17 模板核心知识（九）—— 理解decltype与decltype(auto)](https://zhuanlan.zhihu.com/p/338822626)
* [decltype specifier](https://en.cppreference.com/w/cpp/language/decltype)

