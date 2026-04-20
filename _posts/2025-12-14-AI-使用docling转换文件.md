---
layout: post
title: AI工具：使用docling转换文档
date: 2025-12-14 +0900 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [AI]
tags: [AI]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. 环境搭建

环境搭建参考：**Python venv 环境搭建及 VSCode 环境配置**。

```bash
pip install docling
```

## 2. 使用 docling转换文档

```python
"""
docx 转 Markdown 脚本
用法：
  转换单个文件：python docx2md.py 文件.docx
  转换整个目录：python docx2md.py 目录路径/
  指定输出目录：python docx2md.py 文件.docx -o 输出目录/
"""

import argparse
import sys
from pathlib import Path

from docling.document_converter import DocumentConverter


def convert_file(input_path: Path, output_dir: Path) -> None:
    """将单个 docx 文件转换为 Markdown。"""
    print(f"正在转换：{input_path}")
    converter = DocumentConverter()
    result = converter.convert(str(input_path))
    md_content = result.document.export_to_markdown()

    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / (input_path.stem + ".md")
    output_path.write_text(md_content, encoding="utf-8")
    print(f"已保存：{output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="将 docx 文件转换为 Markdown")
    parser.add_argument("input", help="输入的 .docx 文件或包含 .docx 文件的目录")
    parser.add_argument(
        "-o", "--output", default=None, help="输出目录（默认与输入文件同目录）"
    )
    args = parser.parse_args()

    input_path = Path(args.input)

    if not input_path.exists():
        print(f"错误：路径不存在：{input_path}", file=sys.stderr)
        sys.exit(1)

    # 收集待转换文件
    if input_path.is_dir():
        files = list(input_path.rglob("*.docx"))
        if not files:
            print(f"目录中未找到 .docx 文件：{input_path}", file=sys.stderr)
            sys.exit(1)
    else:
        if input_path.suffix.lower() != ".docx":
            print(f"错误：不是 .docx 文件：{input_path}", file=sys.stderr)
            sys.exit(1)
        files = [input_path]

    for file in files:
        output_dir = Path(args.output) if args.output else file.parent
        convert_file(file, output_dir)

    print(f"\n完成，共转换 {len(files)} 个文件。")


if __name__ == "__main__":
    main()
```

## A. 资料

- [docling](https://github.com/docling-project/docling)
- [docling文档--使用](https://docling.cn/docling/usage/)
