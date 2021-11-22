<template>
  <div class="da-block m-atv-trend">
    <div class="bar-action-box action-float">
      <span class="da-block-title bar-title">客单价趋势图</span>
      <span class="bar-action"
            :class="trendType.value === trendTypeEnum.CUST_PRICE.value ? 'bar-action-active' : ''"
            @click="trendType = trendTypeEnum.CUST_PRICE">
        客单价
      </span>
      <span class="bar-action"
            :class="trendType.value === trendTypeEnum.GOODS_PRICE.value ? 'bar-action-active' : ''"
            @click="trendType = trendTypeEnum.GOODS_PRICE">
        件单价
      </span>
      <span class="bar-action"
            :class="trendType.value === trendTypeEnum.ASSOCIATED_PURCHASE_RATE.value ? 'bar-action-active' : ''"
            @click="trendType = trendTypeEnum.ASSOCIATED_PURCHASE_RATE">
        连带率
      </span>
    </div>
    <chart v-if="data && data.length"
           height="300px"
           :options="atvOption"></chart>

    <place-holder v-else
                  :height="300" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import utils from '@/dss-common/utils';
import { line } from '@/dss-da/src/assembler/index.js';
import Chart from '@/dss-common/components/ChartEmpty';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import atvApi from '@/dss-da/src/api/atv.js';

const trendTypeEnum = {
  CUST_PRICE: { value: 0, label: '客单价' },
  GOODS_PRICE: { value: 1, label: '件单价' },
  ASSOCIATED_PURCHASE_RATE: { value: 2, label: '连带率' }
};

export default {
  name: 'ATVTrend',

  components: {
    Chart,
    PlaceHolder
  },

  props: {
    dateRange: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      loading: false,
      data: null,
      atvOption: null,
      queryParams: null,
      trendTypeEnum,
      trendType: trendTypeEnum.CUST_PRICE
    };
  },

  computed: {
    ...mapState({
      selectedStore: state => state.selectedStore
    })
  },

  watch: {
    selectedStore: {
      deep: true,
      handler(newVal, oldVal) {
        this.queryParams = {
          storeId: this.selectedStore.id,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1],
          pageSize: 100,
          pageNo: 1
        };
        if (oldVal != null) {
          this.apiGetData();
        }
      }
    },

    dateRange: {
      deep: true,
      handler() {
        this.queryParams = {
          storeId: this.selectedStore.id,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1],
          pageSize: 100,
          pageNo: 1
        };
        this.apiGetData();
      }
    },

    trendType: {
      deep: true,
      handler() {
        this.apiGetData();
      }
    }
  },

  methods: {
    apiGetData() {
      switch (this.trendType.value) {
        case trendTypeEnum.CUST_PRICE.value:
          this.apiGetAtvCustomerTrendByDay();
          break;

        case trendTypeEnum.GOODS_PRICE.value:
          this.apiGetAtvPitTrendByDay();
          break;

        case trendTypeEnum.ASSOCIATED_PURCHASE_RATE.value:
          this.apiGetAtvJointRateTrendByDay();
          break;
      }
    },

    apiGetAtvCustomerTrendByDay() {
      this.loading = true;
      let params = {
        ...this.queryParams
      };

      atvApi
        .getAtvCustomerTrendByDay(params)
        .then(res => {
          this.data = res.data || [];
          this.atvOption = line.assembleLineOptions(
            this.data,
            'orderTime',
            'pac',
            null,
            utils.getTimeList(new Date(this.dateRange[0]), new Date(this.dateRange[1]))
          );
        })
        .catch(err => {
          console.error('apiGetAtvCustomerTrendByDay error', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    apiGetAtvPitTrendByDay() {
      this.loading = true;
      let params = {
        ...this.queryParams
      };
      atvApi
        .getAtvPitTrendByDay(params)
        .then(res => {
          this.data = res.data || [];
          this.atvOption = line.assembleLineOptions(
            this.data,
            'orderTime',
            'unitPrice',
            null,
            utils.getTimeList(new Date(this.dateRange[0]), new Date(this.dateRange[1]))
          );
        })
        .catch(err => {
          console.error('apiGetAtvPitTrendByDay error', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    apiGetAtvJointRateTrendByDay() {
      this.loading = true;
      let params = {
        ...this.queryParams
      };

      atvApi
        .getAtvJointRateTrendByDay(params)
        .then(res => {
          this.data = res.data || [];
          this.atvOption = line.assembleLineOptions(
            this.data,
            'orderTime',
            'apr',
            null,
            utils.getTimeList(new Date(this.dateRange[0]), new Date(this.dateRange[1]))
          );
        })
        .catch(err => {
          console.error('apiGetAtvJointRateTrendByDay error', err);
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less">
.m-atv-trend {
  height: 370px;
}
</style>
