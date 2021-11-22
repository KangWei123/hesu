<template>
  <list-page-layout class="app-list-container">
    <template #main-actions>
      <el-button type="primary" @click="handleAddNewApp">+ 新增应用</el-button>
    </template>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline>
        <el-form-item label="应用名称" prop="appName">
          <el-input
            prefix-icon="el-icon-search"
            placeholder="搜索应用"
            v-model.trim="form.appName"
            :maxlength="32"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="业态名称" prop="industryId">
          <industry-select v-model="form.industryId"></industry-select>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" selectable row-key="id">
      <el-table-column label="应用图标" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.logo" class="app-logo" />
        </template>
      </el-table-column>
      <el-table-column label="应用名称" width="200" prop="appName"></el-table-column>
      <el-table-column label="对应业态" width="150" prop="packageName"></el-table-column>
      <el-table-column label="appId" width="150" prop="id"></el-table-column>
      <el-table-column label="管理员" width="210">
        <template slot-scope="scope">
          <div><span class="user-label">用户名：</span>{{ scope.row.adminName }}</div>
          <div><span class="user-label">手机号：</span>{{ scope.row.adminPhone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="210" prop="createName">
        <template slot-scope="scope">
          <div><span class="user-label">创建人：</span>{{ scope.row.creatorName }}</div>
          <div><span class="user-label">联系方式：</span>{{ scope.row.creatorPhone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" prop="createTime">
        <span slot-scope="scope">{{ scope.row.createTime | time }}</span>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="left" min-width="240" v-slot="scope">
        <table-actions
          :options="[
            { name: '编辑', onClick: () => handleEditNewApp(scope.row) },
            { name: '管理员设置', onClick: () => handleSetAppAccount(scope.row) },
          ]"
        />
      </el-table-column>
    </fat-table>
    <add-app-dialog v-model="showAddDialog" :app-info="curEditApp" @done="handleSearchApp"></add-app-dialog>
    <app-account-dialog v-model="showAccountDialog" :app-info="curEditApp" @done="handleSearchApp"></app-account-dialog>
  </list-page-layout>
</template>

<script>
  import { listApp } from '@/mod-org/src/api/appApi';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import IndustrySelect from '@/business-common/components/industry-select/index';
  import AddAppDialog from './components/add-app-dialog';
  import AppAccountDialog from './components/app-account-dialog';

  /**
   * 会员列表
   */
  export default {
    name: 'UserList',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
      IndustrySelect,
      AddAppDialog,
      AppAccountDialog,
    },
    data() {
      return {
        form: {
          appName: null,
          industryId: null,
        },
        showAddDialog: false,
        showAccountDialog: false,
        curEditApp: null,
      };
    },
    methods: {
      handleAddNewApp() {
        this.curEditApp = null;
        this.showAddDialog = true;
      },
      handleEditNewApp(app) {
        this.curEditApp = app;
        this.showAddDialog = true;
      },
      handleSetAppAccount(app) {
        this.curEditApp = app;
        this.showAccountDialog = true;
      },
      handleSearchApp() {
        this.$refs.table.search();
      },
      async handleFetch(params) {
        console.log('handleFetch', this.form);
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          ...this.form,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data: list, totalCount: total } = await listApp(payload);
        return { list: list || [], total };
      },
    },
  };
</script>

<style lang="less">
  .app-list-container {
    .user-label {
      width: 70px;
      display: inline-block;
    }

    .app-logo {
      width: 50px;
      height: 50px;
    }
  }

  .el-table::before {
    height: 0;
  }
</style>
