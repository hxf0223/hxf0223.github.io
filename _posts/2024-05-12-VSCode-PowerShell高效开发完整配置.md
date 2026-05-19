---
layout: post
title: VSCode 开发，PowerShell 高效开发完整配置
date: 2024-05-12 +0800
categories: [PowerShell]
tags: [PowerShell, VSCode, posh-git, oh-my-posh]

math: true
mermaid: true
toc:
  sidebar: right
---

## 1. 配置 VSCode 使用 PowerShell 7

`VSCode` 快捷键打开**用户配置文件 (Json)**：`Ctrl+Shift+P`，输入 `open user settings`，选择打开 `settings.json` 文件，添加以下内容：

```json
"terminal.integrated.profiles.windows": {
    "PowerShell7": {
        "path": "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
        "args": [],
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
    }
},
"terminal.integrated.defaultProfile.windows": "PowerShell7",
```

## 2. PowerShell 执行策略设置

Windows 默认不允许自动运行脚本，需要以管理员身份执行：

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Confirm
```

## 3. 安装 posh-git

[posh-git](https://github.com/dahlbyk/posh-git) 为 PowerShell 提供 Git 状态信息（branch、暂存区、工作区变更数量等），并支持 Git 命令 Tab 补全。

```powershell
# 更新 PowerShellGet（如有必要）
Install-Module PowerShellGet -Force

# 全新安装
PowerShellGet\Install-Module posh-git -Scope CurrentUser -Force

# 升级已有版本
PowerShellGet\Update-Module posh-git
```

### 3.1. posh-git 状态符号说明

Prompt 格式为 `[{branch} S +A ~B -C | +E ~F -G !H]`：

- `S`：与远端的同步状态（`≡` 同步、`↑n` 领先、`↓n` 落后、`×` 远端分支已删除）
- `|` 左侧：**暂存区（Index）**变更（`+` 新增、`~` 修改、`-` 删除、`!` 冲突）
- `|` 右侧：**工作区（Working Tree）**未暂存变更

### 3.2. 配置 posh-git 到 Profile

安装完成后，执行一次以下命令（**仅执行一次**，它会自动将 `Import-Module posh-git` 写入 profile 文件）：

```powershell
# 仅对当前 host（推荐）
Add-PoshGitToProfile

# 对所有 host（Console、ISE 等）
Add-PoshGitToProfile -AllHosts
```

## 4. 安装配置 oh-my-posh

oh-my-posh 提供更美观的 PowerShell Prompt 主题。

### 4.1. 安装

```powershell
# 安装 PSReadLine（命令行增强，支持历史预测等）
Install-Module -Name PSReadLine -Scope CurrentUser

# 安装 oh-my-posh
winget install JanDeDobbeleer.OhMyPosh -s winget
```

### 4.2. 配置 Profile

打开 profile 文件：

```powershell
notepad $PROFILE
```

添加以下内容（注意替换 `Administrator` 为你的用户名）：

```powershell
# oh-my-posh 主题（选择一个）
# hotstick.minimal.omp.json -- 单行，Prompt 简短
# agnoster.minimal.omp.json -- 经典单行风格
oh-my-posh init pwsh --config 'C:\Users\Administrator\AppData\Local\Programs\oh-my-posh\themes\hotstick.minimal.omp.json' | Invoke-Expression
```

可用主题参考：[ohmyposh.dev/docs/themes](https://ohmyposh.dev/docs/themes/)

### 4.3. 乱码处理（字体设置）

oh-my-posh Prompt 使用特殊符号，需安装支持 Box-drawing 的字体，推荐 [Fira Code](https://github.com/tonsky/FiraCode) 或 Cascadia Code。

安装字体后，在 Windows Terminal 的`默认值 → 外观 → 字体`中选择对应字体。

## 5. PSReadLine 高效命令行设置

以下配置让 PowerShell 命令历史记录更易用，加入 `$PROFILE` 文件中：

```powershell
# 设置预测文本来源为历史记录
Set-PSReadLineOption -PredictionSource History

# Tab 键显示可选菜单（类似 zsh）
Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete

# 上下方向键：按已输入前缀搜索历史记录，并将光标移到行尾
Set-PSReadLineKeyHandler -Key UpArrow -ScriptBlock {
    [Microsoft.PowerShell.PSConsoleReadLine]::HistorySearchBackward()
    [Microsoft.PowerShell.PSConsoleReadLine]::EndOfLine()
}
Set-PSReadLineKeyHandler -Key DownArrow -ScriptBlock {
    [Microsoft.PowerShell.PSConsoleReadLine]::HistorySearchForward()
    [Microsoft.PowerShell.PSConsoleReadLine]::EndOfLine()
}
```

> **说明**：使用 `ScriptBlock` 方式（而非直接 `-Function HistorySearchBackward`）的好处是：搜索后光标自动跳到行尾，直接可以继续补充参数。

## 6. Git 快捷命令设置

在 `$PROFILE` 中添加以下别名函数，**需放在 `Import-Module posh-git` 之前**（posh-git 会识别已定义的 git 别名用于 Tab 补全）：

```powershell
# 美化的 git log 图形视图
function gl {
    git log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
}

# 简洁 git status
function g { git status -sb }
```

## 7. 清屏快捷键（VSCode 终端）

VSCode 中 `cls` 命令仅滚动缓冲区，建议用快捷键清屏：

`Ctrl+Shift+P` → 搜索 `Terminal: Clear` → 绑定快捷键 `Ctrl+L`。

## 8. 设置终端编码为 UTF-8

```powershell
# 在 $PROFILE 中添加，防止中文乱码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
```

> 同时需要将终端字体改为支持 Box-drawing 的字体（如 Cascadia Code、Fira Code）。点阵字体（如新宋体）不支持。

## 附：完整 Profile 示例

```powershell
# git 别名函数（必须在 Import-Module posh-git 之前定义，以便 Tab 补全识别）
function gl {
    git log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
}
function g { git status -sb }

Import-Module posh-git

# oh-my-posh 主题
oh-my-posh init pwsh --config 'C:\Users\Administrator\AppData\Local\Programs\oh-my-posh\themes\hotstick.minimal.omp.json' | Invoke-Expression

# PSReadLine 历史记录与补全设置
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineKeyHandler -Key Tab -Function MenuComplete
Set-PSReadLineKeyHandler -Key UpArrow -ScriptBlock {
    [Microsoft.PowerShell.PSConsoleReadLine]::HistorySearchBackward()
    [Microsoft.PowerShell.PSConsoleReadLine]::EndOfLine()
}
Set-PSReadLineKeyHandler -Key DownArrow -ScriptBlock {
    [Microsoft.PowerShell.PSConsoleReadLine]::HistorySearchForward()
    [Microsoft.PowerShell.PSConsoleReadLine]::EndOfLine()
}

# UTF-8 编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
```

## 参考资料

- [posh-git GitHub](https://github.com/dahlbyk/posh-git)
- [oh-my-posh 主题列表](https://ohmyposh.dev/docs/themes/)
- [Fira Code 字体](https://github.com/tonsky/FiraCode)
- [VSCode 终端高级功能](https://vscode.js.cn/docs/terminal/advanced)
- [Windows 安装 posh-git](https://blog.csdn.net/cxs5534/article/details/129737617)
- [PowerShell 7 升级笔记](https://www.cnblogs.com/DumpInfou/p/18204045)
- [Windows Terminal 更新后 oh-my-posh 报错的问题分析与解决](https://lzw.me/a/windows-terminal-update-oh-my-posh.html)
