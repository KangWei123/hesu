<template>
  <div class="wkb-order-list">
    <order-filter @filter="onFilter"
                  class="wkt-opt-label-container"
                  :filter-type='goodsType.type' />
    <div class="order-list-box">
      <el-tabs v-model="orderStatusName"
               class="order-tab"
               style="top:4px"
               @tab-click="handleOderStatusTabClick">

        <el-tab-pane :label="orderTab.MICRO_ORDER.STATUS.WAIT_REVIEW.label"
                     :name="orderTab.MICRO_ORDER.STATUS.WAIT_REVIEW.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.MICRO_ORDER.STATUS.WAIT_PAY.label"
                     :name="orderTab.MICRO_ORDER.STATUS.WAIT_PAY.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.MICRO_ORDER.STATUS.TRANSFER.label"
                     :name="orderTab.MICRO_ORDER.STATUS.TRANSFER.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.MICRO_ORDER.STATUS.WAIT_DELIVERED.label"
                     :name="orderTab.MICRO_ORDER.STATUS.WAIT_DELIVERED.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.MICRO_ORDER.STATUS.SUCCESS.label"
                     :name="orderTab.MICRO_ORDER.STATUS.SUCCESS.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.MICRO_ORDER.STATUS.CANCELED.label"
                     :name="orderTab.MICRO_ORDER.STATUS.CANCELED.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.MICRO_ORDER.STATUS.ALL.label"
                     :name="orderTab.MICRO_ORDER.STATUS.ALL.name">
        </el-tab-pane>

      </el-tabs>

      <order-list-table v-loading="loading"
                        show-patch
                        @refresh="handleRefresh"
                        :order-tab="orderStatusName"
                        :order-list="orderList"
                        :params='patchParams' />

      <el-pagination v-if="totalCount"
                     layout="prev, pager, next, jumper, sizes, total"
                     :total="totalCount"
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
import api from '@/dss-wechat3rd/src/api/micro-order.js';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';

import orderListTable from '../micro-order/list/order-list-table.vue';
import orderFilter from '../orderFilter.vue';

export default {
  props: {
    //商品类型
    goodsType: {
      type: Object
    }
  },
  components: {
    orderListTable,
    orderFilter
  },

  data() {
    return {
      loading: false,
      orderTab: orderStatusEnum,
      orderStatusName: orderStatusEnum.MICRO_ORDER.STATUS.WAIT_REVIEW.name, //tab订单查询状态

      orderList: [],
      pageParams: {
        pageSize: 5,
        pageNo: 1
      },
      totalCount: 0,
      patchParams: null,
      filterParams: null, // 条件查询参数
      remainTimeInterval: null //定时器
    };
  },

  methods: {
    // 查询订单列表
    listOrders() {
      let params = {};

      this.loading = true;
      switch (this.orderStatusName) {
        case this.orderTab.MICRO_ORDER.STATUS.WAIT_REVIEW.name:
          params = Object.assign({ status: this.orderTab.MICRO_ORDER.STATUS.WAIT_REVIEW.value }, params);
          break;
        case this.orderTab.MICRO_ORDER.STATUS.WAIT_PAY.name:
          const statusList = [
            this.orderTab.MICRO_ORDER.STATUS.WAIT_PAY.value,
            this.orderTab.MICRO_ORDER.STATUS.WAIT_ORDER.value
          ];
          statusList.forEach((item, index) => {
            params['statusList[' + index + ']'] = item;
          });
          break;
        case this.orderTab.MICRO_ORDER.STATUS.TRANSFER.name:
          params = Object.assign({ status: this.orderTab.MICRO_ORDER.STATUS.TRANSFER.value }, params);
          break;
        case this.orderTab.MICRO_ORDER.STATUS.WAIT_DELIVERED.name:
          params = Object.assign({ status: this.orderTab.MICRO_ORDER.STATUS.WAIT_DELIVERED.value }, params);
          break;
        case this.orderTab.MICRO_ORDER.STATUS.SUCCESS.name:
          params = Object.assign({ status: this.orderTab.MICRO_ORDER.STATUS.SUCCESS.value }, params);
          break;
        case this.orderTab.MICRO_ORDER.STATUS.CANCELED.name:
          params = Object.assign({ status: this.orderTab.MICRO_ORDER.STATUS.CANCELED.value }, params);
          break;
      }

      params = { ...params, ...this.pageParams };
      if (this.filterParams) {
        params = { ...params, ...this.filterParams };
      }
      this.patchParams = params;

      // 清空订单列表
      this.orderList = [];
      this.totalCount = 0;

      api
        .orderList(params)
        .done(res => {
          const orderList = res.data || [];
          orderList.forEach(order => {
            order.checked = false;
          });
          this.orderList = orderList;
          this.totalCount = res.totalCount;
        })
        .always(res => {
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
      console.log('filterParams---->', filterParams);
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
