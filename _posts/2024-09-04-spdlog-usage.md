---
title: spdlog 使用
date: 2024-09-04 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 使用时的编译选项 ##

```cmake
if(CMAKE_BUILD_TYPE STREQUAL "Release")
  add_compile_definitions(-DSPDLOG_ACTIVE_LEVEL=SPDLOG_LEVEL_WARN)
  add_compile_definitions(-DNDEBUG)
else()
  add_compile_definitions(-DSPDLOG_ACTIVE_LEVEL=SPDLOG_LEVEL_TRACE)
endif()
```

## 日志级别，日志格式 ##

```c++
#include <spdlog/spdlog.h>

#ifdef NDEBUG
  spdlog::set_level(spdlog::level::warn);  // disable spdlog for performance test
#else
  spdlog::set_level(spdlog::level::info);
  spdlog::set_pattern("%H:%M:%S.%e %t %s %! %v");
#endif

// back to default format
// spdlog::set_pattern("%+"); 

// alignment: 左对齐, 右对齐
spdlog::info("{:>8} aligned, {:<8} aligned", "right", "left");
```
