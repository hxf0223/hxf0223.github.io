---
layout: post
title: perf性能分析(4) -- linux perf 工具基本使用(1)
date: 2024-10-28 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Performance]
tags: [Performance, VTune, TBB]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. `perf stat` 基本使用 ##

`perf stat` 基本功能 -- 统计：

* `cycles` 数, `IPC (instructions per cycle)`。`IPC` >= 1 表示指令执行效率高
* 分支切换次数(`branchs`), 分支预测失败次数(`branch-misses`)，以及失败比例
* 上下文切换次数(`context switches`)，以及每秒切换次数
* CPU迁移次数(`migrations`)，以及每秒迁移次数
* 缺页次数(`page faults`)，以及每秒缺页次数

```bash
$ sudo perf stat -p 8460

 Performance counter stats for process id '8460':

      1,763,985.38 msec task-clock                       #    7.974 CPUs utilized
             5,976      context-switches                 #    3.388 /sec
                19      cpu-migrations                   #    0.011 /sec
                 7      page-faults                      #    0.004 /sec
 5,402,549,520,366      cycles                           #    3.063 GHz
 1,249,986,676,725      instructions                     #    0.23  insn per cycle
   247,349,019,761      branches                         #  140.222 M/sec
       217,175,635      branch-misses                    #    0.09% of all branches

     221.220644606 seconds time elapsed
```

## 参考资料 ##

* [redhat -- Red Hat Enterprise Linux 8 监控和管理系统状态和性能](/assets/pdf/perf/perf_doc_20241028/Red_Hat_Enterprise_Linux-8-Monitoring_and_managing_system_status_and_performance-zh-CN.pdf)
* [redhat -- 监控和管理系统状态和性能(网页版)](https://docs.redhat.com/zh_hans/documentation/red_hat_enterprise_linux/8/html/monitoring_and_managing_system_status_and_performance/index)
* [调试技术之perf实战笔记](https://saiyn.github.io/homepage/2017/11/26/perf/)


