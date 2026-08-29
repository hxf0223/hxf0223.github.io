---
layout: post
title: 改用zsh以及oh-my-zsh
date: 2023-05-24 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Shell]
tags: [Shell, zsh, oh-my-zsh]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

安装zsh以及oh-my-zsh：

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

安装autosuggestions插件（根据历史命令自动补全）：

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

在`.zshrc`中启用插件，plugins列表中，添加`zsh-autosuggestions`。例如：

```bash
plugins=(git zsh-autosuggestions)
```

添加alias：

```bash
# 实用别名
alias ls='ls --color=auto'
alias l='ls -lh'
alias ll='ls -lAh'
alias la='ls -A'
alias grep='grep --color=auto'

# Git 别名
alias g='git'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gs='git status'
alias gd='git diff'

# 目录导航别名
alias ..='cd ..'
alias ...='cd ../..'
alias c='clear'
alias h='history'
```

一些定制化的设置：

```bash
###########################
# helpers: add to PATH / LD_LIBRARY_PATH only once
_path_append()   { [[ ":$PATH:"            != *":$1:"* ]] && export PATH="$PATH:$1"; }
_ldpath_append() { [[ ":$LD_LIBRARY_PATH:" != *":$1:"* ]] && export LD_LIBRARY_PATH="${LD_LIBRARY_PATH}:$1"; }

###########################
# oneAPI
if [[ -z "$SETVARS_COMPLETED" ]]; then
	source /opt/intel/oneapi/setvars.sh
fi

###########################
# dotnet 6
_path_append "$HOME/dotnet6"
[[ -z "$DOTNET_ROOT" ]] && export DOTNET_ROOT=$HOME/dotnet6

###########################
# cargo
_path_append "$HOME/.cargo/bin"

###########################
# go
[[ -z "$GOPATH" ]]  && export GOPATH=$HOME/go
[[ -z "$GOPROXY" ]] && export GOPROXY=https://goproxy.cn
_path_append "$GOPATH/bin"

###########################
# fastdds
[[ -z "$FASTDDS_ROOT" ]] && export FASTDDS_ROOT=$HOME/dev
_path_append "$FASTDDS_ROOT/bin"
_ldpath_append "$FASTDDS_ROOT/lib"
```

## A. 资料

- [Oh My Zsh 官方网站](https://ohmyz.sh/)
- [Oh My Zsh GitHub 仓库](https://github.com/ohmyzsh/ohmyzsh)
- [Zsh插件加载性能优化](https://blog.hotdry.top/posts/2026/01/10/zsh-plugin-performance-optimization-lazy-loading-strategies/)：优化zsh脚本的启动及加载速度，2026年1月10日
- [用 Starship + 原生插件打造极速终端](https://github.com/luckyyyyy/Blog/issues/84)博客：使用 Starship 以及 oh-my-zsh 的原生插件打造极速终端
- [Fish Shell 官方网站](https://fishshell.com/)
