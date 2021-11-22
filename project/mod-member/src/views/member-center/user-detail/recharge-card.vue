<template>
  <div>
    <el-form style="padding: 20px" inline label-suffix="：" @submit.native.prevent="onSearch">
      <el-form-item label="应用">
        <app-select v-model="appId" placeholder="请选择应用" clearable></app-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">搜索</el-button>
        <el-button plain @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <fat-table :fetch-handler="fetchData" style="padding: 20px 0" ref="table">
      <el-table-column prop="orderNo" label="支付单号" width="220"></el-table-column>
      <el-table-column label="充值金额">
        <template slot-scope="{ row }">{{ row.amount | price }}</template>
      </el-table-column>
      <el-table-column label="赠送金额">
        <template slot-scope="{ row }">{{ row.giftAmount | price }}</template>
      </el-table-column>
      <el-table-column label="充值时间">
        <template slot-scope="{ row }">{{ formatDate(row.chargeTime) }}</template>
      </el-table-column>
      <el-table-column label="应用" prop="appName"></el-table-column>
      <el-table-column prop="operator" label="下单门店"></el-table-column>
    </fat-table>
  </div>
</template>

<script>
  import api from '@/mod-member/src/api/memberAPI';
  import { FatTable } from '@/dss-common/components/list-page/index';
  import utilDate from '@/dss-common/utils/date';
  import AppSelect from '@/business-common/components/app-select';

  export default {
    components: { FatTable, AppSelect },
    props: {
      info: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        appId: '',
      };
    },
    methods: {
      async fetchData({ pagination: { pageSize, currentPage: pageNo } }) {
        const { data, totalCount } = await api.getMemberRechargeList({
          pageNo,
          pageSize,
          userId: this.info.id,
          appId: this.appId,
        });

        return {
          list: data || [],
          total: totalCount,
        };
      },
      formatDate(time) {
        return utilDate.format(new Date(time), 'YYYY-MM-DD HH:mm:ss');
      },
      onSearch() {
        this.$refs.table?.search();
      },
      onReset() {
        this.appId = '';
        this.onSearch();
      },
    },
  };
</script>
