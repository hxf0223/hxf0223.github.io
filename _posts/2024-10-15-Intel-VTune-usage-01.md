---
title: Intel VTune 配置与使用 (1)
date: 2024-10-15 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [perf]
tags: [perf, vtune, tbb, c++]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. `Intel VTune` 配置 ##

### 1.1 使能 `ptrace` ###

使能进程跟踪 (ptrace) 功能 (attach ID)，以便 `VTune` 可以监控到进程的运行情况。

```bash
sudo vim /etc/sysctl.d/10-ptrace.conf
# set kernel.yama.ptrace_scope = 0

# 使配置生效
sudo sysctl --system -a -p | grep yama # 应用配置，或者也可以选择重启电脑
```

### 1.2 安装 Sampling Drivers ###

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

### 1.3 检查软硬件配置: 查看VTune Profiler 可以做哪些profiling ###

```bash
~/intel/oneapi/vtune/latest/bin64
python3 self_check.py
```

最终会出来一个结果， 显示 `VTune Profiler` 可以做哪些 `profiling`, 哪些 `profiling` 不能做。

## 2. 参考及资料 ##

* [【性能】性能分析工具VTune|perf相关性工具](https://www.cnblogs.com/bandaoyu/p/16751995.html)
* [perf Examples](https://www.brendangregg.com/perf.html)
* [现代CPU性能分析与优化 -- Intel Vtune](https://weedge.github.io/perf-book-cn/zh/chapters/7-Overview-Of-Performance-Analysis-Tools/7-1_Intel_Vtune_cn.html)
* [intel-TBB使用笔记](https://chuckiewill.github.io/2022/01/26/C++/IntelTBB/)
* [Intel TBB API 官方教程](https://www.intel.com/content/www/us/en/docs/onetbb/developer-guide-api-reference/2021-13/reduction.html)
* [oneTBB Developer Guide](https://oneapi-src.github.io/oneTBB/main/tbb_userguide/title.html)
