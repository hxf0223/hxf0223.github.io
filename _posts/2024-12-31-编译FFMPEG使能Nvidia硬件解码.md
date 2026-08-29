---
layout: post
title: 编译FFMPEG使能 NVIDIA 硬件解码
date: 2024-12-31 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Linux]
tags: [Linux, FFmpeg, NVIDIA]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. 依赖于 NVIDIA

- NVIDIA 显卡驱动(.run文件安装)
- CUDA Toolkit(.run文件安装)

安装 NVIDIA 驱动(run文件)

```bash
# 禁用 nouveau 开源驱动
cat > /etc/modprobe.d/blacklist-nouveau.conf <<EOF
blacklist nouveau
options nouveau modeset=0
EOF

# Update initramfs
update-initramfs -u

# 需要重启生效
reboot

# Install compilation tools and Xorg dependencies
apt install -y make gcc linux-headers-$(uname -r) pkg-config xserver-xorg xorg-dev

# Install Vulkan and GLVND development libraries
apt install -y libvulkan1 libglvnd-dev

systemctl stop gdm.service

./NVIDIA-Linux-x86_64-xxx.run
```

安装`CUDA`：

```bash
# https://developer.nvidia.com/cuda-toolkit-archive
wget https://developer.download.nvidia.com/compute/cuda/12.6.3/local_installers/cuda-repo-debian12-12-6-local_12.6.3-560.35.05-1_amd64.deb
sudo dpkg -i cuda-repo-debian12-12-6-local_12.6.3-560.35.05-1_amd64.deb
sudo cp /var/cuda-repo-debian12-12-6-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo add-apt-repository contrib
sudo apt-get update
sudo apt-get -y install cuda-toolkit-12-6
```

查看硬件编解码实时状态:

```bash
watch -n 1 nvidia-smi -i 0 -q -d UTILIZATION
```

资料:

- [Debian 12安装Nvidia显卡驱动](https://www.cnblogs.com/merrynuts/p/18187734)
- [download -- nvidia 525.183.01 driver for linux](https://www.nvidia.com/en-us/drivers/details/226764/)
- [CUDA Toolkit 12.6 Update 3 Downloads](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Debian&target_version=12&target_type=deb_local)

## 2. FFMPEG 编译依赖库安装

```bash
sudo apt-get -y install autoconf automake build-essential libass-dev libfreetype6-dev libsdl2-dev libtheora-dev libtool libva-dev libvdpau-dev libvorbis-dev libxcb1-dev libxcb-shm0-dev libxcb-xfixes0-dev pkg-config texinfo zlib1g-dev

sudo apt-get -y install yasm nasm
sudo apt-get -y install libx264-dev libx265-dev libvpx-dev libdav1d-dev # video
sudo apt-get install libfdk-aac-dev libmp3lame-dev libopus-dev libopus-dev # audio
```

## 3. 编译 FFMPEG

```bash
git clone https://github.com/FFmpeg/nv-codec-headers.git
cd nv-codec-headers
make
sudo make install PREFIX=/usr # 如果安装到其他目录，需要将路径天骄到PKG_CONFIG_PATH
```

```bash
./configure --extra-cflags="-I/usr/local/cuda/include" --extra-ldflags="-L/usr/local/cuda/lib64" --extra-libs=-lpthread --extra-libs=-lm --enable-shared  --enable-gpl --enable-libfreetype --enable-libmp3lame --enable-libopus --enable-libvorbis --enable-libx264 --enable-libx265 --enable-nonfree --enable-cuda --enable-cuvid --enable-nvenc --enable-ffnvcodec --enable-cuvid # --enable-libfdk_aac --enable-libnpp

make -j$(nproc)
sudo make install
```

## 4. 测试

```bash
# https://github.com/omen23/ffmpeg-ffnvcodec-explanation
ffmpeg -hide_banner -encoders  | grep nvenc
ffmpeg -hide_banner -decoders | grep cuvid
ffmpeg -hide_banner -hwaccels

# https://d2axc7bbtmotmv.cloudfront.net/chrome_test/Temple.mp4
ffmpeg -c:v h264_cuvid -i input output.mkv # 使用 nvidia cuvid 解码

# 拉流，使用cuda硬件解码
ffmpeg -hwaccel cuda -i https://d2axc7bbtmotmv.cloudfront.net/chrome_test/Temple.mp4 out.mp4 out.mp4

# 拉流，使用nvdec硬件解码
ffmpeg -c:v h264_cuvid -i https://d2axc7bbtmotmv.cloudfront.net/chrome_test/Temple.mp4 out.mp4 out.mp4

# 使用nvenc硬件编码
ffmpeg -i input.mp4 -c:v h264_nvenc output.mp4
```

## 5. 参考

- [FFMPEG -- HWAccel Intro -- CUDA (NVENC/NVDEC)](https://trac.ffmpeg.org/wiki/HWAccelIntro#CUDANVENCNVDEC)
- [FFMPEG -- Compile FFmpeg for Ubuntu, Debian, or Mint](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu)
- [ffmpeg NVIDIA编解码一：ffmpeg编译安装](https://blog.csdn.net/weixin_43147845/article/details/136812735)
- [ffmpeg NVIDIA编解码三：英伟达硬编码](https://blog.csdn.net/weixin_43147845/article/details/136834858)
- [LINUX下，ffmpeg增加NVIDIA硬件编解码的步骤及解决办法](https://blog.csdn.net/quantum7/article/details/82713833)

## 6. 附加

`VAAPI`相关的一些可能的设置选项:

```bash
sudo apt install xserver-xorg-video-nvidia

# export LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libEGL.so

export VDPAU_DRIVER=nvidia
export LIBVA_DRIVER_NAME=nvidia # vdpau
export LIBVA_DRIVERS_PATH=/usr/lib/x86_64-linux-gnu/dri # nvidia_drv_video.so
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib
export DRI_PRIME=1

export VK_DRIVER_FILES=/usr/lib/x86_64-linux-gnu/libvulkan.so
export VK_ICD_FILENAMES=/usr/share/vulkan/icd.d/nvidia_icd.json
VK_ADD_DRIVER_FILES=/run/opengl-driver/share/vulkan/icd.d/nvidia_icd.x86_64.json

LIBVA_DRI3_DISABLE=1
```

`Nvidia`相关的一些可能的环境变量:

```bash
export __NV_PRIME_RENDER_OFFLOAD=1
export __GLX_VENDOR_LIBRARY_NAME=nvidia

export __NV_PRIME_RENDER_OFFLOAD=1
export __VK_LAYER_NV_optimus=NVIDIA_only

export __GLX_VENDOR_LIBRARY_NAME=nvidia
export __EGL_VENDOR_LIBRARY_NAME=nvidia
```

一些工具软件:

```bash
sudo apt install libvulkan1 libvulkan-dev vulkan-tools

# https://gitlab.freedesktop.org/vdpau/libvdpau
# https://github.com/KhronosGroup/Vulkan-Tools

vdpauinfo
vainfo
vulkaninfo --summary
```

## 7. 附加2 Chromium 一些资料

- [Chromium sources](https://source.chromium.org/chromium/chromium/src)

### 7.1 安装Chromium

```bash
apt install software-properties-common apt-transport-https ca-certificates curl -y
curl -fSsL https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor | sudo tee /usr/share/keyrings/google-chrome.gpg >> /dev/null
echo deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main | sudo tee /etc/apt/sources.list.d/google-chrome.list
apt install google-chrome-stable
```

### 7.2 一些启动命令尝试

```bash
# export GOOGLE_API_KEY="no"
# export GOOGLE_DEFAULT_CLIENT_ID="no"
# export GOOGLE_DEFAULT_CLIENT_SECRET="no"
# export VK_ICD_FILENAMES=/usr/share/vulkan/icd.d/nvidia_icd.json
# FFmpegVideoDecoder InitializeMediaLibrary GpuVideoDecoder

# headless
./chrome --ignore-gpu-blocklist --disable-gpu-driver-bug-workarounds --enable-features=AcceleratedVideoDecodeLinuxZeroCopyGL,AcceleratedVideoDecodeLinuxGL,VaapiIgnoreDriverChecks,VaapiOnNvidiaGPUs,AcceleratedVideoEncoder,UseOzonePlatform,UseMultiPlaneFormatForHardwareVideo,PlatformHEVCDecoderSupport --ozone-platform-hint=auto --enable-gpu --enable-logging=stderr --vmodule=*/media/* --v=0 --use-gl=angle --use-angle=vulkan --headless=new --remote-debugging-address=0.0.0.0 --remote-debugging-port=9221 --allow-chrome-scheme-url

# headful
./chrome --ignore-gpu-blocklist --disable-gpu-driver-bug-workarounds --enable-features=AcceleratedVideoDecodeLinuxZeroCopyGL,AcceleratedVideoDecodeLinuxGL,VaapiIgnoreDriverChecks,VaapiOnNvidiaGPUs,AcceleratedVideoEncoder,UseOzonePlatform,UseMultiPlaneFormatForHardwareVideo,PlatformHEVCDecoderSupport --ozone-platform-hint=auto --enable-gpu --enable-logging=stderr --vmodule=*/media/* --v=0 --use-gl=angle --use-angle=vulkan

# --disable-features=UseSkiaRenderer,UseChromeOSDirectVideoDecoder
# --disable-gpu-compositing  --in-process-gpu
```

- [Chromium docs -- VA-API](https://github.com/chromium/chromium/blob/main/docs/gpu/vaapi.md)
- [Disable VA-API on NVIDIA GPUs for ChromeOS and Linux](https://issues.chromium.org/issues/40285654)
- [Hardware-accelerated video decode on chromium w/ NVIDIA+VDPAU](https://bbs.archlinux.org/viewtopic.php?pid=1945132#p1945132)
- [Hardware accelarated video decoding in chromium](https://discussion.fedoraproject.org/t/hardware-accelarated-video-decoding-in-chromium/69907/11?replies_to_post_number=9)
- [How To Enable Hardware Acceleration on Chrome, Chromium & Puppeteer on AWS in Headless mode](https://mirzabilal.com/how-to-enable-hardware-acceleration-on-chrome-chromium-puppeteer-on-aws-in-headless-mode)
- [blog -- vdpau](https://wdv4758h.github.io/notes/blog/vdpau.html)

### 7.3 定制化 Chromium/FFmpeg

```bash
# media/ffmpeg/scripts/build_ffmpeg.py
# media/ffmpeg/scripts/robo_lib/config.py  /etc/lsb-release -> /etc/os-release
# third_party/ffmpeg/configure
# media/ffmpeg/scripts/generate_gn.py
# third_party/ffmpeg/chromium/config/Chrome/linux/x64/config_components.h
# third_party/ffmpeg/ffmpeg_generated.gni

export PATH=`pwd`/third_party/llvm-build/Release+Asserts/bin:$PATH
./media/ffmpeg/scripts/build_ffmpeg.py linux x64 --branding Chrome
./third_party/ffmpeg/chromium/scripts/copy_config.sh
python3 ./media/ffmpeg/scripts/generate_gn.py
```

```python
# build_ffmpeg.py
configure_flags['Chrome'].extend([
        '--enable-decoder=aac,h264',
        '--enable-demuxer=aac',
        '--enable-parser=aac,h264',
        '--enable-ffnvcodec',
        '--enable-cuvid',
        '--enable-nvdec',
        '--enable-nvenc',
        '--enable-vdpau',
        '--enable-hwaccel=h264_vdpau',
        '--enable-hwaccel=h264_nvdec',
        '--extra-cflags=-isystem/usr/include',
        '--extra-cxxflags=-isystem/usr/include'
    ])
```

```bash
# gn args out/release

is_debug = false
is_component_build = false
target_cpu = "x64"
enable_nacl = false
symbol_level = 0
is_official_build = true
chrome_pgo_phase = 0
ffmpeg_branding = "Chrome"
proprietary_codecs = true
# enable_linux_installer = true

autoninja -j4 -C out/release -v chrome
```

```bash
# gn args out/debug

google_api_key="AIzaSyDxKL42zsPjbke5O8_rPVpVrLrJ8aeE9rQ"
google_default_client_id="595013732528-llk8trb03f0ldpqq6nprjp1s79596646.apps.googleusercontent.com"
google_default_client_secret="5ntt6GbbkjnTVXx-MSxbmx5e"

is_debug = true
is_component_build = true
target_cpu = "x64"
enable_nacl = false
symbol_level = 2
is_official_build = false
chrome_pgo_phase = 0
ffmpeg_branding = "Chrome"
proprietary_codecs = true
disable_fieldtrial_testing_config=true
media_use_ffmpeg=true
exclude_unwind_tables=false

enable_ffmpeg_video_decoders=true
enable_widevine=false

rtc_use_h264=true

blink_symbol_level=0
v8_symbol_level=0


enable_stack_trace_line_numbers = true
enable_backup_ref_ptr_support=false
enable_dangling_raw_ptr_checks=false
enable_dangling_raw_ptr_feature_flag=false
#use_partition_alloc_as_malloc=false
#use_allocator_shim=false
#use_partition_alloc=false
use_qt=false
```

```bash
# run following if
# use_sysroot=false
# sudo ./build/install-build-deps.sh
# sudo apt install qtbase5-dev
```

- [重新配置chrome中ffmpeg插件](https://blog.csdn.net/hongszh/article/details/126167387)
- [chromium -- debugging](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/linux/debugging.md)
- [Tips for debugging on Linux](https://chromium.googlesource.com/chromium/src/+/0e94f26e8/docs/linux_debugging.md)
- [How to get a stack trace at runtime](https://www.chromium.org/chromium-os/developer-library/guides/debugging/stack-traces/#typography-conventions)
- [Some tricks about debugging Chromium](https://blog.lazym.io/2020/06/09/Some-tricks-about-debugging-Chromium/)
- [Chromium 编译与调试笔记](https://yplam.com/Pub/Chromium/chromium-build-debug/)
