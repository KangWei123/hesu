<template>
  <list-page-layout class="by-time">
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline label-suffix=":">
        <el-form-item label="时间区间" prop="date">
          <date-range-picker
            v-model="form.date"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :clearable="false"
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
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <export-button title="批量导出" text="确定批量导出?" :params="getExportParams">导出</export-button>
        </el-form-item>
      </el-form>
    </template>
    <div class="stats">
      <div class="stats__time" v-if="form.date">{{ dateRange[0].slice(0, -9) }} 至 {{ dateRange[1].slice(0, -9) }}</div>
      <div class="stats__values">
        <div class="stat-value">
          <div class="stat-value__name">产生总额</div>
          <div class="stat-value__content">{{ stat.provideCount || 0 }}</div>
        </div>
        <div class="stat-value">
          <div class="stat-value__name">消耗总额</div>
          <div class="stat-value__content">{{ stat.consumeCount || 0 }}</div>
        </div>
        <div class="stat-value">
          <div class="stat-value__name">使用率</div>
          <div class="stat-value__content">{{ numberPercent(stat.usageRate * 100 || 0) }}</div>
        </div>
        <div class="stat-value">
          <div class="stat-value__name">过期总额</div>
          <div class="stat-value__content">{{ stat.overdueCount || 0 }}</div>
        </div>
      </div>
    </div>
    <fat-table ref="table" :state.sync="form" :fetch-handler="handleFetch">
      <el-table-column label="积分归属" prop="appName" v-slot="scope">{{
        globalIsUmpPlatformApp ? getAppName(scope.row) : getStoreName(scope.row)
      }}</el-table-column>
      <el-table-column label="时间" v-slot="scope">
        {{ scope.row.createMonth.slice(0, 4) }}-{{ scope.row.createMonth.slice(-2) }}
      </el-table-column>
      <el-table-column label="产生积分" prop="provideValue"></el-table-column>
      <el-table-column label="消耗积分" prop="consumeValue"></el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import * as listPageComponents from '@/dss-common/components/list-page';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import dateUtil from '@/dss-common/utils/date';
  import ExportButton from '@/dss-common/components/export-button';
  import AppSelect from '@/business-common/components/app-select';
  import SettlementBelongSelect from '@/mod-member/src/components/settlement-belong-select';
  import api from '@/mod-member/src/api/memberAPI';
  import { getAppName, getStoreName } from '@/mod-member/src/utils';
  import filters from '@/dss-common/utils/filters';

  const INIT_STAT = {
    consumeCount: 0,
    overdueCount: 0,
    provideCount: 0,
    usageRate: 0,
  };

  /**
   */
  export default {
    name: 'AppStatByTime',
    components: {
      ...listPageComponents,
      SettlementBelongSelect,
      AppSelect,
      DateRangePicker,
      ExportButton,
    },
    props: ['appId', 'settlement'],
    data() {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0);
      const end = new Date();

      return {
        form: {
          appId: this.appId,
          settlement: this.settlement,
          date: [dateUtil.format(start), dateUtil.format(end)],
        },
        numberPercent: filters.percent,
        selected: [],
        stat: { ...INIT_STAT },
      };
    },
    computed: {
      dateRange() {
        const [start, end] = this.form.date;
        const endTime = dateUtil.endOfMonth(new Date(end));
        return [start, dateUtil.format(endTime)];
      },
    },
    methods: {
      getAppName,
      getStoreName,
      getExportParams() {
        return {
          method: 'POST',
          data: this.getSearchParams(),
          url: api.scoreCenter.STAT_DETAIL_EXPORT_TIME,
        };
      },
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          ...this.getSearchParams(),
          searchCount: true,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await api.scoreCenter.statDetailByTime(payload);

        Object.assign(
          this.stat,
          data || {
            ...INIT_STAT,
          }
        );

        return {
          list: (data && data.scoreRecordReportList) || [],
          total: totalCount,
        };
      },
      getSearchParams() {
        const { date, settlement, ...other } = this.form;

        if (date) {
          const [startCreateTime, endCreateTime] = this.dateRange;
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

<style scoped lang="less">
  .stats {
    border: 1px solid #dce1e6;
    padding: 20px;
    margin: 20px;
    margin-bottom: 50px;
    border-radius: 5px;

    &__values {
      display: flex;
    }
  }

  .stat-value {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;

    &__name {
      color: gray;
    }

    &__content {
      font-size: 30px;
      line-height: 2;
      font-weight: bold;
    }
  }
</style>
