<template>
  <list-page-layout class="app-list-container">
    <template #main-actions>
      <el-button type="primary">+ 新增应用</el-button>
    </template>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline>
        <el-form-item label="应用名称" prop="keyword">
          <el-input prefix-icon="el-icon-search" placeholder="搜索应用" v-model.trim="form.keyword"></el-input>
        </el-form-item>
        <el-form-item label="业态名称" prop="channel">
          <el-select placeholder="请选择" v-model="form.channel" clearable> </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">搜索</el-button>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" selectable row-key="id">
      <el-table-column label="应用名称" prop="appName"></el-table-column>
      <el-table-column label="对应业态" prop="channel"></el-table-column>
      <el-table-column label="appId" prop="appId"></el-table-column>
      <el-table-column label="创建人" prop="createName"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="操作" align="right" width="240px">
        <table-actions
          :options="[
            { name: '编辑', onClick: () => {} },
            { name: '管理员设置', onClick: () => {} },
          ]"
        />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import { listApp } from '@/dss-console/src/api/companyAPI';
  /**
   * 会员列表
   */
  export default {
    name: 'UserList',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
    },
    data() {
      return {
        form: {
          keyword: '',
          channel: null,
        },
      };
    },
    methods: {
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;

        // 请求参数
        // TODO: 联调
        const payload = {
          ...this.form,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        // TODO: 在这里进行接口请求
        const { data: list, totalCount: total } = await listApp(payload);
        return { list, total };
      },
    },
  };
</script>

<style lang="less">
  .app-list-container {
  }
</style>
