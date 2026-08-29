---
layout: post
title: VSCode Remote SSH 免密登陆
date: 2024-06-06 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Bash]
tags: [Bash, VSCode]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

```bash
cat id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

service sshd restart
```
