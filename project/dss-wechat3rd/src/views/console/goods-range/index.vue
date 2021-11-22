<template>
  <div class="goods-range block">
    <reverse-tab title="商品销量排行"
                 :tabs="tabs"
                 :defaultTab="tabs[0].name"
                 @change="onChange"></reverse-tab>
    <div class="range-table-box">
      <el-table :data="list">
        <el-table-column type="index"
                         width="90"
                         label="排名">
        </el-table-column>
        <el-table-column prop="itemName"
                         min-width="180"
                         label="商品名称">
        </el-table-column>
        <el-table-column prop="saleCount"
                         label="成交数量">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import ReverseTab from '@/dss-wechat3rd/src/components/reverse-tab/index.vue';
import sellerDashboardApi from '@/dss-wechat3rd/src/api/seller_dashboard';
import dateUtil from '@/dss-common/utils/date';
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
        // { label: '今日', name: 'today' },
        { label: '昨天', name: 'yesterday' },
        { label: '最近7天', name: 'seven' },
        { label: '最近30天', name: 'thirty' }
      ],
      activeName: 'yesterday',
      list: [],
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
          return 8;
        case 'thirty':
          return 31;
      }
      return 0;
    },

    onChange(name) {
      const now = new Date();
      let endTime = dateUtil.format(now, FORMAT);
      let startTime = dateUtil.format(dateUtil.addDays(now, 0 - this.getDay(name)), FORMAT);

      if (name === 'yesterday') {
        startTime = dateUtil.format(dateUtil.addDays(now, 0 - 2), FORMAT);
        endTime = dateUtil.format(dateUtil.addDays(now, 0 - this.getDay(name)), FORMAT);
      }

      const pageSize = 3;
      const pageNo = 1;
      this.loading = true;

      let params = {
        storeId: this.curStore.id || -1,
        provinceId: -1,
        cityId: -1,
        districtId: -1,
        regionId: -1,
        period: 0,
        itemId: -1,
        startTime: startTime,
        endTime: endTime,
        pageNo: pageNo,
        pageSize: pageSize,
        orders: [
          {
            orderDirection: 2,
            orderField: 'saleCount'
          }
        ]
      };

      sellerDashboardApi
        .itemStat(params)
        .then(res => {
          this.list = res.data || [];
        })
        .catch(() => {
          this.list = [];
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>
