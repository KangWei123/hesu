<template>
  <list-page-layout>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline label-suffix=":">
        <el-form-item label="时间区间" prop="date">
          <date-range-picker
            v-model="form.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
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
        <el-form-item style="float: right">
          <export-button title="批量导出" text="确定批量导出?" type="primary" :params="getExportParams"
            >导出</export-button
          >
        </el-form-item>
      </el-form>
    </template>
    <template v-if="!globalIsUmpPlatformApp">
      <div class="stats">
        <div class="stats__time">{{ stat.appName }}应用积分总结算</div>
        <div class="stats__values">
          <div class="stat-value">
            <div class="stat-value__name">产生积分</div>
            <div class="stat-value__content">{{ stat.produceScore }}</div>
          </div>
          <div class="stat-value">
            <div class="stat-value__name">结算积分</div>
            <div class="stat-value__content">{{ stat.settlementScore }}</div>
          </div>
          <div class="stat-value">
            <div class="stat-value__name">接受积分</div>
            <div class="stat-value__content">{{ stat.receiveScore }}</div>
          </div>
          <div class="stat-value">
            <div class="stat-value__name">积分差值</div>
            <div class="stat-value__content">{{ stat.scoreDifference }}</div>
          </div>
          <div class="stat-value">
            <div class="stat-value__name">过期积分</div>
            <div class="stat-value__content">{{ stat.expiredScore }}</div>
          </div>
        </div>
      </div>
    </template>
    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form">
      <el-table-column label="积分归属" prop="appName" v-slot="scope">{{
        globalIsUmpPlatformApp || scope.row.recordType === 1 ? getAppName(scope.row) : getStoreName(scope.row)
      }}</el-table-column>
      <el-table-column :prop="globalIsUmpPlatformApp ? 'produceScore' : 'totalProduceScore'">
        <template #header
          >产生积分
          <el-tooltip content="选定时间内，在该应用发放的积分总和"><i class="el-icon-question"></i></el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :prop="globalIsUmpPlatformApp ? 'settlementScore' : 'totalSettlementScore'">
        <template #header
          >结算积分
          <el-tooltip content="选定时间内，在该应用产生积分中被使用的积分总和"
            ><i class="el-icon-question"></i
          ></el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :prop="globalIsUmpPlatformApp ? 'receiveScore' : 'totalReceiveScore'">
        <template #header
          >接收积分
          <el-tooltip content="选定时间内，在该应用使用的积分总和"><i class="el-icon-question"></i></el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :prop="globalIsUmpPlatformApp ? 'scoreDifference' : 'totalScoreDifference'">
        <template #header
          >积分差值
          <el-tooltip
            content="选定时间内的接受积分减结算积分，负值代表应结算给其他应用的积分成本，正值代表应收回的积分成本"
            ><i class="el-icon-question"></i
          ></el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="过期积分" :prop="globalIsUmpPlatformApp ? 'expiredScore' : 'totalExpiredScore'">
        <template #header>
          过期积分
          <el-tooltip content="选定时间内过期的积分总和"><i class="el-icon-question"></i></el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-slot="{ row }">
        <table-actions
          :options="[
            {
              name: '明细',
              link: {
                name: 'member.score-stat-detail',
                query: globalIsUmpPlatformApp
                  ? { appId: row.appId }
                  : { settlement: `${row.storeId || row.appId}-${row.recordType}` },
              },
            },
          ]"
        ></table-actions>
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import * as listPageComponents from '@/dss-common/components/list-page';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import ExportButton from '@/dss-common/components/export-button';
  import AppSelect from '@/business-common/components/app-select';
  import SettlementBelongSelect from '@/mod-member/src/components/settlement-belong-select/index.vue';
  import api from '@/mod-member/src/api/memberAPI';
  import { getAppName, getStoreName } from '@/mod-member/src/utils';

  const INIT_STAT = {
    appName: '',
    expiredScore: 0,
    produceScore: 0,
    receiveScore: 0,
    scoreDifference: 0,
    settlementScore: 0,
  };

  export default {
    name: 'ScoreStat',
    components: {
      ...listPageComponents,
      DateRangePicker,
      AppSelect,
      SettlementBelongSelect,
      ExportButton,
    },
    data() {
      return {
        form: {
          date: null,
          appId: null,
          settlement: null,
        },
        stat: { ...INIT_STAT },
      };
    },
    methods: {
      getAppName,
      getStoreName,
      getExportParams() {
        return {
          method: 'GET',
          data: this.getParams(),
          url: this.globalIsUmpPlatformApp ? api.scoreCenter.STAT_EXPORT : api.scoreCenter.STAT_EXPORT_STORE,
        };
      },
      getParams() {
        const { date, settlement, ...other } = this.form;
        if (date) {
          const [startDate, endDate] = date;
          Object.assign(other, { startDate, endDate });
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
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;
        // 请求参数
        const payload = {
          ...this.getParams(),
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          searchCount: true,
        };

        if (this.globalIsUmpPlatformApp) {
          const { data: list, totalCount: total } = await api.scoreCenter.stat(payload);
          return { list, total };
        } else {
          const { data } = await api.scoreCenter.stat(payload);
          if (data && data[0]) {
            const { appName, expiredScore, produceScore, receiveScore, scoreDifference, settlementScore } = data[0];
            this.stat = {
              appName,
              expiredScore,
              produceScore,
              receiveScore,
              scoreDifference,
              settlementScore,
            };
          } else {
            this.stat = {
              ...INIT_STAT,
              appName: this.stat.appName,
            };
          }

          const { data: list, totalCount } = await api.scoreCenter.statStore(payload);
          return { list, total: totalCount };
        }
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
