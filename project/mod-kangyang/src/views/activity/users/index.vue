<template>
  <list-page-layout>
    <template #filters>
      <el-form inline ref="form" :model="query">
        <el-form-item label="活动" prop="activityKeyWord"
          ><el-input v-model="query.activityKeyWord" class="form-control" placeholder="请输入活动名称或ID" clearable
        /></el-form-item>

        <el-form-item label="会员" prop="applicantKeyWord"
          ><el-input
            v-model="query.applicantKeyWord"
            class="form-control"
            placeholder="请输入会员名称或手机号"
            clearable
        /></el-form-item>

        <el-form-item label="签到状态" prop="signInStatus"
          ><el-select v-model="query.signInStatus" class="form-control" placeholder="请选择" clearable>
            <el-option :value="1" label="已签到"></el-option>
            <el-option :value="0" label="未签到"></el-option> </el-select
        ></el-form-item>

        <el-form-item label="是否取消" prop="isCancel"
          ><el-select v-model="query.isCancel" class="form-control" placeholder="请选择" clearable>
            <el-option :value="true" label="是"></el-option>
            <el-option :value="false" label="否"></el-option> </el-select
        ></el-form-item>

        <el-form-item label="活动范围" prop="projectId">
          <el-select v-model="query.projectId" placeholder="请选择" clearable>
            <el-option v-for="item in allProjects" :key="item.id" :label="item.prjName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button @click="$refs.form.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #sub-actions>
      <div class="actions">
        <export-button type="primary" :params="getExportParams">导出</export-button>
      </div>
    </template>

    <fat-table ref="table" :state.sync="query" :fetch-handler="handleFetch">
      <el-table-column label="序号" width="100" prop="idx"></el-table-column>
      <el-table-column label="活动标题" prop="activityName"></el-table-column>
      <el-table-column label="活动ID" prop="activityCode"></el-table-column>
      <el-table-column label="活动范围" prop="prjScopeName"></el-table-column>
      <el-table-column label="报名时间" prop="createTime"></el-table-column>
      <el-table-column label="下单人" v-slot="scope">
        <div>
          <div>{{ scope.row.orderUserName }}</div>
          <div>{{ scope.row.orderUserPhone }}</div>
        </div>
      </el-table-column>
      <el-table-column label="参与人" v-slot="scope">
        <div>
          <div>{{ scope.row.name }}</div>
          <div>{{ scope.row.phone }}</div>
        </div>
      </el-table-column>

      <el-table-column label="签到时间" prop="writeOffTime" :formatter="formatEmptyText"></el-table-column>
      <el-table-column label="核销码" prop="signInNo" :formatter="formatEmptyText"></el-table-column>
      <el-table-column label="签到状态" v-slot="scope">
        <span v-if="scope.row.signInStatus == 1" class="font-sign">已签到</span>
        <span v-if="scope.row.signInStatus == 0">未签到</span>
      </el-table-column>
      <el-table-column label="是否取消" v-slot="scope">
        {{ scope.row.isCancel ? '是' : '否' }}
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { FatTable, ListPageLayout } from '@/dss-common/components/list-page/index';
  import { DepartmentSelect } from '@/mod-kangyang/shared/components';
  import ExportButton from '@/dss-common/components/export-button';
  import { activityApi, projectApi } from '@/mod-kangyang/src/api';
  import { formatEmptyTextInTable, addIdxToListItem } from '@/mod-kangyang/src/utils';

  export default {
    name: 'UserList',
    components: {
      DepartmentSelect,
      FatTable,
      ExportButton,
      ListPageLayout,
    },
    data() {
      return {
        allProjects: [],
        query: {
          activityKeyWord: null,
          applicantKeyWord: null,
          signInStatus: null,
          projectId: null,
        },
      };
    },
    mounted() {
      this.getProjects();
    },
    methods: {
      formatEmptyText() {
        const str = arguments[2];
        return formatEmptyTextInTable(str);
      },
      handleSubmit() {
        this.$refs.table.search();
      },
      getExportParams() {
        return { url: activityApi.EXPORT_USER_URL, data: this.query, withFileName: true };
      },
      async handleFetch(params) {
        const { currentPage: pageNo, pageSize } = params.pagination;
        const payload = {
          ...this.query,
          pageNo,
          pageSize,
        };

        Object.keys(payload).forEach(key => {
          const value = payload[key];
          if (!value && typeof value !== 'boolean') {
            delete payload[key];
          }
        });

        let { data, totalCount } = await activityApi.userList(payload);
        data = data || [];

        return {
          list: addIdxToListItem(data, pageNo, pageSize),
          total: totalCount,
        };
      },
      async getProjects() {
        const { data } = await projectApi.getSimpleList();
        this.allProjects = data;
      },
    },
  };
</script>

<style lang="less" scoped>
  .form-control {
    width: 200px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    padding-right: 24px;
  }

  .font-sign {
    color: #2e8dff;
  }
</style>
