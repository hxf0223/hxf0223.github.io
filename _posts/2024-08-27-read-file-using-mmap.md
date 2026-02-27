---
layout: post
title: 使用 mmap 读取文件
date: 2024-08-27 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp, Performance]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

关于`mmap`介绍，见之前文章 `总结：内存访问优化`(2024-08-13)。

使用跨平台支持的三方库[github -- mio](https://github.com/vimpunk/mio)。

## 1. 使用 mio 映射内存读取文件

相关头文件：

```c++
#include <chrono>
#include <filesystem>
#include <fstream>
#include <string>

#include "3rd_utils.h"
#include "spdlog/spdlog.h"

#include "typedef.h"

#include <mio/mmap.hpp>
#include <system_error>  // for std::error_code
```

```c++
namespace {

sample_dataset_t loadDataXYFromFileMM(const std::string& filename) {
  constexpr size_t sample_size = sizeof(double) * 2 + sizeof(int32_t);
  sample_dataset_t ds;

  if (!std::filesystem::is_regular_file(filename)) {
    SPDLOG_ERROR("File not found: {}", filename);
    return ds;
  }

  std::error_code error;
  mio::mmap_source src_mmap = mio::make_mmap_source(filename, 0, mio::map_entire_file, error);
  if (error) {
    const auto& errmsg = error.message();
    SPDLOG_ERROR("Failed to mmap file: {} - {}", filename, errmsg);
    return ds;
  }

  int32_t sid{};  // sample id
  size_t offset{};
  const size_t num_samples = (src_mmap.size() / sample_size);
  ds.ds_.reserve(num_samples);

  for (size_t i = 0; i < num_samples; i++) {
    auto* ptr1 = reinterpret_cast<const double*>(src_mmap.data() + offset);
    const auto x = ptr1[0], y = ptr1[1];
    offset += sizeof(double) * 2;

    auto* ptr2 = reinterpret_cast<const int32_t*>(src_mmap.data() + offset);
    const auto ch_id = ptr2[0];
    offset += sizeof(int32_t);

    sample_data_t sample{};
    sample.cid_ = ch_id - 1, sample.sid_ = sid++;
    sample.sample_data_ = {x, y};
    ds.ds_.emplace_back(std::move(sample));
  }

  return ds;
}

}  // namespace
```

## 2. 使用 fstream 读取文件

```c++
namespace {

sample_dataset_t loadDataXYFromFileFS(const std::string& filename) {
  sample_dataset_t ds;
  std::ifstream ifs(filename, std::ios::in | std::ios::binary);
  const auto sample_size = sizeof(double) * 2 + sizeof(int32_t);
  int32_t sid{};

  if (!ifs.is_open()) {
    SPDLOG_WARN("Failed to open file: {}", filename);
    return ds;
  }

  ifs.seekg(0, std::ios::end);
  const auto file_size = ifs.tellg();
  const auto num_samples = file_size / sample_size;
  ifs.seekg(0, std::ios::beg);

  ds.ds_.reserve(num_samples);
  SPDLOG_INFO("Predicate loading {} samples from file: {}", num_samples, filename);

  while (ifs.good()) {
    double x, y;
    int32_t ch{};
    ifs.read((char*)(&x), sizeof(double));
    ifs.read((char*)(&y), sizeof(double));
    ifs.read((char*)(&ch), sizeof(int32_t));
    if (ifs.good()) {
      sample_data_t sample_data{};
      sample_data.sample_data_ = {x, y};
      sample_data.cid_ = ch - 1;
      sample_data.sid_ = sid++;
      ds.ds_.emplace_back(std::move(sample_data));
    }
  }
  ifs.close();

  return ds;
}
}  // namespace
```

## 3. 性能对比

读取及解析文件耗时对比(10次)，使用`mmap`时间约为`fstream`的`1/4`。

```bash
[2024-08-27 23:57:14.722] [info] 1. Loaded 1503894 samples in 45.58 ms
[2024-08-27 23:57:14.784] [info] 1. Loaded 1503894 samples in 49.41 ms
[2024-08-27 23:57:14.842] [info] 1. Loaded 1503894 samples in 46.25 ms
[2024-08-27 23:57:14.898] [info] 1. Loaded 1503894 samples in 46.14 ms
[2024-08-27 23:57:14.955] [info] 1. Loaded 1503894 samples in 45.98 ms
[2024-08-27 23:57:15.007] [info] 1. Loaded 1503894 samples in 42.34 ms
[2024-08-27 23:57:15.063] [info] 1. Loaded 1503894 samples in 45.53 ms
[2024-08-27 23:57:15.121] [info] 1. Loaded 1503894 samples in 48.29 ms
[2024-08-27 23:57:15.178] [info] 1. Loaded 1503894 samples in 45.35 ms
[2024-08-27 23:57:15.233] [info] 1. Loaded 1503894 samples in 44.41 ms
[2024-08-27 23:57:15.483] [info] 2. Loaded 1503894 samples in 238.79 ms
[2024-08-27 23:57:15.743] [info] 2. Loaded 1503894 samples in 250.12 ms
[2024-08-27 23:57:16.011] [info] 2. Loaded 1503894 samples in 255.81 ms
[2024-08-27 23:57:16.261] [info] 2. Loaded 1503894 samples in 238.10 ms
[2024-08-27 23:57:16.502] [info] 2. Loaded 1503894 samples in 230.86 ms
[2024-08-27 23:57:16.749] [info] 2. Loaded 1503894 samples in 235.96 ms
[2024-08-27 23:57:17.007] [info] 2. Loaded 1503894 samples in 246.65 ms
[2024-08-27 23:57:17.251] [info] 2. Loaded 1503894 samples in 231.93 ms
[2024-08-27 23:57:17.499] [info] 2. Loaded 1503894 samples in 237.23 ms
[2024-08-27 23:57:17.751] [info] 2. Loaded 1503894 samples in 240.08 ms
```

## 4. 资料

- [github -- mio](https://github.com/vimpunk/mio)
