---
title: QGC初始加载及状态机
date: 2025-12-13 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [QGC]
tags: [qgc]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

在收到飞机发来的心跳包后，消息发送给`MultiVehicleManager`，在manager中，检查组件ID是否是`MAV_COMP_ID_AUTOPILOT1`，以及`vehicleType`不是`GCS`等之后，会创建一个`Vehicle`对象，并进入初始化流程。

> `mavlink_message_t`中已经包含了`sysid`、`compid`信息。而心跳包`mavlink_heartbeat_t`中则包含了`vehicleType`、`firmwareType`等信息。

> 需要注意的是，与飞控通信中，组件ID是固定的：`MAV_COMP_ID_AUTOPILOT1`，即每个飞控的组件ID都是1。

飞机发现、创建及初始化流程如下图所示：
![qgc_vehicle_init](/assets/images/qgc/20251214/QGC-Vehicle-Discovery-and-Creation-Process.png)

主要初始流程入口在`InitialConnectStateMachine`中以状态机实现，且部分子流程也是以状态机实现（至多嵌套了三层状态机）：

> 由于获取信息需要使用同步方式，在`InitialConnectStateMachine`状态机中，使用回调方式处理应答，在回调中进入下一个处理阶段。

```cpp
static constexpr const StateMachine::StateFn _rgStates[] = {
    _stateRequestAutopilotVersion,
    _stateRequestStandardModes,
    _stateRequestCompInfo,
    _stateRequestParameters,
    _stateRequestMission,
    _stateRequestGeoFence,
    _stateRequestRallyPoints,
    _stateSignalInitialConnectComplete
};
```

## 1. 请求飞机版本信息(`MAVLINK_MSG_ID_AUTOPILOT_VERSION`) ##

主要获取飞机的编号、固件的`vender_id`、`product_id`，固件版本信息，以及`capabilities`（64位bitmask），`capabilities`相关枚举定义在`MAVLink`协议的`MAV_PROTOCOL_CAPABILITY`中。

## 2. 请求飞机标准模式(`MAVLINK_MSG_ID_AVAILABLE_MODES`) ##

主要获取飞机支持的标准模式。获取的模式列表用于设置给`FirmwarePlugin`，并在`Vehicle`中使用。

## 3. 请求组件信息 ##

由于这一步请求处理多个信息，整个处理放在单独的模块（源码文件）`ComponentInformationManager`中，且也使用状态机来实现：请求`General`数据、`Param`数据、`Events`数据、`Actuator`数据。`General`是指组件的信息（主要是飞控自身），而`Events`，`Actuator`不一定每个组件都有。

请求每个子分类数据，分为几个步骤（而是用状态机实现），在`RequestMetaDataTypeStateMachine`中实现：请求数据文件的地址`URI`（返回URI，以及CRC），根据URI请求`META`数据文件内容（具有缓存功能，所有比较CRC，不相等再请求），即数据类型描述文件。比如下一个步骤请求飞机的参数信息，就需要将请求到的参数生成`Fact`，而`Fact`的类型信息就来自于参数的`META`数据文件。

> `Events`是`MAVLink`协议中的一个系统事件和诊断机制，用于飞机端向地面站实时报告系统事件、警告和错误。相关文档：[Events Interface (WIP)](https://mavlink.io/en/services/events.html)。比如可能有如下事件：

```text
飞机端事件流：
    ├─ 电池低电量事件
    ├─ GPS 信号丢失事件
    ├─ IMU 过热警告
    ├─ 传感器校准失败
    ├─ 电机故障检测
    └─ 健康检查失败 (Health & Arming Checks)
```

### 3.1. META数据使用流程 ###

```text
┌─────────────────────────────────────────────────────────────┐
│           飞机端 (Autopilot)                                │
└─────────────────────────────────────────────────────────────┘
                       │
                       │ MAVLink
                       │
         ┌─────────────▼──────────────┐
         │ ComponentInformation       │
         │ ┌──────────────────────┐  │
         │ │ COMP_METADATA_TYPE  │  │
         │ │ _PARAMETER          │  │
         │ │ (JSON 文件 URI)     │  │
         │ └──────────────────────┘  │
         └─────────────┬──────────────┘
                       │ 下载 JSON
                       │
         ┌─────────────▼──────────────┐
         │ CompInfoParam.setJson()    │
         │ (解析 JSON 文件)           │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────────────────────┐
         │ FactMetaData::createFromJsonObject()       │
         │ (将 JSON 转换为 FactMetaData 对象)         │
         └─────────────┬──────────────────────────────┘
                       │
         ┌─────────────▼──────────────────────────────┐
         │ ParameterManager                          │
         │ _nameToMetaDataMap[paramName]             │
         │ (存储所有参数的元数据)                     │
         └─────────────────────────────────────────────┘
```

代码执行流程：

```cpp
// 1️⃣ 初始化连接时，请求参数的元数据
_stateRequestCompInfoEvents()
    └─► _requestTypeStateMachine.request(
            _compInfoMap[MAV_COMP_ID_AUTOPILOT1][COMP_METADATA_TYPE_PARAMETER]
        );

// 2️⃣ 下载 JSON 文件后，调用 setJson()
CompInfoParam::setJson(const QString& metadataJsonFileName)
{
    // 3️⃣ 解析 JSON 文件
    QJsonDocument jsonDoc = // 从文件读取
    QJsonArray rgParameters = jsonDoc["QGC_PARAMETERS"].toArray();
    
    // 4️⃣ 为每个参数创建 FactMetaData 对象
    for (QJsonValue parameterValue : rgParameters) {
        FactMetaData* newMetaData = 
            FactMetaData::createFromJsonObject(parameterValue.toObject(), ...);
        
        // 5️⃣ 存储到 map 中
        _nameToMetaDataMap[newMetaData->name()] = newMetaData;
    }
}

// 6️⃣ 后续使用时
FactMetaData* meta = _compInfoParam->factMetaDataForName("PARAM_NAME");
// 使用 meta 来验证、转换参数值
```

## 4. 请求系统参数列表 ##

这个步骤请求飞机的所有参数，使用`MAVLink`的微服务`Parameter Protocol`，在`QGC`的`ParameterManager`模块中实现，见上一篇`QGC代码架构解析：MAVLink参数服务及QGC参数管理模块`。

