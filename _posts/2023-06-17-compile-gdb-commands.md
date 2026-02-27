---
layout: post
title: Linux 系统下编译 gcc 9.2
date: 2023-06-17 22:16:15 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [GCC]
tags: [GCC] # TAG names should always be lowercase

<!-- author: # 不写默认就是自己
  name: lhb
  link: https://github.com/lhbvvvvv -->

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 操作

下载 gcc源码包，解压生成`gcc-9.2.0`：

```txt
http://ftp.gnu.org/gnu/gcc/gcc-9.2.0/gcc-9.2.0.tar.gz
```

在四个依赖包在以下文件中有描述：

```bash
./contrib/download_prerequisites
```

- [gmp-6.1.0.tar.bz2](/assets/images/misc/gmp-6.1.0.tar.bz2)
- [mpfr-3.1.4.tar.bz2](/assets/images/misc/mpfr-3.1.4.tar.bz2)
- [mpc-1.0.3.tar.gz](/assets/images/misc/mpc-1.0.3.tar.gz)
- [isl-0.18.tar.bz2](/assets/images/misc/isl-0.18.tar.bz2)

下载下来之后，放到`gcc_9.2.0`目录下，并执行上面的这个`download_prerequisites`脚本。之后即可开始编译gcc9.2.0 。

## Build commands

```bash
CC="$CC"
CXX="$CXX"
CFLAGS="$OPT_FLAGS" CXXFLAGS="`echo " $OPT_FLAGS " | sed 's/ -Wall / /g'`"
../configure --prefix=/meda_home/ai0157/opt --enable-bootstrap --enable-shared --enable-threads=posix --enable-checking=release --with-system-zlib     --enable-__cxa_atexit --disable-libunwind-exceptions --enable-linker-build-id --enable-languages=c,c++,lto --disable-vtable-verify --with-default-libstdcxx-abi=new --enable-libstdcxx-debug --without-included-gettext --enable-plugin --disable-initfini-array --disable-libgcj --enable-plugin --disable-multilib --with-tune=generic --build=x86_64-unknown-linux-gnu --target=x86_64-unknown-linux-gnu --host=x86_64-unknown-linux-gnu
```

## References

- [build_gcc_9.sh](https://github.com/darrenjs/howto/blob/5b239a503a55e7641137762e55a7e78c109194bc/build_scripts/build_gcc_9.sh#L252)
- [linux gcc-9.2.0 源码编译](https://blog.csdn.net/whatday/article/details/122114434)
- [Ubuntu环境下LLVM 15.0 完全编译 附windows编译LLVM master](https://www.cnblogs.com/vaughnhuang/p/15817603.html)
