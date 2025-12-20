---
title: Ubuntu 系统安装 LLVM 套件 （可选择版本）
date: 2023-05-5 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [LLVM]
tags: [LLVM, Clang]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

```bash
wget https://mirrors.tuna.tsinghua.edu.cn/llvm-apt/llvm.sh
chmod u+x llvm.sh
sudo ./llvm.sh 18 -m https://mirrors.tuna.tsinghua.edu.cn/llvm-apt # install llvm, clang 18
# sudo ./llvm.sh 18 all -m https://mirrors.tuna.tsinghua.edu.cn/llvm-apt
```

也可以使用`apt`命令安装：

```bash
sudo apt install clangd-21 clang-format-21 clang-21
```

设置默认版本：

```bash
sudo update-alternatives --install /usr/bin/clang clang /usr/bin/clang-21 210
sudo update-alternatives --install /usr/bin/clang++ clang++ /usr/bin/clang++-21 210
sudo update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-21 210
sudo update-alternatives --install /usr/bin/clang-format clang-format /usr/bin/clang-format-21 210
```

* [How to install Clang 17 or 18 in Ubuntu 22.04 20.04](https://www.cnblogs.com/RioTian/p/17981544)