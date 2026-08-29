#include <cute/tensor.hpp>
#include <iostream>

using namespace cute;

// 打印嵌套Layout的示例
void example_nested_layout() {
    std::cout << "=== 例五：嵌套Layout示例 ===" << std::endl;
    
    // 定义 Layout = ((2, 4), (3, 5)) : ((3, 6), (1, 24))
    auto shape = make_shape(make_shape(2, 4), make_shape(3, 5));
    auto stride = make_stride(make_stride(3, 6), make_stride(1, 24));
    auto layout = make_layout(shape, stride);
    
    std::cout << "Layout: " << layout << std::endl;
    print_layout(layout);
    
    // 测试访问几个元素
    std::cout << "\n访问测试：" << std::endl;
    
    // tensor((0, 0), (0, 0)) = 0*3 + 0*6 + 0*1 + 0*24 = 0
    auto val1 = layout(make_coord(0, 0), make_coord(0, 0));
    std::cout << "layout((0,0), (0,0)) = " << val1 << " (预期: 0)" << std::endl;
    
    // tensor((1, 0), (0, 0)) = 1*3 + 0*6 + 0*1 + 0*24 = 3
    auto val2 = layout(make_coord(1, 0), make_coord(0, 0));
    std::cout << "layout((1,0), (0,0)) = " << val2 << " (预期: 3)" << std::endl;
    
    // tensor((0, 1), (0, 0)) = 0*3 + 1*6 + 0*1 + 0*24 = 6
    auto val3 = layout(make_coord(0, 1), make_coord(0, 0));
    std::cout << "layout((0,1), (0,0)) = " << val3 << " (预期: 6)" << std::endl;
    
    // tensor((0, 0), (1, 0)) = 0*3 + 0*6 + 1*1 + 0*24 = 1
    auto val4 = layout(make_coord(0, 0), make_coord(1, 0));
    std::cout << "layout((0,0), (1,0)) = " << val4 << " (预期: 1)" << std::endl;
    
    // tensor((0, 0), (0, 1)) = 0*3 + 0*6 + 0*1 + 1*24 = 24
    auto val5 = layout(make_coord(0, 0), make_coord(0, 1));
    std::cout << "layout((0,0), (0,1)) = " << val5 << " (预期: 24)" << std::endl;
    
    // tensor((1, 2), (1, 3)) = 1*3 + 2*6 + 1*1 + 3*24 = 88
    auto val6 = layout(make_coord(1, 2), make_coord(1, 3));
    std::cout << "layout((1,2), (1,3)) = " << val6 << " (预期: 88)" << std::endl;
}

// 展示不同嵌套层次的Layout
void example_various_nesting() {
    std::cout << "\n=== 不同嵌套层次的Layout ===" << std::endl;
    
    // 一维Layout
    std::cout << "\n1. 一维Layout：" << std::endl;
    auto layout1 = make_layout(8, 1);
    std::cout << "Layout: " << layout1 << std::endl;
    print_layout(layout1);
    
    // 二维Layout（无嵌套）
    std::cout << "\n2. 二维Layout（无嵌套）：" << std::endl;
    auto layout2 = make_layout(make_shape(4, 6), make_stride(1, 4));
    std::cout << "Layout: " << layout2 << std::endl;
    print_layout(layout2);
    
    // 部分嵌套：第二维嵌套
    std::cout << "\n3. 部分嵌套Layout (4, (2, 3))：" << std::endl;
    auto layout3 = make_layout(
        make_shape(4, make_shape(2, 3)),
        make_stride(1, make_stride(4, 8))
    );
    std::cout << "Layout: " << layout3 << std::endl;
    print_layout(layout3);
    
    // 完全嵌套：两个维度都嵌套
    std::cout << "\n4. 完全嵌套Layout ((2, 2), (2, 3))：" << std::endl;
    auto layout4 = make_layout(
        make_shape(make_shape(2, 2), make_shape(2, 3)),
        make_stride(make_stride(1, 2), make_stride(4, 8))
    );
    std::cout << "Layout: " << layout4 << std::endl;
    print_layout(layout4);
    
    // 三层嵌套
    std::cout << "\n5. 三层嵌套Layout ((2, (2, 2)), 3)：" << std::endl;
    auto layout5 = make_layout(
        make_shape(make_shape(2, make_shape(2, 2)), 3),
        make_stride(make_stride(1, make_stride(2, 4)), 8)
    );
    std::cout << "Layout: " << layout5 << std::endl;
    print_layout(layout5);
}

// 展示分块矩阵的实际应用
void example_tiled_matrix() {
    std::cout << "\n=== 分块矩阵示例 ===" << std::endl;
    
    // 16x16矩阵，分成4x4个4x4的块
    // 外层：(4, 4) 个块
    // 内层：每个块是 (4, 4)
    std::cout << "\n分块矩阵：16x16 = (4块 x 4块) x (4x4每块)" << std::endl;
    
    // 行主序的分块布局
    auto tiled_layout = make_layout(
        make_shape(make_shape(4, 4), make_shape(4, 4)),  // ((块行, 块列), (块内行, 块内列))
        make_stride(make_stride(64, 16), make_stride(4, 1)) // 块步长和块内步长
    );
    
    std::cout << "Layout: " << tiled_layout << std::endl;
    print_layout(tiled_layout);
    
    std::cout << "\n访问示例：" << std::endl;
    // 访问第(1,2)块的第(2,3)元素
    // = 1*64 + 2*16 + 2*4 + 3*1 = 64 + 32 + 8 + 3 = 107
    auto val = tiled_layout(make_coord(1, 2), make_coord(2, 3));
    std::cout << "第(1,2)块的第(2,3)元素，offset = " << val << " (预期: 107)" << std::endl;
}

int main() {
    example_nested_layout();
    example_various_nesting();
    example_tiled_matrix();
    
    return 0;
}
