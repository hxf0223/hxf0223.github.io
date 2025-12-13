---
title: QGC代码架构解析：MAVLink参数服务及QGC参数管理模块
date: 2025-12-12 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [qgc]
tags: [qgc]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
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

### 1.3. 资料 ###

* [github -- PX4 Drone Autopilot](https://github.com/PX4/PX4-Autopilot)

## 2. QGC参数管理模块 ##

