---
layout: post
title: 使用 libevent 实现时间戳调度
date: 2025-12-05 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Libevent, Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. 介绍

`libevent`底层使用不同的事件通知机制：linux 使用`epoll`，Windows使用`IOCP`。它提供了一个统一的接口来处理网络事件和定时事件。

使用`libevent`的几个基本操作步骤：

### 1.1. 创建 `event_base` 对象，作为事件循环的核心

```cpp
struct event_base *base = event_base_new();
```

- `event_base`只能在一个线程中使用。

### 1.2. 创建事件处理器

```cpp
struct event *ev = event_new(base, fd, EV_READ | EV_PERSIST, my_read_callback, NULL);
```

`fd`是文件描述符，`EV_READ | EV_PERSIST`指定了事件类型（这里是读事件并且是持久的，即事件被触发后不会自动删除），`my_read_callback`是事件触发时调用的函数，最后一个参数是传递给回调函数的用户数据。

回调函数在同一个线程中执行。

### 1.3. 添加事件到事件循环中

```cpp
event_add(ev, NULL);
```

### 1.4. 启动事件循环

```cpp
event_base_dispatch(base);
```

判断事件循环是否应该退出：

```cpp
const auto got_break = event_base_got_break(base);
const auto got_exit = event_base_got_exit(base);
return got_break == 0 && got_exit == 0;
```

### 1.5. 清理资源

```cpp
event_free(ev);
event_base_free(base);
```

## 2. 使用 libevent 实现时间戳调度

创建`event_base`对象：

```cpp
void PcapngPlayer::start() {
  // ...

  if (base_ = event_base_new(); !base_) {
    spdlog::error("Could not initialize libevent!");
    return;
  }

  // ...

  scheduleNextPacket();
  event_base_dispatch(base_);
}
```

创建`event`，实现本次帧时间计算及调度启动：

```cpp
void PcapngPlayer::scheduleNextPacket() {
  if (curr_idx_ > end_idx_ || curr_idx_ >= udp_packets_.size()) {
    event_base_loopbreak(base_);
    return;
  }

  const int64_t diff = timestamp_u64(udp_packets_[curr_idx_]) - curr_ts_;
  timeval wait = diff > 0 ? timeval_from_us(diff) : timeval_from_us(0);

  timer_event_ = evtimer_new(base_, timerCallback, this);
  evtimer_add(timer_event_, &wait);
}
```

实现定时器回调函数，销毁本次定时器`event`，以及下一帧启动：

```cpp
void PcapngPlayer::timerCallback(evutil_socket_t fd, short what, void* arg) {
  PcapngPlayer* player = static_cast<PcapngPlayer*>(arg);
  // ...

  player->curr_ts_ = timestamp_u64(udp_info);
  player->curr_idx_++;

  event_free(player->timer_event_);
  player->timer_event_ = nullptr;

  player->scheduleNextPacket();
}
```

最后，需要在启动之后，轮询等待事件循环退出：

```cpp
while (true) {
  // 检查libevent事件循环是否退出
  // ...

  std::this_thread::sleep_for(std::chrono::milliseconds(100));
}
```

## 3. libevent事件循环

```cpp
int event_base_loop(struct event_base *base, int flags) {
    // ... 初始化与锁 ...

    while (!done) {
        // 1. 检查是否需要立即停止
        if (base->event_gotterm) {
            break;
        }

        // 2. 计算后端等待时间 (Timeout)
        // 从最小堆中取出最近的一个定时器时间
        tv_p = &tv;
        if (!base->event_count_active && !(flags & EVLOOP_NONBLOCK)) {
            timeout_next(base, &tv_p);
        } else {
            // 如果有激活事件，或者是非阻塞模式，则不等待
            evutil_timerclear(&tv);
        }

        // 3. 调用后端 (Backend Dispatch)
        // 例如调用 epoll_wait，将就绪的 fd 对应的 event 插入激活队列
        res = base->evsel->dispatch(base, tv_p);

        // 4. 处理超时事件
        timeout_process(base);

        // 5. 处理激活队列 (Process Active Events)
        if (base->event_count_active) {
            event_process_active(base);
        } else if (flags & EVLOOP_ONCE) {
            // 如果是 EVLOOP_ONCE 模式且没有事件被激活，则退出
            done = 1;
        }
    }

    // ... 清理 ...
    return 0;
}
```

- [Event Base 与 Event Loop](https://quant67.com/post/libevent/01-core/event-base-loop.html)
