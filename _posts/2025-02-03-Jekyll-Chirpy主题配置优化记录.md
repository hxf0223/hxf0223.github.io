---
layout: post
title: Jekyll Chirpy 主题配置优化记录
date: 2025-02-03 20:30:00 +0800
categories: [计算机]
tags: [jekyll, 网站]
description: 记录 Jekyll Chirpy 主题从部署错误修复到功能优化的完整过程，包括 GitHub Actions 配置、数学公式渲染、目录展开等改进。
toc:
  sidebar: right
---

## 概述

本文记录了将 Jekyll 博客从 `chirpy-starter` 迁移到完整 `jekyll-theme-chirpy` 主题后遇到的问题及解决方案，以及后续的一系列优化改进。主要涵盖：

1. GitHub Pages 部署错误修复
2. 数学公式渲染引擎切换（MathJax → KaTeX）
3. 目录（TOC）展开配置优化

## 一、部署错误修复

### 问题背景

从 `chirpy-starter` 切换到 `jekyll-theme-chirpy` 完整主题后，GitHub Actions 部署失败，错误信息为：

```text
Error: Can't find stylesheet to import.
  ╷
3 │ @import 'colors/typography-light';
```

### 根本原因

`chirpy-starter` 使用预编译的静态资源，而 `jekyll-theme-chirpy` 完整主题需要在构建时编译 SCSS 和 JavaScript 文件。GitHub Actions 工作流缺少 Node.js 环境和前端资源构建步骤。

### 解决方案

#### 1. 添加 Node.js 环境和构建步骤

修改 `.github/workflows/pages-deploy.yml`，在 Jekyll 构建之前添加：

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20"

- name: Install dependencies
  run: npm install

- name: Build frontend assets
  run: npm run build
```

**提交记录**：`847b43c - fix: add Node.js build step for jekyll-theme-chirpy`

#### 2. 解决 package-lock.json 缺失问题

初次构建时遇到 `npm ci` 要求 `package-lock.json` 的错误。由于 `.gitignore` 忽略了该文件，改用 `npm install`：

```yaml
- name: Install dependencies
  run: npm install # 改为 npm install
```

**提交记录**：`251cdcb - fix: use npm install instead of npm ci`

#### 3. 解决配置文件冲突

`git pull --rebase` 时 `_config.yml` 发生合并冲突，保留用户自定义配置（如 avatar 路径），删除冲突标记。

**提交记录**：`c56b96e - fix: resolve _config.yml merge conflict`

## 二、数学公式渲染优化

### 从 MathJax 迁移到 KaTeX

#### 迁移动机

1. **性能提升**：KaTeX 渲染速度比 MathJax 快 5-10 倍
2. **一致性**：VS Code Markdown 预览使用 KaTeX，切换后本地预览与网站渲染一致
3. **转义字符处理**：KaTeX 对 `\text{row\_offset}` 等转义字符的处理更符合预期

#### 实施步骤

##### 1. 添加 KaTeX CDN 资源

修改 `_data/origin/basic.yml` 和 `_data/origin/cors.yml`：

```yaml
# basic.yml
katex:
  css: https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css
  js: https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js
  auto-render: https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js

# cors.yml
katex: https://cdn.jsdelivr.net
```

##### 2. 在页面头部加载 KaTeX CSS

修改 `_includes/head.html`，在 `</head>` 之前添加：

```html
{% raw %}{% if page.math %}
<link rel="stylesheet" href="{{ site.data.origin[origin].katex.css | relative_url }}" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous" />
{% endif %}{% endraw %}
```

##### 3. 在页面底部加载 KaTeX JavaScript

修改 `_includes/js-selector.html`，替换 MathJax 部分：

```html
{% raw %}{% if page.math %}
<!-- KaTeX -->
<script defer src="{{ site.data.origin[origin].katex.js | relative_url }}" integrity="sha384-VQ8d8WVFw0yHhCk5E8I86oOhv48xLpnDZx5T9GogA/Y84DcCKWXDmSDfn13bzFZY" crossorigin="anonymous"></script>
<script defer src="{{ site.data.origin[origin].katex['auto-render'] | relative_url }}" integrity="sha384-+XBljXPPiv+OzfbB3cVmLHf4hdUFHlWNZN5spNQ7rmHTXpd7WvJum6fIACpNNfIR" crossorigin="anonymous"></script>
<script defer src="{{ '/assets/js/data/katex.js' | relative_url }}"></script>
{% endif %}{% endraw %}
```

##### 4. 创建 KaTeX 配置文件

新建 `assets/js/data/katex.js` 处理 kramdown 生成的 MathJax 格式标签：

```javascript
document.addEventListener("DOMContentLoaded", function () {
  // Convert kramdown's MathJax format to KaTeX format
  document.querySelectorAll("script[type='math/tex']").forEach(function (el) {
    const texText = el.textContent;
    const span = document.createElement("span");
    katex.render(texText, span, {
      throwOnError: false,
      displayMode: false,
    });
    el.parentNode.replaceChild(span, el);
  });

  document.querySelectorAll("script[type='math/tex; mode=display']").forEach(function (el) {
    const texText = el.textContent;
    const div = document.createElement("div");
    katex.render(texText, div, {
      throwOnError: false,
      displayMode: true,
    });
    el.parentNode.replaceChild(div, el);
  });

  // Auto-render for regular KaTeX delimiters
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
  });
});
```

##### 5. 启用数学公式支持

修改 `_config.yml` 的 `defaults` 配置，为所有文章启用数学公式：

```yaml
defaults:
  - scope:
      path: ""
      type: posts
    values:
      math: true
```

**提交记录**：

- `90b1eb3 - render math formular using MathJax`
- `c69851b - update: add Katex and use Katex for math render`

## 三、目录（TOC）展开优化

### 问题描述

默认情况下，TOC（Table of Contents）只在滚动到某个二级标题时才展开其下的三级、四级标题，影响导航体验。

### 优化目标

让所有标题级别（h2、h3、h4）默认完全展开，方便用户快速定位内容。

### 实施方案

#### 1. 修改桌面端 TOC 配置

编辑 `_javascript/modules/components/toc/toc-desktop.js`：

```javascript
static options = {
  tocSelector: '#toc',
  contentSelector: '.content',
  ignoreSelector: '[data-toc-skip]',
  headingSelector: 'h2, h3, h4',
  orderedList: false,
  scrollSmooth: false,
  collapseDepth: 6, // 新增：展开所有标题级别
  headingsOffset: 32
};
```

#### 2. 更新编译后的 JavaScript

由于本地环境未安装 Node.js，直接修改编译后的文件 `assets/js/dist/post.min.js`：

```javascript
// 找到 tocbot 配置部分，添加 collapseDepth:6
P(Mn, "options", {
  tocSelector: "#toc",
  contentSelector: ".content",
  ignoreSelector: "[data-toc-skip]",
  headingSelector: "h2, h3, h4",
  orderedList: !1,
  scrollSmooth: !1,
  collapseDepth: 6, // 添加此行
  headingsOffset: 32,
});
```

**提交记录**：`812ebd7 - enable unroll all sub-directories in dir list`

### 配置说明

- `collapseDepth: 6`：展开前 6 级标题
- 由于博客使用 h2-h4（3 级标题），设置为 6 确保所有标题完全展开
- 用户刷新页面（Ctrl+F5）即可看到效果

## 四、经验总结

### 1. 主题选择建议

- **chirpy-starter**：适合快速搭建，使用预编译资源，无需本地构建
- **jekyll-theme-chirpy**：适合深度定制，需要配置 Node.js 构建环境

### 2. CI/CD 最佳实践

- 完整主题需在 GitHub Actions 中添加 Node.js 环境
- 优先使用 `npm install` 而非 `npm ci`（如果不追踪 package-lock.json）
- 构建顺序：Node.js 环境 → npm install → npm build → Jekyll build

### 3. 数学公式渲染选择

| 特性         | MathJax        | KaTeX          |
| ------------ | -------------- | -------------- |
| 渲染速度     | 较慢           | 快（5-10倍）   |
| 功能完整度   | 非常完整       | 覆盖常用功能   |
| 包大小       | 较大（~200KB） | 较小（~100KB） |
| VS Code 预览 | ✗              | ✓              |
| 转义字符处理 | 需额外配置     | 原生支持       |

**推荐**：对于技术博客，KaTeX 是更好的选择。

## 六、支持 KaTeX 服务器端渲染（PR #2603）

### 背景

参考上游仓库 PR [#2603](https://github.com/cotes2020/jekyll-theme-chirpy/pull/2603)，该 PR 添加了对 KaTeX 服务器端渲染的支持，通过 jektex 插件在构建时渲染数学公式，而不是在浏览器端通过 JavaScript 渲染。

### 实施方案

#### 1. 添加数学引擎配置

修改 `_config.yml`，添加数学引擎选择配置：

```yaml
# Math equation rendering engine.
math:
  # Choose engine for rendering math equations.
  # mathjax — client-side rendering (loads JavaScript library)
  # katex — server-side rendering via jektex plugin (faster, no JS required)
  engine: # [mathjax | katex]
```

#### 2. 添加 jektex 配置

在 `_config.yml` 的 kramdown 配置后添加 jektex 配置：

```yaml
# Jektex configuration for server-side KaTeX rendering
jektex:
  cache_dir: ".jektex-cache" # Cache directory for rendered equations
  ignore: ["**/*"] # Ignore all by default (enable when math.engine is katex)
  silent: false # Show rendering progress
  macros: [] # Global LaTeX macros (e.g., [["\\\\Q", "\\\\mathbb{Q}"]])
```

#### 3. 更新 .gitignore

添加 jektex 缓存目录到 `.gitignore`：

```text
# Misc
.jektex-cache
```

#### 4. 条件加载 CSS

修改 `_includes/head.html`，根据引擎类型加载 CSS：

```html
{% raw %}{% if page.math %} {% assign math_engine = site.math.engine | default: 'mathjax' %} {% if math_engine == 'katex' %}
<!-- KaTeX CSS for server-side rendering -->
<link rel="stylesheet" href="{{ site.data.origin[type].katex.css | relative_url }}" />
{% endif %} {% endif %}{% endraw %}
```

#### 5. 条件加载 JavaScript

修改 `_includes/js-selector.html`，只在使用 MathJax 时加载 JS：

```html
{% raw %}{% if page.math %} {% assign math_engine = site.math.engine | default: 'mathjax' %} {% if math_engine == 'mathjax' %}
<!-- MathJax -->
<script src="{{ '/assets/js/data/mathjax.js' | relative_url }}"></script>
<script async src="https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="{{ site.data.origin[type].mathjax.js | relative_url }}"></script>
{% endif %} {%- comment -%} KaTeX is rendered server-side via jektex plugin, only CSS needed {%- endcomment -%} {% endif %}{% endraw %}
```

#### 6. 添加 KaTeX 样式

修改 `_sass/base/_base.scss`，添加 KaTeX 溢出处理：

```scss
/* KaTeX */
.katex-display {
  overflow: auto hidden;
}
```

#### 7. 添加 jektex 依赖

修改 `jekyll-theme-chirpy.gemspec`，添加 jektex 依赖：

```ruby
spec.add_runtime_dependency "jektex", "~> 0.1.1"
```

### 使用方法

#### 选择 MathJax（默认）

不需要配置，或显式设置：

```yaml
math:
  engine: mathjax
```

#### 选择 KaTeX

在 `_config.yml` 中设置：

```yaml
math:
  engine: katex

jektex:
  ignore: ["*.xml"] # 处理 markdown 文件，忽略 feed.xml
```

然后运行：

```bash
bundle add jektex
bundle install
```

### 特性对比

| 特性                 | MathJax           | KaTeX (jektex) |
| -------------------- | ----------------- | -------------- |
| 渲染方式             | 客户端 JavaScript | 服务器端构建时 |
| 页面加载速度         | 较慢              | 快             |
| LaTeX 支持           | 更完整            | 常用功能完整   |
| `\label` 和 `\eqref` | ✓                 | ✗              |
| 需要 JavaScript      | ✓                 | ✗              |
| 缓存支持             | ✗                 | ✓              |

### 注意事项

1. **兼容性**：KaTeX 不支持某些 LaTeX 特性，如 `\label` 和 `\eqref`
2. **构建时间**：首次构建时，KaTeX 会渲染所有公式并缓存，后续构建会快很多
3. **默认行为**：如果不配置 `math.engine`，默认使用 MathJax（保持向后兼容）

**提交记录**：参考 PR [#2603](https://github.com/cotes2020/jekyll-theme-chirpy/pull/2603)

### 4. 配置文件管理

- 关键配置文件建议纳入版本控制
- 合并冲突时优先保留自定义配置
- 及时提交配置变更，便于回溯

## 五、参考资源

- [Jekyll Chirpy Theme](https://github.com/cotes2020/jekyll-theme-chirpy)
- [KaTeX Documentation](https://katex.org/)
- [tocbot Configuration](https://tscanlin.github.io/tocbot/)
- [GitHub Actions - setup-node](https://github.com/actions/setup-node)

## 附录：完整文件清单

本次优化涉及的主要文件：

```text
.github/workflows/pages-deploy.yml    # CI/CD 配置
_config.yml                           # Jekyll 全局配置
_data/origin/basic.yml                # CDN 资源配置
_data/origin/cors.yml                 # CORS 配置
_includes/head.html                   # 页面头部（KaTeX CSS）
_includes/js-selector.html            # 脚本加载器（KaTeX JS）
assets/js/data/katex.js              # KaTeX 配置脚本（新建）
_javascript/modules/components/toc/toc-desktop.js  # TOC 桌面端配置
assets/js/dist/post.min.js           # 编译后的 JS（TOC 配置）
```

---

通过这一系列优化，博客成功完成了主题迁移，并在性能和用户体验上都有明显提升。后续可以继续探索更多主题定制选项。

## 链接

- [Chirpy Jekyll Theme -- Tutorial](https://chirpy.cotes.page/posts/getting-started/)
- [Chirpy Jekyll Theme](https://github.com/cotes2020/jekyll-theme-chirpy)
- [Markdown 渲染器配置选项](https://jekylldo.cn/docs/configuration/markdown/)

## 其他主题

- [al-folio](https://github.com/alshedivat/al-folio)：另一个流行的 Jekyll 主题，适合学术博客，支持 LaTeX 数学公式和丰富的功能。
- [Academic Pages](https://github.com/academicpages/academicpages.github.io)：适合学术博客，支持 LaTeX 数学公式和丰富的功能。
