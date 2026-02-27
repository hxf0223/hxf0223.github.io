---
layout: post
title: gcc 向量化相关选项
date: 2024-11-19 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp, GCC]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

## 1. alias选项

`strict aliasing`是编译器优化中依赖的一个假设，即不同类型的指针，指向不同的内存区域。基于该假设，`gcc`编译器可以进行一些优化。`gcc`优化`-O2`默认开启该选项(`-fstrict-aliasing`)。

使用该选项，需要保证不同类型指针的内存区域不重叠，否则会导致未定义行为。例如:

```c++
int a = 10;
int* p1 = &a;
float* p2 = (float*)&a;
```

如果不能保证，则使用`-fno-strict-aliasing`选项。该选项导致性能下降，例如每次可能会从内存中读取数据，而不是寄存器。

要保证代码类型转换安全，使用编译选项:

```cmake
add_compile_options(-Wstrict-aliasing) # -Werror -Wall
```

参考: [Casting does not work as expected when optimization is turned on](https://gcc.gnu.org/bugs/#casting_and_optimization)

## 2. vectorize选项

- `-ftree-vectorize`: 整个代码中，可能的向量化优化。
- `-ftree-loop-vectorize`: 循环中的向量化优化。
- `-fopt-info-vec-missed`: 显示没有向量化的循环。
- `-fopt-info-vec-optimized`: 显示已向量化的循环。

另外，在本地，想要充分优化，设置:

```cmake
set(CMAKE_C_FLAGS_RELEASE "-O3 -march=native")
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -march=native")
```

编写代码过程中，影响向量化的因素有:

- exception: 异常处理会影响向量化。尽可能使用`noexcept`或`const`。

## 3. 调试--看IR

```cmake
add_compile_options(-fdump-tree-dse) #查看 dead store elimination 之后的 IR
```

## 4. vectorize 更多资料

入门资料:

- [Intel -- Vectorization codebook](https://easyperf.net/blog/2017/11/10/Tips_for_writing_vectorizable_code)
- [step by step -- Crunching Numbers with AVX and AVX2](https://www.codeproject.com/Articles/874396/Crunching-Numbers-with-AVX-and-AVX)

更多资料:

- [Vectorization part1. Intro.](https://easyperf.net/blog/2017/10/24/Vectorization_part1)
- [Auto-vectorization in GCC](https://gcc.gnu.org/projects/tree-ssa/vectorization.html)
- [Automatic Vectorization](https://www.codingame.com/playgrounds/283/sse-avx-vectorization/autovectorization)
