---
title: QGC代码架构解析：MAVLink Mission Protocol，以及 QGC 航点管理
date: 2025-12-15 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [QGC]
tags: [QGC]

# 以下默认false
math: true
mermaid: true
# pin: true
---

本文厘清如下几个问题：

* 航点协议（`Mission Protocol`）有哪些命令/消息；
* 微服务的处理流程，以及流程中通信双方使用到的命令ID/请求ID-响应ID；
* 带参数的命令/消息，其参数格式，以及单位；
* 航点文件格式。

## 1. MAVLink Mission Protocol ##

航点协议主要实现航点集合的上传、下载、清除。另外有一些其他消息，以及附带的参数/枚举。

航点上传/下载使用到如下几个消息定义：

| 消息名称             | 说明               | 发送方      |
| -------------------- | ------------------ | ----------- |
| MISSION_REQUEST_LIST | 启动航点集下载动作 | 地面站      |
| MISSION_COUNT        | 航点数量           | 地面站/飞控 |
| MISSION_REQUEST_INT  | 请求航点           | 地面站/飞控 |
| MISSION_ITEM_INT     | 请求航点           | 飞控/地面站 |
| MISSION_ACK          | 航点响应           | 飞控/地面站 |

### 1.1. 航点的上传/下载 ###

航点上传/下载流程图（左边为QGC请求下载，右边为QGC请求上传）：

![航点上传下载流程图](/assets/images/qgc/20251216/mission_planner_flow_down_up.png)

对比发现规律：

* `QGC`请求下载时，使用`MISSION_REQUEST_LIST`来启动，而请求上传时，使用`MISSION_COUNT`来启动（**注意**：不论上传/下载，都是`QGC`发起的）；
* `MISSION_COUNT`既可以作为飞控响应`QGC`的下载请求，也可以作为`QGC`请求飞控上传航点的启动消息；
* 启动之后，中间航点的请求，双方使用`MISSION_REQUEST_INT` <--> `MISSION_ITEM_INT`配对，即一个完整的单个航点传输流程。航点发送方使用`MISSION_REQUEST_INT`请求，接收方使用`MISSION_ITEM_INT`响应。
* 最后使用`MISSION_ACK`作为**结束标示**。在这里，`ACK`消息的含义是结束，即整个流程结束了，这样理解更合理。
* 从文档看，`MISSION_ACK`只用在上传/下载流程里面。其他消息里面没有使用到。

上传/下载的流程，不具有对称性，给理解带来了一定的混乱。流程步骤在语义上理解也不顺畅。

#### 1.1.1. 协议实现注意事项 ####

* 在流程图的`Start timeout`处，需要实现超时重传机制：
  * `MISSION_REQUEST_LIST`超时没有响应，重传该命令若干次；
  * `MISSION_COUNT`超时没有响应，重传该命令若干次；
  * `MISSION_REQUEST_INT`超时没有响应，重传该命令若干次；
* `MISSION_REQUEST_INT`请求的航点，需要按序号顺序请求以及应答。如果收到的`MISSION_ITEM_INT`中的航点顺序不对，需要丢弃该航点数据，并重新请求。
* 当上传/下载航点时，飞机会返回一个`opaque_id`（类似整个航点集合计算得到的哈希），用于避免不不必要的再次上传/下载。当`QGC`上传时，飞机在最后一个消息返回该值：`MISSION_ACK.opaque_id`。当`QGC`下载时，飞机在`MISSION_COUNT`中返回该值：`MISSION_COUNT.opaque_id`。
* 当上传/下载的过程中失败时（对方提前返回`MISSION_ACK`并包含错误消息），`QGC`或者飞机应该终止当前流程，并恢复使用上一次的航点集。
* 协议没有说明，上传过程中，最后一步，如果飞机没有返回`MISSION_ACK`，应该如何处理。`QGC`的实际处理方式是，认为上传成功并完成，但是`opaque_id`没有更新。

#### 1.1.2. 航点消息结构：消息 MISSION_ITEM_INT，以及 MAV_CMD ####

航点不仅仅只有坐标等数据，还包含动作含义，即`MAV_CMD`其实是一个命令+参数数据。`MISSION_ITEM_INT`就是用于发送这些`MAV_CMD`子命令+参数的。`MAV_CMD`分为如下几类：

* `MAV_CMD_NAV_*`：导航类命令（起飞、降落、返回RTL、悬停、飞到指定航点位置），比如`MAV_CMD_NAV_WAYPOINT`表示普通航点，`MAV_CMD_NAV_LOITER_UNLIM`表示无限悬停等。
* `MAV_CMD_DO_*`：动作类命令，比如`MAV_CMD_DO_CHANGE_SPEED`表示改变速度，`MAV_CMD_DO_SET_RELAY`表示设置继电器等；
* `MAV_CMD_CONDITION_*`：命令执行条件，比如`MAV_CMD_CONDITION_DELAY`表示等待一段时间之后，再执行下一个航点`MAV_CMD`；

所有`MAV_CMD`命令的完整列表，以及参数，可以参考`MAVLink`协议文档：[Commands (MAV_CMD)](https://mavlink.io/en/messages/common.html#mav_commands)。

## 2. QGC 航点管理实现 ##

`QGC`中，有两个函数处理`ACK`消息：`_handleMissionAck`，`_ackTimeout`。