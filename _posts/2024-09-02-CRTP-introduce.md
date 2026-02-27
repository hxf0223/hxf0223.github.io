---
layout: post
title: CRTP：使用笔记
date: 2024-09-02 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp, Template]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. 动态继承运行时时间损耗 ##

* 每个 virtual 方法，都需要通过指针查找到虚函数入口（间接寻址），且可能引起`I-Cache` `cache miss`；
* virtual 方法，不能被优化为`inline`，针对一些短小的函数，时间损耗较大；

## 2. CRTP 使用举例：子类也是 template 模板类 ##

```c++
template <typename DerivedT>
class HoleDetectorBase {
 public:
  using underlying_type = HoleDetectorBase<DerivedT>;
  //...
};

template <typename condPairFuncT, typename condGHIPairFuncT>
class HoleDetector2 : public HoleDetectorBase<HoleDetector2<condPairFuncT, condGHIPairFuncT>> {
 public:
  using base_t = HoleDetectorBase<HoleDetector2<condPairFuncT, condGHIPairFuncT>>;
  using typename base_t::underlying_type;

  //...
};
```

* 继承写法为：`HoleDetector2<condPairFuncT, condGHIPairFuncT>`，即带上`template`参数。

### 2.1 添加在基类中封装子类的函数 ###

```c++
template <typename DerivedT>
class HoleDetectorBase {
//...

DerivedT& underlying() { return static_cast<DerivedT&>(*this); }
DerivedT const& underlying() const { return static_cast<DerivedT const&>(*this); }

//...
};
```

* Note：基类中不能引用子类中的子类型，因为对父类而言，子类是`incomplete type`。

## 3. 子类中使用 CRTP 父类的成员方法 ##

子类中使用父类的成员函数，需要加上`base_t::`前缀，或者`this`指针。

```c++
auto groups = base_t::group_holes(valid_holes);
```

## 4. 参考资料 ##

* [unique_ptr 与抽象类的多态](https://hedzr.com/c++/algorithm/unique_ptr-and-abstract-class/)
* [An Implementation Helper For The Curiously Recurring Template Pattern](https://www.fluentcpp.com/2017/05/19/crtp-helper/)
* [The Curiously Recurring Template Pattern in C++](https://eli.thegreenplace.net/2011/05/17/the-curiously-recurring-template-pattern-in-c/#id3)
* [The cost of dynamic (virtual calls) vs. static (CRTP) dispatch in C++](https://eli.thegreenplace.net/2013/12/05/the-cost-of-dynamic-virtual-calls-vs-static-crtp-dispatch-in-c)
* [C++CRTP概念与应用和concept](https://www.cnblogs.com/chen-pi/p/17841127.html)

