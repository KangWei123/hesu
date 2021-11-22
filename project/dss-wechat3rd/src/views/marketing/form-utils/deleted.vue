<template>
  <div class="form-wrap">
    <div class="toolbar">
      <el-form inline>
        <el-form-item>  
          <search-input
            v-model="search.formName"
            placeholder="请输入表单名称"
            clearable
            @search="onSearch"
            style="width: 280px"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="form-list">
      <el-table :data="tableData" v-loading="loading.list || loading.delete">
        <el-table-column label="表单名称" prop="name" />
        <el-table-column label="总提交数" prop="submitTotal">
          <div slot-scope="scope">{{ scope.row.submitTotal }}条</div>
        </el-table-column>
        <el-table-column label="创建人">
          <div slot-scope="scope">
            {{ scope.row.employeeName }}
            {{ scope.row.employeeName ? `(${scope.row.positionName})` : scope.row.positionName }}
          </div>
        </el-table-column>
        <el-table-column label="操作" prop="id" align="center">
          <div slot-scope="scope">
            <a @click="toSubmitData(scope.row)">数据</a>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalCount"
        :page-size.sync="pagination.pageSize"
        :current-pagination.sync="pagination.pageNo"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { queryFormList, copyForm, deleteForm } from './api/form';
import dateUtils from '@/dss-common/utils/date.js';
import SearchInput from '@/dss-wechat3rd/src/components/search-input';

export default {
  components: { SearchInput },
  data() {
    return {
      downloadList: [],
      tableData: [],
      pagination: {
        pageSize: 10,
        pageNo: 1
      },
      totalCount: 0,
      search: {
        formName: ''
      },
      loading: {
        list: false,
        status: false,
        delete: false
      },
      currentStatus: null
    };
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     vm.fetchData();
  //   });
  // },

  mounted() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      try {
        this.loading.list = true;
        const res = await queryFormList({
          ...this.pagination,
          ...this.search,
          deleted: true
        });
        this.tableData = res.data;
        this.totalCount = res.totalCount;
      } catch (e) {
        this.$message({ type: 'error', message: e.message });
      } finally {
        this.loading.list = false;
      }
    },

    onSearch() {
      this.pagination.pageNo = 1;
      this.fetchData();
    },

    onSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.fetchData();
    },

    onPageChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.fetchData();
    },

    toSubmitData(row) {
      this.$router.push('/marketing/form-utils/deleted/submit-data?id=' + row.id);
    }
  }
};
</script>

<style lang="less" scoped>
.page-header {
  width: 100%;
  height: 50px;
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #333;
}
.add-btn {
  float: right;
  margin-left: auto;
}

.toolbar {
  background: #ffffff;
  box-shadow: 0px 2px 6px -2px rgba(0, 0, 0, 0.06);
  border-radius: 0px 0px 4px 4px;
  padding: 16px 20px 0;
  display: flex;
  margin-bottom: 16px;
}

.form-list {
  .bg-mixin;
  border-radius: 4px;
  padding-bottom: 20px;
}
</style>
