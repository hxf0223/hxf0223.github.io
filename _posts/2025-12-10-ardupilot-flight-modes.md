---
layout: post
title: APM/Pixhawk常用飞行模式
date: 2025-12-10 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Ardupilot]
tags: [Ardupilot, QGC]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. 多旋翼：手动飞行模式 ##

如下几种飞行模式是手动控制模式，即受遥控器控制：

* Stabilize（稳定模式/姿态模式）
* Altitude（定高模式）
* Position（定点模式）
* Offboard（板外模式/指令模式）

### 1.1. Stabilize：稳定模式（姿态模式） ###

* `俯仰`、`横滚`摇杆控制飞机对应的`角度`（注意是角度）；
* `油门`控制飞机的`上升/下降`速度，以及其他轴的移动速度（注意是速度，类似汽车油门）；
* `偏航`控制飞机的`旋转速率`（水平方向）。

当摇杆回到中立位置时，飞机会自动保持当前的`姿态`（俯仰角0，横滚角0，偏航角0）和高度。但不会自动保持位置：可能会朝着风力的方向漂移，此时需要控制油门以保持高度。

资料：

* [PX4 Guide -- 位置模式（多旋翼）](https://docs.ncnynl.com/en/px4/zh/flight_modes_mc/position.html)

### 1.2. Altitude：定高模式 ###

`定高模式`与`稳定模式`类似：`俯仰`、`横滚`摇杆控制飞机的`角度`。但是油门控制逻辑是：油门摇杆以预定的最大速率（和其他轴上的移动速度）控制上升速度。

* 当摇杆归中之后，如果飞机在水平方向飞行，则持续运动，直到被风的阻力减速停下。如果刮风，飞机会朝着风的方向漂移。
* 高度保持依赖传感器（气压计或激光测距仪等）来维持高度。

资料：

* [PX4 Guide -- 定高模式（多旋翼）](https://docs.ncnynl.com/en/px4/zh/flight_modes_mc/altitude.html)

### 1.3. Position：定点模式 ###

* `横滚`、`俯仰`摇杆分别控制飞机在左右和前后方向上的地面水平`加速度`。
* `油门`摇杆控制飞机的`上升/下降`速度。
* `偏航`摇杆控制飞机的`旋转速率`（水平面方向）。

当摇杆回到中立位置时，飞机会自动保持当前位置和高度，但不保持当前方向（当有外力改变水平朝向之后，会保持新的角度）。

依赖`GPS`获取绝对位置，以及磁罗盘获取航向。如果这两个组件有失效，则不能进入该模式；如果在该模式下失效，则进入失效处理。

资料：

* [PX4 Guide -- 位置模式（多旋翼）](https://docs.ncnynl.com/en/px4/zh/flight_modes_mc/position.html)

### 1.4. Offboard：板外模式/指令模式 ###

指令控制模式，即通过地面站发送切换指令：

* 切换指令需要带位置、偏航角等参数；
* 需要按指定周期发送指令，否则会触发失效处理。

## 2. 多旋翼：自动飞行模式 ##

TBD

## 3. 摇杆 ##

遥控器摇杆控制：俯仰(pitch)、横滚(roll)、偏航(yaw)、油门(throttle)：

![rc_basic_commands](/assets/images/qgc/20251211/rc_basic_commands.BUO2xOt.png)

对应的飞机运动：

![rc_basic_movements](/assets/images/qgc/20251211/basic_movements_forward.DyNpVOoP.png)

* 俯仰 => 上升/下降。
* 横滚 => 向左/右倾斜并转弯。
* 偏航 => 机尾向左/右转动并转弯。
* 油门 => 改变前进速度。

以上指固定翼飞机，其他类型飞机类似。

资料：

* [PX4 Guide -- 固定翼飞机基础飞行指南](https://docs.ncnynl.com/en/px4/zh/flying/basic_flying_fw.html)

## 参考资料 ##

* [PX4 Guide -- PX4多旋翼无人机飞行模式（Flight Mode）](https://wiki.yundrone.cn/docs/PX4-duo-xuan-yi-wu-ren-ji-fei-xing-mo-shi-Flight-Mode)
* APM/Pixhawk常用飞行模式讲解：http://www.nufeichuiyun.com/?p=1128
* [【无人机】多旋翼无人机控制器架构，PX4控制器，PID控制](https://blog.csdn.net/weixin_60324241/article/details/146954708)
* [开放航空航天仿真工具集锦](https://spacefan.github.io/2018/06/28/OpenTools/)
