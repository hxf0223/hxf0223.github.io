---
layout: post
title: 使能 C++ 程序的核心转储
date: 2024-06-19 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. 使能 core dump

```bash
# 查看是否使能 core dump, -a 显示所有设置
sudo ulimit -c

# 使能 core dump，不限制core dump文件大小
sudo ulimit -c unlimited

# 限制 core dump 文件大小为 2G
sudo ulimit -c 4194304

# 关闭 core dump
sudo ulimit -c 0
```

## 2. 修改 core dump 文件位置

临时修改 core dump 文件位置：

```bash
# 修改 core dump 文件位置为 /tmp/corefile，以及格式
echo /tmp/corefile/core-%e-%p-%t > /proc/sys/kernel/core_pattern
```

永久修改 core dump 文件位置：

```bash
# /etc/sysctl.conf
kernel.core_pattern = /tmp/corefile/core-%e-%p-%t
kernel.core_uses_pid = 0

# 生效
sysctl –p /etc/sysctl.conf
```

core dump文件格式：

```text
%p - insert pid into filename 添加pid(进程id)
%u - insert current uid into filename 添加当前uid(用户id)
%g - insert current gid into filename 添加当前gid(用户组id)
%s - insert signal that caused the coredump into the filename 添加导致产生core的信号
%t - insert UNIX time that the coredump occurred into filename 添加core文件生成时的unix时间
%h - insert hostname where the coredump happened into filename 添加主机名
%e - insert coredumping executable name into filename 添加导致产生core的命令名
```

## 3. core dump 管理工具：coredumpctl

```bash
# 查看 core dump 列表
sudo coredumpctl list

# 显示指定 core dump 文件信息
sudo coredumpctl info core_filename

# 分析 core dump 文件
sudo coredumpctl gdb core_filename
```

## 4. 使用 gdb 调试 core dump 文件

编译 core dump 文件时，需要加上 `-g` 参数。

使用`file`命令查看 core dump 文件是由哪个可执行文件产生的：

![core_file_info](/assets/images/cpp/file_command_core_dump_file_info.png)

### 4.1 调试 core dump 文件

```bash
gdb program core（gdb + 可执行文件 +core文件）
```

## 5. 参考

- [coredump文件生成，以及GDB工具使用](https://www.cnblogs.com/muxisuibi/p/17878055.html)

