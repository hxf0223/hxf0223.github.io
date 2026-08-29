---
layout: post
title: C++ 17 新功能： std::visit 和 std::variant 配合使用 (待更新删除冗余描述)
date: 2024-05-09 16:38:33 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. `std::variant` （变体）

在很多编程场景中，我们经常遇到需要处理多种类型的情况。传统上，这可以通过多种方式来实现，例如使用 `union` 或 `void*` 指针，甚至使用一系列的 `if-else` 语句和类型转换。但这些方法通常都有各种缺点，如类型不安全、容易出错或难以维护。
`std::variant` 为这一问题提供了一个现代、类型安全的解决方案。它允许你在一个单一的变量中存储多种不同的类型，并能在运行时安全地访问它们，并能获取他们的类型信息。
可以把它看作是一个可以存储多种类型中的任一种的类型安全的容器。下面是一个基本用法的例子：

```cpp
#include <variant>
#include <iostream>

int main() {
    std::variant<int, double, std::string> v1 = 42;
    std::variant<int, double, std::string> v2 = 3.14;
    std::variant<int, double, std::string> v3 = "hello";

    // 访问存储的值（不安全，需确保类型正确）
    std::cout << std::get<int>(v1) << std::endl;

    // 安全地访问存储的值
    auto pval = std::get_if<int>(&v1);
    if (pval) {
        std::cout << *pval << std::endl;
    }

    return 0;
}
```

### 1.1 `std::variant` 的局限

尽管 std::variant 非常强大，但它并不是万能的。它的一个主要限制是，虽然它可以存储多种类型，但在任何给定时间点，它只能存储其中一种。这意味着，如果你想存储多种类型，你需要使用 `std::visit` 函数来访问它们。
当然，你可以使用 `std::holds_alternative` 或 `std::get_if` 进行手动检查，但这样做的代码通常既繁琐又容易出错。

```cpp
std::variant<int, double, std::string> v = 42;
if (std::holds_alternative<int>(v)) {
    int value = std::get<int>(v);  // 安全
} else if (std::holds_alternative<double>(v)) {
    double value = std::get<double>(v);  // 运行时错误！
}
```

创建一个四行三列的MD表格

| 方法                     | 优点                           | 缺点                           |
| ------------------------ | ------------------------------ | ------------------------------ |
| `std::holds_alternative` | 简单、直观                     | 不能提取值                     |
| `std::get`               | 可以直接提取值                 | 类型错误会抛出异常             |
| `std::get_if`            | 可以检查和提取值，不会抛出异常 | 返回指针，需要额外的空指针检查 |

## 2. `std::visit` （访问）

函数原型如下：

```cpp
template<class Visitor, class... Variants>
constexpr visit(Visitor&& vis, Variants&&... vars);
```

其底层工作原理：

1. **访问存储的值**：当 `std::visit` 被调用时，它首先需要确定 `std::variant` 当前存储的具体类型。这是通过检查内部的类型标记完成的。

2. **函数模板实例化**：`std::visit` 接受一个可调用对象和一个或多个 `std::variant` 对象。这个可调用对象通常是一个重载的函数对象或 `lambda 表达式`，其具有多个重载以处理不同的类型。**编译器会为这些重载生成函数模板实例。**

3. **类型恢复和函数调用**：一旦确定了 `std::variant` 中的类型，`std::visit` 通过生成的模板代码来“恢复”此类型，并调用与该类型匹配的函数重载。如果有多个 `std::variant` 参数，`std::visit` 将处理所有组合的可能性，并调用适当的重载。

4. **编译时多态**：这一切都在编译时发生。编译器生成适用于所有可能的类型组合的代码。因此，`std::visit` 实现了一种编译时的多态，而不是运行时多态（如虚函数）。

综上所述，`std::visit` 的核心在于它能够在编译时处理多态性，允许编译器生成处理 `std::variant` 中所有可能类型的代码。这种方法确保了类型安全，并允许进行高效的代码优化。

## 3. 如何优雅地使用 `std::visit`

### 3.1 使用泛型 lambda 表达式

`std::visit` 允许你传入一个可调用对象（callable object），通常是一个 `lambda 表达式`。现代 C++ 提供了一种特殊的 `lambda` 表达式，称为`泛型 lambda 表达式`（generic lambda）。
`泛型 lambda` 是一个使用 `auto` 关键字作为参数类型的 `lambda 表达式`。这意味着 `lambda` 可以接受任何类型的参数，并在函数体内进行处理。

```cpp
auto generic_lambda = [](auto x) {
    // do something with x
};
```

这种灵活性在处理 `std::variant` 时尤为有用，因为你可能需要根据多种可能的类型来编写逻辑。

### 3.2 使用 `if constexpr` 和类型萃取

编程就像是一场高级的拼图游戏。你需要一种机制来判断哪块拼图适用于当前的情况。在 `std::visit` 的上下文中，这通常是通过 `if constexpr` 和`类型萃取（type traits）`来完成的。

#### `if constexpr`

`if constexpr` 是 `C++17` 引入的一种编译时 if 语句，它允许在编译时进行条件判断。这意味着编译器会根据条件来优化生成的代码，这通常会带来更高的性能。
使用 `if constexpr`，你可以在一个统一的代码块中处理多种类型，而无需使用多个繁琐的 `if-else` 语句。这不仅让代码看起来更简洁，而且更易于维护。

#### 类型萃取：认识你的类型

`类型萃取（Type Traits）`是 `C++11` 引入的一组模板，用于在编译时获取类型的属性。例如，`std::is_same_v<T1, T2>` 可以告诉你 `T1` 和 `T2` 是否是同一种类型。

通过结合 `if constexpr` 和类型萃取，你可以写出高度灵活且类型安全的代码。这也是 `std::visit` 能发挥最大威力的地方。

#### 综合应用：泛型 lambda 与类型判断

```cpp
std::variant<int, double, std::string> v = "hello";

std::visit([](auto&& arg) {
    using T = std::decay_t<decltype(arg)>;
    if constexpr (std::is_same_v<T, int>) {
        std::cout << "int: " << arg << std::endl;
    } else if constexpr (std::is_same_v<T, double>) {
        std::cout << "double: " << arg << std::endl;
    } else {
        static_assert(std::is_same_v<T, std::string>);
        std::cout << "string: " << arg << std::endl;
    }
}, v);
```

这里，我们使用了泛型 `lambda` 来接受任何类型的 `arg`，然后用 `if constexpr` 和`类型萃取`来确定 `arg` 的实际类型，并据此执行相应的操作。

## 4. 实例一：`std::visit` 和访问者 模式

一个简单的 `std::visit` 使用示例。在这个例子中，我将使用 `std::variant` 来存储不同类型的数据，并展示如何使用 `std::visit` 以类型安全的方式访问和处理这些数据。

```cpp
#include <iostream>
#include <variant>
#include <string>
#include <functional>

// 定义 variant 类型
using MyVariant = std::variant<int, double, std::string>;

// 访问者函数对象
struct VariantVisitor {
    void operator()(int i) const {
        std::cout << "处理 int: " << i << std::endl;
    }

    void operator()(double d) const {
        std::cout << "处理 double: " << d << std::endl;
    }

    void operator()(const std::string& s) const {
        std::cout << "处理 string: " << s << std::endl;
    }
};

int main() {
    MyVariant v1 = 10;        // v1 存储 int
    MyVariant v2 = 3.14;      // v2 存储 double
    MyVariant v3 = "hello";   // v3 存储 string

    std::visit(VariantVisitor(), v1); // 输出: 处理 int: 10
    std::visit(VariantVisitor(), v2); // 输出: 处理 double: 3.14
    std::visit(VariantVisitor(), v3); // 输出: 处理 string: hello

    return 0;
}
```

在这个例子中：

- 我们定义了一个 `std::variant` 类型 `MyVariant`，它可以存储 `int`、`double` 或 `std::string`。
- `VariantVisitor` 是一个重载了 operator() 的结构体，对每种可能的类型提供了一个处理方法。
- 在 `main` 函数中，我们创建了三个 `MyVariant` 实例，分别存储不同的类型。
- 使用 `std::visit` 调用 `VariantVisitor` 实例，它会自动选择并调用与 `variant` 当前存储的类型相匹配的重载函数。

## 5. 实例二：进一步研究 `std::visit` 与访问者模式的兼容

如果您想要在 `operator()` 中添加额外的参数，`std::visit` 本身不会直接支持这种用法，因为 `std::visit` 期望的可调用对象的参数必须与传递给它的 `std::variant` 类型匹配。不过，您可以通过一些技巧来实现这个功能。
一种常用的方法是使用 `lambda 表达式`或`绑定器`（如 `std::bind`）来封装您的访问者对象和额外的参数。这里有一个简单的示例说明如何做到这一点：

```cpp
#include <variant>
#include <iostream>
#include <functional>

struct MyVisitor {
    void operator()(int i, const std::string& extra) const {
        std::cout << "Int: " << i << ", Extra: " << extra << '\n';
    }

    void operator()(float f, const std::string& extra) const {
        std::cout << "Float: " << f << ", Extra: " << extra << '\n';
    }

    void operator()(const std::string& s, const std::string& extra) const {
        std::cout << "String: " << s << ", Extra: " << extra << '\n';
    }
};

int main() {
    std::variant<int, float, std::string> v;
    std::string extraInfo = "Some extra information";

    v = 12;
    std::visit([&](auto&& arg){ MyVisitor{}(arg, extraInfo); }, v);

    v = 3.14f;
    std::visit([&](auto&& arg){ MyVisitor{}(arg, extraInfo); }, v);

    v = "Hello World";
    std::visit([&](auto&& arg){ MyVisitor{}(arg, extraInfo); }, v);
}
```

在 `C++` 中，`[&](auto&& arg){ MyVisitor{}(arg, extraInfo); }` 是一个 `lambda 表达式`，用于创建一个匿名函数。这个特定的 `lambda 表达式`用于 `std::visit` 调用中，以便将 `std::variant` 的值和额外的参数一起传递给 `MyVisitor` 类的 `operator()`。

1. `(auto&& arg)` 参数列表：这表示 `lambda` 接受一个名为 `arg` 的参数，`auto&&` 是一个通用引用，它可以接受任何类型的参数。在 `std::visit` 的上下文中，这个参数将是 `std::variant` 中当前存储的值。
2. 函数体：`{ MyVisitor{}(arg, extraInfo); }` 是 `lambda 表达式`的函数体。在这里，它创建了 `MyVisitor` 类的一个临时实例，并调用其 `operator()`，传递两个参数：`arg`（从 `std::variant` 中得到的值），和 `extraInfo`（从外部作用域捕获的额外信息）。

综合起来，当这个 `lambda` 表达式被 `std::visit` 调用时，它会根据 `std::variant` 当前存储的类型将相应的值作为 `arg` 传递给 `MyVisitor` 的 `operator()`，同时携带一个额外的参数 `extraInfo`。这允许 `MyVisitor` 的方法根据当前的 `variant` 类型和额外的信息执行相应的操作。

## 6. 使用 std::visit 的优缺点

### 6.1 优点

- 代码简洁
- 类型安全
- 扩展性

`std::visit` 的优点是扩展性（Extensibility）。如果 `std::variant` 添加了新的类型，你只需要更新 `std::visit` 的访问器函数，而无需改动其他代码。

## 7. 参考

- [C++17之std::visit的具体使用](https://www.zhangshengrong.com/p/QrXebvBL1d/)
- [【C++ 17 新功能 std::visit 】深入解析 C++17 中的 std::visit：从原理到实践](https://blog.csdn.net/qq_21438461/article/details/132659408)
- [std::variant 与 std::visit](https://wanghenshui.github.io/2018/08/15/variant-visit)
- [Visiting a std::variant with the Overload Pattern](https://www.modernescpp.com/index.php/visiting-a-std-variant-with-the-overload-pattern/)
