---
layout: post
title: MAVLink消息的打包和解包
date: 2025-06-06 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [QGC]
tags: [QGC, MAVLink]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

以心跳包为例，消息格式定义在`common.xml`中。

## 1. 打包 ##

心跳包的打包函数为`mavlink_msg_heartbeat_encode`，将`heartbeat`作为`msg`的`payload`，并计算`MAVLink`消息的其余域，即完成填充所有内容到`msg`中。

```c++
static inline uint16_t mavlink_msg_heartbeat_encode(uint8_t system_id, uint8_t component_id, mavlink_message_t* msg, const mavlink_heartbeat_t* heartbeat) {
    return mavlink_msg_heartbeat_pack(system_id, component_id, msg, 
        heartbeat->type, heartbeat->autopilot, heartbeat->base_mode, heartbeat->custom_mode, heartbeat->system_status);
}
```

其他`msgid`消息类似，调用`mavlink_msg_xxx_encode`，并调用`mavlink_msg_xxx_pack`函数进行打包。其中`mavlink_msg_heartbeat_pack`函数首先将`mavlink_heartbeat_t`中的内容填充到`msg`的`payload`中，然后调用`mavlink_finalize_message`计算`MAVLink`消息的其余域，即完成填充所有内容到`msg`中。

```c++
static inline uint16_t mavlink_msg_heartbeat_pack(uint8_t system_id, uint8_t component_id, mavlink_message_t* msg,
                               uint8_t type, uint8_t autopilot, uint8_t base_mode, uint32_t custom_mode, uint8_t system_status)
{
#if MAVLINK_NEED_BYTE_SWAP || !MAVLINK_ALIGNED_FIELDS
    char buf[MAVLINK_MSG_ID_HEARTBEAT_LEN];
    _mav_put_uint32_t(buf, 0, custom_mode);
    _mav_put_uint8_t(buf, 4, type);
    _mav_put_uint8_t(buf, 5, autopilot);
    _mav_put_uint8_t(buf, 6, base_mode);
    _mav_put_uint8_t(buf, 7, system_status);
    _mav_put_uint8_t(buf, 8, 3);

        memcpy(_MAV_PAYLOAD_NON_CONST(msg), buf, MAVLINK_MSG_ID_HEARTBEAT_LEN);
#else
    mavlink_heartbeat_t packet;
    packet.custom_mode = custom_mode;
    packet.type = type;
    packet.autopilot = autopilot;
    packet.base_mode = base_mode;
    packet.system_status = system_status;
    packet.mavlink_version = 3;

        memcpy(_MAV_PAYLOAD_NON_CONST(msg), &packet, MAVLINK_MSG_ID_HEARTBEAT_LEN);
#endif

    msg->msgid = MAVLINK_MSG_ID_HEARTBEAT;
    return mavlink_finalize_message(msg, system_id, component_id, MAVLINK_MSG_ID_HEARTBEAT_MIN_LEN, MAVLINK_MSG_ID_HEARTBEAT_LEN, MAVLINK_MSG_ID_HEARTBEAT_CRC);
}
```

其中，包序号`seq`存储在内部数组`m_mavlink_status[]`对应`channel`中，每次`pack`操作之后，该`channel`对应的seq自增1。获取通道函数为：

```c++
mavlink_status_t* mavlink_get_channel_status(uint8_t chan);
```

最终，`mavlink_finalize_message`完成填充`msg`结构体除`payload`之外的所有域，包括计算得到的`crc`。

在`mavlink_finalize_message`的调用子函数中，还有两个操作涉及到`v1`和`v2`协议的处理：

* 在`v2`版本中，`payload`末尾进行0填充，通过调用`_mav_trim_payload`函数实现。
* 在`v2`版本中，如果需要进行`signing`操作，通过调用`mavlink_sign_packet`生成`signature`。

### 1.1. 消息的发送 ###

在封包完成之后，调用`mavlink_msg_to_send_buffer`函数将包转换为字节流，然后调用方就可以通过`TCP`/`UDP`等传输层发送了。

```c++
uint16_t mavlink_msg_to_send_buffer(uint8_t *buf, const mavlink_message_t *msg);
```

## 2. 解包 ##

每接收到一个字节，就需要调用`mavlink_frame_char`解包，并更新对应`channel`的`mavlink_status_t`结构体中的状态机（`parse_state`成员域），直到解析完最后一个字节（16位`CRC`的最后一个字节）。

```c++
uint8_t mavlink_frame_char(uint8_t chan, uint8_t c, mavlink_message_t* r_message, mavlink_status_t* r_mavlink_status)
{
    return mavlink_frame_char_buffer(mavlink_get_channel_buffer(chan),
        mavlink_get_channel_status(chan),
        c,
        r_message,
        r_mavlink_status);
}
```

同样的，获取`mavlink_status_t`结构体的函数为`mavlink_get_channel_status`。

在`mavlink_frame_char_buffer`函数中，就是判断`mavlink_status_t`结构体中的状态（`parse_state`成员域）进行解析，并更细`parse_state`。在解析完一个完成的`mavlink_message_t`消息体之后，返回`MAVLINK_FRAMING_OK`表示完成一个数据包的解析，并填充外面给的参数`r_message`，以及`r_mavlink_status`。

## 2.1. 状态机流转图 ##

![mavlink_frame_char_buffer state flow](/assets/images/qgc/20250606/mavlink_frame_char_buffer_state_flow.png)

## 3. channel 与 system id ##

`MAVLink`协议中，`channel`和`system id`是两个不同的概念。关于`channel`概念，见官方文档[Multiple Streams ("channels")](https://mavlink.io/en/mavgen_c/#channels)。

* `channel`是指`MAVLink`消息的传输通道，每新建一个`TCP`/`UDP`/`串口`连接，即创建一个`channel`。可以理解为建立一个`UDP Address` + `port`，或一个`TCP Address` + `port`，就会创建一个`channel`。
* `system id`是标示不同的设备，比如地面站、飞控设备、以及其他设备。
* 一个`channel`可以对应多个`system id`，比如一个`channel`可以对应多个飞控设备。同时，一个`system id`也可以对应多个`channel`，比如一个地面站可以同时连接多个飞控设备。

在`QGC`中，`LinkInterface::_allocateMavlinkChannel`用于给一个传输层连接分配一个`channel`，根据`MAVLink`中的宏定义，一般容量为4个或16个。

## 4. 参考及资料 ##

* [mavlink（五）C库源码分析](https://www.cnblogs.com/hjx168/p/17737335.html)
* [Using C MAVLink Libraries (mavgen)](https://mavlink.io/en/mavgen_c/)