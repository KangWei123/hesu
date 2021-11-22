<template>
  <div class="trendChart da-block"
       v-loading="loading">
    <div class="bar-action-box position">
      <span class="bar-title">实时趋势图</span>
      <span class="bar-action"
            :class="salesType===salesTypeEnum.PURCHASE ? 'bar-action-active' : ''"
            @click="salesType = salesTypeEnum.PURCHASE">
        销售额
      </span>
      <span class="bar-action"
            :class="salesType===salesTypeEnum.LOYALTY ? 'bar-action-active' : ''"
            @click="salesType = salesTypeEnum.LOYALTY">
        订单量
      </span>
      <span class="bar-action"
            :class="salesType===salesTypeEnum.SAMEGROWTH ? 'bar-action-active' : ''"
            @click="salesType = salesTypeEnum.SAMEGROWTH">
        平均客单价
      </span>
      <span class="bar-action"
            :class="salesType===salesTypeEnum.VGUNIT ? 'bar-action-active' : ''"
            @click="salesType = salesTypeEnum.VGUNIT">
        平均件单价
      </span>
      <span class="bar-action"
            :class="salesType===salesTypeEnum.ABOUTRATE ? 'bar-action-active' : ''"
            @click="salesType = salesTypeEnum.ABOUTRATE">
        连带率
      </span>
    </div>
    <chart :options="loyaltyLineOptions"
           v-if="list&&list.length"
           height="300px"></chart>
    <place-holder :height="300"
                  v-else />
  </div>
</template>

<script>
import Chart from '@/dss-common/components/ChartEmpty';
import { line } from '@/dss-da/src/assembler/index.js';
import api from '@/dss-da/src/api/sales.js';
import services from '@/dss-common/utils/services';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import utils from '@/dss-common/utils';
import { mapState } from 'vuex';

const salesTypeEnum = { PURCHASE: 0, LOYALTY: 1, SAMEGROWTH: 2, VGUNIT: 3, ABOUTRATE: 4 };
export default {
  name: 'trendChart',
  components: { Chart, PlaceHolder },
  data() {
    return {
      salesTypeEnum,
      salesType: salesTypeEnum.PURCHASE,
      loyaltyLineOptions: null,
      times: [],
      list: null,
      loading: false,
      field: ''
    };
  },
  watch: {
    salesType: {
      deep: true,
      handler() {
        this.getData();
      }
    },
    selectedStore: {
      deep: true,
      handler(newVal, oldVal) {
        if (oldVal != null) {
          this.getData();
        }
      }
    }
  },
  computed: {
    ...mapState({
      selectedStore: state => state.selectedStore
    })
  },
  created() {},
  mounted() {
    this.getData();
  },
  methods: {
    getTime() {
      this.list.forEach(item => {
        item.statDate = utils.timeFormat(new Date(item.statDate), 'HH:mm');
      });
      const times = [];
      for (let i = 0; i < 24; i++) {
        if (i < 6) {
          continue;
        }
        if (i > 9) {
          times.push(`${i}:00`);
        } else {
          times.push(`0${i}:00`);
        }
      }
      this.times = times;
    },
    setMemberLineOptions() {
      this.getTime();
      const sortLegendData = [{ label: '今日', value: 'today' }, { label: '上周同期', value: 'lastWeek' }];
      this.loyaltyLineOptions = line.assembleLineOptions(
        this.list,
        'statDate',
        this.field,
        'dataType',
        this.times,
        sortLegendData
      );
      const sortSeries = [];
      this.loyaltyLineOptions.series.forEach(item => {
        switch (item.name) {
          case '今日':
            sortSeries[0] = item;
            break;
          case '上周同期':
            sortSeries[1] = item;
            break;
        }
      });
      this.loyaltyLineOptions.grid = {
        top: '60',
        left: '50',
        right: '50',
        bottom: '30'
      };
      this.loyaltyLineOptions.series = sortSeries;
    },
    getData() {
      let url = api.URL_SALE_OVERVIEW_TREND_SALE;
      switch (this.salesType) {
        case salesTypeEnum.PURCHASE:
          url = api.URL_SALE_OVERVIEW_TREND_SALE;
          if (this.selectedStore.id < 0) {
            url = api.URL_SALE_OVERVIEW_TREND_APP_SALE;
          }
          this.field = 'sumAmount';
          break;
        case salesTypeEnum.LOYALTY:
          url = api.URL_SALE_OVERVIEW_TREND_CNT;
          if (this.selectedStore.id < 0) {
            url = api.URL_SALE_OVERVIEW_TREND_APP_CNT;
          }
          this.field = 'orderCount';
          break;
        case salesTypeEnum.SAMEGROWTH:
          url = api.URL_SALE_OVERVIEW_TREND_PRICE;
          if (this.selectedStore.id < 0) {
            url = api.URL_SALE_OVERVIEW_TREND_APP_PRICE;
          }
          this.field = 'avgFee';
          break;
        case salesTypeEnum.VGUNIT:
          url = api.URL_SALE_OVERVIEW_ITEM_PRICE;
          if (this.selectedStore.id < 0) {
            url = api.URL_SALE_OVERVIEW_ITEM_APP_PRICE;
          }
          this.field = 'avgFee';
          break;
        case salesTypeEnum.ABOUTRATE:
          url = api.URL_SALE_OVERVIEW_ITEM_RATE;
          if (this.selectedStore.id < 0) {
            url = api.URL_SALE_OVERVIEW_ITEM_APP_RATE;
          }
          this.field = 'rate';
          break;
      }
      this.loading = true;
      let params = {
        storeId: this.selectedStore.id > 0 ? this.selectedStore.id : null
      };
      services
        .get(url, {
          params,
          action: '获取趋势图数据'
        })
        .then(res => {
          this.list = res.data;
          this.setMemberLineOptions();
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.trendChart {
  box-sizing: border-box;
  position: relative;
  margin: 0px 0px 20px 0px;
  height: 340px;
  .position {
    position: absolute;
    top: 20px;
  }
}
</style>
