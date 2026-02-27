---
layout: post
title: 通过函数指针地址找到函数
date: 2023-05-5 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [GDB]
tags: [GDB, Linux, Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

```bash
# 通过地址找到函数声明
info symbol 0x7f0db14cf57e
# 通过地址找到函数在哪一行
info line *0x7f0db14cf57e
# 查看加载了哪些共享库
info sharedlibrary
```

参考

* [16 Examining the Symbol Table](https://sourceware.org/gdb/onlinedocs/gdb/Symbols.html)

