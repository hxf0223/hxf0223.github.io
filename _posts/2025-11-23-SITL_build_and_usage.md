---
title: 交叉编译 Qt 5.15.2
date: 2025-11-23 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [ardupilot]
tags: [sitl]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. 下载及编译 ##

```bash
git clone https://gitcode.com/ArduPilot/ardupilot.git
cd ardupilot
git submodule update --init --recursive
``

安装依赖，安装完成之后，重新进入终端，以使能一些环境变量：

```bash
./Tools/environment_install/install-prereqs-ubuntu.sh -y
```

安装之后，可能会提示有一些包没有安装成功，可以手动安装这些包。另外，创建`venv`环境可能会好一些。

编译`SITL`：

```bash
./waf configure --board sitl
./waf plane -j6
```

## 2. SITL仿真 ##

首先创建一个仿真位置文件：`~/.config/ardupilot/locations.txt`，用于设置仿真时的地理位置。 内容如下：

```text
#NAME=latitude,longitude,absolute-altitude,heading
# User custom locations for ArduPilot SITL simulation
# Format: LOCATION_NAME=latitude,longitude,altitude_in_meters,heading_in_degrees

# Hefei, Anhui Province, China locations
Hefei=31.820587,117.227005,30,0
Hefei_North=31.820587,117.227005,30,0
Hefei_East=31.820587,117.227005,30,90
Hefei_South=31.820587,117.227005,30,180
Hefei_West=31.820587,117.227005,30,270

# Hefei University of Technology (approximately)
HFUT=31.841887,117.282699,35,0

# Hefei Xinqiao International Airport
HefeiAirport=31.781389,117.298333,35,90

# Hefei High-tech Zone (typical location)
HefeiHighTech=31.837722,117.169167,25,0

# Downtown Hefei
HefeiDowntown=31.864444,117.283056,28,0
```

### 2.1 TCP连接 ###

```bash
# 创建TCP连接的`SITL`仿真的命令如下，禁用`MAVProxy`
./Tools/autotest/sim_vehicle.py --vehicle=ArduPlane --model=plane --count=2 --auto-sysid --location Hefei --auto-offset-line=0,100 --no-mavproxy
```

`SITL`所在`Ubuntu`的IP地址为`192.168.137.176`，则创建之后，生成两个`SITL`实例，分别监听在`5760`和`5770`端口。使用`QGC`连接时，需要创建两个`TCP`连接，连接参数如下：

```text
Server Address： 192.168.137.176
Port： 5760  （或 5770）
```

* `TCP`连接时，`SITL`中的飞控作为服务端，`QGC`作为客户端进行连接。

### 2.2 UDP连接 ###

```bash
./Tools/autotest/sim_vehicle.py --vehicle=ArduPlane --model=plane --count=2 --auto-sysid --location Hefei --auto-offset-line=0,100 --no-mavproxy -A "--serial0=udpclient:192.168.11.139:14550"
```

对应的，`QGC`的连接参数如下：

```text
Connection Type： UDP
Local Port： 14550
```

* 此时，`SITL`中的飞控作为客户端，`QGC`作为服务端，监听端口`14550`的消息。
* 经过测试，似乎此时不能发送`UDP`消息给`SITL`，只能接收`SITL`发送过来的消息。

## 3. 第三方启动脚本 ##

* [ap-swarm-launcher](https://github.com/hxf0223/ap-swarm-launcher)

## 4. 资料 ##

* [deepwiki -- ArduPilot SITL](https://deepwiki.com/ArduPilot/ardupilot/5.2-software-in-the-loop-(sitl))
* [example -- 自定义SITL启动脚本：多机主从](https://github.com/ArduPilot/ardupilot/blob/master/libraries/SITL/examples/follow-copter.sh)
* [github -- Intelligent Quads Tutorials](https://github.com/Intelligent-Quads/iq_tutorials)
* [Ardupilot discuss](https://discuss.ardupilot.org/)

### 4.1 资源 ###

* [Microsoft Flight Simulator 202x ↔ ArduPilot SITL Bridge release!](https://discuss.ardupilot.org/t/microsoft-flight-simulator-202x-ardupilot-sitl-bridge-release/141039)
* [github -- SITL_Models : 仿真器模型资源](https://github.com/ArduPilot/SITL_Models)
