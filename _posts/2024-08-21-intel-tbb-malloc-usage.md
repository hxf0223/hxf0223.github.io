---
layout: post
title: Intel TBB malloc 使用 (windows)
date: 2024-08-13 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp, Performance]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## CMake 查找 Intel TBB

```cmake
find_package(
    TBB
    COMPONENTS tbb tbbmalloc tbbmalloc_proxy
    REQUIRED)

if(TBB_FOUND)
    message(STATUS "TBB version: ${TBB_VERSION}")
endif()
```

## 链接引入 TBB 库

```cmake
if (MSVC)
    target_link_libraries(${target_lib} PRIVATE TBB::tbb TBB::tbbmalloc
                                                TBB::tbbmalloc_proxy)
endif()
```

## cpp 代码中引入 TBB 符号，防止库链接被优化掉

```cpp
#if defined(WITH_TBB_MALLOC) && defined(_MSC_VER) //&& defined(NDEBUG)
#include "oneapi/tbb/scalable_allocator.h"
#include "oneapi/tbb/tbbmalloc_proxy.h"
#pragma comment(lib, "tbbmalloc_proxy.lib")
#pragma comment(linker, "/include:__TBB_malloc_proxy")
#endif
```

## 查看内存分配函数替换是否出错

```cpp
#if defined(WITH_TBB_MALLOC) && defined(_MSC_VER) //&& defined(NDEBUG)
  {
    // https://emfomenk.github.io/versions/latest/elements/oneTBB/source/memory_allocation/c_interface_to_scalable_allocator.html
    const auto mode_ret = scalable_allocation_mode(TBBMALLOC_USE_HUGE_PAGES, 1);
    if (mode_ret == TBBMALLOC_NO_EFFECT) {
      spdlog::warn("huge pages not supported by OS");
    }
    char** func_replacement_log;
    int func_replacement_status = TBB_malloc_replacement_log(&func_replacement_log);
    if (func_replacement_status != 0) {
      printf("tbbmalloc_proxy cannot replace memory allocation routines\n");
      for (char** log_string = func_replacement_log; *log_string != 0; log_string++) {
        spdlog::warn("{}", *log_string);
      }
    }
  }
#endif
```

## 资料

- [How to Use oneTBB for Efficient Memory Allocation in C++ Applications](https://www.intel.cn/content/www/cn/zh/developer/articles/technical/how-to-use-onetbb-for-memory-allocation-cpp.html)
