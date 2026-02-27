---
layout: post
title: Windows下安装 MSMPI
date: 2024-05-21 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [MPI]
tags: [MPI]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 下载安装包及环境变量设置

下载安装`msmpi`以及`msmpisdk`：[MSMPI github releases](https://github.com/microsoft/Microsoft-MPI/releases)。注意安装路径不要有空格及中文。

命令行设置：

```bash
set MSMPI
```

输出信息如下图所示：

![MSMPI环境变量设置](/assets/images/mpi/msmpi_env_set_mpi.png)

## 建立第一个测试程序

[hello_mpi](https://gitee.com/mpi_1/hello_mpi)

```cmake
find_package(MPI REQUIRED)

# list(APPEND myMPI_INC_DIR $ENV{MSMPI_INC})
# list(APPEND myMPI_LIBS $ENV{MSMPI_LIB64})
message(STATUS "MPI_FOUND=${MPI_FOUND}")
message(STATUS "MPI_CXX_INCLUDE_DIRS=${MPI_CXX_INCLUDE_DIRS}")
message(STATUS "MPI_LIBRARIES=${MPI_LIBRARIES}")
```

```cpp
#include <mpi.h>
#include <stdio.h>

int main(int argc, char** argv) {
  // Initialize the MPI environment
  MPI_Init(&argc, &argv);

  // Get the number of processes ssociated with the communicator
  int world_size{};
  MPI_Comm_size(MPI_COMM_WORLD, &world_size);

  // Get the rank of the calling process
  int world_rank{};
  MPI_Comm_rank(MPI_COMM_WORLD, &world_rank);

  // Get the name of the processor
  char processor_name[MPI_MAX_PROCESSOR_NAME]{};
  int name_len;
  MPI_Get_processor_name(processor_name, &name_len);

  printf("Hello world from process %s with rank %d out of %d processors\n", processor_name, world_rank, world_size);

  // Finalize: Any resources allocated for MPI can be freed
  MPI_Finalize();
}
```

## 教程参考

- [MPI Tutorial](https://mpitutorial.com/tutorials/mpi-introduction/zh_cn/)
- [Open MPI 入门笔记](https://jinbridger.github.io/docs/hpc/openmpi-programming-101/)
