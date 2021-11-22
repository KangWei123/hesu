<template>
  <div>
    <div class="filter-wrapper">
      <list-filter :guide-list="guideList" :store-keeper-list="storeKeeperList" class="filter-container" @filter="handleFilter" />
    </div>
    <div class="container">
      <list-tags class="order-tabs" @params="handleTabClick" :params="this.tabs" :order-status-tabs="orderStatusTabs" />
      <list-table v-loading="loading" :params="this.tabs" :list="list" :filter="filter" />
      <el-pagination
        v-if="totalCount"
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalCount"
        :page-size="page.pageSize"
        :current-page="page.pageNo"
        :page-sizes="[5, 10, 20, 50, 100, 500]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="wkt-pagination"
      />
    </div>
  </div>
</template>

<script>
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import ListFilter from './list-filter.vue';
import ListTags from './list-tabs.vue';
import ListTable from './list-table.vue';
import settingApi from '@/dss-wechat3rd/src/api/settings.js';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';
import constants from '@/dss-wechat3rd/src/constants/index';
import services from '@/dss-common/utils/services';
import { mapState } from 'vuex';

// 线上TABS
const ORDER_STATUS = [
  { label: '所有订单', params: {} },
  { label: '待审核', params: { valetOrderAuditStatusList: '0' } },
  // { label: '待发货', params: { orderStatus: 20 } },
  { label: '待确认', params: { valetOrderStatus: 1 } },
  { label: '待付款', params: { orderStatus: 10 } },
  // { label: '待收货', params: { orderStatusList: '40,41' } },
  { label: '已完成', params: { valetOrderStatus: 5 } },
  { label: '已取消', params: { valetOrderStatus: 4 } },
  { label: '未通过', params: { valetOrderStatus: 3 } }
];

// 线下TABS
const OFFLINE_ORDER_STATUS = [
  { label: '所有订单', params: {} },
  { label: '待审核', params: { valetOrderAuditStatusList: '0' } },
  { label: '已完成', params: { valetOrderStatus: 5 } },
  { label: '未通过', params: { valetOrderStatus: 3 } }
];

// 全部TABS
const ALL_ORDER_STATUS = [
  { label: '所有订单', params: {} },
  { label: '待审核', params: { valetOrderAuditStatusList: '0' } },
  { label: '待确认', params: { valetOrderStatus: 1 } },
  { label: '待付款', params: { orderStatus: 10 } },
  // { label: '待发货', params: { orderStatus: 20 } },
  // { label: '待收货', params: { orderStatusList: '40,41' } },
  { label: '已完成', params: { valetOrderStatus: 5 } },
  { label: '已取消', params: { valetOrderStatus: 4 } },
  { label: '未通过', params: { valetOrderStatus: 3 } }
];

export default {
  components: {
    WkbPageNav,
    ListFilter,
    ListTags,
    ListTable
  },

  computed: {
    orderStatusTabs() {
      // 线下支付
      if (this.filter.paymentMethod === 1) {
        return OFFLINE_ORDER_STATUS;
      } else if (this.filter.paymentMethod === 0) {
        return ORDER_STATUS;
      }
      // 全部
      return ALL_ORDER_STATUS;
    },
    ...mapState({
      curStore: 'curStore'
    })
  },
  data() {
    return {
      guideList: [],
      orderStatus: orderStatusEnum.ORDER.STATUS.ALL.name,
      page: {
        pageSize: 5,
        pageNo: 1
      },
      filter: {
        guideId: null,
        dateRange: null,
        valetOrderNoStr: '',
        userPhone: '',
        paymentMethod: null,
        orderNoStr: '',
        storeKeeperId: null
      },
      tabs: {},
      totalCount: 0,
      list: [],
      loading: false,
      storeKeeperList: []
    };
  },

  mounted() {
    this.queryGuideList();
    this.queryStoreKeeperList();
    this.queryList();
  },

  methods: {
    async queryGuideList() {
      const { data } = await settingApi.getShopGuide({
        queryAll: true,
        storeId: this.curStore && this.curStore.id ? this.curStore.id : null
      });
      this.guideList = data || [];
    },

    async queryStoreKeeperList() {
      const { data } = await settingApi.getShopGuide({
        queryAll: true,
        positionId: 'common_role_storeKeeper',
        storeId: this.curStore && this.curStore.id ? this.curStore.id : null
      });
      this.storeKeeperList = data || [];
    },

    async queryList() {
      const params = {
        ...this.page,
        ...this.filter,
        ...this.tabs,
        pcRequest: true,
        storeId: this.curStore && this.curStore.id && !this.filter.storeIdList ? this.curStore.id : null
      };
      try {
        this.loading = true;
        const { data, totalCount } = await services.get(constants.Api.order.valetList, {
          params,
          action: '代客下单'
        });
        this.totalCount = totalCount;
        this.list = data;
      } finally {
        this.loading = false;
      }
    },

    handleFilter(params) {
      if (params.paymentMethod !== this.filter.paymentMethod) {
        this.filter = this.$plain(params);
        this.tabs = this.orderStatusTabs[0].params;
      }
      this.filter = this.$plain(params);

      this.page.pageNo = 1;

      this.queryList();
    },

    onSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.page.pageNo = 1;

      this.queryList();
    },

    onPageChange(pageNo) {
      this.page.pageNo = pageNo;

      this.queryList();
    },

    handleTabClick(params) {
      this.page.pageNo = 1;
      this.tabs = params;
      this.queryList();
    }
  }
};
</script>

<style lang="less" scoped>
.filter-container {
  background: #ffffff;
}

.opt-box,
.container {
  position: relative;
}

.order-tabs {
  margin: 20px 0 10px;
}

.opt-box {
  padding-bottom: 0;
}
</style>