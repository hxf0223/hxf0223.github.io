---
layout: post
title: Linux 性能及统计工具 (1)
date: 2024-10-26 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Performance]
tags: [Linux, Performance, Bash]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. Virtual Memory Statistics -- `vmstat`

`vmstat` 检测`cpu`、`系统内存(包括 slab)`、`进程`、`块设备IO`等使用情况：

- `CPU`相关：`用户时间` / `系统时间` / `空闲时间`占比。每秒`中断数量` / `上下文切换数量`。活动进程数量 / 阻塞进程数量，`fork`进程数量。
- 内存相关：`active`/`inactive`内存，`buff`/`cache`内存，`swap`使用及每秒交换量。
- IO：每秒读写的块数量。

### 1.1. 基本用法

```bash
$ vmstat -S M # 内存以兆为单位显示
procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
 1  0      0  14431     60    749    0    0   357    33  165    0  0  0 100  0  0  0
```

[procs]
r -- 运行队列中进程数量，如果该值大于核数，说明系统可能存在CPU瓶颈。
b -- 阻塞的进程数量，如果该值较大，说明系统可能存在IO瓶颈。

[memory]
swpd -- `swap space`，`swpd`显示当前被换到物理磁盘上的物理内存的大小。该值大于0表示物理内存不足。
free -- 空闲物理内存的大小。
buff -- 块设备的缓冲区占用的大小，`buff`、`cache`大代表系统有效利用了内存，能够提高IO性能(在有大量`IO`时，或者文件读写情况下)。
cache -- 文件缓存占用的大小。

[swap]
si -- 每秒从物理磁盘读入到虚拟内存的大小。含义见`swpd`。
so -- 每秒从虚拟内存写到物理磁盘的大小。含义见`swpd`。

[io]
bi -- 块设备每秒接收的块数量。
bo -- 块设备每秒发送的块数量。

[system]
in -- interrupt，每秒中断数，包括时钟中断。
cs -- count per second，每秒上下文切换数量。包括系统调用、进程切换、线程切换等。

[cpu]
us -- 用户进程执行时间百分比。
sy -- 内核进程执行时间百分比。
id -- 空闲时间百分比。一般 us + sy + id =100。
wa -- 等待IO时间百分比。
st -- 被信号中断的进程时间百分比。
gu -- 被引起的页错误的进程时间百分比。

### 1.2 查看统计信息 -- 内存及CPU相关

```bash
$ vmstat -s -S M

        15881 M total memory
          946 M used memory
          804 M active memory
          252 M inactive memory
        14421 M free memory
           61 M buffer memory
          749 M swap cache
         4095 M total swap
            0 M used swap
         4095 M free swap
         1707 non-nice user cpu ticks
           82 nice user cpu ticks
         1977 system cpu ticks
      4068162 idle cpu ticks
          176 IO-wait cpu ticks
            0 IRQ cpu ticks
           15 softirq cpu ticks
            0 stolen cpu ticks
            0 non-nice guest cpu ticks
            0 nice guest cpu ticks
       672044 K paged in
        66205 K paged out
            0 pages swapped in
            0 pages swapped out
       438059 interrupts
       452000 CPU context switches
   1729905791 boot time
         3331 forks
```

### 1.3 其他选项用法

```bash
vmstat -a # 显示 active/inactive 内存
vmstat -d # 显示磁盘IO统计信息
vmstat -f # fork 进程统计信息
vmstat -m # 内核 SLAB 相关统计信息
```

```bash
vmstat 2 # 每两秒输出一次统计信息
vmstat 1 5 -t # 每隔一秒输出一次统计信息，持续5秒，并显示时间戳
```

## 2. top 命令

```bash
$ top

top - 11:16:35 up  1:53,  5 users,  load average: 3.15, 0.77, 0.26
Tasks: 252 total,   2 running, 250 sleeping,   0 stopped,   0 zombie
%Cpu(s):100.0 us,  0.0 sy,  0.0 ni,  0.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :  15881.5 total,  14023.4 free,   1340.6 used,    816.5 buff/cache
MiB Swap:   4096.0 total,   4096.0 free,      0.0 used.  14541.0 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
  # ...
```

1. 第一行
   - 启动时间，持续时间： `11:16:35 up  1:53`
   - 系统1分钟、5分钟、15分钟的CPU负载值：`load average: 3.15, 0.77, 0.26`
2. 第三行
   - CPU占用：`us` 用户进程占比；`sy` 内核CPU占比；`wa`(IO wait) 等待IO的CPU时间占比；`hi` 硬件中断CPU时间占比；`si` 软件中断CPU时间占比；`st` 虚拟机偷取(steal)CPU时间占比。

### 2.1 查看进程下所有线程信息

```bash
$ top -Hp <PID>

# ......
```

## 3. uptime 命令

```bash
$ uptime
 11:16:35 up  1:53,  5 users,  load average: 3.15, 0.77, 0.26
```

## 更多资料

- [Velocity2015_LinuxPerfTools pdf](https://www.brendangregg.com/Slides/Velocity2015_LinuxPerfTools.pdf)
