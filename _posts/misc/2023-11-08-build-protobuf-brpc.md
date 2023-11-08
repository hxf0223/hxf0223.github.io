---
title: Linux 系统下编译 protobuf 及 brpc
date: 2023-11-08 10:16:15 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [misc]
tags: [misc]     # TAG names should always be lowercase


<!-- author:  # 不写默认就是自己
  name: hxf0223
  link: https://hxf0223.github.io/ -->

# 以下默认false
math: true
mermaid: true
# pin: true
---

`bRPC`依赖于`protobuf`及`leveldb`。`leveldb`是一个`key-value`存储引擎，`protobuf`是`google`开源的`key-value`序列化协议。需要先编译`leveldb`及`protobuf`。

- [leveldb](https://github.com/google/leveldb.git)

## 1. 编译 protobuf

由于`protobuf 22`以后依赖于`google abseil`，`brpc`编译出现`abseil`相关错误。故选择`protobuf v3.21.9`版本进行编译。

```bash
git clone https://github.com/protocolbuffers/protobuf.git
git checkout -b v3.21.9 v3.21.9

# 编译及安装操作
```

## 2. 编译 brpc

```bash
git clone https://github.com/apache/brpc.git

# 编译及安装操作
```

## 3. 参考

- [Protocol Buffers](https://github.com/protocolbuffers/protobuf)
- [CMake编译brpc](https://github.com/apache/brpc/blob/master/docs/cn/getting_started.md#%E4%BD%BF%E7%94%A8cmake%E7%BC%96%E8%AF%91brpc)
- [brpc doc](https://brpc.apache.org/zh/docs/overview/)
- [protobuf v22和gRPC v1.55版本升级的依赖变化和upb适配](https://owent.net/2023/2306.html)
- [C++ Http Server 开源库（汇总级整理）](https://blog.csdn.net/Miracle_ps/article/details/128300035)
