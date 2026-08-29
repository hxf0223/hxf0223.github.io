---
layout: post
title: Python与C++混合调试
date: 2023-05-5 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [GDB]
tags: [GDB]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

vscode启动python与C++混合调试时，gdb需要管理员权限。
[Remote attach using non-root account would fail directly](https://github.com/microsoft/vscode-remote-release/issues/2053)

## 1. 取消限制

```bash
sudo sysctl -w kernel.yama.ptrace_scope=0
```

## 2. 取消限制，永久有效

设置pkexec的权限。新建文件，并重启Ubuntu系统：

```bash
# /usr/share/polkit-1/actions/com.ubuntu.pkexec.gdb.policy
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE policyconfig PUBLIC
 "-//freedesktop//DTD PolicyKit Policy Configuration 1.0//EN"
 "http://www.freedesktop.org/standards/PolicyKit/1/policyconfig.dtd">
<policyconfig>

  <action id="com.ubuntu.pkexec.gdb-settings">
    <icon_name>gdb-settings</icon_name>
    <defaults>
      <allow_any>yes</allow_any>
      <allow_inactive>yes</allow_inactive>
      <allow_active>yes</allow_active>
    </defaults>
    <annotate key="org.freedesktop.policykit.exec.path">/usr/bin/gdb</annotate>
    <annotate key="org.freedesktop.policykit.exec.allow_gui">true</annotate>
  </action>

</policyconfig>
```

## 3. 如何启动调试

1. 按照 launch.json 中定义的两个启动配置，先启动 "Python: Current File"，并设置好断点，暂停执行。
2. 再启动 "GDB Attach proc 0"。在启动 attach gdb的过程中，需要在列出来的进程中手动选择刚才启动的python调试进程。
3. 使用vscode调试时，由于命令行较长，且子进程较多。此时如果需要找对应的两个进程ID，方法如下

```bash
# 搜索被调试的python文件
ps -ef | grep relay00_graph.py
```

显示结果如下：

```bash
hxf0223     3877    2970  0 19:13 pts/5    00:00:00 /home/hxf0223/anaconda3/bin/python /home/hxf0223/.vscode-server/extensions/ms-python.python-2022.18.2/pythonFiles/lib/python/debugpy/adapter/../../debugpy/launcher 40627 -- /home/hxf0223/work/tvm_study/python/relay00_graph.py

hxf0223     3882    3877  3 19:13 pts/5    00:00:03 /home/hxf0223/anaconda3/bin/python /home/hxf0223/.vscode-server/extensions/ms-python.python-2022.18.2/pythonFiles/lib/python/debugpy/adapter/../../debugpy/launcher/../../debugpy --connect 127.0.0.1:39707 --configure-qt none --adapter-access-token 138af13a7101628b9d16326d38bf3a390f664ea5d7afcdbebbbc4a67c10708ec /home/hxf0223/work/tvm_study/python/relay00_graph.py

hxf0223     3945    3486  0 19:15 pts/7    00:00:00 grep --color=auto relay00_graph.p
```

其中，带有 "--connect 127.0.0.1:39707"的进程即为gdb进程，即libtvm.so等在这个进程中加载。

## 参考

- [Debugging Mixed Python C++ code in Visual Studio Code](https://gist.github.com/asroy/ca018117e5dbbf53569b696a8c89204f#file-debugging-mixed-python-c-code-in-visual-studio-code)
- [gdb dashboard -- gdbinit](https://github.com/cyrus-and/gdb-dashboard)
