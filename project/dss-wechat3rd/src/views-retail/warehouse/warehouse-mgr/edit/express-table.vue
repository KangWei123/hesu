<template>
  <div class="express-table">
    <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%;margin:0;">
      <el-table-column prop="row" label="品类" align="center" width="120"> </el-table-column>
      <el-table-column
        prop="row2"
        align="center"
        width="120"
        :render-header="renderheader"
        label="订单金额M/(不含折扣)"
      >
      </el-table-column>
      <el-table-column
        prop="row3"
        align="center"
        width="140"
        :render-header="renderheader"
        label="基础运费/(配送距离≤1km)"
      >
      </el-table-column>
      <el-table-column
        prop="row4"
        align="center"
        width="180"
        :render-header="renderheader"
        label="每公里运费加价/(1km<配送距离≤3km)"
      >
      </el-table-column>
      <el-table-column
        prop="row5"
        align="center"
        width="180"
        :render-header="renderheader"
        label="每公里运费加价/(3km<配送距离≤5km)"
      >
      </el-table-column>
      <el-table-column prop="row6" align="center" width="180" label="备注"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'expressTable',
  data() {
    return {
      tableData: [
        {
          row: '餐饮',
          row2: '0<M≤50',
          row3: '5.0',
          row4: '1.0',
          row5: '2.0',
          row6: `1、可配送距离不能超过5km; 
          2、22:00-8:00的订单，每单增加2元的夜间费;`
        },
        {
          row: '餐饮',
          row2: '50<M≤200',
          row3: 'Mx10%',
          row4: '1.0',
          row5: '2.0',
          row6: '1'
        },
        {
          row: '餐饮',
          row2: '200<M',
          row3: '20.0',
          row4: '1.0',
          row5: '2.0',
          row6: ''
        },
        {
          row: '商超',
          row2: '0<M≤63',
          row3: '5.0',
          row4: '1.0',
          row5: '2.0',
          row6: '1'
        },
        {
          row: '商超',
          row2: '63<M≤200',
          row3: 'Mx8%',
          row4: '1.0',
          row5: '2.0',
          row6: '1'
        },
        {
          row: '商超',
          row2: '200<M',
          row3: '16.0',
          row4: '1.0',
          row5: '2.0',
          row6: '1'
        },
        {
          row: '水果生鲜',
          row2: '0<M≤60',
          row3: '6.0',
          row4: '1.0',
          row5: '2.0',
          row6: ''
        },
        {
          row: '水果生鲜',
          row2: '60<M≤300',
          row3: 'Mx10%',
          row4: '1.0',
          row5: '2.0',
          row6: ''
        },
        {
          row: '水果生鲜',
          row2: '300<M',
          row3: '30',
          row4: '1.0',
          row5: '2.0',
          row6: ''
        },
        {
          row: '其他',
          row2: '-',
          row3: '6.0',
          row4: '1.0',
          row5: '2.0',
          row6: ''
        },
        {
          row: '蛋糕',
          row2: '-',
          row3: '10.0',
          row4: '0.0',
          row5: '2.0',
          row6: ''
        },
        {
          row: '酒品',
          row2: '-',
          row3: '10.0',
          row4: '0.0',
          row5: '2.0',
          row6: ''
        },
        {
          row: '鲜花',
          row2: '-',
          row3: '15.0',
          row4: '2.0',
          row5: '2.0',
          row6: ''
        }
      ]
    };
  },
  computed: {},
  methods: {
    renderheader(h, { column, $index }) {
      return h('span', {}, [
        h('span', {}, column.label.split('/')[0]),
        h('br'),
        h('span', {}, column.label.split('/')[1])
      ]);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if ([0, 3, 6].indexOf(rowIndex) !== -1) {
          return {
            rowspan: 3,
            colspan: 1
          };
        }
        if ([1, 2, 4, 5, 7, 8].indexOf(rowIndex) !== -1) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
      if (columnIndex === 3 || columnIndex === 4) {
        if (rowIndex === 0) {
          return {
            rowspan: 10,
            colspan: 1
          };
        }
        if (rowIndex > 0 && rowIndex <= 9) {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
      if (columnIndex === 5) {
        if (rowIndex === 0) {
          return {
            rowspan: 13,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>
<style lang="less">
.express-table {
  .el-table .cell {
    white-space: pre-line;
  }
  .el-table .el-table__body .cell {
    padding: 5px;
  }
  .el-table__row td:nth-child(6) {
    text-align: left;
  }
}
.wkt-body .express-table .el-table .el-table__body td:first-child {
  border-left: none;
}
.wkt-body .express-table .el-table th:first-child {
  border-left: none;
}
.wkt-body .express-table .el-table th {
  border-top: none;
}
</style>
