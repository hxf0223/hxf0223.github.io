---
title: ubuntu免密登录
date: 2022-05-24 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [shell]
tags: [shell]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## vscode

1. 在windows端

```bash
# 生成私钥及公钥文件
ssh-keygen -t RSA -C "name@mail.com"
```

2. 在ubuntu端

拷贝`id_rsa.pub`文件到ubuntu系统上

```bash
cat id_rsa.pub >> ~/.ssh/authorized_keys
rm id_rsa.pub
```

3. vscode连接

安装上`vscode remote ssh`套件，左下角有连接图标，点击连接，初次梅有ssh_config文件会提示选择`ssh_config`文件路径，并填写`ssh_config`文件。

## mobarXterm

这步操作在windows上已生成私钥公钥，及ubuntu上生成`authorized_keys`文件之后。
在mobarXterm中新建连接到ubuntu的ssh session，并设置选项：Advanced SSH Settings -> Use private key，选择私钥文件即可。
