---
title: Linux 系统console使用命令清屏
date: 2023-07-02 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [shell]
tags: [shell]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---


```bash
echo -en "\e[H\e[J\e[3J"
```

## reference

* [clear command in Konsole](https://superuser.com/questions/122911/what-commands-can-i-use-to-reset-and-clear-my-terminal)
