---
layout: post
title: 为什么要使用 std::enable_shared_from_this，以及使用场景
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

## 为什么要使用 std::enable_shared_from_this

1. 当使用原始指针构造或者初始化一个`shared_ptr`时，将会创建一个新的**控制块**。为了确保一个对象仅由一个共享的控制块管理，必须通过**复制已存在的**`shared_ptr`对象来创建一个新的`shared_ptr`实例。

2. 但是在某些情况下，`shared_ptr`管理的对象需要为自己获取`shared_ptr`，类似于下面这样尝试从自身指针创建`shared_ptr`的方式是行不通的：

```cpp
struct Egg {
  std::shared_ptr<Egg> get_self_ptr() {
    return std::shared_ptr<Egg>(this);
  }
};

void spam() {
  auto sp1 = std::make_shared<Egg>();
  auto sp2 = sp1->get_self_ptr(); // undefined behavior
  // sp1 and sp2 have two different control blocks managing same Egg
}
```

3. 类似下面这样，在类内部持有自身的`shared_ptr`对象导致其释放不了：

```cpp
#include <iostream>
#include <memory>

#include <boost/core/ignore_unused.hpp>

struct Immortal {
  std::shared_ptr<Immortal> self;

  ~Immortal() {
    std::cout << "dtor of Immortal called. self.use_count() = " << self.use_count() << std::endl;
    // self.reset(); // (1)
  }
};

int main(int argc, char* argv[]) {
  boost::ignore_unused(argc, argv);
  auto immortal = new Immortal();
  immortal->self = std::shared_ptr<Immortal>(immortal);
  std::cout << "main exit. immortal->self.use_count() = " << immortal->self.use_count() << std::endl;
  // delete immortal; (2)
  return 0;
}
```

log 输出：

```bash
main exit. immortal->self.use_count() = 1
```

如果恢复(1)，(2)两处代码，导致同样多次析构出错。

测试代码 [test_enable_shared_from_this](/assets/zip/test_enable_shared_from_this.zip)。

4. 为了解决这个问题，我们就需要用到`std::enable_shared_from_this`。`public` 继承`std::enable_shared_from_this` 的类中可以通过调用`shared_from_this()`方法来获取自身的`shared_ptr`。

```cpp
struct Thing;
void some_api(const std::shared_ptr<Thing>& tp);

struct Thing : public std::enable_shared_from_this<Thing> {
  void method() {
    some_api(shared_from_this());
  }
};
```

## std::enable_shared_from_this 的使用场景

创建异步任务，并且需要把自身的`shared_ptr`传给异步任务，此时适用于使用 `std::enable_shared_from_this`。

## 不使用 std::enable_shared_from_this，使用 std::weak_ptr 替代的解决办法

`weak_ptr`是一种弱引用，它不会影响受管理对象的生命周期，但是在需要时可以用来获取强引用。 如果一个对象持有自身的`weak_ptr`，那么在需要的时候，就可以获取自身的`shared_ptr`：

```cpp
class Naive {
public:
  static std::shared_ptr<Naive> create() {
    auto sp = std::shared_ptr<Naive>(new Naive);
    sp->weak_self_ = sp;
    return sp;
  }

  auto async_method() {
    return std::async(std::launch::async, [self = weak_self_.lock()]() {
      self->do_something();
    });
  }

  void do_something() {
    std::this_thread::sleep_for(std::chrono::seconds(1));
  }

private:
  Naive() = default;
  Naive(const Naive&) = delete;
  const Naive& operator=(const Naive&) = delete;
  std::weak_ptr<Naive> weak_self_;
};

void test() {
  std::future<void> ft; {
    auto pn = Naive::create();
    ft = pn->async_method();
  }

  ft.get();
}
```

## 保证对象的线程安全

在多线程中，访问`shared_ptr`指向的对象时，一个方法是加锁，另一个是使用原子变量：

```cpp
std::atomic<std::shared_ptr<int>> atomic_shared;
```

## 参考

- [C++：深入理解 std::enable_shared_from_this 与 shared_from_this](https://haust-kevin.github.io/2025/03/16/2025-03-understanding-of-shared-from-this/)
- [从现代C++实现的百行线程池来了解一下线程池相关技术](https://zhuanlan.zhihu.com/p/673962006)
