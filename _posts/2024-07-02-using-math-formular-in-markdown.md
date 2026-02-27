---
layout: post
title: 在 Markdown 中使用数学公式
date: 2024-07-02 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Markdown]
tags: [Markdown]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. 在字符中添加空格

有四种宽度的空格可以使用，如下表格：

| 语法   | 显示    |
| ------ | ------- |
| \,     | a b     |
| \;     | a  b    |
| \quad  | a   b   |
| \qquad | a     b |

一个示例如下：

$$
\begin{cases}
(H_{y1} < y_i < H_{y2}) \;and\; (H_{y1} < y_o < H_{y2}) \\
(50^\circ < |K_i| < 90^\circ) \;and\; (50^\circ < |K_o| < 90^\circ) \\
\sqrt{(x_i - x_o)^2 + (y_i - y_o)^2} \leq L_{smin} \\
k_i \times k_o > 0 \\
\Delta x > \Delta y \\
x_i > x_o & \text{后向探头数据} \\
x_i < x_o & \text{前向探头数据}
\end{cases}
$$

更多数学公式的使用：

- [如何优雅地在Markdown中输入数学公式](https://www.cnblogs.com/syqwq/p/15190115.html)
- [Markdown 数学公式指导手册](https://freeopen.github.io/mathjax/)