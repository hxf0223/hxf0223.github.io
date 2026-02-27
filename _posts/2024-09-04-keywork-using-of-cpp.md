---
layout: post
title: 总结：using 几种使用场景
date: 2024-09-04 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## 1. using 声明 (using declaration) ##

将`命名空间中的某一个名字 (变量或函数) 引入到当前作用域中`，使得当前作用域访问该名字，不需要使用命名空间，以及全局限定符`::`。

```cpp
{
    using std::map;
    map<int, std::string> the_map; //ok
}

map<int, std::string> the_map2;  //error
```

### 1.1 使用 using 声明，子类可以使用父类中的私有(private)成员 ###

```cpp
class Base{
protected:
    int bn1;
    int bn2;
};
 
class Derived: private Base{
public:
    using Base::bn1;
};
 
class DerivedAgain: public Derived{
};

int main() {
  Derived d;
  d.bn1 = 1;  // ok
  d.bn2 = 2;  // error, 'bn2' is a private member of 'Base'
  
  DerivedAgain da;
  da.bn1 = 3; // ok

  return 0;
}
```

## 2. 其他使用场景 ##

* 引入命名空间(using directive)；
* 别名 alias，如: using alias_class_t = myClass；

### 2.1 template + using 使用方法 ###

```cpp
template<typename Val>
using int_map_t = std::map<int, Val>;
 
int main() {
  int_map_t<int> imap;
  return 0;
}
```

