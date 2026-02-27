---
layout: post
title: VSCode 开发，使能PowerShell Git自动完成
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

## 准备

### 配置 VSCode 使用 PowerShell7

`VSCode`快捷键打开**用户配置文件(Json)**：`ctrl+shift+p`，输入`open user settings`，选择打开`settings.json`文件。添加以下内容：

```json
"terminal.integrated.profiles.windows": {
    "PowerShell": {
        "source": "PowerShell7",
        "icon": "terminal-powershell"
    },
    "Command Prompt": {
        "path": [
            "${env:windir}\\Sysnative\\cmd.exe",
            "${env:windir}\\System32\\cmd.exe"
        ],
        "args": [],
        "icon": "terminal-cmd"
    },
    "Git Bash": {
        "source": "Git Bash"
    },
    "PowerShell7": {
        "path": "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
        "args": [],
        "icon": "terminal-powershell"
    }
},
"terminal.integrated.defaultProfile.windows": "PowerShell7",
```

### 下载 posh-git

需要使用 [posh-git](https://github.com/dahlbyk/posh-git)。
首先确定`PowerShell`版本（在安装`PowerShell 7`之后，vscode默认使用的是`PowerShell 7`）：

```powershell
$PSVersionTable.PSVersion
```

## 安装 posh-git

脚本执行策略必须设置为 RemoteSigned 或 Unlimited，需要以管理员身份在powershell中执行以下语句

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Confirm
```

然后安装`posh-git`模块：

```powershell
Install-Module PowershellGet -Force
# A completely new installation
PowerShellGet\Install-Module posh-git -Scope CurrentUser -Force

# Update posh-git
PowerShellGet\Update-Module posh-git
```

## 配置 posh-git

在`powershell`终端对`$PROFILE`文件进行编辑：

```powershell
notepad $PROFILE
```

在文件末尾添加以下内容：

```powershell
Import-Module posh-git

# 如下为可选项的配置
##To enable posh-git to be available in just the current host, execute:
Add-PoshGitToProfile

##To enable posh-git to be available in all your PowerShell hosts-console, ISE, etc, execute:
Add-PoshGitToProfile -AllHosts

# 如下 AllUsers 选项命令会出错，不使能了
##To enable posh-git to be available for all users on the system, execute:
# Add-PoshGitToProfile -AllUsers -AllHosts

##To enable posh-git to be available for all users but only for the current host
# Add-PoshGitToProfile -AllUsers
```

保存并关闭文件。

新开一个`PowerShell`，如果出现如下信息，说吗`posh-git`安装成功：

```powershell
WARNING: Skipping add of posh-git import to file 'C:\Users\DELL\Documents\PowerShell\Microsoft.PowerShell_profile.ps1'.
WARNING: posh-git appears to already be imported in one of your profile scripts.
WARNING: If you want to force the add, use the -Force parameter.
WARNING: Skipping add of posh-git import to file 'C:\Users\DELL\Documents\PowerShell\profile.ps1'.
WARNING: posh-git appears to already be imported in one of your profile scripts.
WARNING: If you want to force the add, use the -Force parameter.
```

## PowerShell 的一个小技巧

PowerShell按TAB键自动提示。
在powershell的$PROFILE文件中，追加以下内容：

```powershell
# Shows navigable menu of all options when hitting Tab
Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete
```

## 参考

- [posh-git](https://github.com/dahlbyk/posh-git)
- [Windows安装posh](https://blog.csdn.net/cxs5534/article/details/129737617)
