---
layout: post
title: CMake 编写FindPackage 模块
date: 2024-06-21 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [CMake]
tags: [Cpp, CMake]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

例如编写`CMake`查找模块，名称为 [Findgperftools.cmake](https://github.com/ceph/ceph/blob/main/cmake/modules/Findgperftools.cmake)，内容如下：

```cmake
# Try to find gperftools
# Once done, this will define
#
# gperftools_FOUND - system has Profiler
# GPERFTOOLS_INCLUDE_DIR - the Profiler include directories
# Tcmalloc_INCLUDE_DIR - where to find Tcmalloc.h
# GPERFTOOLS_TCMALLOC_LIBRARY - link it to use tcmalloc
# GPERFTOOLS_TCMALLOC_MINIMAL_LIBRARY - link it to use tcmalloc_minimal
# GPERFTOOLS_PROFILER_LIBRARY - link it to use Profiler
# TCMALLOC_VERSION_STRING
# TCMALLOC_VERSION_MAJOR
# TCMALLOC_VERSION_MINOR
# TCMALLOC_VERSION_PATCH

find_path(GPERFTOOLS_INCLUDE_DIR gperftools/profiler.h
  HINTS $ENV{GPERF_ROOT}/include)
find_path(Tcmalloc_INCLUDE_DIR gperftools/tcmalloc.h
  HINTS $ENV{GPERF_ROOT}/include)

if(Tcmalloc_INCLUDE_DIR AND EXISTS "${Tcmalloc_INCLUDE_DIR}/gperftools/tcmalloc.h")
  foreach(ver "MAJOR" "MINOR" "PATCH")
    file(STRINGS "${Tcmalloc_INCLUDE_DIR}/gperftools/tcmalloc.h" TC_VER_${ver}_LINE
      REGEX "^#define[ \t]+TC_VERSION_${ver}[ \t]+[^ \t]+$")
    string(REGEX REPLACE "^#define[ \t]+TC_VERSION_${ver}[ \t]+(\".)?([0-9]*)\"?$"
      "\\2" TCMALLOC_VERSION_${ver} "${TC_VER_${ver}_LINE}")
    unset(TC_VER_${ver}_LINE)
  endforeach()
  set(TCMALLOC_VERSION_STRING "${TCMALLOC_VERSION_MAJOR}.${TCMALLOC_VERSION_MINOR}")
  if(NOT TCMALLOC_VERSION_PATCH STREQUAL "")
    set(TCMALLOC_VERSION_STRING "${TCMALLOC_VERSION_STRING}.${TCMALLOC_VERSION_PATCH}")
  endif()
endif()

foreach(component tcmalloc tcmalloc_minimal profiler)
  string(TOUPPER ${component} COMPONENT)
  find_library(GPERFTOOLS_${COMPONENT}_LIBRARY ${component}
    HINTS $ENV{GPERF_ROOT}/lib)
  list(APPEND GPERFTOOLS_LIBRARIES GPERFTOOLS_${COMPONENT}_LIBRARY)
endforeach()

set(_gperftools_FIND_REQUIRED_VARS "GPERFTOOLS_INCLUDE_DIR")
if(gperftools_FIND_COMPONENTS)
  foreach(component ${gperftools_FIND_COMPONENTS})
    string(TOUPPER ${component} COMPONENT)
    list(APPEND _gperftools_FIND_REQUIRED_VARS "GPERFTOOLS_${COMPONENT}_LIBRARY")
  endforeach()
else()
  list(APPEND _gperftools_FIND_REQUIRED_VARS "GPERFTOOLS_LIBRARIES")
endif()

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(gperftools
  FOUND_VAR gperftools_FOUND
  REQUIRED_VARS ${_gperftools_FIND_REQUIRED_VARS}
  VERSION_VAR TCMALLOC_VERSION_STRING)

mark_as_advanced(${GPERFTOOLS_LIBRARIES} GPERFTOOLS_INCLUDE_DIR)

if(gperftools_FOUND)
  foreach(component tcmalloc tcmalloc_minimal profiler)
    if(NOT (TARGET gperftools::${component}))
      string(TOUPPER ${component} COMPONENT)
      add_library(gperftools::${component} UNKNOWN IMPORTED)
      set_target_properties(gperftools::${component} PROPERTIES
        INTERFACE_INCLUDE_DIRECTORIES "${GPERFTOOLS_INCLUDE_DIR}"
        IMPORTED_LINK_INTERFACE_LANGUAGES "CXX"
        IMPORTED_LOCATION "${GPERFTOOLS_${COMPONENT}_LIBRARY}")
    endif()
  endforeach()
  foreach(component tcmalloc tcmalloc_minimal)
    if(NOT (TARGET gperftools::${component}))
      set_target_properties(gperftools::${component} PROPERTIES
        INTERFACE_COMPILE_OPTIONS "-fno-builtin-malloc -fno-builtin-calloc -fno-builtin-realloc -fno-builtin-free")
    endif()
  endforeach()
endif()
```

在`CMakeLists.txt`中，如下使用：

```cmake
option(ENABLE_PROFILER "Enable google perftools" ON)
message(STATUS "ENABLE_PROFILER: ${ENABLE_PROFILER}")
if(ENABLE_PROFILER)
  set(CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/cmake;${CMAKE_MODULE_PATH}")
  find_package(Gperftools REQUIRED)
  set(PROFILER_LIBS ${GPERFTOOLS_PROFILER_LIBRARY})
  message(STATUS "PROFILER_LIBS: ${PROFILER_LIBS}")
  add_definitions("-DHAVE_PROFILER")
else()
  set(PROFILER_LIBS "")
endif()
```

## 参考

- [使用find_package引入外部依赖包](https://brightxiaohan.github.io/CMakeTutorial/FindPackage/)
- [CMakeLists.txt](https://github.com/heavyai/heavydb/blob/72c90bc290b79dd30240da41c103a00720f6b050/CMakeLists.txt#L968)

