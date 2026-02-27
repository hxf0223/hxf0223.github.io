---
layout: post
title: Ubuntu 24.04 分区，以及更换 kernel 6.18
date: 2024-05-11 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Linux]
tags: [Linux]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## Ubuntu 24.04 分区建议 ##

![Ubuntu 24.04 分区建议](/assets/images/linux/20240511/ubuntu_partition.jpg)

## 更换 kernel 6.18 ##

```bash
# 查看已经有的 kernel 版本
# sudo apt-cache search linux-headers | grep 6.1

sudo add-apt-repository ppa:cappelikan/ppa -y
sudo apt update && sudo apt install mainline -y
```

安装新版的 kernel 6.18，执行命令后，工具会自动开始内核相关文件的下载：

```bash
sudo mainline install 6.18

# 安装完成后，重启系统
sudo reboot

# 重启后，查看当前内核版本
uname -r
```

实际上，所有可用的`kernel`版本都可以从`Ubuntu`官方仓库看到：[https://kernel.ubuntu.com/mainline/](https://kernel.ubuntu.com/mainline/)。

安装完成并重启之后，可以锁定当前版本：

```bash
sudo apt-mark hold  $(dpkg -l | grep -E "linux-(headers|image|unsigned|modules|modules-extra)" | grep 6.12.3 | awk '{print $2}')
```

删除旧版本 kernel（需要先锁定当前新版本，不然新版本也会删除）：

```bash
# 查看已经安装的 kernel 版本
dpkg -l | grep -E "linux-(headers|image|modules-extra)+" | grep -v 6.12.3 | awk '{print $2}'

# 删除旧版本 kernel
dpkg -l | grep -E "linux-(headers|image|modules-extra)+" | grep -v 6.12.3 | awk '{print $2}' | xargs -I {} sudo apt remove -y {}
```

参考链接：

* [Ubuntu Linux 内核版本升级指南：mainline](https://soulteary.com/2025/02/06/ubuntu-linux-kernel-upgrade-guide-with-mainline.html)
