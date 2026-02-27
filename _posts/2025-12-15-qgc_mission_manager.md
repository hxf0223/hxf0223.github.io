---
layout: post
title: QGC代码架构解析：MAVLink Mission Protocol，以及 QGC 航点管理
date: 2025-12-15 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [QGC]
tags: [QGC]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

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

### 1.1. 航点的上传/下载流程 ###

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

### 1.2. 航点消息结构：消息 MISSION_ITEM_INT，以及 MAV_CMD ###

航点不仅仅只有坐标等数据，还包含动作含义，即`MAV_CMD`其实是一个命令+参数数据。`MISSION_ITEM_INT`就是用于发送这些`MAV_CMD`子命令+参数的。`MAV_CMD`分为如下几类：

* `MAV_CMD_NAV_*`：导航类命令（起飞、降落、返回RTL、悬停、飞到指定航点位置），比如`MAV_CMD_NAV_WAYPOINT`表示普通航点，`MAV_CMD_NAV_LOITER_UNLIM`表示无限悬停等。
* `MAV_CMD_DO_*`：动作类命令，比如`MAV_CMD_DO_CHANGE_SPEED`表示改变速度，`MAV_CMD_DO_SET_RELAY`表示设置继电器等；
* `MAV_CMD_CONDITION_*`：命令执行条件，比如`MAV_CMD_CONDITION_DELAY`表示等待一段时间之后，再执行下一个航点`MAV_CMD`。从`Ardupilot`文档看，`MAV_CMD_CONDITION_*`命令是作用于`MAV_CMD_DO_*`命令，参考[Ardupilot -- Mission Commands -- Conditional commands](https://ardupilot.org/dev/docs/common-mavlink-mission-command-messages-mav_cmd.html#conditional-commands)。

主要的`MAV_CMD_NAV`命令列表：

| Command ID | Name                         | Description                               |
| ---------- | ---------------------------- | ----------------------------------------- |
| 16         | MAV_CMD_NAV_WAYPOINT         | Navigate to a specific waypoint           |
| 21         | MAV_CMD_NAV_LAND             | Land at the specified location            |
| 22         | MAV_CMD_NAV_TAKEOFF          | Take off and ascend to specified altitude |
| 20         | MAV_CMD_NAV_RETURN_TO_LAUNCH | Return to launch/home location            |
| 80         | MAV_CMD_NAV_ROI              | Sets region of interest for camera        |
| 82         | MAV_CMD_NAV_SPLINE_WAYPOINT  | Navigate using a spline path              |

所有`MAV_CMD`命令的完整列表，以及参数，可以参考`MAVLink`协议文档：[Commands (MAV_CMD)](https://mavlink.io/en/messages/common.html#mav_commands)。

### 1.3. 航点命令的参数：MISSION_ITEM_INT的参数：Frame（坐标系） ###

在使用`MISSION_ITEM_INT`消息发送航点命令(`Mission Item`)时（包括`MAV_CMD_NAV_*`命令，以及`MAV_CMD_DO_*`命令），需要指定坐标系`frame`，比如`WGS84`坐标系，`NED`坐标系，或者在`WGS84`坐标系的修改，如高度改为相对`HOME`点高度，或者地形高度。坐标系枚举定义见：[MAV_FRAME](https://mavlink.io/en/messages/common.html#MAV_FRAME)。

官方文档整理下来，有关`Frame`的描述，没有完全讲清楚，整个`MAVLink`协议中，有若干个命令使用到`Frame`作为参数。常见的需要使用到`Frame`的命令：

* `Mission Protocol`中少量`MAV_CMD_DO`。
* `COMMAND_INT`需要使用`Frame`作为命令参数：[Command Protocol](https://mavlink.io/en/services/command.html)。

根据文档描述，针对`MISSION_ITEM_INT`，目前`APM`以及`PX4`仅支持`global`类型的`Frame`，见文档描述[Mission Items (MAVLink Commands)](https://mavlink.io/en/services/mission.html#mavlink_commands)。另外，有少量的`MAV_CMD_DO`命令，里面也带有`frame`参数，很奇怪，有些混乱。

更多信息：

* [MAVLink -- Frames & Positional Information](https://mavlink.io/en/services/mission.html#frames-positional-information)
* [Ardupilot -- Navigation commands](https://ardupilot.org/dev/docs/common-mavlink-mission-command-messages-mav_cmd.html#navigation-commands)
* [MAVLink -- Commands (MAV_CMD)](https://mavlink.io/en/messages/common.html#mav_commands)
* [MAVLink -- MISSION_ITEM_INT (73)](https://mavlink.io/en/messages/common.html#MISSION_ITEM_INT)

### 1.4. 航点命令的参数：MISSION_ITEM_INT的参数：param1 ~ param7 ###

![MISSION_ITEM_INT_params](/assets/images/qgc/20251216/MISSION_ITEM_INT_params.png)

前四个参数`param1` ~ `param4`，具体含义，以及单位，由具体的`MAV_CMD`命令决定，且数据类型就是`float`，即如果是其他类型，需要`static_cast`转换为`float`。

针对`MAV_CMD_NAV`命令，则是坐标信息，其中`param5`、`param6`（经纬度）是全局坐标，即`1e7`。高度参数`param7`，其含义由`frame`指定（但应该全部都是`global`类型的），`global`坐标系列表：

* `MAV_FRAME_GLOBAL_INT`，
* `MAV_FRAME_GLOBAL_RELATIVE_ALT_INT`，
* `MAV_FRAME_GLOBAL_TERRAIN_ALT`，
* `MAV_FRAME_GLOBAL_TERRAIN_ALT_INT`，
* `MAV_FRAME_GLOBAL`。

另外，如果`frame`是`MAV_FRAME_MISSION`，表示这`param5` ~ `param7`不是坐标，所以实现发送/接收的时候，不需要将`param5` ~ `param7`乘以`1e7`。

根据协议，如果是`frame`的类型是`local`的，则发送/接收的时候`param5`、`param6`的精度应该是`1e4`，单位是米（参考协议文档[Frames & Positional Information](https://mavlink.io/en/services/mission.html#frames-positional-information)）。

**总结**：协议实现的时候：

* 如果`frame`是`MAV_FRAME_MISSION`：则`param5`、`param6`按原样发送值，可能需要`static_cast<int>`转换。
* 如果`frame`是`global`类型的：则`param5`、`param6`需要乘以`1e7`进行发送，接收时需要除以`1e7`。
* 如果`frame`是`local`类型的：则`param5`、`param6`需要乘以`1e4`进行发送，接收时需要除以`1e4`。
* 其他`param1` ~ `param4`，以及`param7`，按原样发送/接收，可能需要`static_cast<float>`转换。

另外，这个规则，应该也适用于`COMMAND_INT`命令[COMMAND_INT](https://mavlink.io/en/messages/common.html#COMMAND_INT)。且：

* 使用`COMMAND_INT`命令时，有些参数没有使用到，部分样例参考：[ardupilot -- Commands supported by Copter](https://ardupilot.org/copter/docs/common-mavlink-mission-command-messages-mav_cmd.html#commands-supported-by-copter)
* 这些浮点类型的参数，值`nan`也有有意义的，比如维持原值，具体搜索`QGC`代码中`qQNaN()`的使用地方。

### 1.5. 航点管理中其他命令/消息 ###

如下两个消息，用来监控航点执行进度及状态：

* `MISSION_CURRENT`：当前航点改变通知消息，由飞控广播，其他信息：序号`seq`，一起当前飞机航点状态，比如是否是暂停等。
* `MISSION_ITEM_REACHED`：与`MISSION_CURRENT`类似，`QGC`中没有处理该消息。

清除航点使用消息：`MISSION_CLEAR_ALL`。

## 2. QGC 航点管理实现 ##

`PlanManager`实现`Mission Protocol`的协议。由于`MAVLink v2`中将航点(`flight plans`)、地理围栏(`geofences`)、降落点(`rally/safe points`)都放在`Mission Protocol`中，在请求上传(`MISSION_COUNT`)/下载(`MISSION_REQUEST_INT`)，以及传输(`MISSION_ITEM_INT`)时，带有`MAV_MISSION_TYPE`字段，确定是哪种`Mission Type`，参考协议文档：[Mission Protocol -- Mission Types](https://mavlink.io/en/services/mission.html#mission_types)。

* `MissionManager`：拓展航点的协议`MAV_MISSION_TYPE_MISSION`的固件实现：主要实现`Ardupilot`相关的实现，以及一些功能。
* `GeoFenceManager`：实现`MAV_MISSION_TYPE_FENCE`。
* `RallyPointManager`：实现`MAV_MISSION_TYPE_RALLY`。

### 2.1. 航点协议上传/下载功能的实现 ###

`PlanManager`使用状态机实现上传/下载流程。定义一个`TransactionType_t`枚举，表示当前的事务类型，以及一个`AckType_t`表示期望的`ACK`类型：

```cpp
typedef enum {
    AckNone,            ///< State machine is idle
    AckMissionCount,    ///< MISSION_COUNT message expected
    AckMissionItem,     ///< MISSION_ITEM expected
    AckMissionRequest,  ///< MISSION_REQUEST is expected, or MISSION_ACK to end sequence
    AckMissionClearAll, ///< MISSION_CLEAR_ALL sent, MISSION_ACK is expected
    AckGuidedItem,      ///< MISSION_ACK expected in response to ArduPilot guided mode single item send
} AckType_t;

typedef enum {
    TransactionNone,
    TransactionRead,
    TransactionWrite,
    TransactionRemoveAll
} TransactionType_t;
```

请求下载入口函数：`PlanManager::loadFromVehicle`，请求上传入口函数：`PlanManager::writeMissionItems(const QList<MissionItem*>& missionItems)`。以及一个handle函数，用于处理收到的消息：

* `PlanManager::_handleMissionCount`：处理`MISSION_COUNT`消息（请求下载）；
* `PlanManager::_handleMissionItem`：处理`MISSION_ITEM_INT`消息（请求下载）；
* `PlanManager::_handleMissionRequestInt`：处理`MISSION_REQUEST_INT`消息（请求上传）；

`PlanManager`中，有两个函数处理`ACK`消息：`_handleMissionAck`，`_ackTimeout`，这两个函数驱动状态机的流转：判断`ACK`与请求步骤是否匹配，发送一下一个航点数据/请求下一个航点数据，以及结束流程。

### 2.2. 其他模块 ###

* `MissionItem`：表示单个航点数据结构，航点管理模块的基础数据类。
* `MissionController`：提供`QML`接口访问航点数据。
* `PlanMasterController`：航点管理模块的顶层控制类（入口），提供`QML`接口访问航点（`MissionController`）、电子围栏（`GeoFenceController`）、降落点（`RallyPointController`）。以及从文件中加载/保存（包含`kml`文件格式）。
* `MissionCommandTree`：提供`MAV_CMD`命令树结构，供`QML`界面使用。

### 2.3. 航点文件格式 ###

`QGC`中，航点文件格式使用`JSON`格式，文件扩展名为`.plan`，保存目录样例：

```text
C:\Users\Administrator\Documents\QGroundControl Daily\Missions
```

保存时，将航点数据、电子围栏数据、降落点数据，保存到同一个文件中。保存及加载函数入口：

```cpp
PlanMasterController::saveToJson();
MissionController::save(QJsonObject& json);

// 加载实现
bool _loadJsonMissionFileV2(const QJsonObject& json, QmlObjectListModel* visualItems, QString& errorString);
```

另外还可以导出/导入`kml`格式的航点文件，记录的字段格式有所不同，另外测试发现加载有些`BUG`。

航点有`SimpleItem`，以及`ComplexItem`，一个简单的航点文件样例：

```json
{
    "fileType": "Plan",
    "version": 1,
    "groundStation": "QGroundControl",
    "mission": {
        "cruiseSpeed": 5,
        "hoverSpeed": 3,
        "items": [
            {
                "AMSLAltAboveTerrain": null,
                "autoContinue": true,
                "command": 16,
                "frame": 3,
                "params": [0, 0, 0, null, 47.397742, 8.545594, 488],
                "type": "SimpleItem"
            },
            {
                "AMSLAltAboveTerrain": null,
                "autoContinue": true,
                "command": 16,
                "frame": 3,
                "params": [0, 0, 0, null, 47.397825, 8.545632, 488],
                "type": "SimpleItem"
            }
        ]
    }
}
```

有关航点文件格式的更多信息，参考`QGC`代码仓库文档：

* [Mission Command Tree](https://github.com/mavlink/qgroundcontrol/blob/master/docs/en/qgc-dev-guide/plan/mission_command_tree.md)
* [Plan File Format](https://github.com/mavlink/qgroundcontrol/blob/master/docs/en/qgc-dev-guide/file_formats/plan.md)

## 3. 参考文档 ##

* [MAVLink Mission Protocol](https://mavlink.io/en/services/mission.html)
* [Ardupilot -- Mission Commands](https://ardupilot.org/dev/docs/common-mavlink-mission-command-messages-mav_cmd.html)