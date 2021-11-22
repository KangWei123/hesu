<template>
  <list-page-layout>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline label-suffix=":">
        <el-form-item label="时间区间" prop="date">
          <date-range-picker
            class="w220"
            v-model="form.date"
            type="daterange"
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
        <el-form-item label="积分动作" prop="eventKey">
          <score-type-select class="w220" placeholder="请选择积分动作" v-model="form.eventKey" clearable />
        </el-form-item>
        <el-form-item label="积分倍率活动" prop="scoreActivityId">
          <score-multipler-select
            class="w220"
            placeholder="请选择倍率活动"
            v-model="form.scoreActivityId"
            :app-id="applyId"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="积分规则" prop="scoreRuleIdList">
          <score-rule-select
            placeholder="请选择"
            :app-id="form.appId"
            :event-type="form.eventKey"
            v-model="form.scoreRuleIdList"
            multiple
            clearable
          >
          </score-rule-select>
        </el-form-item> -->
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
      <el-table-column label="发生时间" prop="createTime"></el-table-column>
      <el-table-column label="会员ID" prop="uniqueAccountId"></el-table-column>
      <el-table-column label="会员信息" v-slot="scope" width="200px">
        <user-info-field
          :avatar="scope.row.memberHeaderUrl"
          :name="scope.row.memberName"
          :phone="scope.row.memberPhone"
        ></user-info-field>
      </el-table-column>
      <el-table-column label="积分动作" prop="eventName"></el-table-column>
      <el-table-column label="积分倍率活动" prop="scoreActivityName" v-slot="{ row }">{{
        row.scoreActivityName || '无'
      }}</el-table-column>
      <el-table-column label="规则名称" prop="scoreRuleName" v-slot="scope">
        {{ scope.row.scoreRuleName || '-' }}
      </el-table-column>
      <el-table-column label="积分变动" v-slot="scope">
        <span :style="{ color: ChangeTypeInfo[scope.row.type][1] }"
          >{{ ChangeTypeInfo[scope.row.type][0] }}{{ scope.row.amount + (scope.row.extAmount || 0) }}</span
        >
      </el-table-column>
      <el-table-column label="业务单号" v-slot="scope">{{ scope.row.businessNo || '-' }}</el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import * as listPageComponents from '@/dss-common/components/list-page';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import ExportButton from '@/dss-common/components/export-button';
  import AppSelect from '@/business-common/components/app-select';
  import ScoreTypeSelect from '@/mod-member/src/components/score-type-select';
  // import ScoreRuleSelect from '@/mod-member/src/components/score-rule-select';
  import SettlementBelongSelect from '@/mod-member/src/components/settlement-belong-select';
  import ScoreMultiplerSelect from '@/mod-member/src/components/score-multipler-select';
  import api from '@/mod-member/src/api/memberAPI';
  import { ScoreChangeType, ScoreChangeTypeInfo } from '@/mod-member/src/enum';
  import UserInfoField from '@/business-common/components/user-info-field/index.vue';
  import { getAppName, getStoreName } from '@/mod-member/src/utils';

  const ChangeType = ScoreChangeType;
  const ChangeTypeInfo = ScoreChangeTypeInfo;

  /**
   * 积分明细
   */
  export default {
    name: 'AppStatDetail',
    components: {
      ...listPageComponents,
      SettlementBelongSelect,
      AppSelect,
      DateRangePicker,
      ExportButton,
      ScoreTypeSelect,
      ScoreMultiplerSelect,
      // ScoreRuleSelect,
      UserInfoField,
    },
    props: ['appId', 'settlement'],
    computed: {
      ...mapState({
        userInfo: 'userInfo',
      }),
      /**
       * 积分倍率业态默认可选择，集团先选择对应应用
       */
      applyId() {
        return this.globalIsUmpPlatformApp
          ? this.form.appId && this.form.appId !== 0
            ? this.form.appId
            : null
          : this.userInfo.appInfo.id;
      },
    },
    data() {
      return {
        form: {
          appId: this.appId,
          settlement: this.settlement,
          date: null,
          eventKey: null,
          scoreRuleIdList: null,
          scoreActivityId: null,
        },
        selected: [],
        ChangeType,
        ChangeTypeInfo,
      };
    },
    methods: {
      getAppName,
      getStoreName,
      getExportParams() {
        return {
          method: 'POST',
          data: this.getSearchParams(),
          url: api.scoreCenter.STAT_DETAIL_EXPORT,
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

        const { data, totalCount } = await api.scoreCenter.statDetail(payload);

        return {
          list: data || [],
          total: totalCount,
        };
      },
      getSearchParams() {
        const { date, settlement, ...other } = this.form;

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
