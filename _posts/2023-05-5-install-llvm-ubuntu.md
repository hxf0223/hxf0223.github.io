---
title: Ubuntu 系统安装 LLVM 套件
date: 2023-05-5 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [llvm]
tags: [llvm, clang]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

```bash
wget https://apt.llvm.org/llvm.sh
chmod u+x llvm.sh
sudo ./llvm.sh 18 # install llvm, clang 18
```

* [How to install Clang 17 or 18 in Ubuntu 22.04 20.04](https://www.cnblogs.com/RioTian/p/17981544)