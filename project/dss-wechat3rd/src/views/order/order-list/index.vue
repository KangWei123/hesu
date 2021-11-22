<template>
  <div class="wkb-order-list">
    <order-filter
      v-if="Object.keys(marketingType).length === 0"
      :guide-list="guideList"
      @filter="onFilter"
      class="wkt-opt-label-container"
      filter-type="order"
    />
    <marketing-order-filter v-else @filter="onFilter" class="wkt-opt-label-container" filter-type="order" />
    <div class="order-list-box">
      <el-tabs v-model="orderStatusName" class="order-tab" @tab-click="handleOderStatusTabClick">
        <el-tab-pane :label="orderTab.ORDER.STATUS.ALL.label" :name="orderTab.ORDER.STATUS.ALL.name"> </el-tab-pane>

        <el-tab-pane :label="orderTab.ORDER.STATUS.WAIT_PAY.label" :name="orderTab.ORDER.STATUS.WAIT_PAY.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.ORDER.STATUS.WAIT_CHECK.label" :name="orderTab.ORDER.STATUS.WAIT_CHECK.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.ORDER.STATUS.WAIT_SHIP.label" :name="orderTab.ORDER.STATUS.WAIT_SHIP.name">
        </el-tab-pane>

        <el-tab-pane
          :label="orderTab.ORDER.STATUS.WAIT_DELIVERED.label"
          :name="orderTab.ORDER.STATUS.WAIT_DELIVERED.name"
        >
        </el-tab-pane>

        <el-tab-pane :label="orderTab.ORDER.STATUS.SUCCESS.label" :name="orderTab.ORDER.STATUS.SUCCESS.name">
        </el-tab-pane>

        <el-tab-pane :label="orderTab.ORDER.STATUS.CANCELED.label" :name="orderTab.ORDER.STATUS.CANCELED.name">
        </el-tab-pane>
      </el-tabs>

      <order-list-table
        v-loading="loading"
        show-patch
        :filter-pre-sell="!!filterParams && !!filterParams.preSell"
        @refresh="handleRefresh"
        :order-tab="orderStatusName"
        :order-list="orderList"
        :marketing-type="marketingType"
        :params="patchParams"
        :show-shop-guide-info="true"
        :is-power-export="isPowerExport"
        @handleShowDetail="handleShowDetail"
        filter-type="order"
      />

      <el-pagination
        v-if="totalOrderCount"
        hide-on-single-page
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalOrderCount"
        :page-size="pageParams.pageSize"
        :current-page="pageParams.pageNo"
        :page-sizes="[5, 10, 20, 50, 100, 500]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="wkt-pagination"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import services from '@/dss-common/utils/services';

  import constants from '@/dss-wechat3rd/src/constants/index';
  import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';

  import orderListTable from './order-list-table.vue';
  import orderFilter from '../orderFilter.vue';
  import marketingOrderFilter from '../marketingOrderFilter.vue';

  import settingApi from '@/dss-wechat3rd/src/api/settings';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import { mapState } from 'vuex';

  export default {
    components: {
      orderListTable,
      orderFilter,
      marketingOrderFilter,
    },

    props: {
      marketingType: {
        type: [Object, Array],
        default() {
          return {};
        },
      },
    },

    data() {
      return {
        loading: false,
        isPowerExport: true,
        orderTab: orderStatusEnum,
        orderStatusName: this.$route.query.orderStatusName || orderStatusEnum.ORDER.STATUS.ALL.name, // tab订单查询状态

        orderList: [],
        pageParams: {
          pageSize: 5,
          pageNo: 1,
        },
        totalOrderCount: 0,
        patchParams: null, // 批量导出参数
        filterParams: null, // 条件查询参数
        remainTimeInterval: null, // 定时器,
        guideList: [], // 导购列表
      };
    },
    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.listOrders(); // 获取订单列表
      });
    },

    computed: {
      ...mapState({
        curStore: state => state.curStore,
        wkbScopeMenu: 'wkbScopeMenu',
        roleList: 'roleList',
      }),
    },
    watch: {
      wkbScopeMenu: {
        immediate: true,
        handler() {
          this.queryUserPower();
        },
      },
    },
    methods: {
      queryUserPower() {
        if (this.wkbScopeMenu) {
          const goodsOrderButton = scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.goodsOrderButton;

          const scopeImportGoodsOrder = scopeMenuEnum.getMenuScopeByIdentifier(
            this.wkbScopeMenu,
            goodsOrderButton.import_goods_order
          );
          this.isPowerExport = !!scopeImportGoodsOrder && !!scopeImportGoodsOrder.status;
        }
      },
      // 查询订单列表
      listOrders() {
        if (this.remainTimeInterval) {
          clearInterval(this.remainTimeInterval); // 清空定时器
        }

        this.loading = true;
        let params = {};

        switch (this.orderStatusName) {
          case this.orderTab.ORDER.STATUS.WAIT_PAY.name:
            params = Object.assign({ orderStatus: this.orderTab.ORDER.STATUS.WAIT_PAY.value }, params);
            break;
          case this.orderTab.ORDER.STATUS.WAIT_SHIP.name:
            params = Object.assign(
              {
                'orderStatusList[0]': this.orderTab.ORDER.STATUS.WAIT_SHIP.value,
                'orderStatusList[1]': this.orderTab.ORDER.STATUS.WAIT_OFF.value,
                'orderStatusList[2]': this.orderTab.ORDER.STATUS.WAIT_DELIVERY_MAN.value,
              },
              params
            );
            break;
          case this.orderTab.ORDER.STATUS.WAIT_DELIVERED.name:
            params = Object.assign(
              {
                'orderStatusList[0]': this.orderTab.ORDER.STATUS.WAIT_DELIVERED.value,
                'orderStatusList[2]': this.orderTab.ORDER.STATUS.DELIVERING.value,
              },
              params
            );
            break;
          case this.orderTab.ORDER.STATUS.SUCCESS.name:
            params = Object.assign({ orderStatus: this.orderTab.ORDER.STATUS.SUCCESS.value }, params);
            break;
          case this.orderTab.ORDER.STATUS.CANCELED.name:
            params = Object.assign({ orderStatus: this.orderTab.ORDER.STATUS.CANCELED.value }, params);
            break;
          case this.orderTab.ORDER.STATUS.WAIT_CHECK.name:
            params = Object.assign(
              {
                'orderStatusList[92]': this.orderTab.ORDER.STATUS.WAIT_CHECK.value,
                'orderStatusList[93]': this.orderTab.ORDER.STATUS.WAIT_CHECK.value2,
              },
              params
            );
            break;
        }

        params = { ...params, ...this.pageParams };
        if (this.filterParams) {
          params = { ...params, ...this.filterParams };
        }

        if (Object.keys(this.marketingType).length !== 0) {
          if (this.marketingType.type === 'seckill') {
            params.marketingID = orderStatusEnum.MARKETING_ORDER.SECKILL.value;
          }
          // 促销活动
          if (this.marketingType.value === orderStatusEnum.MARKETING_ORDER.XYFOLD.value) {
            params.marketingID = orderStatusEnum.MARKETING_ORDER.XYFOLD.type;
            params.marketingTag = orderStatusEnum.MARKETING_ORDER.XYFOLD.tag;
          }
          if (this.marketingType.value === orderStatusEnum.MARKETING_ORDER.FULLXDISCOUNT.value) {
            params.marketingID = orderStatusEnum.MARKETING_ORDER.FULLXDISCOUNT.type;
            params.marketingTag = orderStatusEnum.MARKETING_ORDER.FULLXDISCOUNT.tag;
          }
          if (this.marketingType.value === orderStatusEnum.MARKETING_ORDER.ONEPRICE.value) {
            params.marketingID = orderStatusEnum.MARKETING_ORDER.ONEPRICE.type;
            params.marketingTag = orderStatusEnum.MARKETING_ORDER.ONEPRICE.tag;
          }
        }

        this.patchParams = params;

        // 清空订单列表
        this.orderList = [];
        this.totalOrderCount = 0;

        services
          .get(constants.Api.order.list, {
            params,
            action: '订单列表',
          })
          .done(res => {
            const orderList = res.data || [];
            orderList.forEach(order => {
              order.checked = false;
              order.offsetCashIntegral = 0;
              order.totalIntegral = order.consumeIntegral;
            });
            this.orderList = orderList; // 重新赋值是为了避免切换查询条件的时候会短暂保留原数据的bug
            // 预售剩余时间倒计时
            this.remainTimeInterval = setInterval(() => {
              // 订单列表，复制父组件传值过来的订单列表，以便于进行剩余时间倒数
              this.orderList = this.orderList.map(item => {
                // 判断剩余时间是否存在
                if (!!item.countdown && item.countdown > 0) {
                  item.countdown--;
                  return item;
                } else {
                  item.countdown = 0; // 若无剩余时间，则默认设置为已到期
                  return item;
                }
              });
              const isClearInterval = orderList.some(item => {
                return !!item.countdown && item.countdown > 0;
              });
              if (!isClearInterval) {
                clearInterval(this.remainTimeInterval); // 清空定时器
              }
            }, 1000);
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
      },

      handleShowDetail(e) {
        this.$emit('handleShowDetail', e);
      },

      // 查询导购列表
      fetchShopGuideList() {
        const params = {
          queryAll: true,
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
      },
    },

    mounted() {
      // 判断是否跳到指定列表
      if (this.$route.query.orderStatusName) {
        this.orderStatusName = this.$route.query.orderStatusName;
      }
      this.fetchShopGuideList();
    },

    destroyed() {
      if (this.remainTimeInterval) {
        clearInterval(this.remainTimeInterval); // 清空定时器
      }
    },
  };
</script>

<style lang="less"></style>
