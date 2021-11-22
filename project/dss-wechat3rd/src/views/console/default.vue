<template>
  <div class="left">
    <div class="trip-warn" v-if="tripWarnCount">
      <span class="warn-icon-box">
        <i class="warn-icon el-icon-warning-outline"></i>
      </span>
      <span class="warn-desc">消息提醒：自动化营销异常旅程</span>
      <span class="warn-desc warn-count">({{ tripWarnCount }})</span>
    </div>
    <dashbord :fields="target">
      <template #title>今日销售指标</template>
    </dashbord>
    <dashbord :fields="orderTarget">
      <template #title>今日订单指标</template>
    </dashbord>
    <dashbord :fields="memberTarget">
      <template #title>今日会员指标</template>
    </dashbord>
    <div class="common-usefun">
      <div class="_title">常用功能</div>
      <div class="_body">
        <el-row :gutter="20">
          <template v-for="(item, index) in comUseList">
            <el-col
              :span="6"
              class="el-col"
              v-if="(item.isNotManagerShow || isEnterpriseManager) && (item.estateShow || !env.ESTATE)"
              :key="index"
            >
              <el-popover
                v-if="!allowEnter"
                placement="top-start"
                width="150"
                trigger="hover"
                content="该角色暂无权限访问"
              >
                <div slot="reference" class="agency-tab" style="cursor: not-allowed">
                  <span class="name">{{
                    item.url === '/console.html#/companyManage/printer/store' && env.ESTATE ? '组织管理' : item.name
                  }}</span>
                  <span class="arrow el-icon-caret-right"></span>
                </div>
              </el-popover>
              <div class="agency-tab" v-if="allowEnter" @click="clickComUse(item)">
                <span class="name">{{ item.name }}</span>
                <span class="arrow el-icon-caret-right"></span>
              </div>
            </el-col>
          </template>
        </el-row>
      </div>
    </div>
    <div class="agency-affairs">
      <div class="_title">待办事宜</div>
      <div class="_body">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item, index) in agency" :key="index">
            <el-popover
              v-if="index < 4 && !allowEnter"
              placement="top-start"
              width="150"
              trigger="hover"
              content="该角色暂无权限访问"
            >
              <div slot="reference" class="agency-tab" style="cursor: not-allowed">
                <span class="key">{{ item.name }}</span>
                <span class="value">{{ item.value }}</span>
              </div>
            </el-popover>
            <div class="agency-tab" v-if="index < 4 && allowEnter" @click="clickAgency(item)">
              <span class="key">{{ item.name }}</span>
              <span class="value">{{ item.value }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px" v-if="agency.length > 4">
          <el-col :span="6" v-for="(item, index) in agency" :key="index">
            <el-popover
              v-if="index > 4 && !allowEnter"
              placement="top-start"
              width="150"
              trigger="hover"
              content="该角色暂无权限访问"
            >
              <div slot="reference" class="agency-tab" style="cursor: not-allowed">
                <span class="key">{{ item.name }}</span>
                <span class="value">{{ item.value }}</span>
              </div>
            </el-popover>
            <div class="agency-tab" v-if="index > 4 && allowEnter" @click="clickAgency(item)">
              <span class="key">{{ item.name }}</span>
              <span class="value">{{ item.value }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- <div class="data-analysis">
      <div class="_title">数据报表</div>
      <el-popover
        v-if="!allowEnter"
        placement="top-start"
        width="150"
        trigger="hover"
        content="该角色暂无权限访问"
        style="margin-right: 60px"
      >
        <div slot="reference" class="analysis-item" style="cursor: not-allowed">
          <div class="item-icon-box">
            <img class="item-icon" src="../../images/console/icon-sale.png" />
          </div>
          <span class="item-name">销售概览</span>
        </div>
      </el-popover>
      <div class="analysis-item" v-else @click="gotoSale">
        <div class="item-icon-box">
          <img class="item-icon" src="../../images/console/icon-sale.png" />
        </div>
        <span class="item-name">销售概览</span>
      </div>
      <el-popover v-if="!allowEnter" placement="top-start" width="150" trigger="hover" content="该角色暂无权限访问">
        <div slot="reference" class="analysis-item" style="cursor: not-allowed">
          <div class="item-icon-box">
            <img class="item-icon" src="../../images/console/icon-sale.png" />
          </div>
          <span class="item-name">小程序概览</span>
        </div>
      </el-popover>
      <div class="analysis-item" v-else @click="gotoMa">
        <div class="item-icon-box">
          <img class="item-icon" src="../../images/console/icon-ma.png" />
        </div>
        <span class="item-name">小程序概览</span>
      </div>
      <el-popover
        v-if="!allowEnter"
        placement="top-start"
        width="150"
        trigger="hover"
        content="该角色暂无权限访问"
        style="margin-right: 60px"
      >
        <div slot="reference" class="analysis-item" style="cursor: not-allowed">
          <div class="item-icon-box">
            <img class="item-icon" src="../../images/console/icon-sale.png" />
          </div>
          <span class="item-name">会员概览</span>
        </div>
      </el-popover>
      <div class="analysis-item" v-else @click="gotoMember">
        <div class="item-icon-box">
          <img class="item-icon" src="../../images/console/icon-member.png" />
        </div>
        <span class="item-name">会员概览</span>
      </div>
    </div> -->
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import moneyUtil from '@/dss-common/utils/money';
  import config from './config';
  import api from '@/dss-wechat3rd/src/api';
  import tripWarnApi from '@/dss-common/api/tripWarnApi';
  import sellerDashboardApi from '@/dss-wechat3rd/src/api/seller_dashboard';
  import Dashbord from './components/dashbord.vue';
  import './index.less';

  export default {
    components: {
      Dashbord,
    },
    props: {
      onReady: {
        type: Function,
        default: function () {},
      },
    },
    data() {
      return {
        // 今日关键指标
        orderStatisticDTO: {
          productOrderCount: 0, // 购物订单数
          scheduleOrderCount: 0, // 预约订单数
          totalChargeMoney: 0, // 订单总储值金额
          totalMoney: 0, // 订单金额总数
          totalOrder: 0, // 订单总数
          totalUser: 0, // 订单总用户数
        },
        // 代办事宜
        toDoListDTO: {
          toRefundOrder: 0, // 待退款订单
          toServicesOrder: 0, // 待服务的预约订单
          toShippingOrder: 0, // 待发货的预约订单
          toClientMessage: 0, // 待处理客户消息
        },

        target: [],
        orderTarget: [],
        memberTarget: [],
        agency: [],
        allowEnter: true,
        // 常用功能
        comUseList: [
          {
            name: '新建商品',
            url: '/wkb.html#/retail/goods-mgr/product/list/add?labelType=1',
            isNotManagerShow: true,
            estateShow: false,
          },
          {
            name: '商品列表',
            url: '/wkb.html#/retail/goods-mgr/product/list',
            isNotManagerShow: true,
            estateShow: false,
          },
          {
            name: '门店上下架',
            url: '/wkb.html#/retail/goods-mgr/shelf/goods-shelf',
            isNotManagerShow: true,
            estateShow: false,
          },
          { name: '商品订单', url: '/wkb.html#/order/list', isNotManagerShow: true, estateShow: false },
          {
            name: '门店管理',
            url: '/console.html#/companyManage/printer/store',
            isNotManagerShow: false,
            estateShow: true,
          },
          // { name: '经销商商户号', url: '/system-setting.html#/sorting', isNotManagerShow: false, estateShow: true },
          { name: '素材中心', url: '/dsp.html#/materials/graphic/list', isNotManagerShow: true, estateShow: true },
          { name: '优惠券', url: '/wkb.html#/marketing/coupon/coupon-list', isNotManagerShow: true, estateShow: true },
          {
            name: '小程序主页',
            url: '/wkb.html#/setting/homedecorate/mini-index/template',
            isNotManagerShow: true,
            estateShow: true,
          },
          {
            name: '品牌设置',
            url: '/console.html#/brand-setting/basic-data',
            isNotManagerShow: false,
            estateShow: true,
          },
        ],
        // 旅程预警数目
        tripWarnCount: 0,
      };
    },
    computed: {
      ...mapState({
        curApp: 'curApp',
        curStore: 'curStore',
        roleList: 'roleList',
        wkbScopeMenu: 'wkbScopeMenu',
        env: 'env',
      }),
      // 是否企业管理员
      isEnterpriseManager() {
        return !!this.roleList && this.roleList.split(',').indexOf('common_role_enterprise') !== -1;
      },
    },
    mounted() {
      this.getTripWarnCount();
      if (this.curApp) {
        this.fillTargetAndAgency();
        this.queryDashBoard();
      }
    },
    watch: {
      '$store.state.curStore'(store) {
        if (store) {
          this.queryDashBoard();
        }
      },
      '$store.state.curApp'() {
        this.fillTargetAndAgency();
        this.queryDashBoard();
      },
      wkbScopeMenu: {
        immediate: true,
        handler(newVal, oldval) {
          if (newVal && newVal[0]) {
            newVal[0].childMenu.forEach(item => {
              if (item.identifier == 'console') {
                if (item.isHasPermission == 0) {
                  this.allowEnter = false;
                } else {
                  this.allowEnter = true;
                }
              }
            });
          }
        },
      },
    },
    methods: {
      clickAgency(item) {
        if (item.key === 'toClientMessage') {
          location.href = location.protocol + '//' + location.host + '/dsp.html#' + item.url;
          return false;
        }
        if (this.allowEnter) {
          this.$router.push({ path: item.url });
        }
      },
      clickComUse(item) {
        if (item.url) {
          window.location.href = item.url;
          // this.$router.push(item.url);
        }
      },
      hasScrollbar() {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      },
      gotoSale() {
        if (this.allowEnter) {
          window.location.href = '/da.html#/sales/realtime-overview';
        }
      },
      gotoMember() {
        if (this.allowEnter) {
          window.location.href = '/da.html#/da-member/overview';
        }
      },
      gotoMa() {
        if (this.allowEnter) {
          window.location.href = '/da.html#/ma/Apply';
        }
      },
      fillTargetAndAgency() {
        this.target = config.getTodayTargets();
        this.orderTarget = config.getTodayOrderTargets();
        this.memberTarget = config.getTodayMemberTargets();
        this.agency = config.getAllAgency();
      },
      // 去购买
      toBuy() {
        if (this.allowEnter) {
          window.location.href = '/console.html#/brand-setting/function-buy/homepage';
        }
      },
      // 控制台运营信息
      queryDashBoard() {
        const process = (collect, source) => {
          collect.forEach(item => {
            if (source.hasOwnProperty(item.key)) {
              if (item.moneyFormat && item.key === 'totalChargeMoney') {
                item.value = moneyUtil.convertHundredMoneyUnit(source[item.key], true) || '0.00';
              } else {
                item.value = source[item.key];
              }
            }
          });
        };

        api
          .queryDashBoard({
            appId: this.curApp.id,
            storeId: this.curStore ? this.curStore.id : null,
          })
          .then(res => {
            const { orderStatisticDTO, toDoListDTO } = res.data;

            if (orderStatisticDTO) {
              process(this.orderTarget, orderStatisticDTO);
              process(this.target, orderStatisticDTO);
              process(this.memberTarget, orderStatisticDTO);
            }
            if (toDoListDTO) {
              process(this.agency, toDoListDTO);
            }
          })
          .then(data => {
            return api.getClientMessage();
          })
          .then(res => {
            const unReadTotal = res.data && res.data.unReadTotal;
            if (unReadTotal) {
              const index = this.agency.findIndex(item => {
                return item.key === 'toClientMessage';
              });
              this.agency[index].value = unReadTotal;
            }
          })
          .catch(res => {
            if (res.message === '微信号未绑定') {
              const index = this.agency.findIndex(item => item.key === 'toClientMessage');
              ~index && this.agency.splice(index, 1);
            }
          })
          .always(res => {
            this.onReady();
          });

        /** 查询订单总数和金额 */
        sellerDashboardApi
          .orderOverview_Today({
            storeId: this.curStore ? this.curStore.id : null,
            pageSize: 110,
            pageNo: 1,
          })
          .then(res => {
            const data = res.data[0] || {};

            const obj = {
              totalSaleFee: (data.saleFee || 0).toFixed(2),
              totalOrderCnt: data.orderCnt || 0,
            };

            process(this.orderTarget, obj);
            process(this.target, obj);
          });
      },

      /**
       * 获取旅程预警数目
       */
      getTripWarnCount() {
        tripWarnApi.getTripWarnCount().then(res => {
          this.tripWarnCount = res.data || 0;
        });
      },
    },
  };
</script>
<style lang="less" scoped></style>
