<template>
  <table-select-dialog
    :key="activityStartTime+activityEndTime"
    v-model="mShowDialog"
    class="lucky-select-dialog"
    :enable-multiple="enableMultiple"
    :columns="columns"
    :columns-handler="enableMultiple ? null : columnsHandler"
    :api-url="timeApiUrl"
    :selected-list="selectedLucky"
    :union-keys="['id']"
    :query-params="allQueryParams"
    :limit="limit"
    @choose="onCouponChoosed"
  >
    <div slot="filter" class="lucky-filter">
      <span class="filter-title" style="margin-right: 10px">选择幸运转盘</span>
      <el-input
        class="filter-input"
        v-model.trim="filterLuckyName"
        placeholder="搜索幸运转盘名称"
        @input="onFilter"
        style="width: 200px"
        size="mini"
      ></el-input>
    </div>
  </table-select-dialog>
</template>

<script>
import TableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index.vue';
import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler.js';
import scenarioColomn from './scenario-column.vue';
import ExpireTimeColumn from './expire-time-column.vue';
import statusColumn from './status-column';
import participateColumn from './paricipate-column';
import ChooseColumn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/chooseBtn.vue';
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum.js';
import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';

const columns = [
  {
    prop: 'activityName',
    label: '活动名称',
    propsHandler: Handler.propsHanler
  },
  {
    prop: '',
    label: '活动时间',
    component: ExpireTimeColumn
  },
  {
    prop: 'participationType',
    label: '活动类型',
    component: participateColumn
  },

  {
    prop: 'activityScenario',
    label: '活动场景',
    component: scenarioColomn
  },

  {
    prop: 'activityStatus',
    label: '状态',
    component: statusColumn
  }
];
export default {
  name: 'LuckySelectDialog',
  mixins: [dialogMixin],
  components: {
    TableSelectDialog
  },
  props: {
    limit: {
      type: Number,
      default: 0
    },
    selectedLucky: {
      type: Array,
      default: function() {
        return [];
      }
    },
    enableMultiple: {
      type: Boolean,
      default: true
    },
    extParams: {
      type: Object,
      default: function() {
        return {};
      }
    },
    activityStartTime: {
      type: String
    },
    activityEndTime: {
      type: String
    }
  },
  data() {
    return {
      columns,
      columnsHandler: cols => {
        const that = this;
        return cols.concat({
          align: 'left',
          sortable: false,

          // 不可选择的时候 提示
          disabledTip: '幸运转盘活动时间需包含下单有礼的活动时间',
          // 标志 abled 的字段，不设定默认为 abled
          abledProp: 'canChooseForOrder',

          component: ChooseColumn,
          listeners: {
            'choose-item'(couponItem) {
              console.log(couponItem);
              // 如果活动未开始则不可选中
              if (couponItem.activityStatus === 0) {
                that.$message.error('活动暂未开始，不能选中');
                return;
              }
              that.$emit('selected', couponItem);
              //console.log('selected', couponItem);
              that.mShowDialog = false;
            }
          }
        });
      },
      apiUrl: '/wp/lucky_turning/query_for_order?activityScenario=1&activityStatus=0,2,3', //只需要参与下单有礼的幸运转盘
      filterLuckyName: null,
      queryParams: {
        status: couponEnum.status.VALID
        //statusList: '0,1,2,3'
      }
    };
  },
  computed: {
    allQueryParams() {
      return { ...this.queryParams, ...(this.extParams || {}) };
    },
    timeApiUrl() {
      let url = this.apiUrl;
      if (this.activityStartTime) {
        url = url + `&activityStartTime=${this.activityStartTime}`;
      }
      if (this.activityEndTime) {
        url = url + `&activityEndTime=${this.activityEndTime}`;
      }
      return url;
    }
  },
  methods: {
    onFilter() {
      this.queryParams = {
        activityName: this.filterLuckyName
      };
    },
    onCouponChoosed(selectedRows) {
      this.$emit('selected', selectedRows);
    }
  }
};
</script>

<style lang="less">
.lucky-select-dialog {
  .lucky-filter {
    border-bottom: 1px solid rgba(235, 235, 235, 1);
    padding-bottom: 10px;
    margin-bottom: 19px;
  }
}
</style>
