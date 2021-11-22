<template>
  <div class="m-atv-crowd">
    <div class="label">
      人群趋势
    </div>

    <div class="chart-item"
         v-for="(item, index) in charts"
         :key="index">
      <wkb-bar :title="item.title"
               :url="item.url"
               :custom-option="item.customOption"
               :query-params="item.params">
      </wkb-bar>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import WkbBar from '../../../components/wkb-bar.vue';
import atvApi from '@/dss-da/src/api/atv.js';

export default {
  name: 'Atvrowd',

  components: {
    WkbBar
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
      charts: null
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
        this.setCharts();
      }
    },

    dateRange: {
      deep: true,
      handler() {
        this.setCharts();
      }
    }
  },

  methods: {
    setCharts() {
      this.charts = [
        {
          title: '性别',
          url: atvApi.URL_ATV_CUSTOMER_GENDER_D,
          params: {
            storeId: this.selectedStore.id,
            pageSize: 100,
            pageNo: 1,
            startTime: this.dateRange[0],
            endTime: this.dateRange[1]
          },
          customOption: {
            keys: ['orderTime', 'pac', 'gender'],
            sortedLegend: [{ label: '男', value: 'M' }, { label: '女', value: 'F' }, { label: '未知', value: '未知' }]
          }
        },
        {
          title: '年龄',
          url: atvApi.URL_ATV_CUSTOMER_AGE_D,
          params: {
            storeId: this.selectedStore.id,
            pageSize: 100,
            pageNo: 1,
            startTime: this.dateRange[0],
            endTime: this.dateRange[1]
          },
          customOption: {
            keys: ['orderTime', 'pac', 'age'],
            sortedLegend: [
              { label: '0~15岁', value: '0~15岁' },
              { label: '16~25岁', value: '16~25岁' },
              { label: '26~35岁', value: '26~35岁' },
              { label: '36~45岁', value: '36~45岁' },
              { label: '大于46岁', value: '大于46岁' },
              { label: '未知', value: '未知' }
            ]
          }
        },
        {
          title: '顾客忠诚度',
          url: atvApi.URL_ATV_CUSTOMER_LOYALTY_D,
          params: {
            storeId: this.selectedStore.id,
            pageSize: 100,
            pageNo: 1,
            startTime: this.dateRange[0],
            endTime: this.dateRange[1]
          },
          customOption: {
            keys: ['orderTime', 'pac', 'loyalty'],
            sortedLegend: [{ label: '高', value: 'H' }, { label: '中', value: 'M' }, { label: '低', value: 'L' }]
          }
        },
        {
          title: '顾客购买力',
          url: atvApi.URL_ATV_CUSTOMER_BUYPOWER_D,
          params: {
            storeId: this.selectedStore.id,
            pageSize: 100,
            pageNo: 1,
            startTime: this.dateRange[0],
            endTime: this.dateRange[1]
          },
          customOption: {
            keys: ['orderTime', 'pac', 'buyPower'],
            sortedLegend: [{ label: '高', value: 'H' }, { label: '中', value: 'M' }, { label: '低', value: 'L' }]
          }
        }
      ];
    }
  }
};
</script>

<style lang="less">
.m-atv-crowd {
  .label {
    font-size: 16px;
    color: #333333;
    margin: 20px 0 10px 20px;
  }

  .chart-item {
    width: 49.5%;
    display: inline-block;
    margin-bottom: 1%;
    vertical-align: top;
  }

  .chart-item:nth-child(2n) {
    margin-right: 1%;
  }
}

@media screen and (max-width: 1000px) {
  .m-atv-crowd {
    .chart-item {
      width: 100%;
      display: block;
    }
  }
}
</style>
