// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "post-al-folio-模板定制修改总结",
        
          title: "al-folio 模板定制修改总结",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/al-folio-customization-summary/";
          
        },
      },{id: "post-al-folio-本地部署记录-ubuntu-24-04",
        
          title: "al-folio 本地部署记录（Ubuntu 24.04）",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/al-folio-local-deploy-ubuntu2404/";
          
        },
      },{id: "post-c-traits",
        
          title: "C++ Traits",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/C++-Traits/";
          
        },
      },{id: "post-道格拉斯-普克算法-douglas-peucker-algorithm",
        
          title: "道格拉斯-普克算法(Douglas–Peucker algorithm)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/%E9%81%93%E6%A0%BC%E6%8B%89%E6%96%AF-%E6%99%AE%E5%85%8B%E7%AE%97%E6%B3%95/";
          
        },
      },{id: "post-cmake支持库收集",
        
          title: "CMake支持库收集",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CMake%E6%94%AF%E6%8C%81%E5%BA%93/";
          
        },
      },{id: "post-qgc代码架构解析-飞行前检查-起飞条件",
        
          title: "QGC代码架构解析：飞行前检查（起飞条件）",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/QGC%E9%A3%9E%E8%A1%8C%E5%89%8D%E6%A3%80%E6%9F%A5/";
          
        },
      },{id: "post-qgc代码架构解析-mavlink-mission-protocol-以及-qgc-航点管理",
        
          title: "QGC代码架构解析：MAVLink Mission Protocol，以及 QGC 航点管理",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qgc_mission_manager/";
          
        },
      },{id: "post-ai工具收集-其他不分类工具收集-持续更新",
        
          title: "AI工具收集，其他不分类工具收集，持续更新",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/AI%E5%B7%A5%E5%85%B7%E6%94%B6%E9%9B%86/";
          
        },
      },{id: "post-qgc代码架构解析-qgc初始加载及状态机",
        
          title: "QGC代码架构解析：QGC初始加载及状态机",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qgc_init_load_states/";
          
        },
      },{id: "post-qgc代码架构解析-mavlink参数服务及qgc参数管理模块",
        
          title: "QGC代码架构解析：MAVLink参数服务及QGC参数管理模块",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qgc_parameter_module/";
          
        },
      },{id: "post-qgc代码架构解析-firmwareplugin与autopilotplugin",
        
          title: "QGC代码架构解析：FirmwarePlugin与AutopilotPlugin",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qgc_firmwareplugin_autopilotplugin/";
          
        },
      },{id: "post-apm-pixhawk常用飞行模式",
        
          title: "APM/Pixhawk常用飞行模式",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/ardupilot-flight-modes/";
          
        },
      },{id: "post-ardupilot-笔记",
        
          title: "ArduPilot 笔记",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/ardupilot-notes/";
          
        },
      },{id: "post-内存模型-memory-model-从多处理器到高级语言",
        
          title: "内存模型(Memory Model)：从多处理器到高级语言",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/memory_model2/";
          
        },
      },{id: "post-再理解-std-condition-variable-条件变量",
        
          title: "再理解 std::condition_variable 条件变量",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/conditonal_variable/";
          
        },
      },{id: "post-使用-libevent-实现时间戳调度",
        
          title: "使用 libevent 实现时间戳调度",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/timestamp_schedule_using_libevent/";
          
        },
      },{id: "post-qml基础语法积累",
        
          title: "QML基础语法积累",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/QML%E7%AC%94%E8%AE%B0/";
          
        },
      },{id: "post-交叉编译-qt-5-15-2",
        
          title: "交叉编译 Qt 5.15.2",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cross_build_qt_arm64_linaro_7.5/";
          
        },
      },{id: "post-使用-c-template-构建一个通信用序列化反序列化模块",
        
          title: "使用 C++ template 构建一个通信用序列化反序列化模块",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/%E6%9E%84%E5%BB%BA%E4%B8%80%E4%B8%AA%E9%80%9A%E4%BF%A1%E7%94%A8%E5%BA%8F%E5%88%97%E5%8C%96%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96%E6%A8%A1%E5%9D%97/";
          
        },
      },{id: "post-static-cast-与-reinterpret-cast",
        
          title: "static_cast 与 reinterpret_cast",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/static_cast_vs_reinterpret_cast/";
          
        },
      },{id: "post-c-template-学习资料",
        
          title: "C++ template 学习资料",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cpp_template_study_res/";
          
        },
      },{id: "post-使用-cmake-cpack-nsis-打包-qt-应用",
        
          title: "使用 CMake CPack NSIS 打包 Qt 应用",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qt_cpack_nsis/";
          
        },
      },{id: "post-cmake-export-命令以及-install-命令",
        
          title: "CMake export 命令以及 install 命令",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cmake_export_and_install/";
          
        },
      },{id: "post-mavlink消息的打包和解包",
        
          title: "MAVLink消息的打包和解包",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/MAVLink_msg_pack_unpack/";
          
        },
      },{id: "post-mavlink协议",
        
          title: "MAVLink协议",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/MAVLink_intro/";
          
        },
      },{id: "post-qgc-笔记以及资料",
        
          title: "QGC 笔记以及资料",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/QGC%E7%AC%94%E8%AE%B0%E5%8F%8A%E8%B5%84%E6%96%99/";
          
        },
      },{id: "post-c-对象模型-多继承",
        
          title: "C++对象模型--多继承",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/C++%E5%AF%B9%E8%B1%A1%E6%A8%A1%E5%9E%8B-%E5%A4%9A%E7%BB%A7%E6%89%BF/";
          
        },
      },{id: "post-windows编译安装vtk-tcl-tk-occ",
        
          title: "Windows编译安装VTK, TCL/TK, OCC",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/windows-build-tcl-tk-occ/";
          
        },
      },{id: "post-系统监控工具套件sysstat的使用",
        
          title: "系统监控工具套件sysstat的使用",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/%E7%B3%BB%E7%BB%9F%E7%9B%91%E6%8E%A7%E5%B7%A5%E5%85%B7sysstat/";
          
        },
      },{id: "post-待翻译-performance-hints",
        
          title: "待翻译 -- Performance Hints",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Performance-Hints/";
          
        },
      },{id: "post-occ-待学习资料记录",
        
          title: "OCC 待学习资料记录",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/OCCT-study-notes/";
          
        },
      },{id: "post-nvidia-jetson-orin-agx-安装",
        
          title: "NVIDIA Jetson Orin AGX 安装",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/NVIDIA-Jetson-Orin-AGX-%E5%AE%89%E8%A3%85/";
          
        },
      },{id: "post-cuda-gemm-计算优化-软件流水及双缓存",
        
          title: "CUDA GEMM 计算优化：软件流水及双缓存",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA%E8%BD%AF%E4%BB%B6%E6%B5%81%E6%B0%B4%E5%8F%8A%E5%8F%8C%E7%BC%93%E5%AD%98/";
          
        },
      },{id: "post-使用-nsight-compute-进行-kernel-性能分析",
        
          title: "使用 Nsight Compute 进行 kernel 性能分析",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Nsight-Compute%E5%88%86%E6%9E%90/";
          
        },
      },{id: "post-gemm-版本1-使用-cute-实现一个-naive-gemm",
        
          title: "GEMM 版本1：使用 CuTe 实现一个 naive GEMM",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/GEMM1-Cute-naive-GEMM/";
          
        },
      },{id: "post-cutlass-cute-初步-6-pipeline",
        
          title: "CUTLASS-Cute 初步(6)：Pipeline",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A56-Pipeline/";
          
        },
      },{id: "post-cutlass-cute-初步-5-tv-layout",
        
          title: "CUTLASS-Cute 初步(5)：TV Layout",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A55-TV-Layout/";
          
        },
      },{id: "post-cutlass-cute-初步-4-swizzle",
        
          title: "CUTLASS-Cute 初步(4)：Swizzle",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A54-swizzle/";
          
        },
      },{id: "post-cutlass-cute-初步-3-1-tiledcopy-以及-tiledmma-配置示例",
        
          title: "CUTLASS-Cute 初步(3.1)：TiledCopy 以及 TiledMMA 配置示例",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A53.1-TileMMA%E9%85%8D%E7%BD%AE%E7%A4%BA%E4%BE%8B/";
          
        },
      },{id: "post-cutlass-cute-初步-3-tiledcopy-以及-tiledmma",
        
          title: "CUTLASS-Cute 初步(3)：TiledCopy 以及 TiledMMA",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A53-TiledCopy-TiledMMA/";
          
        },
      },{id: "post-cutlass-cute-初步-2-tensor-amp-layout-algebra",
        
          title: "CUTLASS-Cute 初步(2)：Tensor &amp; Layout Algebra",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A52-Tensor-Layout-Algebra/";
          
        },
      },{id: "post-cutlass-cute-初步-1-layout",
        
          title: "CUTLASS-Cute 初步(1)：Layout",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A51-Layout/";
          
        },
      },{id: "post-使用nsight-compute分析bank-conflict",
        
          title: "使用Nsight Compute分析Bank Conflict",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Nsight-Compute%E5%88%86%E6%9E%90bank-conflict/";
          
        },
      },{id: "post-cuda入门-bank-conflict",
        
          title: "CUDA入门：Bank Conflict",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA%E5%85%A5%E9%97%A8-Bank-Conflict/";
          
        },
      },{id: "post-cuda性能概述-影响因素及优化方法",
        
          title: "CUDA性能概述：影响因素及优化方法",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA%E6%80%A7%E8%83%BD%E6%A6%82%E8%BF%B0/";
          
        },
      },{id: "post-cuda-架构及对应的计算能力cc",
        
          title: "CUDA 架构及对应的计算能力CC",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA%E6%9E%B6%E6%9E%84%E5%8F%8A%E5%85%B6%E8%AE%A1%E7%AE%97%E8%83%BD%E5%8A%9BCC/";
          
        },
      },{id: "post-cuda-架构",
        
          title: "CUDA 架构",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA%E6%9E%B6%E6%9E%84/";
          
        },
      },{id: "post-c-右值引用-万能引用-完美转发",
        
          title: "C++ 右值引用，万能引用，完美转发",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cpp-rvalue/";
          
        },
      },{id: "post-linux-epoll",
        
          title: "linux epoll",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/epoll/";
          
        },
      },{id: "post-jekyll-chirpy-主题配置优化记录",
        
          title: "Jekyll Chirpy 主题配置优化记录",
        
        description: "记录 Jekyll Chirpy 主题从部署错误修复到功能优化的完整过程，包括 GitHub Actions 配置、数学公式渲染、目录展开等改进。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Jekyll-Chirpy%E4%B8%BB%E9%A2%98%E9%85%8D%E7%BD%AE%E4%BC%98%E5%8C%96%E8%AE%B0%E5%BD%95/";
          
        },
      },{id: "post-chirpy主题的安装与使用指南",
        
          title: "Chirpy主题的安装与使用指南",
        
        description: "搭建和使用本网页时找到或参考的各类指南和文档",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Chirpy%E6%A8%A1%E6%9D%BF%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97/";
          
        },
      },{id: "post-qemu-学习资料",
        
          title: "QEMU 学习资料",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qemu-study/";
          
        },
      },{id: "post-memory-segmentation-cheet-sheets",
        
          title: "Memory Segmentation Cheet Sheets",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/memory-segmentation-cheet-sheets/";
          
        },
      },{id: "post-std-pmr-内存池",
        
          title: "std::pmr -- 内存池",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/std-pmr-memory-pool/";
          
        },
      },{id: "post-c-面向对象三个概念-重载-覆盖和隐藏",
        
          title: "C++面向对象三个概念——重载、覆盖和隐藏",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cpp-override-overload-hide/";
          
        },
      },{id: "post-编译ffmpeg使能-nvidia-硬件解码",
        
          title: "编译FFMPEG使能 NVIDIA 硬件解码",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E7%BC%96%E8%AF%91FFMPEG%E4%BD%BF%E8%83%BDNvidia%E7%A1%AC%E4%BB%B6%E8%A7%A3%E7%A0%81/";
          
        },
      },{id: "post-gcc-向量化相关选项",
        
          title: "gcc 向量化相关选项",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/gcc-vectorize-options/";
          
        },
      },{id: "post-perf性能分析-7-top-down-分析方法",
        
          title: "perf性能分析(7) -- Top-down 分析方法",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-07-top-down-method/";
          
        },
      },{id: "post-c-中-auto-和-decltype-的用法-update-20241106",
        
          title: "C++ 中 auto 和 decltype 的用法 (update 20241106)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cpp-auto-and-decltype/";
          
        },
      },{id: "post-perf性能分析-6-perf实战-1-分支预测",
        
          title: "perf性能分析(6) -- perf实战(1) -- 分支预测",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-06-perf-practice-01/";
          
        },
      },{id: "post-perf性能分析-5-linux-perf-工具介绍",
        
          title: "perf性能分析(5) -- linux perf 工具介绍",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-05-perf-introduce/";
          
        },
      },{id: "post-perf性能分析-4-linux-perf-工具基本使用-1",
        
          title: "perf性能分析(4) -- linux perf 工具基本使用(1)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-04-perf-usage/";
          
        },
      },{id: "post-linux-性能及统计工具-1",
        
          title: "Linux 性能及统计工具 (1)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Linux-perf-stat-commands/";
          
        },
      },{id: "post-有用的-gcc-编译选项收集",
        
          title: "有用的 GCC 编译选项收集",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E6%9C%89%E7%94%A8%E7%9A%84GCC%E7%BC%96%E8%AF%91%E9%80%89%E9%A1%B9%E6%94%B6%E9%9B%86/";
          
        },
      },{id: "post-内存分析需要理解的几个概念",
        
          title: "内存分析需要理解的几个概念",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Linux-%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86%E8%A6%81%E7%90%86%E8%A7%A3%E7%9A%84%E6%A6%82%E5%BF%B5/";
          
        },
      },{id: "post-perf性能分析-3-intel-vtune-配合-linux-perf-使用",
        
          title: "perf性能分析(3) -- Intel VTune 配合 linux perf 使用",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-03-Intel-VTune-and-perf-usage-03/";
          
        },
      },{id: "post-perf性能分析-2-intel-vtune-配置与使用-2",
        
          title: "perf性能分析(2) -- Intel VTune 配置与使用(2)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-02-Intel-VTune-usage-02/";
          
        },
      },{id: "post-给-shared-ptr-添加自定义-deleter-的几种方式",
        
          title: "给 shared_ptr 添加自定义 deleter 的几种方式",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/shared_ptr-deleters-usage/";
          
        },
      },{id: "post-perf性能分析-1-intel-vtune-配置与使用-1",
        
          title: "perf性能分析(1) -- Intel VTune 配置与使用(1)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-01-Intel-VTune/";
          
        },
      },{id: "post-plugin-的创建及使用",
        
          title: "Plugin 的创建及使用",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Plugin-Boost-DLL/";
          
        },
      },{id: "post-性能优化学习资料",
        
          title: "性能优化学习资料",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99/";
          
        },
      },{id: "post-stl-图解",
        
          title: "STL 图解",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/STL%E5%9B%BE%E8%A7%A3/";
          
        },
      },{id: "post-c-11-新特性",
        
          title: "C++11 新特性",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/C++11%E6%96%B0%E7%89%B9%E6%80%A7/";
          
        },
      },{id: "post-opencl-buffer-objects",
        
          title: "OpenCL Buffer Objects",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OpenCL-Buffer-Objects/";
          
        },
      },{id: "post-opencl-学习资源",
        
          title: "OpenCL 学习资源",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OpenCL-Learn-Resources/";
          
        },
      },{id: "post-opencl-同步操作",
        
          title: "OpenCL 同步操作",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OpenCL-Synchronization/";
          
        },
      },{id: "post-opencl-平台模型-执行模型",
        
          title: "OpenCL 平台模型、执行模型",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OpenCL-model/";
          
        },
      },{id: "post-git加速资源",
        
          title: "Git加速资源",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/git%E5%8A%A0%E9%80%9F%E8%B5%84%E6%BA%90/";
          
        },
      },{id: "post-总结-git-不常用命令",
        
          title: "总结：git 不常用命令",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/git-commands/";
          
        },
      },{id: "post-opencl-端编程流程及主要概念实践",
        
          title: "OpenCL 端编程流程及主要概念实践",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OpenCL-basic-coding-flow/";
          
        },
      },{id: "post-使用-ffmpeg-从视频中提取音频",
        
          title: "使用 FFmpeg 从视频中提取音频",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/get-audio-from-vidio-using-ffmpeg/";
          
        },
      },{id: "post-windows-环境编译-vtk",
        
          title: "Windows 环境编译 VTK",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/building-vtk-under-windows/";
          
        },
      },{id: "post-spdlog-使用",
        
          title: "spdlog 使用",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/spdlog-usage/";
          
        },
      },{id: "post-mesh-及相关开源仓库收集",
        
          title: "Mesh 及相关开源仓库收集",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/mesh-tools/";
          
        },
      },{id: "post-总结-using-几种使用场景",
        
          title: "总结：using 几种使用场景",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/keywork-using-of-cpp/";
          
        },
      },{id: "post-复习-rvo-nrvo-and-std-move",
        
          title: "复习：RVO NRVO and std::move",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/RVO-NRVO-and-std_move/";
          
        },
      },{id: "post-crtp-使用笔记",
        
          title: "CRTP：使用笔记",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/CRTP-introduce/";
          
        },
      },{id: "post-intel-tbb-并行计算",
        
          title: "Intel TBB 并行计算",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/intel-tbb-paralle/";
          
        },
      },{id: "post-信号处理资料-butterworth-和-chebyshev-滤波器",
        
          title: "信号处理资料：Butterworth 和 Chebyshev 滤波器",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/dsp-filter-butterworth-and-chebyshev/";
          
        },
      },{id: "post-使用-mmap-读取文件",
        
          title: "使用 mmap 读取文件",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/read-file-using-mmap/";
          
        },
      },{id: "post-range-v3-用法积累-及资料",
        
          title: "Range-v3 用法积累，及资料",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/c++-range-v3/";
          
        },
      },{id: "post-总结-内存访问优化",
        
          title: "总结：内存访问优化",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cpp-perf-repos/";
          
        },
      },{id: "post-聚类算法-密度-基于-nano-flann",
        
          title: "聚类算法（密度）：基于 nano-flann",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/density-algrithm-knn/";
          
        },
      },{id: "post-ubuntu-安装-opencv",
        
          title: "Ubuntu 安装 OpenCV",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/ubuntu-install-opencv/";
          
        },
      },{id: "post-cmake-检查系统和编译器",
        
          title: "CMake 检查系统和编译器",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cmake-check-system-andcompiler/";
          
        },
      },{id: "post-备份-ubuntu-bash-alias-以及-bash-显示-git-status",
        
          title: "备份：Ubuntu Bash Alias, 以及 bash 显示 git status",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/ubuntu-bash-alias/";
          
        },
      },{id: "post-随机一致性抽样算法-ransac",
        
          title: "随机一致性抽样算法（RANSAC）",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/RANSAC/";
          
        },
      },{id: "post-intel-tbb-malloc-使用-windows",
        
          title: "Intel TBB malloc 使用 (windows)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/intel-tbb-malloc-usage/";
          
        },
      },{id: "post-复习-std-function-用法笔记",
        
          title: "复习：std::function 用法笔记",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/std-function/";
          
        },
      },{id: "post-整理-内存一致模型",
        
          title: "整理：内存一致模型",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E6%95%B4%E7%90%86-%E5%A4%84%E7%90%86%E5%99%A8%E5%86%85%E5%AD%98%E6%A8%A1%E5%9E%8B/";
          
        },
      },{id: "post-总结-mmu-包括-tlb-以及-table-walk-unit-以及内存-page-table",
        
          title: "总结：MMU -- 包括 TLB 以及 Table Walk Unit ，以及内存 Page Table",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/mmu-tlb-table-walk-unit-page-table/";
          
        },
      },{id: "post-自定义-operator-new-placement-new-以及释放内存",
        
          title: "自定义 operator new， placement new，以及释放内存",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/operator-new-placement-new/";
          
        },
      },{id: "post-学术绘图工具-engauge-digitizer",
        
          title: "学术绘图工具 -- Engauge Digitizer",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Academic-plot-tools/";
          
        },
      },{id: "post-opencl-环境准备及资料",
        
          title: "OpenCL 环境准备及资料",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/openCL-Install-and-Resources/";
          
        },
      },{id: "post-redis常用命令总结",
        
          title: "Redis常用命令总结",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/redis-commands/";
          
        },
      },{id: "post-在-markdown-中使用数学公式",
        
          title: "在 Markdown 中使用数学公式",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E5%9C%A8Markdown%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F/";
          
        },
      },{id: "post-markdown-使用笔记",
        
          title: "Markdown 使用笔记",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Markdown%E8%AF%AD%E6%B3%95%E7%AC%94%E8%AE%B0/";
          
        },
      },{id: "post-使用inotify监控文件目录中的文件变化-新建文件",
        
          title: "使用inotify监控文件目录中的文件变化（新建文件）",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/monitor-files-change-in-dir-using-inotify/";
          
        },
      },{id: "post-总结-使用-gperftools-进行性能分析",
        
          title: "总结：使用 gperftools 进行性能分析",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/gperf-tools/";
          
        },
      },{id: "post-cmake-编写findpackage-模块",
        
          title: "CMake 编写FindPackage 模块",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cmake-find_package/";
          
        },
      },{id: "post-简单线程安全队列",
        
          title: "简单线程安全队列",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/simple-thread-safe-queue/";
          
        },
      },{id: "post-使能-c-程序的核心转储",
        
          title: "使能 C++ 程序的核心转储",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/enable-core-dump-for-cpp/";
          
        },
      },{id: "post-python-venv-环境搭建及-vscode-环境配置",
        
          title: "Python venv 环境搭建及 VSCode 环境配置",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode%E8%BF%9B%E8%A1%8CPython%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E8%AE%BE%E7%BD%AE/";
          
        },
      },{id: "post-nginx-用户的权限配置",
        
          title: "nginx 用户的权限配置",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/nginx-autho-config/";
          
        },
      },{id: "post-vscode-remote-ssh-免密登陆",
        
          title: "VSCode Remote SSH 免密登陆",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode-remotessh-%E5%85%8D%E5%AF%86%E7%99%BB%E9%99%86/";
          
        },
      },{id: "post-opengl-流水线-待消化吸收",
        
          title: "OpenGL 流水线（待消化吸收）",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/opengl-pipeline/";
          
        },
      },{id: "post-occ-boolean-operations",
        
          title: "OCC boolean operations",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OCCT-boolean-ops/";
          
        },
      },{id: "post-windows下安装-msmpi",
        
          title: "Windows下安装 MSMPI",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/windows-install-msmpi/";
          
        },
      },{id: "post-基于vtk的3d软件",
        
          title: "基于VTK的3D软件",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/vtk-based-3d-software/";
          
        },
      },{id: "post-opengl-vulkan-学习网站-记录",
        
          title: "OpenGL/Vulkan 学习网站（记录）",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/opengl-vulkan%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99/";
          
        },
      },{id: "post-为什么要使用-std-enable-shared-from-this-以及使用场景",
        
          title: "为什么要使用 std::enable_shared_from_this，以及使用场景",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%BF%E7%94%A8enable_shared_from_this/";
          
        },
      },{id: "post-std-shared-ptr-线程安全及性能考量",
        
          title: "std::shared_ptr 线程安全及性能考量",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/shared_ptr_thread_safe/";
          
        },
      },{id: "post-系统设计资料-以及23种设计模式彩图",
        
          title: "系统设计资料，以及23种设计模式彩图",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/design-patterns-23/";
          
        },
      },{id: "post-c-实现一个简洁的-lru-缓存",
        
          title: "C++实现一个简洁的 LRU 缓存",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cpp%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AALRU/";
          
        },
      },{id: "post-pod-trivial-copyable-standard-layout",
        
          title: "POD、trivial copyable，standard layout",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cpp11-pod-type/";
          
        },
      },{id: "post-cmake-创建自定义目标-在构建前复制文件",
        
          title: "CMake 创建自定义目标：在构建前复制文件",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cmake-create-custom-target-copy-files-before-build/";
          
        },
      },{id: "post-opencascade拓扑与几何的关系",
        
          title: "OpenCascade拓扑与几何的关系",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Topology-and-Geometry-in-Open-CASCADE/";
          
        },
      },{id: "post-我的vscode插件清单",
        
          title: "我的VSCode插件清单",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode%E6%94%B9%E7%94%A8MathJax%E6%B8%B2%E6%9F%93%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F/";
          
        },
      },{id: "post-我的vscode插件清单",
        
          title: "我的VSCode插件清单",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode%E6%8F%92%E4%BB%B6%E6%B8%85%E5%8D%95/";
          
        },
      },{id: "post-vscode-开发-使能powershell-git自动完成",
        
          title: "VSCode 开发，使能PowerShell Git自动完成",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode%E4%BD%BF%E8%83%BDPowerShell-Git%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90/";
          
        },
      },{id: "post-vscode-开发-powershell-高效操作设置",
        
          title: "VSCode 开发，PowerShell 高效操作设置",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode-PowerShell%E9%AB%98%E6%95%88%E5%BC%80%E5%8F%91%E8%AE%BE%E7%BD%AE/";
          
        },
      },{id: "post-qt-笔记及开源库收集",
        
          title: "Qt 笔记及开源库收集",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/qt-notes/";
          
        },
      },{id: "post-linux系统及编译相关笔记",
        
          title: "Linux系统及编译相关笔记",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/linux-and-compile-notes/";
          
        },
      },{id: "post-如何使用-github-pages-以及-chirpy-theme-创建博客",
        
          title: "如何使用 github pages 以及 Chirpy Theme 创建博客",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/how-to-create-blog-using-github-pages-and-Chirpy-theme/";
          
        },
      },{id: "post-ubuntu-24-04-分区-以及更换-kernel-6-18",
        
          title: "Ubuntu 24.04 分区，以及更换 kernel 6.18",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Ubuntu%E5%AE%89%E8%A3%85%E6%96%B0%E7%89%88%E6%9C%ACkernel/";
          
        },
      },{id: "post-c-17-新功能-std-visit-和-std-variant-配合使用-待更新删除冗余描述",
        
          title: "C++ 17 新功能： std::visit 和 std::variant 配合使用 (待更新删除冗余描述)",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/combind-usage-of-std-visit-and-std-variant/";
          
        },
      },{id: "post-vtk-笔记",
        
          title: "VTK 笔记",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/vtk-notes/";
          
        },
      },{id: "post-linux-系统console使用命令清屏",
        
          title: "Linux 系统console使用命令清屏",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/clean-screen-and-reset/";
          
        },
      },{id: "post-vtkunstructuredgrid-显示-hdf5-数据",
        
          title: "vtkUnstructuredGrid 显示 HDF5 数据",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/show-hdf5-data-using-vtkUnstructuredGrid/";
          
        },
      },{id: "post-linux-系统下编译-gcc-9-2",
        
          title: "Linux 系统下编译 gcc 9.2",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/compile-gdb-commands/";
          
        },
      },{id: "post-occt-使用-bvh-树加速-bounding-box-查找遍历",
        
          title: "OCCT 使用 BVH 树加速 bounding box 查找遍历",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/OCCT-BHV-tree-bounding-box/";
          
        },
      },{id: "post-occ-topexp-explorer-用法",
        
          title: "OCC TopExp_Explorer 用法",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/OCCT-explore-api-usage/";
          
        },
      },{id: "post-occ-boundding-box-以及-distance",
        
          title: "OCC boundding box 以及 distance",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/OCCT-bounding-box/";
          
        },
      },{id: "post-ubuntu-及-windows-系统下安装-qt5",
        
          title: "Ubuntu 及 Windows 系统下安装 Qt5",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/install-qt5-on-ubuntu-windows/";
          
        },
      },{id: "post-ubuntu-安装vncserver及使用",
        
          title: "Ubuntu 安装VNCServer及使用",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/Ubuntu-install-VNCServer/";
          
        },
      },{id: "post-从makefile创建compile-commands-json",
        
          title: "从Makefile创建compile_commands.json",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/Create_CompileDB_from_Makefile/";
          
        },
      },{id: "post-ubuntu-编译-qt-vtk-occt-samples",
        
          title: "Ubuntu 编译 Qt + VTK + OCCT + samples",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/OCCT-build-with-samples/";
          
        },
      },{id: "post-vtk学习资源收集",
        
          title: "VTK学习资源收集",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/VTK-official-examples/";
          
        },
      },{id: "post-kill信号不同分类的影响",
        
          title: "kill信号不同分类的影响",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/kill-signals-of-linux-system/";
          
        },
      },{id: "post-bash参数特殊变量符号",
        
          title: "Bash参数特殊变量符号",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/bash-args-and-special-symbols/";
          
        },
      },{id: "post-ubuntu-安装-occt",
        
          title: "Ubuntu 安装 OCCT",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/Ubuntu-install-OCCT/";
          
        },
      },{id: "post-occt-projects-on-github",
        
          title: "OCCT projects on github",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/OCCT-sample-projects/";
          
        },
      },{id: "post-ubuntu-下载资源",
        
          title: "Ubuntu 下载资源",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/ubuntu-iso-download/";
          
        },
      },{id: "post-ubuntu-系统安装-llvm-套件-可选择版本",
        
          title: "Ubuntu 系统安装 LLVM 套件 （可选择版本）",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/install-versioned-llvm-ubuntu/";
          
        },
      },{id: "post-通过函数指针地址找到函数",
        
          title: "通过函数指针地址找到函数",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/get-function-via-address/";
          
        },
      },{id: "post-写给大家看的设计模式",
        
          title: "写给大家看的设计模式",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/design-modes-for-all/";
          
        },
      },{id: "post-python与c-混合调试",
        
          title: "Python与C++混合调试",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/debug-combind-Python-and-C++/";
          
        },
      },{id: "post-收藏-c-代码仓库-cpu-amp-性能资料",
        
          title: "收藏：C++ 代码仓库，CPU &amp; 性能资料",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/cpu_and_perf_study_docs_collections/";
          
        },
      },{id: "post-c-学习资源-及-代码片段积累",
        
          title: "C++ 学习资源 及 代码片段积累",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/cpp-code-snippet/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%68%78%66%30%32%32%33@%68%6F%74%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/hxf0223", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-cnblogs',
        title: 'Cnblogs',
        section: 'Socials',
        handler: () => {
          window.open("https://www.cnblogs.com/vaughnhuang", "_blank");
        },
      },{
        id: 'social-zhihu',
        title: 'Zhihu',
        section: 'Socials',
        handler: () => {
          window.open("https://www.zhihu.com/people/rias_cims", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
