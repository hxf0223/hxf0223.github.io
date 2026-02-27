---
layout: post
title: 简单线程安全队列
date: 2024-06-20 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

```cpp
#include <iostream>
#include <queue>
#include <mutex>

template <typename T>
class ThreadSafeQueue {
public:
    void push(const T& item) {
        std::lock_guard<std::mutex> lock(mutex_);
        queue_.push(item);
    }

    bool try_pop(T& item) {
        std::lock_guard<std::mutex> lock(mutex_);
        if (queue_.empty()) {
            return false;
        }

        item = queue_.front();
        queue_.pop();
        return true;
    }

    bool empty() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return queue_.empty();
    }

private:
    std::queue<T> queue_;
    mutable std::mutex mutex_;
};
```
