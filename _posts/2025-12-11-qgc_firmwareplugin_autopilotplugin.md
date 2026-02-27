---
layout: post
title: QGC代码架构解析：FirmwarePlugin与AutopilotPlugin
date: 2025-12-11 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [QGC]
tags: [QGC]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

概念：

* `FirmwarePlugin`：固件插件，表示某种飞控固件（如`APM`、`PX4`等）。
* `AutoPilotPlugin`：表示某种飞控固件实现的不同飞机类型，比如`固定翼`、`旋翼`等。

## 1. FirmwarePlugin 与 AutoPilotPlugin 的关系 ##

从逻辑关系看（主要从分类角度），`AutoPilotPlugin`需要从`FirmwarePlugin`创建，例如`APM`的固件，创建`APM`相关的`AutoPilotPlugin`。

从实现看，`FirmwarePlugin`最多也有三层继承，以`APM`固件为例：

* `FirmwarePlugin`（基类）
  * `APMFirmwarePlugin`（表示`APM`固件）
    * `ArduPlaneFirmwarePlugin`（表示`APM`的固定翼飞机）
    * `ArduCopterFirmwarePlugin`（表示`APM`的多旋翼飞机）
    * `ArduRoverFirmwarePlugin`（表示`APM`的地面车）

是在`APMFirmwarePlugin`这一层创建`AutoPilotPlugin`，即针对`APM`固件，实际只有一种`AutoPilotPlugin`实现。

### 1.1. `FirmwarePlugin` 实例的创建 ###

`MAVLink`协议心跳包中，包含了`固件类型`和`飞行器类型`两个字段：

```cpp
typedef struct __mavlink_heartbeat_t {
 uint32_t custom_mode; /*<  A bitfield for use for autopilot-specific flags*/
 uint8_t type; /*<  Vehicle or component type. For a flight controller component the vehicle type (quadrotor, helicopter, etc.). For other components the component type (e.g. camera, gimbal, etc.). This should be used in preference to component id for identifying the component type.*/
 uint8_t autopilot; /*<  Autopilot type / class. Use MAV_AUTOPILOT_INVALID for components that are not flight controllers.*/
 uint8_t base_mode; /*<  System mode bitmap.*/
 uint8_t system_status; /*<  System status flag.*/
 uint8_t mavlink_version; /*<  MAVLink version, not writable by user, gets added by protocol because of magic data type: uint8_t_mavlink_version*/
} mavlink_heartbeat_t;
```

通信层在收到心跳包之后，最终传递给`MultiVehicleManager`，然后在创建`Vehicle`中，创建对应的`FirmwarePlugin`实例：

```cpp
// void Vehicle::_commonInit(LinkInterface* link)
_firmwarePlugin = FirmwarePluginManager::instance()->firmwarePluginForAutopilot(_firmwareType, _vehicleType);
```

## 2. FirmwarePlugin 的职责 ##

获取对应的`AutoPilotPlugin`：

```cpp
virtual AutoPilotPlugin *autopilotPlugin(Vehicle *vehicle) const;
```

主要功能是，定义支持的飞行模式，并通过接口提供给外部。以及，一些飞行模式的控制实现：比如`TakeOff`模式中，起飞前检查（解锁等），发送起飞命令；再比如，发送`Mission`命令，以及发送之前的检查。

一些接口定义：

```cpp
virtual QList<MAV_CMD> supportedMissionCommands(QGCMAVLink::VehicleClass_t /*vehicleClass*/) const;

virtual QStringList flightModes(Vehicle* /*vehicle*/) const;

virtual void startTakeoff(Vehicle *vehicle) const;
virtual void startMission(Vehicle *vehicle) const;
```

另一个重要的接口是，定义飞控的离线参数文件，例如`APM`固定翼飞机：

```cpp
QString offlineEditingParamFile(Vehicle *vehicle) const override { return QStringLiteral(":/FirmwarePlugin/APM/Plane.OfflineEditing.params"); }
```

## 3. AutoPilotPlugin 的职责 ##

`FirmwarePlugin`实现通信协议及逻辑，而`AutoPilotPlugin`实现界面呈现。

`AutoPilotPlugin`目录下，定义了`AutoPilotPlugin`模块，以及`VehicleComponent`模块。`APM`，`PX4`两个子目录实现各自的`AutoPilotPlugin`子类，以及各自包含的诸多组件（继承自`VehicleComponent`）。

实现的组件包括：`Vehicle Configuration`面板中的各个功能模块，比如`遥控器`、`飞行模式`、`传感器`、`参数`等页面（参看`QGC`运行页面）。