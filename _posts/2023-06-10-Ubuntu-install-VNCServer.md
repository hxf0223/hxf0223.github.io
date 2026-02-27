---
layout: post
title: Ubuntu 安装VNCServer及使用
date: 2023-06-05 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Linux]
tags: [Linux]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. 安装

```bash
sudo apt-get install gnome-panel
sudo apt-get install tightvncserver

# 创建端口
vncserver :1 -geometry 1920x1000 -depth 24

# 关闭端口
vncserver -kill :1

# 重新设置密码
vncpasswd

# 重启vncserver
vncserver :1

# 重启vncserver方式2
vncserver -geometry 1920x1080 :1

# 查看vncserver log
tail -f ~/.vnc/log_name.log
```

编辑配置文件 `.vnc/xstartup`

```bash
#!/bin/sh

unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
export XKL_XMODMAP_DISABLE=1
export XDG_CURRENT_DESKTOP="GNOME-Flashback:GNOME"
export XDG_MENU_PREFIX="gnome-flashback-"
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
xsetroot -solid grey
vncconfig -iconic &
#gnome-terminal &
#nautilus &
gnome-session --session=gnome-flashback-metacity --disable-acceleration-check &
```
