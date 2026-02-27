---
layout: post
title: 再理解 std::condition_variable 条件变量
date: 2025-12-06 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

有如下几个问题需要厘清：

* 工作原理，即流程；
* 虚假唤醒与唤醒丢失；
* `notify_one` 与 `notify_all`。
* `lock_guard` 与 `unique_lock`。

```cpp
#include <atomic>
#include <condition_variable>
#include <iostream>
#include <thread>

std::mutex mutex_;
std::condition_variable condVar;
std::atomic<bool> dataReady{false};       // (0)

void waitingForWork() {
    std::cout << "Waiting " << std::endl;
    std::unique_lock<std::mutex> lck(mutex_);
    condVar.wait(lck, []{ return dataReady.load(); });   // (1)
    std::cout << "Running " << std::endl;
    // do the work
}

void setDataReady() {
    {
         std::lock_guard<std::mutex> lck(mutex_);       // (2)
         // prepare the data
         dataReady = true;
    }
    std::cout << "Data prepared" << std::endl;
    condVar.notify_one();                               // (3)
}

int main(){
  std::thread t1(waitingForWork);
  std::thread t2(setDataReady);

  t1.join();
  t2.join();
  
  return 0;
}
```

其中，带`谓词(predicate)`的`wait`等效于：

```cpp
std::unique_lock<std::mutex> lck{mutex_};   // (a)
while(![]{return dataReady.load();}) {      // (b)
    //time window(1)
    condVar.wait(lck);                      // (c)
}
```

`consumer`获取到锁之后：

* 如果`谓词`返回`false`，则通过`wait`操作释放锁（调用`lck.unlock()`），并进入等待状态，直到`notify`唤醒。
* 被唤醒之后，重新获取锁（调用`lck.lock()`），进入时间窗口(1)，再次检查`谓词`。
* 如果`谓词`返回`true`，则继续持锁继续后续的工作，直到释放锁。

参见[std::condition_variable::wait -- 中文版](https://cppreference.cn/w/cpp/thread/condition_variable/wait)。

## 1. 工作原理及流程 ##

即，对`producer`，`consumer`两者需要确保互锁，并且`producer`进行`notify`的时候，`consumer`已经进入等待状态。

如果不使用带`谓词`的`wait`，则会出现`唤醒丢失`的问题，即`producer`发送`notify`的时候，`consumer`还没有进入等待状态，原因就是需要等待`lock`：

```cpp
std::unique_lock<std::mutex> lck{mutex_};
condVar.wait(lck);
```

并且`consumer`进入等待状态之后，`producer`、`consumer`会进入死锁状态。

另一方面，如果不使用原子变量`dataReady`，则会出现`虚假唤醒`的问题。即，如果`dataReady`是一个普通变量，可能由于缓存不一致性，导致`consumer`读取到的值不正确，如果读取到的值为`true`，则出现`虚假唤醒`。

## 2. notify_one 与 notify_all ##

当使用`notify_all`的时候，后续被唤醒的`consumer`需要等第一个`consumer`释放锁之后，才能重新获取锁，然后再经过一次`谓词`检查，此时，可能`谓词`返回`false`，则继续进入等待状态。

### 3. lock_guard 与 unique_lock ##

对于`producer`，使用`lock_guard`即可，因为只需要持锁一次操作完成之后随即释放，没有再次持锁的需求。也可以使用``unique_lock`，但需要保证在`notify`之前释放锁。

对于`consumer`，必须使用`unique_lock`，因为`wait`需要传入一个`unique_lock`对象，并且在`wait`过程中会释放锁，等待被唤醒之后重新获取锁继续工作。

## 参考 ##

* [cppreference: std::condition_variable](https://en.cppreference.com/w/cpp/thread/condition_variable/wait)
* [C++ Core Guidelines: Be Aware of the Traps of Condition Variables](https://www.modernescpp.com/index.php/c-core-guidelines-be-aware-of-the-traps-of-condition-variables/)
* [中文翻译：条件变量condition_variable的使用及陷阱](https://www.cnblogs.com/fenghualong/p/13855360.html)

