---
layout: post
title: 总结：使用 gperftools 进行性能分析
date: 2024-06-21 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp, Linux, Performance]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. 安装 gperftools

使用 [gperftools Release页面](https://github.com/gperftools/gperftools/releases/tag/gperftools-2.9.1) 下载（不要使用git clone，且不要使用cmake编译，编译不生成`pprof`工具），编译命令：

```bash
./configure
make && make install
```

安装`graphviz`：

```bash
sudo apt-get install graphviz
```

## 2. 将 gperftools 链接进待测试程序

如何在`CMake`中查找`gperftools`的路径，参考笔记 `CMake 编写FindPackage 模块`: `posts/2024-06-21-cmake-find_package.md`，添加自定义CMake Find Package模块，并在`CMakeLists.txt`中添加`find_package(gperftools)`，即可找到`gperftools`的路径。

编译脚本添加如下：

```cmake
option(ENABLE_PROFILER "Enable google perftools" ON)
message(STATUS "ENABLE_PROFILER: ${ENABLE_PROFILER}")
if(ENABLE_PROFILER)
  set(CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/cmake;${CMAKE_MODULE_PATH}")
  find_package(Gperftools REQUIRED)
  set(PROFILER_LIBS ${GPERFTOOLS_PROFILER_LIBRARY})
  message(STATUS "PROFILER_LIBS: ${PROFILER_LIBS}")
  add_definitions("-DHAVE_PROFILER")
else()
  set(PROFILER_LIBS "")
endif()
```

使能frame-pointer：

```cmake
if(ENABLE_PROFILER)
  message(STATUS "enable profiler")
  target_compile_options(${target_test} PRIVATE -fno-omit-frame-pointer)
  target_link_options(${target_test} PRIVATE -fno-omit-frame-pointer)
  # set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fno-omit-frame-pointer")
  # set(CMAKE_LINKER_FLAGS "${CMAKE_LINKER_FLAGS} -fno-omit-frame-pointer")
endif()
```

## 3. 使用 gperftools 分析程序性能

运行被测试程序：

```bash
CPUPROFILE=test_flow_benchmark.prof CPUPROFILE_FREQUENCY=500 ./test --gtest_filter=FlowBenchMarkTest10/FlowBenchMarkTest.*

# 生成pdf报告
pprof --pdf ./server server.prof > perf.pdf
```

## 4. 使用 GNU gprof 分析程序性能

```cmake
target_compile_options(${target_test} PRIVATE -pg -g)
  target_link_options(${target_test} PRIVATE -pg -g)
```

gprof 不支持多线程应用，多线程下只能采集主线程性能数据。多线程需要重写`pthread_create()`。参考：[Linux性能优化gprof使用](https://www.cnblogs.com/youxin/p/7988479.html) 。

## 参考

1. [gperftools](https://github.com/gperftools/gperftools)
2. [gperftools文档 --  CPU profiler](https://gperftools.github.io/gperftools/cpuprofile.html)
3. [使用 gperftools 分析程序性能](https://luyuhuang.tech/2022/04/10/gperftools.html)
4. [Profiler -- 链接选项](https://github.com/cat538/cat538.github.io/blob/6689abc6d7785a8be3d7a71a3cd76eea207e1d72/docs/cpp/profiler.md)
5. [Linux下使用gperftools](https://blog.wangluyuan.cc/2019/03/23/Linux%E4%B8%8B%E4%BD%BF%E7%94%A8gperftools/)
6. [gperftools 的安装与使用](https://xiang1120.github.io/2023/08/19/gperftools%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8/)

