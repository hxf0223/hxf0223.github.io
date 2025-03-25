---
title: C++对象模型--多继承
date: 2025-03-24 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. 多继承--无虚拟继承 ##

```cpp
class Base1 {
public:
    int a;
    int b;
};
class Base2 {
public:
    int c;
    int d;
};
class Derive : public Base1 , public Base2 {
public:
    int e;
    int f;
};
```

内存布局顺序为：`Base1`的成员变量 -> `Base2`的成员变量 -> `Derive`的成员变量。如下图所示（图中一格表示4字节）：

![多继承内存布局(无虚拟继承)](/assets/images/cpp/20250324/1_1_memory_model_no_virtual.png)

### 1.1 指针调整 ###

当进行`Derive` / `Base` 指针赋值或比较时，编译器对`Base` / `Derive` 指针进行偏移调整。

```cpp
int main() {
    Derive* d_ptr = new Derive();
    Base2* b2_ptr = d_ptr;
    Base1* b1_ptr = d_ptr;
    printf("address of d_ptr = %p\n", d_ptr);
    printf("address of b1_ptr = %p\n", b1_ptr);
    printf("address of b2_ptr = %p\n", b2_ptr); // 指针调整

    if (d_ptr == b2_ptr) { // 明明两个指针在数值上不相同，但从C++的语义上看，两个指针指向同一个对象，所以编译器还是进行指针调整。
        printf("d_ptr == b2_ptr\n");
    }
    if (d_ptr == b1_ptr) {
        printf("d_ptr == b1_ptr\n");
    }
}
```

```bash
address of d_ptr = 0x560982eebe70
address of b1_ptr = 0x560982eebe70
address of b2_ptr = 0x560982eebe78
d_ptr == b2_ptr
d_ptr == b1_ptr
```

## 参考 ##

* [CPP对象模型](https://www.cnblogs.com/HeyLUMouMou/p/17304385.html)
* [深度探索C++对象模型_读书笔记.pdf](/assets/pdf/深度探索C++对象模型_读书笔记.pdf)
