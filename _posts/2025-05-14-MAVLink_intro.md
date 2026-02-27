---
layout: post
title: MAVLink协议
date: 2025-05-14 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [QGC]
tags: [QGC, MAVLink]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. MAVLink v2 协议 ##

`MAVLink`协议格式文档：[Packet Serialization](https://mavlink.io/en/guide/serialization.html)

![mavlink_v2](/assets/images/qgc/20250515/packet_mavlink_v2.rtTEhol01.jpg)

### 1.1. `MAVLink`协议格式重要字段 ###

```cpp
MAVPACKED(
typedef struct __mavlink_message {
    uint16_t checksum;      ///< sent at end of packet
    uint8_t magic;          ///< protocol magic marker
    uint8_t len;            ///< Length of payload
    uint8_t incompat_flags; ///< flags that must be understood
    uint8_t compat_flags;   ///< flags that can be ignored if not understood
    uint8_t seq;            ///< Sequence of packet
    uint8_t sysid;          ///< ID of message sender system/aircraft
    uint8_t compid;         ///< ID of the message sender component
    uint32_t msgid:24;      ///< ID of message in payload
    uint64_t payload64[(MAVLINK_MAX_PAYLOAD_LEN+MAVLINK_NUM_CHECKSUM_BYTES+7)/8];
    uint8_t ck[2];          ///< incoming checksum bytes
    uint8_t signature[MAVLINK_SIGNATURE_BLOCK_LEN];
}) mavlink_message_t;
```

* `System ID`：系统ID(sysid)，用于区分不同的无人机，标示发送者的`sisid`；
* `Component ID`：组件ID(compid)，用于区分无人机的不同模块，标示发送者的`compid`；
* `Message ID`：消息ID(msgid)，用于区分不同的消息类型，不同类型消息(GPS数据、遥测信息、飞行控制指令等)，需要再次解析`payload`得到有意义的消息体；
* `sequence number`：序列号(seq)，用于统计数据包丢失；

#### 1.1.1. LinkId ###

`LinkId`位于signature的第一个字节，在多链路通信系统中（如wifi，4G，卫星通信）用于区分不同的物理链路，可用于该链路信号质量检测及调整。

#### 1.1.2. 时间同步 ####

`MAVLink`要求所有节点设备的时间同步，以保证消息的顺序性。[mavlink（一）帧格式和特性](https://www.cnblogs.com/hjx168/p/17706765.html)

### 1.2. `MAVLink`协议解析 ###

参照`ardupilot`仓库代码相关解析，`handle_xxx`等成员方法，例如`GCS_MAVLINK_Copter::handle_message(const mavlink_message_t &msg)`。

```cpp
void GCS_MAVLINK_Copter::handle_message(const mavlink_message_t &msg)
{

    switch (msg.msgid) {
#if MODE_GUIDED_ENABLED
    case MAVLINK_MSG_ID_SET_ATTITUDE_TARGET:
        handle_message_set_attitude_target(msg);
        break;
    case MAVLINK_MSG_ID_SET_POSITION_TARGET_LOCAL_NED:
        handle_message_set_position_target_local_ned(msg);
        break;
    case MAVLINK_MSG_ID_SET_POSITION_TARGET_GLOBAL_INT:
        handle_message_set_position_target_global_int(msg);
        break;
#endif
#if AP_TERRAIN_AVAILABLE
    case MAVLINK_MSG_ID_TERRAIN_DATA:
    case MAVLINK_MSG_ID_TERRAIN_CHECK:
        copter.terrain.handle_data(chan, msg);
        break;
#endif
#if TOY_MODE_ENABLED
    case MAVLINK_MSG_ID_NAMED_VALUE_INT:
        copter.g2.toy_mode.handle_message(msg);
        break;
#endif
    default:
        GCS_MAVLINK::handle_message(msg);
        break;
    }
}
```

## 2. MAVLink 消息 ##

### 2.1. MAVLink 消息类型 ###

`MAVLink`不同消息类型，分配有不同的`msgid`，与`msgid`相应的，带有不同的子数据结构，以进行二次解析获取该类型消息的内容。常见消息类型有：

* 心跳消息（Heartbeat）：用于定期确认系统是否在线，并报告系统状态(如飞行模式、硬件状态等)。
* 遥测数据（Telemetry）：包括飞行数据、传感器数据、GPS位置、飞行状态等。
* 控制指令：如起飞、降落、飞行模式切换等控制命令。
* 传感器数据：包括加速度、陀螺仪、磁力计、气压计、GPS等传感器采集的数据。
* 状态报告：如电池电量、飞行器姿态、航向等系统状态信息。
* 日志和错误报告：用于记录系统日志信息，如飞行轨迹、错误码、事件日志等。

### 2.2. `MAVLink`消息的广播与路由 ###

有些类型的消息，包(packet)中包含`target_system`、`target_component`。如果`target_system`和`target_component`不为0，则该消息是定向发送给特定系统或组件的。`target_system`如果为0，则为广播消息，所有在线的系统都会收到这个消息。`target_component`如果为0，则为广播消息，同一个系统内的所有在线的组件都会收到这个消息。

飞控器的消息的路由，由类[MAVLink_routing](https://github.com/ArduPilot/ardupilot/blob/master/libraries/GCS_MAVLink/MAVLink_routing.h)处理。在内部，在接收到消息之后，根据发送方的`sysid`、`compid`，会存储一个`channel`（IP/PORT，串口号等）与(`target_system`, `target_component`)的映射。

具体路由的规则见[ArduPilot Development Site -- MAVLink Routing in ArduPilot](https://ardupilot.org/dev/docs/mavlink-routing-in-ardupilot.html)，以及[MAVLink Developer Guide -- Routing](https://mavlink.io/en/guide/routing.html)。

### 2.3. MAVLink 消息的确认与重传 ###

`MAVLink`协议支持消息的确认与重传机制。发送方在发送消息后，会等待接收方的确认响应。如果在一定时间内没有收到确认响应，发送方会重新发送该消息，直到收到确认或达到最大重试次数。

## 3. 资料 ##

* [MAVLink Wireshark抓包插件](https://github.com/nextpilot/nextpilot-flight-control/tree/43de1097f3f668c9d9a6b37dd5cf718f38e23e51/docs/develop/09.%E5%88%86%E6%9E%90%E8%B0%83%E8%AF%95)
