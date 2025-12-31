---
title: CUDA优化：Bank Conflict
date: 2025-02-25 +0800
categories: [CUDA]
tags: [CUDA]

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. Bank Conflicts (Shared Memory) ##

针对`Shared Memory`的访问，`CUDA`使用`bank`机制，将`shared memory`的访问（读/写）映射到不同的`bank`，以实现并行访问。`bank`以4字节为单位，共32个`bank`。这样，一个时钟周期内，可以并行访问32个不同的`bank`，即访问`128字节`的数据。映射公式`bank(addr) := (addr / 4) % 32`。

图示`transaction`：

```text
Thread（在CUDA Core中）
    ↓
  访问Shared Memory
    ↓
[Bank系统处理] ← Transaction在这里发生
    ↓
返回数据到Thread
```

举例：`warp`中定义的`shared memory`如何映射到`banks`：

```cpp
__shared__ float s[64];
```

如上变量，其映射如下：

![shared-memory-bank-map](/assets/images/cuda/20250223/bank-map.drawio.svg)

在一次`transaction`的时候，如果，当`warp`中的不同线程访问到同一个`bank`中的不同地址时，就会产生`Bank Conflicts`，导致访问串行化：需要分成多次`transaction`。有`N`个线程访问同一个`bank`，称为`N-way Bank Conflicts`。

> `Bank Conflicts`影响仅限一个`warp`内的一次`transaction`，且内存为`shared memory`。

如下情况，会产生`Bank Conflicts`：

* 一次`transaction`中，`warp`中的多个线程，访问同一个`bank`中的不同地址；
* 一次`transaction`中，`warp`中的多个线程，访问`shared memory`的下一个128字节，被映射到同一个`bank`。此时也是属于上一种情况：同一个`bank`中的不同地址。

如下情况，`Bank Conflicts`不会产生：

* `warp`中的线程，访问地址唯一对应到`bank`簇的每个`bank`，不论是顺序，还是错位；
* `warp`中的多个线程，访问同一个`bank`中的相同地址--使用`boardcast`分发相同地址数据到多个线程；
* `warp`中的线程，单个线程一次访问多个`bank`，但其他线程不访问这些`bank`。此时，生成多次`transaction`。

## 2. Bank Conflicts 示例 ##

> 以下示例来自博客[Notes About Nvidia GPU Shared Memory Banks](https://feldmann.nyc/blog/smem-microbenchmarks)。

如下示例，产生32路`Bank Conflicts`：

```cpp
__global__ void all_conflicts() {
    __shared__ float s[32][32];
    int warp_id = threadIdx.y;
    int lane_id = threadIdx.x; // thread 在 warp 中的 id

    float* ptr = &s[lane_id][0];
    int addr = (int)ptr & 0xFFFF;

    for (int j = 0; j < num_iters; j++) { // num_iters 定义为 100'000
        asm volatile ("ld.volatile.shared.f32 %0, [%1];"
                        : "=f"(r1)
                        : "r"(addr));
    }
}

// launched withall_conflicts<<<1, dim3(32, 8)>>>();
// Gride size: 1（即只有一个Block）
// Block size: dim3(32, 8)（即有8个warp，每个warp 32个线程）
```

![bank-conflict-example](/assets/images/cuda/20250223/all-conflicts.svg)

## 3. 矢量读写指令 ##

使用矢量指令`ld.shared.v4`可以读取4个连续的32位数据。如下代码，一个线程读取`s[4*i]`, `s[4*i+1]`, `s[4*i+2]`, `s[4*i+3]`（分为四个`transaction`）。会产生四路`Bank Conflicts`：

```cpp
__global__ void vectorized_loads() {
    __shared__ float sh[8][128];
    
    int warp_id = threadIdx.y;
    int lane_id = threadIdx.x;
        
    float4* ptr = reinterpret_cast<float4*>(&sh[warp_id][lane_id * 4]);
    int addr = (int)ptr & 0xFFFF;

    float4 r;
    for (int j = 0; j < num_iters; j++) {
        asm volatile ("ld.volatile.shared.v4.f32 {%0,%1,%2,%3}, [%4];"
                        : "=f"(r.x), "=f"(r.y), "=f"(r.z), "=f"(r.w)
                        : "r"(addr));
    }
}
```

![vectorized-loads](/assets/images/cuda/20250223/v4loads.svg)

> 上图只给出了一半的线程访问情况。编号(`Lane`)为0的线程与编号为8的线程，访问的`shared memory`中的数据映射到了同一个`bank 0`；同时，编号为16，以及24，同样映射到了`bank 0`。
> 不过，由于其每个线程一次访问4个32位数据，其平均访问时间折算下来，与32位加载相当。

要想避免`Bank Conflicts`，可以错开（`interleave`）冲突的线程访问的顺序，比如：

* 线程0：s[0] -> s[1] -> s[2] -> s[3]
* 线程8：s[33] -> s[34] -> s[35] -> s[32]

## 3. 避免 Bank Conflicts 的方法 ##

### 3.1. Padding ###



## 参考资料 ##

* [How to understand the bank conflict of shared_mem](https://forums.developer.nvidia.com/t/how-to-understand-the-bank-conflict-of-shared-mem/260900)

## 学习资料 ##

- [CCUDA 编程手册系列第五章: 性能指南](https://developer.nvidia.com/zh-cn/blog/cuda-performance-guide-cn/)
- [Performance Optimization: Paulius Micikevicius Programming Guidelines and GPU Architecture Reasons Behind Them](https://www.cs.emory.edu/~cheung/Courses/355/Syllabus/94-CUDA/DOCS/S3466-Programming-Guidelines-GPU-Architecture.pdf)
- [cuda程序优化-2.访存优化](https://www.cnblogs.com/sunstrikes/p/18252517)


