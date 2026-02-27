---
layout: post
title: 备份：Ubuntu Bash Alias, 以及 bash 显示 git status
date: 2024-08-21 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Bash]
tags: [Bash, Linux]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## bash alias ##

```bash
###################
# bash alias
alias g='git status -sb'

alias ll='ls -alF'
alias la='ls -A'
alias l='ls -ltrhA'
alias gl='ls|grep --color'
# alias .='cd ../'
# alias ..='cd ../..'
alias ..='cd ..'
alias ...='cd ..; cd ..'
alias ....='cd ..; cd ..; cd ..'

alias c='clear'
alias r='reset'
```

## bash 显示 git status ##

```bash
# Show git branch name
force_color_prompt=yes
color_prompt=yes
parse_git_branch() {
 git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}
if [ "$color_prompt" = yes ]; then
 PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[01;31m\]$(parse_git_branch)\[\033[00m\]\$ '
else
 PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w$(parse_git_branch)\$ '
fi
unset color_prompt force_color_prompt
```

参考：[How do I show the git branch with colours in Bash prompt?](https://askubuntu.com/questions/730754/how-do-i-show-the-git-branch-with-colours-in-bash-prompt)

## Bash增强：自动完成 ##

* [ble.sh](https://github.com/akinomyoga/ble.sh)
* [Setup ble.sh for PowerShell-like history completion in bash](https://gist.github.com/rkitover/970543715c23976ca86a6c3390f2cbf2)
