<template>
  <list-page-layout class="app-list-container">
    <template #main-actions> </template>

    <template #filters>
      <el-form ref="query" class="nav-form" @submit.prevent.native="$refs.table.search()" :model="form" inline>
        <el-form-item label="调用时间：" prop="dateRange">
          <el-date-picker
            class="el-form-item-view dss-filter-input"
            v-model="form.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-button @click="$refs.table.search()" class="refresh">刷新</el-button>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column prop="requestMethod" label="请求方法" min-width="120" align="center"></el-table-column>
      <el-table-column prop="describe" label="方法描述" min-width="120" align="center"></el-table-column>
      <el-table-column prop="overTimeBeginDate" label="开始超时" min-width="120" align="center"></el-table-column>
      <el-table-column prop="fusingDate" label="熔断时间" min-width="120" align="center"></el-table-column>
    </fat-table>
  </list-page-layout>
</template>
<script>
  import parkApi from '@/dss-wechat3rd/src/api/park.js';
  import { timeFormat } from '@/business-common/filters/date-format-filters';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';

  export default {
    name: 'FuseRecord',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
    },
    data() {
      return {
        isUnfold: false,
        arrowAnimation: '',
        loading: false,
        form: {
          dateRange: [],
        },
      };
    },

    methods: {
      async handleFetch(data) {
        const { pagination } = data;
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };
        if (this.form.dateRange && this.form.dateRange.length) {
          params.startTime = timeFormat(this.form.dateRange[0], 'YYYY-MM-DD 00:00:00');
          params.endTime = timeFormat(this.form.dateRange[1], 'YYYY-MM-DD 23:59:59');
        }
        const { data: list, totalCount: total } = await parkApi.fusingList(params);
        return { list: list || [], total };
      },
    },
  };
</script>
<style scoped lang="less">
  .refresh {
    margin: 20px 20px 0 20px;
  }
</style>
