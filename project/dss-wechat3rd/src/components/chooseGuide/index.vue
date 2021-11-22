<template>
  <el-dialog :visible.sync="dialogVisible" ref="chooseGuide" width="800px" :before-close="handleClose">
    <span>选择导购</span>
    <el-select
      placeholder="全部门店"
      size="mini"
      default-first-option
      v-model="chooseStore"
      @change="changeStore"
      filterable
      clearable
    >
      <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"> </el-option>
    </el-select>
    <el-input
      size="mini"
      style="width:222px"
      placeholder="请输入导购姓名或导购手机号"
      v-model.trim="keyword"
    ></el-input>
    <el-button
      size="mini"
      type="primary"
      @click="
        pageNo = 1;
        getShopGuideList();
      "
      >搜索</el-button
    >
    <el-table
      :data="tableData"
      v-loading="loading"
      select-all="selectAll"
      stripe
      ref="staffTable"
      class="wkt-table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="cropName" label="导购名称"> </el-table-column>
      <el-table-column prop="storeName" label="门店"> </el-table-column>
      <el-table-column prop="positionName" label="角色"> </el-table-column>
    </el-table>
    <el-pagination
      class="wkt-pagination"
      @size-change="onPageSizeChange"
      @current-change="onPageNumChange"
      :current-page="pageNo"
      :page-size="pageSize"
      :page-sizes="[5, 10, 15, 50, 100]"
      layout="prev, pager, next, jumper, sizes, total"
      v-if="totalCount"
      :total="totalCount"
    >
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import server from '../../api/settings';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
const unionKeys = ['id'];
export default {
  name: 'idnex',
  mixins: [tableCheckedHelperMixin],
  data() {
    return {
      dialogVisible: false,
      chooseStore: '',
      keyword: '',
      tableData: [],
      pageNo: 1,
      pageSize: 5,
      totalCount: null,
      loading: false,
      multipleSelection: []
    };
  },

  computed: {
    ...mapState({
      storeList: 'storeList'
    })
  },
  methods: {
    handleClose() {
      this.close();
    },
    open(val) {
      this.dialogVisible = true;
      this.multipleSelection = val;
      console.log(this.multipleSelection);
      this.getShopGuideList();

      /*this.mBuildMultipleTableSelection(this.tableData, 'staffTable', unionKeys);*/
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeStore() {
      this.getShopGuideList();
    },
    onPageSizeChange(val) {
      this.pageSize = val;
      this.getShopGuideList();
    },
    onPageNumChange(val) {
      this.pageNo = val;
      this.getShopGuideList();
    },
    getShopGuideList() {
      this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);
      this.loading = true;
      const data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        keyword: this.keyword,
        storeId: this.chooseStore,
        positionIds: 'common_role_storeKeeper,common_role_sales'
      };
      server
        .getShopGuide(data)
        .then(res => {
          if (res.success) {
            this.tableData = res.data;
            this.totalCount = res.totalCount;
            this.mBuildMultipleTableSelection(this.tableData, 'staffTable', unionKeys);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    close() {
      this.dialogVisible = false;
    },
    confirm() {
      this.close();
      this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);
      this.$emit('shopGuideList', this.mTotalCheckedList);
    }
  },
  selectAll() {
    this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, unionKeys);
  }
};
</script>

<style scoped></style>
