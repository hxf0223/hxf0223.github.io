---
layout: post
title: "al-folio v1.x 博客迁移与深度定制实践总结"
date: 2026-08-30 10:30:00 +0800
description: "记录将个人学术博客升级迁移至最新版 al-folio v1.x 的完整过程，涵盖 Docker 本地环境、CI/CD 修复、栏目精简、动态标签、三级目录、图片灯箱增强、全站全文搜索与 Prettier 加速优化。"
tags: [jekyll, al-folio, frontend, blog]
categories: [tech, blog]
toc:
  sidebar: right
---

## 1. 概述与背景

本站基于流行的学术个人主页与技术博客模板 [al-folio](https://github.com/alshedivat/al-folio) 搭建。近期模板进行了 v1.x 大版本架构重构（核心组件与 SASS 抽离为 Ruby Gem `al_folio_core`，并引入 Tailwind CSS 预编译体系）。

为了在享受新版模板持续更新与现代技术栈优势的同时，完美保留 170+ 篇博文资产与个性化阅读体验，我们对新仓库进行了一系列系统性的迁移、问题修复与深度定制。

```
┌──────────────────────────────────────────────────────────┐
│                   al-folio v1.x 站点架构                  │
├─────────────────┬──────────────────────┬─────────────────┤
│  Ruby Gem 核心  │     本地覆盖层       │    客户端增强   │
│ (al_folio_core) │ (Shadowing Overrides)│ (Client Hooks)  │
├─────────────────┼──────────────────────┼─────────────────┤
│ • 基础 Layouts  │ • _layouts/          │ • Medium-Zoom   │
│ • 基础 SCSS 变量 │ • _sass/             │ • Tocbot 3-Level│
│ • 插件机制      │ • _includes/         │ • FullTextSearch│
│ • 构建工具链    │ • assets/js/         │ • Theme Toggle  │
└─────────────────┴──────────────────────┴─────────────────┘
```

---

## 2. 本地开发与 Docker 容器环境

### 2.1. 推荐本地运行工作流

在本地采用 Docker 容器化环境运行，无需在本机安装复杂的 Ruby/Bundler 依赖：

```bash
# 启动本地开发服务（后台/前台）
docker compose up

# 若修改了依赖或配置需重新构建
docker compose up --build

# 停止容器并释放端口
docker compose down
```

### 2.2. 本地环境常见问题与解决

1. **端口 8080 冲突**：
   - 本地已有其他开发服务占用了 `8080` 端口。
   - **解决**：在 `docker-compose.yml` 与 `docker-compose-slim.yml` 中将宿主机端口映射修改为 `8081:8080`，通过 `http://localhost:8081` 访问。
2. **构建时外部 RSS 源连接超时（medium.com）**：
   - 模板默认配置了外部 Medium 源抓取，国内本地网络环境下因超时导致构建中断。
   - **解决**：在 `_config.yml` 中注释掉 `external_sources` 相关配置。

---

## 3. CI/CD 与 GitHub Actions 部署修复

在将已有博文推送到 GitHub 进行 Pages 部署时，遇到了一系列自动化检查拦截，主要解决措施如下：

1. **Prettier 格式化检查失败**：
   - GitHub Actions 的 `prettier.yml` 强制执行 `npx prettier . --check`。
   - **解决**：本地统一执行 `npx prettier . --write` 完成全量格式化；并在 `.prettierignore` 中配置忽略规则。
2. **图片丢失导致 `broken-links-site.yml` 报错**：
   - 之前误删除了模板自带的部分示例图片资源（如 `assets/img/1.jpg`~`12.jpg`）。
   - **解决**：完整补齐项目示例图片资源，确保所有内置示例页面的外链与静态文件检查全绿通过。
3. **标签大小写冲突（Tag Case Collisions）**：
   - 原博文中存在大小写混用（如 `Ubuntu` 与 `ubuntu`），在 Linux/macOS 大小写不敏感文件系统交叉构建时会导致生成路径冲突。
   - **解决**：统一规范博文 Front Matter 中的标签为小写格式。

---

## 4. 栏目精简与个人信息定制

### 4.1. 导航栏结构重构

为使站点保持极简聚焦的技术博客风格，评估并保留了 3 个核心栏目，将其余学术专属页面（论文、授课等）在导航栏中隐藏：

| 栏目                                   | 状态 | 导航顺序 (`nav_order`) | 说明                       |
| :------------------------------------- | :--- | :--------------------: | :------------------------- |
| **About**                              | 开启 |           —            | 个人主页与简介             |
| **Blog**                               | 开启 |           1            | 技术博客主页               |
| **Projects**                           | 开启 |           2            | 个人项目与开源作品         |
| _CV / Publications / Repos / Teaching_ | 隐藏 |      `nav: false`      | 隐藏冗余页面，保留文件备用 |

### 4.2. About 页面与社交链接

- **个人信息**：在 `_pages/about.md` 中更新了个性化 Slogan、技术方向简介与个人头像（`starry-sky.jpg`），同时关闭了 `announcements`（新闻）与 `selected_papers`。
- **社交链接**：在 `_data/socials.yml` 中配置了 GitHub、博客园（cnblogs）、知乎、邮箱与 RSS 订阅源。

---

## 5. 动态标签（Tags）与分类（Categories）系统

### 5.1. 原生问题

al-folio 默认的 `_pages/blog.md` 中使用的是配置文件中预定义的静态标签数组（`site.display_tags` / `site.display_categories`），导致博文实际使用的标签无法自动出现在博客主页，且会展示很多空标签。

### 5.2. 改造方案

在 `_pages/blog.md` 中将静态循环替换为 Liquid 动态聚合语法：

```liquid
<!-- 动态聚合标签 -->
<div class="tag-category-list">
  <ul class="p-0 m-0">
    {% assign sorted_tags = site.tags | sort %}
    {% for tag in sorted_tags %}
      <li>
        <i class="fa-solid fa-hashtag fa-sm"></i>
        <a href="{{ site.baseurl }}/blog/tag/{{ tag[0] | slugify }}">{{ tag[0] }}</a>
        <span class="count">({{ tag[1].size }})</span>
      </li>
    {% endfor %}
  </ul>
</div>
```

**效果**：新增、修改博文标签时，博客首页标签栏实时同步更新，自动统计文章篇数，无任何空标签。

---

## 6. 博文排版布局与三级目录（TOC）深度扩展

### 6.1. 调整内容显示宽度与压缩留白

- **全局版心**：在 `_config.yml` 中将 `max_width` 从默认的 `930px` 调整为 **`1400px`**。
- **排版栅格**：在 `_layouts/default.liquid` 中采用稳定可靠的 `col-sm-9`（正文 75%，宽约 `1020px`）与 `col-sm-3`（目录 25%，宽约 `350px`）。
- **效果**：大幅减少了宽屏显示器下两侧过宽的无意义空白，正文阅读视野开阔。

### 6.2. 目录（TOC）列表框高度与平滑滚动

在 `_sass/_utilities.scss` 中优化 `#toc-sidebar` 样式：

- 设置 `max-height: calc(100vh - 6rem);` 充分利用整个屏幕高度；
- 开启 `overflow-y: auto;` 并配置轻量滚动条 `scrollbar-width: thin;`，长文章目录平滑滚动。

### 6.3. 支持三级及以上深度目录（H2 / H3 / H4）

1. **JS 标题扫描与 Tocbot 升级**（`assets/js/common.js`）：
   ```javascript
   window.tocbot.init({
     tocSelector: "#toc-sidebar",
     contentSelector: '[role="main"]',
     headingSelector: "h2, h3, h4", // 扩展解析 H2、H3、H4
     ignoreSelector: "[data-toc-skip]",
     hasInnerContainers: true,
     collapseDepth: resolveTocCollapseDepth(),
     orderedList: false,
     activeLinkClass: "is-active-link",
     scrollSmooth: true,
     scrollSmoothOffset: -80,
     headingsOffset: 80,
   });
   ```
2. **SCSS 层级缩进增强**（`_sass/_utilities.scss`）：
   为三级嵌套 `.toc-list .toc-list .toc-list` 添加了 `padding-left: 0.8rem;` 缩进，形成清晰的树状视觉层次。

---

## 7. 图片宽度自适应与 Medium-Zoom 灯箱增强

### 7.1. 大图宽度自适应（防截断）

在 `_sass/_typography.scss` 中为内容区所有图片添加响应式约束：

```scss
.post-content img,
#markdown-content img,
article.post-content img,
.post img {
  max-width: 100% !important;
  height: auto !important;
  display: block;
  margin: 0.75rem auto;
  cursor: zoom-in;
}
```

### 7.2. 点击弹出全屏大图（带白底衬托与单例防重）

1. **白底衬底（解决透明 SVG / 黑色文字看不清）**：
   在 `_sass/_utilities.scss` 中为 `.medium-zoom-image--opened` 赋予白底卡片衬底，使透明背景图与暗色蒙层形成高对比度：

   ```scss
   .medium-zoom-overlay {
     z-index: 1050;
     backdrop-filter: blur(3px);
   }

   .medium-zoom-image--opened {
     z-index: 1051;
     background-color: #ffffff !important; /* 保证透明图自带白色画布底 */
     border-radius: 6px;
     padding: 8px;
     box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6) !important;
   }
   ```

2. **单例模式绑定（解决重复弹窗与鬼影残留）**：
   在 `assets/js/common.js` 中使用全局单例 `window.__alFolioZoomInstance` 并配合 `dataset.zoomAttached` 标记，严格保证每张图片仅绑定一次实例。

---

## 8. 全站全文检索系统（Full-Text Search）

### 8.1. 方案选型与入口替换

模板自带的 `ninja-keys` 是轻量命令面板，仅索引标题，无法搜索正文。我们采用了**按需轻量索引 + 客户端全文检索**的架构替换原有入口：

- **顶部导航入口**：将顶部放大镜图标直接指向 `/search/` 独立全文搜索页；
- **全局快捷键**：在全站任意位置按下 **`Ctrl + K`** 或 **`Cmd + K`**，即可一键直达搜索页并自动聚焦输入框。

### 8.2. 构建期索引生成（`assets/js/data/search.json`）

通过 Liquid 模板在编译时输出全站 170+ 篇博文的轻量 JSON 索引（含标题、URL、分类、标签、日期及经过纯文本剥离的正文）：

```liquid
---
layout: none
permalink: /assets/js/data/search.json
---
[
{% for post in site.posts %}
  { "title": {{ post.title | jsonify }}, "url": {{ post.url | relative_url | jsonify }}, "categories": {{ post.categories | join: ', ' | jsonify }},
  "tags": {{ post.tags | join: ', ' | jsonify }}, "date": {{ post.date | date: '%Y-%m-%d' | jsonify }}, "content":
  {{ post.content | strip_html | strip_newlines | normalize_whitespace | jsonify }} }{% unless forloop.last %},{% endunless %}
{% endfor %}
]
```

### 8.3. 搜索页交互与动态反馈（`_pages/search.md`）

- **索引加载状态**：页面初始加载时显示 `⏳ 正在加载站内全文索引库...`，就绪后转为绿色提示 `✅ 索引库已加载（共 176 篇博文）`；
- **检索中反馈**：输入关键词时实时显示 `⏳ 正在检索 “xxx”...`；
- **多词与全文匹配**：支持中英文多词 AND 检索，结果卡片展示**正文上下文摘要片段（Snippet）**与**高亮关键词（`<mark>`）**；
- **一键清空**：输入框右侧提供 `✕` 快速清空按钮；
- **URL 查询联动**：支持 `/search/?q=关键词` 链接直达自动搜索。

---

## 9. Prettier 规则优化与 CI 构建提速

在全站博文与媒体文件较多时，Prettier 若遍历大量 PDF、图片和压缩包会导致本地检查与 GitHub Actions 构建变慢。

我们在 `.prettierignore` 中添加了针对性忽略规则：

```gitignore
# 二进制媒体文件
**/*.png
**/*.jpg
**/*.jpeg
**/*.gif
**/*.webp
**/*.svg
**/*.pdf
**/*.zip
**/*.rar
**/*.7z
**/*.doc
**/*.docx

# 编译缓存与带 Liquid 的 JSON
_site/**
.jekyll-cache/**
assets/js/data/**
```

**优化效果**：Prettier 检查从扫描全量二进制文件压缩至 **8 秒内极速完成**，CI/CD 流程大幅加速。

---

## 10. 核心改动文件索引

| 文件路径                     | 作用与定制内容                                                              |
| :--------------------------- | :-------------------------------------------------------------------------- |
| `_config.yml`                | 全局版心 `max_width: 1400px`、博客名称、禁用 external_sources、精简 plugins |
| `_layouts/default.liquid`    | 覆盖核心布局，稳定配置 `col-sm-9` 与 `col-sm-3` 栅格，挂载 TOC 侧边栏       |
| `_includes/header.liquid`    | 将顶部放大镜按钮改造为直达 `/search/` 的全文搜索入口                        |
| `_pages/about.md`            | 个人主页简介、头像与社交配置                                                |
| `_pages/blog.md`             | 改造为 Liquid 动态提取全站 Tags 与 Categories                               |
| `_pages/search.md`           | 独立全文检索主页，集成状态加载指示器与高亮摘要                              |
| `assets/js/data/search.json` | 全站博文全文检索轻量化 JSON 索引库                                          |
| `assets/js/common.js`        | Tocbot 扩展支持 H2/H3/H4、Medium-Zoom 单例管理、`Ctrl+K` 全局快捷键         |
| `_sass/_layout.scss`         | 容器尺寸约束                                                                |
| `_sass/_utilities.scss`      | TOC 容器高度扩展与滚动、图片弹窗白底卡片衬底与暗色遮罩                      |
| `_sass/_typography.scss`     | 正文图片 `max-width: 100%` 自适应约束与表格斑马纹边框优化                   |
| `.prettierignore`            | 过滤静态媒体与压缩包，提升代码检查与 Actions 部署速度                       |
| `docker-compose.yml`         | 本地容器端口调整为 `8081:8080`，避免本地端口冲突                            |
