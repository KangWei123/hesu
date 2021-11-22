import featureIf from '@/dss-wechat3rd/src/constants/featureIf';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';
import appointmentStatusEnum from '@/dss-wechat3rd/src/constants/appointmentStatusEnum';

const config = {
  saletarget: [
    {
      name: '收入金额',
      key: 'totalSaleFee',
      value: '0.00',
      moneyFormat: true,
      quota: 'abc',
      icon: 'icon-console-sale',
    },
    {
      name: '购物金额',
      key: 'totalShop',
      value: '0.00',
      quota: 'abc',
      icon: 'icon-console-sale',
    },
    {
      name: '储值金额',
      key: 'totalChargeMoney',
      value: '0.00',
      moneyFormat: true,
      quota: 'abc',
      icon: 'icon-console-sale',
    },
    {
      name: '退款金额',
      key: 'totalRefund',
      value: '0.00',
      moneyFormat: true,
      quota: 'abc',
      icon: 'icon-console-sale',
    },
  ],
  membertarget: [
    {
      name: '下单会员',
      key: 'totalUser',
      value: '0',
      quota: 'abc',
      icon: 'icon-console-sale',
    },
    {
      name: '新增会员',
      key: 'todayNewUser',
      value: '0',
      quota: 'abc',
      icon: 'icon-console-sale',
    },
  ],
  ordertarget: [
    {
      name: '总订单数',
      key: 'totalOrderCnt',
      value: '0',
      quota: 'abc',
      icon: 'icon-console-order',
    },
    {
      name: '购物订单',
      key: 'productOrderCount',
      value: '0',
      quota: 'abc',
      icon: 'icon-console-order',
    },
    {
      name: '预定订单',
      key: 'scheduleOrderCount',
      value: '0',
      quota: 'abc',
      icon: 'icon-console-order',
    },
    {
      name: '退款订单',
      key: 'refundOrderCount',
      value: '0',
      quota: 'abc',
      icon: 'icon-console-order',
    },
  ],
  agency: [
    {
      name: '待服务的预约订单',
      key: 'toServicesOrder',
      value: '-',
      icon: 'icon-appoint',
      url: '/appoint-mgr',
    },
    {
      name: '待发货订单',
      key: 'toShippingOrder',
      value: '-',
      icon: 'icon-delivery',
      url: '/order/list?orderStatusName=' + orderStatusEnum.ORDER.STATUS.WAIT_SHIP.name,
    },
    {
      name: '待退款订单',
      key: 'toRefundProductOrder',
      value: '-',
      icon: 'icon-refund',
      url: '/refund/list?orderStatusName=' + orderStatusEnum.REFUND.statusName,
    },
    {
      name: '售罄预警',
      key: 'sellOutWarn',
      value: '-',
      icon: 'icon-wran',
      url: '/retail/goods-mgr/product/list',
    },
    {
      name: '已售罄商品',
      key: 'soldOut',
      value: '-',
      icon: 'icon-soldOut',
      url: '/retail/goods-mgr/shelf/goods-shelf',
    },
    {
      name: '待退款的服务订单',
      key: 'toRefundServiceOrder',
      value: '-',
      icon: 'icon-refund',
      url: '/appoint-mgr?scheduledStatusCode=' + appointmentStatusEnum.STATUS.CANCEL.value,
    },
    // {
    //   name: '待处理客户消息',
    //   key: 'toClientMessage',
    //   value: '-',
    //   icon: 'icon-message',
    //   url: '/wechatoa/oa/manage'
    // }
  ],
  target_business: [
    {
      name: '总会员数',
      key: 'totalMemberNum',
      value: '-',
      unit: '个',
      quota: 'abc',
      icon: 'icon-newmember',
      tipKey: 'newMemberNum',
      tip: '-',
      suffix: '个',
      tipIcon: 'el-icon-caret-top',
      tipStatus: 'active',
      itemStyle: {
        backgroundColor: '#50586B',
        // boxShadow: '0px 10px 24px 0px rgba(80,88,107,0.60)',
      },
    },
    {
      name: '线下消费',
      key: 'offlineOrderConsumeAmount',
      value: '0.00',
      unit: '元',
      quota: 'abc',
      moneyFormat: true,
      icon: 'icon-consume',
      tipKey: 'offlineOrderConsumeNum',
      tip: '-',
      suffix: '笔',
      itemStyle: {
        backgroundColor: '#F3883B',
        // boxShadow: '0px 10px 24px 0px rgba(243,136,59,0.60)',
      },
    },
    {
      name: '停车场缴费',
      key: 'orderPayAmount',
      value: '0.00',
      unit: '元',
      quota: 'abc',
      moneyFormat: true,
      icon: 'icon-parking',
      tipKey: 'orderPayNum',
      tip: '-',
      suffix: '笔',
      itemStyle: {
        backgroundColor: '#1AB7A8',
        // boxShadow: '0px 10px 24px 0px rgba(26,183,168,0.60)',
      },
    },
    {
      name: '发放积分',
      key: 'grantScoreNum',
      value: '-',
      unit: '分',
      quota: 'abc',
      icon: 'icon-score',
      tipKey: 'grantScoreOrderNum',
      tip: '-',
      suffix: '笔',
      itemStyle: {
        backgroundColor: '#FFAD29',
        // boxShadow: '0px 10px 24px 0px rgba(255,173,41,0.60)',
      },
    },
    {
      name: '券发放',
      key: 'couponNum',
      value: '-',
      unit: '张',
      quota: 'abc',
      icon: 'icon-score',
      tipKey: 'useProportion',
      tip: '-',
      prefix: '核销率：',
      suffix: '%',
      itemStyle: {
        backgroundColor: '#F3883B',
        // boxShadow: '0px 10px 24px 0px rgba(255,173,41,0.60)',
      },
    },
  ],
  agency_business: [
    {
      name: '待审核拍照积分',
      key: 'unAduitOrderNum',
      value: '-',
      icon: 'icon-refund',
      url: '/largeMemScore/picture/list?status=0',
    },
    {
      name: '待回复意见反馈',
      key: 'unFeedBackNum',
      value: '-',
      icon: 'icon-refund',
      url: '/feedback/list?status=1',
    },
  ],
};

export default {
  /**
   *  今日销售指标
   * @returns {*[]|*}
   */
  getTodayTargets() {
    // "console.target.disable":"totalUser,productOrderCount,scheduleOrderCount"
    const ableKey = featureIf.get(featureIf.keys.CONSOLE_DISABLE_TARGET);
    return !ableKey
      ? config.saletarget
      : config.saletarget.filter(item => {
          return ableKey.indexOf(item.key) === -1;
        });
  },
  /**
   *  今日订单指标
   * @returns {*[]|*}
   */
  getTodayOrderTargets() {
    // "console.target.disable":"totalUser,productOrderCount,scheduleOrderCount"
    const ableKey = featureIf.get(featureIf.keys.CONSOLE_DISABLE_TARGET);
    return !ableKey
      ? config.ordertarget
      : config.ordertarget.filter(item => {
          return ableKey.indexOf(item.key) === -1;
        });
  },
  /**
   *  今日会员指标
   * @returns {*[]|*}
   */
  getTodayMemberTargets() {
    // "console.target.disable":"totalUser,productOrderCount,scheduleOrderCount"
    const ableKey = featureIf.get(featureIf.keys.CONSOLE_DISABLE_TARGET);
    return !ableKey
      ? config.membertarget
      : config.membertarget.filter(item => {
          return ableKey.indexOf(item.key) === -1;
        });
  },
  /**
   * 查询所有的待办事宜
   * @returns {*[]|*}
   */
  getAllAgency() {
    // "console.agency.disable":"toServicesOrder,toRefundServiceOrder"
    const ableKey = featureIf.get(featureIf.keys.CONSOLE_DISABLE_AGENCY);
    return !ableKey
      ? config.agency
      : config.agency.filter(item => {
          return ableKey.indexOf(item.key) === -1;
        });
  },
  /**
   *  今日销售指标
   * @returns {*[]|*}
   */
  getStatistics() {
    const ableKey = featureIf.get(featureIf.keys.CONSOLE_DISABLE_TARGET_BUSINESS);
    return !ableKey
      ? config.target_business
      : config.target_business.filter(item => {
          return ableKey.indexOf(item.key) === -1;
        });
  },
  /**
   * 查询商业中心待办事项
   */
  getAllAgency_business() {
    const ableKey = featureIf.get(featureIf.keys.CONSOLE_DISABLE_AGENCY_BUSINESS);
    return !ableKey
      ? config.agency_business
      : config.agency_business.filter(item => {
          return ableKey.indexOf(item.key) === -1;
        });
  },
};
