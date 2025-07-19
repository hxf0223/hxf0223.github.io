---
title: 使用 CMake CPack IFW 打包 Qt 应用
date: 2025-0-18 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cmake]
tags: [cmake, qt]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

```cmake

if(WIN32 AND NOT UNIX)
    get_target_property(qmake_executable Qt6::qmake IMPORTED_LOCATION)
    get_filename_component(_qt_bin_dir "${qmake_executable}" DIRECTORY)
    find_program(WINDEPLOYQT_EXECUTABLE windeployqt HINTS "${_qt_bin_dir}")
    message(STATUS "Using windeployqt: ${WINDEPLOYQT_EXECUTABLE}")
    message(STATUS "qt bin dir: ${_qt_bin_dir}")
    add_custom_command(TARGET ${target_name} POST_BUILD
        COMMAND "${WINDEPLOYQT_EXECUTABLE}"
        $<$<CONFIG:Debug>:--debug>
        $<$<NOT:$<CONFIG:Debug>>:--release>
        --libdir $<TARGET_FILE_DIR:${target_name}>
        --verbose 0
        --compiler-runtime
        --no-opengl-sw
        --force
        --plugindir "$<TARGET_FILE_DIR:${target_name}>/plugins"
        $<TARGET_FILE:${target_name}>
        COMMENT "Deploying Qt..."
    )

    if(QT_VERSION_MAJOR EQUAL 6)
        qt_finalize_executable(${target_name})
    endif()

    include(GNUInstallDirs)
    install(PROGRAMS
        $<TARGET_FILE:${target_name}>
        DESTINATION . # TYPE BIN
    )

    install(DIRECTORY
        $<TARGET_FILE_DIR:${target_name}>/
        DESTINATION .
        FILES_MATCHING PATTERN "*.dll"
    )

    # CPack
    # InstallRequiredSystemLibraries 以及选项
    # https://cmake.org/cmake/help/latest/module/InstallRequiredSystemLibraries.html
    set(CMAKE_INSTALL_SYSTEM_RUNTIME_DESTINATION TRUE)
    set(CMAKE_INSTALL_UCRT_LIBRARIES TRUE)
    set(CMAKE_INSTALL_SYSTEM_RUNTIME_DESTINATION ".")
    include(InstallRequiredSystemLibraries)

    set(CPACK_GENERATOR "IFW")
    set(CPACK_IFW_ROOT "D:/dev_libs/Qt/Tools/QtInstallerFramework/4.10")
    set(CPACK_PACKAGE_VERSION_MAJOR "1")
    set(CPACK_PACKAGE_VERSION_MINOR "0")

    # set human names to exetuables
    set(CPACK_PACKAGE_EXECUTABLES "${PROJECT_NAME}" "MAVLink Monitor installer")
    set(CPACK_CREATE_DESKTOP_LINKS "${PROJECT_NAME}")
endif()

include(CPACK)
include(CPackIFW)

```

编译完成之后，生成`CPackConfig.cmake`，在`build`目录下执行：

```bash
cpack.exe ./CPackConfig.cmake
```

## 参考 ##

* [Revisiting the Qt Installer Framework with CMake](https://www.ics.com/blog/revisiting-qt-installer-framework-cmake)
* [cmake-qt-packaging-example](https://github.com/miurahr/cmake-qt-packaging-example/blob/master/Packaging.cmake)
* [基于 CMake 的打包](https://sirlis.cn/posts/c-cmake-development/#4-%E5%9F%BA%E4%BA%8E-cmake-%E7%9A%84%E6%89%93%E5%8C%85)