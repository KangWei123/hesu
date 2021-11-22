<template>
  <div>
    <el-dialog :before-close="onBeforeCloseDialog" :visible.sync="dialogVisible" width="50%">
      <!-- <el-select placeholder="选择标签分类" style="width: 150px;" v-model="search.catagory">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in catagoryOptions"
          ></el-option>
      </el-select>-->

      <el-tabs @tab-click="onClickTab" v-model="activeTab">
        <el-tab-pane label="服务" name="serverLabel"></el-tab-pane>
        <el-tab-pane label="商品" name="goodLabel"></el-tab-pane>
      </el-tabs>

      <!-- 搜索框 keypress.native.enter-->
      <el-input
        @blur="onSearch"
        placeholder="关键字搜索"
        size="mini"
        style="margin-left: 20px; margin-bottom: 10px; width: 180px"
        v-model="search.name"
      ></el-input>
      <!-- 商品标签列表 -->
      <el-table :data="tableData" :row-key="getRowKeys" @selection-change="onSelect" ref="table" v-loading="loading">
        <el-table-column :reserve-selection="true" min-width="55" prop="id" type="selection"></el-table-column>
        <el-table-column label="商品标签" min-width="120" prop="label"></el-table-column>
        <el-table-column label="覆盖商品数" min-width="120" prop="coverNumber"></el-table-column>
        <!-- <el-table-column label="标签分类" prop="catagory" show-overflow-tooltip></el-table-column> -->
      </el-table>

      <el-pagination
        :current-page="page.index"
        :page-size="page.size"
        :total="page.total"
        @current-change="onPageChange"
        layout="prev, pager, next, jumper"
      ></el-pagination>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="onSave" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '@/mod-member/src/api/new-dmp';

  export default {
    name: 'ConditionTagDialog',
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogVisible = val;
        },
      },
      dialogVisible(newVal) {
        this.$emit('input', newVal);
      },
    },
    props: {
      value: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    data() {
      const typeEnum = {
        goodLabel: {
          type: 'good',
          value: 1,
          label: '商品',
        },
        serverLabel: {
          type: 'server',
          value: 0,
          label: '服务',
        },
      };
      return {
        dialogVisible: false,
        // tabs
        activeTab: 'serverLabel',
        typeEnum,
        tableData: [],
        search: {
          name: '',
          // catagory: ''
        },
        selectedList: [],
        page: {
          index: 1,
          total: 0,
          size: 10,
        },
        loading: false,
      };
    },
    methods: {
      // 获取 tableData 数据
      fetchData() {
        this.loading = true;
        this.tableData = [];
        api
          .getMerchantLabelTag({
            type: this.typeEnum[this.activeTab].value,
            label: this.search.name,
            pageNo: this.page.index,
            pageSize: this.page.size,
          })
          .then(_ => {
            _.data && _.data.length && (this.tableData = _.data);
            this.page.total = _.totalCount ? _.totalCount : 0;
          })
          .catch(e => {
            this.$message.error(e.errorMessage);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      onSave() {
        this.$emit('change', this.selectedList);
        this.dialogVisible = false;
      },
      onSelect(e) {
        this.selectedList = e;
      },
      onClickTab() {
        this.page.index = 1;
        this.page.total = 0;
        this.fetchData();
      },
      onSearch(e) {
        this.fetchData();
      },
      onPageChange(e) {
        this.page.index = e;
        this.fetchData();
      },
      // 记住分页已选项
      getRowKeys(row) {
        return row.id;
      },
      onBeforeCloseDialog(done) {
        done();
      },
    },
    mounted() {
      this.fetchData();
    },
  };
</script>
