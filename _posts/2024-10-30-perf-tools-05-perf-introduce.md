---
layout: post
title: perf性能分析(5) -- linux perf 工具介绍
date: 2024-10-30 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Performance]
tags: [Performance, VTune, TBB]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. `perf` 介绍 ##

`perf`及子命令可以测量/记录系统性能，可以记录的性能数据项繁多。包括`CPU/PMU`等硬件数据，以及`software counter`/`tracepoint`等系统内核采集的数据。可以关注的几类：

* `CPU` / `PMU` (Performance Monitoring Unit)数据。包括: `dTLB`, `iTLB`, `cache` 计数以及`miss`计数；`branch`及`branch miss`计数。
* `memory` 延时、阻塞；
* `bus`延时、阻塞；
* `front end`/`back end`阻塞；
* `virtual memory`相关: `TLB`相关。
* `pipeline`相关。

查看`perf`命令及子命令帮助信息：

```bash
man perf

man perf-top

man perf-stat

man perf-record

man perf-report
```

查看`perf`所有子命令:

```bash
$ perf

 usage: perf [--version] [--help] [OPTIONS] COMMAND [ARGS]

 The most commonly used perf commands are:
   annotate        Read perf.data (created by perf record) and display annotated code
   archive         Create archive with object files with build-ids found in perf.data file
   bench           General framework for benchmark suites
   buildid-cache   Manage build-id cache.
   buildid-list    List the buildids in a perf.data file
   c2c             Shared Data C2C/HITM Analyzer.
   config          Get and set variables in a configuration file.
   daemon          Run record sessions on background
   data            Data file related processing
   diff            Read perf.data files and display the differential profile
   evlist          List the event names in a perf.data file
   ftrace          simple wrapper for kernel's ftrace functionality
   inject          Filter to augment the events stream with additional information
   iostat          Show I/O performance metrics
   kallsyms        Searches running kernel for symbols
   kvm             Tool to trace/measure kvm guest os
   list            List all symbolic event types
   mem             Profile memory accesses
   record          Run a command and record its profile into perf.data
   report          Read perf.data (created by perf record) and display the profile
   script          Read perf.data (created by perf record) and display trace output
   stat            Run a command and gather performance counter statistics
   test            Runs sanity tests.
   top             System profiling tool.
   version         display the version of perf binary
   probe           Define new dynamic tracepoints

 See 'perf help COMMAND' for more information on a specific command.
```

查看子命令的帮助信息，如`perf stat`：

```bash
$ perf stat -h

 Usage: perf stat [<options>] [<command>]

    -a, --all-cpus        system-wide collection from all CPUs
    -A, --no-aggr         disable aggregation across CPUs or PMUs
    -B, --big-num         print large numbers with thousands' separators
    -C, --cpu <cpu>       list of cpus to monitor in system-wide
    -D, --delay <n>       ms to wait before starting measurement after program start (-1: start with events disabled)
    # ......
```

## 2. Events ##

`perf` 记录的性能数据项，称为`events`。主要分为软件 `Events` 和硬件 `Events`。

软件 `Events` 比如有：`context-switchs`, `minor-fault`等等。
硬件 `Events` 主要记录`micro-architecture`相关性能数据，由`CPU`/`PMU`提供。如果硬件没有提供，该对应该`event`不可用。

使用 `perf list` 查看 `perf` 支持的 `events`：

```bash
$ perf list

List of pre-defined events (to be used in -e or -M):

  branch-instructions OR branches                    [Hardware event]
  branch-misses                                      [Hardware event]
  bus-cycles                                         [Hardware event]
  cache-misses                                       [Hardware event]
  cache-references                                   [Hardware event]
  cpu-cycles OR cycles                               [Hardware event]
  instructions                                       [Hardware event]
  ref-cycles                                         [Hardware event]
  alignment-faults                                   [Software event]
  bpf-output                                         [Software event]
  cgroup-switches                                    [Software event]
  context-switches OR cs                             [Software event]
  cpu-clock                                          [Software event]
  cpu-migrations OR migrations                       [Software event]
  dummy                                              [Software event]
  emulation-faults                                   [Software event]
  major-faults                                       [Software event]
  minor-faults                                       [Software event]
  page-faults OR faults                              [Software event]
  task-clock                                         [Software event]
  duration_time                                      [Tool event]
  user_time                                          [Tool event]
  system_time                                        [Tool event]

cpu:
  L1-dcache-loads OR cpu/L1-dcache-loads/
  L1-dcache-load-misses OR cpu/L1-dcache-load-misses/
  L1-dcache-stores OR cpu/L1-dcache-stores/
  L1-icache-load-misses OR cpu/L1-icache-load-misses/
  LLC-loads OR cpu/LLC-loads/
  LLC-load-misses OR cpu/LLC-load-misses/
  LLC-stores OR cpu/LLC-stores/
  LLC-store-misses OR cpu/LLC-store-misses/
  dTLB-loads OR cpu/dTLB-loads/
  dTLB-load-misses OR cpu/dTLB-load-misses/
  dTLB-stores OR cpu/dTLB-stores/
  dTLB-store-misses OR cpu/dTLB-store-misses/
  iTLB-loads OR cpu/iTLB-loads/
  iTLB-load-misses OR cpu/iTLB-load-misses/
  branch-loads OR cpu/branch-loads/
  branch-load-misses OR cpu/branch-load-misses/
  node-loads OR cpu/node-loads/
  node-load-misses OR cpu/node-load-misses/
  node-stores OR cpu/node-stores/
  node-store-misses OR cpu/node-store-misses/
  branch-instructions OR cpu/branch-instructions/    [Kernel PMU event]
  branch-misses OR cpu/branch-misses/                [Kernel PMU event]
  bus-cycles OR cpu/bus-cycles/                      [Kernel PMU event]
  cache-misses OR cpu/cache-misses/                  [Kernel PMU event]
  cache-references OR cpu/cache-references/          [Kernel PMU event]
  cpu-cycles OR cpu/cpu-cycles/                      [Kernel PMU event]
  instructions OR cpu/instructions/                  [Kernel PMU event]
  mem-loads OR cpu/mem-loads/                        [Kernel PMU event]
  mem-stores OR cpu/mem-stores/                      [Kernel PMU event]
  # ......
```

## 3. 使用 `perf stat` 记录性能数据，并输出到终端 ##

使用 `perf stat` 命令，可以运行被测试程序，并在程序结束之后，统计各不同`Events`的计数，并打印出来。也可以使用`-p`参数，指定运行程序的进程号。

```bash
$ perf stat ls -l /usr/bin/ls

 Performance counter stats for 'ls -lh /home/hxf0223/':

              1.65 msec task-clock                       #    0.757 CPUs utilized
                 0      context-switches                 #    0.000 /sec
                 0      cpu-migrations                   #    0.000 /sec
               112      page-faults                      #   67.878 K/sec
         4,892,473      cycles                           #    2.965 GHz
         3,714,068      instructions                     #    0.76  insn per cycle
           681,289      branches                         #  412.897 M/sec
            20,522      branch-misses                    #    3.01% of all branches

       0.002179855 seconds time elapsed

       0.000000000 seconds user
       0.002198000 seconds sys
```

可以指定需要记录的`events` (`-e`参数)，以及repeat次数(`-r`参数)：

```bash
perf  stat -r 6 -e  cache-misses ls -lh ~/

 Performance counter stats for 'ls -lh /home/hxf0223' (6 runs):

            20,763      cache-misses                                                            ( +- 14.14% )

         0.0015583 +- 0.0000369 seconds time elapsed  ( +-  2.37% )
```

## 4. 记录性能数据到文件，以及分析：`perf record`, `perf report`, `perf annotate` ##

### 4.1 `perf record` 记录性能数据到文件 ###

使用 `perf record` 命令，运行被测试程序，并记录测量数据到`perf.data`数据文件。

```bash
$ perf record ./test_grain_size

./test_grain_size. Process ID: 6226
Duration: 232.74 seconds
Sum: 1.25e+07. loop num: 10000
[ perf record: Woken up 934 times to write data ]
[ perf record: Captured and wrote 283.898 MB perf.data (7441535 samples) ]

$ ls -lh perf.data
-rw------- 1 <groupname> <username> 284M Oct 31 21:25 perf.data
```

### 4.2 `perf report` 查看性能数据 ###

使用 `perf report` 命令，查看`perf.data`数据文件。使用如下命令，直接打开`perf.data`文件：

```bash
perf report
```

### 4.3 `perf annotate` 显示源码级别的性能数据 ###

```bash
perf annotate -i perf.data
```

如何编译使用`-ggdb`，则可以显示源码级别的性能数据。

## 参考资料 ##

* [PerfTool pdf](/assets/pdf/perf/perf_docs_20241030/PerfTool_01182021.pdf)
* [Blog of Aleksandar Milenkovic (PerfTool pdf作者)](https://alexmilenkovich.github.io/)
* [edu: The Laboratory for Advanced Computer Architectures and Systems](https://lacasa.uah.edu/index.php/tools-tutorials)


