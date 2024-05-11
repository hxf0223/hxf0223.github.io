---
title: cpp code snippet
date: 2023-05-5 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. 获取数组长度

```cpp
#include <type_traits>

struct StructDef {
  int32_t arr[32];
};

StructDef sd;
const size_t len = std::extent<decltype(sd.arr)>::value;
std::vector<int32_t> vec(sd.arr, sd.arr + len);
```

## 2. CHECK

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

## 3. 获取线程 ID

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

## 4. 获取本地IP地址列表

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
