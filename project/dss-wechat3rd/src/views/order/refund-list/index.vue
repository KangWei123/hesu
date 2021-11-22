<template>
  <div class="wkb-order-list">
    <order-filter @filter="onFilter"
                  class="wkt-opt-label-container"
                  filter-type='refund-order'
                  :guide-list="guideList" />
    <div class="order-list-box">
      <el-tabs v-model="orderStatusName" class="order-tab " @tab-click="handleOderStatusTabClick">
        <el-tab-pane label="所有订单" name="all"> </el-tab-pane>

        <el-tab-pane label="申请退款" :name="this.orderTab.REFUNDLIST.STATUS.REQUEST_REFUND.name"> </el-tab-pane>

        <el-tab-pane label="退款中" :name="this.orderTab.REFUNDLIST.STATUS.REFUND.name"> </el-tab-pane>

        <el-tab-pane label="退款完成" :name="this.orderTab.REFUNDLIST.STATUS.REFUND_SUCCESS.name"> </el-tab-pane>

        <el-tab-pane label="退款失败" :name="this.orderTab.REFUNDLIST.STATUS.REFUND_FAILED.name"> </el-tab-pane>
      </el-tabs>
      <order-list-table v-loading="loading"
                        show-patch
                        filter-type='refund-order'
                        :order-tab="orderStatusName"
                        :order-list="orderList"
                        :isPowerExport="isPowerExport"
                        :is-refund="true"
                        :show-shop-guide-info="true"
                        @refresh="handleRefresh"
                        :params='patchParams' />

      <el-pagination v-if="totalOrderCount"
                     layout="prev, pager, next, jumper, sizes, total"
                     hide-on-single-page
                     :total="totalOrderCount"
                     :page-size="pageParams.pageSize"
                     :current-page="pageParams.pageNo"
                     :page-sizes="[5, 10, 20,50, 100, 500]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"
                     class="wkt-pagination">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';

import orderListTable from '../order-list/order-list-table.vue';
import orderFilter from '../orderFilter.vue';

import settingApi from '@/dss-wechat3rd/src/api/settings.js';
import scopeMenuEnum from '@/business-common/scopeMenuEnum.js';
import { mapState } from 'vuex';

export default {
  components: {
    orderListTable,
    orderFilter
  },

  data() {
    return {
      loading: false,
      isPowerExport: true,
      orderTab: orderStatusEnum,
      orderStatusName: this.$route.query.orderStatusName || 'all',
      orderList: [],
      pageParams: {
        pageSize: 5,
        pageNo: 1
      },
      totalOrderCount: 0,
      patchParams: null,
      filterParams: null, //条件查询参数
      guideList: [] // 导购列表
    };
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.refundList(); // 获取退款列表
    });
  },

  computed: {
    ...mapState({
      curStore: state => state.curStore,
      wkbScopeMenu: 'wkbScopeMenu',
      roleList: 'roleList'
    })
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        this.queryUserPower();
      }
    }
  },
  mounted() {
    this.fetchShopGuideList();
  },
  methods: {
    queryUserPower() {
      if (this.wkbScopeMenu) {
        const refundOrderButton = scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.refundOrderButton;

        const scopeImportRefundOrder = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          refundOrderButton.import_refund_order
        );
        this.isPowerExport = !!scopeImportRefundOrder && !!scopeImportRefundOrder.status;
      }
    },
    getStatus(params, status) {
      status.forEach((item, index) => {
        params['integerList[' + index + ']'] = item;
      });
      return params;
    },

    // 查询退款列表
    refundList() {
      this.loading = true;

      let params = { ...this.pageParams };

      switch (this.orderStatusName) {
        case 'all':
          params = Object.assign({ integerList: null }, params);
          break;
        case this.orderTab.REFUNDLIST.STATUS.REQUEST_REFUND.name:
          params = this.getStatus(params, this.orderTab.REFUNDLIST.STATUS.REQUEST_REFUND.value);
          break;
        case this.orderTab.REFUNDLIST.STATUS.REFUND.name:
          params = this.getStatus(params, this.orderTab.REFUNDLIST.STATUS.REFUND.value);
          break;
        case this.orderTab.REFUNDLIST.STATUS.REFUND_SUCCESS.name:
          params = this.getStatus(params, this.orderTab.REFUNDLIST.STATUS.REFUND_SUCCESS.value);
          break;
        case this.orderTab.REFUNDLIST.STATUS.REFUND_FAILED.name:
          params = this.getStatus(params, this.orderTab.REFUNDLIST.STATUS.REFUND_FAILED.value);
          break;
      }

      // 判断是否有查询条件
      if (this.filterParams) {
        params = { ...params, ...this.filterParams };
      }
      this.patchParams = params;
      services
        .get(constants.Api.order.refundList, {
          params,
          action: '退款列表'
        })
        .done(res => {
          this.orderList = res.data || [];
          this.totalOrderCount = res.totalCount;
        })
        .always(() => {
          this.loading = false;
        });
    },

    // 点击导航条查询订单列表
    handleOderStatusTabClick(tab, event) {
      this.pageParams.pageNo = 1;
      this.refundList();
    },
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.refundList();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.refundList();
    },

    // 根据查询条件查询退款列表
    onFilter(filterParams) {
      this.pageParams.pageNo = 1;
      this.filterParams = filterParams;
      this.refundList();
    },

    // 刷新退款列表
    handleRefresh() {
      this.refundList();
    },

    // 查询导购列表
    fetchShopGuideList() {
      const params = {
        queryAll: true
      };
      if (this.curStore && this.curStore.id) params.storeId = this.curStore.id;
      settingApi
        .getShopGuide(params)
        .then(res => {
          this.guideList = res.data || [];
        })
        .catch(() => {
          this.guideList = [];
        });
    }
  }
};
</script>

<style lang="less"></style>
