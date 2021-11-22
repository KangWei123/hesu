<template>
  <div class="page-wrapper">
    <el-breadcrumb separator="/"
                  class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: isDeleted ? '/marketing/form-utils/deleted' : '/marketing/form-utils/list'}">{{isDeleted ? '已删除' : '表单列表'}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/marketing/form-utils/' + (isDeleted ? 'deleted' : 'list') + '/submit-data?id=' + formId}">数据</el-breadcrumb-item>
      <el-breadcrumb-item >表单数据</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="page-toolbar">
      <el-form inline>
        <el-form-item label="提交时间：">
          <el-date-picker
            v-model="commitTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changeDateRange"
          ></el-date-picker>
        </el-form-item>
        <el-button class="form-btn" @click="exportData(false)" v-if="totalCount" :disabled="loading.list">批量导出</el-button>
        <el-button class="form-btn" @click="exportData(true)" v-if="totalCount" :disabled="loading.list">一键导出</el-button>
      </el-form>
    </div>
    
    <main class="page-container">
      <el-table :data="tableData" v-loading="loading.list" ref="form-data-table" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-for="fieldset in widgetValue" :key="fieldset.key" :label="fieldset.label">
          <div slot-scope="scope">
            {{ scope.row[fieldset.key] }}
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        hide-on-single-page
        :total="totalCount"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      ></el-pagination>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { querySubmitList, queryForm } from './api/form';
import dateUtil from '@/dss-common/utils/date.js';
import excel from '@/dss-common/utils/excel.js';
import tableCheckerHelper from '@/dss-common/mixins/table-checked-helper.js';
export default {
  mixins: [tableCheckerHelper],
  data() {
    return {
      isDeleted: this.$route.path.indexOf('deleted') > 0,
      commitTime: null,
      tableData: [],
      totalData: [],
      multipleSelection: [],
      widgetValue: [],

      pagination: {
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0,
      loading: {
        list: false
      }
    };
  },
  filters: {
    format(time) {
      let date = new Date(time);
      return date ? dateUtil.format(date) : '';
    }
  },
  methods: {
    async initialTable() {
      try {
        this.loading.list = true;
        const res = await queryForm({
          formId: this.formId,
          deleted: this.isDeleted
        });
        const widgetValue = [
          { label: '表单ID', key: 'id' },
          { label: '表单提交时间', key: 'createTime' }
        ];
        JSON.parse(res.data.formBody || '[]').forEach((item, index) => {
          widgetValue.push({
            ...item,
            key: item.uuid,
            options: item.options && item.options.map(o => o.label),
            // 已经保存的组件不允许删除，只允许修改
            remote: true
          });
        });
        this.widgetValue = widgetValue;
        await this.fetchData();
      } catch (e) {
        this.$message({ type: 'message', message: e.message });
      } finally {
        this.loading.list = false;
      }
    },

    async fetchData(isAll) {
      try {
        this.loading.list = true;
        this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, ['id']);
        const res = await querySubmitList({
          ...this.pagination,
          formId: this.formId,
          startDate: this.commitTime && this.commitTime[0] + ' 00:00:00',
          endDate: this.commitTime && this.commitTime[1] + ' 23:59:59',
          queryAll: isAll,
          isStoreForm:
            this.roleList &&
            (this.roleList.indexOf('common_role_storeKeeper') !== -1 ||
              this.roleList.indexOf('common_role_operator') !== -1)
        });
        if (!isAll) {
          this.totalCount = res.totalCount; //查询全部数据时接口不返回 totalCount
        }
        const list = (res.data || []).map(item => {
          const formContent = JSON.parse(item.submitFormBody);
          const tableItem = {
            id: item.id,
            createTime: item.createTime ? dateUtil.format(new Date(item.createTime)) : ''
          };
          formContent.forEach(contentItem => {
            tableItem[contentItem.uuid] = contentItem.value;
          });
          return tableItem;
        });
        if (isAll) {
          this.totalData = list;
        } else {
          this.tableData = list;
        }
        this.mBuildMultipleTableSelection(this.tableData, 'form-data-table', ['id']);
      } catch (e) {
        console.log(e);
      } finally {
        this.loading.list = false;
      }
    },

    async exportData(isAll) {
      this.mUpdateTotalListBySelection(this.tableData, this.multipleSelection, ['id']);
      if (!isAll && !this.multipleSelection.length) {
        this.$message.error('请选择批量导出的数据');
        return;
      }
      let confirmTip = [
        { title: '导出选中数据', msg: '确定导出当前选中的表单数据项吗?' },
        { title: '导出全部数据', msg: '确定导出全部符合筛选条件的表单数据项吗?' }
      ];
      let confirm = await this.$confirm(confirmTip[+isAll].msg, confirmTip[+isAll].title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning',
        customClass: 'wkt-warning'
      });
      try {
        if (isAll && !this.totalData.length) {
          await this.fetchData(true);
        }
        const loadingTip = this.$message.warning({
          message: '正在导出数据，请耐心等待......'
        });
        excel.export2Excel(
          this.widgetValue,
          isAll ? this.totalData : this.multipleSelection,
          '表单数据',
          loadingTip => {
            loadingTip.close();
          }
        );
      } catch (err) {
        this.$message.error('导出数据失败');
      }
    },

    changeDateRange() {
      this.totalData = [];
      this.fetchData();
    },

    onSelectionChange(val) {
      this.multipleSelection = val;
    },

    onPageSizeChange(val) {
      this.pagination.pageSize = val;
      this.fetchData();
    },

    onPageChange(val) {
      this.pagination.pageNo = val;
      this.fetchData();
    }
  },
  computed: {
    formId() {
      return this.$route.query.id;
    },
    ...mapState({
      roleList: 'roleList'
    })
  },
  mounted() {
    this.initialTable();
  }
};
</script>

<style lang="less" scoped>
.form-btn {
  float: right;
  margin-left: 15px;
}

.page-toolbar {
  background: #ffffff;
  box-shadow: 0px 2px 6px -2px rgba(0, 0, 0, 0.06);
  border-radius: 0px 0px 4px 4px;
  padding: 16px 20px 0;
  margin-bottom: 16px;
}

.page-container {
  .bg-mixin;
  border-radius: 4px;
  padding-bottom: 20px;
}

</style>
