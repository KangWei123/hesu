<template>
  <list-page-layout class="app-list-container">
    <template #main-actions>
      <el-button type="primary" @click="handleAdd" :disabled="disableButton">配置停车场</el-button>
    </template>
    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="停车场编号" prop="code"></el-table-column>
      <el-table-column label="停车场名称" prop="parkingLotName"></el-table-column>
      <el-table-column label="总车位">
        <template slot-scope="scope">
          <div>{{ scope.row.parkingLotAmount }}</div>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="parkingLotAddress"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="联系电话" prop="externalPhone"></el-table-column>
      <el-table-column label="操作" fixed="right" align="left" min-width="100" v-slot="scope">
        <table-actions
          :options="[
            { name: '编辑信息', onClick: () => handleEdit(scope.row) },
            { name: '缴费配置', onClick: () => handleConfig(scope.row) },
          ]"
        />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import parkApi from '@/dss-wechat3rd/src/api/park';
  import datetime from '@/dss-common/utils/date';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';

  export default {
    name: 'ParkConfig',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
    },
    data() {
      return {
        form: {},
        disableButton: false,
      };
    },
    methods: {
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

        const { data: list, totalCount: total } = await parkApi.queryList(payload);
        // 一个项目只能新建一个停车场 (后续是否新增看需求改动)
        this.disableButton = !!list && !!list.length;

        return { list: list || [], total };
      },

      handleEdit(row) {
        this.$router.push({ path: '/park/park-config/edit', query: { id: row.id } });
      },

      handleConfig(row) {
        this.$router.push({ path: '/park/park-config/setting', query: { id: row.id } });
      },

      handleAdd() {
        this.$router.push({ path: '/park/park-config/edit' });
      },
    },
  };
</script>

<style lang="less" rel="stylesheet/less"></style>
