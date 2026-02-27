---
layout: post
title: VSCode 开发，PowerShell 高效操作设置
date: 2024-05-12 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [PowerShell]
tags: [PowerShell, VSCode]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. PowerShell 清屏快捷键设置

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

## 2. Poewrshell 安装 oh my posh

### 2.1. 安装插件

```powershell
# 0.允许使用脚本
Install-Module -Name PowerShellGet -Force

# 1. 安装 PSReadline 包，该插件可以让命令行很好用，类似 zsh
Install-Module -Name PSReadLine  -Scope CurrentUser

# 2. 安装 posh-git 包，让你的 git 更好用
PowerShellGet\Install-Module posh-git -Scope CurrentUser -Force

# 3. 安装 oh-my-posh 包，让你的命令行更酷炫、优雅
winget install JanDeDobbeleer.OhMyPosh -s winget

# 4. 安装 oh-my-posh 包，另一个主题包？
Install-Module oh-my-posh -Scope CurrentUser
```

### 2.2. 配置文件

```powershell
# 1. 打开配置文件
notepad $profile
```

编辑 `$PROFILE` 文件，注意检查`config`路径中用户名：

```powershell
# 好用的主题配置文件
#   hotstick.minimal.omp.json -- 单行，Prompt简短，没有用户名、机器名
#   agnoster.minimal.omp.json -- 经典，单行
oh-my-posh init pwsh --config 'C:\Users\Administrator\AppData\Local\Programs\oh-my-posh\themes\hotstick.minimal.omp.json.json' | Invoke-Expression
New-Alias -Name ifconfig -Value ipconfig
function sqlmap{
	python D:\tools\sqlmap\sqlmap.py @Args
}

# Import the Chocolatey Profile that contains the necessary code to enable
# tab-completions to function for `choco`.
# Be aware that if you are missing these lines from your profile, tab completion
# for `choco` will not function.
# See https://ch0.co/tab-completion for details.
$ChocolateyProfile = "$env:ChocolateyInstall\helpers\chocolateyProfile.psm1"
if (Test-Path($ChocolateyProfile)) {
  Import-Module "$ChocolateyProfile"
}

# 命令补全部分
# Shows navigable menu of all options when hitting Tab
Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete

#
# # Autocompletion for arrow keys
Set-PSReadlineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadlineKeyHandler -Key DownArrow -Function HistorySearchForward
Import-Module PSReadLine

#Install-Module -Name PSReadLine -AllowClobber -Force
Set-PSReadLineOption -PredictionSource History

# 添加以下内容
Import-Module posh-git
Import-Module oh-my-posh
# Set-PoshPrompt -Theme Paradox
```

### 2.3. 乱码处理

`PowerShell`终端会出现乱码，需要安装及使用`Fira Code`字体。

- [Fira Code 字体](https://github.com/tonsky/FiraCode)

安装字体之后，打开`PowerShell`终端，在`默认值->外观->字体`中选择`Fira Code`字体。

## 参考资料

- [oymyposh themes](https://ohmyposh.dev/docs/themes/)
- [powershell7升级笔记](https://www.cnblogs.com/DumpInfou/p/18204045)
- [终端高级功能](https://vscode.js.cn/docs/terminal/advanced)
- [Windows Terminal 更新后 oh-my-posh 报错的问题分析与解决](https://lzw.me/a/windows-terminal-update-oh-my-posh.html)
