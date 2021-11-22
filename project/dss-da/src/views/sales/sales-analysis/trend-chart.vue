<template>
  <div class="da-block trendChart"
       v-loading="loding">
    <div class="bar-action-box action-float">
      <span class="da-block-title bar-title">销售趋势图</span>
    </div>

    <chart :options="loyaltyLineOptions"
           v-if="realData&&realData.length"
           height='300px'></chart>
    <place-holder :height="300"
                  v-else />
  </div>
</template>

<script>
import Chart from '@/dss-common/components/ChartEmpty';
import { line } from '@/dss-da/src/assembler/index.js';
import utils from '@/dss-common/utils';
import api from '@/dss-da/src/api/sales.js';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import { mapState } from 'vuex';
const salesTypeEnum = { PURCHASE: 0, LOYALTY: 1, SAMEGROWTH: 2 };
export default {
  name: 'trendChart',
  components: { Chart, PlaceHolder },
  props: {
    dateRange: {
      default: Array,
      value: []
    }
  },
  data() {
    return {
      salesTypeEnum,
      salesType: salesTypeEnum.LOYALTY,
      loyaltyLineOptions: null,
      times: [],
      realData: [],
      loding: false
    };
  },
  computed: {
    ...mapState({
      selectedStore: state => state.selectedStore
    })
  },
  watch: {
    dateRange: {
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
  mounted() {},
  methods: {
    getLegend() {
      this.realData.forEach(item => {
        item.level = '1';
      });
    },
    setMemberLineOptions() {
      this.getLegend();
      const sortLegendData = [{ label: '销售额', value: '1' }];
      this.loyaltyLineOptions = line.assembleLineOptions(
        this.realData,
        'orderTime',
        'saleFee',
        'level',
        utils.getTimeList(new Date(this.dateRange[0]), new Date(this.dateRange[1])),
        sortLegendData
      );
    },
    getData() {
      this.loding = true;
      api
        .getTrendData({
          storeId: this.selectedStore.id,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1],
          pageSize: 100,
          pageNo: 1
        })
        .then(rs => {
          this.realData = rs.data;
          this.setMemberLineOptions();
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.loding = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.trendChart {
  height: 370px;
}
</style>
