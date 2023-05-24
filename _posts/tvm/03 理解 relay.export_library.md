# 03 理解 relay.export_library

例程代码来源 apps/howto_deploy/prepare_test_libs.py

```python
def prepare_graph_lib(base_path):
    x = relay.var("x", shape=(2, 2), dtype="float32")
    y = relay.var("y", shape=(2, 2), dtype="float32")
    params = {"y": np.ones((2, 2), dtype="float32")}
    mod = tvm.IRModule.from_expr(relay.Function([x, y], x + y))
    # build a module
    compiled_lib = relay.build(mod, tvm.target.Target("llvm"), params=params)
    # export it as a shared library
    # If you are running cross compilation, you can also consider export
    # to tar and invoke host compiler later.
    dylib_path = os.path.join(base_path, "test_relay_add.so")
    compiled_lib.export_library(dylib_path)


if __name__ == "__main__":
    curr_path = os.path.dirname(os.path.abspath(os.path.expanduser(__file__)))
    #prepare_test_libs(os.path.join(curr_path, "lib"))
    prepare_graph_lib(os.path.join(curr_path, "lib"))
```

## 1. tvm.IRModule.from_expr

使用表达式生成一个`tvm.IRModule`（省略部分代码）：

```python
def from_expr(expr, functions=None, type_defs=None):
  '''Construct a module from a standalone expression.'''
	return _ffi_api.Module_FromExpr(expr, funcs, defs)
```

```cpp
// src/ir/module.cc
// TVM_REGISTER_GLOBAL("ir.Module_FromExpr").set_body_typed(&IRModule::FromExpr);
// IRModule IRModule::FromExpr(const RelayExpr& expr, const Map<GlobalVar, BaseFunc>& global_funcs, const Map<GlobalTypeVar, TypeData>& type_definitions)

std::pair<IRModule, GlobalVar> IRModule::FromExprInContext(
    const RelayExpr& expr, const tvm::Map<GlobalVar, BaseFunc>& global_funcs,
    const tvm::Map<GlobalTypeVar, TypeData>& type_definitions,
    std::unordered_set<String> import_set) {
  auto mod = IRModule(global_funcs, type_definitions, std::move(import_set));
  String gv_name;

	// All global definitions must be functions.
  BaseFunc func;
  if (auto* func_node = expr.as<BaseFuncNode>()) {
    func = GetRef<BaseFunc>(func_node);
    if (auto opt = func->GetAttr<String>(tvm::attr::kGlobalSymbol)) {
      // Function literal has been annotated with it's required global symbol.
      gv_name = opt.value();
    }
  } else {
    func = relay::Function(relay::FreeVars(expr), expr, Type(), relay::FreeTypeVars(expr, mod), {});
  }

	// 根据expr生成IRModule，func的默认名称是 main
	GlobalVar main_gv;
  auto global_var_supply = GlobalVarSupply(mod);
  if (gv_name.empty()) {
    // Bind function to 'main' (though rename if would clash with existing 'main').
    main_gv = global_var_supply->FreshGlobal("main", false);
  } else {
    main_gv = global_var_supply->UniqueGlobalFor(gv_name, false);
  }
  mod->Add(main_gv, func);
  return {mod, main_gv};
}
```

在`IRModule::FromExprInContext`中，expr 转换为`BaseFunc`类型的变量 func。`BaseFunc`是`BaseFuncNode`的引用（obj ptr），即<font color="red">实际上func代表ADT的一个节点</font>：

```cpp
class BaseFunc : public RelayExpr {
 public:
  TVM_DEFINE_OBJECT_REF_METHODS(BaseFunc, RelayExpr, BaseFuncNode);
};

class BaseFuncNode : public RelayExprNode {}
```


## 参考

- [TVM export_lib 函数分析](https://zgh551.github.io/2021/10/08/TVM-ExportLibrary/)
- [模块序列化简介](https://daobook.github.io/tvm/docs/arch/introduction_to_module_serialization.html)
- [TVM - 代码生成流程](https://chhzh123.github.io/blogs/2020-03-26-tvm-flow/#%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90)
