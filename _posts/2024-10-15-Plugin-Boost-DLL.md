---
layout: post
title: Plugin 的创建及使用
date: 2024-10-15 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [Cpp, Plugin]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right
---

1. 使用 `BOOST_DLL_ALIAS` 定义插件接口。
2. 使用 `import_alias` 导入插件接口。
3. 使用 `creator` / `Factory` 模式，提供创建插件实例的接口。

Demo Code: [test_plugin_dll](https://gitee.com/occt/test_plugin_dll)

## 1. 实现插件接口

### 1.1 DSO/DLL原型定义

```c++
class DIInterface {
 public:
  DIInterface() = default;
  virtual ~DIInterface() = default;
  //virtual std::shared_ptr<DIInterface> clone() = 0;

  virtual void loadInfo(const std::string& dataFile) = 0;
  virtual QWidget* getWidget() = 0;
  virtual void unload() = 0;

 protected:
  QWidget* widget_;
};
```

### 1.2 接口定义及实现

```c++
std::shared_ptr<test::plugin::DIInterface> diLoader(const std::string& infoFile) {
  std::shared_ptr<test::plugin::DIInfoChaoke> ptr = std::make_shared<test::plugin::DIInfoChaoke>();
  ptr->loadInfo(infoFile);
  return ptr;
}

BOOST_DLL_ALIAS(diLoader,  // 被封装成插件接口的函数名
    diLoaderAlias); // 别名，可用于创建插件实例
```

## 2. 插件加载

```c++
// static const char* kDILoaderFnName = "diLoaderAlias";
const std::string dir_path = boost::dll::program_location().parent_path().string();
const auto chaoke_dll_path = fs::path(dir_path) / "di_plugin_chaoke.dll";
lib_ = boost::dll::shared_library(chaoke_dll_path.string());

try {
  auto creator = boost::dll::import_alias<di_loader_proto_t>(chaoke_dll_path.string(), kDILoaderFnName,
                                                               boost::dll::load_mode::append_decorations);
  auto loader_proto = lib_.get_alias<di_loader_proto_t>(kDILoaderFnName);
  instance_ = loader_proto(dataFilePath);
} catch (const std::exception& e) {
  SPDLOG_WARN("Failed to load dll: {}", e.what());
  return false;
}
```

## 3. 插件卸载

在卸载`DSO/DLL`之后，由于类的成员函数代码内存被释放，故其`vtable`所指向的内存（即成员方法）变成非法地址，在调用其成员方法函数，以及析构函数时，会导致程序崩溃。

所以在卸载`DLL/DSO`之前，需要先释放外部持有的资源：

1. 调用`unload`接口，释放资源，比如释放`QWidget`;
2. 释放外部持有的`shared_ptr`;

## 4. 技巧：将`boost::dll::shared_library`生命周期与Plugin实例对象生命周期绑定

定义如下`deletor`：

```c++
struct library_holding_deleter {
  library_holding_deleter(std::shared_ptr<boost::dll::shared_library> libDLL) : lib_(libDLL) {}

  void operator()(DIInterface* p) const { delete p; }

  std::shared_ptr<boost::dll::shared_library> lib_;
};
```

在创建`DIInterface`实例时，传入`library_holding_deleter`（make_shared不支持传入自定义`deleter`）：

```c++
// auto lib_dll = std::make_shared<boost::dll::shared_library>(chaoke_dll_path.string());
// library_holding_deleter deletor(lib_dll);

std::shared_ptr<test::plugin::DIInterface> diLoader(const std::string& infoFile, library_holding_deleter deletor) {
  std::shared_ptr<test::plugin::DIInfoChaoke> ptr(new test::plugin::DIInfoChaoke, deletor);
  ptr->loadInfo(infoFile);
  return ptr;
}
```

## 5. 资料

- [Boost DLL -- Plugin](https://www.boost.org/doc/libs/1_86_0/doc/html/boost_dll/tutorial.html)
- [跨平台的 plugin 開發函式庫：Boost DLL - 進階](https://viml.nchc.org.tw/archive_blog_614/)
- [Boost Plugin Loader](https://gitee.com/vaughnHuang/boost_plugin_loader)
