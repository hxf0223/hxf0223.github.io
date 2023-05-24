# zz 杂项笔记

## TVM python/C++ 调用入口

在 `python` 端，各个子目录下都有一个`_ffi_api.py`，用于初始化相应的`C++`端注册的全局函数。python端调用 `_ffi_api.xxx`，通过 `ffi navigator`，`C++`端会调用到相应的注册函数，例如：

```python
_ffi_api.Placeholder(shape, dtype, name)
```

ffi navigator 在 C++ 端的调用入口为 `TVMFuncCall`，然后调用到相应的注册函数。所以如果找不到对应 C++ 端注册函数，只要在调试时，在 `TVMFuncCall` 处打上断点：

```cpp
int TVMFuncCall(TVMFunctionHandle func, TVMValue* args, int* arg_type_codes, int num_args,
                TVMValue* ret_val, int* ret_type_code)
```

## TVM C++ 调试打印

```cpp
std::cout<<tvm::PrettyPrint(GetRef<Add>(op))<<std::endl;
 std::cout<<tvm::AsText(GetRef<Add>(op))<<std::endl;
 std::cout<<tvm::PrettyPrint(stmt)<<std::endl;
 std::cout<<tvm::AsText(stmt)<<std::endl;
 std::cout<<tir::AsTVMScript(sch->mod())<<std::endl;
 std::cout<<tir::AsTVMScript(mod)<<std::endl;

// 作者：mrcricket
// 链接：https://zhuanlan.zhihu.com/p/592012499
```

## 开源引擎

google 在2017年推出了 TF-Lite，腾讯在2017年推出了ncnn，Apple 在2017也推出了CoreML，阿里在2018年推出了MNN，华为2019年推出了MindSpsore-Lite。距今已经过去了快5年的时间，技术上也接近收敛。

