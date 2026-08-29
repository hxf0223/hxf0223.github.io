---
layout: post
title: 从Makefile创建compile_commands.json
date: 2023-06-05 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Bash]
tags: [Bash]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 操作步骤

```bash
# https://github.com/nickdiego/compiledb
pip install compiledb
```

使用方法：

```bash
compiledb make
```
