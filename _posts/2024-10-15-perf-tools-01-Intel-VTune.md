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

## 1. `Intel VTune` 安装、更新与驱动配置

### 1.1 安装与多版本更新（oneAPI Base Toolkit）

Intel oneAPI 采用多版本并存（Side-by-Side）目录设计，默认安装在 `/opt/intel/oneapi` 下，安装新版本（如 `2026.2`）时会自动将 `/opt/intel/oneapi/vtune/latest`、`/opt/intel/oneapi/tbb/latest` 等软链接更新指向最新版本，无需强制卸载旧版本。

```bash
# 命令行静默安装/更新（推荐）
sudo sh ./intel-oneapi-base-toolkit-2026.2.*.sh -a --silent --eula accept

# 或者终端交互式勾选安装组件
sudo sh ./intel-oneapi-base-toolkit-2026.2.*.sh -a --cli

# （可选）若需卸载旧版本释放磁盘空间，可调用内置安装器交互式移除
sudo /opt/intel/oneapi/installer/installer --cli
```

安装完成后加载环境变量并验证版本：

```bash
source /opt/intel/oneapi/setvars.sh --force
vtune --version
```

### 1.2 将当前用户加入 `vtune` 权限组

VTune 硬件采样驱动设备节点（如 `/dev/pax`、`/proc/vtsspp`）默认属组为 `vtune`（权限 `660`），需将当前非 root 用户加入 `vtune` 组：

```bash
# 若系统尚无 vtune 组则先创建
sudo groupadd -f vtune

# 将当前用户加入 vtune 组
sudo usermod -aG vtune $USER

# 当前终端立即生效（或注销重登）
newgrp vtune
```

### 1.3 配置 Linux 内核采样与 `ptrace` 权限

为允许普通用户进行进程附加跟踪（`ptrace`）、硬件性能计数器（PMU/Perf）采集以及内核符号地址解析，需要将以下三项内核参数设为 `0` 并持久化：

- `kernel.yama.ptrace_scope = 0`：放开进程跟踪限制，允许 VTune 监控用户态进程与线程。
- `kernel.perf_event_paranoid = 0`：允许非特权用户访问 CPU 硬件性能计数器事件。
- `kernel.kptr_restrict = 0`：允许解析内核函数符号地址。

```bash
sudo tee /etc/sysctl.d/99-vtune.conf << 'EOF'
kernel.yama.ptrace_scope = 0
kernel.perf_event_paranoid = 0
kernel.kptr_restrict = 0
EOF

# 立即生效
sudo sysctl --system
```

### 1.4 编译加载 Sampling Drivers（`sepdk`）与开机自启

通常以 `root` 权限运行 oneAPI 安装包时会自动编译加载采样驱动（`sep5`、`vtsspp`、`pax`）。若未自动安装或后续升级了 Linux 内核，可前往驱动源码目录手动编译并注册开机自启服务：

```bash
cd /opt/intel/oneapi/vtune/latest/sepdk/src

# 1. 编译驱动
sudo ./build-driver -ni

# 2. 加载驱动并指定所属权限组为 vtune
sudo ./insmod-sep -r -g vtune

# 3. 注册 systemd 开机自动加载服务
# 注意：必须通过 -d 显式指定驱动目录，规避 boot-script 在 sudo 下将 $PWD/$0 重复拼接绝对路径的 Bug
sudo ./boot-script --install -g vtune -d /opt/intel/oneapi/vtune/latest/sepdk/src
```

> **踩坑记录**：若直接执行 `sudo ./boot-script --install -g vtune` 而不带 `-d`，脚本内部 `dirname $PWD/$SCRIPT` 在 `sudo` 展开 `$0` 为绝对路径时会拼出 `/opt/intel/.../src//opt/intel/.../src` 导致报错 `is not accessible by root user!`。显式加上 `-d /opt/intel/oneapi/vtune/latest/sepdk/src`（或使用 `sudo sh boot-script ...`）即可解决。

### 1.5 检查软硬件配置与可用 Profiling 能力

运行 VTune 自检脚本，验证当前系统的驱动、权限及支持的采样分析类型：

```bash
/opt/intel/oneapi/vtune/latest/bin64/vtune-self-checker.sh
```

脚本会逐项检测并输出当前环境可执行的 `Profiling` 类型及潜在配置建议。

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
