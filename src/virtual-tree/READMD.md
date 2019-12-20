## 虚拟树控件

| 参数 | 含义 |
|:---- | ---- |
| data | 数据列表，数据结构参考 Item 定义 |
| checkable | 是否显示多选框 |
| loadData | 节点展开回调，第一次回调，返回promise通知节点子节点数据加载完成 |
| cascade | 节点选中操作是否级联 |
| dropdown | 展示方式: 列表和下拉选择, 默认列表 |
| showSearch | 是否展示搜索框 |
| allowClear | 是否展示清除按钮 |
| labelFormate | 定制回填样式 |
| onChange | 选择数据后回调 |

### 列表数据项（Item）
| 参数 | 含义 |
|:---- | ---- |
| label | 展示内容 |
| key | 节点唯一标识 |
| selectable | 节点是否可以选中 | 
| disabled | 是否禁用节点 |
