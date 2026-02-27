---
layout: post
title: 复习：std::function 用法笔记
date: 2024-08-13 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

`std::function` 可以将`函数`,`函数对象（仿函数）`,`lambda表达式`包装成一个`对象`。`std::function``对象`本身可以作为函数参数，并且是可复制的（复制构造、赋值）。

## 1. 封装函数指针

```cpp
int add(int a, int b) { return a + b; }

int main() {
  std::function<int(int, int)> f = add;
  int result = f(1, 2);
  std::cout << result << std::endl;
  return 0;
}
```

## 2. 封装函数对象（仿函数）

```cpp
struct Adder {
  int operator()(int a, int b) { return a + b; }
};

int main() {
  Adder adder;
  std::function<int(int, int)> f = adder;
  int result = f(1, 2);
  std::cout << result << std::endl;
  return 0;
}
```

## 3. 封装 lambda 表达式

```cpp
int main() {
  // using func_t = int(int, int);
  std::function<int(int, int)> f = [](int a, int b) { return a + b; };
  int result = f(1, 2);
  std::cout << result << std::endl;
  return 0;
}
```

## 4. 与 std::bind 结合使用

```cpp
int add(int a, int b) { return a + b; }

int main() {
  std::function<int(int)> f = std::bind(add, 1, std::placeholders::_1);
  int result = f(2);
  std::cout << result << std::endl;
  return 0;
}
```

## 5. lambda 表达式

`lambda`表达式是一个匿名`函数对象`，即编译器会创建一个`仿函数`( 调用时，调用 `operator()(....)` )，并将外部捕获的变量，添加到该匿名对象中。这些是`lambda`的额外开销。

注：在`O2`编译时，仿函数也会被优化掉，直接编译成跳转代码段。

```cpp
int main()
{
  // Lambda & auto
  int member=10;
  auto endGame = [=](int a, int b){ return a+b+member;};

  endGame(4,5);

  return 0;

}
```

展开成：

```cpp
int main()
{
  int member = 10;

  class __lambda_6_18
  {
    int member;
    public:
    inline /*constexpr */ int operator()(int a, int b) const
    {
      return a + b + member;
    }

    public: __lambda_6_18(int _member)
    : member{_member}
    {}

  };

  __lambda_6_18 endGame = __lambda_6_18{member};
  endGame.operator()(4, 5);

  return 0;
}
```

## 参考

- [What is a lambda expression, and when should I use one?](https://stackoverflow.com/questions/7627098/what-is-a-lambda-expression-and-when-should-i-use-one)
