---
title: VSCode 开发，shelll高效操作设置（PowerShell） 
date: 2024-05-12 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

# VSCode 开发，shelll高效操作设置（PowerShell） 

## PowerShell 清屏快捷键设置

由于 `VSCode` Windows 开发使用 `cls` 命令不能执行清屏操作（仅仅是滚动SCREEN缓冲区），所以使用快捷键代替清屏操作。
`VSCode` 中，`Ctrl + Shift + p` 打开设置，搜索 `Terminal: Clear`，找到 `Terminal: Clear`，将快捷键设置为 `Ctrl + l`。

## PowerShell alias 设置

前提：Windows 系统为了防止恶意脚本自动执行，故默认不允许自动运行脚本。需要以管理员身份，在 `PowerShell` 中执行：

```powershell
Set-ExecutionPolicy RemoteSigned
```

打开 `PowerShell` 终端，输入 `notepad $profile`，打开 `PowerShell` 启动配置文件。

在配置文件中添加以下内容：

```powershell
# git log 别名
function gl { git log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit }

# git status 别名
function g { git status -sb }

```