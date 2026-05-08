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
        },{id: "nav-搜索",
          title: "搜索",
          description: "搜索站内文章内容",
          section: "Navigation",
          handler: () => {
            window.location.href = "/search/";
          },
        },{id: "post-fast-dds入门-on-going",
        
          title: "Fast DDS入门（On-Going）",
        
        description: "1. Fast DDS功能模块TODO2. 发现协议发现协议类型枚举定义(include/fastdds/rtps/attributes/RTPSParticipantAttributes.hpp)：enum class DiscoveryProtocol{ NONE, /*!&amp;lt; NO discovery whatsoever would be used. Publisher and Subscriber defined with the same topic name would NOT be linked. All matching must be done manually through the addReaderLocator, addReaderProxy, addWriterProxy methods. */ SIMPLE, /*!&amp;lt; Discovery works according to &#39;The Real-time Publish-Subscribe Protocol(RTPS) DDS Interoperability Wire Protocol Specification&#39; */ EXTERNAL, /*!&amp;lt; A user...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/Fast-DDS%E5%85%A5%E9%97%A8/";
          
        },
      },{id: "post-nvidia-gpu-架构-sp-sm-与-lsu-工作原理详解",
        
          title: "NVIDIA GPU 架构：SP、SM 与 LSU 工作原理详解",
        
        description: "本文整理自 NVIDIA 开发者论坛的两个讨论帖，重点探讨 SM 内部功能执行单元（FMA / LSU 等）的调度模型，以及 Ampere 架构中 LSU（Load/Store Unit）的详细工作机制。以下内容主要来自 NVIDIA 工程师 Greg 以及资深版主 Robert Crovella 的回答。功能执行单元与 Warp-wide 调度GPU 中所有指令的调度都以 warp（32 个 thread） 为粒度。SM 内的每一类功能执行单元（functional unit）——包括 FMA 单元（即 CUDA Core）、LSU（LD/ST Unit）、Tensor Core 等——每个单元每周期只处理 1 条指令、1 个 thread。因此，要在单个时钟周期内完成一条 warp-wide 指令（涵盖 32 个 thread），就需要 32 个同类功能单元并行工作。以浮点乘加指令（FMUL/FMA）为例：如果希望一条 FMUL 在 1 个周期内完成整个 warp 的处理，就需要 32 个 FMA 单元同时工作，每个 FMA 单元负责 1 个...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/NVIDIA-GPU-SP-SM-LSU/";
          
        },
      },{id: "post-al-folio-模板定制修改总结",
        
          title: "al-folio 模板定制修改总结",
        
        description: "本文总结将 al-folio 模板 fork 到个人仓库后所做的全部定制修改，供后续维护参考。1. 站点基本信息配置（_config.yml）在 _config.yml 中修改了以下关键配置项：# 个人信息first_name: Roderickmiddle_name:last_name: Huanglang: zh-CNcontact_note: &amp;gt; 欢迎通过 GitHub 或邮件与我联系。description: &amp;gt; Roderick Huang 的个人博客，记录工作与技术。# 站点 URLurl: https://hxf0223.github.iobaseurl: # 个人站点留空# 博客设置blog_name: WorkLog# 页面宽度max_width: 1400px# Giscus 评论系统giscus: repo: hxf0223/hxf0223.github.io repo_id: R_kgDOL6EGLA category: General category_id: DIC_kwDOL6EGLM4Czxtq mapping: pathname strict: 0 lang: zh-CN# Scholarscholar: last_name: [Huang] first_name: [Roderick, R.]# 注释掉外部文章源# external_sources: ...另外在 defaults 中为所有文章默认启用右侧目录：defaults: - scope: path: &quot;&quot;...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/al-folio-customization-summary/";
          
        },
      },{id: "post-al-folio-部署记录-ubuntu-24-04",
        
          title: "al-folio 部署记录（Ubuntu 24.04）",
        
        description: "本文记录在 Ubuntu 24.04 上从零开始本地部署 al-folio Jekyll 主题的完整流程，以及遇到的问题和解决方案。使用Docker方式进行部署使用Docker部署，需要先安装 Docker 和 Docker Compose，见：安装 Docker 和 Docker Compose。安装nodejs + npm，用于安装prettier（代码格式化工具）：sudo apt install nodejs npmnode --version &amp;amp;&amp;amp; npm --version安装prettier及其Liquid插件（package.json 里已定义）：npm install检查以及修复markdown格式：npx prettier . --checknpx prettier . --write拉取al-folio Docker镜像，并运行：docker compose pulldocker compose up如果需要根据Dockerfile自定义镜像，执行（在这个命令执行过程中，其需要安装一些依赖项）：docker compose up --buildDocker部署方式操作结束。下面介绍的本地部署的方式作为备份。环境说明 操作系统：Ubuntu 24.04 x86_64 Ruby 版本管理：rbenv 目标 Ruby 版本：3.3.5第一步：安装系统依赖Ruby 编译和 Jekyll 运行需要以下系统包：sudo apt-get install -y libyaml-dev libssl-dev libreadline-dev zlib1g-dev libffi-dev...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/al-folio-local-deploy-ubuntu2404/";
          
        },
      },{id: "post-ubuntu-26-04-安装-docker-和-docker-compose",
        
          title: "Ubuntu 26.04 安装 Docker 和 Docker Compose",
        
        description: "1. 依赖安装先检查是否已经安装了Docker和Docker Compose，如果安装了，则先卸载旧版本：sudo apt remove -y docker docker-engine docker.io containerd runcsudo rm -rf /var/lib/docker /var/lib/containerd安装依赖项：sudo apt update &amp;amp;&amp;amp; sudo apt upgrade -y# 安装证书、curl、gnupg 等基础依赖sudo apt install -y ca-certificates curl gnupg lsb-release2. 添加国内源首先添加GPP密钥，另外再添加阿里云的Docker源：# 创建密钥存储目录sudo mkdir -p /etc/apt/trusted.gpg.d# 导入阿里云 Docker GPG 密钥（避免签名验证失败）curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg# 添加适配 Ubuntu 24.04（noble）的阿里云 Docker 源echo &quot;deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/trusted.gpg.d/docker.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs)...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/%E5%AE%89%E8%A3%85Docker-Docker-Compose/";
          
        },
      },{id: "post-c-traits",
        
          title: "C++ Traits",
        
        description: "C++ Traits 是一种元编程技术，将类型信息封装在一个类中，供算法或其他模板使用，以期达到从算法/逻辑中分离类型信息的目的。比如元素类型、一些常量定义、指令选择、对齐要求等等。 问题 Traits 如何解决 内置类型（int, float）不能添加成员 Traits 外挂信息 不同类型需要不同的算法策略 模板特化选择策略 想要零开销的编译期多态 全部在编译期决议 接口与实现解耦 算法只依赖 Traits 接口 1. 自定义 Traits 常见模式1.1 类型信息萃取目的：从不同类型中统一提取需要的信息。// 主模板 (可以留空或给默认值)template &amp;lt;typename T&amp;gt;struct NumericTraits;// 对 float 特化template &amp;lt;&amp;gt;struct NumericTraits&amp;lt;float&amp;gt; { using type = float; using compute_type = float; // 计算时用的类型 using accum_type = float; // 累加器类型 static constexpr int bits = 32; static constexpr float epsilon...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/C++-Traits/";
          
        },
      },{id: "post-道格拉斯-普克算法-douglas-peucker-algorithm",
        
          title: "道格拉斯-普克算法(Douglas–Peucker algorithm)",
        
        description: "道格拉斯-普克算法（Douglas–Peucker algorithm），又称为Ramer-Douglas-Peucker算法，是一种用于简化曲线的算法。它通过减少曲线上的点数来近似表示原始曲线，同时尽量保持其形状和特征。可以应用于计算机图形学、地理信息系统（GIS）、甚至CAD领域。算法的具体实现逻辑如下：  在轨迹曲线在曲线首尾两点A，B之间连接一条直线AB，该直线为曲线的弦；  遍历曲线上其他所有点，求每个点到直线AB的距离，找到最大距离的点C，最大距离记为maxDistance  比较该距离maxDistance与预先定义的阈值epsilon大小，如果maxDistance &amp;lt; epsilon，则将该直线AB作为曲线段的近似，舍去AB之间的所有点，曲线段处理完毕；  若maxDistance &amp;gt;= epsilon，则使C点将曲线AB分为AC和CB两段，并分别对这两段进行（1）~（3）步处理；  当所有曲线都处理完毕时，依次连接各个分割点形成的折线，即为原始曲线的路径。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/%E9%81%93%E6%A0%BC%E6%8B%89%E6%96%AF-%E6%99%AE%E5%85%8B%E7%AE%97%E6%B3%95/";
          
        },
      },{id: "post-cmake支持库收集",
        
          title: "CMake支持库收集",
        
        description: "CMake Toolchain files for Windows  CMake project_options",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CMake%E6%94%AF%E6%8C%81%E5%BA%93/";
          
        },
      },{id: "post-qgc代码架构解析-飞行前检查-起飞条件",
        
          title: "QGC代码架构解析：飞行前检查（起飞条件）",
        
        description: "QGC中，飞行状态指示器（Flight Status Indicator）显示的状态列表： 状态名称 说明 准备好飞速 (_绿色背景) 载具已准备就绪，可以起飞 准备好飞行 (_黄色背景) 载具已准备好在当前飞行模式下飞行，但有些警告可能造成问题 尚未准备好 载具没有准备好飞行，也不会起飞 解锁 载具已解锁并准备起飞。 飞行 载具正在飞行 着陆 载具正在着陆 通信丢失 QGC已失去与载具的通信 更多信息，参考飞行视图工具栏。1. 解锁检查项 气压计（Barometer） 指南针（Compass） GPS 锁定（GPS lock） 惯性导航系统（INS） 参数（Parameters） 遥控通道（RC Channels） 电路板电压（Board voltage） 电池电量（Battery Level） 空速（Airspeed） 日志记录可用（Logging Available） 硬件安全开关（Hardware safety switch） GPS 配置（GPS Configuration） 系统（System） ：Safety Setup (ArduPilot)检查实现函数：HealthAndArmingCheckReport::update。QGC提供了可选的飞行前检查清单功能：Pre Flight Checklist。备注： 通常情况下，不需要手动解锁飞机。简单地起飞或开始执行任务时，飞行器会自动解锁。 不同的飞行器类型（多旋翼、固定翼、地面车、潜水器）可能有略微不同的解锁检查项，但核心检查项是相似的。2. MAV_MODEMAV_MODE枚举定义了飞行器的标准飞行模式。不同的飞行模式决定了飞行器的行为和控制方式，设置命令是MAV_CMD_DO_SET_MODE。// common/common.htypedef enum MAV_MODE{ MAV_MODE_PREFLIGHT=0, /* System...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/QGC%E9%A3%9E%E8%A1%8C%E5%89%8D%E6%A3%80%E6%9F%A5/";
          
        },
      },{id: "post-qgc代码架构解析-mavlink-mission-protocol-以及-qgc-航点管理",
        
          title: "QGC代码架构解析：MAVLink Mission Protocol，以及 QGC 航点管理",
        
        description: "本文厘清如下几个问题： 航点协议（Mission Protocol）有哪些命令/消息； 微服务的处理流程，以及流程中通信双方使用到的命令ID/请求ID-响应ID； 带参数的命令/消息，其参数格式，以及单位； 航点文件格式。1. MAVLink Mission Protocol航点协议主要实现航点集合的上传、下载、清除。另外有一些其他消息，以及附带的参数/枚举。航点上传/下载使用到如下几个消息定义： 消息名称 说明 发送方 MISSION_REQUEST_LIST 启动航点集下载动作 地面站 MISSION_COUNT 航点数量 地面站/飞控 MISSION_REQUEST_INT 请求航点 地面站/飞控 MISSION_ITEM_INT 请求航点 飞控/地面站 MISSION_ACK 航点响应 飞控/地面站 1.1. 航点的上传/下载流程航点上传/下载流程图（左边为QGC请求下载，右边为QGC请求上传）：对比发现规律： QGC请求下载时，使用MISSION_REQUEST_LIST来启动，而请求上传时，使用MISSION_COUNT来启动（注意：不论上传/下载，都是QGC发起的）； MISSION_COUNT既可以作为飞控响应QGC的下载请求，也可以作为QGC请求飞控上传航点的启动消息； 启动之后，中间航点的请求，双方使用MISSION_REQUEST_INT &amp;lt;–&amp;gt; MISSION_ITEM_INT配对，即一个完整的单个航点传输流程。航点发送方使用MISSION_REQUEST_INT请求，接收方使用MISSION_ITEM_INT响应。 最后使用MISSION_ACK作为结束标示。在这里，ACK消息的含义是结束，即整个流程结束了，这样理解更合理。 从文档看，MISSION_ACK只用在上传/下载流程里面。其他消息里面没有使用到。上传/下载的流程，不具有对称性，给理解带来了一定的混乱。流程步骤在语义上理解也不顺畅。1.1.1. 协议实现注意事项 在流程图的Start timeout处，需要实现超时重传机制： MISSION_REQUEST_LIST超时没有响应，重传该命令若干次； MISSION_COUNT超时没有响应，重传该命令若干次； MISSION_REQUEST_INT超时没有响应，重传该命令若干次； MISSION_REQUEST_INT请求的航点，需要按序号顺序请求以及应答。如果收到的MISSION_ITEM_INT中的航点顺序不对，需要丢弃该航点数据，并重新请求。 当上传/下载航点时，飞机会返回一个opaque_id（类似整个航点集合计算得到的哈希），用于避免不不必要的再次上传/下载。当QGC上传时，飞机在最后一个消息返回该值：MISSION_ACK.opaque_id。当QGC下载时，飞机在MISSION_COUNT中返回该值：MISSION_COUNT.opaque_id。 当上传/下载的过程中失败时（对方提前返回MISSION_ACK并包含错误消息），QGC或者飞机应该终止当前流程，并恢复使用上一次的航点集。 协议没有说明，上传过程中，最后一步，如果飞机没有返回MISSION_ACK，应该如何处理。QGC的实际处理方式是，认为上传成功并完成，但是opaque_id没有更新。1.2. 航点消息结构：消息 MISSION_ITEM_INT，以及 MAV_CMD航点不仅仅只有坐标等数据，还包含动作含义，即MAV_CMD其实是一个命令+参数数据。MISSION_ITEM_INT就是用于发送这些MAV_CMD子命令+参数的。MAV_CMD分为如下几类： MAV_CMD_NAV_*：导航类命令（起飞、降落、返回RTL、悬停、飞到指定航点位置），比如MAV_CMD_NAV_WAYPOINT表示普通航点，MAV_CMD_NAV_LOITER_UNLIM表示无限悬停等。 MAV_CMD_DO_*：动作类命令，比如MAV_CMD_DO_CHANGE_SPEED表示改变速度，MAV_CMD_DO_SET_RELAY表示设置继电器等； MAV_CMD_CONDITION_*：命令执行条件，比如MAV_CMD_CONDITION_DELAY表示等待一段时间之后，再执行下一个航点MAV_CMD。从Ardupilot文档看，MAV_CMD_CONDITION_*命令是作用于MAV_CMD_DO_*命令，参考Ardupilot – Mission Commands – Conditional commands。主要的MAV_CMD_NAV命令列表： Command ID...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qgc_mission_manager/";
          
        },
      },{id: "post-ai工具收集-其他不分类工具收集-持续更新",
        
          title: "AI工具收集，其他不分类工具收集，持续更新",
        
        description: "1. 开发相关Skills1.1. GPU相关 agent-gpu-skills：包含 cutlass、CuTe、CuTeDSL、triton ptx-isa-markdown：PTX指令集的Markdown版本1.2. 通用skills agent-engineer：Google工程师addyosmani写的教程 agent-skills：Google工程师addyosmani写的agent skills2. AI工具收集 BabelDOC: 一款基于AI的文档生成工具，能够自动从代码库中提取信息并生成详细的技术文档，支持多种编程语言和格式。 Pixelle-Video：阿里云团队出品：只需输入一个 主题，AI 全自动短视频引擎–撰写视频文案、生成 AI 配图/视频、合成语音解说、添加背景音乐、一键合成视频。 阿里云百炼平台：阿里云百炼平台。 3. 其他实用工具 yt-dlp: 一个命令行视频下载工具，支持从YouTube及其他多个网站下载视频，功能强大且持续更新。 Bilibili-Mass-Unfollower: 一个用于批量取消关注Bilibili用户的工具。 ChinaTextBook 中国教材在线平台: 提供小学、初中、高中各学科的教材下载。 4. 使用笔记4.1. 使用NVIDIA免费模型通过使用claude-nvidia-proxy，将claude客户端连接到NVIDIA的API，可以使用NVIDIA提供的免费模型。其流程为：claude 客户端 → claude-nvidia-proxy → NVIDIA API → 模型推理结果返回给claude客户端。4.1.1. 安装claude客户端# 标准安装方式（linux）curl -fsSL https://claude.ai/install.sh | bash# 标准安装方式（windows）irm https://claude.ai/install.ps1 | iex# 国内安装，使用淘宝镜像sudo npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com# NPM卸载sudo npm uninstall -g @anthropic-ai/claude-code新增并编辑claude的配置文件，添加字段跳过官方登陆引导：{...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/AI%E5%B7%A5%E5%85%B7%E6%94%B6%E9%9B%86/";
          
        },
      },{id: "post-ai工具-使用docling转换文档",
        
          title: "AI工具：使用docling转换文档",
        
        description: "1. 环境搭建环境搭建参考：Python venv 环境搭建及 VSCode 环境配置。pip install docling2. 使用 docling转换文档&quot;&quot;&quot;docx 转 Markdown 脚本用法： 转换单个文件：python docx2md.py 文件.docx 转换整个目录：python docx2md.py 目录路径/ 指定输出目录：python docx2md.py 文件.docx -o 输出目录/&quot;&quot;&quot;import argparseimport sysfrom pathlib import Pathfrom docling.document_converter import DocumentConverterdef convert_file(input_path: Path, output_dir: Path) -&amp;gt; None: &quot;&quot;&quot;将单个 docx 文件转换为 Markdown。&quot;&quot;&quot; print(f&quot;正在转换：{input_path}&quot;) converter = DocumentConverter() result = converter.convert(str(input_path)) md_content = result.document.export_to_markdown() output_dir.mkdir(parents=True, exist_ok=True) output_path = output_dir / (input_path.stem +...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/AI-%E4%BD%BF%E7%94%A8docling%E8%BD%AC%E6%8D%A2%E6%96%87%E4%BB%B6/";
          
        },
      },{id: "post-qgc代码架构解析-qgc初始加载及状态机",
        
          title: "QGC代码架构解析：QGC初始加载及状态机",
        
        description: "在收到飞机发来的心跳包后，消息发送给MultiVehicleManager，在MultiVehicleManager中，检查组件ID是否是MAV_COMP_ID_AUTOPILOT1，以及vehicleType不是GCS等之后，会创建一个Vehicle对象，并进入初始化流程。 mavlink_message_t中已经包含了sysid、compid信息。而心跳包mavlink_heartbeat_t中则包含了vehicleType、firmwareType等信息。 需要注意的是，与飞控通信中，组件ID是固定的：MAV_COMP_ID_AUTOPILOT1，即每个飞控的组件ID都是1。飞机发现、创建及初始化流程如下图所示：主要初始流程入口在InitialConnectStateMachine中以状态机实现，且部分子流程也是以状态机实现（至多嵌套了三层状态机）： 由于获取信息需要使用同步方式，在InitialConnectStateMachine状态机中，使用回调方式处理应答Ack，在回调中进入下一个处理阶段。参见：1. 请求的实现，以及模拟同步请求。static constexpr const StateMachine::StateFn _rgStates[] = { _stateRequestAutopilotVersion, _stateRequestStandardModes, _stateRequestCompInfo, _stateRequestParameters, _stateRequestMission, _stateRequestGeoFence, _stateRequestRallyPoints, _stateSignalInitialConnectComplete};1. 请求的实现，以及模拟同步请求请求飞机信息，使用MAV_CMD_REQUEST_MESSAGE命令字，请求对应的消息ID（即子命令，比如请求飞机版本信息MAVLINK_MSG_ID_AUTOPILOT_VERSION），以及子命令的参数。另外，使用命令MAV_CMD_SET_MESSAGE_INTERVAL让飞机定期周期响应子命令消息。飞机端收到MESSAGE消息之后，先返回一个响应Ack（Ack中包含msgid，以及响应码，比如MAV_RESULT_ACCEPTED）。QGC收到该消息，继续处理之前发送的请求，实现代码主要有两个函数入口：Vehicle::requestMessage，Vehicle::_handleCommandAck(mavlink_message_t&amp;amp; message)，以及一个主要的数据成员QMap&amp;lt;int, QMap&amp;lt;int, RequestMessageInfo_t*&amp;gt;&amp;gt; _requestMessageInfoMap。MAV_CMD_REQUEST_MESSAGE消息的文档：How to Request &amp;amp; Stream Messages。处理流程示例：你的程序 飞控 | | | 1. 发送 MAV_CMD_SET_MESSAGE_INTERVAL |----------------------------------------→ (请求：以1Hz发送BATTERY_STATUS) | | | 处理请求 | 2. 接收 COMMAND_ACK |←---------------------------------------- (确认已接受) | | 3. 等待 BATTERY_STATUS | | | 自动发送电池信息（周期: 1秒） | ←...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qgc_init_load_states/";
          
        },
      },{id: "post-qgc代码架构解析-mavlink参数服务及qgc参数管理模块",
        
          title: "QGC代码架构解析：MAVLink参数服务及QGC参数管理模块",
        
        description: "MAVLink参数服务网页：Parameter Protocol1. 微服务：Parameter Protocol基本流程为请求-&amp;gt;响应返回。请求/消息列表： PARAM_REQUEST_LIST：请求所有参数。随后远端会周期性发送所有参数，直到发送完毕。请求数据结构： target_system（uint8_t）：System ID target_component（uint8_t）：Component ID PARAM_REQUEST_READ：请求单个参数。请求数据结构： target_system（uint8_t）：System ID target_component（uint8_t）：Component ID param_id（char[16]）：参数名称，与param_index二选一 param_index（int16_t）：参数索引（-1表示忽略） PARAM_SET：设置单个参数。请求数据结构： target_system（uint8_t）：System ID target_component（uint8_t）：Component ID param_id（char[16]）：参数名称 param_value（float）：参数值 param_type（uint8_t）：参数数据类型枚举 PARAM_VALUE：参数值响应。响应数据结构（系统ID以及组件ID在mavlink_message_t中）： param_id（char[16]）：参数名称 param_value（float）：参数值 param_type（uint8_t）：参数数据类型枚举 param_count（uint16_t）：参数总数 param_index（uint16_t）：当前参数索引 知识点总结： 获取/设置所有子系统的参数：target_component设置为 MAV_COMP_ID_ALL（QGC就是采取这种方式）。 参数响应消息中，带有参数总数和当前索引，QGC可以判断是否接收完毕。 param_value有两种格式存储参数值：转换为float类型；或者直接按照原始数据复制到param_value域。Ardupilot直接使用memcpy的方式（小端）。MAVLink参数协议中，定义了相应的标志位，表示使用哪种方式存储。 当QGC发送设置命令PARAM_SET之后，飞机端会返回一个PARAM_VALUE消息作为确认：Parameter Protocol – Write Parameters。 PX4固件支持缓存机制，即通过返回名称为PARAM_HASH，值为哈希值的PARAM_VALUE消息，确认参数没有变化：Parameter Protocol – PX4。 设置参数非法等原因导致飞机拒绝设置时，飞机端返回STATUS_TEXT消息。1.1. 参数存储代码示例// 定义如下结构体，适用于原始字节流存储参数值（Bytewise）// https://github.com/mavlink/c_library_v2/blob/master/mavlink_types.hMAVPACKED(typedef struct param_union { union { float param_float; int32_t param_int32; uint32_t param_uint32; int16_t...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qgc_parameter_module/";
          
        },
      },{id: "post-qgc代码架构解析-firmwareplugin与autopilotplugin",
        
          title: "QGC代码架构解析：FirmwarePlugin与AutopilotPlugin",
        
        description: "概念： FirmwarePlugin：固件插件，表示某种飞控固件（如APM、PX4等）。 AutoPilotPlugin：表示某种飞控固件实现的不同飞机类型，比如固定翼、旋翼等。1. FirmwarePlugin 与 AutoPilotPlugin 的关系从逻辑关系看（主要从分类角度），AutoPilotPlugin需要从FirmwarePlugin创建，例如APM的固件，创建APM相关的AutoPilotPlugin。从实现看，FirmwarePlugin最多也有三层继承，以APM固件为例： FirmwarePlugin（基类） APMFirmwarePlugin（表示APM固件） ArduPlaneFirmwarePlugin（表示APM的固定翼飞机） ArduCopterFirmwarePlugin（表示APM的多旋翼飞机） ArduRoverFirmwarePlugin（表示APM的地面车） 是在APMFirmwarePlugin这一层创建AutoPilotPlugin，即针对APM固件，实际只有一种AutoPilotPlugin实现。1.1. FirmwarePlugin 实例的创建MAVLink协议心跳包中，包含了固件类型和飞行器类型两个字段：typedef struct __mavlink_heartbeat_t { uint32_t custom_mode; /*&amp;lt; A bitfield for use for autopilot-specific flags*/ uint8_t type; /*&amp;lt; Vehicle or component type. For a flight controller component the vehicle type (quadrotor, helicopter, etc.). For other components the component type (e.g. camera, gimbal, etc.). This should be used...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qgc_firmwareplugin_autopilotplugin/";
          
        },
      },{id: "post-apm-pixhawk常用飞行模式",
        
          title: "APM/Pixhawk常用飞行模式",
        
        description: "1. 多旋翼：手动飞行模式如下几种飞行模式是手动控制模式，即受遥控器控制：  Stabilize（稳定模式/姿态模式）  Altitude（定高模式）  Position（定点模式）  Offboard（板外模式/指令模式）1.1. Stabilize：稳定模式（姿态模式）  俯仰、横滚摇杆控制飞机对应的角度（注意是角度）；  油门控制飞机的上升/下降速度，以及其他轴的移动速度（注意是速度，类似汽车油门）；  偏航控制飞机的旋转速率（水平方向）。当摇杆回到中立位置时，飞机会自动保持当前的姿态（俯仰角0，横滚角0，偏航角0）和高度。但不会自动保持位置：可能会朝着风力的方向漂移，此时需要控制油门以保持高度。资料：  PX4 Guide – 位置模式（多旋翼）1.2. Altitude：定高模式定高模式与稳定模式类似：俯仰、横滚摇杆控制飞机的角度。但是油门控制逻辑是：油门摇杆以预定的最大速率（和其他轴上的移动速度）控制上升速度。  当摇杆归中之后，如果飞机在水平方向飞行，则持续运动，直到被风的阻力减速停下。如果刮风，飞机会朝着风的方向漂移。  高度保持依赖传感器（气压计或激光测距仪等）来维持高度。资料：  PX4 Guide – 定高模式（多旋翼）1.3. Position：定点模式  横滚、俯仰摇杆分别控制飞机在左右和前后方向上的地面水平加速度。  油门摇杆控制飞机的上升/下降速度。  偏航摇杆控制飞机的旋转速率（水平面方向）。当摇杆回到中立位置时，飞机会自动保持当前位置和高度，但不保持当前方向（当有外力改变水平朝向之后，会保持新的角度）。依赖GPS获取绝对位置，以及磁罗盘获取航向。如果这两个组件有失效，则不能进入该模式；如果在该模式下失效，则进入失效处理。资料：  PX4 Guide – 位置模式（多旋翼）1.4. Offboard：板外模式/指令模式指令控制模式，即通过地面站发送切换指令：  切换指令需要带位置、偏航角等参数；  需要按指定周期发送指令，否则会触发失效处理。2. 多旋翼：自动飞行模式TBD3. 摇杆遥控器摇杆控制：俯仰(pitch)、横滚(roll)、偏航(yaw)、油门(throttle)：对应的飞机运动：  俯仰 =&amp;gt; 上升/下降。  横滚 =&amp;gt; 向左/右倾斜并转弯。  偏航 =&amp;gt; 机尾向左/右转动并转弯。  油门 =&amp;gt; 改变前进速度。以上指固定翼飞机，其他类型飞机类似。资料：  PX4 Guide – 固定翼飞机基础飞行指南参考资料  PX4 Guide – PX4多旋翼无人机飞行模式（Flight Mode）  APM/Pixhawk常用飞行模式讲解：http://www.nufeichuiyun.com/?p=1128  【无人机】多旋翼无人机控制器架构，PX4控制器，PID控制  开放航空航天仿真工具集锦",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/ardupilot-flight-modes/";
          
        },
      },{id: "post-地面站-helios-以及-dart-flutter-环境搭建",
        
          title: "地面站 Helios 以及 Dart/Flutter 环境搭建",
        
        description: "1. Flutter 环境搭建从Flutter 南京大学镜像下载并解压 Flutter SDK，当前最新版本3.41.7。随后，将其子目录bin添加到系统环境变量Path中。并添加如下两个环境变量（以Linux环境为例）：export FLUTTER_STORAGE_BASE_URL=&quot;https://mirrors.cernet.edu.cn/flutter&quot;export PUB_HOSTED_URL=&quot;https://mirrors.cernet.edu.cn/dart-pub&quot;          # pub get2. Helios 地面站从Helios GitHub 仓库下载源码。A. 资源  Dart中文网站  Flutter 文档  Helios 官方网站",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/%E5%9C%B0%E9%9D%A2%E7%AB%99-helios-%E4%BB%A5%E5%8F%8A-dart-flutter-%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA/";
          
        },
      },{id: "post-ardupilot-笔记",
        
          title: "ArduPilot 笔记",
        
        description: "1. ArduPilot SITL 编译# 编译及开发环境准备./Tools/environment_install/install-prereqs-ubuntu.sh -y./waf configure --board sitl./waf plane    # ArduPlane# 生成 build/sitl/bin/arduplane1.1. 初步运行使用自定义python脚本运行 SITLgithub – ap-swarm-launcher：# 启动两个 ArduPlane SITL 实例，设置数据目录为 ~/tmp/arduplaneuv run ap-sitl-swarm --model plane -n 2 --data-dir ~/tmp/arduplane --no-multicast --tcp-base-port 5760 --home 31.8269,117.2280,30 ~/tmp/arduplane/arduplane更多资料：  Using SITL with AirSim  search: ardupilot airsim  Ardupilot – Simulation",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/ardupilot-notes/";
          
        },
      },{id: "post-内存模型-memory-model-从多处理器到高级语言",
        
          title: "内存模型(Memory Model)：从多处理器到高级语言",
        
        description: "复制自：github笔记 – GHScan大神 – Memory_Model前言谁需要关心这个主题？ 实现同步原语、Lockless算法的并行计算工程师 实现操作系统内核或驱动，和DMA设备打交道的系统工程师 实现高级语言Memory Model的编译器工程师 实现处理器Memory Model的CPU工程师如何阅读本文？阅读时注意本文的组织结构，第一遍阅读时可跳过斜体的技术细节。本文将回答的问题 x86为什么允许Store-Load乱序，而不是其他？见TSO的优点 std::memoryorder_seq_cst非常慢、会严重损害性能？见WO_ std::memoryorder_acquire和std::memory_order_consume的区别？后者换作std::memory_order_relaxed会怎样？见Dependent Loads_ std::memoryorder_acq_rel和std::memory_order_seq_cst的区别？见Store Atomicity和IRIW_基础知识共享存储器多处理器SMP是通过一个共享的地址空间进行通信和协调的多处理器系统，与之相对的概念是集群(Cluster)，后者每个节点都有独立的地址空间。SMP又包括： NUMA(Non-Uniform Memory Access)：大量的处理器通过互连网络连接在一起，每个节点访问本地存储器时延迟较短，访问其他节点有不同的延迟 UMA(Uniform Memory Access)：又叫SMP(Symmetric Multiprocessor)，所有的处理器通过总线连接在一起，访问一个共享的存储器，每个节点的存储器访问延迟相同。目前常见的桌面多核处理器就是这种结构现代处理器中的关键技术\(^{[2]}\) - 流水线(Pipeline)：每个指令的执行需要多个步骤，线代CPU通过流水线的方式允许同时执行多个指令，从而提高功能单元的利用率和系统总吞吐。支持流水线的CPU的IPC(Instructions Per Cycle) 可以达到1，哪怕每条指令实际上需要多个时钟周期才能完成。- `动态分支预测(Dynamic Branch Prediction)`：带流水线的CPU需要每个时钟发射1条指令，但只有分支指令执行结束后才能确定下条指令是什么，这就导致`流水线停顿(Pipeline Stall)`。为避免分支指令导致的流水线停顿，一种对策是分支预测，即在发射分支指令之后，马上预测下条指令的地址并发射，如果分支指令执行结束后发现预测错误，则撤销之前的操作取正确的指令重新发射。这里预测失败导致的撤销开销，叫`分支预测惩罚(Mispredict Penalty)`，由于现代系统的分支预测正确率很高，摊还后的惩罚开销往往可以接受。动态分支预测是基于分支指令历史进行的，现代CPU的预测正确率在大部分场合可以高达95%以上；相对的，静态分支预测是基于固定分支选择策略、源码中的Hint，或根据编译器的得到的Profile信息来完成的。- `动态多发射(超标量，Superscalar)`：为更好的利用富裕的功能单元，CPU希望IPC能够超过1，这就要求每个时钟发射多条指令。支持超标量的处理器，需要处理同时发射的多条指令间的数据依赖关系，这个复杂性限制了动态发射窗口的大小。与之相对的是静态多发射，即由编译器或程序员往一个`发射包(Issue Packet)`中填充多条无关指令，然后同时发射和执行，典型的例子是`超长指令字(Very Long Instruction Word)`体系结构。- `乱序执行(Out-of-Order Execution)`：当前面的指令由于特种类型的功能单元不足、存储器延迟或操作数没有计算出来，必须停顿时，CPU可以发射后续的无关指令，从而乱序执行。乱序指令有效的提高了CPU利用率，掩盖了各种停顿。 - `寄存器重命名(Register Renaming)`：CPU通过寄存器重命名的方式使得物理寄存器数目超过指令集中的逻辑寄存器，缓解了如x86指令集中的寄存器不足的问题。 - 寄存器重命名另一大作用是，避免由于`假数据依赖(False Data Dependence)`导致的停顿；具体来说，寄存器重命名解决了`WAW Hazard`和`WAR Hazard`。- `推断执行(Speculative Execution)`：支持动态分支预测和乱序执行的处理器，需要保留一个`重排序缓冲区(Reorder Buffer)`，用来对乱序执行的指令进行`顺序提交(In-Order Commit)`。重排序缓冲区为推断失败时的撤销提供了解决方案，只需要清空分支指令后的所有指令即可。另外，顺序提交也为`精确异常(Precise Exception)`提供了基础，这是操作系统中断和`缺页故障(Page Fault)`处理的关键。推断执行的指导思想是“加速大概率事件”。- `写缓冲区(Writer Buffer)`：CPU在写存储器时，不直接访问存储器或Cache，而是将要写的数据放入一个写缓冲区，然后继续执行后面的指令，这缓解了写存储器导致的停顿。- `硬件多线程(Hardware Multithreading)`：上面列举的优化策略都旨在改进`指令级并行(Instruction-Level...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/memory_model2/";
          
        },
      },{id: "post-再理解-std-condition-variable-条件变量",
        
          title: "再理解 std::condition_variable 条件变量",
        
        description: "有如下几个问题需要厘清： 工作原理，即流程； 虚假唤醒与唤醒丢失； notify_one 与 notify_all。 lock_guard 与 unique_lock。#include &amp;lt;atomic&amp;gt;#include &amp;lt;condition_variable&amp;gt;#include &amp;lt;iostream&amp;gt;#include &amp;lt;thread&amp;gt;std::mutex mutex_;std::condition_variable condVar;std::atomic&amp;lt;bool&amp;gt; dataReady{false}; // (0)void waitingForWork() { std::cout &amp;lt;&amp;lt; &quot;Waiting &quot; &amp;lt;&amp;lt; std::endl; std::unique_lock&amp;lt;std::mutex&amp;gt; lck(mutex_); condVar.wait(lck, []{ return dataReady.load(); }); // (1) std::cout &amp;lt;&amp;lt; &quot;Running &quot; &amp;lt;&amp;lt; std::endl; // do the work}void setDataReady() { { std::lock_guard&amp;lt;std::mutex&amp;gt; lck(mutex_); // (2) // prepare the data dataReady = true; }...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/conditonal_variable/";
          
        },
      },{id: "post-使用-libevent-实现时间戳调度",
        
          title: "使用 libevent 实现时间戳调度",
        
        description: "1. 介绍libevent底层使用不同的事件通知机制：linux 使用epoll，Windows使用IOCP。它提供了一个统一的接口来处理网络事件和定时事件。使用libevent的几个基本操作步骤：1.1. 创建 event_base 对象，作为事件循环的核心struct event_base *base = event_base_new(); event_base只能在一个线程中使用。1.2. 创建事件处理器struct event *ev = event_new(base, fd, EV_READ | EV_PERSIST, my_read_callback, NULL);fd是文件描述符，EV_READ | EV_PERSIST指定了事件类型（这里是读事件并且是持久的，即事件被触发后不会自动删除），my_read_callback是事件触发时调用的函数，最后一个参数是传递给回调函数的用户数据。回调函数在同一个线程中执行。1.3. 添加事件到事件循环中event_add(ev, NULL);1.4. 启动事件循环event_base_dispatch(base);判断事件循环是否应该退出：const auto got_break = event_base_got_break(base);const auto got_exit = event_base_got_exit(base);return got_break == 0 &amp;amp;&amp;amp; got_exit == 0;1.5. 清理资源event_free(ev);event_base_free(base);2. 使用 libevent 实现时间戳调度创建event_base对象：void PcapngPlayer::start() { // ... if (base_ = event_base_new(); !base_) { spdlog::error(&quot;Could not initialize libevent!&quot;);...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/timestamp_schedule_using_libevent/";
          
        },
      },{id: "post-qml基础语法积累",
        
          title: "QML基础语法积累",
        
        description: "1. 信号与 Connections信号一般用于组件封装，在外部声明的组件内声明信号处理器。Connections则提供另外一种方式：即在被调用组件外部使用信号并使用信号处理器。1.1. 信号的语法及使用信号语法：signal &amp;lt;signalName&amp;gt;([&amp;lt;parameterName&amp;gt;:&amp;lt;parameterType&amp;gt;[,...]])信号处理器语法：// on: 固定关键字// Signal: 信号名，首字母必须大写on&amp;lt;Signal&amp;gt;示例：Item { signal mySignal(param1: int, param2: string) MouseArea { anchors.fill: parent onClicked: { mySignal(42, &quot;Hello&quot;) } } // Qt6 要求信号处理器显式声明参数 onMySignal: (param1, param2) =&amp;gt; { console.log(&quot;Signal received with param1:&quot;, param1, &quot;and param2:&quot;, param2) }}1.2. 属性值改变信号QML类型提供内建属性值改变信号，这个属性属性值改变就会自动发出信号。属性值改变信号的命名规则是 on&amp;lt;PropertyName&amp;gt;Changed。示例：Rectangle { width: 100 height: 100 color: &quot;red&quot; onWidthChanged: width =&amp;gt; { console.log(&quot;Width changed to:&quot;, width); }...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/QML%E7%AC%94%E8%AE%B0/";
          
        },
      },{id: "post-交叉编译-qt-5-15-2",
        
          title: "交叉编译 Qt 5.15.2",
        
        description: "1. 下载交叉编译器下载地址目录：aarch64-linux-gnu gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnus sysroot-glibc-linaro-2.25-2019.12-aarch64-linux-gnu下载之后，将编译器及sysroot解压到/opt目录下：/opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/opt/sysroot-glibc-linaro-2.25-2019.12-aarch64-linux-gnuQt 5.15.2下载目录：Qt 5.15.2 。选择下载 qt-everywhere-src-5.15.2.tar.xz。2. 修改Qt源码修改头文件：qtbase/src/corelib/global/qglobal.h，include添加：// 第44行开始的地方添加 &amp;lt;limits&amp;gt;，解决configure的时候报错找不到&amp;lt;limits&amp;gt;以及limits相关错误# include &amp;lt;limits&amp;gt;// ....拷贝（不拷贝，configure 的时候报错：Invalid target platform ‘aarch64-linux-gnu-g++’）：cp -r qtbase/mkspecs/linux-aarch64-gnu-g++ qtbase/mkspecs/aarch64-linux-gnu-g++修改文件qtbase/mkspecs/aarch64-linux-gnu-g++/qmake.conf：# modifications to g++.confQMAKE_CC = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gccQMAKE_CXX = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++QMAKE_LINK = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++QMAKE_LINK_SHLIB = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++# modifications to linux.confQMAKE_AR = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-ar cqsQMAKE_OBJCOPY = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-objcopyQMAKE_NM = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-nm -PQMAKE_STRIP = /opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-strip3. 编译 Qt 源码如下为编译一个比较精简的Qt库，去掉了很多模块。#!/bin/shcd build-qt5-qtbaseyes | rm -rf *export SYSROOT=/opt/sysroot-glibc-linaro-2.25-2019.12-aarch64-linux-gnuexport CROSS_PREFIX=aarch64-linux-gnu-export DEST_PREFIX=/opt/qt5-aarch64-gcc-linaro-7.5.0export TOOLCHAIN_PREFIX=/opt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/binexport PATH=$TOOLCHAIN_PREFIX:$PATHexport PKG_CONFIG_LIBDIR=${SYSROOT}/lib/pkgconfig:${SYSROOT}/share/pkgconfigexport PKG_CONFIG_PATH=${SYSROOT}/lib/pkgconfig:${SYSROOT}/share/pkgconfig../configure...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cross_build_qt_arm64_linaro_7.5/";
          
        },
      },{id: "post-使用-c-template-构建一个通信用序列化反序列化模块",
        
          title: "使用 C++ template 构建一个通信用序列化反序列化模块",
        
        description: "1. 序列化 PacketSerializer分为以下几个步骤： 需要一个 buffer 来存储序列化过程中的数据，使用 std::vector 作为底层存储。 提供一个模板实现的基础函数 writeToBuffer，将基本类型数据写入 buffer。 提供一个模板函数 pack，支持将基础类型数据，以及其数组，以及 vector 类型进行序列化。 在 pack 函数的基础上，提供一个模板函数 packMultiple，支持将多个数据打包进行序列化。 提供接口函数 finalize，添加包头、包尾，组装成完整的协议，返回序列化后的数据 buffer。1.1. writeToBuffer template &amp;lt;typename T&amp;gt; void writeToBuffer(const T&amp;amp; value) { static_assert(std::is_integral_v&amp;lt;T&amp;gt; || std::is_floating_point_v&amp;lt;T&amp;gt;, &quot;Type must be arithmetic&quot;); const uint8_t* bytes = reinterpret_cast&amp;lt;const uint8_t*&amp;gt;(&amp;amp;value); for (size_t i = 0; i &amp;lt; sizeof(T); i++) { buffer_.push_back(bytes[i]); } } template &amp;lt;typename T&amp;gt;...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/%E6%9E%84%E5%BB%BA%E4%B8%80%E4%B8%AA%E9%80%9A%E4%BF%A1%E7%94%A8%E5%BA%8F%E5%88%97%E5%8C%96%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96%E6%A8%A1%E5%9D%97/";
          
        },
      },{id: "post-static-cast-与-reinterpret-cast",
        
          title: "static_cast 与 reinterpret_cast",
        
        description: "1. static_cast 编译时类型检查 只允许安全的、有意义的类型转换 会进行必要的类型转换计算static_cast不能用于在不同类型的指针之间互相转换，也不能用于整型和指针之间的互相转换。示例：// 数值类型转换int i = 42;double d = static_cast&amp;lt;double&amp;gt;(i);// 基类与派生类之间的转换（向上转换总是安全的）Derived* derived = new Derived();Base* base = static_cast&amp;lt;Base*&amp;gt;(derived);// void* 转换为具体类型指针void* ptr = malloc(sizeof(int));int* intPtr = static_cast&amp;lt;int*&amp;gt;(ptr);2. reinterpret_cast 几乎不进行类型检查 直接重新解释内存中的位模式 非常危险，需要程序员确保安全性示例：// 指针与整数之间的转换int* ptr = new int(42);uintptr_t addr = reinterpret_cast&amp;lt;uintptr_t&amp;gt;(ptr);// 不相关类型指针之间的转换char* charPtr = reinterpret_cast&amp;lt;char*&amp;gt;(ptr);// 函数指针转换void (*funcPtr)() = reinterpret_cast&amp;lt;void(*)()&amp;gt;(some_address);3. 对比 特性 static_cast reinterpret_cast 安全性 高，编译时检查 低，几乎无检查 性能 可能有运行时开销 无运行时开销 用途 合理的类型转换...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/static_cast_vs_reinterpret_cast/";
          
        },
      },{id: "post-c-template-学习资料",
        
          title: "C++ template 学习资料",
        
        description: "现代C++模板教程          github – Modern-Cpp-templates-tutorial      现代C++模板教程        C++ Templates 2ed          github – Cpp-Templates-2ed      Cpp-Templates-2ed        github – CppTemplateTutorial  boost – Simple C++11 metaprogramming",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cpp_template_study_res/";
          
        },
      },{id: "post-使用-cmake-cpack-nsis-打包-qt-应用",
        
          title: "使用 CMake CPack NSIS 打包 Qt 应用",
        
        description: "if(WIN32 AND NOT UNIX) get_target_property(qmake_executable Qt6::qmake IMPORTED_LOCATION) get_filename_component(_qt_bin_dir &quot;${qmake_executable}&quot; DIRECTORY) find_program(WINDEPLOYQT_EXECUTABLE windeployqt HINTS &quot;${_qt_bin_dir}&quot;) message(STATUS &quot;Using windeployqt: ${WINDEPLOYQT_EXECUTABLE}&quot;) message(STATUS &quot;qt bin dir: ${_qt_bin_dir}&quot;) add_custom_command(TARGET ${target_name} POST_BUILD COMMAND &quot;${WINDEPLOYQT_EXECUTABLE}&quot; $&amp;lt;$&amp;lt;CONFIG:Debug&amp;gt;:--debug&amp;gt; $&amp;lt;$&amp;lt;NOT:$&amp;lt;CONFIG:Debug&amp;gt;&amp;gt;:--release&amp;gt; --libdir $&amp;lt;TARGET_FILE_DIR:${target_name}&amp;gt; --verbose 0 --compiler-runtime --no-opengl-sw --force --plugindir &quot;$&amp;lt;TARGET_FILE_DIR:${target_name}&amp;gt;/plugins&quot; $&amp;lt;TARGET_FILE:${target_name}&amp;gt; COMMENT &quot;Deploying Qt...&quot; ) if(QT_VERSION_MAJOR EQUAL 6) qt_finalize_executable(${target_name}) endif() include(GNUInstallDirs) install(PROGRAMS $&amp;lt;TARGET_FILE:${target_name}&amp;gt; DESTINATION . # TYPE BIN ) install(DIRECTORY $&amp;lt;TARGET_FILE_DIR:${target_name}&amp;gt;/...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qt_cpack_nsis/";
          
        },
      },{id: "post-cmake-export-命令以及-install-命令",
        
          title: "CMake export 命令以及 install 命令",
        
        description: "1. export 导出一个库export命令用于导出一个库，导出的库可以被其他项目使用。如下cmake命令生成库gcFactSystem，并导出库以及库的头文件（使用PUBLIC）。set(target_name &quot;gcFactSystem&quot;)# compile library gcFactSystem# export library gcFactSystem to gcFactSystemConfig.cmaketarget_include_directories(${target_name} PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${CMAKE_CURRENT_SOURCE_DIR}/validator)export(TARGETS ${target_name} FILE &quot;${CMAKE_CURRENT_BINARY_DIR}/${target_name}Targets.cmake&quot;)生成gcFactSystemTargets.cmake，里面包含了目标库，以及头文件包含路径：set_target_properties(gcFactSystem PROPERTIES INTERFACE_INCLUDE_DIRECTORIES &quot;D:/work/ground_station/dev/jhatcgcs/src/FactSystem;D:/work/ground_station/dev/jhatcgcs/src/FactSystem/validator&quot; INTERFACE_SOURCES &quot;\$&amp;lt;\$&amp;lt;BOOL:\$&amp;lt;TARGET_PROPERTY:QT_CONSUMES_METATYPES&amp;gt;&amp;gt;:D:/work/ground_station/dev/jhatcgcs/build/src/FactSystem/meta_types/qt6gcfactsystem_debug_metatypes.json&amp;gt;&quot;)set_target_properties(gcFactSystem PROPERTIES IMPORTED_IMPLIB_DEBUG &quot;D:/work/ground_station/dev/jhatcgcs/bin/gcFactSystem.lib&quot; IMPORTED_LINK_DEPENDENT_LIBRARIES_DEBUG &quot;Qt6::Core;Qt6::Qml;gcLogging;gcMAVLink&quot; IMPORTED_LOCATION_DEBUG &quot;D:/work/ground_station/dev/jhatcgcs/bin/gcFactSystem.dll&quot;)工程中的其他模块使用被export出来的库：target_link_libraries(${target_name} PRIVATE gcFactSystem)2. install 安装库# 引入要用到的 CMake 模块include(CMakePackageConfigHelpers)include(GNUInstallDirs)# 基本安装及 Targets 文件的生成install(TARGETS ${PROJECT_NAME} EXPORT ${PROJECT_NAME}-targets RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR} LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR} ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR} INCLUDES DESTINATION ${CMAKE_INSTALL_INCLUDEDIR})# Targets 文件的安装install(EXPORT ${PROJECT_NAME}-targets FILE ${PROJECT_NAME}-targets.cmake...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cmake_export_and_install/";
          
        },
      },{id: "post-mavlink消息的打包和解包",
        
          title: "MAVLink消息的打包和解包",
        
        description: "以心跳包为例，消息格式定义在common.xml中。1. 打包心跳包的打包函数为mavlink_msg_heartbeat_encode，将heartbeat作为msg的payload，并计算MAVLink消息的其余域，即完成填充所有内容到msg中。static inline uint16_t mavlink_msg_heartbeat_encode(uint8_t system_id, uint8_t component_id, mavlink_message_t* msg, const mavlink_heartbeat_t* heartbeat) { return mavlink_msg_heartbeat_pack(system_id, component_id, msg, heartbeat-&amp;gt;type, heartbeat-&amp;gt;autopilot, heartbeat-&amp;gt;base_mode, heartbeat-&amp;gt;custom_mode, heartbeat-&amp;gt;system_status);}其他msgid消息类似，调用mavlink_msg_xxx_encode，并调用mavlink_msg_xxx_pack函数进行打包。其中mavlink_msg_heartbeat_pack函数首先将mavlink_heartbeat_t中的内容填充到msg的payload中，然后调用mavlink_finalize_message计算MAVLink消息的其余域，即完成填充所有内容到msg中。static inline uint16_t mavlink_msg_heartbeat_pack(uint8_t system_id, uint8_t component_id, mavlink_message_t* msg, uint8_t type, uint8_t autopilot, uint8_t base_mode, uint32_t custom_mode, uint8_t system_status){#if MAVLINK_NEED_BYTE_SWAP || !MAVLINK_ALIGNED_FIELDS char buf[MAVLINK_MSG_ID_HEARTBEAT_LEN]; _mav_put_uint32_t(buf, 0, custom_mode); _mav_put_uint8_t(buf, 4, type); _mav_put_uint8_t(buf, 5, autopilot); _mav_put_uint8_t(buf, 6, base_mode); _mav_put_uint8_t(buf, 7,...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/MAVLink_msg_pack_unpack/";
          
        },
      },{id: "post-mavlink协议",
        
          title: "MAVLink协议",
        
        description: "1. MAVLink v2 协议MAVLink协议格式文档：Packet Serialization1.1. MAVLink协议格式重要字段MAVPACKED(typedef struct __mavlink_message { uint16_t checksum; ///&amp;lt; sent at end of packet uint8_t magic; ///&amp;lt; protocol magic marker uint8_t len; ///&amp;lt; Length of payload uint8_t incompat_flags; ///&amp;lt; flags that must be understood uint8_t compat_flags; ///&amp;lt; flags that can be ignored if not understood uint8_t seq; ///&amp;lt; Sequence of packet uint8_t sysid; ///&amp;lt; ID of message...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/MAVLink_intro/";
          
        },
      },{id: "post-qgc-笔记以及资料",
        
          title: "QGC 笔记以及资料",
        
        description: "1. 资料1.1. QGC资料收集 官方user guide 官方dev guide PR: QML: Various easy optimizations Simple GCS – imGUI Gazebo Sensors：介绍了Gazebo中各种传感器的使用，包括IMU、GPS、相机等，这些传感器的数据可以通过MAVLink协议发送给QGC。 知乎 – 非线性MC：自动驾驶仿真、路径规划相关的文章。 QOpenHD：一个基于QGC的开源FPV图传系统，支持高清视频传输和遥控功能。 QGeoView：基于QGraphicsView的地图显示，无QML。1.2. QGC(master) 编译需要同时按照runtime版本和devel版本，安装完成之后，设置环境变量GSTREAMER_1_0_ROOT_MSVC_X86_64：GSTREAMER_1_0_ROOT_MSVC_X86_64 = d:\dev_libs\gstreamer\1.0\msvc_x86_64\ Download GStreamer Gstreamer安装和使用 pkg-config for windows gstreamer 中文教程 常见问题：GStreamer的使用 PX4 – Simulation2. QGC 核心架构图示UML 核心类图（下载本地放大查看）：核心系统分析图（下载本地放大查看）：引用： CSDN – QGC(GGroundControl) 系统核心架构图3. QGC / MAVLink 通信流程flowchart TD A[QGC Application] --&amp;gt; B[VehicleLinkManager] B --&amp;gt; C1[UDP Link] B...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/QGC%E7%AC%94%E8%AE%B0%E5%8F%8A%E8%B5%84%E6%96%99/";
          
        },
      },{id: "post-c-对象模型-多继承",
        
          title: "C++对象模型--多继承",
        
        description: "1. 多继承–无虚拟继承class Base1 {public: int a; int b;};class Base2 {public: int c; int d;};class Derive : public Base1 , public Base2 {public: int e; int f;};内存布局顺序为：Base1的成员变量 -&amp;gt; Base2的成员变量 -&amp;gt; Derive的成员变量。如下图所示（图中一格表示4字节）：1.1 指针调整当进行Derive / Base 指针赋值或比较时，编译器对Base / Derive 指针进行偏移调整。int main() { Derive* d_ptr = new Derive(); Base2* b2_ptr = d_ptr; Base1* b1_ptr = d_ptr; printf(&quot;address of d_ptr = %p\n&quot;, d_ptr); printf(&quot;address of...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/C++%E5%AF%B9%E8%B1%A1%E6%A8%A1%E5%9E%8B-%E5%A4%9A%E7%BB%A7%E6%89%BF/";
          
        },
      },{id: "post-windows编译安装vtk-tcl-tk-occ",
        
          title: "Windows编译安装VTK, TCL/TK, OCC",
        
        description: "1. 预编译及安装的三方库  zlib  freeType  FreeImage1.1. freeTypefreeType在Windows下编译成动态库，需要做些修改：根目录下CMakeLists.txt：# add_library(freetype ....add_library(freetype SHARED...)  freeType编译之后，cmake配置OCC时找不到freeType相关库，使用官方提供的编译好的三方库替代OCC Release。1.2. FreeImageFreeImage选择下载编译好的文件（没有Debug版本）。或选择第三方修改的仓库FreeImage-Cmake2. VTKTODO3. TCL/TK下载及编译TCL/TK 8.6.16源码：  TCL 8.6.16 http://prdownloads.sourceforge.net/tcl/tcl8616-src.zip  TK 8.6.16 http://prdownloads.sourceforge.net/tcl/tk8616-src.zip分别修改TCL及TK子目录win下的rules.vc文件：# SUFX     = tsgx# 修改为以下内容SUFX     = sgx编译及安装TCL：nmake -f makefile.vc INSTALLDIR=d:\dev_libs\occnmake -f makefile.vc install INSTALLDIR=d:\dev_libs\occ编译及安装TK：nmake -f makefile.vc INSTALLDIR=d:\dev_libs\occ TCLDIR=D:\work\3rd\occ_packages\tcl8.6.16nmake -f makefile.vc install INSTALLDIR=d:\dev_libs\occ TCLDIR=D:\work\3rd\occ_packages\tcl8.6.164. OCC  OCC Release参考  tcl/tk编译  Build 3rd-parties",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/windows-build-tcl-tk-occ/";
          
        },
      },{id: "post-系统监控工具套件sysstat的使用",
        
          title: "系统监控工具套件sysstat的使用",
        
        description: "# https://sysstat.github.io/sudo apt-get install sysstatsudo dpkg-reconfigure sysstat # select &quot;Yes&quot;sar（System Activity Reporter 系统活动情况报告）是目前Linux上最为全面的系统性能分析工具之一，可以从多方面对系统的活动进行报告，包括：文件的读写情况、系统调用的使用情况、磁盘I/O、CPU效率、内存使用状况、进程活动及IPC有关的活动等。Linux内核维护着一些内部计数器，这些计数器包含了所有的请求及其完成时间和I/O块数等信息，sar命令从所有的这些信息中计算出请求的利用率和比例，以便找出瓶颈所在。1. sar 命令的使用用法语法：用法: sar [ 选项 ] [ &amp;lt;时间间隔&amp;gt; [ &amp;lt;次数&amp;gt; ] ]主选项和报告： -b I/O 和传输速率信息状况 -B 分页状况 -d 块设备状况 -I { &amp;lt;中断&amp;gt; | SUM | ALL | XALL } 中断信息状况 -m 电源管理信息状况 -n { &amp;lt;关键词&amp;gt; [,...] | ALL } 网络统计信息 关键词可以是： DEV 网卡 EDEV 网卡 (错误) NFS...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/%E7%B3%BB%E7%BB%9F%E7%9B%91%E6%8E%A7%E5%B7%A5%E5%85%B7sysstat/";
          
        },
      },{id: "post-待翻译-performance-hints",
        
          title: "待翻译 -- Performance Hints",
        
        description: "Performance Hints – Jeff Dean  微信中文翻译  All About Rooflines  Algorithms for Modern Hardware",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Performance-Hints/";
          
        },
      },{id: "post-occ-待学习资料记录",
        
          title: "OCC 待学习资料记录",
        
        description: "1. 笔记1.1. 求交对二次曲线与二次曲面求交，使用解析几何的方法，计算出交点，依赖底层数学库math_DirectPolynomialRoots。类math_DirectPolynomialRoots可以对最多4次方程进行求解。如下曲面可以使用二次曲线表示，并使用解析几何求交： I_gp_Pln：二次曲面特例； I_gp_Sphere：解析球面； I_gp_Cylinder：解析柱面； I_gp_Cone：解析锥面；这些曲面都可以使用二次曲线表示，即这个二次曲线方程的参数确定的上述这些曲面。OCC中相应的类为IntAna_Quaric。二次曲线与自由曲面求交，使用数值计算方法，即Newton-Raphson迭代逐次逼近 数学之美：牛顿-拉夫逊迭代法原理及其实现。 OpenCASCADE 线面求交 解析几何求交之直线与二次曲面 Modeling Algorithms1.2. OCC中的实体表示 – ModellingOCC表示B-Rep，其核心概念有两个：几何，拓扑。几何表示实体的形状，如二次曲线方程，Bezier曲线、NURBS曲线等。拓扑为存储结构，是一个树形结构，组成一个实体的各个部分，如顶点、边、面、体、轮廓等。 OpenCascade Overview2. Quaoar Workshop 的学习资料 youtube教学视频 开源项目 Analysis Situs OCC论坛 Analysis Situs Forums gitlab – AnalysisSitus3. 开源项目 Mayo Get started with Mayo github – Mayo4. FreeCAD github – Module developer’s guide to FreeCAD source code – FreeCAD overview and architecture github – CAD modules...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/OCCT-study-notes/";
          
        },
      },{id: "post-nvidia-jetson-orin-agx-安装",
        
          title: "NVIDIA Jetson Orin AGX 安装",
        
        description: "使用 Nvidia Jetson SDK Manager 安装 Jetson Orin AGX 系列设备的系统镜像。截止目前最新版为 6.2.2，系统镜像为 Ubuntu 22.04（SDK Manager 7.2 将升级到 Ubuntu 24.03）。安装完成之后，安装如下软件包：# 安装 Pythonsudo apt updatesudo apt install python3sudo apt install python3-pip# 安装 jtopsudo pip3 install -U pipsudo pip3 install jetson-statssudo apt install nvidia-jetpack查看已经安装的组件： git clone https://github.com/jetsonhacks/jetsonUtilities.git # python jetsonInfo.py软件包更新1. Ubuntu 22.04 更新安装 CMake 3.28wget https://github.com/Kitware/CMake/releases/download/v3.28.5/cmake-3.28.5-linux-aarch64.shchmod +x cmake-3.28.5-linux-aarch64.shsudo ./cmake-3.28.5-linux-aarch64.sh --prefix=/usr/local --skip-license2. 安装 GTestsudo apt...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/NVIDIA-Jetson-Orin-AGX-%E5%AE%89%E8%A3%85/";
          
        },
      },{id: "post-ampere-gpu-新特性",
        
          title: "Ampere GPU 新特性",
        
        description: "1. Async Copy异步拷贝cp.async（即指令LDGSTS）支持4/8/16字节单位的拷贝，其中：  4/8字节单位的拷贝：L2 -&amp;gt; L1 -&amp;gt; SMEM；  16字节单位的拷贝(Bypass L1)：L2 -&amp;gt; SMEM。明显的，16字节单位的拷贝性能最高。另外，cp.async需要使用commit/wait指令来配合使用。A. 资料  4.11. Asynchronous Data Copies：官方文档，介绍cp.async  CUDA 11 NEW FEATURES(pdf)：Ampere 新特性介绍  CUDA on NVIDIA GPU AMPERE MICROARCHITECTURE Taking your algorithms to the next level of performance(pdf)",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA-Ampere-Feature/";
          
        },
      },{id: "post-使用-cute-tiled-copy-tiled-mma-以及-multi-stage-实现高性能-gemm",
        
          title: "使用 CuTe Tiled Copy、Tiled MMA 以及 Multi-Stage 实现高性能 GEMM",
        
        description: "代码： https://github.com/HPC02/cuda_perf/blob/master/src/cute_gemm_sm80/gemm_sm80.cu https://github.com/HPC02/cuda_perf/blob/master/src/cute_gemm_sm80/kernel_sm80.cuhTODO：GMEM -&amp;gt; SMEM 不会产生 bank conflicts？配置流程及约束概览： 定义 CTA tile 大小TODO 定义 GMEM -&amp;gt; SMEM 的 Tiled Copy 配置TODO 定义 Tiled MMA 配置（包含SMEM TiledCopy）TODO 定义 SMEM swizzle 配置，以及SMEM Layout（包含multi-stage）TODO 大部分内容已经在其他文章中记录： CUTLASS-Cute 初步(4.1)：MMA Swizzle – MMA、ldmatrix、smem swizzle； CUTLASS-Cute 初步(6)：CUDA GEMM 计算优化、Multi-Stage 与软流水(Software Pipelining)。 CUDA 笔记集合：其中第一个章节：cutlass/CuTe GEMM 中矩阵的存储方式 NT / TN / NN / TT。 本文主要记录一些第三方资料，见末尾附录。1. 定义 block tile 大小配置 CTA...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CuTe-GEMM-TiledCopy-TiledMMA-Pipeline/";
          
        },
      },{id: "post-gemm-版本1-使用-cute-实现一个-naive-gemm",
        
          title: "GEMM 版本1：使用 CuTe 实现一个 naive GEMM",
        
        description: "1. navie tile GEMM 代码文件：navie tile GEMM基于分块矩阵乘法的简单实现，按照 Thread Block 将矩阵划分为多个tile进行计算，在 Thread Block内，再次将 tile 划分为多个子块，由每个线程负责计算子块。使用 Shared Memory 来缓存 tile 数据，减少全局内存访问次数。每个线程负责从全局内存中复制 tile 内的一小块内存到 Shared Memory。 循环展开#pragma unroll优化加载和计算部分的循环，提高指令级并行性（消耗更多寄存器资源），本代码测试整体运行时间提升15%左右。2. CuTe 版本 naive tile GEMM 代码文件：CuTe naive tile GEMM使用 CuTe 库重写的分块矩阵乘法，使用 slice-k 方法，即分块（tile）沿着 K 维度累加所有结果子矩阵。 使用 NVIDIA CuTe 库重写的分块矩阵乘法实现，采用 cute::gemm 期望的标准布局。2.1. 矩阵布局约定采用 BLAS/Fortran 风格的列主序 (Column-major)： Tensor Shape Stride 说明 A (M, K) (1, M) 列主序，M方向连续...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/GEMM1-Cute-naive-GEMM/";
          
        },
      },{id: "post-cutlass-cute-初步-6-cuda-gemm-计算优化-multi-stage-与软流水-software-pipelining",
        
          title: "CUTLASS-Cute 初步(6)：CUDA GEMM 计算优化、Multi-Stage 与软流水(Software Pipelining)",
        
        description: "整个GEMM可用如下公式表示：\[C[i, j] = \sum_{k=0}^{nK-1} A[i, k] \times B[k, j]\] 层级 说明 Thread Block Tile 每个 CUDA 线程块（thread block）负责计算输出矩阵 C 的一个子块（tile） Warp Tile 在线程块内部，每个 warp（32个线程）负责计算 thread block tile 的一个子区域 Thread Tile 在 warp 内部，每个线程负责计算 warp tile 的一个更小的子区域 1. GEMM 计算步骤–分层 GEMM 结构依照硬件架构层次划分（也即 CUDA 编程模型），GEMM 计算可以分为多个层次：Thread Block Tile -&amp;gt; Warp Tile -&amp;gt; Thread Tile。即将一个大矩阵的算术运算，依次分解，直到最小的线程级别，一个线程计算一小部分的 tile。数据搬运过程分为几步：GMEM -&amp;gt; Shared Memory -&amp;gt; Register File -&amp;gt;...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A56-Pipeline-And-Multi-Stage/";
          
        },
      },{id: "post-cutlass-cute-初步-5-tv-layout",
        
          title: "CUTLASS-Cute 初步(5)：TV Layout",
        
        description: "TV-Layout 描述 CTA 中线程的 layout，以及每个线程可以访问到哪些数据。TV-Layout 的第一个 mode 定义线程在 CTA 中的分布，第二个 mode 定义每个线程处理的数据布局。见下面例子中的LayoutA_TV。数学表述形式为：$\text{TV-Layout}:(t,v) -&amp;gt; \text{linear index in tile}$。以 LayoutA_TV: ((_4,_8),(_2,_2,_2)):((_32,_1),(_16,_8,_128)) 为例：(t0,t1, v0,v1,v2) → t0×32 + t1×1 + v0×16 + v1×8 + v2×128Thread 5 (t0=1, t1=1), Value 0 (v0=0,v1=0,v2=0):→ 1×32 + 1×1 = 33 → A矩阵线性坐标 33Inverse TV-Layout 描述的是数据的逻辑坐标 coord 到线程ID的映射关系。比如给定 layout 的逻辑坐标 (m, n)，经过 inverse TV-Layout 得到 (threadID, valueID)，即： threadID，表示该逻辑坐标 (m,...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A55-TV-Layout/";
          
        },
      },{id: "post-cutlass-cute-初步-4-1-mma-swizzle-mma-ldmatrix-smem-swizzle",
        
          title: "CUTLASS-Cute 初步(4.1)：MMA Swizzle -- MMA、ldmatrix、smem swizzle",
        
        description: "1. ldmatrix 指令 与 MMA 指令一些名词： LDS：LoaD Shared Memory，warp 指令，比如 LDS.32 表示加载 32 位数据到寄存器 LDSM：LoaD Shared Memory Matrix，Tensor Core 指令，ldmatrix的 SASS 表示ldmatrix指令为配合 Tensor Core 的 MMA 指令使用的，数据在RF中的布局与mma指令一致（准确的理解应该是：加载RF之后的Thread-Value布局）。ldmatrix指令格式为（以.x1、.x4为例）：ldmatrix.sync.aligned.m8n8.x1.shared.b16{.trans} { %0 }, [ %1 ]ldmatrix.sync.aligned.m8n8.x4.shared.b16{.trans} { %0, %1, %2, %3 }, [ %4 ]一个ldmatrix.x1指令加载一个8x8-BF16 = 128B矩阵，占用8个线程（比如0~7），并将从SMEM中加载的数据均分到一个warp 32个线程中，在warp线程中以32位寄存器存储。格式如下： ldmatrix.x1要求提供8 x (8-BF16 = 16B) SMEM地址（每个线程提供一个，共8个线程），且每个地址16B且连续。 REG均分规律：T0 SMEM（16B = 8-BF16 = 4-REG） =&amp;gt; T0、T1、T2、T3；T1 SMEM...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A54.1-mma-ldmatrix-swizzle/";
          
        },
      },{id: "post-cutlass-cute-初步-4-swizzle",
        
          title: "CUTLASS-Cute 初步(4)：Swizzle",
        
        description: "Swizzle作用于SMEM的layout。给定layout范围内，Swizzle通过列异或操作（icol = irow ^ icol），周期性的coord重排，映射到新的物理地址offset。Swizzle定义了三个参数： $MBase$：以 $2^M$ 个一维坐标连续的元素为单位，将其当做一个元素； $SShift$：从Offset中提取的高位偏移，用于提取Offset的lead dimension； $BBits$：参与XOR的位数，用于提取一维index中的lead dimension、fast dimension中的部分bits。引用reed解释及图示，其输入为一个一维坐标的layout，通过swizzle将其拆分为二维坐标表示形式：给定义一个输入Offset:&amp;lt;LeadBits:FastBits&amp;gt;： 提取关系为：BBits+MBase -&amp;gt; FastBits，SShift+MBase -&amp;gt; LeadBits。 参与XOR操作的位宽为：BBits，即LeadBits中的低BBits位，FastBits中的高BBits位。BBits表示有$2^B$个交换模式，SShift表示交换模式的周期。通常$\mid{S}\mid \ge B$，如果$\mid{S}\mid \gt B$，则此交换模式重复$2^{\mid{S}\mid - B}$次，如果$\mid{S}\mid = B$，则只套用一次此交换模式。一般在设置Swizzle参数时，按输入的layout一行（准确的说是fast dimension）为周期进行swizzle，$2^{S+M}$ = 输入layout的列长度（此处仅指逻辑上的，实际完整的计算公式还需要考虑到元素存储字节数，具体见下面章Swizzle 参数设计规则）。比如 half 类型的layout (8, 32):(32, 1)，定义swizzle&amp;lt;3, 3, 3&amp;gt;，即 8 个元素形成新的最小单位（M），8 个最小单位为一行（B），所以swizzle从$8 \times 8 = 64$个元素开始。见下面示例。B 为 8，则整个swizzle周期为 8 行。 设计Swizzle参数时，要求S &amp;gt;= B，否则不能提取到LeadBits。 设计Layout时，如果Layout的fast dimension长度小于 $2^{S+M}$，Swizzle不能完整的提取LeadBits，导致Swizzle失效或部分失效。 异或操作数学符号为 $\oplus$。1. Cute Swizzle 示例定义...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A54-swizzle/";
          
        },
      },{id: "post-cutlass-cute-初步-3-1-tiledcopy-以及-tiledmma-配置示例",
        
          title: "CUTLASS-Cute 初步(3.1)：TiledCopy 以及 TiledMMA 配置示例",
        
        description: "cute_tiled_mma_preview.cu // Configure data type. using TA = cute::half_t; using TB = cute::half_t; using TC = cute::half_t; // Configure static &quot;shared memory&quot;. // The &quot;shared memory&quot; is actually on host for preview purpose. // For tiled mma, the shared memory layout has to be static. constexpr int bM{128 * 2 / sizeof(TA)}; constexpr int bN{128 * 2 / sizeof(TB)}; constexpr...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A53.1-TileMMA%E9%85%8D%E7%BD%AE%E7%A4%BA%E4%BE%8B/";
          
        },
      },{id: "post-cutlass-cute-初步-3-tiledcopy-以及-tiledmma",
        
          title: "CUTLASS-Cute 初步(3)：TiledCopy 以及 TiledMMA",
        
        description: "1. Cute TiledCopy tiled_copy.cu：官方示例层次化的copy抽象，分为几个可组合的层次： CopyOperation：NVidia在不同的硬件架构、不同的存储层次之间数据搬运提供了不同的指令，如ldmatrix和LDS等，还有针对Ampere架构的cp.async等。 Copy_Traits：主要提供拷贝的metadata信息：源Thread-Value Layout、目标Thread-Value Layout等。 Copy_Atom：封装一个完整的最小数据搬运单元，包含CopyOperation和Copy_Traits。 TiledCopy：根据线程布局，重复使用Copy_Atom完成分块数据搬运计算。 make_tiled_copy{_A|B|C}：提供用户级别的API接口；1.1. CopyOperationCopyOperation封装了执行一次数据搬运指令，以及所需要的指令参数。其中指令参数（源参数、目的参数）描述了参数的类型以及个数，供API层级的copy函数使用。示例：struct SM75_U16x8_LDSM_T{ using SRegisters = uint128_t[1]; using DRegisters = uint32_t[4]; CUTE_HOST_DEVICE static void copy(uint128_t const&amp;amp; smem_src, uint32_t&amp;amp; dst0, uint32_t&amp;amp; dst1, uint32_t&amp;amp; dst2, uint32_t&amp;amp; dst3) {#if defined(CUTE_ARCH_LDSM_SM75_ACTIVATED) uint32_t smem_int_ptr = cast_smem_ptr_to_uint(&amp;amp;smem_src); asm volatile (&quot;ldmatrix.sync.aligned.x4.trans.m8n8.shared.b16 {%0, %1, %2, %3}, [%4];\n&quot; : &quot;=r&quot;(dst0), &quot;=r&quot;(dst1), &quot;=r&quot;(dst2), &quot;=r&quot;(dst3) : &quot;r&quot;(smem_int_ptr));#else CUTE_INVALID_CONTROL_PATH(&quot;Trying to use ldmatrix...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A53-TiledCopy-TiledMMA/";
          
        },
      },{id: "post-cutlass-cute-初步-2-1-tensor-amp-layout-实操笔记",
        
          title: "CUTLASS-Cute 初步(2.1)：Tensor &amp; Layout 实操笔记",
        
        description: "1. local_tile给定一个 tiler，使用 local_tile 函数，将 Tensor 按 tiler 的 shape 切分成多个 tile。由于切分之后，每个 tile 保留输入 Tensor 的stride信息，以及rest mode的shape，故称为Inner-Partition。1.1. 示例一：常规使用（常规 CTA 切分）比如有一个 4x6 的 Tensor，将其切分并分配到 thread block，每个 thread block 获取到的 tile 大小为 (2,2)，当前 thread block 的 coord 为 (1,1)，就可以使用如下代码： constexpr int M = 4, N = 6; auto layout = cute::make_layout(cute::make_shape(M, N), cute::make_stride(N, cute::Int&amp;lt;1&amp;gt;{})); auto tensor = cute::make_tensor(h_data.data(), layout); constexpr auto tiler...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A52.1-Tensor-Layout-%E5%AE%9E%E6%93%8D%E7%AC%94%E8%AE%B0/";
          
        },
      },{id: "post-cutlass-cute-初步-2-tensor-amp-layout-algebra",
        
          title: "CUTLASS-Cute 初步(2)：Tensor &amp; Layout Algebra",
        
        description: "github – 测试代码 CuTe Tensors：官方文档1. CuTe 中的 Tensor 划分 (Partitioning a Tensor)在 GEMM 计算是，需要对矩阵进行划分（分块），以便线程块（Thread Block）和线程（Thread）能够并行处理数据。常用的有 Inner-Partitioning、Outer-Partitioning，以及 TV-layout-Partition。1.1. Inner-PartitioningGEMM 计算，先需要按照 Thread Block 划分为若干 Tile，即给每个 Thread Block 分配一个 Tile。如下所示：Tensor A = make_tensor(ptr, make_shape(8,24)); // (8,24)auto tiler = Shape&amp;lt;_4,_8&amp;gt;{}; // (_4,_8)Tensor tiled_a = zipped_divide(A, tiler); // ((_4,_8),(2,3))在使用 tiler 对 A 进行切分之后，(_4, _8) 是第一个mode（first mode），(2, 3) 是第二个mode（second mode）。 第一个 mode (mode 0)：Tile 的 shape...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A52-Tensor-Layout-Algebra/";
          
        },
      },{id: "post-cutlass-cute-初步-1-layout",
        
          title: "CUTLASS-Cute 初步(1)：Layout",
        
        description: "github – Layout 测试代码1. LayoutCute(CUDA Tensor) 是 CUBLASS 扩展，用于简化张量 BLAS 操作和内存布局的管理。最主要的概念是 Tensor 和 Layout： Layout&amp;lt;Shape, Stride&amp;gt;: 定义张量的内存布局，用于将一维内存地址映射到多维张量索引。 Shape：Logical dimensions，张量的逻辑维度/形状。 Stride：Physical steps，每一个维度在内存中的步长/跨度。 Tensor&amp;lt;Engine,Layout&amp;gt;: 定义张量的数据类型/存储和布局。映射公式：offset = Σ (index[i] * stride[i])Layout 本质是一个映射函数，将多维索引映射到一维内存地址。称索引为定义域(domain)，映射得到的地址为值域(codomain)。以一个一维映射为例：如上图 layout (8):(2)，按照映射公式得到 index_phy = index_logic * 2，将连续以一维索引 0,1,2,…7 映射到内存地址 0,2,4,…14。此时： size(layout) = 8 cosize(layout) = 16而如果定义 layout (8):(0)，则所有逻辑索引都映射到内存地址偏移 0，即所有索引映射到同一个地址。此时得到： size(layout) = 8 cosize(layout) = 11.1. CuTe IntTuple定义多维 Tensor 时，可以使用嵌套的 Shape 和...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/Cute%E5%88%9D%E6%AD%A51-Layout/";
          
        },
      },{id: "post-使用-nsight-compute-进行-kernel-性能分析",
        
          title: "使用 Nsight Compute 进行 kernel 性能分析",
        
        description: "测试用例：github – cuda_perf 编译时，加上 -lineinfo 参数，Nsight Compute 分析时，可以看到具体的 C++/cu 代码。 另外一篇性能分析文章：CUDA 架构(1.1)：Hopper架构及性能分析(ncu) + 性能优化。1. 启动配置使用Nsight Compute运行被测试CUDA程序，启动时，指定metrics为full：1.1. 命令行方式# 完整分析，输出到文件ncu --set full -o gemm_sm80_profile ./ncu_gemm_sm80 4096 4096 4096# 查看 memory 相关指标ncu --set memory ./ncu_gemm_sm80 4096 4096 4096# 查看 compute 相关指标ncu --set compute ./ncu_gemm_sm80 4096 4096 4096# 查看 roofline# 1. Memory Throughput(GB/s)、L2 Cache Throughput(GB/s)、Compute (SM) Throughput(TFLOPS/s)# 结果以百分比形式给出，即与理论峰值的比值# 2. SM Active Cycles / Elapsed...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/ncu-%E6%80%A7%E8%83%BD%E5%88%86%E6%9E%90/";
          
        },
      },{id: "post-cuda入门-bank-conflict",
        
          title: "CUDA入门：Bank Conflict",
        
        description: "使用到的测试代码：bank_conflict.cu1. Bank Conflicts (Shared Memory)1.1. Bank 划分针对Shared Memory的访问，CUDA使用bank机制，将shared memory的访问（读/写）映射到不同的bank，以实现并行访问。bank以4字节为单位，共32个bank。这样，一个时钟周期内，可以并行访问32个不同的bank，即访问128字节的数据。映射公式bank index = (address /4) % 32。 ⭐ 每次发起共享内存事务（transation）时，可以从这 32 个 bank 中分别读取一个 32 位数据。以 32 位的字为单位索引，则 bank 以地址的低 5 位进行划分，与高位没有关系。图示transaction：Thread（在CUDA Core中） ↓ 访问Shared Memory ↓[Bank系统处理] ← Transaction 在这里发生 ↓返回数据到Thread举例：warp中定义的shared memory如何映射到banks：__shared__ float s[64];如上变量，其映射如下：1.2. Bank Conflicts在一次transaction的时候，如果，当warp中的不同线程访问到同一个bank中的不同地址时，就会产生Bank Conflicts，导致访问串行化：需要分成多次transaction。有N个线程访问同一个bank，称为N-way Bank Conflicts。 所谓 Bank Conflicts，只与transaction有关，即其由 Shared Memory 访问控制器相关。引用https://forums.developer.nvidia.com/t/how-to-understand-the-bank-conflict-of-shared-mem/260900/2：When you store (or load) more than 4 bytes...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA%E5%85%A5%E9%97%A8-Bank-Conflict/";
          
        },
      },{id: "post-cuda性能概述-影响因素及优化方法",
        
          title: "CUDA性能概述：影响因素及优化方法",
        
        description: "性能分析依据Roofline 模型，该模型根据算术强度（AI）划分两种性能区间（以A100为例）： 内存受限（Memory-bound）：当AI低于13 FLOPs/Byte时，性能由内存带宽决定。 计算受限（Compute-bound）：当AI高于13 FLOPs/Byte时，性能由计算能力决定。1. 性能影响及优化分类1.1. 内存优化 global memory – 数据重用：例如将大块内存数据加载到shared memory，以减少对global memory的访问次数，从而提高AI。 shared memory – Bank Conflicts：比如矩阵计算C = A * B中的共享内存访问冲突，将B矩阵加载到shared memory之后，进行转置，避免Bank Conflicts。 提升global memory带宽利用率。由于warp访问global memory时，是以128字节（32x4字节）为单位进行对齐访问，若warp内线程访问的地址不连续或未对齐，会导致多次transaction，从而降低带宽利用率。建议确保warp内线程访问的地址连续且对齐，以实现单次transaction访问完整的128字节数据。参考：https://www.olcf.ornl.gov/wp-content/uploads/2020/04/04-CUDA-Fundamental-Optimization-Part-2.pdf。 与带宽利用率有关的另一个概念是全局内存合并访问（Global memory coalescing）。即warp内线程访问的地址应连续且对齐，以实现单次transaction访问完整的128字节数据，从而提升带宽利用率。线程内避免跨步长访问。细节参考：https://cseweb.ucsd.edu/classes/wi12/cse260-a/Lectures/Lec09.pdf。1.2. 指令延迟优化 线程块并发（Occupancy）与延迟隐藏：合理配置共享内存和寄存器使用量，使SM可同时调度多个线程块，提高Warp的调度选择范围，从而隐藏内存访问延迟。 线程分叉（Thread Divergence）：Warp中线程执行路径不一致会导致序列化执行，降低吞吐率，建议使用分支无关的代码（如min/max替代if-else）以避免分歧。另外，如果数据分块不能完全分配到32个线程，可使用C+=A*0替代多余的条件分支。1.3. CPU-GPU 交互优化 使用Stream实现计算与数据传输重叠（Overlap）：使用Stream+异步传输+异步启动kernel。 并发启动多个kernel。 传输大块内存。 pinned memory：固定分配出一块内存给CPU/GPU交互使用，禁用内存页管理不会被换出。此时GPU驱动可以直接使用DMA，传输速度接近理论值。2. 参考资料 Introduction to CUDA Performance Optimization：认真看，全面介绍CUDA性能优化，以及以及性能参数计算。 NVIDIA – Fundamental Optimizations in CUDA：pdf文档。3. CUDA、CuTe 及其他资料收集 CUTLASS: Fast Linear Algebra...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA%E6%80%A7%E8%83%BD%E6%A6%82%E8%BF%B0/";
          
        },
      },{id: "post-cuda-架构及对应的计算能力cc",
        
          title: "CUDA 架构及对应的计算能力CC",
        
        description: "1 计算能力 5.x1.1 体系架构计算能力 5.x 的 GPU 设备使用 Maxwell 架构（2014），下图展示了该架构下的流多处理器（SM）的结构示意图（以 GeForce GTX 980 为例）。https://developer.nvidia.com/blog/maxwell-most-advanced-cuda-gpu-ever-made/在 Maxwell 架构下，一个 SM 中包括： 128 个用于算术运算的 CUDA Core（相比于 Kepler 架构的 192 个有所缩减，但是峰值利用效率从 66.7\% 提升到了几乎 100\%）； 32 个用于单精度浮点运算的特殊函数单元； 4 个 warp 调度器； 由所有功能单元共享的常量内存的缓存，可加快从驻留在设备内存中的常量内存空间的读取速度； 24 KB 的纹理/L1 缓存，用于缓存来自全局内存的读取； 64 KB（计算能力 5.0）或 96 KB（计算能力 5.2）的共享内存。还有一个由所有 SM 共享的 L2 缓存（设备级别的，不属于单个 SM），用于缓存对本地或全局内存的访问，包括临时寄存器溢出。应用程序可以通过检查设备属性 l2CacheSize 来查询 L2 缓存大小。值得注意的是，在 Maxwell 架构中，Texture Cache 和普通全局内存数据的缓存（L1）合并成了 Unified...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA%E6%9E%B6%E6%9E%84%E5%8F%8A%E5%85%B6%E8%AE%A1%E7%AE%97%E8%83%BD%E5%8A%9BCC/";
          
        },
      },{id: "post-cuda-架构-1-1-hopper架构及性能分析-ncu-性能优化",
        
          title: "CUDA 架构(1.1)：Hopper架构及性能分析(ncu) + 性能优化",
        
        description: "1. GPU thread hierarchy, SIMT, and Warp divergence1.1. Thread Hierarchy: Grid &amp;amp; Blocksgrid是thread blocks的集合，代表这次启动kernel的全部工作。thread block之间完全独立，不能共享数据，不能通过__syncthreads同步，不能假设他们的执行顺序，不能假设两个thread block同时启动及运行。有关thread block与SM： 若干个thread block可以同时在一个SM上运行（可以达到Hide Latency），前提是它们的资源需求（寄存器、共享内存等）满足SM的资源限制（Occupancy）。 同一个thread block的所有线程必须在同一个SM上运行，因为它们需要共享资源（如共享内存）和进行同步。\[占用率Occupancy = \frac{\text{SM上实际驻留的Warp数}}{\text{SM支持的最大Warp数}}\] 资源 SM上限 如何影响 最大Block数 32 硬性上限，不管Block多小 最大Warp数 64 即最多2048个线程同时驻留 最大线程数 2048 同上 寄存器文件 65536个32-bit寄存器 每个线程用的寄存器越多，能驻留的线程越少 共享内存 最大228 KB 每个Block用的shared memory越多，能放的Block越少 计算Occupancy举例：场景1：每个Block有256个线程，每个线程用32个寄存器，每个Block用0 shared memory线程数限制： 2048 / 256 = 8 个BlockWarp数限制： 64 / (256/32) = 64/8 = 8...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA%E6%9E%B6%E6%9E%841.1-Hopper%E5%8F%8A%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/";
          
        },
      },{id: "post-cuda-架构",
        
          title: "CUDA 架构",
        
        description: "1. 硬件结构英伟达CUDA/GPU架构演变，以及不同架构的硬件能力：硬件层次结构如下（以Fermi架构为例）： 一个GPU中包含若干个SM（Streaming Multiprocessor，流多处理器），对应上图中左边； 一个SM中包含32个CUDA Core（也叫SP），对应上图中右边； 一个CUDA Core中包含一个ALU，一个FPU。 有些SM中还包含Tensor Core，与CUDA Core协同参与计算。1.1. 缓存层级一个CUDA Core内部，包含： Register File：16K 32-bit寄存器文件； L0 I-Cache一个SM内部，包含： Shared Memory：一个SM内部的threads可访问（一个Thread Block内的所有线程可访问）； L1 Cache：一个SM内部的threads可访问； Constant Cache； Register File：编译时分配给每个thread使用的寄存器文件。 注意：高级的 NVIDIA GPU 中，包含若干个 Subcore，比如 Ampere 架构的 GPU 中包含4个 Subcore，每个 Subcore 包含 32 个 CUDA Core 和 1 个 Tensor Core。如下图所示：https://developer.nvidia.com/blog/nvidia-ampere-architecture-in-depth/整个GPU内部，包含： L2 Cache：所有SM共享访问； Global Memory：所有SM共享访问。内存访问速度示意图： 注1：Shared Memory与L1 Cache共享片上内存，通过cudaFuncSetAttribute(kernel_name, cudaFuncAttributePreferredSharedMemoryCarveout, carveout);提示驱动分配多少给Shared Memory，但是尽量不要使用这个函数。资料： CUDA: GPU内存架构示意。文章结尾有一些内存优化相关链接。...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA%E6%9E%B6%E6%9E%84/";
          
        },
      },{id: "post-hpc-零散笔记集合",
        
          title: "HPC 零散笔记集合",
        
        description: "1. 概念：带宽(Bandwidth) vs 延迟(Latency)定义如下： 带宽(Bandwidth)：单位时间内能传输的数据量，通常以 GB/s 或 TB/s 表示。 延迟(Latency)：发出一次内存访问请求到数据返回所需的时间，通常以 ns（纳秒）或 时钟周期 表示。在不同的应用场景下，强调的性能指标不同。比如在AI训练中，需要持续搬运大量数据，比如大量密集的GEMM计算，即此时是计算密集型。另外，CPU/GPU 的算力极强。这种情况下，带宽经常成为性能瓶颈。而针对推理场景，由于其访问数据是随机访问的 KV-Cache，细粒度、低复用，带宽利用率低。这种情形下，等待数据的时间，即延迟成为性能瓶颈。推理与训练的对比如下： 对比项 训练 推理（Decode 阶段） Batch size 大（数百~数千） 小（1~几十） 数据访问模式 连续大块读写 逐 token 随机小块访问 计算强度 高（Compute-bound） 低（Memory-bound） KV Cache 访问 无 每步都要读取历史 KV 带宽 vs 延迟区别总结： 指标 带宽 延迟 衡量什么 数据吞吐量（多宽） 访问响应时间（多快） 单位 GB/s, TB/s ns, 时钟周期 决定因素 总线宽度、内存并行度 物理距离、内存层级 训练瓶颈 ✅ 主要瓶颈 次要（大 batch 可掩盖）...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/HPC%E7%AC%94%E8%AE%B0-%E9%9B%B6%E6%95%A3%E6%A6%82%E5%BF%B5/";
          
        },
      },{id: "post-cuda-笔记集合",
        
          title: "CUDA 笔记集合",
        
        description: "1. cutlass/CuTe GEMM 中矩阵的存储方式 NT / TN / NN / TT1.1. 背景BLAS 的约定是：所有矩阵一律按 column-major 存储，然后用 transA/transB 标志告诉 BLAS 要不要对它做转置：\[C = \alpha \cdot op(A) \cdot op(B) + \beta \cdot C\]其中： 当transX为N时：$op(X) = X$，当transX为T时：$op(X) = X^T$。 乘法要求 $op(A)$ 是 $M \times K$，$op(B)$ 是 $K \times N$。1.2. GEMM 命名含义CuTe给矩阵做了一个约定：A(M, K)，B(N, K)，C(M, N)，即： A 矩阵：(M，K) – M 行 K 列 B 矩阵：(N，K) – N...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/CUDA%E7%AC%94%E8%AE%B0%E9%9B%86%E5%90%88/";
          
        },
      },{id: "post-c-右值引用-万能引用-完美转发",
        
          title: "C++ 右值引用，万能引用，完美转发",
        
        description: "主要概念：  引用的本质在C++内部实现是一个常指针。  左值引用，右值引用。右值引用限制了其只能接收右值，可以利用这个特性从而提供重载。  template 万能引用，引用折叠。  完美转发：std::forward 。完美转发 std::forward模板的万能引用只是提供了能够接收同时接收左值引用和右值引用的能力，但是引用类型的唯一作用就是限制了接收的类型，后续使用中都退化成了左值，我们希望能够在传递过程中保持它的左值或者右值的属性, 如果不使用forward，直接按照下面的方式写就会导致问题。void RFn(int&amp;amp;&amp;amp; arg){}template&amp;lt;typename T&amp;gt;void ProxyFn(T&amp;amp;&amp;amp; arg){      RFn(arg);}void main(){     ProxyFn(1);}会发现右值版本不能传过去, [int]无法到[int&amp;amp;&amp;amp;]，就导致参数不匹配。  C++: 左值引用(&amp;amp;), 右值引用(&amp;amp;&amp;amp;),万能引用(template &amp;amp;&amp;amp;)详解 与 完美转发(forward) 实现剖析  说一下C++左值引用和右值引用",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cpp-rvalue/";
          
        },
      },{id: "post-io多路复用与linux-epoll",
        
          title: "IO多路复用与linux epoll",
        
        description: "定义：I/O多路复用是指在单线程中同时监视多个文件描述符的状态变化（如可读、可写、异常等），当其中一个或多个文件描述符发生状态变化时，内核会通知应用程序进行相应的处理。1. epoll 与 select/poll 区别epoll的实现代码fs/eventpoll.c，其分为三个接口函数： epoll_create: 创建一个epoll实例，返回一个文件描述符。 epoll_ctl: 向epoll实例中添加、修改或删除需要监视的文件描述符。 epoll_wait: 等待epoll实例中监视的文件描述符发生状态变化，并返回就绪的文件描述符列表。具体流程分为两个阶段：注册阶段（epoll_ctl EPOLL_CTL_ADD）： 为目标 fd 创建 epitem，插入 ep-&amp;gt;rbr 红黑树。 调用 ep_item_poll(epi, &amp;amp;epq.pt, 1)，内部通过 ep_ptable_queue_proc 分配一个 eppoll_entry，将 ep_poll_callback 注册为回调函数，并通过 add_wait_queue 将其挂入目标 fd（如 socket）自身的等待队列，完成事件监听挂钩。等待/触发阶段（epoll_wait）： epoll_wait 调用 ep_poll，先检查 ep-&amp;gt;rdllist 是否有就绪事件：若有则直接调用 ep_try_send_events 传递事件并返回；若无则将当前进程加入 ep-&amp;gt;wq（epoll 实例自身的等待队列），挂起进程等待唤醒。 当目标 fd（如 socket）收到数据后，内核驱动层（网络栈/设备驱动）调用 wake_up() 唤醒该 fd 自身的等待队列，从而触发挂在其上的回调 ep_poll_callback。 ep_poll_callback 将对应 epitem 加入 ep-&amp;gt;rdllist（若此时正在向用户空间传输事件，则暂存于 ep-&amp;gt;ovflist 溢出链表），然后调用 wake_up(&amp;amp;ep-&amp;gt;wq) 唤醒 epoll_wait 中挂起的进程。 进程被唤醒，ep_poll...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/IO%E5%A4%9A%E8%B7%AF%E5%A4%8D%E7%94%A8%E4%B8%8Eepoll/";
          
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
        
        description: "qemu&amp;amp;kvm学习笔记  qemu笔记  Qemu KVM(Kernel Virtual Machine)学习笔记",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/qemu-study/";
          
        },
      },{id: "post-memory-segmentation-cheet-sheets",
        
          title: "Memory Segmentation Cheet Sheets",
        
        description: "reference  Memory Segmentation Cheet Sheets",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/memory-segmentation-cheet-sheets/";
          
        },
      },{id: "post-std-pmr-内存池",
        
          title: "std::pmr -- 内存池",
        
        description: "1. 介绍使用C++ 17的多态内存管理器(PMR)，可以实现一个简单的内存池。根据选择(std::pmr::memory_resource)，可以在内存不够的时候，向upstream申请内存。标准内存资源列表：            memory_resource派生类      效率      线程安全      内存                  std::pmr::synchronized_pool_resource()      效率低（内部需要上锁）      线程安全      更少碎片化              std::pmr::unsynchronized_pool_resource()      效率较高(内部不需要上锁)      非线程安全      更少碎片化              std::pmr::monotonic_buffer_resource()      效率最高      非线程安全      “只进不出”（从不释放、可传递进可选的缓冲区）      两个返回指向单例全局内存资源指针的函数：            函数名      特点                  std::pmr::new_delete_resource()      默认的内存资源（转发给传统 new/delete）              std::pmr::null_memory_resource()      “永远拒绝”      2. 示例  基本示例：std::pmr::monotonic_buffer_resource的基本用法：src/hello_prm。  使用std::pmr::polymorphic_allocator初始化对象（alloc + construct）：src/polymorphic_allocator。  benchmark：不同memory_resource实现的性能对比：src/benchmark。用户自定义类使用PMR分配之后的析构：using user_class_alloc_traits = std::allocator_traits&amp;lt;std::pmr::polymorphic_allocator&amp;lt;UserClass&amp;gt;&amp;gt;;user_class_alloc_traits::destroy(userclass_allocator, userclass);user_class_alloc_traits::deallocate(userclass_allocator, userclass, 1);3. 参考  cppreference – pmr benchmark  test source code  C++17 the complete guide – Chap 29. 多态内存资源(PMR)",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/std-pmr-memory-pool/";
          
        },
      },{id: "post-c-面向对象三个概念-重载-覆盖和隐藏",
        
          title: "C++面向对象三个概念——重载、覆盖和隐藏",
        
        description: "1. overload 重载 同名函数，参数个数或类型不同； 相同作用域，即同一个类。2. override 覆盖 不在一个作用域，即父类与子类； 子类函数与基类函数同名，参数个数和类型相同； 基类使用virtual关键字，子类使用override关键字。例外的一个点是协变：基类返回基类指针，子类返回子类指针。此时也是override。#include &amp;lt;iostream&amp;gt;class Base {public: virtual Base* clone() const { std::cout &amp;lt;&amp;lt; &quot;Base::clone()&quot; &amp;lt;&amp;lt; std::endl; return new Base(*this); }};class Derived : public Base {public: // 使用协变返回类型，返回类型是 Base 的派生类型 Derived* Derived* clone() const override { std::cout &amp;lt;&amp;lt; &quot;Derived::clone()&quot; &amp;lt;&amp;lt; std::endl; return new Derived(*this); }};int main() { Derived d; Base* ptr = &amp;amp;d; Base*...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/cpp-override-overload-hide/";
          
        },
      },{id: "post-编译ffmpeg使能-nvidia-硬件解码",
        
          title: "编译FFMPEG使能 NVIDIA 硬件解码",
        
        description: "1. 依赖于 NVIDIA NVIDIA 显卡驱动(.run文件安装) CUDA Toolkit(.run文件安装)安装 NVIDIA 驱动(run文件)# 禁用 nouveau 开源驱动cat &amp;gt; /etc/modprobe.d/blacklist-nouveau.conf &amp;lt;&amp;lt;EOFblacklist nouveauoptions nouveau modeset=0EOF# Update initramfsupdate-initramfs -u# 需要重启生效reboot# Install compilation tools and Xorg dependenciesapt install -y make gcc linux-headers-$(uname -r) pkg-config xserver-xorg xorg-dev# Install Vulkan and GLVND development librariesapt install -y libvulkan1 libglvnd-devsystemctl stop gdm.service./NVIDIA-Linux-x86_64-xxx.run安装CUDA：# https://developer.nvidia.com/cuda-toolkit-archivewget https://developer.download.nvidia.com/compute/cuda/12.6.3/local_installers/cuda-repo-debian12-12-6-local_12.6.3-560.35.05-1_amd64.debsudo dpkg -i cuda-repo-debian12-12-6-local_12.6.3-560.35.05-1_amd64.debsudo cp /var/cuda-repo-debian12-12-6-local/cuda-*-keyring.gpg /usr/share/keyrings/sudo add-apt-repository contribsudo apt-get...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E7%BC%96%E8%AF%91FFMPEG%E4%BD%BF%E8%83%BDNvidia%E7%A1%AC%E4%BB%B6%E8%A7%A3%E7%A0%81/";
          
        },
      },{id: "post-gcc-向量化相关选项",
        
          title: "gcc 向量化相关选项",
        
        description: "1. alias选项strict aliasing是编译器优化中依赖的一个假设，即不同类型的指针，指向不同的内存区域。基于该假设，gcc编译器可以进行一些优化。gcc优化-O2默认开启该选项(-fstrict-aliasing)。使用该选项，需要保证不同类型指针的内存区域不重叠，否则会导致未定义行为。例如:int a = 10;int* p1 = &amp;amp;a;float* p2 = (float*)&amp;amp;a;如果不能保证，则使用-fno-strict-aliasing选项。该选项导致性能下降，例如每次可能会从内存中读取数据，而不是寄存器。要保证代码类型转换安全，使用编译选项:add_compile_options(-Wstrict-aliasing) # -Werror -Wall参考: Casting does not work as expected when optimization is turned on2. vectorize选项 -ftree-vectorize: 整个代码中，可能的向量化优化。 -ftree-loop-vectorize: 循环中的向量化优化。 -fopt-info-vec-missed: 显示没有向量化的循环。 -fopt-info-vec-optimized: 显示已向量化的循环。另外，在本地，想要充分优化，设置:set(CMAKE_C_FLAGS_RELEASE &quot;-O3 -march=native&quot;)set(CMAKE_CXX_FLAGS_RELEASE &quot;-O3 -march=native&quot;)编写代码过程中，影响向量化的因素有: exception: 异常处理会影响向量化。尽可能使用noexcept或const。3. 调试–看IRadd_compile_options(-fdump-tree-dse) #查看 dead store elimination 之后的 IR4. vectorize 更多资料入门资料: Intel – Vectorization codebook step by step – Crunching Numbers...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/gcc-vectorize-options/";
          
        },
      },{id: "post-perf性能分析-7-top-down-分析方法及vtune工具",
        
          title: "perf性能分析(7) -- Top-down 分析方法及VTune工具",
        
        description: "现代性能分析，使用针对pipeline的分析办法(取代CPU cycles分析)。这源于现代CPU架构的复杂性。现代CPU处理指令架构，分为前端 Front-end，后端 Back-end两部分。阻碍指令执行的因素，从硬件看，源于前端或后端的Stall。1. CPU 流水线Intel CPU流水线一般分为5级。其中解码(ID)，意思是将指令操作分解为多个uOp(即拆分为多个更低级的硬件操作)，如ADD eax, [mem1]，可以拆分成两个微指令：从内存读取数据，再执行ADD操作。2. CPU 架构及流水线的执行过程执行过程：前端执行完IF -&amp;gt; ID之后，然后在一个名为allocation的过程中（下图中星标处），uOps被输送到后端。后端监控uOp的操作数(data operand)何时可用，并在可用的执行单元中执行uOps。当uOp执行完成之后，称之为执行完成(retirement)，且将uOp的结果被写会寄存器或者内存（经过Store Buffer写入内存）。大多数uOps都会完全通过流水线并退出，但有些投机指令uOps可能会在退出前被取消–如预测错误的分支。在Intel处理器中，一个core一般有四个执行端口，即每个cycle最多可以执行四个uOps。在处理器架构中，有一个抽象概念：pipeline slot（流水线槽），用来表示用于执行一个uOp所需要的硬件资源。在每个时钟周期，有四个流水线槽可用，流水线槽可以是空的，也可以是被uOp填充。流水线槽在Allocation阶段（上图中的星号标记处），将uOp从前端分配到后端执行单元。PMU监控流水线槽的状态，在每个时钟周期，衡量流水线槽的利用率（是否填充有uOp），并对流水线槽进行分类，确定是前端瓶颈还是后端瓶颈。3. Top-down 分析方法从性能分析的角度看，一条微指令在流水线中的性能指标可以分为： 退出(Retiring) – Micro Sequencer(微指令调度器)可能会成为瓶颈，例如调度浮点指令。 分支预测错误(Bad Speculation) – 分支预测错误，或者memory ordering violation(多核多线程共享数据情形)，导致Machine Clears(清除流水线)。 前端瓶颈(Front-End Bottleneck) 后端瓶颈(Back-End Bottleneck)Top-down分析思想根据上述的流水执行阶段及过程，首先从Top-level分类分析步骤：然后，继续细分（Breakdown），确定是哪个阶段中的哪个资源导致的stall： 相比以前基于事件的度量的方式，基于Top-down分析方法，可以更准确地定位性能瓶颈的根源，指导开发者进行针对性的优化。3.1. Frontend Bound – 前端瓶颈前端主要职责为读取指令，解码之后，发送给后端。遇到分支指令，需要经过预测器预测下一个指令的地址，这意味着会出现由于分支预测错误并清除流水线导致的ICache Miss而引起前端阻塞。而在取指/解码过程中，如果代码的局部性不好，由于ICache Miss，或者iTLB Miss，引起前端Stall。过高的miss率导致前端瓶颈。 L1/L2 Cache分为DCache和ICache。TLB也分为iTLB、dTLB和Second-Level TLB，地址从iTLB/dTLB中找不到则再从Second-Level TLB中查找。3.2. Back-End Bound – 后端瓶颈后端主要职责为执行指令，包括ALU、FPU、Memory等。后端瓶颈分为： Core Bound 除法指令过多，因为除法指令执行时间长； Execution Port Utilzation过高，导致执行单元饱和； 指令的数据依赖，即依赖上一个指令的结果，导致Stall； Memory Bound L1/L2/L3 Cache...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-07-top-down-method/";
          
        },
      },{id: "post-c-中-auto-和-decltype-的用法-update-20241106",
        
          title: "C++ 中 auto 和 decltype 的用法 (update 20241106)",
        
        description: "1. auto 占位符1.1 规则auto推导的原则为：保持原有变量的类型(如cv限定)，大致分两种情况: auto: auto含义是创建了一个新的变量: 表达式为T或者T&amp;amp;或者const T&amp;amp; – auto推导为T – 即新变量的类型去除cv限定 (如果原有表达式有cv限定); 表达式为T* const或者T* – auto推导为T* – 新变量去除cv限定; 表达式为const T*或者const T* const – auto推导为const T*，即保持指针指向的内存区域的const属性。 auto&amp;amp;: auto&amp;amp;含义是alias，故auto&amp;amp;推导的结果是原有类型的的引用，不能少任何一个限定符，如: const T* const推导为const T* const &amp;amp;； const T推导为const T&amp;amp;； 1.2 一些应用场景 范围循环std::vector&amp;lt;int&amp;gt; numbers = {1, 2, 3, 4, 5};for (const auto&amp;amp; num : numbers) { std::cout &amp;lt;&amp;lt; num &amp;lt;&amp;lt; std::endl; // num...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cpp-auto-and-decltype/";
          
        },
      },{id: "post-perf性能分析-6-perf实战-1-分支预测",
        
          title: "perf性能分析(6) -- perf实战(1) -- 分支预测",
        
        description: "使用Debug模式编译 sort 和 unsort 代码:#include &amp;lt;algorithm&amp;gt;#include &amp;lt;ctime&amp;gt;#include &amp;lt;iostream&amp;gt;int main(int argc, char* argv[]) { constexpr int kArrLen = 1024 * 1024; int* data = new int[kArrLen]; for (int c = 0; c &amp;lt; kArrLen; c++) data[c] = std::rand() % 256; // std::sort(data, data + kArrLen); // 是否排序 long long sum = 0; for (int i = 0; i &amp;lt; 30000; i++)...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-06-perf-practice-01/";
          
        },
      },{id: "post-perf性能分析-5-linux-perf-工具介绍",
        
          title: "perf性能分析(5) -- linux perf 工具介绍",
        
        description: "1. perf 介绍perf及子命令可以测量/记录系统性能，可以记录的性能数据项繁多。包括CPU/PMU等硬件数据，以及software counter/tracepoint等系统内核采集的数据。可以关注的几类： CPU / PMU (Performance Monitoring Unit)数据。包括: dTLB, iTLB, cache 计数以及miss计数；branch及branch miss计数。 memory 延时、阻塞； bus延时、阻塞； front end/back end阻塞； virtual memory相关: TLB相关。 pipeline相关。查看perf命令及子命令帮助信息：man perfman perf-topman perf-statman perf-recordman perf-report查看perf所有子命令:$ perf usage: perf [--version] [--help] [OPTIONS] COMMAND [ARGS] The most commonly used perf commands are: annotate Read perf.data (created by perf record) and display annotated code archive Create archive with...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-05-perf-introduce/";
          
        },
      },{id: "post-perf性能分析-4-linux-perf-工具基本使用-1",
        
          title: "perf性能分析(4) -- linux perf 工具基本使用(1)",
        
        description: "1. perf stat 基本使用perf stat 基本功能 – 统计： cycles 数, IPC (instructions per cycle)。IPC &amp;gt;= 1 表示指令执行效率高 分支切换次数(branchs), 分支预测失败次数(branch-misses)，以及失败比例 上下文切换次数(context switches)，以及每秒切换次数 CPU迁移次数(migrations)，以及每秒迁移次数 缺页次数(page faults)，以及每秒缺页次数$ sudo perf stat -p 8460 Performance counter stats for process id &#39;8460&#39;: 1,763,985.38 msec task-clock # 7.974 CPUs utilized 5,976 context-switches # 3.388 /sec 19 cpu-migrations # 0.011 /sec 7 page-faults # 0.004 /sec 5,402,549,520,366 cycles...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-04-perf-usage/";
          
        },
      },{id: "post-linux-性能及统计工具-1",
        
          title: "Linux 性能及统计工具 (1)",
        
        description: "1. Virtual Memory Statistics – vmstatvmstat 检测cpu、系统内存(包括 slab)、进程、块设备IO等使用情况： CPU相关：用户时间 / 系统时间 / 空闲时间占比。每秒中断数量 / 上下文切换数量。活动进程数量 / 阻塞进程数量，fork进程数量。 内存相关：active/inactive内存，buff/cache内存，swap使用及每秒交换量。 IO：每秒读写的块数量。1.1. 基本用法$ vmstat -S M # 内存以兆为单位显示procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu------- r b swpd free buff cache si so bi bo in cs us sy id wa st gu 1 0 0 14431 60 749 0 0 357 33 165 0...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Linux-perf-stat-commands/";
          
        },
      },{id: "post-有用的-gcc-编译选项收集",
        
          title: "有用的 GCC 编译选项收集",
        
        description: "1. 编译选项 -fverbose-asm-fverbose-asm 将编译信息(编译选项等等)、C源码中的变量名，以注释的形式嵌入到汇编代码中，便于分析。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E6%9C%89%E7%94%A8%E7%9A%84GCC%E7%BC%96%E8%AF%91%E9%80%89%E9%A1%B9%E6%94%B6%E9%9B%86/";
          
        },
      },{id: "post-内存分析需要理解的几个概念",
        
          title: "内存分析需要理解的几个概念",
        
        description: "“真实的” 内存空闲率 = (free + shared + buffers + cached)/ Total = 5860 M / 7983M X 100 % = 73.4 %1. Linux内存分类 匿名内存：存储用户计算过程中间的数据，与物理磁盘上的文件无关； File-Backed内存：用作磁盘高速缓存，其物理内存与物理磁盘上的文件对应；1.1 Shmem包括： shared memory. tmpfs：所使用的内存（基于内存的文件系统）。Linux将空闲内存用于缓存，并且在需要的时候，回收这些内存。 devtmpfs：指的是/dev文件系统，/dev目录下所有的文件占用的空间也属于共享内存。1.2 buffers &amp;amp; cache buffers： 用于块设备I/O缓存； cached：page cache，用于文件系统（读取文件时，kernel创建的缓存）；使用top命令查看时，buffers与cached通常合并在一起显示，他们都是kernel使用的缓存。在需要的时候，可以被回收。2. 查看内存使用情况2.1 内存利用率详细信息cat /proc/meminfoMemTotal: 8174352 kBMemFree: 376952 kBBuffers: 527412 kBCached: 5178924 kBSwapCached: 60 kBActive: 3061760 kBInactive: 4066588 kBActive(anon): 1112780 kBInactive(anon): 314156 kBActive(file): 1948980 kBInactive(file):...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Linux-%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86%E8%A6%81%E7%90%86%E8%A7%A3%E7%9A%84%E6%A6%82%E5%BF%B5/";
          
        },
      },{id: "post-perf性能分析-3-intel-vtune-配合-linux-perf-使用",
        
          title: "perf性能分析(3) -- Intel VTune 配合 linux perf 使用",
        
        description: "1. 配置1.1 安装 perfsudo apt-get install linux-tools-common linux-tools-generic linux-tools-`uname -r`1.2 设置系统相关设置项以允许 perf 采集# 允许非特权用户进行内核分析和访问 CPU 事件echo 0 | sudo tee /proc/sys/kernel/perf_event_paranoidsudo sh -c &#39;echo kernel.perf_event_paranoid=0 &amp;gt;&amp;gt; /etc/sysctl.d/local.conf&#39;# 启用内核模块符号解析以供非特权用户使用echo 0 | sudo tee /proc/sys/kernel/kptr_restrictsudo sh -c &#39;echo kernel.kptr_restrict=0 &amp;gt;&amp;gt; /etc/sysctl.d/local.conf&#39;# 生效系统设置sudo sysctl -p其中： 第一项设置，允许非特权用户进行内核分析和访问 CPU 事件。 第二项设置(kptr_restrict)，可以使得perf工具可以访问到内核指针，即允许内核符号(kallsyms)被映射到用户层。2. 开始 perf 测量及收集数据在被测量的程序中，添加如下代码获取自身PID:#include &amp;lt;unistd.h&amp;gt; // getpidconst pid_t pid = getpid();std::cout &amp;lt;&amp;lt; argv[0] &amp;lt;&amp;lt; &quot;....",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-03-Intel-VTune-and-perf-usage-03/";
          
        },
      },{id: "post-perf性能分析-2-intel-vtune-配置与使用-2",
        
          title: "perf性能分析(2) -- Intel VTune 配置与使用(2)",
        
        description: "测试代码：test_tbb_perf_vtune_profiler注意：编译选项需要添加”-g”，以便于VTune Profiler可以显示源码信息。1. 测试原始来源VTune Profiler 进行性能分析：使用VTune Profiler测试TBB overhead。2. 资料 Intel TBB API 使用教程：Intel® oneAPI Threading Building Blocks Too long TBB’s shedule time when using parallel_deterministic_reduce3. 测试过程及优化3.1 reduce 针对一些比如遍历求和操作，他们之间没有顺序要求，可以改用并行的 reduce。前提是数据的构造代价小，如稀疏矩阵拷贝代价就比较大。 计算的先后顺序有关的，比如针对浮点的乘加操作，先后顺序变化影响计算精度，此时使用parallel_deterministic_reduce。官方解释是：合并顺序是预先定义好的，确保每次调用deterministic_reduce的结果相同。3.2 几个不同的优化方式Intel TBB 动态划分任务，以及把任务提交给线程执行，都需要消耗时间。优化包括： 调整 grain size 减少调度的开销。 使用静态划分static_partitioner减少调度开销。3.2.1 调整 grain size通过设置grain size，可以大致设定 TBB 每个任务要处理的数据量，即划分粒度：tbb::blocked_range&amp;lt;double*&amp;gt;(v, v + n, 1000)设置grain size之前，显示的热点 call stack 如下图（100次循环）：设置grain size等于10000，Intel TBB 内部调度时间明显减少（10000次循环）：3.2.2 使用静态划分static_partitioner通过设置使用static_partitioner，即预先划分好任务，减少调度开销，具有与blocked_range类似的效果，但其控制的方式不同。static_partitioner适用于任务均衡的计算场景。tbb::task_arena ta(8); double sum = ta.execute([&amp;amp;]()...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-02-Intel-VTune-usage-02/";
          
        },
      },{id: "post-给-shared-ptr-添加自定义-deleter-的几种方式",
        
          title: "给 shared_ptr 添加自定义 deleter 的几种方式",
        
        description: "1. 使用函数#include &amp;lt;iostream&amp;gt;#include &amp;lt;memory&amp;gt;void deleter(Sample* ptr) { std::cout &amp;lt;&amp;lt; &quot;delete function called&quot; &amp;lt;&amp;lt; std::endl; delete ptr;}std::shared_ptr&amp;lt;Sample&amp;gt; sp(new Sample, deleter);2. 使用仿函数#include &amp;lt;iostream&amp;gt;#include &amp;lt;memory&amp;gt;struct Deleter { void operator()(Sample* ptr) { std::cout &amp;lt;&amp;lt; &quot;deleter function called&quot; &amp;lt;&amp;lt; std::endl; delete ptr; }};std::shared_ptr&amp;lt;Sample&amp;gt; sp(new Sample, Deleter{});3. 使用 lambda 表达式#include &amp;lt;iostream&amp;gt;#include &amp;lt;memory&amp;gt;std::shared_ptr&amp;lt;Sample&amp;gt; sp(new Sample, [](Sample* ptr) { std::cout &amp;lt;&amp;lt; &quot;lambda function called&quot; &amp;lt;&amp;lt; std::endl; delete ptr;});4....",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/shared_ptr-deleters-usage/";
          
        },
      },{id: "post-perf性能分析-1-intel-vtune-配置与使用-1",
        
          title: "perf性能分析(1) -- Intel VTune 配置与使用(1)",
        
        description: "1. Intel VTune 配置1.1 使能 ptrace使能进程跟踪 (ptrace) 功能 (attach ID)，以便 VTune 可以监控到进程的运行情况。sudo vim /etc/sysctl.d/10-ptrace.conf# set kernel.yama.ptrace_scope = 0# 使配置生效sudo sysctl --system -a -p | grep yama # 应用配置，或者也可以选择重启电脑1.2 安装 Sampling Driverscd ~/intel/oneapi/vtune/latest/sepdk/src./build-driver# 添加 vtune 组并将你的用户添加到该组# 创建一个新的 shell，或者重新启动系统sudo groupadd vtunesudo usermod -a -G vtune `whoami`# 安装 sep 驱动程序sudo ./insmod-sep -r -g vtune1.3 检查软硬件配置: 查看VTune Profiler 可以做哪些profiling~/intel/oneapi/vtune/latest/bin64python3 self_check.py最终会出来一个结果， 显示 VTune Profiler 可以做哪些...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/perf-tools-01-Intel-VTune/";
          
        },
      },{id: "post-plugin-的创建及使用",
        
          title: "Plugin 的创建及使用",
        
        description: "使用 BOOST_DLL_ALIAS 定义插件接口。 使用 import_alias 导入插件接口。 使用 creator / Factory 模式，提供创建插件实例的接口。Demo Code: test_plugin_dll1. 实现插件接口1.1 DSO/DLL原型定义class DIInterface { public: DIInterface() = default; virtual ~DIInterface() = default; //virtual std::shared_ptr&amp;lt;DIInterface&amp;gt; clone() = 0; virtual void loadInfo(const std::string&amp;amp; dataFile) = 0; virtual QWidget* getWidget() = 0; virtual void unload() = 0; protected: QWidget* widget_;};1.2 接口定义及实现std::shared_ptr&amp;lt;test::plugin::DIInterface&amp;gt; diLoader(const std::string&amp;amp; infoFile) { std::shared_ptr&amp;lt;test::plugin::DIInfoChaoke&amp;gt; ptr = std::make_shared&amp;lt;test::plugin::DIInfoChaoke&amp;gt;(); ptr-&amp;gt;loadInfo(infoFile);...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Plugin-Boost-DLL/";
          
        },
      },{id: "post-性能优化学习资料",
        
          title: "性能优化学习资料",
        
        description: "原作者 Linux Performance  原作者 github perf-tools  pdf – Linux Performance Tools 中文翻译  pdf – Linux Performance Tools  github – Performance Ninja Class  ARMVirtualization: Performance and Architectural Implications  blog – Sherlock’s blog",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99/";
          
        },
      },{id: "post-stl-图解",
        
          title: "STL 图解",
        
        description: "STL 包含五种主要组件： 算法（algorithm）：定义计算过程。 容器（container）：管理一组内存位置。 迭代器（iterator）：提供算法遍历容器的方法。 函数对象（function object）：将函数封装在对象中，供其他组件使用。 适配器（adaptor）：调整组件以提供不同的接口。从实现来看还需要包含： 分配器（allocator）：用于处理容器对内存的分配与释放请求。以下分析适用于 GCC9 。1. 源码阅读1.1. ::template在 __rebind 函数体中，在 :: 后面有个 template 关键字，这是用于告诉编译器 template 后面的 &amp;lt; 不是比较符号，而是模板参数符号。就是类似于 _Tp 前面的 typename 是告诉编译器 :: 后面的是类成员函数，而不是 static 函数。using type = typename _Tp::template rebind&amp;lt;_Up&amp;gt;::other;2. allocator1分配器是负责封装堆内存管理的对象。2.1. 分配器上图左侧。C++的默认的内存分配器 std::allocator，继承至 __gnu_cxx::new_allocator。2.1.1. __gnu_cxx::new_allocator（1）对传入类型进行了类型萃取。（2）rebind 重新绑定，定义 other 类型，用于萃取器萃取类型。（3）封装实现分配对象内存、初始化对象、析构对象、释放对象内存，底层使用 new 和 delete。 address() : 用于获取分配地址 allocate() : 用于分配内存 deallocate() : 用于释放内存 max_size() : 获取最大可分配数量 construct()...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/STL%E5%9B%BE%E8%A7%A3/";
          
        },
      },{id: "post-c-11-新特性",
        
          title: "C++11 新特性",
        
        description: "C++11 新特性",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/C++11%E6%96%B0%E7%89%B9%E6%80%A7/";
          
        },
      },{id: "post-opencl-buffer-objects",
        
          title: "OpenCL Buffer Objects",
        
        description: "1. clCreateBuffer 分配内存创建 OpenCL 内存对象函数原型为：clCreateBuffer(cl_context, // 上下文 cl_mem_flags, // 内存对象的性质，见下表 size_t, // 内存对象数据块大小 void *, // host_ptr 主机数据内存地址（可以为空） cl_int *);针对不同场景需求，OpenCL提供了不同的内存对象创建标志位。1.1. CL_MEM_USE_HOST_PTRauto src_matrix_ptr = aligned_malloc&amp;lt;int, 4096&amp;gt;(kMatrixSize * kMatrixSize);// fill the matrix with data...cl_mem clsrc = clCreateBuffer(context, CL_MEM_READ_ONLY | CL_MEM_USE_HOST_PTR, cl_buff_size, src_matrix_ptr, NULL);由于是 host malloc 分配的内存，runtime 会分配一个相应的 buffer，kernel开始执行时，将从host_ptr拷贝到OpenCL的buffer中。应该避免使用该标志位。所谓开始执行时，是指NDRangeKernel创建的命令，在device上执行时，状态变为Ready的时候。针对与host共享物理内存的device，如果host_ptr已经是地址对齐的，那么runtime应该不用分配内存了。如果host_ptr没有内存对齐，则runtime将进行拷贝操作。（要考虑物理内存页要连续？？）。Use this when an aligned buffer already exists on the host side. It must be...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OpenCL-Buffer-Objects/";
          
        },
      },{id: "post-opencl-学习资源",
        
          title: "OpenCL 学习资源",
        
        description: "pdf 文档  AMD_OpenCL_Programming_Optimization_Guide  Arm Guide to OpenCL Programming  NVIDIA_OpenCL_Best-Practices-Guide  opencl-sdk_developer-guide-processor-graphics_2019.4  NVIDIA OpenCL SDK Code Samples更多待整理  知乎 – OpenCL学习资料整理SDK  AMD-APP-SDKInstaller",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OpenCL-Learn-Resources/";
          
        },
      },{id: "post-opencl-同步操作",
        
          title: "OpenCL 同步操作",
        
        description: "1. Barrier1.1 clEnqueueBarrierWithWaitList// Provided by CL_VERSION_1_2cl_int clEnqueueBarrierWithWaitList( cl_command_queue command_queue, cl_uint num_events_in_wait_list, const cl_event* event_wait_list, cl_event* event);cl_int clWaitForEvent( cl_uint num_events, const cl_event *event_list);用于在OpenCL命令队列中插入一个同步点。其作用对象限于一个 command queue。 如果 event_wait_list 为空，则需要该同步点命令(clEnqueueBarrierWithWaitList)之前的命令全部执行完成，才能执行其之后的命令。 如果 event_wait_list 不为空，则需要等到所有事件都完成（CL_COMPLETE），才能执行其之后的命令。如果 event 不为空，可以用这个 event 阻塞host直到该命令执行完成(CL_COMPLETE)。1.2 work-group barrier作用于同一个 work-group 内的所有 work-item。void work_group_barrier(cl_mem_fence_flags flags);void work_group_barrier(cl_mem_fence_flags flags, memory_scope scope);flags 含义： CLK_LOCAL_MEM_FENCE：The barrier function will either flush any variables stored in local memory or queue...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OpenCL-Synchronization/";
          
        },
      },{id: "post-opencl-平台模型-执行模型",
        
          title: "OpenCL 平台模型、执行模型",
        
        description: "1. 平台模型关键词： OpenCL Device CU – Compute Unit PE – Processing Element 2. 内存模型 github – OpenCL Guide –Memory Model3. 执行模型3.1 ContextContext 是针对Host端编程而产生的概念，表示设备的执行环境，包含： Devices：一个或多个OpenCL物理设备； Memory Objects：Host 端和/或 Device 端可见的内存对象； Program Objects: 包含源码及编译后的二进制代码； kernel Objects：Device 端执行的函数对象；3.1.1 命令队列 Command Queue一个Command Queue 对应一个Device。一个 Command Queue 中的命令包含如下三种类型： Kernel 相关命令：执行 Kernel 函数； Memory 相关命令： host &amp;lt;–&amp;gt; device 数据传输； host &amp;lt;–&amp;gt; device memory map / unmap；...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OpenCL-model/";
          
        },
      },{id: "post-git加速资源",
        
          title: "Git加速资源",
        
        description: "GitHub Proxy 加速  GitHub Proxy使用清华镜像加速：git config --global url.&quot;https://mirrors.tuna.tsinghua.edu.cn/git/&quot;.insteadOf https://github.com/使用GitClone加速：# 方法一(替换URL)git clone https://gitclone.com/github.com/tendermint/tendermint.git# 方法二(设置git参数)git config --global url.&quot;https://gitclone.com/&quot;.insteadOf https://git clone https://github.com/tendermint/tendermint.git",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/git%E5%8A%A0%E9%80%9F%E8%B5%84%E6%BA%90/";
          
        },
      },{id: "post-总结-git-不常用命令",
        
          title: "总结：git 不常用命令",
        
        description: "# 远程分支与本地分支有不相关的提交，合并远程分支git pull origin main --allow-unrelated-histories# 删除远程分之git push origin --delete &amp;lt;branch_name&amp;gt;# 更新远程分支列表git remote update origin --prune# 删除submodule# Remove the submodule entry from .git/configgit submodule deinit -f .\3rd\xz-v5.8.1\# Remove the submodule directory from the superproject&#39;s .git/modules directoryrm -rf .git/modules/3rd/xz-v5.8.1# Remove the entry in .gitmodules and remove the submodule directory located at path/to/submodulegit rm -f 3rd/xz-v5.8.1删除git记录中的大文件及blob# 执行命令之前，保证仓库没有待提交的更改# 清理git gc# 根据文件名查找大文件的完整路径git rev-list --objects...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/git-commands/";
          
        },
      },{id: "post-opencl-端编程流程及主要概念实践",
        
          title: "OpenCL 端编程流程及主要概念实践",
        
        description: "0. OpenCL 概念 平台 platform：OpenCL 实现的顶层容器，通常对应于一个 OpenCL 的实现厂商； 设备 device：执行 OpenCL 程序的硬件设备，可以是 CPU、GPU、FPGA，或其他计算加速设备； 上下文 context：管理设备和资源的的环境，一个上下文可以包括多个 device； 命令队列 command queue：向设备发送命令的队列，一个命令队列与一个给定的 device 相关联； 程序 program：CL 代码及其编译后的二进制，包含一个或多个 kernel； 内核 kernel：在设备上执行的函数，这是 OpenCL 程序的核心； 工作项 work item：kernel 执行的一个实例，类似于线程； 工作组 work group：工作项的集合，集合内的 work item 共享一个 Local Memory，以及进行同步；1. 编程流程编程步骤如下：一个示例源码：opencl_002_array_add2. OpenCL 内存模型 kernel 函数中，使用关键字 __global 标示的变量，存储在上图中的 Global Memory 中；__local 标示的变量，存储在 Local Memory 中。 OpenCL 也分 WorkGroup，使用__local修饰的变量，存储在Local Memory中，仅限于同一个 WorkGroup...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OpenCL-basic-coding-flow/";
          
        },
      },{id: "post-使用-ffmpeg-从视频中提取音频",
        
          title: "使用 FFmpeg 从视频中提取音频",
        
        description: "1. 提取完整音频ffmpeg -i sample.mp4 -q:a 0 -map a sample.mp32. 提取特定时段的音频ffmpeg -i sample.mp4 -ss 00:03:05 -t 00:00:45.0 -q:a 0 -map a sample.mp3  ss 选项指定开始时间戳，使用 t 选项指定编码持续时间，例如从3分钟到5秒钟，持续45秒。  时间戳必须采用 HH：MM：SS.xxx 格式或以秒为单位。      如果你不指定 t 选项，它将会结束。    FFmpeg 提取视频的音频3. 直接提取音频流ffmpeg -i input.flv -vn -codec copy out.m4a其中，-i的意思是input，后接输入源。-codec的意思是直接复制流。  利用FFmpeg无损提取视频中源音频流",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/get-audio-from-vidio-using-ffmpeg/";
          
        },
      },{id: "post-windows-环境编译-vtk",
        
          title: "Windows 环境编译 VTK",
        
        description: "1. 依赖项从OpenCascade官网下载编译好的包，提取里面的依赖包。下载地址：OpenCascade批量编译 VTK – 同时编译Debug/Release版本使用CMake生成完成之后，打开Visual Studio进行编译。选择生成 -&amp;gt; 批生成，选取如下 Debug Install、Release Install即可，并开始编译。编译时间较长。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/building-vtk-under-windows/";
          
        },
      },{id: "post-spdlog-使用",
        
          title: "spdlog 使用",
        
        description: "1. 使用时的编译选项if(CMAKE_BUILD_TYPE STREQUAL &quot;Release&quot;)  add_compile_definitions(-DSPDLOG_ACTIVE_LEVEL=SPDLOG_LEVEL_WARN)  add_compile_definitions(-DNDEBUG)else()  add_compile_definitions(-DSPDLOG_ACTIVE_LEVEL=SPDLOG_LEVEL_TRACE)endif()2. 日志级别，日志格式#include &amp;lt;spdlog/spdlog.h&amp;gt;#ifdef NDEBUG  spdlog::set_level(spdlog::level::warn);  // disable spdlog for performance test#else  spdlog::set_level(spdlog::level::info);  spdlog::set_pattern(&quot;%H:%M:%S.%e %t %s %! %v&quot;);#endif// back to default format// spdlog::set_pattern(&quot;%+&quot;);// alignment: 左对齐, 右对齐spdlog::info(&quot;{:&amp;gt;8} aligned, {:&amp;lt;8} aligned&quot;, &quot;right&quot;, &quot;left&quot;);3. 使用技巧3.1 打印 std::vector#include &quot;spdlog/spdlog.h&quot;#include &quot;spdlog/fmt/bundled/ranges.h&quot;logger-&amp;gt;info (&quot;vector: {}&quot;, fmt::join(vec, &quot;, &quot;));SPDLOG_INFO(&quot;vector: {}&quot;, vec);",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/spdlog-usage/";
          
        },
      },{id: "post-mesh-及相关开源仓库收集",
        
          title: "Mesh 及相关开源仓库收集",
        
        description: "meshlab Gmsh github – netgen github –carve : A fast, robust constructive solid geometry library. cgal : The Computational Geometry Algorithms Library. github – Clipper2 : An open source freeware library for clipping and offsetting lines and polygons. github – cock : A 3D boolean/CSG library. draco : An open-source library for compressing and decompressing 3D geometric meshes and point...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/mesh-tools/";
          
        },
      },{id: "post-总结-using-几种使用场景",
        
          title: "总结：using 几种使用场景",
        
        description: "1. using 声明 (using declaration)将命名空间中的某一个名字 (变量或函数) 引入到当前作用域中，使得当前作用域访问该名字，不需要使用命名空间，以及全局限定符::。{ using std::map; map&amp;lt;int, std::string&amp;gt; the_map; //ok}map&amp;lt;int, std::string&amp;gt; the_map2; //error1.1 使用 using 声明，子类可以使用父类中的私有(private)成员class Base{protected: int bn1; int bn2;};class Derived: private Base{public: using Base::bn1;};class DerivedAgain: public Derived{};int main() { Derived d; d.bn1 = 1; // ok d.bn2 = 2; // error, &#39;bn2&#39; is a private member of &#39;Base&#39; DerivedAgain da; da.bn1 = 3; // ok...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/keywork-using-of-cpp/";
          
        },
      },{id: "post-复习-rvo-nrvo-and-std-move",
        
          title: "复习：RVO NRVO and std::move",
        
        description: "RVO 以及 NRVO  RVO：返回值优化，其功能为：消除子函数返回的临时对象导致的拷贝构造。  NRVO：其功能为：消除子函数中返回的局部对象导致的拷贝构造。class Object {  //...};Object getObjRVO() {  return Object();  // RVO}Object getObjNRVO() {  Object localObj;  return localObj;  // NRVO}std::move使用场景：  局部对象赋值给长生命周期对象时，使用std::move。前提是该类里面有非trival成员，如std::string，或支持移动构造的自定义类成员；  std::vector等容器使用emplace_back代替push_back，此时针对局部对象使用std::move + emplace_back可以避免拷贝构造 – 代之以移动构造；  std::thread线程不可复制，只能所有权转移。如将线程对象添加到std::vector中，则需要使用std::move转移所有权。不要使用std::move：  对于返回值优化的函数，不要使用std::move。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/RVO-NRVO-and-std_move/";
          
        },
      },{id: "post-crtp-使用笔记",
        
          title: "CRTP：使用笔记",
        
        description: "1. 动态继承运行时时间损耗 每个 virtual 方法，都需要通过指针查找到虚函数入口（间接寻址），且可能引起I-Cache cache miss； virtual 方法，不能被优化为inline，针对一些短小的函数，时间损耗较大；2. CRTP 使用举例：子类也是 template 模板类template &amp;lt;typename DerivedT&amp;gt;class HoleDetectorBase { public: using underlying_type = HoleDetectorBase&amp;lt;DerivedT&amp;gt;; //...};template &amp;lt;typename condPairFuncT, typename condGHIPairFuncT&amp;gt;class HoleDetector2 : public HoleDetectorBase&amp;lt;HoleDetector2&amp;lt;condPairFuncT, condGHIPairFuncT&amp;gt;&amp;gt; { public: using base_t = HoleDetectorBase&amp;lt;HoleDetector2&amp;lt;condPairFuncT, condGHIPairFuncT&amp;gt;&amp;gt;; using typename base_t::underlying_type; //...}; 继承写法为：HoleDetector2&amp;lt;condPairFuncT, condGHIPairFuncT&amp;gt;，即带上template参数。2.1 添加在基类中封装子类的函数template &amp;lt;typename DerivedT&amp;gt;class HoleDetectorBase {//...DerivedT&amp;amp; underlying() { return static_cast&amp;lt;DerivedT&amp;amp;&amp;gt;(*this); }DerivedT const&amp;amp; underlying() const { return...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/CRTP-introduce/";
          
        },
      },{id: "post-intel-tbb-并行计算",
        
          title: "Intel TBB 并行计算",
        
        description: "1. TBB 简介Intel TBB主要功能模块： 并行算法 任务调度 并行容器 同步原语 内存分配器1.1. 并行算法 parallel_for parallel_reduce parallel_scan parallel_do parallel_sort parallel_invoke pipeline, parallel_pipeline1.2. 并行容器 concurrent_vector concurrent_hash_map concurrent_queue1.3. 编译及链接参考之前文档Intel TBB malloc 使用 (windows)(2024-08-13)。2. 并行计算头文件包含：#include &amp;lt;oneapi/tbb/parallel_sort.h&amp;gt;#include &amp;lt;tbb/parallel_for.h&amp;gt;#include &amp;lt;tbb/tbb.h&amp;gt;2.1 sortstd::vector&amp;lt;dataxy_info_t&amp;gt; data_xy_info;//...tbb::parallel_sort(data_xy_info.begin(), data_xy_info.end(), [](const dataxy_info_t&amp;amp; a, const dataxy_info_t&amp;amp; b) { return (a.x_ &amp;lt; b.x_); });对150万数据排序，时间对比：[2024-08-28 12:44:37.924] [info] 02. Sorted 1503894 samples in 80.45 ms (TBB sort)[2024-08-28 12:44:42.610] [info] 11....",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/intel-tbb-parallel/";
          
        },
      },{id: "post-intel-tbb-malloc-内存分配器",
        
          title: "Intel TBB malloc 内存分配器",
        
        description: "1. TBB Malloc 使用入门有两种方式使用TBB Malloc：Run-Time替换，Link-Time替换。替换的函数(routines)包括： routines Linux MacOS Windows global C++ new / delete √ √ √ C库：malloc / calloc / realloc / free √ √ √ C库(C11)：aligned_alloc √ - - POSIX：posix_memalign √ √ - Run-Time替换方法： 平台 替换方法 Linux export LD_PRELOAD=$TBBROOT/lib/intel64/gcc4.8/libtbbmalloc_proxy.so.2 MacOS export DYLD_INSERT_LIBRARIES=$TBBROOT/lib/intel64/gcc4.8/libtbbmalloc_proxy.dylib Link-Time替换方法： 平台 替换方法 Linux &amp;amp; MacOS -L$TBBROOT/lib/intel64/gcc4.8 -ltbbmalloc_proxy Windows tbbmalloc_proxy.lib /INCLUDE:&quot;__TBB_malloc_proxy&quot; Link-Time替换，需要添加编译flags。不添加这些编译flags，可能导致malloc等这些函数被内联为汇编，即失去了符号，也就没有办法替换了。需要添加的flags如下：Linux/MacOS平台下，添加如下编译flags（适用于Linux/MacOS）：-fno-builtin-malloc-fno-builtin-calloc-fno-builtin-realloc-fno-builtin-freeWindows平台下，icc编译器添加如下编译flags：- /Qfno-builtin-malloc- /Qfno-builtin-calloc- /Qfno-builtin-realloc- /Qfno-builtin-free...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/intel-tbb-malloc/";
          
        },
      },{id: "post-信号处理资料-butterworth-和-chebyshev-滤波器",
        
          title: "信号处理资料：Butterworth 和 Chebyshev 滤波器",
        
        description: "滤波器资料  Digital Signal Processing  github – related sources功率密度谱 (PSD) 资料  功率密度谱(Power Spectral Density)笔记  white noise filtering",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/dsp-filter-butterworth-and-chebyshev/";
          
        },
      },{id: "post-使用-mmap-读取文件",
        
          title: "使用 mmap 读取文件",
        
        description: "关于mmap介绍，见之前文章 总结：内存访问优化(2024-08-13)。使用跨平台支持的三方库github – mio。1. 使用 mio 映射内存读取文件相关头文件：#include &amp;lt;chrono&amp;gt;#include &amp;lt;filesystem&amp;gt;#include &amp;lt;fstream&amp;gt;#include &amp;lt;string&amp;gt;#include &quot;3rd_utils.h&quot;#include &quot;spdlog/spdlog.h&quot;#include &quot;typedef.h&quot;#include &amp;lt;mio/mmap.hpp&amp;gt;#include &amp;lt;system_error&amp;gt; // for std::error_codenamespace {sample_dataset_t loadDataXYFromFileMM(const std::string&amp;amp; filename) { constexpr size_t sample_size = sizeof(double) * 2 + sizeof(int32_t); sample_dataset_t ds; if (!std::filesystem::is_regular_file(filename)) { SPDLOG_ERROR(&quot;File not found: {}&quot;, filename); return ds; } std::error_code error; mio::mmap_source src_mmap = mio::make_mmap_source(filename, 0, mio::map_entire_file, error); if (error) { const auto&amp;amp;...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/read-file-using-mmap/";
          
        },
      },{id: "post-range-v3-用法积累-及资料",
        
          title: "Range-v3 用法积累，及资料",
        
        description: "1. view – 返回子集 sub_range#include &amp;lt;ranges&amp;gt;using dataset_slice_t = std::ranges::subrange&amp;lt;std::vector&amp;lt;rias::data_type::sample_data_t&amp;gt;::iterator&amp;gt;;dataset_slice_t sub_range(it_min, it_max);2. filter – 根据条件过滤出子集Block blk;auto ss = sample_dataset_-&amp;gt;ds_ | std::views::filter([&amp;amp;](const sample_data_t&amp;amp; ds) { return ds.dbg_blk_id_ == blkId; });std::ranges::for_each(ss, [&amp;amp;](const sample_data_t&amp;amp; ds) { blk.signals_.push_back(ds); });  github – range-v3  User Manual – range-v3  pdf – A GentleIntroductiontoRangesv3  Range-v3 practical examples",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/c++-range-v3/";
          
        },
      },{id: "post-总结-内存访问优化",
        
          title: "总结：内存访问优化",
        
        description: "1. 虚拟内存分配1.1 mmapmmap用于建立文件映射，或者匿名映射。当用于文件映射时，mmap将文件内容缓存进内核空间的page cache里面，然后将用户的一段虚拟内存空间直接映射到page cache。用户通过访问这段虚拟内存，直接读写内核空间上的page cache，避免buffer拷贝开销及用户态的切换。用mmap用户建立匿名映射时，将用户空间的一段虚拟内存空间直接映射到某段物理内存上，这段虚拟内存称为匿名页。匿名映射用于malloc操作（大于128KB）。mmap文件知识点: 通常情况下(除了MAP_POPULATE)，mmap创建时，只是在用户空间分配一段地址空间(VMA)，只有访问地址空间时，才会分配物理地址空间(Page fault中断分配内存)，并更新映射到VMA，建立映射关系。 mmap映射的物理内存，可以跨进程共享，但需要进程之间加锁访问(写操作)。如果多个进程写同一个mmap映射的物理内存，会触发Copy On Write(COW)，内核重新分配一个新的物理内存，并复制原有物理内存的内容。 通过msync()将内存写回硬盘，munmap()释放内存。MAP_POPULATE标志位: 建立页表，这将使得内核进行一些预读(实测没有性能提升)。使用方式： 使用open + 选项O_RDONLY | O_DIRECT打开文件; 以及使用mmap + MAP_POPULATE选项，在打开文件时建立页表。MAP_LOCKED标志位: 锁定映射内存，阻止被换出。类似于mlock()。更多I/O相关: about IO performance1.2 malloc / free在现代操作系统中，malloc的作用是分配虚拟内存空间，并不实际分配物理内存。当分配的虚拟内存空间第一次被访问时，才会真正的分配物理内存（OS的写时分配行为）。malloc行为： 首先尝试在进程空间内存池中查找有没有可以重用的内存空间，如果没有才会进行系统调用。 如果申请的内存小于128KB，会通过调用brk()函数申请内存：根据申请内存大小，将堆顶指针向上移动，并返回新申请的内存地址给用户；当free掉brk()分配的内存时，并不会将物理内存缓存归还给操作系统，而是放到malloc的内存池中，待下次再次申请时直接使用。 申请的内存大于128KB，会通过调用mmap()函数申请内存：通过匿名映射获取虚拟内存；当free掉mmap()分配的内存时，会将物理内存缓存归还给操作系统。1.3 new / deletenew / delete操作时，在调用malloc/free基础上，对non-trival对象，调用其构造/析构函数；对于trival对象，不需要调用构造/析构函数，直接分配/释放内存。2. 用户态 malloc 用户态内存分配：intel TBB malloc, tcmalloc，Vulkan Memory Allocator等。（ 经测试，microsoft mimalloc适配性不是很好，使用过程中会出错；intel TBB malloc overhead似乎比较大） 内存池。（见下面资料链接） 对象池。2.1 参考资料 Vulkan Memory Allocator Vulkan Memory Allocator – docs...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cpp-perf-repos/";
          
        },
      },{id: "post-聚类算法-密度-基于-nano-flann",
        
          title: "聚类算法（密度）：基于 nano-flann",
        
        description: "0. DBSCAN 算法及 K-D 树介绍DBSCAN算法相关概念： 邻域半径 eps。 核心点，最少核心点 minPts。 直接密度可达。 密度可达。 密度相连。K-D树的时间复杂度：Kdtree 算法的构建时间复杂度为 O(nlogn)，搜索时间复杂度最好为 O($\log_2 N$)，最坏为 O($N^{1-1/k}$)。 基于k-d 树的查询算法实现与二维可视化 KD-Tree详解: 从原理到编程实现1. 背景采集到的二维点云数据(samples)，生成K-D搜索树，使用广度优先搜索，聚合成block数据。后续的识别/分类算法，在block数据基础上进行。由于使用点云处理库PCL比较庞大，以及其依的FLANN基于C++14，使用C++17/20导致在自定义点云数据结构时，编译有些STL算法库被废弃，编译出错。故使用 nanoflann。2. 基于 nano-flann 的聚类算法实现2.1 自定义点云数据结构#pragma once// test\test_flann\flann_adaptor.h#include &amp;lt;vector&amp;gt;#include &quot;3rd_utils.h&quot;#include &quot;typedef.h&quot;struct PointCloud { using Point = rias::data_type::sample_data_t; using coord_t = double; //!&amp;lt; The type of each coordinate std::vector&amp;lt;Point&amp;gt; pts; // Must return the number of data points inline size_t...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/density-algrithm-knn/";
          
        },
      },{id: "post-ubuntu-安装-opencv",
        
          title: "Ubuntu 安装 OpenCV",
        
        description: "依赖项安装sudo apt-get updatesudo apt-get install -y build-essential cmake pkg-configsudo apt-get install -y libjpeg-dev libpng-dev libtiff-devsudo apt-get install -y libavcodec-dev libavformat-dev libswscale-dev libv4l-devsudo apt-get install -y libxvidcore-dev libx264-devsudo apt-get install -y libgtk2.0-dev libgtk-3-devsudo apt-get install -y libatlas-base-dev gfortransudo apt-get install -y python3-dev python3-numpysudo apt-get install -y libtbb2 libtbb-dev libdc1394-22-devsudo apt-get install -y libopencv-dev下载 OpenCV 源码git clone https://github.com/opencv/opencv.gitgit clone https://github.com/opencv/opencv_contrib.git# opencv opencv_contrib...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/ubuntu-install-opencv/";
          
        },
      },{id: "post-cmake-检查系统和编译器",
        
          title: "CMake 检查系统和编译器",
        
        description: "判断操作系统IF (CMAKE_SYSTEM_NAME MATCHES &quot;Linux&quot;)ELSEIF (CMAKE_SYSTEM_NAME MATCHES &quot;Windows&quot;)ELSEIF (CMAKE_SYSTEM_NAME MATCHES &quot;FreeBSD&quot;)ELSE ()MESSAGE(STATUS &quot;other platform: ${CMAKE_SYSTEM_NAME}&quot;)ENDIF (CMAKE_SYSTEM_NAME MATCHES &quot;Linux&quot;)判断编译器if (&quot;${CMAKE_CXX_COMPILER_ID}&quot; STREQUAL &quot;Clang&quot;)# using Clangelseif (&quot;${CMAKE_CXX_COMPILER_ID}&quot; STREQUAL &quot;GNU&quot;)# using GCCelseif (&quot;${CMAKE_CXX_COMPILER_ID}&quot; STREQUAL &quot;Intel&quot;)# using Intel C++elseif (&quot;${CMAKE_CXX_COMPILER_ID}&quot; STREQUAL &quot;MSVC&quot;)# using Visual Studio C++endif()",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cmake-check-system-andcompiler/";
          
        },
      },{id: "post-备份-ubuntu-bash-alias-以及-bash-显示-git-status",
        
          title: "备份：Ubuntu Bash Alias, 以及 bash 显示 git status",
        
        description: "bash alias#################### bash aliasalias g=&#39;git status -sb&#39;alias ll=&#39;ls -alF&#39;alias la=&#39;ls -A&#39;alias l=&#39;ls -ltrhA&#39;alias gl=&#39;ls|grep --color&#39;# alias .=&#39;cd ../&#39;# alias ..=&#39;cd ../..&#39;alias ..=&#39;cd ..&#39;alias ...=&#39;cd ..; cd ..&#39;alias ....=&#39;cd ..; cd ..; cd ..&#39;alias c=&#39;clear&#39;alias r=&#39;reset&#39;bash 显示 git status# Show git branch nameforce_color_prompt=yescolor_prompt=yesparse_git_branch() { git branch 2&amp;gt; /dev/null | sed -e &#39;/^[^*]/d&#39; -e &#39;s/* \(.*\)/(\1)/&#39;}if [ &quot;$color_prompt&quot; = yes ]; then...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/ubuntu-bash-alias/";
          
        },
      },{id: "post-随机一致性抽样算法-ransac",
        
          title: "随机一致性抽样算法（RANSAC）",
        
        description: "1. RANSAC 算法过程最小二乘法拟合只进行一次迭代，计算所有离散点平均值，得到最终拟合直线或曲线。RANSAC通过多次迭代，寻找拟合直线或曲线的最佳（最近）权重的点。第N次拟合，得到第N次迭代的内点（集合）。第N+1次迭代，得到第N+1次的内点（集合），如果第N+1次迭代计算的内点其权重大于第N次迭代的内点的权重，则更新最佳内点为第N+1次的内点（集合）。其入参有：  点集；  拟合误差delta，作为判断内点的阈值；  迭代次数loopNum；其计算流程为：  随机选取一个点作为起点，随机选取另一个点作为终点；  从集合中查找所有误差在delta范围内的点集合：作为本次内点（集合）：this_inlier，计算其权重，与保存的权重比较best_weight，如果本次权重较好，则更新best_inlier为本次内点（集合），且更新best_weight为本次权重；  标记本次循环所访问过的点：包括终点在内的this_inlier为visited状态，后面的迭代中不再访问这些点；  重复步骤2-4，直到达到设定的迭代次数loopNum；Demo计算结果如下：2. 算法改进实际应用中，发现不能直接应用RANSAC算法。一个原因离散点（点云）数量过大，实际应用不能拟合期望的直线。另外就是其迭代次数在大数据量下，计算量过大。改进措施包括：  通过其他分块算法，初步得到拟合线段所在区域；  根据行业应用特点，限定起点、限定密度、限定斜率；  综合使用其中一个或多个，特别是初步筛选及限定起点；3. 实现TBD4. 更多资料  Ransac 随机一致性采样",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/RANSAC/";
          
        },
      },{id: "post-intel-tbb-malloc-使用-windows",
        
          title: "Intel TBB malloc 使用 (windows)",
        
        description: "CMake 查找 Intel TBBfind_package( TBB COMPONENTS tbb tbbmalloc tbbmalloc_proxy REQUIRED)if(TBB_FOUND) message(STATUS &quot;TBB version: ${TBB_VERSION}&quot;)endif()链接引入 TBB 库if (MSVC) target_link_libraries(${target_lib} PRIVATE TBB::tbb TBB::tbbmalloc TBB::tbbmalloc_proxy)endif()cpp 代码中引入 TBB 符号，防止库链接被优化掉#if defined(WITH_TBB_MALLOC) &amp;amp;&amp;amp; defined(_MSC_VER) //&amp;amp;&amp;amp; defined(NDEBUG)#include &quot;oneapi/tbb/scalable_allocator.h&quot;#include &quot;oneapi/tbb/tbbmalloc_proxy.h&quot;#pragma comment(lib, &quot;tbbmalloc_proxy.lib&quot;)#pragma comment(linker, &quot;/include:__TBB_malloc_proxy&quot;)#endif查看内存分配函数替换是否出错#if defined(WITH_TBB_MALLOC) &amp;amp;&amp;amp; defined(_MSC_VER) //&amp;amp;&amp;amp; defined(NDEBUG) { // https://emfomenk.github.io/versions/latest/elements/oneTBB/source/memory_allocation/c_interface_to_scalable_allocator.html const auto mode_ret = scalable_allocation_mode(TBBMALLOC_USE_HUGE_PAGES, 1); if (mode_ret == TBBMALLOC_NO_EFFECT) { spdlog::warn(&quot;huge pages not supported by...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/intel-tbb-malloc-usage/";
          
        },
      },{id: "post-复习-std-function-用法笔记",
        
          title: "复习：std::function 用法笔记",
        
        description: "std::function 可以将函数,函数对象（仿函数）,lambda表达式包装成一个对象。std::function对象本身可以作为函数参数，并且是可复制的（复制构造、赋值）。1. 封装函数指针int add(int a, int b) { return a + b; }int main() { std::function&amp;lt;int(int, int)&amp;gt; f = add; int result = f(1, 2); std::cout &amp;lt;&amp;lt; result &amp;lt;&amp;lt; std::endl; return 0;}2. 封装函数对象（仿函数）struct Adder { int operator()(int a, int b) { return a + b; }};int main() { Adder adder; std::function&amp;lt;int(int, int)&amp;gt; f = adder; int result = f(1, 2);...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/std-function/";
          
        },
      },{id: "post-整理-内存一致模型",
        
          title: "整理：内存一致模型",
        
        description: "内存一致性模型（Memory Consistency Model）是并发编程中的一个重要概念，它定义了在多线程环境下，内存操作的可见性和顺序性规则。内存一致性模型还涉及到Cache一致性（Cache Coherence）和CPU指令的乱序执行（Out-of-Order Execution）。理解内存一致性模型对于编写正确、高效的并发程序至关重要。1. CPU Cache 内部结构一个core内部结构： cache store buffer invalidate queue结构如下图所示：1.1. Cache一致性协议 MESIMESI是CPU内部多个core同步通讯协议，保证多个core中的cache的数据一致性。MESI这四个字母分别代表了每一个cache line可能处于的四种状态：Modified、Exclusive、Shared 和 Invalid。通过给cache line设置状态位，以及CPU core（也可能有内存控制器参与）之间的消息同步逻辑，让多个core中的cache数据保持一致性。在没有store buffer, invalidate queue之前，MESI可以保证不需要memory fence指令也可以保证数据的一致性。1.2. False sharingFalse sharing的原因是两个CPU访问的变量，在内存中的位置，同时落入一个cache line范围内，根据MESI协议，一个CPU写操作，将导致另一个CPU的读写操作之前，需要进行memory及两个CPU的cache line同步操作。通常发生在两个线程操作同一个数据结构体的时候。#define CACHE_ALIGN_SIZE 64#define CACHE_ALIGNED __attribute__((aligned(CACHE_ALIGN_SIZE)))struct aligned_value { int64_t val;} CACHE_ALIGNED; // Note: aligning the struct to a cache line sizealigned_value aligned_data[2] CACHE_ALIGNED;// sizeof(aligned_value) == 1281.3. 现代CPU上MESI的局限由于MESI同步协议导致处理器之间同步的代价很高，现代处理器再每个core里面增加两个异步队列: store buffer和invalidate queue来减少CPU的空闲等待。这两个异步队列，导致MESI协议失效。 store buffer: CPU将write/store操作数据放入store...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E6%95%B4%E7%90%86-%E5%A4%84%E7%90%86%E5%99%A8%E5%86%85%E5%AD%98%E6%A8%A1%E5%9E%8B/";
          
        },
      },{id: "post-总结-mmu-包括-tlb-以及-table-walk-unit-以及内存-page-table",
        
          title: "总结：MMU -- 包括 TLB 以及 Table Walk Unit ，以及内存 Page Table",
        
        description: "1. MMU 结构以及工作过程大多数使用MMU的机器采用内存分页机制，虚拟地址空间以页(Page)为单位，相应的，物理地址空间也被划分为页帧(Frame)。页帧必须与页保持相同的大小，通常为4KB，对于大页，页帧可以是2MB或1GB。大页一般用于服务器，用于系统分配大量数据，减少缺页中断的发生。MMU通过页表(Page Table)将虚拟地址映射到物理地址，页表存储在主存中，由系统内核创建及管理。MMU由两部分组成：TLB(Translate Look-aside Buffer)，以及Table Walk Unit： TLB (Translation Lookaside Buffer)：缓存最近使用的 VA 到 PA 的映射； Table Walk Unit：如果TLB没有命中CPU发出的VA，则由Table Walk Unit根据位于物理内存中的页表(Page Table)完成VA到PA的查找。CPU访问内存的时候，将VA发给MMU，MMU先在TLB中查找是否有对应的PA，如果有，则直接返回对应的PA；如果没有，则由Table Walk Unit根据位于物理内存中的页表完成查找。在上述过程中，如果Table Walk Unit没有找到对应的PA，则向CPU发出Page fault中断，CPU处理缺页中断（具体见后面章节描述）。MMU的工作过程图示：CPU发出的VA由两部分组成：VPN(Virtual Page Number) + offset。对应的，转换之后的物理地址也有两部分：页框号PFN(Physical Frame Number) + offset。1.1 从VA到PA，MMU处理流程图2. 页表结构现代CPU一般采用四级页表结构。以32位地址空间的二级页表为例，CPU发出的虚拟地址被拆分分为：页目录(Page Directory)、页表(Page Table)、页内偏移(Page Offset)三级（以4k为例，即12位）。VPN的最高10位用于索引页目录，紧接的10位用于索引页表索引，最低12位为页内偏移地址。拆分结构如下图所示：2.1 MMU查找过程MMU先根据一级页表的物理地址和一级页表Index去一级页表中找PTE，PTE中的地址不再是最终的物理地址，而是二级页表的物理地址。根据二级页表物理地址和二级页表index去二级页表中找PTE，此时PTE中的地址才是真实的物理地址。根据此物理地址和offset找到最终的物理内存地址。使用二级页表的好处是如果一级页表中的某一个PTE没有命中，那这一PTE对应的整个二级页表就不存在。2.2 进程页表与 Address Space ID操作系统会为每个进程分配一个页表，该页表使用物理地址存储。当进程使用类似malloc等需要映射代码或数据的操作时，操作系统会在随后马上修改页表以加入新的 物理内存。每次切换进程都需要进行TLB清理。这样会导致切换的效率变低。为了解决问题，TLB引入了ASID(Address Space ID)。ASID的范围是0-255。ASID由操作系统分配，当前进程的ASID值被写在ASID寄存器(使用CP15 c3访问)。TLB在更新页表项时也会将ASID写入TLB。MMU在查找TLB时， 只会查找TLB中具有相同ASID值的TLB行。且在切换进程时，TLB中被设置了ASID的TLB行不会被清理掉，当下次切换回来的时候还在。所以ASID的出现使得切换进程时不需要清理TLB中的所有数据，可以大大减少切换开销。3. 页表项(PTE) 与 TLB 中的标志位在进程的虚拟内存空间中，每一个虚拟内存页在页表中都有一个PTE与之对应，在32位系统中，每个PTE占用4个字节大小，其中保存了虚拟内存页背后映射的物理内存页的起始地址，以及进程访问物理内存的一些权限标识位。由于内核将整个物理内存划分为一页一页的单位，每个物理内存页大小为 4K，所以物理内存页的起始地址都是按照 4K 对齐的，也就导致物理内存页的起始地址的后 12 位全部是 0，我们只需要在PTE中存储物理内存地址的高...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/mmu-tlb-table-walk-unit-page-table/";
          
        },
      },{id: "post-自定义-operator-new-placement-new-以及释放内存",
        
          title: "自定义 operator new， placement new，以及释放内存",
        
        description: "1. new 操作符(new operator)new 操作符做两件事：分配内存 + 调用构造函数初始化。2. operator new通常声明如下：operator new 操作符的职责仅仅是分配内存，操作符返回一个未经处理（raw）的指针，未初始化的内存。void* operator new(size_t size);调用方式如下：void *rawMemory = operator new(sizeof(string));注意，显式调用 operator new 时，几乎没有意义，因为不能显式调用构造函数。2.1 对指定类型的 operator new, operator delete 进行重载#include &amp;lt;cstddef&amp;gt;#include &amp;lt;iostream&amp;gt;// class-specific allocation functionsstruct X { static void* operator new(std::size_t count) { std::cout &amp;lt;&amp;lt; &quot;custom new for size &quot; &amp;lt;&amp;lt; count &amp;lt;&amp;lt; &#39;\n&#39;; return ::operator new(count); } static void* operator new[](std::size_t count)...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/operator-new-placement-new/";
          
        },
      },{id: "post-学术绘图工具-engauge-digitizer",
        
          title: "学术绘图工具 -- Engauge Digitizer",
        
        description: "Engauge Digitizer  github repo  介紹 Engauge Digitizer 工具  曲线图转数据工具软件(Engauge Digitizer)提取文献中的数据WebPlotDigitizer  WebPlotDigitizer其他资料  手把手教你从曲线图中提取原始数据  chart_digitizer",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Academic-plot-tools/";
          
        },
      },{id: "post-opencl-环境准备及资料",
        
          title: "OpenCL 环境准备及资料",
        
        description: "0. GPU驱动相关sudo add-apt-repository ppa:oibaf/graphics-drivers1. OpenCL 环境准备1.1 查看 OpenCL 设备# 查看 GPU 设备lspci | grep -i vgasudo apt install clinfo使用 clinfo 命令查看 OpenCL 版本。C++ 程序需要定义OpenCL版本：target_compile_definitions(${target_name} PRIVATE CL_TARGET_OPENCL_VERSION=300)1.2 安装 OpenCL SDKsudo apt install libstb-dev libsfml-dev libglew-dev libglm-dev libtclap-dev ruby doxygen -y# 安装支持包：包括ICD Loader，SDK及头文件sudo apt install ocl-icd-opencl-devgit clone https://github.com/KhronosGroup/OpenCL-SDK.git --recursive# 编译 &amp;amp; 安装 OpenCL SDK ..... 额外安装：Intel OpenCL Runtime，用于支持在CPU上运行OpenCL程序（模拟GPU ??），需要先安装OpenCL Loader(Installable Client Driver...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/openCL-Install-and-Resources/";
          
        },
      },{id: "post-redis常用命令总结",
        
          title: "Redis常用命令总结",
        
        description: "1. redis monitor# 运行一下命令，进入monitor模式，可以实时查看redis的命令执行情况redis-cli monitormoniotor模式下，每执行一条redis命令，就会有类似如下输出：1720185799.917896 [0 127.0.0.1:43768] &quot;COMMAND&quot; &quot;DOCS&quot;1720185984.438276 [0 127.0.0.1:43768] &quot;set&quot; &quot;mykey&quot; &quot;hello&quot; &quot;EX&quot; &quot;60&quot;1720186045.464191 [0 127.0.0.1:43768] &quot;set&quot; &quot;mykey&quot; &quot;KEEPTTL&quot;1720186089.705980 [0 127.0.0.1:43768] &quot;set&quot; &quot;mykey&quot; &quot;hello&quot;  开启monitor之后，对性能有较大影响。2. redis 设置 key-value# 使用 redis-cli 命令进入redis命令行redis-cli127.0.0.1:6379&amp;gt; set mykey helloOK127.0.0.1:6379&amp;gt; get mykey&quot;hello&quot;参考  监控 redis 执行命令  redis 介绍和常用命令  Redis 常用命令及示例总结  如何查看 修改 Redis 密码",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/redis-commands/";
          
        },
      },{id: "post-在-markdown-中使用数学公式",
        
          title: "在 Markdown 中使用数学公式",
        
        description: "1. 在字符中添加空格有四种宽度的空格可以使用，如下表格： 语法 显示 \, a b \; a b \quad a b \qquad a b 一个示例如下：\[\begin{cases}(H_{y1} &amp;lt; y_i &amp;lt; H_{y2}) \;and\; (H_{y1} &amp;lt; y_o &amp;lt; H_{y2}) \\(50^\circ &amp;lt; |K_i| &amp;lt; 90^\circ) \;and\; (50^\circ &amp;lt; |K_o| &amp;lt; 90^\circ) \\\sqrt{(x_i - x_o)^2 + (y_i - y_o)^2} \leq L_{smin} \\k_i \times k_o &amp;gt; 0 \\\Delta x &amp;gt; \Delta y \\x_i &amp;gt; x_o...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E5%9C%A8Markdown%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F/";
          
        },
      },{id: "post-markdown-使用笔记",
        
          title: "Markdown 使用笔记",
        
        description: "1. Markdown 转义字符列表使用反斜杠（”\“）可以转义 Markdown 中的特殊字符，使其被当作普通文本显示。以下是 Markdown 中的特殊字符列表：\ backslash` backtick* asterisk_ underscore{} curly braces[] square brackets() parentheses# hash mark+ plus sign- minus sign (hyphen). dot! exclamation mark理论上， “\” 可以转义任何字符，如果该字符不是特殊字符也会原样输出。这里的理论上，其实说的是转义直接出现在正文中。2. 在 Markdown 中插入特殊符号2.1 任务列表符号 符号 用途 ✅ ☑ ✓ ✔ √ 完成、正确、同意 ❌ ☒ ✘ ✕ ✖ 未完成、错误、否决 ⏳ ⌛ 等待、进行中 2.2 状态与进度 类别 符号 说明 进度 ⏳ ⌛ ✅ 🚧 🔄...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Markdown%E8%AF%AD%E6%B3%95%E7%AC%94%E8%AE%B0/";
          
        },
      },{id: "post-使用inotify监控文件目录中的文件变化-新建文件",
        
          title: "使用inotify监控文件目录中的文件变化（新建文件）",
        
        description: "通过结合使用epoll和inotify 实现监控功能的同时，以超时的方式实现轮询，适合线程退出。int inotifyId = inotify_init();if (-1 == inotifyId) { SPDLOG_WARN(&quot;inotify_init failed&quot;); return;}int epfd = epoll_create(INOTIFY_FDS);if (-1 == epfd) { SPDLOG_WARN(&quot;epoll_create failed&quot;); return;}struct epoll_event ev;ev.data.fd = inotifyId;ev.events = EPOLLIN | EPOLLET;int ret = epoll_ctl(epfd, EPOLL_CTL_ADD, inotifyId, &amp;amp;ev);if (-1 == ret) { SPDLOG_WARN(&quot;epoll_ctl failed&quot;); return;}const char* pathName = &quot;&amp;lt;dir of files to monitor&amp;gt;&quot;;const uint32_t watch_mask = (IN_CLOSE_WRITE | IN_MODIFY | IN_ATTRIB);int watchFd...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/monitor-files-change-in-dir-using-inotify/";
          
        },
      },{id: "post-总结-使用-gperftools-进行性能分析",
        
          title: "总结：使用 gperftools 进行性能分析",
        
        description: "1. 安装 gperftools使用 gperftools Release页面 下载（不要使用git clone，且不要使用cmake编译，编译不生成pprof工具），编译命令：./configuremake &amp;amp;&amp;amp; make install安装graphviz：sudo apt-get install graphviz2. 将 gperftools 链接进待测试程序如何在CMake中查找gperftools的路径，参考笔记 CMake 编写FindPackage 模块: posts/2024-06-21-cmake-find_package.md，添加自定义CMake Find Package模块，并在CMakeLists.txt中添加find_package(gperftools)，即可找到gperftools的路径。编译脚本添加如下：option(ENABLE_PROFILER &quot;Enable google perftools&quot; ON)message(STATUS &quot;ENABLE_PROFILER: ${ENABLE_PROFILER}&quot;)if(ENABLE_PROFILER) set(CMAKE_MODULE_PATH &quot;${PROJECT_SOURCE_DIR}/cmake;${CMAKE_MODULE_PATH}&quot;) find_package(Gperftools REQUIRED) set(PROFILER_LIBS ${GPERFTOOLS_PROFILER_LIBRARY}) message(STATUS &quot;PROFILER_LIBS: ${PROFILER_LIBS}&quot;) add_definitions(&quot;-DHAVE_PROFILER&quot;)else() set(PROFILER_LIBS &quot;&quot;)endif()使能frame-pointer：if(ENABLE_PROFILER) message(STATUS &quot;enable profiler&quot;) target_compile_options(${target_test} PRIVATE -fno-omit-frame-pointer) target_link_options(${target_test} PRIVATE -fno-omit-frame-pointer) # set(CMAKE_CXX_FLAGS &quot;${CMAKE_CXX_FLAGS} -fno-omit-frame-pointer&quot;) # set(CMAKE_LINKER_FLAGS &quot;${CMAKE_LINKER_FLAGS} -fno-omit-frame-pointer&quot;)endif()3. 使用 gperftools 分析程序性能运行被测试程序：CPUPROFILE=test_flow_benchmark.prof...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/gperf-tools/";
          
        },
      },{id: "post-cmake-编写findpackage-模块",
        
          title: "CMake 编写FindPackage 模块",
        
        description: "例如编写CMake查找模块，名称为 Findgperftools.cmake，内容如下：# Try to find gperftools# Once done, this will define## gperftools_FOUND - system has Profiler# GPERFTOOLS_INCLUDE_DIR - the Profiler include directories# Tcmalloc_INCLUDE_DIR - where to find Tcmalloc.h# GPERFTOOLS_TCMALLOC_LIBRARY - link it to use tcmalloc# GPERFTOOLS_TCMALLOC_MINIMAL_LIBRARY - link it to use tcmalloc_minimal# GPERFTOOLS_PROFILER_LIBRARY - link it to use Profiler# TCMALLOC_VERSION_STRING# TCMALLOC_VERSION_MAJOR# TCMALLOC_VERSION_MINOR# TCMALLOC_VERSION_PATCHfind_path(GPERFTOOLS_INCLUDE_DIR gperftools/profiler.h HINTS $ENV{GPERF_ROOT}/include)find_path(Tcmalloc_INCLUDE_DIR gperftools/tcmalloc.h HINTS $ENV{GPERF_ROOT}/include)if(Tcmalloc_INCLUDE_DIR AND...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cmake-find_package/";
          
        },
      },{id: "post-简单线程安全队列",
        
          title: "简单线程安全队列",
        
        description: "#include &amp;lt;iostream&amp;gt;#include &amp;lt;queue&amp;gt;#include &amp;lt;mutex&amp;gt;template &amp;lt;typename T&amp;gt;class ThreadSafeQueue {public:    void push(const T&amp;amp; item) {        std::lock_guard&amp;lt;std::mutex&amp;gt; lock(mutex_);        queue_.push(item);    }    bool try_pop(T&amp;amp; item) {        std::lock_guard&amp;lt;std::mutex&amp;gt; lock(mutex_);        if (queue_.empty()) {            return false;        }        item = queue_.front();        queue_.pop();        return true;    }    bool empty() const {        std::lock_guard&amp;lt;std::mutex&amp;gt; lock(mutex_);        return queue_.empty();    }private:    std::queue&amp;lt;T&amp;gt; queue_;    mutable std::mutex mutex_;};",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/simple-thread-safe-queue/";
          
        },
      },{id: "post-使能-c-程序的核心转储",
        
          title: "使能 C++ 程序的核心转储",
        
        description: "1. 使能 core dump# 查看是否使能 core dump, -a 显示所有设置sudo ulimit -c# 使能 core dump，不限制core dump文件大小sudo ulimit -c unlimited# 限制 core dump 文件大小为 2Gsudo ulimit -c 4194304# 关闭 core dumpsudo ulimit -c 02. 修改 core dump 文件位置临时修改 core dump 文件位置：# 修改 core dump 文件位置为 /tmp/corefile，以及格式echo /tmp/corefile/core-%e-%p-%t &amp;gt; /proc/sys/kernel/core_pattern永久修改 core dump 文件位置：# /etc/sysctl.confkernel.core_pattern = /tmp/corefile/core-%e-%p-%tkernel.core_uses_pid = 0# 生效sysctl –p /etc/sysctl.confcore dump文件格式：%p -...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/enable-core-dump-for-cpp/";
          
        },
      },{id: "post-python-venv-环境搭建及-vscode-环境配置",
        
          title: "Python venv 环境搭建及 VSCode 环境配置",
        
        description: "1. Python venv 环境搭建1.1. venv安装pip install virtualenv# 设置永久国内 pip 源pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/pip config set install.trusted-host pypi.tuna.tsinghua.edu.cn1.2. 创建venv环境# python -m venv &amp;lt;目录&amp;gt;python -m venv .venv1.3. 激活venv环境Linux/Mac：source ./.venv/bin/activateWindows：.\.venv\Scripts\activate# 退出虚拟环境.\.venv\Scripts\deactivate.bat1.4. 安装依赖# pip install -r requirements.txt# pip install pygame2. vscode 环境配置2.1. settings.json配置需要安装插件： Python Pylance Yapf&quot;terminal.integrated.env.linux&quot;: { &quot;PYTHONPATH&quot;: &quot;${workspaceFolder}/python;${env:PYTHONPATH}&quot;},&quot;python.envFile&quot;: &quot;${workspaceFolder}/.env&quot;,&quot;python.analysis.extraPaths&quot;: [ &quot;${workspaceFolder}/python&quot;],&quot;[python]&quot;: { &quot;diffEditor.ignoreTrimWhitespace&quot;: false, &quot;editor.defaultFormatter&quot;: &quot;eeyore.yapf&quot;, &quot;editor.formatOnSaveMode&quot;: &quot;file&quot;, &quot;editor.formatOnSave&quot;: true, &quot;editor.indentSize&quot;: 2,...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode%E8%BF%9B%E8%A1%8CPython%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E8%AE%BE%E7%BD%AE/";
          
        },
      },{id: "post-nginx-用户的权限配置",
        
          title: "nginx 用户的权限配置",
        
        description: "# nginx 解决 403 错误问题sudo setenforce Permissivesudo setsebool -P httpd_can_network_connect onsudo chcon -Rt httpd_sys_content_t /usr/share/nginx/html/nginx不能启动，提示端口不能绑定 8090 端口查看服务状态信息，提示如下信息：nginx: [emerg] bind() to 0.0.0.0:80 failed (13: permission denied)# 查看是否在http_port_t类型下sudo semanage port -l | grep http_port_t# 如果不在，添加到http_port_t类型下sudo semanage port -a -t http_port_t  -p tcp 8090学习资料  nginx 安装配置及使用 启动权限拒绝问题",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/nginx-autho-config/";
          
        },
      },{id: "post-vscode-remote-ssh-使用局域网代理",
        
          title: "VSCode Remote SSH 使用局域网代理",
        
        description: "配置路径：远程[SSH:xxxx] -&amp;gt; 应用程序 -&amp;gt; Proxy。填入代理地址以及端口。另外，去掉Proxy Strict SSL复选框的选中，即将Copilot配置为忽略证书错误。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode-remotessh-%E5%B1%80%E5%9F%9F%E7%BD%91%E4%BB%A3%E7%90%86/";
          
        },
      },{id: "post-vscode-remote-ssh-免密登陆",
        
          title: "VSCode Remote SSH 免密登陆",
        
        description: "cat id_rsa.pub &amp;gt;&amp;gt; ~/.ssh/authorized_keyschmod 600 ~/.ssh/authorized_keyschmod 700 ~/.sshservice sshd restart",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode-remotessh-%E5%85%8D%E5%AF%86%E7%99%BB%E9%99%86/";
          
        },
      },{id: "post-opengl-流水线-待消化吸收",
        
          title: "OpenGL 流水线（待消化吸收）",
        
        description: "1. 流水线概念2. 流水线例子参考  GLSL教程（一）图形流水线",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/opengl-pipeline/";
          
        },
      },{id: "post-occ-boolean-operations",
        
          title: "OCC boolean operations",
        
        description: "OpenCASCADE 布尔运算简介  Boolean Operations  OpenCascade功能及模块简介个人理解：由于OCCT采用BRep（边界表示）表示方式，在做boolean操作时，计算出诸如edge/edge，face/face的交界面/点等，并存储供后面使用。1. 干涉检测计算出Objects与Tools的各种干涉类型：如vertex与vertex/edge/face/solid之间的干涉数据，edge与edge/face/solid之间的干涉数据，face与face/solid之间的干涉数据。主要是edge与edge之间的干涉检查。存储的干涉数据以P_curves，Pave形式存储。P_Curves是指比如一条边与一个面相交，需要在面上构建一条曲线来表示这条相交边。P_Curves存储边与面的相交信息（如交点、切线）。Pave是表示边界点的数据结构，出了位置外，还包含了曲率、方向等信息。在boolean过程中，需要用Pave存储相交信息。Pave是构建P_Curves（以及其他数据）的基础。2. General Fuse Algorithm (GFA)步骤如下：init -&amp;gt; calc vertex/vertex interferences -&amp;gt; calc vertex/edge interferences -&amp;gt; update Pave block -&amp;gt; calc edge/edge interferences -&amp;gt; calc vertex/face interferences -&amp;gt; calc edge/face interferences -&amp;gt; build split edges（构建分割边）-&amp;gt; calc face/face interferences -&amp;gt; build Section Edges（构建截面边）-&amp;gt; build P_Curves -&amp;gt;Process Degenerated Edges（处理退花边）。2.1 分割边其中，构建分割边，是指：  识别形状之间的交线  根据交线在Objects的形状上构建新的边  将这些新构建的边作为分割边  根据分割边，将Objects的形状划分为若干个子形状构建好分割边后,后续的布尔运算就可以基于这些分割后的子形状进行计算,得到最终的结果形状。2.2 截面边",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/OCCT-boolean-ops/";
          
        },
      },{id: "post-windows下安装-msmpi",
        
          title: "Windows下安装 MSMPI",
        
        description: "下载安装包及环境变量设置下载安装msmpi以及msmpisdk：MSMPI github releases。注意安装路径不要有空格及中文。命令行设置：set MSMPI输出信息如下图所示：建立第一个测试程序hello_mpifind_package(MPI REQUIRED)# list(APPEND myMPI_INC_DIR $ENV{MSMPI_INC})# list(APPEND myMPI_LIBS $ENV{MSMPI_LIB64})message(STATUS &quot;MPI_FOUND=${MPI_FOUND}&quot;)message(STATUS &quot;MPI_CXX_INCLUDE_DIRS=${MPI_CXX_INCLUDE_DIRS}&quot;)message(STATUS &quot;MPI_LIBRARIES=${MPI_LIBRARIES}&quot;)#include &amp;lt;mpi.h&amp;gt;#include &amp;lt;stdio.h&amp;gt;int main(int argc, char** argv) { // Initialize the MPI environment MPI_Init(&amp;amp;argc, &amp;amp;argv); // Get the number of processes ssociated with the communicator int world_size{}; MPI_Comm_size(MPI_COMM_WORLD, &amp;amp;world_size); // Get the rank of the calling process int world_rank{}; MPI_Comm_rank(MPI_COMM_WORLD, &amp;amp;world_rank); // Get the name of the...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/windows-install-msmpi/";
          
        },
      },{id: "post-基于vtk的3d软件",
        
          title: "基于VTK的3D软件",
        
        description: "1. VisIt  VisIt。  github。2. Inviwo它支持微软的Windows、苹果的Mac OS和开源的Linux，核心模块采用C++开发，支持Python 3.9版本以上的调用。底层的图形渲染采用 OpenGL 3.3 以上的核心模式，图形用户界面已经支持Qt6。  Inviwo。  github。3. Voreen  website  source4. MegaMol  website  github5. ParaView  website  github6. ttk  website  github7. PolyscopePolyscope是一个年轻、有趣的可视化软件包。  website  github8. GLVis  website  github9. libigllibigl本身是一个轻量化的C++计算几何处理库，但是最终的处理结果会以可视化的方式呈现出来，因此笔者把它视为可视化软件。很多大学和知名机构都使用libigl。  website  github10. morphologica它是一个非常年轻的数据可视化工具包。它的定位有点类似之前介绍的VTK，是以C++头文件库方式提供的、底层渲染使用现代OpenGL、适用于各类数值模拟的可视化开发工具包。目前orphologica可以结合GLFW、Qt和wxWidgets等图形用户界面库进行开发，从而可以提供比较友好的窗口管理和用户界面。  doc  github11. F3D  F3D  github引用  科学可视化软件介绍 – VTK",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/vtk-based-3d-software/";
          
        },
      },{id: "post-opengl-vulkan-学习网站-记录",
        
          title: "OpenGL/Vulkan 学习网站（记录）",
        
        description: "opengl-tutorial (cn) LearnOpenGL-CN官方教程 OpenGL Tutorials TyphoonLabs’ OpenGL Shading Language tutorials TyphoonLabs’ OpenGL Shader Designer IDE有关3D计算机图形学的基础知识 Learning Modern 3D Graphics Programming github – Ray Tracing in One Weekend Book Series Physically Based Rendering:From Theory To ImplementationVulkan 学习资源SDK以及资源： LunarG Vulkan SDK Vulkan GPU 资源 Getting Started with the Linux Tarball Vulkan SDK学习资料： Vulkan Tutorial。大神Overv写的，非常棒的Vulkan入门教程。 VulkanTutorialCN。Vulkan Tutorial的中文翻译版。 VulkanTutorialCN pdf。Vulkan Tutorial的中文翻译版PDF。 VkGPUDrivenCNGuide。 Vulkan GPU...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/opengl-vulkan%E5%AD%A6%E4%B9%A0%E8%B5%84%E6%96%99/";
          
        },
      },{id: "post-为什么要使用-std-enable-shared-from-this-以及使用场景",
        
          title: "为什么要使用 std::enable_shared_from_this，以及使用场景",
        
        description: "为什么要使用 std::enable_shared_from_this 当使用原始指针构造或者初始化一个shared_ptr时，将会创建一个新的控制块。为了确保一个对象仅由一个共享的控制块管理，必须通过复制已存在的shared_ptr对象来创建一个新的shared_ptr实例。 但是在某些情况下，shared_ptr管理的对象需要为自己获取shared_ptr，类似于下面这样尝试从自身指针创建shared_ptr的方式是行不通的： struct Egg { std::shared_ptr&amp;lt;Egg&amp;gt; get_self_ptr() { return std::shared_ptr&amp;lt;Egg&amp;gt;(this); }};void spam() { auto sp1 = std::make_shared&amp;lt;Egg&amp;gt;(); auto sp2 = sp1-&amp;gt;get_self_ptr(); // undefined behavior // sp1 and sp2 have two different control blocks managing same Egg} 类似下面这样，在类内部持有自身的shared_ptr对象导致其释放不了：#include &amp;lt;iostream&amp;gt;#include &amp;lt;memory&amp;gt;#include &amp;lt;boost/core/ignore_unused.hpp&amp;gt;struct Immortal { std::shared_ptr&amp;lt;Immortal&amp;gt; self; ~Immortal() { std::cout &amp;lt;&amp;lt; &quot;dtor of Immortal called. self.use_count() = &quot; &amp;lt;&amp;lt; self.use_count() &amp;lt;&amp;lt;...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BD%BF%E7%94%A8enable_shared_from_this/";
          
        },
      },{id: "post-std-shared-ptr-线程安全及性能考量",
        
          title: "std::shared_ptr 线程安全及性能考量",
        
        description: "1. 线程安全根据cppreference的描述，std::shared_ptr线程安全如下（机器翻译）： 如果是每个线程都拥有自己的std::shared_ptr对象，则针对线程自己的std::shared_ptr对象，其所有成员函数都是线程安全的； 如果多个线程共享同一个std::shared_ptr对象，其const成员函数的访问是线程安全的，但其非const成员函数的访问需要同步。 多线程访问同一个std::shared_ptr对象时，使用std::atomic&amp;lt;std::shared_ptr&amp;lt;T&amp;gt;&amp;gt;可以防止数据竞争。原文：All member functions (including copy constructor and copy assignment) can be called by multiple threads on different shared_ptr objects without additional synchronization even if these objects are copies and share ownership of the same object. If multiple threads of execution access the same shared_ptr object without synchronization and any of those accesses uses a non-const member...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/shared_ptr_thread_safe/";
          
        },
      },{id: "post-系统设计资料-以及23种设计模式彩图",
        
          title: "系统设计资料，以及23种设计模式彩图",
        
        description: "linux-insides 中文翻译  system-design-primer参考  万字详解 GoF 23 种设计模式（多图、思维导图、模式对比），让你一文全面理解  Design Patterns In Modern C++ 中文版翻译 -第24章：访问者模式",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/design-patterns-23/";
          
        },
      },{id: "post-c-实现一个简洁的-lru-缓存",
        
          title: "C++实现一个简洁的 LRU 缓存",
        
        description: "template &amp;lt;typename T, typename KeyT = int&amp;gt;struct lru_cache_t { size_t sz_; std::list&amp;lt;std::pair&amp;lt;KeyT, T&amp;gt;&amp;gt; cache_; using ListIt = typename std::list&amp;lt;std::pair&amp;lt;KeyT, T&amp;gt;&amp;gt;::iterator; std::unordered_map&amp;lt;KeyT, ListIt&amp;gt; hash_; lru_cache_t(size_t sz) : sz_(sz) {} bool full() const { return (cache_.size() == sz_); } template &amp;lt;typename F&amp;gt; bool lookup_update(KeyT key, F slow_get_page) { auto hit = hash_.find(key); if (hit == hash_.end()) { if (full()) { hash_.erase(cache_.back().first); cache_.pop_back();...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cpp%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AALRU/";
          
        },
      },{id: "post-pod-trivial-copyable-standard-layout",
        
          title: "POD、trivial copyable，standard layout",
        
        description: "1. trival copyabletrival copyable 是指内存布局可以使用 memcpy 进行内存拷贝的类型，但不定义与C类型兼容。C++11 要求如下： 构造函数，复制构造函数，移动构造函数（move ctor），析构函数，均为默认。 赋值运算符，移动赋值运算符，均为默认。 没有虚函数和虚基类。1.1 说明 默认的构造等函数，包含可以使用 =default，如果包含自定义的构造函数，且提供 =default 的构造函数，其依然是 trival copyable。 可以使用初始化列表初始化成员，其依然是 trival copyable。 如果包含了虚函数 / 虚基类 / 虚析构函数，因为会生成 vptr，所以不是 trival copyable。 可以包含 static 成员，且可以是 None trivial copyable。 可以包含 private等访问控制符。 C++11 中，我们使用模版类 std::is_trivially_copyable&amp;lt;T&amp;gt;::value 来判断一个类型是否为平凡类型。1.2 示例// empty classes are trivialstruct Trivial1 {};// all special members are implicitstruct Trivial2 { int x;};struct Trivial3 :...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cpp11-pod-type/";
          
        },
      },{id: "post-cmake-创建自定义目标-在构建前复制文件",
        
          title: "CMake 创建自定义目标：在构建前复制文件",
        
        description: "创建自定义目标add_custom_target(TargetCopy3rdPartyLibs ALL    COMMAND ${CMAKE_COMMAND} -E make_directory &quot;${CMAKE_RUNTIME_OUTPUT_DIRECTORY}&quot;    COMMAND cp_3rd_libs.bat &quot;${PROJECT_SOURCE_DIR}/3rd_libs&quot; &quot;${CMAKE_RUNTIME_OUTPUT_DIRECTORY}&quot;    WORKING_DIRECTORY &quot;${PROJECT_SOURCE_DIR}/src/cmake&quot;    COMMENT &quot;Copying 3rd party libraries to bin directory&quot;)引用自定义目标在编译APP，LIB的CMakeLists.txt文件中，添加：set_target_properties(${target_app} PROPERTIES DEPENDS Copy3rdPartyLibs)",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cmake-create-custom-target-copy-files-before-build/";
          
        },
      },{id: "post-opencascade拓扑与几何的关系",
        
          title: "OpenCascade拓扑与几何的关系",
        
        description: "1. OPENCASCADE 中的拓扑结构（TopoDS包）抽象结构是以TopoDS包的C++类来实现的。下面是一个继承图，取自Doxygen生成的文档。TopoDS_Shape 是通过值来操作的，包含3个字段–location、orientation 和一个 myTShape 句柄 （TopoDS_TShape类型），见下图（只包含最重要的字段）：myTShape 和 Location 被用来在各种形状之间共享数据，从而节省大量的内存。例如，两个连接在一起的面中间的边，这个边具有相同的位置（location）和 myTShape，但有不同的朝向（orientation）（在其中一个面是正向，在另一个面中是反向）。2. OPENCASCADE 中的边界表示法（BRep包）边界表示（Boundary Representation）也称为BRep表示，它是几何造型中最成熟、无二义的表示法。实体的边界通常是由面的并集表示，而每个面又由它所在曲面的定义加上其边界来表示，面的边界是边的并集，而边又是由点来表示。如下图1.1所示，曲面的汇合处形成曲线，而曲线的汇合处形成点。所以点、线、面是描述一个形状所需要的基本组成单元。几何信息（在BRep包中）通过继承TopoDS_Shape类来实现，只有3种类型的拓扑对象有几何特征–顶点（vertex）、边(edge)和面(face)（见下图）：2.1 Brep 进一步说明几何信息（BRep）描述了形状的形状、位置、方向、边界等信息，而拓扑信息（TopoDS）描述了形状的拓扑结构，如顶点、边、面的连接关系。以BRep Edge为例说明：边有几种几何表示方式（参考上图，BRep_TEdge之下有节点List of Edge Representions）: 三维空间的曲线C(t)，用类Geom_Curve实现，这是基础表示方式。 曲线P(t)为二维空间中的参数曲线，用于描述位于曲面上的曲线。这些通常被称为pcurves，用类Geom2d_Curve实现。 多边形（Polygonal representation）用一组三维点来描述，用类Poly_Polygon3D实现。 多边形（Polygonal representation），也可以用一组三维点的编号来描述，在类Poly_PlygonOnTriangulation实现。3. OpenCascade 中拓扑（Topo）与几何（BRep）的关系边界表示的一个重要特点是描述形状的信息包括几何信息（geometry）和拓朴（topology）信息两个方面： 拓朴信息描述形状上的顶点、边、面的连接关系，它形成物体边界表示的“骨架”。 形状的几何信息犹如附着在“骨架”上的肌肉。在OpenCascade中，形状的几何信息包含曲线和曲面的参数解析表示Geom_Curve/Geom_Surface。这样我们就可以用平面方程和柱面方程来描述曲面，用直线或圆弧方程来描述曲线。这时会出现一个问题，即代数表达式只能定义无边界的几何体。除了单个点、圆以及球体，经典的解析几何仅能表示无限延伸的曲线和曲面。为了解决这个问题，边界表示法按下述方法明确地定义曲线或曲面的边界： 曲线的边界由位于曲线上的一对点来确定； 曲面的边界由位于曲面上的一组曲线来确定；通过这个方法，就可以定义一段曲线或一片曲面。这时，不同几何元素之间的关系的组织问题就出现了，为此我们将记录如下信息： 哪些点界定哪些曲线； 哪些曲线界定哪些曲面；这些关于谁关联谁的信息，就是几何造型系统经常提到的拓朴。在边界表示法中，理论上表示一个物理模型只需要三个拓朴体（顶点TopoDS_Vertex、边TopoDS_Edge和面TopoDS_Face），但在实际应用中，为了提高计算机处理的速度或提供高级的操作功能，还要引入其他一些概念，如环TopoDS_Wire、壳TopoDS_Shell、复合体TopoDS_Compound等。z. 原文及参考z.1 ROMAN LYGIN TOPOLOGY AND GEOMETRY IN OPEN CASCADE. PART 1 TOPOLOGY AND GEOMETRY IN OPEN CASCADE. PART 2 TOPOLOGY AND GEOMETRY IN OPEN CASCADE....",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Topology-and-Geometry-in-Open-CASCADE/";
          
        },
      },{id: "post-vscode-改用-mathjax-渲染数学公式",
        
          title: "VSCode 改用 MathJax 渲染数学公式",
        
        description: "首先安装Markdown Preview Enhanced插件，并做如下配置：  Ctrl+Shift+P → Markdown Preview Enhanced: Open Config Script (Global)将如下内容添加到配置文件config.js中：{  &quot;mathjaxConfig&quot;: {    &quot;tex&quot;: {      &quot;inlineMath&quot;: [[&quot;$&quot;, &quot;$&quot;], [&quot;\\(&quot;, &quot;\\)&quot;]],      &quot;displayMath&quot;: [[&quot;$$&quot;, &quot;$$&quot;], [&quot;\\[&quot;, &quot;\\]&quot;]],      &quot;tags&quot;: &quot;ams&quot;    }  }}",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode%E6%94%B9%E7%94%A8MathJax%E6%B8%B2%E6%9F%93%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F/";
          
        },
      },{id: "post-我的vscode插件清单",
        
          title: "我的VSCode插件清单",
        
        description: "1. 全量清单extensions.json文件内容如下所示：{ &quot;recommendations&quot;: [&quot;bierner.markdown-mermaid&quot;, &quot;davidanson.vscode-markdownlint&quot;, &quot;devtbi.vscode-cppinsights&quot;, &quot;donjayamanne.python-extension-pack&quot;, &quot;dotjoshjohnson.xml&quot;, &quot;github.copilot&quot;, &quot;github.copilot-chat&quot;, &quot;ibm.output-colorizer&quot;, &quot;josetr.cmake-language-support-vscode&quot;, &quot;kevinrose.vsc-python-indent&quot;, &quot;llvm-vs-code-extensions.vscode-clangd&quot;, &quot;mechatroner.rainbow-csv&quot;, &quot;meta.pyrefly&quot;, &quot;ms-ceintl.vscode-language-pack-zh-hans&quot;, &quot;ms-dotnettools.vscode-dotnet-runtime&quot;, &quot;ms-python.black-formatter&quot;, &quot;ms-python.debugpy&quot;, &quot;ms-python.isort&quot;, &quot;ms-python.python&quot;, &quot;ms-python.vscode-pylance&quot;, &quot;ms-python.vscode-python-envs&quot;, &quot;ms-vscode-remote.remote-ssh&quot;, &quot;ms-vscode-remote.remote-ssh-edit&quot;, &quot;ms-vscode-remote.vscode-remote-extensionpack&quot;, &quot;ms-vscode.cmake-tools&quot;, &quot;ms-vscode.cpptools&quot;, &quot;ms-vscode.cpptools-extension-pack&quot;, &quot;ms-vscode.cpptools-themes&quot;, &quot;ms-vscode.remote-explorer&quot;, &quot;repreng.csv&quot;, &quot;theqtcompany.qt&quot;, &quot;theqtcompany.qt-core&quot;, &quot;theqtcompany.qt-cpp&quot;, &quot;theqtcompany.qt-cpp-pack&quot;, &quot;theqtcompany.qt-qml&quot;, &quot;theqtcompany.qt-ui&quot;, &quot;vscode-icons-team.vscode-icons&quot;, &quot;yzhang.markdown-all-in-one&quot;]}插件分类总结： 分类 插件数 主要工具 C++/Clangd 4 clangd, cpptools, cppinsights Qt 开发 6 Qt官方全套扩展 Python 7 Python, Pylance, Black等 CMake 2...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode%E6%8F%92%E4%BB%B6%E6%B8%85%E5%8D%95/";
          
        },
      },{id: "post-vscode-开发-使能powershell-git自动完成",
        
          title: "VSCode 开发，使能PowerShell Git自动完成",
        
        description: "准备配置 VSCode 使用 PowerShell7VSCode快捷键打开用户配置文件(Json)：ctrl+shift+p，输入open user settings，选择打开settings.json文件。添加以下内容：&quot;terminal.integrated.profiles.windows&quot;: { &quot;PowerShell&quot;: { &quot;source&quot;: &quot;PowerShell7&quot;, &quot;icon&quot;: &quot;terminal-powershell&quot; }, &quot;Command Prompt&quot;: { &quot;path&quot;: [ &quot;${env:windir}\\Sysnative\\cmd.exe&quot;, &quot;${env:windir}\\System32\\cmd.exe&quot; ], &quot;args&quot;: [], &quot;icon&quot;: &quot;terminal-cmd&quot; }, &quot;Git Bash&quot;: { &quot;source&quot;: &quot;Git Bash&quot; }, &quot;PowerShell7&quot;: { &quot;path&quot;: &quot;C:\\Program Files\\PowerShell\\7\\pwsh.exe&quot;, &quot;args&quot;: [], &quot;icon&quot;: &quot;terminal-powershell&quot; }},&quot;terminal.integrated.defaultProfile.windows&quot;: &quot;PowerShell7&quot;,下载 posh-git需要使用 posh-git。首先确定PowerShell版本（在安装PowerShell 7之后，vscode默认使用的是PowerShell 7）：$PSVersionTable.PSVersion安装 posh-git脚本执行策略必须设置为 RemoteSigned 或 Unlimited，需要以管理员身份在powershell中执行以下语句Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Confirm然后安装posh-git模块：Install-Module PowershellGet -Force# A...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode%E4%BD%BF%E8%83%BDPowerShell-Git%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90/";
          
        },
      },{id: "post-vscode-开发-powershell-高效操作设置",
        
          title: "VSCode 开发，PowerShell 高效操作设置",
        
        description: "1. PowerShell 清屏快捷键设置由于 VSCode Windows 开发使用 cls 命令不能执行清屏操作（仅仅是滚动SCREEN缓冲区），所以使用快捷键代替清屏操作。VSCode 中，Ctrl + Shift + p 打开设置，搜索 Terminal: Clear，找到 Terminal: Clear，将快捷键设置为 Ctrl + l。PowerShell alias 设置前提：Windows 系统为了防止恶意脚本自动执行，故默认不允许自动运行脚本。需要以管理员身份，在 PowerShell 中执行：Set-ExecutionPolicy RemoteSigned打开 PowerShell 终端，输入 notepad $profile，打开 PowerShell 启动配置文件。在配置文件中添加以下内容：# git log 别名function gl { git log --color --graph --pretty=format:&#39;%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)&amp;lt;%an&amp;gt;%Creset&#39; --abbrev-commit }# git status 别名function g { git status -sb }2. Poewrshell...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/VSCode-PowerShell%E9%AB%98%E6%95%88%E5%BC%80%E5%8F%91%E8%AE%BE%E7%BD%AE/";
          
        },
      },{id: "post-qt-笔记及开源库收集",
        
          title: "Qt 笔记及开源库收集",
        
        description: "1. 控件的 eventFilter如下代码，将为edtCleanCount部件安装一个事件过滤器，当用户按下Up或Down键时，并且参数obj为edtCleanCount时，会自动修改edtCleanCount的值。也可以继承QLineEdit类，重写keyPressEvent方法，实现相同的功能。// eventFilter 声明// bool eventFilter(QObject* obj, QEvent* event) override;// initvoid MyDialog::init() { // 设置只允许edtCleanCount输入数字 QValidator* validator = new QRegExpValidator(QRegExp(&quot;[0-9]+&quot;), this); ui-&amp;gt;edtCleanCount-&amp;gt;setValidator(validator); //在编辑器部件安装事件过滤器 ui-&amp;gt;edtCleanCount-&amp;gt;installEventFilter(this);}bool MyDialog::eventFilter(QObject* obj, QEvent* event) { if (obj == ui-&amp;gt;edtCleanCount &amp;amp;&amp;amp; event-&amp;gt;type() == QEvent::KeyPress) { QKeyEvent* key_event = static_cast&amp;lt;QKeyEvent*&amp;gt;(event); const auto key = key_event-&amp;gt;key(); if (key == Qt::Key_Up || key == Qt::Key_Down) { auto flag =...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/qt-notes/";
          
        },
      },{id: "post-linux系统及编译相关笔记",
        
          title: "Linux系统及编译相关笔记",
        
        description: "1. 加载多个DSO中存在同名符号APP加载的多个DSO，如果存在重复的符号，则只加载第一个遇到的符号。规则适合于包括函数，全局变量。加载顺序，由链接顺序，以及环境变量定义lib路径优先级，如RPATH，LD_LIBRARY_PATH。路径搜索优先级为：RPATH &amp;gt; LD_LIBRARY_PATH &amp;gt; ld.so.cache。1.1. RPATH编译期间，设定RPATH，如cmake脚步设置如下：set_target_properties(${target_name} PROPERTIES LINK_FLAGS &quot;-Wl,-rpath=&#39;$ORIGIN&#39; &quot;)如果存在间接依赖，则也优先使用RPATH设定的路径进行搜索。1.1.1. ORIGIN 占位符$ORIGIN是一个特殊的占位符，代表可执行文件或库文件自身的目录，当设置为$ORIGIN时，它告诉动态链接器在可执行文件或库所在的同一目录下查找依赖的库。1.2. 调试lib加载–LD_DEBUG设置环境变量LD_DEBUG使能系统级加载信息：LD_DEBUG=libs ./test_app1.3. 参考链接  Linux运行时动态库搜索路径优先级  gitee – 测试代码2. Linux命令：查看APP/DSO的编译器信息查看架构：file bin/jouav_cluster_msg_simu# readelf -h bin/jouav_cluster_msg_simu | grep Machine查看编译器版本：readelf -p .comment bin/jouav_cluster_msg_simu3. 其他文章  linux更换题目(可执行文件)libc版本问题",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/linux-and-compile-notes/";
          
        },
      },{id: "post-如何使用-github-pages-以及-chirpy-theme-创建博客",
        
          title: "如何使用 github pages 以及 Chirpy Theme 创建博客",
        
        description: "使用Chirpy Theme在GitHub Pages部署Jekyll  使用Jekyll + Github Pages搭建静态网站  Text and Typography",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/how-to-create-blog-using-github-pages-and-Chirpy-theme/";
          
        },
      },{id: "post-ubuntu-24-04-分区-以及更换-kernel-6-18",
        
          title: "Ubuntu 24.04 分区，以及更换 kernel 6.18",
        
        description: "Ubuntu 24.04 分区建议更换 kernel 6.18# 查看已经有的 kernel 版本# sudo apt-cache search linux-headers | grep 6.1sudo add-apt-repository ppa:cappelikan/ppa -ysudo apt update &amp;amp;&amp;amp; sudo apt install mainline -y安装新版的 kernel 6.18，执行命令后，工具会自动开始内核相关文件的下载：sudo mainline install 6.18# 安装完成后，重启系统sudo reboot# 重启后，查看当前内核版本uname -r实际上，所有可用的kernel版本都可以从Ubuntu官方仓库看到：https://kernel.ubuntu.com/mainline/。安装完成并重启之后，可以锁定当前版本：sudo apt-mark hold $(dpkg -l | grep -E &quot;linux-(headers|image|unsigned|modules|modules-extra)&quot; | grep 6.12.3 | awk &#39;{print $2}&#39;)删除旧版本 kernel（需要先锁定当前新版本，不然新版本也会删除）：# 查看已经安装的 kernel 版本dpkg -l | grep -E &quot;linux-(headers|image|modules-extra)+&quot; |...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/Ubuntu%E5%AE%89%E8%A3%85%E6%96%B0%E7%89%88%E6%9C%ACkernel/";
          
        },
      },{id: "post-c-17-新功能-std-visit-和-std-variant-配合使用-待更新删除冗余描述",
        
          title: "C++ 17 新功能： std::visit 和 std::variant 配合使用 (待更新删除冗余描述)",
        
        description: "1. std::variant （变体）在很多编程场景中，我们经常遇到需要处理多种类型的情况。传统上，这可以通过多种方式来实现，例如使用 union 或 void* 指针，甚至使用一系列的 if-else 语句和类型转换。但这些方法通常都有各种缺点，如类型不安全、容易出错或难以维护。std::variant 为这一问题提供了一个现代、类型安全的解决方案。它允许你在一个单一的变量中存储多种不同的类型，并能在运行时安全地访问它们，并能获取他们的类型信息。可以把它看作是一个可以存储多种类型中的任一种的类型安全的容器。下面是一个基本用法的例子：#include &amp;lt;variant&amp;gt;#include &amp;lt;iostream&amp;gt;int main() { std::variant&amp;lt;int, double, std::string&amp;gt; v1 = 42; std::variant&amp;lt;int, double, std::string&amp;gt; v2 = 3.14; std::variant&amp;lt;int, double, std::string&amp;gt; v3 = &quot;hello&quot;; // 访问存储的值（不安全，需确保类型正确） std::cout &amp;lt;&amp;lt; std::get&amp;lt;int&amp;gt;(v1) &amp;lt;&amp;lt; std::endl; // 安全地访问存储的值 auto pval = std::get_if&amp;lt;int&amp;gt;(&amp;amp;v1); if (pval) { std::cout &amp;lt;&amp;lt; *pval &amp;lt;&amp;lt; std::endl; } return 0;}1.1 std::variant 的局限尽管 std::variant 非常强大，但它并不是万能的。它的一个主要限制是，虽然它可以存储多种类型，但在任何给定时间点，它只能存储其中一种。这意味着，如果你想存储多种类型，你需要使用...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/combind-usage-of-std-visit-and-std-variant/";
          
        },
      },{id: "post-vtk-笔记",
        
          title: "VTK 笔记",
        
        description: "VTK可视化基本流程/* 二维等值线提取与可视化代码片段 */// 等值线 FiltervtkContourFilter *contourFilter = vtkContourFilter::New();contourFilter-&amp;gt;SetValue(0, ui-&amp;gt;selectedValueLabel-&amp;gt;text().toDouble());contourFilter-&amp;gt;SetInputData(polyData);// 将几何数据转换为可被渲染引擎绘制的可视化表达vtkPolyDataMapper *contourMapper = vtkPolyDataMapper::New();contourMapper-&amp;gt;SetInputConnection(contourFilter-&amp;gt;GetOutputPort());contourMapper-&amp;gt;ScalarVisibilityOff();// 需要被渲染绘制的对象contourActor = vtkActor::New();contourActor-&amp;gt;SetMapper(contourMapper);contourActor-&amp;gt;GetProperty()-&amp;gt;SetColor(1.0, 0.0, 0.0);contourActor-&amp;gt;GetProperty()-&amp;gt;SetLineWidth(2.0);// 添加到渲染器renderer-&amp;gt;AddActor(contourActor);VTK 主要 class  VTK 简明教程 – 主要 classVTK开发精要：数据与管线机制（济南友泉软件有限公司）  VTK开发精要：数据与管线机制FilterVTK中通过管线机制来实现组合各种算法处理数据。每一种算法是一个Filter，多个Filter连接在一起形成VTK管线。$\color{#FF0000}{每个Filter可以分为两个组成部分：一个是算法对象，继承自vtkAlgrithm，主要负责处理输入的数据和信息；另一个是执行对象，继承自vtkExecute()，负责通知算法对象何时运行以及传递需要处理的数据和信息。}$Filter类继承自vtkAlgrithm及其子类，实例化时，内部会生成一个默认的Executive()对象，用于管理执行管线。Filter的输入数据与信息存储在输入端口中。一个Filter可能有0个输入端口（例如 Reader 对象）；也可能有一个或多个输入端口（例如，vtkGlyph3D 类需要两个输入端口，每个输入端口可以建立多个连接）。一个Filter可能有1个或多个输出端口，每个输出端口对应一个逻辑输出。例如vtkExtractVectorComponents类，从一个三维向量数据中提取每个分量数据，该Filter需要一个输入端口接受向量数据，三个输出端口用于输出三个分量数据，端口号分别为 0, 1, 2。Filter之间通过端口（Port）建立连接（Connection）。例如一个标准的连接代码如下：Filter2-&amp;gt;SetInputConnection( Filter1-&amp;gt;GetOutputPort() );该句代码将Filter1的输出端口与Filter2的输入端口建立连接，连接中只涉及了一个输入端口和一个输出端口。VTK中还有许多Filter可能需要多个输入，例如vtkGlyph3D，该类需要两个输入数据并生成一个输出数据。因此这里需要建立两个连接，相应的函数分别为SetInputConnection()和SetSourceConnection()，其中，SetInputConnection()输入的是几何点集数据，对应输入端口0，SetSourceConnection()输入的是Glyph图形数据，对应输入端口1。vtkGlyph3D中输入的两个数据具有不同的意义，因此建立了两个不同的输入端口。另外，对一个Filter的多个输入数据具有相同意义时，则只需要建立一个输入端口，并使用AddInputConnection()来添加新的连接。例如vtkAppendFilter类实现数据的合并，其多个输入数据具有相同意义，而不像vtkGlyph3D的两个输入表示不同的对象，因此其连接建立如下：apeend = vtkAppendFilter::New();append-&amp;gt;AddInputConnection( foo-&amp;gt;GetOutputPort );append-&amp;gt;AddInputConnection( bar-&amp;gt;GetOutputPort );管线的接口是通过逻辑端口（Logical Port）而不是数据流实现的，因此在形成连接的过程中不需要知道实际的数据类型，而是在执行时进行数据类型检查，以决定管线是否执行。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/vtk-notes/";
          
        },
      },{id: "post-linux-系统console使用命令清屏",
        
          title: "Linux 系统console使用命令清屏",
        
        description: "echo -en &quot;\e[H\e[J\e[3J&quot;reference  clear command in Konsole",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/clean-screen-and-reset/";
          
        },
      },{id: "post-vtkunstructuredgrid-显示-hdf5-数据",
        
          title: "vtkUnstructuredGrid 显示 HDF5 数据",
        
        description: "Reference VTK examples添加 field (dataset) 数据第一步，创建VTK的field数据vtkSmartPointer&amp;lt;vtkDoubleArray&amp;gt; fieldDataArray = vtkSmartPointer&amp;lt;vtkDoubleArray&amp;gt;::New();fieldDataArray-&amp;gt;SetNumberOfComponents(1); // assuming scalar data// Assuming &quot;dataset&quot; is your std::map&amp;lt;std::string, std::vector&amp;lt;double&amp;gt;&amp;gt;for (const auto&amp;amp; pair : dataset) { const std::string&amp;amp; fieldName = pair.first; const std::vector&amp;lt;double&amp;gt;&amp;amp; fieldValues = pair.second; fieldDataArray-&amp;gt;SetName(fieldName.c_str()); for (double value : fieldValues) { fieldDataArray-&amp;gt;InsertNextValue(value); } // Assuming &quot;grid&quot; is your vtkUnstructuredGrid object grid-&amp;gt;GetPointData()-&amp;gt;AddArray(fieldDataArray);} 根据dataset的属性field是scalar数据还是tensor数据，设置SetNumberOfComponents的参数； 根据dataset的属性field是scalar数据还是tensor数据，选择InsertNectValue或者InsertNextTuple； 根据dataset的属性location type属性是vetex还是element，grid选取GetPointData或者GetCellData；第二步，添加VTK field数据到mappervtkSmartPointer&amp;lt;vtkDataSetMapper&amp;gt; mapper = vtkSmartPointer&amp;lt;vtkDataSetMapper&amp;gt;::New();mapper-&amp;gt;SetInputData(grid);mapper-&amp;gt;SetScalarModeToUsePointData();...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/show-hdf5-data-using-vtkUnstructuredGrid/";
          
        },
      },{id: "post-linux-系统下编译-gcc-9-2",
        
          title: "Linux 系统下编译 gcc 9.2",
        
        description: "操作下载 gcc源码包，解压生成gcc-9.2.0：http://ftp.gnu.org/gnu/gcc/gcc-9.2.0/gcc-9.2.0.tar.gz在四个依赖包在以下文件中有描述：./contrib/download_prerequisites  gmp-6.1.0.tar.bz2  mpfr-3.1.4.tar.bz2  mpc-1.0.3.tar.gz  isl-0.18.tar.bz2下载下来之后，放到gcc_9.2.0目录下，并执行上面的这个download_prerequisites脚本。之后即可开始编译gcc9.2.0 。Build commandsCC=&quot;$CC&quot;CXX=&quot;$CXX&quot;CFLAGS=&quot;$OPT_FLAGS&quot; CXXFLAGS=&quot;`echo &quot; $OPT_FLAGS &quot; | sed &#39;s/ -Wall / /g&#39;`&quot;../configure --prefix=/meda_home/ai0157/opt --enable-bootstrap --enable-shared --enable-threads=posix --enable-checking=release --with-system-zlib     --enable-__cxa_atexit --disable-libunwind-exceptions --enable-linker-build-id --enable-languages=c,c++,lto --disable-vtable-verify --with-default-libstdcxx-abi=new --enable-libstdcxx-debug --without-included-gettext --enable-plugin --disable-initfini-array --disable-libgcj --enable-plugin --disable-multilib --with-tune=generic --build=x86_64-unknown-linux-gnu --target=x86_64-unknown-linux-gnu --host=x86_64-unknown-linux-gnuReferences  build_gcc_9.sh  linux gcc-9.2.0 源码编译  Ubuntu环境下LLVM 15.0 完全编译 附windows编译LLVM master",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/compile-gdb-commands/";
          
        },
      },{id: "post-occt-使用-bvh-树加速-bounding-box-查找遍历",
        
          title: "OCCT 使用 BVH 树加速 bounding box 查找遍历",
        
        description: "Demo codeDemo code 1#include &amp;lt;BVH_Tree.hxx&amp;gt;#include &amp;lt;TopoDS_Shape.hxx&amp;gt;#include &amp;lt;vector&amp;gt;// Assuming you have a vector of TopoDS_Shape objects called &#39;shapes&#39;// Create a BVH treeHandle(BVH_Tree&amp;lt;Standard_Real, 3&amp;gt;) bvhTree = new BVH_Tree&amp;lt;Standard_Real, 3&amp;gt;();// Insert the shapes into the BVH treefor (const auto&amp;amp; shape : shapes) { // Compute the bounding box for the shape Bnd_Box box; BRepBndLib::Add(shape, box); // Insert the bounding box into the BVH...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/OCCT-BHV-tree-bounding-box/";
          
        },
      },{id: "post-occ-topexp-explorer-用法",
        
          title: "OCC TopExp_Explorer 用法",
        
        description: "#include &amp;lt;iostream&amp;gt;#include &amp;lt;TopoDS_Shape.hxx&amp;gt;#include &amp;lt;TopExp_Explorer.hxx&amp;gt;using namespace std;int main(){  // Create a TopoDS_Shape object.  TopoDS_Shape shape;  // Create a TopExp_Explorer object and explore the shape.  TopExp_Explorer exp(shape, TopAbs_FACE);  // While there are more faces, print the face&#39;s name.  while (exp.More())  {    cout &amp;lt;&amp;lt; exp.Current().Name() &amp;lt;&amp;lt; endl;    exp.Next();  }  return 0;}",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/OCCT-explore-api-usage/";
          
        },
      },{id: "post-occ-boundding-box-以及-distance",
        
          title: "OCC boundding box 以及 distance",
        
        description: "bounding box 方式检测#include &amp;lt;Bnd_Box.hxx&amp;gt;#include &amp;lt;BRepBndLib.hxx&amp;gt;TopoDS_Shape shape1, shape2; // Assume these shapes are already definedBnd_Box boundingBox1, boundingBox2;BRepBndLib::Add(shape1, boundingBox1);BRepBndLib::Add(shape2, boundingBox2);bool isInterfering = !boundingBox1.IsOut(boundingBox2);distance 方式检测#include &amp;lt;BRepExtrema_DistShapeShape.hxx&amp;gt;BRepExtrema_DistShapeShape distShapeShape(shape1, shape2);Standard_Real minDistance = distShapeShape.Value();bool isInterfering = (minDistance &amp;lt;= Precision::Confusion());  BRepExtrema_DistShapeShape 比 bounding box 方式费时；  如果bouding box方式检测出来出现干涉（interference, overlap），则可以使用distance检测方式确认；",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/OCCT-bounding-box/";
          
        },
      },{id: "post-ubuntu-及-windows-系统下安装-qt5",
        
          title: "Ubuntu 及 Windows 系统下安装 Qt5",
        
        description: "1. Ubuntu 安装 Qt5 命令安装Qt5：sudo apt install qtbase5-dev qtchooser qt5-qmake qtbase5-dev-tools qtmultimedia5-dev qttools5-dev qttools5-dev-tools qtcreator libqt5svg5-dev libqt5charts5 libqt5charts5-dev qtdeclarative5-dev libqt5xmlpatterns5-dev libqt5x11extras5-dev cmake-qt-guisudo apt-get -y install build-essential cmake gcc git lib32ncurses-dev lib32z1 libfox-1.6-dev libsdl1.2-dev software-properties-common wget zip python3-pip-whl python3-pil libgtest-dev python3-pip python3-tk python3-setuptools clang-14 python3-clang-14 libusb-1.0-0-dev stlink-tools openocd npm pv libncurses5:i386 libpython2.7:i386 libclang-14-dev python-is-python32. cmake find_package for Qt5find_package( Qt5 COMPONENTS Core...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/install-qt5-on-ubuntu-windows/";
          
        },
      },{id: "post-ubuntu-安装vncserver及使用",
        
          title: "Ubuntu 安装VNCServer及使用",
        
        description: "1. 安装sudo apt-get install gnome-panelsudo apt-get install tightvncserver# 创建端口vncserver :1 -geometry 1920x1000 -depth 24# 关闭端口vncserver -kill :1# 重新设置密码vncpasswd# 重启vncservervncserver :1# 重启vncserver方式2vncserver -geometry 1920x1080 :1# 查看vncserver logtail -f ~/.vnc/log_name.log编辑配置文件 .vnc/xstartup#!/bin/shunset SESSION_MANAGERunset DBUS_SESSION_BUS_ADDRESSexport XKL_XMODMAP_DISABLE=1export XDG_CURRENT_DESKTOP=&quot;GNOME-Flashback:GNOME&quot;export XDG_MENU_PREFIX=&quot;gnome-flashback-&quot;[ -x /etc/vnc/xstartup ] &amp;amp;&amp;amp; exec /etc/vnc/xstartup[ -r $HOME/.Xresources ] &amp;amp;&amp;amp; xrdb $HOME/.Xresourcesxsetroot -solid greyvncconfig -iconic &amp;amp;#gnome-terminal &amp;amp;#nautilus &amp;amp;gnome-session --session=gnome-flashback-metacity --disable-acceleration-check &amp;amp;",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/Ubuntu-install-VNCServer/";
          
        },
      },{id: "post-从makefile创建compile-commands-json",
        
          title: "从Makefile创建compile_commands.json",
        
        description: "操作步骤# https://github.com/nickdiego/compiledbpip install compiledb使用方法：compiledb make",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/Create_CompileDB_from_Makefile/";
          
        },
      },{id: "post-ubuntu-编译-qt-vtk-occt-samples",
        
          title: "Ubuntu 编译 Qt + VTK + OCCT + samples",
        
        description: "1. 卸载安装的Qt，编译安装Qt实践发现使用安装的Qt，编译带samples的OCCT在CMake阶段就出错（可能是Ubuntu系统中环境有问题，或者是没有完整设置Qt相关变量）。使用手动编译安装的Qt，并设置好相关环境变量可正常编译带samples的OCCT。手动编译安装Qt见：VTK（1）：ubuntu 22.04 源码编译安装 Qt5.15.6 。2. 编译 VTKVTK （2）：ubuntu 22.04 编译 VTK 9.2 rc23. 编译 OCCT 及 samples顶层CMakeLists.txt中有变量BUILD_SAMPLES_QT控制是否编译samples（包括qt相关samples）。cmake -D3RDPARTY_QT_DIR=/usr/local/Qt-5.15.6 -DCMAKE_BUILD_TYPE=Debug -DBUILD_SAMPLES_QT=ON ..make -j4. windows 安装 Qt下载在线安装包：Qt downloads安装命令：.\qt-unified-windows-x64-online.exe --mirror https://mirrors.ustc.edu.cn/qtproject",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/OCCT-build-with-samples/";
          
        },
      },{id: "post-vtk学习资源收集",
        
          title: "VTK学习资源收集",
        
        description: "学习文档  VTK textbook – online  VTK Book Figure Examples  VTK textbook – pdf  VTK Userguide – pdf示例关于CXX的示例说明，在官方examples代码的相关README里面有简单介绍，路径：src/Cxx.md  github HDF5 &amp;amp; TDR代码 JosefWeinbub  C++示例代码列表 Cxx  演示vtkUnstructureGrid及mesh显示(EdgeVisibilityOn) UGridColor a mesh by dotting a vector from the origin to each point with a specified vector  SimpleElevationFilterVector field – 显示矢量场箭头  VectorField  VectorFieldNonZeroExtractionVTK blog  VTK入门范例2",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/VTK-official-examples/";
          
        },
      },{id: "post-改用zsh以及oh-my-zsh",
        
          title: "改用zsh以及oh-my-zsh",
        
        description: "安装zsh以及oh-my-zsh：sh -c &quot;$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)&quot;安装autosuggestions插件（根据历史命令自动补全）：git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions在.zshrc中启用插件，plugins列表中，添加zsh-autosuggestions。例如：plugins=(git zsh-autosuggestions)添加alias：# 实用别名alias ls=&#39;ls --color=auto&#39;alias l=&#39;ls -lh&#39;alias ll=&#39;ls -lAh&#39;alias la=&#39;ls -A&#39;alias grep=&#39;grep --color=auto&#39;# Git 别名alias g=&#39;git&#39;alias ga=&#39;git add&#39;alias gc=&#39;git commit&#39;alias gp=&#39;git push&#39;alias gl=&#39;git pull&#39;alias gs=&#39;git status&#39;alias gd=&#39;git diff&#39;# 目录导航别名alias ..=&#39;cd ..&#39;alias ...=&#39;cd ../..&#39;alias c=&#39;clear&#39;alias h=&#39;history&#39;一些定制化的设置：############################ helpers: add to PATH / LD_LIBRARY_PATH only once_path_append() { [[ &quot;:$PATH:&quot; != *&quot;:$1:&quot;* ]] &amp;amp;&amp;amp; export PATH=&quot;$PATH:$1&quot;; }_ldpath_append()...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/%E5%AE%89%E8%A3%85zsh%E4%BB%A5%E5%8F%8A%E4%BD%BF%E7%94%A8oh-my-zsh/";
          
        },
      },{id: "post-kill信号不同分类的影响",
        
          title: "kill信号不同分类的影响",
        
        description: "与kill -KILL不同的是，kill -INT -PID 将通知被结束进程，等同于Ctrl+C。例如如果结束一个script，该script中同步启动了一个APP，使用kill -INT -&amp;lt;PIDofScript&amp;gt;可以同时将这个APP结束掉，kill -KILL则不行。 分类 信号 程序不可捕获、阻塞或忽略的信号 SIGKILL, SIGSTOP 不能恢复至默认动作的信号 SIGILL, SIGTRAP 默认会导致进程流产的信号 SIGABRT, SIGBUS, SIGFPE, SIGILL, SIGIOT, SIGQUIT, SIGSEGV, SIGTRAP, SIGXCPU, SIGXFSZ 默认会导致进程退出的信号 SIGALRM, SIGHUP, SIGINT, SIGKILL, SIGPIPE, SIGPOLL, SIGPROF, SIGSYS, SIGTERM, SIGUSR1, SIGUSR2, SIGVTALRM 默认会导致进程停止的信号 SIGSTOP, SIGTSTP, SIGTTIN, SIGTTOU 默认进程忽略的信号 SIGCHLD, SIGPWR, SIGURG, SIGWINCH Linux 下的KILL函数的用法 - 拂 晓 - 博客园 (cnblogs.com)如果kill不能结束掉，则尝试使用pkill：pkill -TERM -P...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/kill-signals-of-linux-system/";
          
        },
      },{id: "post-bash参数特殊变量符号",
        
          title: "Bash参数特殊变量符号",
        
        description: "Shell 特殊参数解释首先来看几个特殊变量：$0, $#, $*, $@, $?, $$, $_#!/bin/bashecho $0 # 当前脚本的文件名（间接运行时还包括绝对路径）。echo $n # 传递给脚本或函数的参数。n 是一个数字，表示第几个参数。例如，第一个参数是 $1 。echo $# # 传递给脚本或函数的参数个数。echo $* # 传递给脚本或函数的所有参数。echo $@ # 传递给脚本或函数的所有参数。被双引号 (&quot; &quot;) 包含时，与 $* 不同，下面将会讲到。echo $? # 上个命令的退出状态，或函数的返回值。echo $$ # 当前 Shell 进程 ID。对于 Shell 脚本，就是这些脚本所在的进程 ID。echo $_ # 上一个命令的最后一个参数echo $! # 后台运行的最后一个进程的 ID 号执行结果如下：$ ./test.sh test test1 test2 test3 test4./test.sh # $0 #...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/bash-args-and-special-symbols/";
          
        },
      },{id: "post-ubuntu-安装-occt",
        
          title: "Ubuntu 安装 OCCT",
        
        description: "OCCT 依赖库 Introduction – Requirements下载OpenCascadeOCC 7.7编译有问题，使能VTK时编译错误，下载最新版的OCC修复该问题：# https://dev.opencascade.org/resources/git_repositorygit clone https://git.dev.opencascade.org/repos/occt.git occt编译安装命令1. 编译安装第三方库 注意要 tcl-dev, tk-dev, tcllib, tklib，除非自己编译安装，此时要设置TCL/TK相关的路径，比较麻烦。sudo apt install doxygen doxygen-gui graphviz graphviz-doc libx11-xcb-devsudo apt-get install tcllib tklib tcl-dev tk-dev libfreetype-dev libx11-dev libgl1-mesa-dev libfreeimage-devsudo apt-get install rapidjson-dev libdraco-devtcl 8.6编译安装命令(tk 8.6相同的编译配置命令)：# https://www.tcl.tk/software/tcltk/8.6.htmlcd tcl8.6.13/unix./configure --enable-gcc --enable-shared --enable-threads --enable-64bitmake &amp;amp;&amp;amp; sudo make installfreeType编译安装命令：# https://freetype.org/download.htmlCFLAGS=&#39;-m64 -fPIC&#39; CPPFLAGS=&#39;-m64 -fPIC&#39; ./configuremake &amp;amp;&amp;amp; sudo make installFreeImage编译安装命令：# https://freeimage.sourceforge.io/download.html# 修改...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/Ubuntu-install-OCCT/";
          
        },
      },{id: "post-occt-projects-on-github",
        
          title: "OCCT projects on github",
        
        description: "OCCT samples需要安装 OpenGL： 基于Ubuntu搭建OpenGL开发环境sudo apt-get install libglfw3-devsudo apt install mesa-utils以下两个项目均来自 github gkv311  occt-samples-qopenglwidget  occt-helloOCCT 文章Boolean一些http链接：Open Cascade中的布尔操作 http://cppblog.com/eryar/archive/2013/01/17/197357.html  OpenCASCADE 布尔运算简介  OpenCasCade拓扑几何的布尔运算  Boolean Operations  OpenCascade Modeling Algorithms Boolean OperationsFillet  autoCAD doc FilletMesh  Mesh",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/OCCT-sample-projects/";
          
        },
      },{id: "post-office笔记",
        
          title: "Office笔记",
        
        description: "1. 自定义页脚格式1：第x页/共y页首先双击页面底部进入页脚编辑，输入：第页/共页然后鼠标放在需要编辑的位置，比如”第”与”页”之间，鼠标操作如下：“共”与”页”之间同样操作，从对话框的列表中选择NUMPAGES即可。最终样式如下：格式2：第x页/共y页，且总页数从正文数起假设前面4页是封面、目录等。首先依然输入”“第页/共页”“，鼠标依旧放在需要编辑的位置（以”共”与”页”之间为例），作如下操作：  按下快捷键Ctrl + F9，会出现一对大括号{}。这个步骤为输入最外层括号。  输入等于号：=。  再次按下快捷键Ctrl + F9，会出现一对大括号{}，在大括号内输入NUMPAGES，表示总页数。  最后在等于号后输入减去4的表达式：-4。同样的可以输入”PAGE”。一个样例如下：在编辑的过程中，使用快捷键Alt + F9可以切换显示域代码和域结果，使用快捷键F9可以更新域代码的结果。要注意的是，不能使用直接输入/粘贴的大括号，而应该使用word中function功能的快捷键创建大括号。快捷键如下：1.1. 参考  How to make NUMPAGES show 1 less page?  The Function and Shortcut Keys that manipulate fields",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/%E5%8A%9E%E5%85%AC%E8%BD%AF%E4%BB%B6-Office%E7%AC%94%E8%AE%B0/";
          
        },
      },{id: "post-ubuntu-系统安装-llvm-套件-可选择版本",
        
          title: "Ubuntu 系统安装 LLVM 套件 （可选择版本）",
        
        description: "wget https://mirrors.tuna.tsinghua.edu.cn/llvm-apt/llvm.shchmod u+x llvm.shsudo ./llvm.sh 18 -m https://mirrors.tuna.tsinghua.edu.cn/llvm-apt # install llvm, clang 18# sudo ./llvm.sh 18 all -m https://mirrors.tuna.tsinghua.edu.cn/llvm-apt也可以使用apt命令安装：sudo apt install clangd-21 clang-format-21 clang-21设置默认版本：sudo update-alternatives --install /usr/bin/clang clang /usr/bin/clang-21 210sudo update-alternatives --install /usr/bin/clang++ clang++ /usr/bin/clang++-21 210sudo update-alternatives --install /usr/bin/clangd clangd /usr/bin/clangd-21 210sudo update-alternatives --install /usr/bin/clang-format clang-format /usr/bin/clang-format-21 210查看当前版本：update-alternatives --display clangupdate-alternatives --display clang++完整版安装以及设置：LLVM_VERSION=21sudo ./llvm.sh $LLVM_VERSION all -m https://mirrors.tuna.tsinghua.edu.cn/llvm-aptsudo update-alternatives --install /usr/bin/clang...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/install-versioned-llvm-ubuntu/";
          
        },
      },{id: "post-通过函数指针地址找到函数",
        
          title: "通过函数指针地址找到函数",
        
        description: "# 通过地址找到函数声明info symbol 0x7f0db14cf57e# 通过地址找到函数在哪一行info line *0x7f0db14cf57e# 查看加载了哪些共享库info sharedlibrary参考  16 Examining the Symbol Table",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/get-function-via-address/";
          
        },
      },{id: "post-写给大家看的设计模式",
        
          title: "写给大家看的设计模式",
        
        description: "写给大家看的设计模式 图解TensorFlow源码1. 抽象工厂模式 被创建抽象类 Iuser； 抽象工厂类 IFactory，定义创建接口 IUser* createUser()。当需要新增被创建类型时，需要新增被创建类型及对应工厂类型；// 代表数据库中User表中的一条记录class RecUser { int32_t uid; std::string uname;};// 代表数据库中Department表中一条记录class RecDepartment { int32_t did; std::string dname;};// 1. 用户表操作抽象接口class IUser {public: virtual void insert(const RecUser *user) = 0; virtual RecUser *getUserRecord(int32_t id) = 0; virtual ~IUser() = default;};// 2.1 User表操作实现类：SQL Serverclass SqlServerUser : public IUser {public: void insert(const RecUser *user) override { std::cout &amp;lt;&amp;lt;...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/design-modes-for-all/";
          
        },
      },{id: "post-python与c-混合调试",
        
          title: "Python与C++混合调试",
        
        description: "vscode启动python与C++混合调试时，gdb需要管理员权限。Remote attach using non-root account would fail directly1. 取消限制sudo sysctl -w kernel.yama.ptrace_scope=02. 取消限制，永久有效设置pkexec的权限。新建文件，并重启Ubuntu系统：# /usr/share/polkit-1/actions/com.ubuntu.pkexec.gdb.policy&amp;lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&amp;gt;&amp;lt;!DOCTYPE policyconfig PUBLIC &quot;-//freedesktop//DTD PolicyKit Policy Configuration 1.0//EN&quot; &quot;http://www.freedesktop.org/standards/PolicyKit/1/policyconfig.dtd&quot;&amp;gt;&amp;lt;policyconfig&amp;gt; &amp;lt;action id=&quot;com.ubuntu.pkexec.gdb-settings&quot;&amp;gt; &amp;lt;icon_name&amp;gt;gdb-settings&amp;lt;/icon_name&amp;gt; &amp;lt;defaults&amp;gt; &amp;lt;allow_any&amp;gt;yes&amp;lt;/allow_any&amp;gt; &amp;lt;allow_inactive&amp;gt;yes&amp;lt;/allow_inactive&amp;gt; &amp;lt;allow_active&amp;gt;yes&amp;lt;/allow_active&amp;gt; &amp;lt;/defaults&amp;gt; &amp;lt;annotate key=&quot;org.freedesktop.policykit.exec.path&quot;&amp;gt;/usr/bin/gdb&amp;lt;/annotate&amp;gt; &amp;lt;annotate key=&quot;org.freedesktop.policykit.exec.allow_gui&quot;&amp;gt;true&amp;lt;/annotate&amp;gt; &amp;lt;/action&amp;gt;&amp;lt;/policyconfig&amp;gt;3. 如何启动调试 按照 launch.json 中定义的两个启动配置，先启动 “Python: Current File”，并设置好断点，暂停执行。 再启动 “GDB Attach proc 0”。在启动 attach gdb的过程中，需要在列出来的进程中手动选择刚才启动的python调试进程。 使用vscode调试时，由于命令行较长，且子进程较多。此时如果需要找对应的两个进程ID，方法如下# 搜索被调试的python文件ps -ef | grep relay00_graph.py显示结果如下：hxf0223 3877 2970 0...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/debug-combind-Python-and-C++/";
          
        },
      },{id: "post-收藏-c-代码仓库-cpu-amp-性能资料",
        
          title: "收藏：C++ 代码仓库，CPU &amp; 性能资料",
        
        description: "1. oneTBBIntel并行库 oneTBB.包含tbb malloc.2. 高性能 json 库glaze3. 100行头文件代码实现的线程池ThreadPool4. 事件驱动  Sigslot  Signals  eventpp5. 学习资料  MoreEffectiveC++笔记  现代CPU性能分析与优化 – CPU架构，性能分析  C++17 the complete guide  Learn LLVM 17",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/cpu_and_perf_study_docs_collections/";
          
        },
      },{id: "post-c-学习资源-及-代码片段积累",
        
          title: "C++ 学习资源 及 代码片段积累",
        
        description: "1. C++ 学习资源 Fluent C++ Modern C++ foonathan::​blog() C++ Stories Sutter’s Mill 这些资源帮助你深入学习C++2. C++ 代码片段2.1. 获取数组长度#include &amp;lt;type_traits&amp;gt;struct StructDef { int32_t arr[32];};StructDef sd;const size_t len = std::extent&amp;lt;decltype(sd.arr)&amp;gt;::value;std::vector&amp;lt;int32_t&amp;gt; vec(sd.arr, sd.arr + len);2.2. CHECK#include &amp;lt;iostream&amp;gt;#include &amp;lt;cstdlib&amp;gt;#if defined DEBUG || defined _DEBUG#define CHECK2(condition, message) \ (!(condition)) ? (std::cerr &amp;lt;&amp;lt; &quot;Assertion failed: (&quot; &amp;lt;&amp;lt; #condition &amp;lt;&amp;lt; &quot;), &quot; \ &amp;lt;&amp;lt; &quot;function &quot; &amp;lt;&amp;lt; __FUNCTION__ &amp;lt;&amp;lt;...",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/cpp-code-snippet/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sollicitudin eros sit amet ante aliquet, sit amet vulputate lectus mattis. Aenean ullamcorper pretium nunc, sed egestas lorem elementum id. Nulla id mi id neque ultrices egestas ut in urna. Sed ac ultricies nunc. Nam convallis placerat urna id egestas. Nulla porta, est interdum vestibulum venenatis, lorem odio laoreet sapien, in...",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "A simple inline announcement.",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "Announcements and news can be much longer than just quick inline posts. In fact, they can have all the features available for the standard blog posts. See below.Jean shorts raw denim Vice normcore, art party High Life PBR skateboard stumptown vinyl kitsch. Four loko meh 8-bit, tousled banh mi tilde forage Schlitz dreamcatcher twee 3 wolf moon. Chambray asymmetrical paleo...",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "A simple inline announcement with Markdown emoji! :sparkles: :smile:",
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
