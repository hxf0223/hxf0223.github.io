---
layout: post
title: Redis常用命令总结
date: 2024-07-05 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Redis]
tags: [Redis]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. redis monitor

```bash
# 运行一下命令，进入monitor模式，可以实时查看redis的命令执行情况
redis-cli monitor
```

moniotor模式下，每执行一条redis命令，就会有类似如下输出：

```bash
1720185799.917896 [0 127.0.0.1:43768] "COMMAND" "DOCS"
1720185984.438276 [0 127.0.0.1:43768] "set" "mykey" "hello" "EX" "60"
1720186045.464191 [0 127.0.0.1:43768] "set" "mykey" "KEEPTTL"
1720186089.705980 [0 127.0.0.1:43768] "set" "mykey" "hello"
```

- 开启monitor之后，对性能有较大影响。

## 2. redis 设置 key-value

```bash
# 使用 redis-cli 命令进入redis命令行
redis-cli

127.0.0.1:6379> set mykey hello
OK
127.0.0.1:6379> get mykey
"hello"
```

## 参考

- [监控 redis 执行命令](https://www.cnblogs.com/weihanli/p/monitor-redis-command.html)
- [redis 介绍和常用命令](https://www.cnblogs.com/weihanli/p/rediscommands.html)
- [Redis 常用命令及示例总结](https://www.cnblogs.com/dlhjw/p/15639773.html)
- [如何查看 修改 Redis 密码](https://www.cnblogs.com/qq1445496485/p/14476560.html)
