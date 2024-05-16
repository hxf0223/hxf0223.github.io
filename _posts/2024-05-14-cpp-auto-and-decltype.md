---
title: C++ 中 auto 和 decltype 的用法
date: 2024-05-16 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. auto 占位符

### 1.1 规则

1. 如果初始化表达式是引用，则去除引用语义。

```cpp
int a = 10;
int &b = a;

auto c = b;  // c: int，（去除引用）
auto &d = b; // d: int&
```

2. 如果初始化表达式为 `cv` 值（`const` / `volatile`），则除去**顶层的** `const` / `volatile` 语义。

```cpp
const int a1 = 10;
auto  b1 = a1;      // b1: int，而非 const int（去除const）
const auto c1 = a1; // c1: const int

audo d1 = &a1; // d1: const int*
```

`d1` 是 `const int*`, 这个可以这样看，`const int*`实际上是`(const int)*`（当然代码不能这样写），`const`不是顶层修饰符了，就没有忽略。

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

- [C++11特性：decltype关键字](https://www.cnblogs.com/QG-whz/p/4952980.html)
- [c++11-17 模板核心知识（九）—— 理解decltype与decltype(auto)](https://zhuanlan.zhihu.com/p/338822626)
- [decltype specifier](https://en.cppreference.com/w/cpp/language/decltype)
