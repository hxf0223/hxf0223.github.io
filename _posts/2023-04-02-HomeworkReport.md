---
title: 个人博客搭建总结
date: 2023-04-02T00:55:42+08:00 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [工具, blog]
tags: [blog]     # TAG names should always be lowercase


<!-- author:  # 不写默认就是自己
  name: lhb
  link: https://github.com/lhbvvvvv -->

# # 以下默认false
math: true
mermaid: true
# pin: true
---

## 博客主题及其选取原因
对比一下hexo和jekyll的一些主题，最终选择了jekyll的主题Chripy。Chripy样式简约但是又完整地实现了我对于一个博客所期待的功能。

## 博客的页面布局及设计思路
Chripy博客把博客网站的所有功能链接放在了网页的左半区域，并且主页中显示了所有博客的简略内容，可以让读者很容易的知道网站的所有组成部分以及对所写博客进行快速的预览，整体布局清晰，阅读起来非常方便。

## 博客功能实现及其技术选择
jekyll-theme-chirpy是一个响应式的Jekyll主题，使用Ruby构建，适用于技术写作。它具有许多功能，例如：
* 代码高亮
* 数学公式
* 评论系统
* 搜索功能
* 多语言支持
* 等等

只需要在`_posts`文件夹下编写markdown文件，jekyll会自动将该文件转换为对应html语言展现在页面上。

## 博客制作过程中遇到的问题及其解决方法
在将github账号下的chirpy仓库clone回本地后进行更改，push回仓库后访问博客地址后返回
```
---
layout: home
# Index page
---
```
最后对于`_config.yml`文件进行了进一步的修改解决了此问题。
