---
layout: post
title: nginx 用户的权限配置
date: 2024-06-06 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Nginx]
tags: [Nginx]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

```bash
# nginx 解决 403 错误问题
sudo setenforce Permissive
sudo setsebool -P httpd_can_network_connect on
sudo chcon -Rt httpd_sys_content_t /usr/share/nginx/html/
```

## nginx不能启动，提示端口不能绑定 8090 端口

查看服务状态信息，提示如下信息：

```bash
nginx: [emerg] bind() to 0.0.0.0:80 failed (13: permission denied)
```

```bash
# 查看是否在http_port_t类型下
sudo semanage port -l | grep http_port_t

# 如果不在，添加到http_port_t类型下
sudo semanage port -a -t http_port_t  -p tcp 8090
```

## 学习资料

- [nginx 安装配置及使用 启动权限拒绝问题](https://www.cnblogs.com/carl-/p/15599437.html)
