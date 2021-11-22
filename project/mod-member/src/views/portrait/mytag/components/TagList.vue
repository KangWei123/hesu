<template>
  <div class="merchant-tag-wrapper">
    <el-table :data="tableData" @filter-change="onFilterChange" style="width: 100%" v-loading="ifLoading">
      <el-table-column label="标签名称" min-width="100px" prop="name">
        <template slot-scope="scope">
          {{ scope.row.name }}
          <el-tag size="mini" v-if="!ifMerchantTag && scope.row.tagVersion != 2">旧版</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标签类型" min-width="120px" prop="type"></el-table-column>
      <el-table-column align="center" label="会员数" min-width="100px" prop="memberCount"></el-table-column>
      <!-- 描述或条件 -->
      <el-table-column
        key="description"
        label="标签描述"
        prop="description"
        v-if="!ifMerchantTag && tableType === 'conditionTag'"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column key="description" label="标签描述" min-width="200px" prop="description" v-else>
        <template slot-scope="scope">
          <span :title="scope.row.description">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <!-- 分类或更新时间 -->
      <el-table-column
        :filters="tableCatagoryFilterOptions"
        column-key="categoryName"
        key="categoryName"
        label="标签分类"
        prop="categoryName"
        v-if="ifMerchantTag"
      ></el-table-column>
      <el-table-column key="timestamp" label="更新时间" min-width="80px" prop="timestamp" v-else></el-table-column>
      <!-- operation -->
      <el-table-column align="center" label="操作" min-width="80px" width="200">
        <template slot-scope="scope">
          <el-button @click="onDetail(scope.row)" size="small" type="text">详情</el-button>
          <a @click="onDelete(scope.row)" size="small" class="del-btn" type="text">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <el-pagination
      :current-page.sync="page.index"
      :page-size="page.size"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :total="page.total"
      @current-change="onChangeIndex"
      @size-change="handleSizeChange"
      background
      class="pagination"
      layout="prev, pager, next, jumper, sizes, total"
      style="margin-top: 10px"
    ></el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'TagList',
    computed: {
      // 表格类型 merchantTag 或 conditionTag
      ifMerchantTag() {
        return this.tableType === 'merchantTag';
      },
      // page 分页
      page() {
        return {
          index: this.pageIndex,
          size: this.pageSize,
          total: this.pageTotal,
        };
      },
    },
    props: {
      // 标签分类类型
      tableCatagoryFilterOptions: {
        type: Array,
      },
      // 表格类型 merchantTag or conditionTag
      tableType: {
        type: String,
        required: true,
      },
      // 数据源
      tableData: {
        type: Array,
        required: true,
      },
      // 分页
      pageIndex: {
        type: Number,
        default: 1,
      },
      pageSize: {
        type: Number,
        default: 10,
      },
      pageTotal: {
        type: Number,
      },
      // loading
      ifLoading: {
        type: Boolean,
        default: false,
      },
    },
    mounted() {
      console.log(this.tableData, 'tableData');
    },
    methods: {
      // 操作
      onDetail(row) {
        if (this.ifMerchantTag) {
          console.log(this.ifMerchantTag, '--');
          // this.$router.push({
          //   path: '/portrait/manage/myTag/old',
          //   query: { id: row.id, type: row.type }
          // })
          this.$router.push({
            path: '/portrait/manage/myTag/new',
            query: { id: row.id, type: row.type },
          });
        } else {
          if (row.tagVersion == 1) {
            console.log('11111');
            this.$router.push({
              path: '/portrait/manage/myTag/new',
              query: { id: row.id, type: row.type, flag: 'true' },
            });
          } else {
            this.$router.push({
              path: '/portrait/manage/myTag/new',
              query: { id: row.id, type: row.type, flag: 'false' },
            });
          }
        }
      },
      onDelete(row) {
        this.$emit('delete', row.id);
      },
      // 标签分类的筛选函数
      onFilterChange(filters) {
        this.$emit('filter', filters.category);
      },
      // 标签分类获取类型名称
      getCatagoryName(scope) {
        return this.tableCatagoryFilterOptions.filter(item => item.value === scope.row.catagory)[0].text;
      },
      // 页码更新
      onChangeIndex(index) {
        this.$emit('change', index);
      },
      // 每页显示数量切换
      handleSizeChange(e) {
        this.$emit('page-size-change', e);
      },
    },
  };
</script>

<style lang="less" scoped>
  // ! 解决样式冲突
  /deep/ .el-tag {
    color: #409eff !important;
    border: 1px solid rgba(64, 158, 255, 0.2) !important;
    background: none !important;
    background-color: rgba(64, 158, 255, 0.1) !important;
  }

  .del-btn {
    cursor: pointer;
  }
</style>
