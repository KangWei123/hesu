<template>
  <el-dialog :visible.sync="dialogVisible"
             width="800px"
             title="选择表单"
             class="formUtils"
             @close="onClose">

    <div class="form-wrap">
      <div class="toolbar">
        <search-input
          v-model="search.formName"
          placeholder="请输入表单名称"
          clearable
          @search="onSearch"
          style="width: 280px"
        />
        <el-button type="primary" class="add-btn" @click="onAdd">新建表单</el-button>
      </div>
      <div class="form-list">
        <el-table :data="tableData" v-loading="loading.list || loading.delete">
          <el-table-column label="表单名称" prop="name" />
          <el-table-column label="提交数" prop="submitTotal">
            <div slot-scope="scope">{{ scope.row.submitTotal }}条</div>
          </el-table-column>
          <el-table-column label="创建人">
            <div slot-scope="scope">
              {{scope.row.employeeName}} {{scope.row.employeeName? `(${scope.row.positionName})` : scope.row.positionName}}
            </div>
          </el-table-column>
          <el-table-column label="操作" prop="id" align="center">
            <div slot-scope="scope">
              <el-button type="primary" class="add-btn" @click="onChoose(scope.row)" size="mini">选择</el-button>
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
  </el-dialog>
</template>

<script>
import { queryFormList } from '../../form-utils/api/form';
import SearchInput from '@/dss-wechat3rd/src/components/search-input';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';

export default {
  components: { SearchInput },
  mixins: [AdapterIfr.AdapterMixins],
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      pagination: {
        pageSize: 5,
        pageNo: 1
      },
      totalCount: 0,
      search: {
        formName: '',
        queryEmployee: true
      },
      loading: {
        list: false,
        status: false,
        delete: false
      },
      currentStatus: null
    };
  },

  methods: {
    async fetchData() {
      try {
        this.loading.list = true;
        const res = await queryFormList({
          ...this.pagination,
          ...this.search
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

    onChoose(row) {
      this.$emit('changeChooseForm', row);
      this.onClose();
    },

    onAdd() {
      this.$router.push('/marketing/form-utils/list/edit');
      this.adapterIfmMask(false);
    },

    show() {
      this.pagination.pageNo = 1;
      this.pagination.pageSize = 5;
      this.totalCount = 0;
      this.dialogVisible = true;
      this.fetchData();
    },

    onClose() {
      this.dialogVisible = false;
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
  margin-left: auto;
}
.toolbar {
  display: flex;
}

.formUtils{
  /deep/ .el-dialog__body{
    padding-top: 0;
  }
}
</style>
