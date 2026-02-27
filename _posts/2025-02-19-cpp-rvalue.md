---
layout: post
title: C++ 右值引用，万能引用，完美转发
date: 2025-02-18 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

主要概念：

* 引用的本质在`C++`内部实现是一个常指针。
* 左值引用，右值引用。右值引用限制了其只能接收右值，可以利用这个特性从而提供重载。
* template 万能引用，引用折叠。
* 完美转发：std::forward 。

## 完美转发 std::forward ##

模板的万能引用只是提供了能够接收同时接收左值引用和右值引用的能力，但是引用类型的唯一作用就是限制了接收的类型，后续使用中都退化成了左值，我们希望能够在传递过程中保持它的左值或者右值的属性, 如果不使用forward，直接按照下面的方式写就会导致问题。

```cpp
void RFn(int&& arg){

}

template<typename T>
void ProxyFn(T&& arg){
      RFn(arg);
}

void main(){
     ProxyFn(1);
}
```

会发现右值版本不能传过去, [int]无法到[int&&]，就导致参数不匹配。

![template_call_without_forward](/assets/images/cpp/20250219/template_call_without_std_forward.png)

* [C++: 左值引用(&), 右值引用(&&),万能引用(template &&)详解 与 完美转发(forward) 实现剖析](https://www.cnblogs.com/ishen/p/13771991.html)
* [说一下C++左值引用和右值引用](https://www.cnblogs.com/codemagiciant/p/17601950.html)
