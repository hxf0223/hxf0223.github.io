---
title: Intel TBB 并行计算
date: 2024-08-28 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp, perf]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 0. TBB简介

Intel TBB 主要功能模块：

* 并行算法
* 任务调度
* 并行容器
* 同步原语
* 内存分配器

![TBB模块](/assets/images/intel_tbb/20240823/20150327164225068.png)

## 1. 编译及链接

参考之前文档`Intel TBB malloc 使用 (windows)`(2024-08-13)。

## 2. 并行计算

头文件包含：

```c++
#include <oneapi/tbb/parallel_sort.h>
#include <tbb/parallel_for.h>
#include <tbb/tbb.h>
```

### 2.1 sort

```c++
std::vector<dataxy_info_t> data_xy_info;
//...

tbb::parallel_sort(data_xy_info.begin(), data_xy_info.end(),
                     [](const dataxy_info_t& a, const dataxy_info_t& b) { return (a.x_ < b.x_); });
```

对150万数据排序，时间对比：

```bash
[2024-08-28 12:44:37.924] [info] 02. Sorted 1503894 samples in 80.45 ms (TBB sort)
[2024-08-28 12:44:42.610] [info] 11. Sorted 1503894 samples in 206.20 ms (std sort)
```

### 2.2 parallel_for_each

```c++
// void parse_dataxy_info(dataxy_info_t& info);
tbb::parallel_for_each(data_xy_info.begin(), data_xy_info.end(), parse_dataxy_info);
```

### 2.3 基于分块的 parallel_for

NOTE: 如果需要使用到任务共享写变量，需要添加锁，或者使用原子变量。`TBB`不保证线程安全。

```c++
{
    std::atomic_int overflow_acc{}, underflow_acc{};
    auto statistic_abnormal_func = [&](const sample_data_t& sample) {
      if (sample.mapped_pos_.y_ < 0) {
        underflow_acc++;
      } else if (sample.mapped_pos_.y_ > 255) {
        overflow_acc++;
      }
    };

    tbb::parallel_for(
      tbb::blocked_range<size_t>(0, ds.ds_.size()),
      [&](const tbb::blocked_range<size_t>& r) {
        for (size_t i = r.begin(); i != r.end(); i++) {
          statistic_abnormal_func(ds.ds_[i]);
        }
      },
      tbb::auto_partitioner());

    if (overflow_acc > 0 || underflow_acc > 0) {
      //SPDLOG_WARN("samples overflow {}. underflow {} in dataset", overflow_acc.load(), underflow_acc.load());
      samples_overflow_acc2 += overflow_acc.load();
      samples_underflow_acc2 += underflow_acc.load();
    }
  }
```

## 3. 任务调度及线程池

TODO

## 4. 并行容器

`concurrent_vector`等。

TODO

## 5. 资料

* [c++并行计算库TBB和PPL的基本用法](https://www.cnblogs.com/qicosmos/p/3517166.html)
* [并行计算】tbb::parallel c++并行计算的用法总结](https://blog.csdn.net/qq_40145095/article/details/131783443)
* [intel-TBB使用笔记](https://chuckiewill.github.io/2022/01/26/C++/IntelTBB/)
* [Intel Thread Building Blocks (TBB) 入门篇](https://www.cnblogs.com/ybqjymy/p/13679446.html)
* [Migrating from tbb::task_scheduler_init](https://oneapi-src.github.io/oneTBB/main/tbb_userguide/Migration_Guide/Task_Scheduler_Init.html)
* [ntel Community](https://community.intel.com/)
