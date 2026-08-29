---
layout: post
title: perf性能分析(1) -- Intel VTune 配置与使用(1)
date: 2024-10-15 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Performance]
tags: [Performance, VTune, TBB, Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. `Intel VTune` 配置

### 1.1 使能 `ptrace`

使能进程跟踪 (ptrace) 功能 (attach ID)，以便 `VTune` 可以监控到进程的运行情况。

```bash
sudo vim /etc/sysctl.d/10-ptrace.conf
# set kernel.yama.ptrace_scope = 0

# 使配置生效
sudo sysctl --system -a -p | grep yama # 应用配置，或者也可以选择重启电脑
```

### 1.2 安装 Sampling Drivers

```bash
cd ~/intel/oneapi/vtune/latest/sepdk/src
./build-driver

# 添加 vtune 组并将你的用户添加到该组
# 创建一个新的 shell，或者重新启动系统
sudo groupadd vtune
sudo usermod -a -G vtune `whoami`

# 安装 sep 驱动程序
sudo ./insmod-sep -r -g vtune
```

### 1.3 检查软硬件配置: 查看VTune Profiler 可以做哪些profiling

```bash
~/intel/oneapi/vtune/latest/bin64
python3 self_check.py
```

最终会出来一个结果， 显示 `VTune Profiler` 可以做哪些 `profiling`, 哪些 `profiling` 不能做。

## 2. 参考及资料

- [Intel® VTune™ Profiler 分析 C++ 程序的常见性能瓶颈( Windows 平台)](https://www.zevorn.cn/posts/8)
- [perf Examples](https://www.brendangregg.com/perf.html)
- [现代CPU性能分析与优化 -- Intel Vtune](https://weedge.github.io/perf-book-cn/zh/chapters/7-Overview-Of-Performance-Analysis-Tools/7-1_Intel_Vtune_cn.html)
- [自顶向下的微架构分析方法](https://www.intel.cn/content/www/cn/zh/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html)
- [Intel® VTune™ Profiler Performance Analysis Cookbook](https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2025-4/overview.html)
- [VTune Documentation & Code Samples](https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler-documentation.html)
- [HOW: Analysis Types](https://hpc.scut.edu.cn/docs/software/list/tools/intel_vtune.html#how-analysis-types)
- [intel-TBB使用笔记](https://chuckiewill.github.io/2022/01/26/C++/IntelTBB/)
- [Intel TBB API 官方教程](https://www.intel.com/content/www/us/en/docs/onetbb/developer-guide-api-reference/2021-13/reduction.html)
- [oneTBB Developer Guide](https://oneapi-src.github.io/oneTBB/main/tbb_userguide/title.html)

## 3. TBB 调度实现

- [TBB并发库代码学习](https://woodpenker.github.io/2022/01/16/TBB%E5%B9%B6%E5%8F%91%E5%BA%93%E4%BB%A3%E7%A0%81%E5%AD%A6%E4%B9%A0/)
- [C++ TBB 并行编程教程 -- 控制用于执行的线程数量](https://github.com/apachecn/apachecn-c-cpp-zh-pt3/blob/master/docs/cpp-paral-prog-thrd-bb/11.md)
- [oneTBB Developer Guide](https://uxlfoundation.github.io/oneTBB/main/tbb_userguide/title.html)
