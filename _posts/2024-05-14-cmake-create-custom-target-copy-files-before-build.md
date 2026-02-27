---
layout: post
title: CMake 创建自定义目标：在构建前复制文件
date: 2024-05-14 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [CMake]
tags: [CMake]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 创建自定义目标

```cmake
add_custom_target(TargetCopy3rdPartyLibs ALL
    COMMAND ${CMAKE_COMMAND} -E make_directory "${CMAKE_RUNTIME_OUTPUT_DIRECTORY}"
    COMMAND cp_3rd_libs.bat "${PROJECT_SOURCE_DIR}/3rd_libs" "${CMAKE_RUNTIME_OUTPUT_DIRECTORY}"
    WORKING_DIRECTORY "${PROJECT_SOURCE_DIR}/src/cmake"
    COMMENT "Copying 3rd party libraries to bin directory"
)
```

## 引用自定义目标

在编译APP，LIB的CMakeLists.txt文件中，添加：

```cmake
set_target_properties(${target_app} PROPERTIES DEPENDS Copy3rdPartyLibs)
```


