---
layout: post
title: 写给大家看的设计模式
date: 2023-05-5 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [Cpp]
tags: [设计模式]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

- [写给大家看的设计模式](https://juejin.cn/post/6844903491601694727)
- [图解TensorFlow源码](https://www.cnblogs.com/yao62995/p/5773578.html)

## 1. 抽象工厂模式 ##

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

### 1.1 简化的抽象工厂模式 ###

```cpp
struct HotDrinkFactory {
  virtual unique_ptr<HotDrink> make() const = 0;
};
struct CoffeeFactory : public HotDrinkFactory {
  unique_ptr<HotDrink> make() const override {
    return make_unique<Coffee>();
  }
};

class DrinkFactory {
  std::map<std::string, std::unique_str<HotDrinkFactory>> hot_factories_;
public:
  DrinkFactory() {
   hot_factories_["coffee"] = make_unique<CoffeeFactory>();
   hot_factories_["tea"] = make_unique<TeaFactory>();
  }
  unique_ptr<HotDrink> make_drink(const string& name) {
   auto drink = hot_factories_[name]->make();
   drink->prepare(200); // oops!
   return drink;
  }
};
```

## 2. Builder模式 ##

```cpp
class PersonAddressBuilder : public PersonBuilderBase {
	typedef PersonAddressBuilder self; 
public:
	explicit PersonAddressBuilder(Person& person) : PersonBuilderBase{ person } {}
	self& at(std::string street_address) {
  	person.street_address = street_address;
	 	return *this;
	}

  self& with_postcode(std::string post_code) { /*...*/ return *this; }
  self& in(std::string city) { /*...*/ return *this; }
};

// 使用，赋值属性后返回引用可以持续进行属性赋值
Person p = Person::create()
  .lives().at("123 London Road")
          .with_postcode("SW1 1GB")
          .in("London")
  .works().at("PragmaSoft")
          .as_a("Consultant")
          .earning(10e6);
```

### 3. 享元模式 (flyweight) ###

享元(flyweight)模式，是一种结构型设计模式，用于减少内存使用。典型由三个部分组成：

* flyweight -- 享元：存储共享的状态，不随时间变化的存储对象，可以被共享。
* 享元工厂：创建并管理享元。
* 客户端：使用享元工厂获取享元并操作。

```cpp
#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>

// 享元类
class Character {
public:
  virtual void display(int width, int height, int pointSize) = 0;
};

// 具体享元类
class ConcreteCharacter : public Character {
public:
  ConcreteCharacter(char symbol) : symbol_(symbol) {}

  void display(int width, int height, int pointSize) override {
    std::cout << "Character: " << symbol_ 
              << ", Width: " << width 
              << ", Height: " << height 
              << ", Point Size: " << pointSize 
              << std::endl;
  }

private:
  char symbol_;
};

// 享元工厂类
class CharacterFactory {
public:
    std::shared_ptr<Character> getCharacter(char symbol) {
        if (characters_.find(symbol) == characters_.end()) {
            characters_[symbol] = std::make_shared<ConcreteCharacter>(symbol);
        }
        return characters_[symbol];
    }

private:
    std::unordered_map<char, std::shared_ptr<Character>> characters_;
};

// 客户端代码
int main() {
    CharacterFactory factory;

    std::shared_ptr<Character> characterA = factory.getCharacter('A');
    std::shared_ptr<Character> characterB = factory.getCharacter('B');
    std::shared_ptr<Character> characterC = factory.getCharacter('A'); // 共享已有的'A'对象

    characterA->display(10, 20, 12);
    characterB->display(15, 25, 14);
    characterC->display(10, 20, 12); // 共享的'A'对象

    return 0;
}
```

### 3.1 Boost.Flyweight ###

`Boost.Flyweight`可以用来创建和管理共享对象。

```cpp
struct User2
{
  boost::flyweight<std::string> first_name, last_name;  //类似一个缓存

  User2(const std::string &first_name, const std::string &last_name)
    : first_name(first_name), last_name(last_name) {}
};

void boost_flyweight()
{
  User2 user1{"John", "Smith"};
  User2 user2{"Jane", "Smith"};
  std::cout << user1.first_name << endl;
  std::cout << std::boolalpha  //std::boolalpha 可以把 bool 变成 true/false 字符串
       << (&user1.first_name.get() == &user2.first_name.get()) << std::endl;
  std::cout << std::boolalpha
       << (&user1.last_name.get() == &user2.last_name.get()) << std::endl;
}
```
