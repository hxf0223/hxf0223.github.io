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

## 1. ArduPilot SITL 编译

设置windows/Cygwin环境下git选项：

```bash
# 忽略权限位变化
git config --global core.fileMode false
# 信任当前目录
git config --global --add safe.directory /cygdrive/e/work/flight/ardupilot
# 关闭 CRLF 自动转换（避免与 Windows 工具冲突）
git config --global core.autocrlf false
```

下载 ArduPilot 代码：

```bash
git clone https://github.com/ardupilot/ardupilot.git
cd ardupilot
git submodule update --init --recursive

git submodule foreach --recursive "git reset --hard HEAD"
```

编译 ArduPilot SITL：

```bash
# 编译及开发环境准备
./Tools/environment_install/install-prereqs-ubuntu.sh -y

./waf configure --board sitl
./waf plane    # ArduPlane
# 生成 build/sitl/bin/arduplane
```

### 1.1. 初步运行

使用自定义`python`脚本运行 SITL[github -- ap-swarm-launcher](https://github.com/hxf0223/ap-swarm-launcher)：

```bash
# 启动两个 ArduPlane SITL 实例，设置数据目录为 ~/tmp/arduplane
uv run ap-sitl-swarm --model plane -n 2 --data-dir ~/tmp/arduplane --no-multicast --tcp-base-port 5760 --home 31.8269,117.2280,30 ~/tmp/arduplane/arduplane
```

## 2. Windows上使用Cygwin编译

从[cygwin](https://www.cygwin.com/install.html) 下载并安装`setup-x86_64.exe`。在`cygwin`环境中安装选择以下软件包：

```text
autoconf automake ccache gcc-g++ git libtool make gawk libexpat-devel libxml2-devel python39 python39-future python39-lxml python39-pip libxslt-devel python39-devel procps-ng zip gdb ddd xterm cmake
```

另外，还需要安装如下软件包，以部分解决`Cygwin`中的终端启动不了的问题：

```text
xterm xorg-server xinit font-util unifont-fonts
```

在`cygwin`环境中安装pip包：

```bash
pip install pymavlink pyserial empy==3.3.4 MAVProxy pexpect lxml
```

在`cygwin`环境中编译（此时不需要也不能运行脚本`install-prereqs-ubuntu.sh`）：

```bash
# 进入 ardupilot 根目录
# ./waf configure --board sitl --debug
# ./waf -j8 plane -v
./waf configure --board sitl
./waf plane
```

### 2.1. SITL 运行

运行`sim_vehicle.py`需要MAVProxy，首先需要从github上下载并安装[MAVProxy](https://github.com/ArduPilot/MAVProxy/releases)。

在Cygwin环境中，没有支持的console输出的terminal，需要作一些设置或修改，以显示console输出窗口。有两种方式：使用X server，或者mintty终端。

首先，在`cygwin`中启动`X Server`（已弃用，可以不用启动）：

```bash
startxwin &
export DISPLAY=:0
```

启动`sim_vehicle.py`前，需要修改`Tools\autotest\run_in_terminal_window.sh`脚本，添加mintty支持：

```bash
elif [ -n "$(which mintty 2>/dev/null)" ]; then
  # Cygwin native terminal - no X11 fonts required
  mintty --hold always -T "$name" -e "$@" &
```

![cygwin-mintty](/assets/images/ardupilot/20251208/cygwin_sitl_mintty001.png)

然后，在`cygwin`环境中启动`sim_vehicle.py`：

```bash
cd /cygdrive/e/work/flight/ardupilot/ArduPlane
../Tools/autotest/sim_vehicle.py --map --console
```

启动之后，观察LOG信息：

```text
SIM_VEHICLE: Run ArduPlane
SIM_VEHICLE: "/cygdrive/e/work/flight/ardupilot/Tools/autotest/run_in_terminal_window.sh" "ArduPlane" "/cygdrive/e/work/flight/ardupilot/build/sitl/bin/arduplane" "--model" "plane" "--speedup" "1" "--slave" "0" "--sim-address=127.0.0.1" "-I0"
SIM_VEHICLE: Run MavProxy
SIM_VEHICLE: "/usr/bin/cygstart" "-w" "mavproxy.exe" "--retries" "5" "--out" "127.0.0.1:14550" "--master" "tcp:127.0.0.1:5760" "--sitl" "127.0.0.1:5501" "--map" "--console"
RiTW: Starting ArduPlane : /cygdrive/e/work/flight/ardupilot/build/sitl/bin/arduplane --model plane --speedup 1 --slave 0 --sim-address=127.0.0.1 -I0
```

可以看到SITL通过TCP:5760端口与MAVProxy通信，MAVProxy通过TCP:14550端口与QGroundControl通信。

#### 2.1.1. 更改SITL仿真的HOME坐标

在`Tools\autotest\locations.txt`文件中定义了一些预设的HOME坐标，默认加载HOME点是`CMAC`。可以通过NAME选择其他地点，比如：

```bash
../Tools/autotest/sim_vehicle.py -L Unalga --map --console
```

也可以在locations.txt中添加NAME+坐标。

#### 2.1.2. 命令交互--固定翼 ArduPlane

启动`sim_vehicle.py`之后，会启动一个`console`窗口、一个`map`窗口，以及一个`terminal`窗口。可以在`terminal`窗口中输入命令来控制仿真，比如：

```text
# 在cygwin环境中，由于MAVProxy是在windows环境下安装的（不是在cygwin环境安装的），
# 所以mavproxy命令接收的路径是windows的路径格式。
# 另外，可以使用相对路径，但是测试这种方式发现不可靠。
STABILIZE > wp load "E:\work\flight\ardupilot\Tools\autotest\Generic_Missions\CMAC-circuit.txt"
STABILIZE > mode guided
GUIDED > arm throttle
GUIDED > takeoff 40
GUIDED > mode auto
GUIDED > mode rtl

# 自动降落返回HOME点
RTL > param set RTL_AUTOLAND 1
RTL > mode autoland
```

具体操作步骤参考官方教程文档：[Plane SITL/MAVProxy Tutorial](https://ardupilot.org/dev/docs/plane-sitlmavproxy-tutorial.html)。另外参考知乎文章：[ArduPilot 软件在环仿真SITL（SITL+MAVProxy）](https://zhuanlan.zhihu.com/p/62017292)。

> 1. 当飞机处于`MISSION_RUNNING`状态时（Armed + MISSION_RUNNING），不能接收航线修改命令。飞控接收新航线，会冲掉当前的航线。
> 2. 其他wp命令：`wp list`、`wp clear`。
> 3. 航线文件格式参见官方文档：[Plan File Format](https://docs.qgroundcontrol.com/master/en/qgc-dev-guide/file_formats/plan.html)。

#### 2.1.3. 参数文件

SITL启动时，都会加载默认的参数文件，比如plane的默认文件在代码仓库中的路径是`Tools/autotest/models/plane.parm`。运行`sim_vehicle.py`时，可以通过加载自定义参数文件来修改/添加SITL的仿真参数，比如使用如下命令加载用户自定义的参数文件：

```bash
../Tools/autotest/sim_vehicle.py --map --console --param-file my_params.parm
```

参数文件`my_params.parm`内容：

```text
# 查看当前参数
param show

# 修改特定参数
param set BATTERY_CAPACITY 5200
param set SIM_SPEEDUP 2
```

#### 2.1.4. 有关SITL仿真的资源

- [Copter SITL/MAVProxy Tutorial](https://ardupilot.org/dev/docs/copter-sitl-mavproxy-tutorial.html)：使用`sim_vehicle.py`的一个官方文档。
- [SITL setup on Windows using Cygwin (not recommended)](https://ardupilot.org/dev/docs/sitl-native-on-windows.html)

#### 2.1.5. 启动仿真以及连接QGroundControl

QGC创建一个UDP:14550端口的连接，连接到MAVProxy的TCP:14550端口。MAVProxy会将SITL的数据转发给QGC。

#### 2.1.6. Cygwin终端美化

编辑Cygwin的.bashrc文件（比如在windows中绝对路径为`C:\cygwin64\home\Administrator\.bashrc`）：

```bash
case "$TERM" in
xterm*|rxvt*|screen*|cygwin*)
    PS1='${debian_chroot:+($debian_chroot)}\[\033[1;36m\]§ \[\033[1;32m\]\h\[\033[0;36m\] {\[\033[1;36m\]\w\[\033[0;36m\]}\[\033[39m\] '
    PROMPT_COMMAND='echo -ne "\033]0;${USER}@${HOSTNAME}: ${PWD/$HOME/~}\007"'
    ;;
*)
    PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
    ;;
esac

################
# 目录导航别名
alias ..='cd ..'
alias ...='cd ../..'
alias c='clear'
alias h='history'
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color'
```

## A. 资料

- [Using SITL with AirSim](https://ardupilot.org/dev/docs/sitl-with-airsim.html)
- [search: ardupilot airsim](https://github.com/search?q=ardupilot+airsim&type=repositories)
- [Ardupilot -- Simulation](https://ardupilot.org/dev/docs/simulation-2.html)

### A.1. 一些地面站收集

- [ADOSMissionControl](https://github.com/altnautica/ADOSMissionControl)：一个基于typescript的地面站
