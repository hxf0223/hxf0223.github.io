---
layout: post
title: Ubuntu 26.04 安装 Docker 和 Docker Compose
date: 2026-02-27 7:00:00 +0800
categories: [Tools, Blog]
tags: [jekyll, al-folio, ubuntu, docker]
toc:
  sidebar: right
---

## 1. 依赖安装

先检查是否已经安装了Docker和Docker Compose，如果安装了，则先卸载旧版本：

```bash
sudo apt remove -y docker docker-engine docker.io containerd runc
sudo rm -rf /var/lib/docker /var/lib/containerd
```

安装依赖项：

```bash
sudo apt update && sudo apt upgrade -y

# 安装证书、curl、gnupg 等基础依赖
sudo apt install -y ca-certificates curl gnupg lsb-release
```

## 2. 添加国内源

首先添加GPP密钥，另外再添加阿里云的Docker源：

```bash
# 创建密钥存储目录
sudo mkdir -p /etc/apt/trusted.gpg.d

# 导入阿里云 Docker GPG 密钥（避免签名验证失败）
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg
```

```bash
# 添加适配 Ubuntu 24.04（noble）的阿里云 Docker 源
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/trusted.gpg.d/docker.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 再次更新包索引（加载新添加的 Docker 源）
sudo apt update
```

## 3. 安装 Docker 和 Docker Compose，并配置Docker服务

```bash
# 安装 Docker CE、Containerd、Docker Compose 插件
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

启动并设置开机自启（启动Docker，设置开机自启，验证Docker状态）：

```bash
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl status docker
```

将当前用户加入 docker 组（允许非 root 用户运行 Docker 命令）：

```bash
# 将当前用户加入 docker 组
sudo usermod -aG docker $USER

# 生效组配置（无需重启，重新登录终端即可）
sudo apt install util-linux-extra # 安装 newgrp 命令
newgrp docker

# 验证权限（无需 sudo 能执行即成功）
docker ps
```

## 4. 配置 Docker 镜像加速

首先创建 Docker 配置文件目录（如果不存在）：

```bash
sudo mkdir -p /etc/docker
sudo touch /etc/docker/daemon.json
```

配置文件内容如下：

{% raw %}

```bash
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "100GB",
      "enabled": true
    }
  },
  "data-root": "/home/docker/MyDocker",
  "experimental": false,
  "registry-mirrors": [
    "https://dockerproxy.net",
    "http://mirrors.ustc.edu.cn",
    "http://mirror.azure.cn",
    "https://hub.rat.dev"
  ]
}
```

{% endraw %}

验证配置是否生效：

```bash
# 重启 Docker 使加速配置生效
sudo systemctl daemon-reload
sudo systemctl restart docker

# 验证加速器是否生效
docker info | grep -i mirror
```

输出中能看到配置的镜像地址，说明加速生效。

## 5. 验证安装是否成功--运行一个测试容器

```bash
# 运行 hello-world 测试容器验证安装成功
docker run hello-world
```

若输出 “Hello from Docker!” 相关内容，说明安装+配置全部成功。

## A. 参考资料

- [Ubuntu 24.04.1 LTS 安装 Docker（国内源版，全程可访问）](https://www.cnblogs.com/boradviews/p/19329796)
- [Ubuntu 24.04 LTS Docker 和 Docker Compose 安装指南](https://www.cnblogs.com/autopwn/p/18840141)
