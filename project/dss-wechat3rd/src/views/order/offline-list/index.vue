<template>
  <div class="wkb-order-list">
    <order-filter @filter="onFilter"
                  class="wkt-opt-label-container"
                  filter-type='offline' />
    <div class="order-list-box">
      <el-tabs v-model="orderStatusName"
               class="order-tab"
               @tab-click="handleOderStatusTabClick">

        <el-tab-pane :label="orderTab.ORDER.STATUS.ALL.label"
                     :name="orderTab.ORDER.STATUS.ALL.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.ORDER.STATUS.WAIT_PAY.label"
                     :name="orderTab.ORDER.STATUS.WAIT_PAY.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.ORDER.STATUS.WAIT_SHIP.label"
                     :name="orderTab.ORDER.STATUS.WAIT_SHIP.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.ORDER.STATUS.WAIT_DELIVERED.label"
                     :name="orderTab.ORDER.STATUS.WAIT_DELIVERED.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.ORDER.STATUS.SUCCESS.label"
                     :name="orderTab.ORDER.STATUS.SUCCESS.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.ORDER.STATUS.CANCELED.label"
                     :name="orderTab.ORDER.STATUS.CANCELED.name">
        </el-tab-pane>

      </el-tabs>

      <order-list-table v-loading="loading"
                        show-patch
                        @refresh="handleRefresh"
                        :isPowerExport="isPowerExport"
                        :order-tab="orderStatusName"
                        :order-list="orderList"
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
import regexps from '@/dss-common/utils/regexps';

import constants from '@/dss-wechat3rd/src/constants/index';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';

import orderListTable from '../order-list/order-list-table.vue';
import orderFilter from '../orderFilter.vue';
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
      orderStatusName: this.$route.query.orderStatusName || orderStatusEnum.ORDER.STATUS.ALL.name, //tab订单查询状态

      orderList: [],
      pageParams: {
        pageSize: 5,
        pageNo: 1
      },
      totalOrderCount: 0,
      patchParams: null,
      filterParams: null, // 条件查询参数
      remainTimeInterval: null //定时器
    };
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.listOrders(); // 获取线下订单列表
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
  methods: {
    queryUserPower() {
      if (this.wkbScopeMenu) {
        const offlineOrderButton = scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.offlineOrderButton;

        const scopeImportOfflineOrder = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          offlineOrderButton.import_offline_order
        );
        this.isPowerExport = !!scopeImportOfflineOrder && !!scopeImportOfflineOrder.status;
      }
    },
    // 查询订单列表
    listOrders() {
      if (!!this.remainTimeInterval) {
        clearInterval(this.remainTimeInterval); // 清空定时器
      }

      this.loading = true;
      let params = {};
      switch (this.orderStatusName) {
        case this.orderTab.ORDER.STATUS.WAIT_PAY.name:
          params = Object.assign({ orderStatus: this.orderTab.ORDER.STATUS.WAIT_PAY.value }, params);
          break;
        case this.orderTab.ORDER.STATUS.WAIT_SHIP.name:
          params = Object.assign({ orderStatus: this.orderTab.ORDER.STATUS.WAIT_SHIP.value }, params);
          break;
        case this.orderTab.ORDER.STATUS.WAIT_DELIVERED.name:
          params = Object.assign({ orderStatus: this.orderTab.ORDER.STATUS.WAIT_DELIVERED.value }, params);
          break;
        case this.orderTab.ORDER.STATUS.SUCCESS.name:
          params = Object.assign({ orderStatus: this.orderTab.ORDER.STATUS.SUCCESS.value }, params);
          break;
        case this.orderTab.ORDER.STATUS.CANCELED.name:
          params = Object.assign({ orderStatus: this.orderTab.ORDER.STATUS.CANCELED.value }, params);
          break;
      }

      params = { ...params, ...this.pageParams };
      if (this.filterParams) {
        params = { ...params, ...this.filterParams };
      }
      params.tag2 = 64; //线下订单标识
      this.patchParams = params;
      // 清空订单列表
      this.orderList = [];
      this.totalOrderCount = 0;

      services
        .get(constants.Api.order.list, {
          params,
          action: '订单列表'
        })
        .done(res => {
          const orderList = res.data || [];
          orderList.forEach(order => {
            order.checked = false;
          });
          this.orderList = orderList; // 重新赋值是为了避免切换查询条件的时候会短暂保留原数据的bug
          if (params.preSell) {
            //预售剩余时间倒计时
            this.remainTimeInterval = setInterval(() => {
              let isClearInterval = false; // 是否清空定时器
              //订单列表，复制父组件传值过来的订单列表，以便于进行剩余时间倒数
              this.orderList = orderList.map(item => {
                //判断剩余时间是否存在
                if (!!item.countdown && item.countdown > 0) {
                  item.countdown--;
                  if (item.countdown > 0) {
                    isClearInterval = true;
                  }
                  return item;
                } else {
                  item.countdown = 0; //若无剩余时间，则默认设置为已到期
                  return item;
                }
              });
              if (!isClearInterval) {
                clearInterval(this.remainTimeInterval); // 清空定时器
              }
            }, 1000);
          }
          //console.log('订单列表: ' + JSON.stringify(this.orderList));
          this.totalOrderCount = res.totalCount;
        })
        .always(() => {
          this.loading = false;
        });
    },

    // 清空订单列表
    processEmpty() {
      this.orderList = [];
      this.totalOrderCount = 0;
      this.loading = false;
    },

    // 点击导航条查询订单列表
    handleOderStatusTabClick(tab, event) {
      this.pageParams.pageNo = 1;
      this.listOrders();
    },

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.listOrders();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.listOrders();
    },

    // 根据查询条件查询订单列表
    onFilter(filterParams) {
      this.pageParams.pageNo = 1;
      this.filterParams = filterParams;
      this.listOrders();
    },

    // 刷新订单列表
    handleRefresh() {
      console.log('handleRefresh');
      this.listOrders();
    }
  },

  mounted() {
    //判断是否跳到指定列表
    if (this.$route.query.orderStatusName) {
      this.orderStatusName = this.$route.query.orderStatusName;
    }
    // 查询订单列表
    this.listOrders();
  },

  destroyed() {
    if (!!this.remainTimeInterval) {
      clearInterval(this.remainTimeInterval); // 清空定时器
    }
  }
};
</script>

<style lang="less">
</style>
