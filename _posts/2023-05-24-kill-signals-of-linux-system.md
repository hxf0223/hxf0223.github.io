---
layout: post
title: kill信号不同分类的影响
date: 2023-05-24 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Linux]
tags: [Bash, Linux]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

与`kill -KILL`不同的是，`kill -INT -PID` 将通知被结束进程，等同于`Ctrl+C`。
例如如果结束一个script，该script中同步启动了一个APP，使用`kill -INT -<PIDofScript>`可以同时将这个APP结束掉，`kill -KILL`则不行。

| 分类                           | 信号                                                                                                      |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| 程序不可捕获、阻塞或忽略的信号 | SIGKILL, SIGSTOP                                                                                          |
| 不能恢复至默认动作的信号       | SIGILL, SIGTRAP                                                                                           |
| 默认会导致进程流产的信号       | SIGABRT, SIGBUS, SIGFPE, SIGILL, SIGIOT, SIGQUIT, SIGSEGV, SIGTRAP, SIGXCPU, SIGXFSZ                      |
| 默认会导致进程退出的信号       | SIGALRM, SIGHUP, SIGINT, SIGKILL, SIGPIPE, SIGPOLL, SIGPROF, SIGSYS, SIGTERM, SIGUSR1, SIGUSR2, SIGVTALRM |
| 默认会导致进程停止的信号       | SIGSTOP, SIGTSTP, SIGTTIN, SIGTTOU                                                                        |
| 默认进程忽略的信号             | SIGCHLD, SIGPWR, SIGURG, SIGWINCH                                                                         |

[Linux 下的KILL函数的用法 - 拂 晓 - 博客园 (cnblogs.com)](https://www.cnblogs.com/leeming0222/articles/3994125.html)

如果`kill`不能结束掉，则尝试使用`pkill`：

```bash
pkill -TERM -P <PID of script>
```
