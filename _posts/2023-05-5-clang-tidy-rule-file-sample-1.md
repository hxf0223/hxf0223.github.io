---
title: clang-tidy rule file sample [1]
date: 2023-05-5 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [cpp]
tags: [cpp]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

# clang-tidy rule file sample [1]

文件名：`.clang-tidy`
部分检查项目中文解释：[selfboot/ClangTidyChecks](https://github.com/selfboot/ClangTidyChecks)

```text
Checks: >
  -*,
  bugprone-*,
  -bugprone-easily-swappable-parameters,
  -bugprone-narrowing-conversions,
  -bugprone-exception-escape,
  clang-analyzer-*,
  -clang-analyzer-unix.Malloc,
  -clang-analyzer-deadcode.DeadStores,
  misc-*,
  -misc-non-private-member-variables-in-classes,
  -misc-confusable-identifiers,
  -misc-unused-parameters,
  -misc-const-correctness,
  modernize-*,
  -modernize-concat-nested-namespaces,
  -modernize-avoid-c-arrays,
  -modernize-use-trailing-return-type,
  -modernize-redundant-void-arg,
  -modernize-use-using,
  -modernize-use-nodiscard,
  -modernize-use-auto,
  -performance-unnecessary-value-param,
  portability-*,
  readability-*,
  -readability-avoid-const-params-in-decls,
  -readability-convert-member-functions-to-static,
  -readability-isolate-declaration,
  -readability-identifier-length,
  -readability-named-parameter,
  -readability-magic-numbers,
  -readability-redundant-access-specifiers,
  
CheckOptions:
- { key: readability-identifier-naming.NamespaceCase,            value: lower_case }
- { key: readability-identifier-naming.ClassCase,                value: CamelCase  }
- { key: readability-identifier-naming.StructCase,               value: CamelCase  }
- { key: readability-identifier-naming.MemberCase,               value: camelBack  }
- { key: readability-identifier-naming.TemplateParameterCase,    value: CamelCase  }
- { key: readability-identifier-naming.FunctionCase,             value: camelBack  }
- { key: readability-identifier-naming.VariableCase,             value: lower_case }
- { key: readability-identifier-naming.ParameterCase,            value: camelBack  }
- { key: readability-identifier-naming.MacroDefinitionCase,      value: UPPER_CASE }
- { key: readability-identifier-naming.EnumConstantCase,         value: CamelCase }
- { key: readability-identifier-naming.EnumConstantPrefix,       value: k         }
- { key: readability-identifier-naming.ConstexprVariableCase,    value: CamelCase }
- { key: readability-identifier-naming.ConstexprVariablePrefix,  value: k         }
- { key: readability-identifier-naming.GlobalConstantCase,       value: CamelCase }
- { key: readability-identifier-naming.GlobalConstantPrefix,     value: k         }
- { key: readability-identifier-naming.MemberConstantCase,       value: CamelCase }
- { key: readability-identifier-naming.MemberConstantPrefix,     value: k         }
- { key: readability-identifier-naming.StaticConstantCase,       value: CamelCase }
- { key: readability-identifier-naming.StaticConstantPrefix,     value: k         }
```



