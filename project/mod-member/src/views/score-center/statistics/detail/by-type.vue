<template>
  <list-page-layout>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline label-suffix=":">
        <el-form-item label="时间区间" prop="date">
          <date-range-picker
            class="w220"
            v-model="form.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></date-range-picker>
        </el-form-item>
        <el-form-item label="积分归属" :prop="globalIsUmpPlatformApp ? 'appId' : 'settlement'">
          <template v-if="globalIsUmpPlatformApp">
            <app-select class="w220" placeholder="请选择积分归属" group-selectable v-model="form.appId" clearable />
          </template>
          <template v-else>
            <settlement-belong-select class="w220" placeholder="请选择积分归属" v-model="form.settlement" clearable />
          </template>
        </el-form-item>
        <el-form-item label="积分动作" prop="scoreEventKey">
          <score-type-select class="w220" placeholder="请选择积分动作" v-model="form.scoreEventKey" clearable />
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <export-button title="批量导出" text="确定批量导出?" :params="getExportParams">导出</export-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table ref="table" :state="form" :fetch-handler="handleFetch">
      <el-table-column label="积分归属" prop="appName" v-slot="scope">{{
        globalIsUmpPlatformApp ? getAppName(scope.row) : getStoreName(scope.row)
      }}</el-table-column>
      <el-table-column label="积分动作" prop="scoreEventName"></el-table-column>
      <el-table-column label="产生积分" prop="provideValue"></el-table-column>
      <el-table-column label="消耗积分" prop="consumeValue"></el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import * as listPageComponents from '@/dss-common/components/list-page';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import ExportButton from '@/dss-common/components/export-button';
  import AppSelect from '@/business-common/components/app-select';
  import ScoreTypeSelect from '@/mod-member/src/components/score-type-select';
  import SettlementBelongSelect from '@/mod-member/src/components/settlement-belong-select';
  import api from '@/mod-member/src/api/memberAPI';
  import { getAppName, getStoreName } from '@/mod-member/src/utils';

  export default {
    name: 'AppStatByType',
    components: {
      ...listPageComponents,
      SettlementBelongSelect,
      AppSelect,
      DateRangePicker,
      ExportButton,
      ScoreTypeSelect,
    },
    props: ['appId', 'settlement'],
    data() {
      return {
        form: { appId: this.appId, settlement: this.settlement, date: null, scoreEventKey: null },
        selected: [],
      };
    },
    methods: {
      getAppName,
      getStoreName,
      getExportParams() {
        return {
          method: 'POST',
          data: this.getSearchParams(),
          url: api.scoreCenter.STAT_DETAIL_EXPORT_TYPE,
        };
      },
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          ...this.getSearchParams(),
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await api.scoreCenter.statDetailByType(payload);

        return {
          list: data,
          total: totalCount,
        };
      },
      getSearchParams() {
        const { date, settlement, ...other } = this.form;

        other.scoreEventKey = other.scoreEventKey || null;

        if (date) {
          const [startCreateTime, endCreateTime] = date;
          Object.assign(other, { startCreateTime, endCreateTime });
        }

        if (settlement) {
          const [id, type] = settlement.split('-').map(i => +i);
          let appId = null;
          let storeId = null;
          // type = 1 积分归属应用，否则积分归属项目
          type === 1 ? (appId = id) : (storeId = id);
          Object.assign(other, { appId, storeId });
        }
        return other;
      },
    },
  };
</script>

<style></style>
