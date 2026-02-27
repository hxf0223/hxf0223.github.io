---
layout: post
title: vtkUnstructuredGrid 显示 HDF5 数据
date: 2023-06-22 +0800 # 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: [VTK]
tags: [VTK]

# 以下默认false
math: true
mermaid: true
# pin: true
toc:
  sidebar: right

---

## Reference

* [VTK examples](https://github.com/Kitware/vtk-examples/blob/c1c8af1e70708e65d6fa4bf69fab814f03c99dc2/src/Cxx/GeometricObjects/Hexahedron.cxx)

## 添加 field (dataset) 数据

### 第一步，创建VTK的`field`数据

```cpp
vtkSmartPointer<vtkDoubleArray> fieldDataArray = vtkSmartPointer<vtkDoubleArray>::New();
fieldDataArray->SetNumberOfComponents(1); // assuming scalar data

// Assuming "dataset" is your std::map<std::string, std::vector<double>>
for (const auto& pair : dataset) {
    const std::string& fieldName = pair.first;
    const std::vector<double>& fieldValues = pair.second;

    fieldDataArray->SetName(fieldName.c_str());
    for (double value : fieldValues) {
        fieldDataArray->InsertNextValue(value);
    }

    // Assuming "grid" is your vtkUnstructuredGrid object
    grid->GetPointData()->AddArray(fieldDataArray);
}
```

* 根据`dataset`的属性`field`是`scalar`数据还是`tensor`数据，设置`SetNumberOfComponents`的参数；
* 根据`dataset`的属性`field`是`scalar`数据还是`tensor`数据，选择`InsertNectValue`或者`InsertNextTuple`；
* 根据`dataset`的属性`location type`属性是`vetex`还是`element`，`grid`选取`GetPointData`或者`GetCellData`；

### 第二步，添加VTK `field`数据到`mapper`

```cpp
vtkSmartPointer<vtkDataSetMapper> mapper = vtkSmartPointer<vtkDataSetMapper>::New();
mapper->SetInputData(grid);
mapper->SetScalarModeToUsePointData(); // or SetScalarModeToUseCellData()
mapper->SelectColorArray("fieldName"); // replace "fieldName" with the name of the field you want to use for coloring

vtkSmartPointer<vtkLookupTable> lut = vtkSmartPointer<vtkLookupTable>::New();
lut->SetRange(minValue, maxValue); // set range according to your data
mapper->SetLookupTable(lut);

vtkSmartPointer<vtkActor> actor = vtkSmartPointer<vtkActor>::New();
actor->SetMapper(mapper);

vtkSmartPointer<vtkScalarBarActor> scalarBar = vtkSmartPointer<vtkScalarBarActor>::New();
scalarBar->SetLookupTable(mapper->GetLookupTable());

vtkSmartPointer<vtkRenderer> renderer = vtkSmartPointer<vtkRenderer>::New();
renderer->AddActor(actor);
renderer->AddActor2D(scalarBar);
```

* 根据`dataset`的属性`location type`属性是`vetex`还是`element`，`mapper`调用`SetScalarModeToUsePointData`或者`SetScalarModeToUseCellData`；

## 颜色转换的另一种方式

使用`vtkColorTranslationFunction`转换：

```cpp
// Create a vtkColorTransferFunction to map scalar values to colors
vtkSmartPointer<vtkColorTransferFunction> colorTransferFunction = vtkSmartPointer<vtkColorTransferFunction>::New();
colorTransferFunction->AddRGBPoint(minScalarValue, r, g, b); // Add as many points as needed

// Set the color transfer function for the mapper
mapper->SetLookupTable(colorTransferFunction);
```
