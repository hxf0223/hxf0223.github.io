---
title: 写给大家看的设计模式
date: 2023-05-5 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

- [写给大家看的设计模式](https://juejin.cn/post/6844903491601694727)
- [图解TensorFlow源码](https://www.cnblogs.com/yao62995/p/5773578.html)

## 抽象工厂模式

1. 被创建抽象类 Iuser；
2. 抽象工厂类 IFactory，定义创建接口 `IUser* createUser()`。
当需要新增被创建类型时，需要新增被创建类型及对应工厂类型；

```cpp
// 代表数据库中User表中的一条记录
class RecUser {
  int32_t uid;
  std::string uname;
};

// 代表数据库中Department表中一条记录
class RecDepartment {
  int32_t did;
  std::string dname;
};

// 1. 用户表操作抽象接口
class IUser {
public:
  virtual void insert(const RecUser *user) = 0;
  virtual RecUser *getUserRecord(int32_t id) = 0;
  virtual ~IUser() = default;
};

// 2.1 User表操作实现类：SQL Server
class SqlServerUser : public IUser {
public:
  void insert(const RecUser *user) override {
    std::cout << "Insert a user record into SQL Server table." << std::endl;
  }
  RecUser *getUserRecord(int32_t id) override {
    std::cout << "Get a record from SQL Server table." << std::endl;
    return nullptr;
  }
  ~SqlServerUser() override {
    std::cout << "dtor of SqlServerUser." << std::endl;
  }
};

// 2.2 User表操作实现类：access 表
class AccessUser : public IUser {
public:
  void insert(const RecUser *user) override {
    std::cout << "Insert a user record into access table." << std::endl;
  }
  RecUser *getUserRecord(int32_t id) override {
    std::cout << "Get a record from access table." << std::endl;
    return nullptr;
  }
  ~AccessUser() override {
    std::cout << "dtor of AccessUser. " << std::endl;
  }
};

// 3. 抽象工厂类
class IFactory {
public:
  virtual IUser *createUser() = 0;
};

// 4.1 SQL Server 具体工厂类
class SqlFactory : public IFactory {
public:
  IUser *createUser() override {
    return new SqlServerUser;
  }
};

// 4.2 access 具体工厂类
class AccessFactory : public IFactory {
public:
  IUser *createUser() override {
    return new AccessUser;
  }
};

TEST_CASE("design mode: abstract factory") {
  RecUser user_rec;

  // 创建类型1实例：SQL表操作
  std::shared_ptr<IFactory> factory(new SqlFactory);
  std::shared_ptr<IUser> user_table(factory->createUser());
  user_table->insert(&user_rec);
  user_table->getUserRecord(1);

  // 创建类型2实例：access表操作
  factory.reset(new AccessFactory);
  user_table.reset(factory->createUser());
  user_table->insert(&user_rec);
  user_table->getUserRecord(1);
}
```
