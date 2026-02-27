---
layout: post
title: 我的VSCode插件清单
date: 2024-05-12 +0900 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [VSCode]
tags: [VSCode, MathJax]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

首先安装`Markdown Preview Enhanced`插件，并做如下配置：

- Ctrl+Shift+P → Markdown Preview Enhanced: Open Config Script (Global)

将如下内容添加到配置文件`config.js`中：

```js
{
  "mathjaxConfig": {
    "tex": {
      "inlineMath": [["$", "$"], ["\\(", "\\)"]],
      "displayMath": [["$$", "$$"], ["\\[", "\\]"]],
      "tags": "ams"
    }
  }
}
```
