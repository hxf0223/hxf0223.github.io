---
layout: post
title: Linux系统及编译相关笔记
date: 2024-05-11 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Linux]
tags: [Linux, GCC]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. 加载多个DSO中存在同名符号 ##

`APP`加载的多个`DSO`，如果存在重复的符号，则只加载第一个遇到的符号。规则适合于包括函数，全局变量。

加载顺序，由链接顺序，以及环境变量定义lib路径优先级，如`RPATH`，`LD_LIBRARY_PATH`。路径搜索优先级为：`RPATH` > `LD_LIBRARY_PATH` > `ld.so.cache`。

### 1.1. RPATH ###

编译期间，设定`RPATH`，如`cmake`脚步设置如下：

```cmake
set_target_properties(${target_name} PROPERTIES LINK_FLAGS "-Wl,-rpath='$ORIGIN' ")
```

如果存在间接依赖，则也优先使用`RPATH`设定的路径进行搜索。

### 1.1.1. ORIGIN 占位符 ###

`$ORIGIN`是一个特殊的占位符，代表可执行文件或库文件自身的目录，当设置为`$ORIGIN`时，它告诉动态链接器在可执行文件或库所在的同一目录下查找依赖的库。

### 1.2. 调试lib加载--LD_DEBUG ###

设置环境变量`LD_DEBUG`使能系统级加载信息：

```bash
LD_DEBUG=libs ./test_app
```

### 1.3. 参考链接 ###

* [Linux运行时动态库搜索路径优先级](https://www.cnblogs.com/ForestCherry/p/18497797)
* [gitee -- 测试代码](https://gitee.com/misc_projects/dup_symbol_test)

## 2. Linux命令：查看APP/DSO的编译器信息 ##

查看架构：

```bash
file bin/jouav_cluster_msg_simu
# readelf -h bin/jouav_cluster_msg_simu | grep Machine
```

查看编译器版本：

```bash
readelf -p .comment bin/jouav_cluster_msg_simu
```

## 3. 其他文章 ##

* [linux更换题目(可执行文件)libc版本问题](https://www.cnblogs.com/Taolaw/p/16281185.html)
