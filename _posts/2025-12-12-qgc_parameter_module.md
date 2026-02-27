---
layout: post
title: QGC代码架构解析：MAVLink参数服务及QGC参数管理模块
date: 2025-12-12 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [QGC]
tags: [QGC]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

`MAVLink`参数服务网页：[Parameter Protocol](https://mavlink.io/en/services/parameter.html#parameter-protocol)

## 1. 微服务：Parameter Protocol ##

基本流程为请求->响应返回。请求/消息列表：

* `PARAM_REQUEST_LIST`：请求所有参数。随后远端会周期性发送所有参数，直到发送完毕。请求数据结构：
  * `target_system`（uint8_t）：System ID
  * `target_component`（uint8_t）：Component ID
* `PARAM_REQUEST_READ`：请求单个参数。请求数据结构：
  * `target_system`（uint8_t）：System ID
  * `target_component`（uint8_t）：Component ID
  * `param_id`（char[16]）：参数名称，与`param_index`二选一
  * `param_index`（int16_t）：参数索引（-1表示忽略）
* `PARAM_SET`：设置单个参数。请求数据结构：
  * `target_system`（uint8_t）：System ID
  * `target_component`（uint8_t）：Component ID
  * `param_id`（char[16]）：参数名称
  * `param_value`（float）：参数值
  * `param_type`（uint8_t）：参数数据类型枚举
* `PARAM_VALUE`：参数值响应。响应数据结构（系统ID以及组件ID在`mavlink_message_t`中）：
  * `param_id`（char[16]）：参数名称
  * `param_value`（float）：参数值
  * `param_type`（uint8_t）：参数数据类型枚举
  * `param_count`（uint16_t）：参数总数
  * `param_index`（uint16_t）：当前参数索引

**知识点总结**：

* 获取/设置所有子系统的参数：`target_component`设置为` MAV_COMP_ID_ALL`（QGC就是采取这种方式）。
* 参数响应消息中，带有参数总数和当前索引，`QGC`可以判断是否接收完毕。
* `param_value`有两种格式存储参数值：转换为`float`类型；或者直接按照原始数据复制到`param_value`域。`Ardupilot`直接使用`memcpy`的方式（小端）。`MAVLink`参数协议中，定义了相应的标志位，表示使用哪种方式存储。
* 当`QGC`发送设置命令`PARAM_SET`之后，飞机端会返回一个`PARAM_VALUE`消息作为确认：[Parameter Protocol -- Write Parameters](https://mavlink.io/en/services/parameter.html#write)。
* `PX4`固件支持缓存机制，即通过返回名称为`PARAM_HASH`，值为哈希值的`PARAM_VALUE`消息，确认参数没有变化：[Parameter Protocol -- PX4](https://mavlink.io/en/services/parameter.html#px4)。
* 设置参数非法等原因导致飞机拒绝设置时，飞机端返回`STATUS_TEXT`消息。

### 1.1. 参数存储代码示例 ###

```cpp
// 定义如下结构体，适用于原始字节流存储参数值（Bytewise）
// https://github.com/mavlink/c_library_v2/blob/master/mavlink_types.h
MAVPACKED(
typedef struct param_union {
	union {
		float param_float;
		int32_t param_int32;
		uint32_t param_uint32;
		int16_t param_int16;
		uint16_t param_uint16;
		int8_t param_int8;
		uint8_t param_uint8;
		uint8_t bytes[4];
	};
	uint8_t type;
}) mavlink_param_union_t;
```

```cpp
mavlink_param_union_t param;
int32_t integer = 20000;
param.param_int32 = integer;
param.type = MAV_PARAM_TYPE_INT32;

// Then send the param by providing the float bytes to the send function
mavlink_msg_param_set_send(xxx, xxx, param.param_float, param.type, xxx);
```

### 1.2. 协议限制及缺陷 ###

* 没有同步保证一致性机制，即发送修改命令，飞机端的参数可能已经更新了，跟`QGC`不一样了。安全的方式是：设置时，`QGC`将修改前的值带入，让飞机端进行比较。
* 如果有多个关联参数需要一起设置的，没有原子操作机制。

新增的服务`Extended Parameter Protocol`，数据类型可以支持`uint64_t`以及字节流：

```cpp
MAVPACKED(
typedef struct {
    union {
        float       param_float;
        double      param_double;
        int64_t     param_int64;
        uint64_t    param_uint64;
        int32_t     param_int32;
        uint32_t    param_uint32;
        int16_t     param_int16;
        uint16_t    param_uint16;
        int8_t      param_int8;
        uint8_t     param_uint8;
        uint8_t     bytes[MAVLINK_MSG_PARAM_EXT_SET_FIELD_PARAM_VALUE_LEN];
    };
    uint8_t type;
}) param_ext_union_t;
```

* [Extended Parameter Protocol](https://mavlink.io/en/services/parameter_ext.html)
* [github -- mavlink-devguide: Extended Parameter Protocol](https://github.com/mavlink/mavlink-devguide/blob/master/zh/services/parameter_ext.md)

### 1.3. 资料 ###

* [github -- PX4 Drone Autopilot](https://github.com/PX4/PX4-Autopilot)

## 2. QGC参数管理模块 ##

参数管理模块`ParameterManager`主要提供参数的请求，缓存功能，以及参数的设置功能。以及对外提供参数访问接口（参数管理模块不直接对UI层提供参数列表，由各个`AutoPilotPlugin`中各个部件模块提供比较合理），故参数模块应该作为一个公共模块，提供给`plugin`使用。另外，还提供了离线参数加载功能，离线参数文件定义在`FirmwarePlugin`中。

下载的参数，存储在成员变量`_mapCompId2FactMap`中：

```cpp
QMap<int /* comp id */, QMap<QString /* parameter name */, Fact*>> _mapCompId2FactMap;
```

缓存的文件名格式为`<系统ID>_<组件ID>.v2`，存储目录定义在`ParameterManager::parameterCacheDir()`中。参数存储格式为：

```cpp
typedef QPair<int /* FactMetaData::ValueType_t */, QVariant /* Fact::rawValue */> ParamTypeVal;
typedef QMap<QString /* parameter name */, ParamTypeVal> CacheMapName2ParamTypeVal;

// 展开之后为
// QMap<QString, std::pair<int, QVariant>>
// 即 QMap<参数名称, <参数类型枚举, 参数值>>
```

### 2.1. 参数请求 ###

在`QGC`初始化时，请求所有参数：

* 从网站（不是飞控）下载参数文件，仅针对`APM`固件，入口：`APMAirframeComponentController::loadParameters`；
* 使用`FTP`从飞控下载参数文件，入口函数`refreshAllParameters`；
* 通过参数服务请求参数，入口函数`refreshAllParameters`。

请求完成之后，都需要调用`_checkInitialLoadComplete`。

在`ParameterManager`中，跟请求相关的主要的数据结构定义：

```cpp
QMap<int, int> _paramCountMap;                              ///< Key: Component id, Value: count of parameters in this component
QMap<int, QMap<int, int>> _waitingReadParamIndexMap;        ///< Key: Component id, Value: Map { Key: parameter index still waiting for, Value: retry count }
QMap<int, QList<int>> _failedReadParamIndexMap;             ///< Key: Component id, Value: failed parameter index
```

### 2.2. 参数设置 ###

由于生成的参数列表，存在`_mapCompId2FactMap`中，及每个参数以`Fact`表示，使用`Fact`值变更的信号，设置单个参数。