---
layout: post
title: CMake 检查系统和编译器
date: 2024-08-22 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [CMake]
tags: [CMake]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 判断操作系统

```cmake
IF (CMAKE_SYSTEM_NAME MATCHES "Linux")

ELSEIF (CMAKE_SYSTEM_NAME MATCHES "Windows")

ELSEIF (CMAKE_SYSTEM_NAME MATCHES "FreeBSD")

ELSE ()
MESSAGE(STATUS "other platform: ${CMAKE_SYSTEM_NAME}")
ENDIF (CMAKE_SYSTEM_NAME MATCHES "Linux")
```

## 判断编译器

```cmake
if ("${CMAKE_CXX_COMPILER_ID}" STREQUAL "Clang")
# using Clang
elseif ("${CMAKE_CXX_COMPILER_ID}" STREQUAL "GNU")
# using GCC
elseif ("${CMAKE_CXX_COMPILER_ID}" STREQUAL "Intel")
# using Intel C++
elseif ("${CMAKE_CXX_COMPILER_ID}" STREQUAL "MSVC")
# using Visual Studio C++
endif()
```
