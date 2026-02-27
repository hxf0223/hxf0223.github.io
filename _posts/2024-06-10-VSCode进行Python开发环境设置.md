---
layout: post
title: Python venv 环境搭建及 VSCode 环境配置
date: 2024-06-10 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Python]
tags: [VSCode, Python]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1 Python venv 环境搭建

### 1.1 venv 安装

```bash
pip install virtualenv

# 设置永久国内 pip 源
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/
pip config set install.trusted-host pypi.tuna.tsinghua.edu.cn
```

### 1.2 创建 venv 环境

```bash
# python -m venv <目录>
python -m venv my_env
```

### 1.3 激活 venv 环境

Linux/Mac：

```bash
source ./my_env/bin/activate
```

Windows：

```bash
.\my_env\Scripts\activate

# 退出虚拟环境
.\my_env\Scripts\deactivate.bat
```

### 1.4. 安装依赖

```bash
# pip install -r requirements.txt
# pip install pygame
```

## 2. vscode 环境配置

### 2.1 settings.json 配置

需要安装插件：

- Python
- Pylance
- Yapf

```json
"terminal.integrated.env.linux": {
    "PYTHONPATH": "${workspaceFolder}/python;${env:PYTHONPATH}"
},
"python.envFile": "${workspaceFolder}/.env",
"python.analysis.extraPaths": [
    "${workspaceFolder}/python"
],
"[python]": {
    "diffEditor.ignoreTrimWhitespace": false,
    "editor.defaultFormatter": "eeyore.yapf",
    "editor.formatOnSaveMode": "file",
    "editor.formatOnSave": true,
    "editor.indentSize": 2,
    "editor.wordBasedSuggestions": "off",
    "files.trimTrailingWhitespace": true,
},
"python.languageServer": "Pylance",
"yapf.args": ["--style", "{based_on_style: pep8, indent_width: 2}"],
```

### 2.1 extensions.json 配置

```json
{
  "recommendations": ["eeyore.yapf", "dangmai.workspace-default-settings", "ms-python.flake8", "ms-python.isort", "ms-python.python"],
  "unwantedRecommendations": ["ms-python.black-formatter", "ms-python.pylint"]
}
```

附件见 `python_prj/.vscode.zip` 。
