<template>
  <div class="scores">
    <div class="stats">
      <div class="stat">
        <div class="stat__num">{{ stat.score || 0 }}</div>
        <div class="stat__name">积分余额</div>
      </div>
      <div class="stat">
        <div class="stat__num">{{ stat.expireScore || 0 }}</div>
        <div class="stat__name">本年度即将过期</div>
        <div class="stat__tip">仅显示会员本年度即将过期的有效积分</div>
      </div>
      <div class="stat">
        <div class="stat__num">{{ stat.consumeScore || 0 }}</div>
        <div class="stat__name">本年度累计消耗</div>
      </div>
    </div>
    <div class="filters">
      <el-form ref="query" :model="form" inline @submit.native.prevent="$refs.table.search()">
        <el-form-item label="应用" prop="appId">
          <app-select v-model="form.appId" group-selectable all-app placeholder="请选择应用" clearable></app-select>
        </el-form-item>
        <el-form-item label="积分动作" prop="eventKey">
          <score-type-select v-model="form.eventKey" placeholder="请选择积分动作" clearable />
        </el-form-item>
        <el-form-item label="积分倍率活动" prop="scoreActivityId">
          <score-multipler-select placeholder="请选择活动" v-model="form.scoreActivityId" :app-id="appId" clearable />
        </el-form-item>
        <el-form-item label="时间" prop="dateRange">
          <date-range-picker v-model="form.dateRange" type="daterange"></date-range-picker>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button plain @click="handleChangeValue" :disabled="!info">增减积分</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <fat-table ref="table" :state="form" :fetch-handler="handleFetch" :fetch-on-mounted="false">
        <el-table-column label="时间" prop="createTime" width="130"></el-table-column>
        <el-table-column label="应用" prop="appName" v-slot="scope">{{ getAppName(scope.row) }}</el-table-column>
        <el-table-column label="积分动作" prop="eventName"></el-table-column>
        <el-table-column label="积分倍率活动" prop="scoreActivityName" v-slot="{ row }">
          {{ row.scoreActivityName || '无' }}
        </el-table-column>
        <el-table-column label="积分规则" prop="scoreRuleName"></el-table-column>
        <el-table-column label="备注" prop="desc"></el-table-column>
        <el-table-column label="数量" v-slot="scope">
          <span :style="{ color: ScoreChangeTypeInfo[scope.row.type][1] }">
            {{ ScoreChangeTypeInfo[scope.row.type][0] }}{{ scope.row.amount + (scope.row.extAmount || 0) }}
          </span>
        </el-table-column>
        <el-table-column label="操作人" prop="operator"></el-table-column>
      </fat-table>
    </div>
    <value-change-dialog ref="changeDialog" />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { FatTable } from '@/dss-common/components/list-page/index';
  import AppSelect from '@/business-common/components/app-select';
  import ScoreTypeSelect from '@/mod-member/src/components/score-type-select';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import api from '@/mod-member/src/api/memberAPI';
  import { ScoreChangeType, ScoreChangeTypeInfo } from '@/mod-member/src/enum';
  import { getAppName } from '@/mod-member/src/utils';
  import ScoreMultiplerSelect from '@/mod-member/src/components/score-multipler-select';

  import ValueChangeDialog from '../../user-list/value-change-dialog';
  import ScoreValueChangeMixin from '../../user-list/score-change-mixin';

  export default {
    name: 'Scores',
    mixins: [ScoreValueChangeMixin],
    inject: ['refreshUserInfo'],
    components: {
      AppSelect,
      ScoreTypeSelect,
      FatTable,
      ValueChangeDialog,
      DateRangePicker,
      ScoreMultiplerSelect,
    },
    props: {
      info: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        ScoreChangeType,
        ScoreChangeTypeInfo,
        form: {
          appId: null,
          eventKey: null,
          dateRange: null,
          scoreActivityId: null,
        },
        stat: {
          consumeScore: 0,
          expireScore: 0,
          score: 0,
        },
      };
    },
    watch: {
      info: {
        immediate: true,
        handler(value) {
          if (value) {
            this.$nextTick(() => {
              this.$refs.table.search();
              this.fetchStat();
            });
          }
        },
      },
      appId(val) {
        this.form.scoreActivityId = null;
      },
    },
    computed: {
      ...mapState({
        userInfo: 'userInfo',
      }),
      appId() {
        return this.globalIsUmpPlatformApp
          ? this.form.appId && this.form.appId !== 0
            ? this.form.appId
            : null
          : this.userInfo.appInfo.id;
      },
    },
    methods: {
      getAppName,
      async fetchStat() {
        const { data } = await api.scoreCenter.getUserStat({ uniqueAccountId: this.info.uniqueAccountId });
        if (data) {
          this.stat = data;
        }
      },
      async handleFetch(params) {
        const { dateRange, ...other } = this.form;
        if (dateRange) {
          const [startCreateTime, endCreateTime] = dateRange;
          Object.assign(other, { startCreateTime, endCreateTime });
        }

        // 分页信息
        const { pagination } = params;
        // 请求参数
        const payload = {
          ...other,
          uniqueAccountId: this.info.uniqueAccountId,

          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          queryAll: true,
        };

        const { data, totalCount } = await api.scoreCenter.statDetail(payload);

        return {
          list: data || [],
          total: totalCount,
        };
      },
      handleChangeValue() {
        this.$refs.changeDialog.show({
          valueName: '积分',
          value: this.info.totalMemberScore,
          onConfirm: async params => {
            await this.doScoreChange({ ...params, uniqueAccountId: this.info.uniqueAccountId });
            this.$refs.table.refresh();
            this.refreshUserInfo();
          },
        });
      },
    },
  };
</script>

<style scoped>
  .stats {
    display: flex;
    padding: 17px;
  }

  .stat {
    flex: 1;
    height: 125px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #e4e7ed;
    box-shadow: 0 3px 17px -7px #d8d8d8;
  }

  .stat__num {
    font-size: 32px;
    font-weight: 600;
  }

  .stat__name {
    font-size: 14px;
    color: #717378;
    margin-top: 10px;
  }

  .stat__tip {
    font-size: 12px;
    color: #bbb;
    position: absolute;
    bottom: 6px;
  }

  .stat:not(:last-child) {
    margin-right: 16px;
  }

  .filters {
    padding: 20px;
  }

  .table {
    padding-bottom: 20px;
  }
</style>
