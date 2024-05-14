---
title: good cpp repo on github
date: 2023-05-5 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. oneTBB

Intel并行库 [oneTBB](https://github.com/oneapi-src/oneTBB).
包含[tbb malloc](https://github.com/oneapi-src/oneTBB/tree/master/src/tbbmalloc).

## 2. 高性能 json 库

[glaze](https://github.com/stephenberry/glaze)

使用例子：

```cpp
struct my_struct
{
  int i = 287;
  double d = 3.14;
  std::string hello = "Hello World";
  std::array<uint64_t, 3> arr = { 1, 2, 3 };
  std::map<std::string, int> map{{"one", 1}, {"two", 2}};
};

my_struct s{};
std::string buffer = glz::write_json(s);
```
