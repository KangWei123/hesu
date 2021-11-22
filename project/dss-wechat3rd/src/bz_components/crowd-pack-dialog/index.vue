<template>
  <!-- dmp 人群包选择框 -->
  <el-dialog title="选择人群包" :visible.sync="packageVisible" class="crowd-pack-dialog">
    <div style="text-align: left" v-if="false">
      <span style="display: inline-block">关键词：</span>
      <el-input style="width: 220px" placeholder="请输入关键词" v-model.trim="keyword" clearable></el-input>
      <el-button class="search-button" type="primary" @click="onSearch">搜索</el-button>
    </div>
    <el-table
      class="crowd-pack-dialog-table"
      :cell-class-name="cellClassName"
      ref="table"
      :data="tableData"
      max-height="300"
      @select="handleSelectionChange"
      @select-all="handleSelectionChange"
    >
      <el-table-column class="select-col" type="selection" style="border: 1px solid red"></el-table-column>
      <el-table-column property="id" label="id" width="80"></el-table-column>
      <el-table-column property="name" label="人群名称" align="center"></el-table-column>
      <!-- <el-table-column
        property="condition"
        label="人群条件"
        align="center"
        show-overflow-tooltip
        width="300"
      ></el-table-column> -->
      <!--<el-table-column property="desc" align="center" :show-overflow-tooltip="true" label="人群说明"></el-table-column>-->
    </el-table>
    <!-- <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      :total="totalCount"
      :page-size="page.pageSize"
      :current-page="page.pageNo"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    ></el-pagination> -->

    <el-pagination
      v-if="totalCount"
      :hide-on-single-page="false"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      :page-size="page.pageSize"
      layout="sizes, prev, pager, next"
      :total="totalCount"
    >
    </el-pagination>
    <div slot="footer" class="package-list-footer">
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import services from '@/dss-common/utils/services';
  import { mapState } from 'vuex';
  export default {
    props: {
      value: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    computed: {
      ...mapState({
        app: 'curApp',
      }),
    },
    data() {
      return {
        tableData: [],
        loading: false,
        page: {
          keyword: '',
          pageNo: 1,
          pageSize: 10,
        },
        totalCount: 0,
        keyword: '',
        currentSelectList: [],
        packageVisible: false,
      };
    },
    methods: {
      cellClassName({ row, column, rowIndex, columnIndex }) {
        if (columnIndex == 0) {
          return 'select-col';
        }
      },
      onSearch() {
        this.page.keyword = this.keyword;
        this.page.pageNo = 1;
        this.fetchData();
      },
      fetchData() {
        console.log(this.app, 'app');
        this.loading = true;
        services
          // .get('/wp/am/strategy/crowd/list', {
          .get('/dw/cdp/crowd/my/list', {
            params: { ...this.page, myCollect: false, myCreate: false },
            action: '获取人群包',
          })
          .done(res => {
            this.tableData = res.data || [];
            // this.tableData = (res.data || []).map(item => {
            //   const criteria = JSON.parse(item.criteria);
            //   item.condition = criteria.reduce((prev, curr) => {
            //     if (curr.operator) {
            //       return prev + curr.foperator + ' ';
            //     }
            //     return prev + curr.fname + ': ' + curr.foperands.map(item => item.name).join('、') + '；';
            //   }, '');
            //   console.log(item.condition);
            //   return item;
            // });
            this.totalCount = res.totalCount;
            this.$nextTick(_ => {
              this.currentSelectList.forEach(item => {
                const index = this.tableData.findIndex(s => item.id === s.id);
                if (~index) {
                  this.$refs.table.toggleRowSelection(this.tableData[index]);
                }
              });
            });
          })
          .always(_ => {
            this.loading = false;
          });
      },
      onSizeChange(size) {
        this.page.pageSize = size;
        this.page.pageNo = 1;
        this.fetchData();
      },
      onPageChange(page) {
        this.page.pageNo = page;
        this.fetchData();
      },
      show() {
        this.currentSelectList = [...this.value];
        this.packageVisible = true;
        this.fetchData();
      },
      close() {
        this.packageVisible = false;
      },
      save() {
        this.$emit('input', this.currentSelectList);
        this.close();
      },
      compareArray(before, after) {
        const deleteList = [];
        const addList = [];
        const tableData = [];
        const currPageBeforeSelected = []; // 当前页修改前的选中项
        this.tableData.forEach(item => {
          tableData.push(item.id);
        });
        before.forEach(item => {
          tableData.includes(item) && currPageBeforeSelected.push(item);
        });
        currPageBeforeSelected.forEach(item => {
          !after.includes(item) && deleteList.push(item);
        });
        after.forEach(item => {
          !before.includes(item) && addList.push(item);
        });
        return {
          deleteList,
          addList,
        };
      },
      handleSelectionChange(e) {
        const data = e.map(item => {
          return {
            id: item.id,
            name: item.name,
          };
        });
        // 通过比较，获得此次操作新增和删除掉的选项(id)
        let { addList, deleteList } = this.compareArray(
          this.currentSelectList.map(item => item.id),
          data.map(item => item.id)
        );
        // 删掉本次删除的选项
        deleteList.forEach(item => {
          const index = this.currentSelectList.findIndex(s => s.id === item);
          if (~index) {
            this.currentSelectList.splice(index, 1);
          }
        });
        // 添加本次添加
        addList = data.filter(item => addList.includes(item.id));
        this.currentSelectList = [...this.currentSelectList, ...addList];
        console.log('currentSelectList:', this.currentSelectList);
        // this.$emit('selected', this.currentSelectList);
      },
    },
  };
</script>

<style lang="less">
  .crowd-pack-dialog {
    .crowd-pack-dialog-table {
      th {
        .cell {
          text-overflow: clip;
        }
      }
    }
    .search-button {
      margin-left: 10px;
    }
    .package-list-footer {
      text-align: center;
      .el-button--primary {
        width: 120px;
        // height: 30px;
        height: 36px;
        padding: 0;
        // line-height: 30px;
        line-height: 36px;
        // background: rgba(56, 121, 251, 1);
        // border-radius: 15px;
      }
    }
  }
  // cell样式被全局污染，造成选择列也会展示省略字符，此处单独做处理
  .select-col {
    .cell {
      text-overflow: unset !important;
    }
  }
</style>
