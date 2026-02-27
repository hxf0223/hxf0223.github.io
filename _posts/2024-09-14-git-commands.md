---
layout: post
title: 总结：git 不常用命令
date: 2024-09-14 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Git]
tags: [Git]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

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

## 删除git记录中的大文件及blob ##

```bash
# 执行命令之前，保证仓库没有待提交的更改

# 清理
git gc

# 根据文件名查找大文件的完整路径
git rev-list --objects --all | grep <filename>

# 使用完整大文件路径删除大文件
git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch <full_path_filename>' --prune-empty --tag-name-filter cat -- --all

# 列出前5个大文件
# git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -5 | awk '{print$1}')"

# 推送到远程仓库
git push origin --force --all

# 清除缓存
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now

# 查看当前Git对象统计信息
git count-objects -v
```

### gitlab无法强行推送问题解决 ###

需要`owner`设置如下：仓库的`Settings` -> `Repository` -> `Protected branches` 改成`unprotected`。


