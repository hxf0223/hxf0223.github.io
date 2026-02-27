---
layout: post
title: C++ 学习资源 及 代码片段积累
date: 2023-05-5 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. C++ 学习资源

- [Fluent C++](https://www.fluentcpp.com/)
- [Modern C++](https://www.modernescpp.com/)
- [foonathan::​blog()](https://www.foonathan.net/)
- [C++ Stories](https://www.cppstories.com/)
- [Sutter’s Mill](https://herbsutter.com/)
- [这些资源帮助你深入学习C++](https://lesleylai.info/zh/delve_into_cpp)

## 2. C++ 代码片段

### 2.1. 获取数组长度

```cpp
#include <type_traits>

struct StructDef {
  int32_t arr[32];
};

StructDef sd;
const size_t len = std::extent<decltype(sd.arr)>::value;
std::vector<int32_t> vec(sd.arr, sd.arr + len);
```

### 2.2. CHECK

```cpp
#include <iostream>
#include <cstdlib>

#if defined DEBUG || defined _DEBUG
#define CHECK2(condition, message)                                                                                                                   \
  (!(condition)) ? (std::cerr << "Assertion failed: (" << #condition << "), "                                                                        \
                              << "function " << __FUNCTION__ << ", file " << __FILE__ << ", line " << __LINE__ << "." << std::endl                   \
                              << message << std::endl,                                                                                               \
                    abort(), 0)                                                                                                                      \
                 : 1
#else
#define CHECK2(condition, message) (void)0
#endif
```

### 2.3. 获取线程 ID

通过 `pthread_self` 及 `std::this_thread::getid` 函数获取的线程 ID，跟使用 `top`, `htop` 命令呈现的线程 ID 不对应。
通过如下代码获取跟 `top`, `htop` 命令一致的 TID：

```cpp
#include <syscall.h>

pid_t gettid(void) {
    return (pid_t)syscall(SYS_gettid);
}

// 设置所在线程名称
const char* thd_name = "demo_thread";
prctl(PR_SET_NAME, reinterpret_cast<unsigned long>(thd_name ), 0, 0, 0);
```

### 2.4. 获取本地IP地址列表

```cpp
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netdb.h>
#include <ifaddrs.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <vector>
#include <string>

std::vector<std::string> get_local_ip_v2() {
  std::vector<std::string> addr_list;
  struct ifaddrs *ifaddr, *ifa;
  char host[NI_MAXHOST];

  if (getifaddrs(&ifaddr) == -1) {
    perror("getifaddrs");
    exit(EXIT_FAILURE);
  }

  for (ifa = ifaddr; ifa != nullptr; ifa = ifa->ifa_next) {
    if (ifa->ifa_addr == nullptr) {
      continue;
    }

    const auto s = getnameinfo(ifa->ifa_addr, sizeof(struct sockaddr_in), host,
                               NI_MAXHOST, nullptr, 0, NI_NUMERICHOST);
    if (ifa->ifa_addr->sa_family == AF_INET) {
      // strcmp(ifa->ifa_name,"wlan0") == 0
      if (s != 0) {
        printf("getnameinfo failed: %s\n", gai_strerror(s));
        break;
      }

      // printf("\tInterface : <%s>\n", ifa->ifa_name);
      // printf("\t  Address : <%s>\n", host);
      addr_list.push_back(host);
    }
  }

  freeifaddrs(ifaddr);
  return addr_list;
}
```

## 3. 其他

### 3.1 doxygen 注释

```text
// Doxygen documentation generator set
    "doxdocgen.c.triggerSequence": "/",   // 触发自动注释的生成
    "doxdocgen.c.commentPrefix": " * ",     // 注释行的前缀
    "doxdocgen.c.firstLine": "/**",         // 注释行的首行
    "doxdocgen.c.lastLine": "*/",          // 注释行的尾行

    // Smart text snippet for factory methods/functions.
    "doxdocgen.c.factoryMethodText": "Create a {name} object",
    // Smart text snippet for getters.
    "doxdocgen.c.getterText": "Get the {name} object",
    // Smart text snippet for setters.
    "doxdocgen.c.setterText": "Set the {name} object",
     // Smart text snippet for constructors.
     "doxdocgen.cpp.ctorText": "Construct a new {name} object",
      // Smart text snippet for destructors.
    "doxdocgen.cpp.dtorText": "Destroy the {name} object",
    // The template of the template parameter Doxygen line(s) that are generated. If empty it won't get generated at all.
    "doxdocgen.cpp.tparamTemplate": "@tparam {param} ",

    // 文件注释：版权信息模板
    "doxdocgen.file.copyrightTag": [
        "@copyright Copyright (c) {year}  深圳市奥瓦机器人有限公司"
    ],
    // 文件注释：自定义模块，这里我添加一个修改日志
    // "doxdocgen.file.customTag": [
    //     "@par 修改日志:",
    //     "<table>",
    //     "<tr><th>Date       <th>Version <th>Author  <th>Description",
    //     "<tr><td>{date} <td>1.0.1     <td>zhoulq     <td>内容",
    //     "</table>",
    // ],
    // 文件注释的组成及其排序
    "doxdocgen.file.fileOrder": [
        "file",     // @file
        "brief",    // @brief 简介
        "author",   // 作者
        "version",  // 版本
        "date",     // 日期
        "empty",    // 空行
        "copyright",// 版权
        "empty",
        "custom"    // 自定义
    ],
    // 下面时设置上面标签tag的具体信息
    "doxdocgen.file.fileTemplate": "@file {name}",
    "doxdocgen.file.versionTag": "@version 1.0.1",
    "doxdocgen.generic.authorEmail": "liqun_zhou91@163.com",
    "doxdocgen.generic.authorName": "zhoulq",
    "doxdocgen.generic.authorTag": "@author {author} ({email})",
    // 日期格式与模板
    "doxdocgen.generic.dateFormat": "YYYY-MM-DD",
    "doxdocgen.generic.dateTemplate": "@date {date}",

    // 根据自动生成的注释模板（目前主要体现在函数注释上）
    "doxdocgen.generic.order": [
        "brief",
        "tparam",
        "param",
        "return",
        "author",
        "date"
    ],
    "doxdocgen.generic.paramTemplate": "@param{indent:8}{param}{indent:8}",
    "doxdocgen.generic.returnTemplate": "@return {type} ",
    "doxdocgen.generic.splitCasingSmartText": true,

    "doxdocgen.generic.includeTypeAtReturn": true,      // return 中包含类型信息
    "doxdocgen.generic.boolReturnsTrueFalse": false,    // bool 返回值拆分成 true 和 false 两种情况
    "doxdocgen.generic.linesToGet": 20,                  // 回车后最多向下多少行去找函数声明
    "doxdocgen.generic.useGitUserName": false,          // {author} 是都根据 git config --get user.name 替换
    "doxdocgen.generic.useGitUserEmail": false,
    //declarations or definitions anymore.
```

- [VSCode用Doxygen自定义代码注释配置](https://timye-development.readthedocs.io/en/latest/VSCode/VSCode%E7%94%A8Doxygen%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BB%A3%E7%A0%81%E6%B3%A8%E9%87%8A%E9%85%8D%E7%BD%AE.html)
- [doxygen注释规范](https://shona3n.github.io/2022/tool/doxygen-comment/)
