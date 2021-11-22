<template>
  <div>
    <div class="row">
      <span v-for="(item, index) in intention" :key="index" class="item">
        <span class="label">{{ item.label }}: </span>
        <span class="value">{{ item.value }}</span>
        <i class="split" v-if="index !== intention.length - 1"></i>
      </span>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import api from '@/mod-member/src/api/manage.js';
  import utils from '@/dss-common/utils/date.js';
  import utilsIndex from '@/dss-common/utils/index.js';
  export default {
    name: 'ClientIntention',
    props: {
      id: {
        type: Number,
        default: -1,
      },
    },
    data() {
      return {
        loading: false,
        intention: null,
      };
    },
    methods: {
      getClientIntention() {
        this.loading = true;
        api
          .getClientIntention({
            clientId: this.id,
          })
          .then(res => {
            this.intention = [
              { label: '预算金额', value: (res.data && res.data.budget) || '--' },
              { label: '意向产品', value: (res.data && res.data.intentionalItem) || '--' },
              { label: '装修进度', value: (res.data && res.data.decorationProgress) || '--' },
              { label: '交房情况', value: (res.data && res.data.houseProgress) || '--' },
              { label: '购买情况', value: (res.data && res.data.buyDesc) || '--' },
              { label: '购买金额', value: (res.data && res.data.buyPrice) || '--' },
              { label: '放弃原因', value: (res.data && res.data.giveupReason) || '--' },
              { label: '接通情况', value: (res.data && res.data.connectionDesc) || '--' },
              { label: '通话时长', value: utilsIndex.formatTimeDuration(res.data && res.data.callDuration) || '--' },
              { label: '房屋类型', value: (res.data && res.data.houseType) || '--' },
              { label: '需求类型', value: (res.data && res.data.requireType) || '--' },
              { label: '居住类型', value: (res.data && res.data.liveType) || '--' },
              { label: '婚恋类型', value: (res.data && res.data.marriageType) || '--' },
              { label: '客户意向', value: (res.data && res.data.clientIntention) || '--' },
              { label: '装修计划', value: (res.data && res.data.decoratePlan) || '--' },
              {
                label: '预约购买时间 ',
                value: res.data && res.data.bookingBuytime ? utils.format(new Date(res.data.bookingBuytime)) : '--',
              },
              {
                label: '实际上门时间',
                value:
                  res.data && res.data.clientwindowShoppingtime
                    ? utils.format(new Date(res.data.clientwindowShoppingtime))
                    : '--',
              },
            ];
          });
      },
    },
    mounted() {
      this.getClientIntention();
    },
  };
</script>

<style lang="less" scoped>
  .row {
    border: 1px solid #e6e8eb;
    font-size: 13px;
    color: rgba(86, 105, 128, 1);
    line-height: 32px;
    margin: 12px 0 20px;
    padding: 20px;
    .item {
      display: inline-block;
    }
    .label {
      color: #666;
    }
    .value {
      color: #333;
    }
    .split {
      width: 0;
      height: 12px;
      border-left: 1px solid rgba(186, 198, 211, 0.6);
      margin: 0 40px;
    }
  }
</style>
