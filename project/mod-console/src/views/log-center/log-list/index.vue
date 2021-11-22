<template>
  <list-page-layout>
    <template #filters>
      <el-form
        ref="logFilterForm"
        @submit.prevent.native="$refs.table.search()"
        :inline="true"
        :model="filterForm"
        class="filter-form"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model.trim="filterForm.userName" maxlength="16" placeholder="请输入用户名称/账号"></el-input>
        </el-form-item>
        <el-form-item label="接口名称" prop="permissionName">
          <el-input v-model.trim="filterForm.permissionName" maxlength="16" placeholder="请输入接口名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="search-btn" native-type="submit">搜索</el-button>
          <el-button type="plain" class="search-btn" @click="$refs.logFilterForm.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <div class="log-wrap">
      <fat-table ref="table" :state="filterForm" :fetch-handler="getAuditLog" style="width: 100%" class="log-content">
        <el-table-column prop="id" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="permissionName" label="接口名称" width="180"></el-table-column>
        <el-table-column prop="userName" label="操作用户">
          <template slot-scope="scope"
            >{{ scope.row.userName }}
            <span v-if="scope.row.userAccount">({{ scope.row.userAccount }})</span>
          </template>
        </el-table-column>
        <el-table-column prop="intro" label="状态">
          <template slot-scope="scope">{{ scope.row.status ? '成功' : '失败' }} </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址"></el-table-column>
        <el-table-column prop="createTime" label="操作时间">
          <template slot-scope="scope">{{ scope.row.createTime | time }} </template>
        </el-table-column>
      </fat-table>
    </div>
  </list-page-layout>
</template>

<script>
  import * as logApi from '@/mod-console/src/api/logApi';
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  export default {
    components: {
      ListPageLayout,
      FatTable,
      TableActions,
    },
    data() {
      return {
        filterForm: {
          userName: '',
          permissionName: '',
        },
      };
    },
    created() {
      // this.getAuditLog();
    },
    methods: {
      async getAuditLog(params) {
        // 分页信息
        const { pagination } = params;
        // 请求参数
        const payload = {
          ...this.filterForm,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };
        const { data, totalCount } = await logApi.getAuditLog(payload);
        return {
          list: data,
          total: totalCount,
        };
      },
    },
  };
</script>

<style scoped lang="less">
  .log-wrap {
    position: relative;

    .filter-form {
      background: white;
      padding: 20px 20px 0;
    }
    .log-content {
      margin-top: 20px;
    }
  }
</style>
