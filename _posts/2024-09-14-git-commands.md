---
title: 总结：git 不常用命令
date: 2024-09-14 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [git]
tags: [git]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

```bash
# 远程分支与本地分支有不相关的提交，合并远程分支
git pull origin main --allow-unrelated-histories
```

```bash
# 删除远程分之
git push origin --delete <branch_name>
```
