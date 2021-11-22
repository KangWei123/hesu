<template>
  <list-page-layout>
    <template #filters>
      <el-form ref="filterForm" :model="filterForm" :inline="true">
        <el-form-item label="选择日期范围：" prop="rangeDate">
          <el-date-picker
            v-model="filterForm.rangeDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择黑白名单类型：" prop="ipType">
          <el-select v-model="filterForm.ipType" placeholder="请选择">
            <el-option v-for="item in statusEnum" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="search-btn" @click="$refs.filterForm.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table ref="table" :fetch-handler="getListData" style="width: 100%" :state.sync="filterForm">
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime | loginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ipAddress" label="IP段" align="center"></el-table-column>
      <el-table-column label="黑白名单范围" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.ipType === 0">黑名单</span>
          <span v-else-if="scope.row.ipType === 1">白名单</span>
          <span v-else>灰名单</span>
        </template>
      </el-table-column>
      <el-table-column prop="loginName" label="登录账号" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
    </fat-table>
  </list-page-layout>
</template>
<script>
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page/index';
  import dateFormat from '@/dss-common/utils/date';
  import * as accessLogApi from '@/mod-org/src/api/accessLogApi';

  const statusEnum = [
    { value: 0, label: '黑名单' },
    { value: 1, label: '白名单' },
    { value: 2, label: '灰名单' },
  ];

  export default {
    components: {
      ListPageLayout,
      FatTable,
    },
    filters: {
      loginTime(timedot) {
        const date = new Date(timedot);
        return dateFormat.format(date);
      },
    },
    data() {
      return {
        statusEnum,
        filterForm: {
          rangeDate: '',
          ipType: '',
        },
      };
    },
    methods: {
      async getListData(params) {
        const { pagination } = params;
        const rangeTime = {};
        if (this.filterForm.rangeDate && this.filterForm.rangeDate.length !== 1) {
          rangeTime.fromTime = dateFormat.format(new Date(this.filterForm.rangeDate[0]));
          rangeTime.toTime = dateFormat.format(new Date(this.filterForm.rangeDate[1]));
        }
        const payload = {
          ...rangeTime,
          ipType: this.filterForm.ipType,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };
        const { data, totalCount } = await accessLogApi.getAccessList(payload);
        return {
          list: data,
          total: totalCount,
        };
      },
    },
  };
</script>
<style lang="less" scoped></style>
