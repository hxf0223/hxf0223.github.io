---
layout: post
title: VSCode Remote SSH 使用局域网代理
date: 2024-06-06 +0830 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Bash]
tags: [Bash, VSCode]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

![image-20240606102834609](/assets/images/vscode/20240606/vscode_remotessh_local_net_proxy.png)

配置路径：远程[SSH:xxxx] -> 应用程序 -> Proxy。填入代理地址以及端口。

另外，去掉`Proxy Strict SSL`复选框的选中，即将Copilot配置为忽略证书错误。
