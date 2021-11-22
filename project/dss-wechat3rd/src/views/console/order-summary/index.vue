<template>
  <div class="order-summary block">
    <reverse-tab title="订单概述"
                 :tabs="tabs"
                 :defaultTab="tabs[0].name"
                 @change="onChange"></reverse-tab>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content">
          <div class="value">{{data.itemCount || 0}}</div>
          <div class="name">成交量（件）</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <div class="value">{{data.totalMoney || 0}}</div>
          <div class="name">成交额（元）</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <div class="value">{{data.avgMoney || 0}}</div>
          <div class="name">订单平均消费（元）</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ReverseTab from '@/dss-wechat3rd/src/components/reverse-tab/index.vue';
import sellerDashboardApi from '@/dss-wechat3rd/src/api/seller_dashboard';
import dateUtil from '@/dss-common/utils/date';
import floatCal from '@/dss-common/utils/float-num.js';
import { mapState } from 'vuex';
import './index.less';
const FORMAT = 'YYYY-MM-DD';
export default {
  components: {
    ReverseTab
  },
  data() {
    return {
      tabs: [
        { label: '今日', name: 'today' },
        { label: '昨天', name: 'yesterday' },
        { label: '最近7天', name: 'seven' },
        { label: '最近30天', name: 'thirty' }
      ],
      activeName: 'today',
      data: {
        avgMoney: 0,
        itemCount: 0,
        totalMoney: 0
      },
      loading: false
    };
  },

  mounted() {
    this.onChange(this.activeName);
  },

  computed: {
    ...mapState({
      curStore: 'curStore'
    })
  },

  methods: {
    getDay(name) {
      switch (name) {
        case 'today':
          return 0;
        case 'yesterday':
          return 1;
        case 'seven':
          return 7;
        case 'thirty':
          return 30;
      }
      return 0;
    },
    onChange(name) {
      const now = new Date();
      let endTime = dateUtil.format(dateUtil.addDays(now, 0 - 1), FORMAT); // 不能算当天的
      let startTime = dateUtil.format(dateUtil.addDays(now, 0 - this.getDay(name)), FORMAT);

      this.list = [];
      this.loading = true;

      const pageSize = 110;
      const pageNo = 1;
      const storeId = this.curStore.id;

      let params = {
        storeId: this.curStore.id || -1,
        provinceId: -1,
        cityId: -1,
        districtId: -1,
        regionId: -1,
        startTime: startTime,
        endTime: endTime
      };

      if (name === 'today') {
        sellerDashboardApi
          .orderOverview_Today({ pageSize, pageNo, storeId })
          .then(res => {
            const data = res.data[0] || {};

            this.data.totalMoney = (data.saleFee || 0).toFixed(2);
            this.data.itemCount = data.tradingVolume || 0;
            this.data.avgMoney = '0.00';
            if (data.orderCnt) {
              this.data.avgMoney = floatCal.floatDiv(this.data.totalMoney, data.orderCnt).toFixed(2);
            }
          })
          .always(() => {
            this.loading = false;
          });
      } else {
        // 历史数据要分别获取成交量和成交额
        this.fetchHistoryOrder({ ...params });
      }
    },
    async fetchHistoryOrder(params) {
      const list = await sellerDashboardApi.orderOverview_history_sale(params);
      if (list instanceof Array && list.length !== 0) {
        this.data.totalMoney = list.reduce((pre, cur) => pre + cur.saleFee, 0).toFixed(2);
        this.data.itemCount = list.reduce((pre, cur) => pre + cur.tradingVolume, 0);
        this.fetchHistoryOrder_count(params, this.data.totalMoney);
      }
    },

    async fetchHistoryOrder_count(params, totalMoney) {
      const list = await sellerDashboardApi.orderOverview_history_order(params);
      const orderCnt = list.reduce((pre, cur) => pre + cur.saleCnt, 0);
      this.data.avgMoney = '0.00';
      if (orderCnt) {
        this.data.avgMoney = floatCal.floatDiv(totalMoney, orderCnt).toFixed(2);
      }
    }
  }
};
</script>
