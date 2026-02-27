---
layout: post
title: 使用inotify监控文件目录中的文件变化（新建文件）
date: 2024-06-24 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp, Linux]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

通过结合使用`epoll`和`inotify` 实现监控功能的同时，以超时的方式实现轮询，适合线程退出。

```cpp
int inotifyId = inotify_init();
if (-1 == inotifyId) {
  SPDLOG_WARN("inotify_init failed");
  return;
}

int epfd = epoll_create(INOTIFY_FDS);
if (-1 == epfd) {
  SPDLOG_WARN("epoll_create failed");
  return;
}

struct epoll_event ev;
ev.data.fd = inotifyId;
ev.events = EPOLLIN | EPOLLET;
int ret = epoll_ctl(epfd, EPOLL_CTL_ADD, inotifyId, &ev);
if (-1 == ret) {
  SPDLOG_WARN("epoll_ctl failed");
  return;
}

const char* pathName = "<dir of files to monitor>";
const uint32_t watch_mask = (IN_CLOSE_WRITE | IN_MODIFY | IN_ATTRIB);
int watchFd = inotify_add_watch(inotifyId, pathName, watch_mask);
if (watchFd < 0) {
  SPDLOG_WARN("inotify_add_watch failed");
  return;
}

SPDLOG_INFO("start monitor path: {}", pathName);
// 循环监听事件
{
  /* Some systems cannot read integer variables if they are not
              properly aligned. On other systems, incorrect alignment may
              decrease performance. Hence, the buffer used for reading from
              the inotify file descriptor should have the same alignment as
              struct inotify_event. */
  char buf[INOTIFY_BUF_LEN] = {} __attribute__ ((aligned(__alignof__(struct inotify_event))));
  struct epoll_event events[20];
  while (runningFlag) {
    int nfds = epoll_wait(epfd, events, 20, 100);
    if (nfds <= 0) {
      if (nfds < 0 && errno != EINTR) {
        SPDLOG_WARN("epoll_wait error: {}", strerror(errno));
      }
      continue;
    }
    if (events[0].data.fd != inotifyId) {
      SPDLOG_WARN("epoll_wait error: events[0].data.fd!= inotifyId");
      continue;
    }
    int nread{}, length = read(inotifyId, buf, INOTIFY_BUF_LEN - 1);
    if (length < 0) {
      SPDLOG_WARN("read error: {}", strerror(errno));
      continue;
    }
    while (length > 0) {
      // 解析事件
    }
  }
}

// 退出清理
inotify_rm_watch(inotifyId, watchFd);
close(epfd);
close(inotifyId);
```

## 参考

- [Linux C 使用 inotify 监控文件或目录变化](https://www.cnblogs.com/PikapBai/p/14480881.html)
- [linux 文件监控之 inotify](https://www.cnblogs.com/jssyjam/p/15490634.html)
- [inotify(7) — Linux manual page](https://man7.org/linux/man-pages/man7/inotify.7.html)
- [Monitor file system activity with inotify](https://developer.ibm.com/tutorials/l-ubuntu-inotify/)

