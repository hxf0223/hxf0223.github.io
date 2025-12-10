---
title: APM/Pixhawk常用飞行模式
date: 2025-12-10 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [ardupilot]
tags: [ardupilot, qgc]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. 常用飞行模式：多旋翼 ##

如下几种飞行模式是手动控制模式，即受遥控器控制：

* Stabilize（稳定模式/姿态模式）
* AltHold（定高模式）

### 1.1. Stabilize：稳定模式（姿态模式） ###

* `俯仰`、`横滚`摇杆控制飞机对应的`角度`（注意是角度）；
* `油门`控制飞机的`上升/下降`速度，以及其他轴的移动速度（注意是速度，类似汽车油门）；
* `偏航`控制飞机的`旋转速率`（水平方向）。

当摇杆回到中立位置时，飞机会自动保持当前的`姿态`（俯仰角0，横滚角0，偏航角0）和高度。但不会自动保持位置：可能会朝着风力的方向漂移，此时需要控制油门以保持高度。

* [位置模式（多旋翼）](https://docs.ncnynl.com/en/px4/zh/flight_modes_mc/position.html)

### 1.2. AltHold：定高模式 ###

`定高模式`与`稳定模式`类似，但是油门控制逻辑是：油门摇杆以预定的最大速率（和其他轴上的移动速度）控制上升速度。

* 当摇杆归中之后，如果飞机在水平方向飞行，则持续运动，直到被风的阻力减速停下。如果刮风，飞机会朝着风的方向漂移。
* 保持高度，依赖传感器（气压计或激光测距仪等）来维持高度。

资料：

* [定高模式（多旋翼）](https://docs.ncnynl.com/en/px4/zh/flight_modes_mc/altitude.html)

### 参考资料 ###

* [PX4多旋翼无人机飞行模式（Flight Mode）](https://wiki.yundrone.cn/docs/PX4-duo-xuan-yi-wu-ren-ji-fei-xing-mo-shi-Flight-Mode)
* [APM/Pixhawk常用飞行模式讲解](http://www.nufeichuiyun.com/?p=1128)
* [【无人机】多旋翼无人机控制器架构，PX4控制器，PID控制](https://blog.csdn.net/weixin_60324241/article/details/146954708)
