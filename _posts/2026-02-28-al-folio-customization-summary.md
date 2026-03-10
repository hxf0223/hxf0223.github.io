---
layout: post
title: al-folio 模板定制修改总结
date: 2026-02-28 10:00:00 +0800
categories: [工具, 博客]
tags: [jekyll, al-folio, ubuntu]
toc:
  sidebar: right
---

本文总结将 [al-folio](https://github.com/alshedivat/al-folio) 模板 fork 到个人仓库后所做的全部定制修改，供后续维护参考。

---

## 1. 站点基本信息配置（\_config.yml）

在 `_config.yml` 中修改了以下关键配置项：

```yaml
# 个人信息
first_name: Roderick
middle_name:
last_name: Huang
lang: zh-CN
contact_note: >
  欢迎通过 GitHub 或邮件与我联系。
description: >
  Roderick Huang 的个人博客，记录工作与技术。

# 站点 URL
url: https://hxf0223.github.io
baseurl: # 个人站点留空

# 博客设置
blog_name: WorkLog

# 页面宽度
max_width: 1400px

# Giscus 评论系统
giscus:
  repo: hxf0223/hxf0223.github.io
  repo_id: R_kgDOL6EGLA
  category: General
  category_id: DIC_kwDOL6EGLM4Czxtq
  mapping: pathname
  strict: 0
  lang: zh-CN

# Scholar
scholar:
  last_name: [Huang]
  first_name: [Roderick, R.]

# 注释掉外部文章源
# external_sources: ...
```

另外在 `defaults` 中为所有文章默认启用右侧目录：

```yaml
defaults:
  - scope:
      path: ""
      type: posts
    values:
      toc:
        sidebar: right
```

---

## 2. 博客文章批量迁移

将旧博客的 155 篇 Markdown 文章迁移到 `_posts/` 目录，使用 Python 脚本批量更新 frontmatter，确保格式符合 al-folio 要求：

- 添加 `layout: post`
- 添加 `toc: sidebar: right`
- 保留原始 `title`、`date`、`categories`、`tags` 字段

分两轮处理：

1. 第一轮处理 112 个非中文文件名的文件
2. 第二轮使用 `git -c core.quotepath=false` 处理 43 个中文文件名的文件

---

## 3. Tags/Categories 自动显示（\_pages/blog.md）

### 问题

al-folio 默认使用 `_config.yml` 中的 `display_tags` 和 `display_categories` 手动列表控制博客页面的标签过滤栏。新添加文章的 tags 不会自动出现。

### 解决方案

修改 `_pages/blog.md`，将手动列表替换为 Jekyll 自动收集的 `site.tags` 和 `site.categories`：

```liquid
{% raw %}
{% assign all_tags = site.tags | sort %}
{% assign all_categories = site.categories | sort %}
{% if all_tags.size > 0 or all_categories.size > 0 %}
  <div class="tag-category-list">
    <ul class="p-0 m-0">
      {% for tag in all_tags %}
        <li>
          <i class="fa-solid fa-hashtag fa-sm"></i>
          <a href="{{ tag[0] | slugify | prepend: '/blog/tag/' | relative_url }}">{{ tag[0] }}</a>
        </li>
        {% unless forloop.last %}<p>&bull;</p>{% endunless %}
      {% endfor %}
      ...
    </ul>
  </div>
{% endif %}
{% endraw %}
```

> **注意：** `site.tags` 是一个 hash（`[name, posts_array]`），取标签名需使用 `tag[0]`，而 `site.display_tags` 是一个字符串数组。

---

## 4. PWA 支持（可安装为桌面应用）

### 4.1 新增 manifest.json

创建 `manifest.json`（使用 Liquid front matter 动态填充站点信息）：

```json
{
  "name": "Roderick Huang",
  "short_name": "Huang",
  "id": "/",
  "scope": "/",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1a1a2e",
  "icons": [
    { "src": "/assets/img/pwa-icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/img/pwa-icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/assets/img/pwa-icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

- `id` 和 `scope` 是新版 Chrome/Edge 用于标识 PWA 身份和作用域的关键字段
- 需要在 `assets/img/` 下提供 192x192 和 512x512 的 PNG 图标

### 4.2 新增 sw.js（Service Worker）

创建 `sw.js` 实现离线缓存。关键注意点：

```javascript
// install 事件：预缓存关键资源，添加容错处理
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn("Precache failed (non-fatal):", err);
        })
      )
      .then(() => self.skipWaiting())
  );
});

// fetch 事件：Stale-While-Revalidate 策略
// 先返回缓存（保证加载速度），同时后台更新缓存，下次访问即为最新内容
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || !url.protocol.startsWith("http")) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          if (response && response.status === 200 && response.type !== "opaque") {
            cache.put(event.request, response.clone()).catch(() => {});
          }
          return response;
        });
        return cached || fetchPromise; // 有缓存则立即返回，同时后台更新
      });
    })
  );
});
```

**踩坑记录：**

1. `cache.addAll()` 如果任何一个 URL 失败，整个 Promise 会 reject，导致 SW 安装失败 → 浏览器不显示安装按钮。必须添加 `.catch()` 容错
2. Edge/Chrome 浏览器扩展的请求（`chrome-extension://`）也会被 SW 的 fetch 事件拦截，`cache.put()` 不支持非 HTTP scheme，导致 `Uncaught TypeError`。必须用 `url.protocol.startsWith('http')` 过滤
3. `cache.put()` 也需要 `.catch(() => {})` 兜底，防止其他异常场景
4. 初版使用 **Cache First** 策略（命中缓存直接返回），导致部署新版本后用户打开页面仍看到旧内容，必须手动刷新才能更新。改为 **Stale-While-Revalidate** 策略后，首次打开走缓存保证速度，同时后台拉取最新内容更新缓存，下次访问即可看到新版本

### 4.3 修改 \_includes/head.liquid

在 `<head>` 中添加 manifest 引用、theme-color、SW 注册脚本和 CSP：

```html
<!-- PWA manifest & theme color -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1a1a2e" />

<!-- PWA Service Worker registration -->
<script>
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js");
    });
  }
</script>

<!-- CSP: 需要包含 worker-src 'self' -->
<meta http-equiv="Content-Security-Policy" content="... worker-src 'self';" />
```

> **注意：** CSP 必须包含 `worker-src 'self'`，否则某些浏览器版本会阻止 Service Worker 注册。

---

## 5. Prettier 配置

### .prettierrc

```yaml
plugins: ["@shopify/prettier-plugin-liquid"]
printWidth: 150
trailingComma: "es5"
overrides:
  - files: "**/*.md"
    options:
      proseWrap: "preserve"
      printWidth: 10000
```

- `proseWrap: "preserve"` 防止 prettier 重排 Markdown 段落中的换行和空行
- `printWidth: 10000` 避免 Markdown 文本被强制换行

### .prettierignore

额外添加的忽略项：

```text
# Ignore Jekyll Liquid-templated JSON/JS files
manifest.json
sw.js
# Ignore upstream files that conflict with prettier
CUSTOMIZE.md
```

`manifest.json` 和 `sw.js` 包含 Jekyll Liquid front matter（`---` 头部），prettier 无法正确解析，需要忽略。

---

## 6. CI/CD 修改（.github/workflows/deploy.yml）

在部署工作流的路径过滤器中添加 `**.json`，确保 `manifest.json` 等 JSON 文件的修改能触发自动部署：

```yaml
on:
  push:
    paths:
      - "**.js"
      - "**.json" # 新增
      - "**.liquid"
```

另外升级了 CodeQL action 到 v4 以消除 deprecated action 警告。

---

## 7. 其他小修改

| 修改项                | 说明                                                                              |
| --------------------- | --------------------------------------------------------------------------------- |
| Category 大小写统一   | `RANSAC.md` 中 `categories: [algorithm]` 改为 `[Algorithm]`，避免 Jekyll 路径冲突 |
| 禁用 external_sources | 注释掉 `_config.yml` 中的 `external_sources` 配置，移除示例外部文章               |
| 默认 toc 设置         | 在 `_config.yml` 的 `defaults` 中为所有 posts 设置 `toc: sidebar: right`          |

---

## 8. Markdown 表格样式增强

### 问题

al-folio 默认的表格样式没有边框，表格线不可见，可读性差。

### 改动文件

**`_sass/_themes.scss`** — 为亮色和暗色主题分别添加表格相关 CSS 变量：

```scss
/* 亮色主题 (:root) */
--global-table-border-color: rgba(0, 0, 0, 0.15);
--global-table-header-bg: rgba(0, 0, 0, 0.06);
--global-table-stripe-bg: rgba(0, 0, 0, 0.03);
--global-table-hover-bg: rgba(0, 0, 0, 0.06);

/* 暗色主题 (html[data-theme="dark"]) */
--global-table-border-color: rgba(255, 255, 255, 0.15);
--global-table-header-bg: rgba(255, 255, 255, 0.08);
--global-table-stripe-bg: rgba(255, 255, 255, 0.04);
--global-table-hover-bg: rgba(255, 255, 255, 0.08);
```

**`_sass/_typography.scss`** — 重写 `table` 样式规则：

```scss
table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  margin-bottom: 1rem;
  overflow-x: auto;
  display: block; /* 宽表格横向滚动 */

  td,
  th {
    font-size: 1rem;
    padding: 0.5rem 0.75rem; /* 原来是 1px 1rem 1px 0，无视觉边框 */
    border: 1px solid var(--global-table-border-color);
    text-align: left;
  }

  th {
    font-weight: bold;
    background-color: var(--global-table-header-bg);
  }

  tbody tr:nth-child(even) {
    background-color: var(--global-table-stripe-bg); /* 斑马纹 */
  }

  tbody tr:hover {
    background-color: var(--global-table-hover-bg);
  }
}
```

---

## 9. 图片宽度约束与点击放大

### 问题

1. Markdown 中的图片按原始尺寸显示，大图会超出内容区宽度
2. 无法点击图片在页面内单独放大查看

### 解决方案

利用 al-folio 已内置的 `medium-zoom` 库（`_config.yml` 中 `enable_medium_zoom: true` 已默认开启），扩展其选择器覆盖所有 post 内图片。

### 改动文件

**`_sass/_typography.scss`** — 添加图片宽度约束：

```scss
/* Constrain images to content width and enable zoom cursor */
.post-content img,
#markdown-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0.5rem auto;
  cursor: zoom-in;
}
```

**`assets/js/zoom.js`** — 扩展 medium-zoom 初始化逻辑，自动为所有 post 内图片启用放大：

```javascript
// Initialize medium zoom.
$(document).ready(function () {
  const zoomOptions = { background: "#000000dd", margin: 24 };

  // 原有：显式标记 data-zoomable 的图片
  mediumZoom("[data-zoomable]", zoomOptions);

  // 新增：自动处理 markdown 内容区所有裸图片（未在链接内）
  document.querySelectorAll("#markdown-content img:not([data-zoomable])").forEach(function (img) {
    if (!img.closest("a")) {
      mediumZoom(img, zoomOptions);
    }
  });
});
```

**背景色选择**：使用黑色 `#000000dd`（与原始 al-folio 演示效果一致），替代原来随主题变化的 `--global-bg-color`。

### 冲突修复

原始模板中 `_scripts/photoswipe-setup.js` 是一个带 Liquid front matter 的脚本，Jekyll 会将其编译输出到 `assets/js/photoswipe-setup.js`。之前错误地在 `assets/js/` 下也创建了同名文件，导致编译 warning：

```
Conflict: The following destination is shared by multiple files.
  /home/hxf0223/work/hxf0223.github.io/_site/assets/js/photoswipe-setup.js
   - _scripts/photoswipe-setup.js
   - /home/hxf0223/work/hxf0223.github.io/assets/js/photoswipe-setup.js
```

**解决方式**：删除 `assets/js/photoswipe-setup.js`，保留原始的 `_scripts/photoswipe-setup.js` 不变。

---

## 提交历史参考

| 日期       | Commit    | 说明                                                       |
| ---------- | --------- | ---------------------------------------------------------- |
| 2026-02-27 | `9d5407b` | 更新个人信息和站点 URL                                     |
| 2026-02-27 | `86b0695` | 初始化仓库 fork 配置                                       |
| 2026-02-27 | `59860f6` | 迁移博客文章                                               |
| 2026-02-27 | `3d120b6` | 添加 PWA manifest                                          |
| 2026-02-27 | `5d5993f` | 添加 Service Worker 和 theme-color                         |
| 2026-02-27 | `92c705e` | 修复 manifest.json 尾部换行导致 JSON 无效                  |
| 2026-02-28 | `4ad9c06` | 完成全部文章迁移（含中文文件名）                           |
| 2026-02-28 | `c16ac46` | Tags/Categories 自动显示                                   |
| 2026-02-28 | `aed979b` | PWA 远程修复（SW 容错、manifest scope/id、CSP worker-src） |
| 2026-02-28 | `804f9b0` | 修复 SW fetch 拦截 chrome-extension 协议的错误             |
| 2026-03-09 | —         | SW 缓存策略改为 Stale-While-Revalidate，解决页面需刷新才更新问题 |
| 2026-03-10 | —         | 修复 blockquote 字号偏大问题，与正文保持一致                 |

---

## 10. Blockquote（引用段落）字号修复

### 问题

al-folio 默认的 `blockquote` 字号为 `1.2rem`，比正文（`1rem`）大，在文章中视觉上不协调。

### 改动文件

**`_sass/_typography.scss`** — 将 `blockquote` 的 `font-size` 从 `1.2rem` 改为 `1rem`：

```scss
// 修改前
blockquote {
  font-size: 1.2rem;
  ...
}

// 修改后
blockquote {
  font-size: 1rem; // 与正文保持一致
  ...
}
```

> **提示：** 若希望引用段落比正文略小，可设为 `0.9rem`，在视觉上形成层次感但不会突兀。
