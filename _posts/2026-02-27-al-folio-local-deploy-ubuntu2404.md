---
layout: post
title: al-folio 本地部署记录（Ubuntu 24.04）
date: 2026-02-27 10:00:00 +0800
categories: [工具, 博客]
tags: [jekyll, al-folio, ubuntu, ruby, rbenv]
toc:
  sidebar: right
---

本文记录在 Ubuntu 24.04 上从零开始本地部署 [al-folio](https://github.com/alshedivat/al-folio) Jekyll 主题的完整流程，以及遇到的问题和解决方案。

## 环境说明

- 操作系统：Ubuntu 24.04 x86_64
- Ruby 版本管理：rbenv
- 目标 Ruby 版本：3.3.5

---

## 第一步：安装系统依赖

Ruby 编译和 Jekyll 运行需要以下系统包：

```bash
sudo apt-get install -y libyaml-dev libssl-dev libreadline-dev zlib1g-dev libffi-dev imagemagick nodejs
```

> **说明：**
> - `libyaml-dev`：编译 Ruby 3.3.x 时必须，缺少会导致 `psych` 扩展编译失败。
> - `imagemagick`：提供 `convert` 命令，用于生成响应式 WebP 图片。
> - `nodejs`：为 Terser JS 压缩插件提供运行时。

---

## 第二步：安装 Ruby 3.3.5（通过 rbenv）

```bash
# 安装 Ruby 3.3.5
rbenv install 3.3.5

# 在项目目录设置 Ruby 版本
cd ~/work/hxf0223.github.io
rbenv local 3.3.5

# 验证
ruby --version
# => ruby 3.3.5 (2024-09-03 revision ef084cc8f4) [x86_64-linux]
```

> **注意：** 必须先安装 `libyaml-dev` 再执行 `rbenv install`，否则会报错：
>
> ```text
> *** Following extensions are not compiled:
> psych:
>     Could not be configured. It will not be installed.
> BUILD FAILED
> ```

---

## 第三步：处理 GEM_HOME 冲突

若系统 `~/.bashrc` 中存在为旧版 Ruby 手动设置的 `GEM_HOME`，会导致 gem 版本冲突（`linked to incompatible libruby-3.2.so`）。

检查并注释掉相关行：

```bash
# 编辑 ~/.bashrc，注释掉以下两行：
# export GEM_HOME="$HOME/gems"
# export PATH="$HOME/gems/bin:$PATH"
```

在新终端生效前，当前终端需手动清除：

```bash
unset GEM_HOME
unset GEM_PATH
```

---

## 第四步：安装 Jupyter（处理 .ipynb 文件）

al-folio 支持在博文中嵌入 Jupyter Notebook，需要系统安装 `jupyter`：

```bash
sudo apt-get install -y jupyter-core jupyter-nbconvert
```

> Ubuntu 24.04 限制了通过 `pip install --user` 安装包，建议直接使用 apt 安装。

---

## 第五步：安装 Ruby Gems

```bash
cd ~/work/hxf0223.github.io

# 清除旧的 GEM_HOME（如尚未在新终端中）
unset GEM_HOME

# 安装 Bundler
gem install bundler

# 删除旧的 Gemfile.lock（如果存在）
rm -f Gemfile.lock

# 安装所有依赖
bundle install
```

成功后输出类似：

```text
Bundle complete! 27 Gemfile dependencies, 100 gems now installed.
```

---

## 第六步：启动本地服务

> **每次打开新终端前**，如果 `~/.bashrc` 中的 `GEM_HOME` 尚未完全失效（旧终端），需先执行：
> ```bash
> unset GEM_HOME
> ```
> 新登录的终端（`.bashrc` 已修复后）无需此步骤。

### 常规启动（含文件监听，推荐开发时使用）

```bash
unset GEM_HOME && bundle exec jekyll serve --port 4000
```

访问 <http://localhost:4000> 查看效果，修改文件后会自动重新构建。

### 仅构建，不启动服务器

```bash
unset GEM_HOME && bundle exec jekyll build
```

生成结果输出到 `_site/` 目录。

### 增量构建（加速二次构建）

```bash
unset GEM_HOME && bundle exec jekyll serve --port 4000 --incremental
```

只重新编译发生变动的文件，适合文章较多时加速预览。

### 指定 host（局域网访问）

```bash
unset GEM_HOME && bundle exec jekyll serve --port 4000 --host 0.0.0.0
```

局域网内其他设备可通过 `http://<本机IP>:4000` 访问。

### 生产环境构建

```bash
unset GEM_HOME && JEKYLL_ENV=production bundle exec jekyll build
```

启用 CSS/JS 压缩等生产优化，与 GitHub Actions 部署行为一致。

---

## 常见问题汇总

| 错误信息 | 原因 | 解决方案 |
| ---------- | ------ | ---------- |
| `psych: Could not be configured. BUILD FAILED` | 缺少 `libyaml-dev` | `sudo apt-get install libyaml-dev` |
| `linked to incompatible libruby-3.2.so` | `GEM_HOME` 指向旧版本 gems | 注释 `~/.bashrc` 中的 `GEM_HOME`，执行 `unset GEM_HOME` |
| `bundler (= 4.0.4) required by user-specified dependency` | Ruby 版本太旧（3.1.x），Bundler 4.x 需要 Ruby >= 3.3 | 升级到 Ruby 3.3.5 |
| `sh: convert: not found` | ImageMagick 未安装 | `sudo apt-get install imagemagick` |
| `No such file or directory - jupyter` | jupyter 未安装 | `sudo apt-get install jupyter-core jupyter-nbconvert` |
| `Could not find a JavaScript runtime` | Node.js 未安装 | `sudo apt-get install nodejs` |

---

## 一键安装脚本

将以上步骤整合为脚本，方便在新机器上复现：

```bash
#!/bin/bash
set -e

# 1. 系统依赖
sudo apt-get install -y libyaml-dev libssl-dev libreadline-dev \
    zlib1g-dev libffi-dev imagemagick nodejs \
    jupyter-core jupyter-nbconvert

# 2. 安装 Ruby 3.3.5
rbenv install 3.3.5
rbenv local 3.3.5

# 3. 清除旧 GEM_HOME（如有）
unset GEM_HOME
unset GEM_PATH

# 4. 安装 Gems
gem install bundler
rm -f Gemfile.lock
bundle install

echo "✅ 完成！执行以下命令启动本地服务："
echo "   unset GEM_HOME && bundle exec jekyll serve --port 4000"
```

---

## 参考资料

- [Running local al-folio](https://george-gca.github.io/blog/2022/running-local-al-folio/)
- [Jekyll al-folio 博客部署指南](https://zhuanlan.zhihu.com/p/707289907)
- [flammingRaven 的 al-folio 部署参考](https://github.com/flammingRaven/flammingRaven.github.io)
