---
layout: post
title: CMake export 命令以及 install 命令
date: 2025-06-11 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [CMake]
tags: [CMake]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. export 导出一个库 ##

`export`命令用于导出一个库，导出的库可以被其他项目使用。如下`cmake`命令生成库`gcFactSystem`，并导出库以及库的头文件（使用`PUBLIC`）。

```cmake
set(target_name "gcFactSystem")
# compile library gcFactSystem

# export library gcFactSystem to gcFactSystemConfig.cmake
target_include_directories(${target_name} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${CMAKE_CURRENT_SOURCE_DIR}/validator)
export(TARGETS ${target_name} FILE "${CMAKE_CURRENT_BINARY_DIR}/${target_name}Targets.cmake")
```

生成`gcFactSystemTargets.cmake`，里面包含了目标库，以及头文件包含路径：

```cmake
set_target_properties(gcFactSystem PROPERTIES
  INTERFACE_INCLUDE_DIRECTORIES "D:/work/ground_station/dev/jhatcgcs/src/FactSystem;D:/work/ground_station/dev/jhatcgcs/src/FactSystem/validator"
  INTERFACE_SOURCES "\$<\$<BOOL:\$<TARGET_PROPERTY:QT_CONSUMES_METATYPES>>:D:/work/ground_station/dev/jhatcgcs/build/src/FactSystem/meta_types/qt6gcfactsystem_debug_metatypes.json>"
)

set_target_properties(gcFactSystem PROPERTIES
  IMPORTED_IMPLIB_DEBUG "D:/work/ground_station/dev/jhatcgcs/bin/gcFactSystem.lib"
  IMPORTED_LINK_DEPENDENT_LIBRARIES_DEBUG "Qt6::Core;Qt6::Qml;gcLogging;gcMAVLink"
  IMPORTED_LOCATION_DEBUG "D:/work/ground_station/dev/jhatcgcs/bin/gcFactSystem.dll"
)
```

工程中的其他模块使用被`export`出来的库：

```cmake
target_link_libraries(${target_name} PRIVATE gcFactSystem)
```

## 2. install 安装库 ##

```cmake
# 引入要用到的 CMake 模块
include(CMakePackageConfigHelpers)
include(GNUInstallDirs)

# 基本安装及 Targets 文件的生成
install(TARGETS ${PROJECT_NAME}
  EXPORT ${PROJECT_NAME}-targets
  RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
  LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
  ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR}
  INCLUDES DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}
)

# Targets 文件的安装
install(EXPORT ${PROJECT_NAME}-targets
  FILE ${PROJECT_NAME}-targets.cmake
  NAMESPACE ${PROJECT_NAME}::
  DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/${PROJECT_NAME}
)

# Config 文件的导出（与安装？）
configure_package_config_file(
  ${PROJECT_SOURCE_DIR}/cmake/config.cmake.in
  ${PROJECT_BINARY_DIR}/${PROJECT_NAME}-config.cmake
  INSTALL_DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/${PROJECT_NAME}
)

# ConfigVersion 文件的导出
write_basic_package_version_file(
  ${PROJECT_NAME}-config-version.cmake
  VERSION ${PACKAGE_VERSION}
  COMPATIBILITY AnyNewerVersion
)

# Config 和 ConfigVersion 文件的安装
install(FILES
  ${PROJECT_BINARY_DIR}/${PROJECT_NAME}-config.cmake
  ${PROJECT_BINARY_DIR}/${PROJECT_NAME}-config-version.cmake
  DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/${PROJECT_NAME}
)

# 头文件的安装
install(DIRECTORY ${PROJECT_SOURCE_DIR}/include/${PROJECT_NAME} DESTINATION ${CMAKE_INSTALL_INCLUDEDIR})
```

### 2.1. config.cmake 的生成及安装 ###

生成`config.cmake`文件：

```cmake
include(CMakePackageConfigHelpers)

configure_package_config_file(
  ${PROJECT_SOURCE_DIR}/cmake/config.cmake.in
  ${PROJECT_BINARY_DIR}/${PROJECT_NAME}-config.cmake
  INSTALL_DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/${PROJECT_NAME}
)
```

安装`config.cmake`文件：

```cmake
install(FILES
  ${PROJECT_BINARY_DIR}/${PROJECT_NAME}-config.cmake
  ${PROJECT_BINARY_DIR}/${PROJECT_NAME}-config-version.cmake
  DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/${PROJECT_NAME}
)
```

### 2.2. 头文件的安装 ###

设置需要导出的头文件路径：

```cmake
target_include_directories(${PROJECT_NAME} PUBLIC ${${PROJECT_NAME}_INCLUDES})
```

设置导出文件更好的方式，区分`build`和`install`，分别引用不同路径下的include目录：

```cmake
target_include_directories(${PROJECT_NAME} PUBLIC
  $<BUILD_INTERFACE:${${PROJECT_NAME}_INCLUDES}> # 编译项目时引用项目下的头文件目录
  $<INSTALL_INTERFACE:include>  # 安装项目时引用 `<PREFIX>/include` ，比如 `/usr/include`
)
```

安装头文件：

```cmake
install(DIRECTORY ${PROJECT_SOURCE_DIR}/include/${PROJECT_NAME} DESTINATION ${CMAKE_INSTALL_INCLUDEDIR})
```

## 3. 参考 ##

* [CMake ——库的安装与导出](https://www.rayalto.org/2024/03/12/cmake-install-and-export/)
