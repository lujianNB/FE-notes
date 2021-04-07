<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: vue中使用elementui表格动态合并数据
 * @Date: 2021-03-17 10:16:30
 * @LastEditTime: 2021-03-17 10:16:30
-->
# vue中使用elementui表格动态合并数据

直接贴代码了有注释

```
<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: 运行诊断表格
 * @Date: 2020-12-11 14:26:57
 * @LastEditTime: 2021-03-17 10:14:53
-->
<template>
  <div class="lj-run-diagnostics-table">
    <div class="title">运行指导</div>
    <div class="table">
      <el-table
        :data="newTableData"
        :span-method="objectSpanMethod"
        max-height="280"
        header-row-class-name="lj-table-header"
        row-class-name="lj-table-row"
        style="width: 100%; margin-top: 20px"
        v-loading="loading"
        :empty-text="emptyText"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 113, 255, 0.5)"
      >
        <el-table-column
          prop="param"
          label="参数名称"
          width="150"
          class-name="oneCol"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="group"
          label="机组"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="planVal"
          label="设计值"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="targetVal"
          label="目标值"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="factVal"
          label="实际值"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="desc"
          label="热耗率影响"
          align="center"
          header-align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template>
            <el-button size="mini">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "runDiagnosticsTable",

  data() {
    return {
      spanArr: [], //遍历数据时，根据相同的标识去存储记录
      pos: 0, // 二维数组的索引
    };
  },

  props: {
    loading: {
      type: Boolean,
      default: true,
    },

    emptyText: {
      type: String,
      default: " ",
    },

    tableData: {
      type: Array,
      default: () => {},
    },
  },

  computed: {
    newTableData() {
      let arr = [];
      this.tableData.forEach((item) => {
        arr = [...arr, item.param];
      });
      arr = Array.from(new Set(arr));
      let newArr = [];
      arr.forEach((item) => {
        this.tableData.forEach((ele) => {
          if (ele.param === item) newArr = [...newArr, ele];
        });
      });
      this.mergeSpan(newArr);
      return newArr;
    },
  },

  mounted() {},

  methods: {
    // 合并行
    mergeSpan(data) {
      let that = this;
      //页面展示的数据，不一定是全部的数据，所以每次都清空之前存储的 保证遍历的数据是最新的数据。以免造成数据渲染混乱
      that.spanArr = [];
      that.pos = 0;
      //遍历数据
      data.forEach((item, index) => {
        //判断是否是第一项
        if (index === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          //不是第一项时，就根据标识去存储
          if (data[index].param === data[index - 1].param) {
            // 查找到符合条件的数据时每次要把之前存储的数据+1
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            // 没有符合的数据时，要记住当前的index
            this.spanArr.push(1);
            this.pos = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 页面列表上 表格合并行 -> 第几列(从0开始)
      // 需要合并多个单元格时 依次增加判断条件即可
      if (columnIndex === 0) {
        // 二维数组存储的数据 取出
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
        //不可以return {rowspan：0， colspan: 0} 会造成数据不渲染， 也可以不写else，eslint过不了的话就返回false
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.lj-run-diagnostics-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    color: #ddefff;
  }
  .table {
    width: 100%;
    flex: 1;
  }
}
</style>

<style lang="scss">
.lj-run-diagnostics-table {
  .el-table {
    margin-top: 10px !important;
    td.oneCol {
      border-right: 1px solid #0071ff !important;
      background: rgba(0, 113, 255, 0.2);
    }
  }
  .lj-table-header {
    background: rgba(0, 113, 255, 0.5) !important;
    height: 50px !important;
    > th {
      padding: 0;
      font-size: 12px;
      font-family: Source Han Sans CN;
      color: #b7ddff;
      border-bottom: 1px solid #0071ff !important;
    }
  }
  .lj-table-row {
    background: rgba(0, 113, 255, 0.2) !important;
    height: 50px !important;
    > td {
      padding: 0;
      font-size: 12px;
      font-family: Source Han Sans CN;
      color: #b7ddff;
      border-bottom: 1px solid #0071ff !important;
    }
  }
  .el-table::before {
    content: none !important;
  }
}
</style>
```