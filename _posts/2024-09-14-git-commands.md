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

```bash
# 更新远程分支列表
git remote update origin --prune
```

```bash
# 删除submodule

# Remove the submodule entry from .git/config
git submodule deinit -f .\3rd\xz-v5.8.1\

# Remove the submodule directory from the superproject's .git/modules directory
rm -rf .git/modules/3rd/xz-v5.8.1

# Remove the entry in .gitmodules and remove the submodule directory located at path/to/submodule
git rm -f 3rd/xz-v5.8.1
```
