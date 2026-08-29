---
layout: post
title: CUTLASS-Cute 初步(6)：CUDA GEMM 计算优化、Multi-Stage 与软流水(Software Pipelining)
date: 2025-02-26 +1130
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true

toc:
  sidebar: right
---

整个GEMM可用如下公式表示：

$$
C[i, j] = \sum_{k=0}^{nK-1} A[i, k] \times B[k, j]
$$

| 层级         | 说明                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| Thread Block | Tile 每个 CUDA 线程块（thread block）负责计算输出矩阵 C 的一个子块（tile） |
| Warp Tile    | 在线程块内部，每个 warp（32个线程）负责计算 thread block tile 的一个子区域 |
| Thread Tile  | 在 warp 内部，每个线程负责计算 warp tile 的一个更小的子区域                |

## 1. GEMM 计算步骤--分层 GEMM 结构

依照硬件架构层次划分（也即 CUDA 编程模型），GEMM 计算可以分为多个层次：Thread Block Tile -> Warp Tile -> Thread Tile。即将一个大矩阵的算术运算，依次分解，直到最小的线程级别，一个线程计算一小部分的 tile。

数据搬运过程分为几步：GMEM -> Shared Memory -> Register File -> CUDA Core。如下图所示：

![Hierarchical GEMM Structure](/assets/images/cuda/20250226/multi_stage/fig-09-complete-hierarchy-1.png)
![Hierarchical GEMM Structure Dataflow](/assets/images/cuda/20250226/multi_stage/gemm-hierarchy-with-epilogue.png)

> 完整的 GEMM 分层结构把数据从较慢的存储器搬运到较快的存储器，并在许多算术运算中对其进行重复利用，以提高计算强度。

## 2. Thread Block Tile

每个 Thread Block 负责计算输出矩阵 C 的一个 Tile（即几个分块）。对于几个矩阵计算`C += A * B`，每个 Thread Block 需要**反复**从输入矩阵中加载一个个的 Tile 并计算一个**累加的矩阵乘积**。如下图所示：

![Thread Block Tile Computation](/assets/images/cuda/20250226/multi_stage/fig-03-gemm-tile-structure.png)

> 把一个 GEMM 问题分解为由单个线程块执行的计算。绿色所示的 C 的子矩阵，是由 A 的一个 tile 与 B 的一个子矩阵做矩阵乘积得到的。为此，沿 K 维（已被切分成多个 tile）循环，并把每个 tile 的矩阵乘积结果累加起来完成计算。

在逻辑上，Thread Block Tile 又被分为若干个 Warp Tile，每个 Warp Tile 由一个 Warp 负责计算。

线程块的输出 tile按空间被划分给各个 warp（如下图所示）。我们把用于存放这个输出 tile 的存储称为累加器（accumulators），因为它保存的是累加起来的矩阵乘积结果。每进行一次算术运算就会更新一次累加器，因此它必须驻留在 SM 中最快的存储器里：寄存器文件。

![Thread Block Tile Computation](/assets/images/cuda/20250226/multi_stage/fig-04-cta-structure.png)

> 线程块的结构把 C 的一个 tile 划分给多个 warp，每个 warp 负责存储一个互不重叠的二维子块。每个 warp 都将其累加器元素存放在寄存器中。矩阵 A 和 B 的 tile 则存放在共享内存中，线程块内所有 warp 都可访问。

## 3. Warp Tile

当数据已存入共享内存后，每个 warp 通过在其线程块 tile 的 K 维上迭代、从共享内存中加载子矩阵（或称 fragment），并计算累加的外积。如下图所示：

![Warp Tile Computation](/assets/images/cuda/20250226/multi_stage/warp-tile-structure.png)

> 单个 warp 通过在循环中把 A 和 B 的片段（fragments）从各自对应的共享内存（SMEM）tile 加载到寄存器（RF），并计算外积，从而形成累加的矩阵乘积。

> 上图也展示了多个 warp 之间如何从共享内存进行数据共享：同一线程块行（row）中的 warp 会加载相同的 A 片段；同一线程块列（column）中的 warp 会加载相同的 B 片段。

## 4. Thread Tile

CUDA 编程模型是以线程块和单个线程来定义的。因此，warp 的结构需要映射到各个线程实际执行的操作上。由于线程之间不能互相访问寄存器，我们必须选取一种组织方式，使得保存在寄存器中的值能够被同一线程执行的多条算术指令反复复用。由此，在单个线程内部形成了一个二维分块（2D tiled）的结构，如下图的细节所示。每个线程向 CUDA 核心发出一串彼此独立的算术指令，并计算一个累加的外积。

![Warp Tile Computation](/assets/images/cuda/20250226/multi_stage/fig-06-warp-tile-structure.png)

> 单个线程（右）通过对寄存器中保存的 A 的片段（fragment）与 B 的片段（fragment）做外积，来参与 warp 级的矩阵乘法（左）。用绿色标示的 warp 累加器被分配给该 warp 内的各个线程，通常组织成一组二维小 tile。

在上图中，warp 的左上象限以灰色标示。那 32 个小格分别对应一个 warp 内的 32 条线程。这种安排会使同一行中的多条线程各自去取 A 片段中的相同元素，而同一列中的多条线程各自去取 B 片段中的相同元素。

为最大化计算强度，可以复制这一基础结构来构成完整的 warp 级累加器 tile，从而得到一个由 8×1 与 1×8 片段做外积得到的 8×8 的整体“线程 tile”。这在图中用绿色显示的四个累加器 tile予以说明。

## 5. Multi-Stage 与占用率（Occupancy）

`Tiled GEMM`会大量使用`RF`来存放`A fragment`/`B fragment`以及`C accumulator`，同时也需要分配较大的`SMEM`。对片上存储的相对高需求会**限制占用率（occupancy）**，也就是单个`SM`上能并发运行的线程块数量上限。因此，`GEMM`的实现通常在每个`SM`中能容纳的`warp`与线程块数量远少于典型的`GPU`计算工作负载。

`GEMM`为了把`C`子块常驻寄存器、`A/B`子块常驻共享内存，会吃掉大量片上资源导致占用率下降，用**多开更多线程块来掩盖延迟（overlap，latency hiding）**的常规手段不再有效。于是改为**在同一线程块内重叠多个阶段**：边算当前`K-tile`，边预取下一个`K-tile`，尽量让计算单元与带宽都忙起来。

![Warp Tile Computation](/assets/images/cuda/20250226/multi_stage/multi-stage-flow.png)

> 在 CUTLASS 的 GEMM 主循环中交错执行的三条并发指令流。黑色箭头表示数据依赖关系（`Math` 依赖 `S -> R`）。当内存系统在从全局内存加载数据、且 SM 正在为下一轮线程 tile 加载片段时，线程通过为当前 tile 执行算术指令来让 SM 持续忙碌。

在实践中，`CUDA`程序员通过在源码中交错编写各阶段的`CUDA`语句，来实现这些管线阶段之间的指令级并发，并依赖 `CUDA` 编译器在生成的机器码里安排合适的指令调度。广泛使用`#pragma unroll`与编译期常量可以让编译器完全展开循环并把数组元素映射到寄存器，这两点对实现可调优且高效的内核至关重要。

可隐藏的实际时延量，取决于 **线程块** / **warp** / **线程** 三级`tile`的大小，以及`SM`内活动数学功能单元（FMA/WMMA 等）的吞吐。**更大的tile通常带来更多数据复用与时延隐藏机会**。

### 5.1. Ampere 架构下的 Multi-Stage

在`Hopper`架构中（`sm90`），可以基于`warp-specialization`对寄存器进行`warp-specific`分配，在此基础上在`warp`之间创建`生产-消费`模型（流水线），即`Multi-Stage`。

在`Ampere`中，没有`Hopper`上的这些高级特性，只能将`生产-消费`结构的编码逻辑在同一线程之内实现，并使用`cp.async`实现`latency-hiding`。

另外，由于使用`软流水`，导致`A/B`需要在原有基础上进一步分块，进而需要增加一级循环，共需要两层循环：一层用于`loop-over BK`，另外一层用于循环`(CPY, CPY_M, CPY_K)`中的`CPY_K`。

### 5.2. Ampere 架构 Multi-Stage 编程中 A/B 的分块

作为对比，使用单一`TiledCopy`进行分块搬运前，将`tensor A`分块为`(BM, BK)`，并使用`ThrCopy`获取其`(CPY, CPY_M, CPY_K, k)`，并使用`loop-over BK`沿着`K`方向逐次搬运并计算。流程代码如下：

```cpp
  Tensor sA = make_tensor(make_smem_ptr(smemA), make_shape(Int<BM>{}, Int<BK>{}), make_stride(Int<1>{}, Int<BM>{}));
  Tensor sB = make_tensor(make_smem_ptr(smemB), make_shape(Int<BN>{}, Int<BK>{}), make_stride(Int<1>{}, Int<BN>{}));

  auto thr_copy_A = tiled_copy_A.get_thread_slice(tid);
  Tensor tAgA     = thr_copy_A.partition_S(gA);  // 源：全局内存 (CPY, CPY_M, CPY_K, k)
  Tensor tAsA     = thr_copy_A.partition_D(sA);  // 目标：共享内存 (CPY, CPY_M, CPY_K)

  auto thr_copy_B = tiled_copy_B.get_thread_slice(tid);
  Tensor tBgB     = thr_copy_B.partition_S(gB);  // 源：全局内存
  Tensor tBsB     = thr_copy_B.partition_D(sB);  // 目标：共享内存

  const int num_tile_k = K / BK;
  for (int k = 0; k < num_tile_k; k++) {
    copy(tiled_copy_A, tAgA(_, _, _, k), tAsA);
    copy(tiled_copy_B, tBgB(_, _, _, k), tBsB);
  }
```

在`Multi-Stage`架构+软流水架构下，由于需要**分离数据搬运与数据计算**，导致在使用`Multi-Stage`进行`GMEM` => `SMEM`搬运过程，以及`SMEM` => `REG`搬运过程中，有两点不同。

首先，在`GMEM` => `SMEM`搬运过程中，需要为`SMEM`创建`nStage`个缓存，即缓存是以前的`nStage`倍。代码如下：

```cpp
  // 配置代码
  constexpr auto smem_shape_A  = cute::make_shape(bM, bK, bP);  // (bM, bK, bP)
  constexpr auto smem_shape_B  = cute::make_shape(bN, bK, bP);  // (bN, bK, bP)
  constexpr auto smem_layout_A = cute::tile_to_shape(smem_atom_layout_A_swizzled, smem_shape_A);
  constexpr auto smem_layout_B = cute::tile_to_shape(smem_atom_layout_B_swizzled, smem_shape_B);

  // kernel
  // partition gmem -> smem via gmem tiled copy
  auto gmem_thr_tiled_copy_A{gmem_tiled_copy_A.get_slice(threadIdx.x)};
  auto gmem_tAgA = gmem_thr_tiled_copy_A.partition_S(gmem_block_tensor_A);  // (CPY, CPY_M, CPY_K, k)
  auto gmem_tAsA = gmem_thr_tiled_copy_A.partition_D(smem_tensor_A);        // (CPY, CPY_M, CPY_K, bP)

  auto gmem_thr_tiled_copy_B{gmem_tiled_copy_B.get_slice(threadIdx.x)};
  auto gmem_tAgB = gmem_thr_tiled_copy_B.partition_S(gmem_block_tensor_B);  // (CPY, CPY_N, CPY_K, k)
  auto gmem_tAsB = gmem_thr_tiled_copy_B.partition_D(smem_tensor_B);        // (CPY, CPY_N, CPY_K, bP)
```

可以看到，最终线程的`gmem fragment`跟以前一样，但是`smem fragment layout`多出一个轴`bP`。

其次，在使用软流水优化`SMEM` => `REG`搬运的过程中，以`A`为例，每次搬运的数据由`(CPY, CPY_M, CPY_K)`改为`(CPY, CPY_M)`，同样出于分离数据搬运/数据计算的需要；同时，计算量也由`(MMA, MMA_M, MMA_K)`改为`(MMA, MMA_M)`，即取原来的一个`k'-slice`。

### 5.3. Ampere 架构实现 Multi-Stage 的流程

在启动`Multi-Stage`的主循环之前，需要先对`GMEM` => `SMEM`进行**预取**操作一次。代码实现如下：

```cpp
  // prologue: 预填充 SMEM [0, PIPELINE-2]， 共(PIPELINE-1)个 tile 到 smem。
  // 保证主循环有 pipeline slot 进行预加载，并保证 pipeline slot 不溢出，
  // 另外还需要 wait 能保证最新发出的 copy 仍在飞
  for (auto pipeline_idx = 0; pipeline_idx < (NUM_SMEM_PIPELINE - 1); ++pipeline_idx) {
    cute::copy(gmem_tiled_copy_A,
               gmem_tAgA(cute::_, cute::_, cute::_, tile_idx_next),  //
               gmem_tAsA(cute::_, cute::_, cute::_, pipeline_idx));
    cute::copy(gmem_tiled_copy_B,
               gmem_tAgB(cute::_, cute::_, cute::_, tile_idx_next),  //
               gmem_tAsB(cute::_, cute::_, cute::_, pipeline_idx));

    cute::cp_async_fence();
    --num_tiles_remain;
    if (num_tiles_remain > 0) { ++tile_idx_next; }
  }

  cute::cp_async_wait<NUM_SMEM_PIPELINE - 2>();
  __syncthreads();

  // prefetch first k' slice from SMEM => REG
  // ......
```

> prologue 总结：
>
> 1. `cp_async_fence()`表示创建一个`commit groups`，这里一个`commit groups`包含一次`A fragment`的`GMEM` => `SMEM`操作，以及一次`B fragment`的`GMEM` => `SMEM`操作。
> 2. `cp_async_wait<N>()`表示等待直到有`N`个`commit groups`在飞（in flight）。语句`cute::cp_async_wait<NUM_SMEM_PIPELINE - 2>()`表示等待最先一批`A fragment/B fragment`完成。
> 3. 首次预取循环代码中`pipeline_idx < (NUM_SMEM_PIPELINE - 1)`之所以循环次数取为`NUM_SMEM_PIPELINE - 1`，是因为如果预取所有的`SMEM buffer`，将导致主循环中再也写不了预取代码，即代码的逻辑结构需要。另外，如果取为`NUM_SMEM_PIPELINE - 2`，将导致`cp_async_wait`变为`cute::cp_async_wait<NUM_SMEM_PIPELINE - 3>()`，即当`NUM_SMEM_PIPELINE`为3的时候，需要等待所有拷贝操作完成，即`Multi-Stage`失效，无法并行数据搬运与数据计算。
> 4. `NUM_SMEM_PIPELINE`最小为3。

在`prologue`预取`GMEM` => `SMEM`之后且预取`SMEM` => `REG`之前，可以进行一些其他初始化工作，比如创建`TiledMMA`、初始化`C fragment`累加器，应该可以略微压缩一些时间。

如下为`Multi-Stage`主循环的总结。

在初次进入主循环的时候，`loop-over BK`的第一个分块已经在`SMEM`中就绪，剩余的`NUM_SMEM_PIPELINE-2`批数据在飞。要模拟实现数据搬运与数据计算的分离，就要保证每个循环中，发起的数据搬运领先数据计算一个位置，`loop-over BK`与`k'`循环都需要按照这个时序。在主循环中，需要继续安排这几个逻辑：

- 在内层`k'`循环的开始位置（`k'==0`），issue一次`GMEM` => `SMEM`异步搬运，即保持流水逻辑（生产端）；
- 在内层`k'`循环的结束位置（`k'==NUM_MMA_K_LOOP-1`），等待`k+1`位置的`fragment`准备好，即到第`k+1`个循环的时候需要的计算数据。

由于是异步搬运，所以需要两个指针分别标示：

- `GMEM` => `SMEM`操作时`smem(k+1 fragment)`的位置：`smem_pipeline_g2s_idx`（对应生产端数据）；
- `SMEM` => `REG`操作时`smem(k fragment)`的位置：`smem_pipeline_s2r_idx`（对应消费端数据）；
- 生产端`fragment`的位置始终领先消费端`fragment`一个位置。

另外，在`prologue`之后，生产端的位置已经到了`NUM_SMEM_PIPELINE-1`，即在主循环中，从该位置开始issue下一个`fragment`。

```cpp
  int smem_pipeline_s2r_idx = 0;                        // 指示当前 SMEM -> REG pipeline index
  int smem_pipeline_g2s_idx = (NUM_SMEM_PIPELINE - 1);  // 指示当前 GMEM -> SMEM pipeline index
```

主循环代码如下：

```cpp
  while (num_tiles_remain > -(NUM_SMEM_PIPELINE - 1)) {  // loop-over K
    for (int mma_idx_k = 0; mma_idx_k < NUM_MMA_K_LOOP; ++mma_idx_k) {  // loop-over BK within the tile
      // 计算下一个 tile 之前，wait 等待确保下一个 tile 已经 GMEM -> SMEM 完成
      // 且 current_pipeline 指向下一个 tile 的数据
      if (mma_idx_k == (NUM_MMA_K_LOOP - 1)) {
        smem_tCsA_current_pipeline = smem_tCsA(cute::_, cute::_, cute::_, smem_pipeline_s2r_idx);  // (CPY, CPY_M, CPY_K)
        smem_tCsB_current_pipeline = smem_tCsB(cute::_, cute::_, cute::_, smem_pipeline_s2r_idx);  // (CPY, CPY_N, CPY_K)

        // 等待 SMEM -> REG 的 prefetch 完成，保证最新的 SMEM slot 在飞
        cute::cp_async_wait<NUM_SMEM_PIPELINE - 2>();
        __syncthreads();
      }

      // 加载下一个 MMA_K 的数据到 REG
      // ......

      // perform prefetch next tile GMEM -> SMEM before this tile's MMA
      if (mma_idx_k == 0) {
        cute::copy(gmem_tiled_copy_A,
                   gmem_tAgA(cute::_, cute::_, cute::_, tile_idx_next),  // (CPY, CPY_M, CPY_K)
                   gmem_tAsA(cute::_, cute::_, cute::_, smem_pipeline_g2s_idx));
        cute::copy(gmem_tiled_copy_B,
                   gmem_tAgB(cute::_, cute::_, cute::_, tile_idx_next),  // (CPY, CPY_N, CPY_K)
                   gmem_tAsB(cute::_, cute::_, cute::_, smem_pipeline_g2s_idx));

        cute::cp_async_fence();
        num_tiles_remain--;
        if (num_tiles_remain > 0) { ++tile_idx_next; }

        smem_pipeline_g2s_idx = smem_pipeline_s2r_idx;
        smem_pipeline_s2r_idx = (smem_pipeline_s2r_idx + 1) % NUM_SMEM_PIPELINE;
      }

      // perform MMA on the current MMA_K
      // ......
    }
  }
```

#### 5.3.1. 一些实现细节分析

TODO：最后阶段存在一些dummy copy。

## 6. 软流水（Software Pipelining）

在`Ampere`架构中，在`GEMM kernel`的最内层循环中，执行`SMEM` =>`REG`的搬运指令，以及`FMA`指令。可以通过类似`Multi-Stage`的方式，先后issue两条指令，达到掩盖（`overlap`）部分数据搬运指令的延时。

### 6.1. 软流水（Software Pipelining）的原理

指令能否并行执行，取决于一些因素，比如：能否分配到硬件资源、执行单元是否可用、数据是否存在依赖（`REG`/`SMEM`）等等。如果指令没有资源可用，则不会被issue（另外，资源分配以及issue，都是以`warp`为单位的）。

`SMEM` => `REG`指令由`LSU`（Load/Store Unit）处理。当一个`warp`需要执行`SMEM` => `REG`时，如果`SM`可以分配出32个`LSU`资源，并且`REG`/`SMEM`也是可用的，则此时可以立即执行，否则就需要等待、或者查找其他可用的`warp`并执行可以执行的指令。

执行单元`LSU`与`Tensor Core`/`CUDA Core`相互独立，他们之间存在的依赖就是`REG`/`SMEM`的读写依赖。使用`double buffer`，每次预取`k+1`位置的tile，并且计算第`k`位置的`tile`，可以实现软流水，从而掩盖部分`SMEM` => `REG`数据搬运的延时。

![Soft Pipelining Data Dependency Flow](/assets/images/cuda/20250226/multi_stage/soft_pipelining_data_dependency_flow.svg)

> 有关硬件资源的调度，见另外一篇博客"NVIDIA GPU 架构：SP、SM 与 LSU 工作原理详解"。

### 6.2. 软流水的代码示例

`SMEM` => `REG`使用数据预取，解除了共享内存访问（R/W）的依赖，可以节省一次 `__syncthreads()`。原始的`GEMM`主循环示意代码如下：

{% raw %}

```cpp
for k:
    copy(GMEM[k] → SMEM)       ← 写 SMEM
    __syncthreads()  ← 1 等待所有线程写完 SMEM，才能安全读（read after write）
    gemm(SMEM, REG)             ← 读 SMEM
    __syncthreads()  ← 2 等待所有线程读完 SMEM，才能下一轮覆写（write after read）
```

{% endraw %}

使用双缓冲后，循环示意代码如下：

{% raw %}

```cpp
prologue: copy(GMEM[0] → smem[0])
__syncthreads()

for k:
    copy(GMEM[k+1] → smem[(k+1)%2])   ← 写 smem[1-cur]
    gemm(smem[k%2], REG)               ← 读 smem[cur]
    __syncthreads()  ← 1 只剩1次
```

{% endraw %}

## 7. Multi-Stage 中 buffer 深度的计算

RTX 3060算力如下：

- GMEM 带宽：360 GB/s
- Tensor Core 峰值性能（FP16）：12.74 TFLOPS

记CTA处理的分块的大小为$BM \times BN \times BK$，峰值带宽为$P_m$，算力为$P_c$：

- 每个分块的计算量为：$2 \times BM \times BK \times BN$，需要的时间为：$T_c = \frac{2 \times BM \times BK \times BN}{P_c}$。
- 每次分块需要搬运的数据量为$2 \times (BM \times BK + BK \times BN)$，需要的时间为：$T_m = \frac{2 \times (BM \times BK + BK \times BN)}{P_m}$。

得到访存比为：

$$
\text{ratio} = \frac{T_c}{T_m} = \frac{BM \times BN \times BK / P_c}{(BM \times BK + BK \times BN) / P_m} = \frac{BM \times BN \times BK}{BM \times BK + BK \times BN} \times \frac{P_m}{P_c} = \frac{BM \times BN}{BM + BN} \times \frac{P_m}{P_c}
$$

峰值算力/峰值带宽为：

$$
\frac{P_c}{P_m} = \frac{12.74 \text{ TFLOPS}}{360 \text{ GB/s}} \approx 35.4 \text{ FLOP/byte}
$$

以$BM=BN=128$为例，得到：

$$
\text{ratio} = \frac{128 \times 128}{128 + 128} \times \frac{1}{35.4} \approx 18.3 \text{ FLOP/byte}
$$

> 这个计算得到的访存比，其含义是**访存的时间，是计算时间的18.3倍**。因此，理想情况下，`Multi-Stage`的buffer深度应该大于18.3，才能完全掩盖访存的延时。

### 7.1. Multi-Stage 为什么可以提高性能

![calculation vs memory time](/assets/images/cuda/20250226/multi_stage/cuda_pipeline_ratio.svg)

以理论的`计算/访存比=3`为例，没有`pipeline`的时候，有`2/3`的空隙未被填满，即算力只有理论值的`1/3`；当开辟两个`pipeline`的时候，还有`1/3`的空隙未被填满；当开辟三个`pipeline`的时候，可以使得计算填满空隙，消除data harzard导致的stall，达到理论峰值算力。

从图示看，增加`pipeline`似乎是提高了内存带宽。实际情况是，由于`L2`的存在，使得有些`SM`可以从`L2`中直接获取数据，即不用每个`SMEM`每次都从`GMEM`中获取数据，消除了`GMEM`的访问时间。

## A. 资料

- [Hierarchical GEMM Structure](https://developer.nvidia.com/blog/cutlass-linear-algebra-cuda/)
- [Efficient GEMM in CUDA](https://github.com/NVIDIA/cutlass/blob/main/media/docs/cpp/efficient_gemm.md)
- [CUTLASS Tutorial: Efficient GEMM kernel designs with Pipelining](https://research.colfax-intl.com/cutlass-tutorial-design-of-a-gemm-kernel/)：参考章节：**Appendix: Pipelining for an Ampere GEMM**
- [长文介绍矩阵乘法——从自己手搓到CUTLASS实现](https://dingfen.github.io/2021/10/20/2021-10-20-cuda-with-matmul/)：**待阅读**，动图介绍GEMM的分层结构和数据流。
- [浅析GEMM优化multistage数怎么算](https://zhuanlan.zhihu.com/p/714353243)：郑思泽（北京大学 计算机系统结构博士）的知乎文章

### A.1. 工具

- [Revezone APP](https://github.com/revezone/revezone)：画板工具
