---
title: nginx 用户的权限配置
date: 2024-06-06 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [misc]
tags: [misc, nginx]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

```bash
# nginx 解决 403 错误问题 
sudo setenforce Permissive
sudo setsebool -P httpd_can_network_connect on
sudo chcon -Rt httpd_sys_content_t /usr/share/nginx/html/
```
