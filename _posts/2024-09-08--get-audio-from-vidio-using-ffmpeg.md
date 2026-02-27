---
layout: post
title: 使用 FFmpeg 从视频中提取音频
date: 2024-09-08 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [工具]
tags: [工具, FFmpeg]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. 提取完整音频

```bash
ffmpeg -i sample.mp4 -q:a 0 -map a sample.mp3
```

## 2. 提取特定时段的音频

```bash
ffmpeg -i sample.mp4 -ss 00:03:05 -t 00:00:45.0 -q:a 0 -map a sample.mp3
```

- `ss` 选项指定开始时间戳，使用 `t` 选项指定编码持续时间，例如从3分钟到5秒钟，持续45秒。
- 时间戳必须采用 `HH：MM：SS.xxx` 格式或以秒为单位。
- 如果你不指定 `t` 选项，它将会结束。

- [FFmpeg 提取视频的音频](https://www.cnblogs.com/CodeAndMoe/p/13360011.html)

## 3. 直接提取音频流

```bash
ffmpeg -i input.flv -vn -codec copy out.m4a
```

其中，`-i`的意思是`input`，后接输入源。`-codec`的意思是直接复制流。

- [利用FFmpeg无损提取视频中源音频流](https://blog.csdn.net/tomwillow/article/details/90372606)
