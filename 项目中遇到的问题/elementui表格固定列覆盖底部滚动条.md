<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: elementui表格固定列覆盖底部滚动条
 * @Date: 2021-05-25 15:14:09
 * @LastEditTime: 2021-05-25 15:17:45
-->
# elementui表格固定列覆盖底部滚动条

**在进行elementui表格固定列的时候，会出现覆盖住底部滚动条的问题**

## 解决方案

```
.el-table .el-table__fixed {
    height: auto !important;
    bottom: 8px;
}
```