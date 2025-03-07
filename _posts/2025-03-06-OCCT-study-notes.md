---
title: OCC 待学习资料记录
date: 2025-03-06 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [OCCT]
tags: [occt]      # TAG names should always be lowercase

# 以下默认false
math: true
mermaid: true
# pin: true
---

## 1. 求交 ##

对二次曲线与二次曲面求交，使用解析几何的方法，计算出交点，依赖底层数学库`math_DirectPolynomialRoots`。类`math_DirectPolynomialRoots`可以对最多4次方程进行求解。

如下曲面可以使用二次曲线表示，并使用解析几何求交：

* `I_gp_Pln`：二次曲面特例；
* `I_gp_Sphere`：解析球面；
* `I_gp_Cylinder`：解析柱面；
* `I_gp_Cone`：解析锥面；

这些曲面都可以使用二次曲线表示，即这个二次曲线方程的参数确定的上述这些曲面。`OCC`中相应的类为`IntAna_Quaric`。

二次曲线与自由曲面求交，使用数值计算方法，即`Newton-Raphson`迭代逐次逼近 [数学之美：牛顿-拉夫逊迭代法原理及其实现](https://mp.weixin.qq.com/s/ixgGknhGrxSgvHzH5RlIbw)。

* [OpenCASCADE 线面求交](https://www.cnblogs.com/opencascade/p/occt_intcs.html)
* [解析几何求交之直线与二次曲面](https://www.cnblogs.com/opencascade/p/IntAna_IntConicQuad.html)
* [Modeling Algorithms](https://old.opencascade.com/doc/occt-7.4.0/overview/html/occt_user_guides__modeling_algos.html)
