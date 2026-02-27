---
layout: post
title: ArduPilot 笔记
date: 2025-12-08 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Ardupilot]
tags: [Ardupilot, QGC]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. ArduPilot SITL 编译 ##

```bash
# 编译及开发环境准备
./Tools/environment_install/install-prereqs-ubuntu.sh -y

./waf configure --board sitl
./waf plane    # ArduPlane
# 生成 build/sitl/bin/arduplane
```

### 1.1. 初步运行 ###

使用自定义`python`脚本运行 SITL[github -- ap-swarm-launcher](https://github.com/hxf0223/ap-swarm-launcher)：

```bash
# 启动两个 ArduPlane SITL 实例，设置数据目录为 ~/tmp/arduplane
uv run ap-sitl-swarm --model plane -n 2 --data-dir ~/tmp/arduplane --no-multicast --tcp-base-port 5760 --home 31.8269,117.2280,30 ~/tmp/arduplane/arduplane
```

更多资料：

* [Using SITL with AirSim](https://ardupilot.org/dev/docs/sitl-with-airsim.html)
* [search: ardupilot airsim](https://github.com/search?q=ardupilot+airsim&type=repositories)
* [Ardupilot -- Simulation](https://ardupilot.org/dev/docs/simulation-2.html)
