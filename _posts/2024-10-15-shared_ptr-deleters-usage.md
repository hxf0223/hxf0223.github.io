---
layout: post
title: 给 shared_ptr 添加自定义 deleter 的几种方式
date: 2024-10-15 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. 使用函数

```c++
#include <iostream>
#include <memory>

void deleter(Sample* ptr) {
    std::cout << "delete function called" << std::endl;
    delete ptr;
}

std::shared_ptr<Sample> sp(new Sample, deleter);
```

## 2. 使用仿函数

```c++
#include <iostream>
#include <memory>

struct Deleter {
    void operator()(Sample* ptr) {
        std::cout << "deleter function called" << std::endl;
        delete ptr;
    }
};

std::shared_ptr<Sample> sp(new Sample, Deleter{});
```

## 3. 使用 lambda 表达式

```c++
#include <iostream>
#include <memory>

std::shared_ptr<Sample> sp(new Sample, [](Sample* ptr) {
    std::cout << "lambda function called" << std::endl;
    delete ptr;
});
```

## 4. 使用 std::default_delete

```c++
#include <iostream>
#include <memory>

std::shared_ptr<Sample> sp(new Sample, std::default_delete<Sample>{});
```
