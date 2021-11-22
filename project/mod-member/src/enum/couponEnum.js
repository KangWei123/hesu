export default {
  // 门店
  suitStoreType: {
    // 全部门店
    all: 0,
    // 自定义门店
    custom: 1,
  },
  // 商品
  suitItemType: {
    // 全部
    all: 0,
    // 自定义
    custom: 1,
    // 自定义分类
    category: 2,
  },
  // 领取方式
  receiveMethod: {
    // 免费
    free: 0,
    // 自定义
    custom: 1,
  },
  // 领取条件
  receiveType: {
    all: 2,
    newUser: 0, // 新人
    level: 1, // 会员等级
  },
  // 优惠券类型（时间）
  couponType: {
    // 满减券
    default: 0,
    // 运费券
    custom: 1,
  },
  // 优惠券类型（满减券、运费券）
  couponCategory: {
    // 默认
    default: 0,
    // 自定义
    freight: 1,
    // 折扣券
    discount: 2,
  },
  // 触发事件
  EVENTTYPE: {
    // 页面转发
    DEFAULT: 0,
    // 支付
    CUSTOM: 1,
    // 评论图文
    COMMENT: 6,
    // 购买充值卡
    RECHARGE_CARD: 5,
  },
  // 数量
  QUANTITY: {
    // 无限制
    UNLIMITED: 0,
  },
  // 消费门槛
  MINIMUMFEE: {
    // 无门槛
    UNLIMITED: 0,
  },
  // 投放渠道
  couponCentreStatus: {
    // 营销专用
    MARKETING_USE: 0,
    // 领券中心
    COUPON_CENTER: 1,
    // 导购专用
    GUIDE_USE: 2,
  },
  status: {
    // 无效
    INVALID: 0,
    // 有效
    VALID: 1,
    // 过期
    EXPIRE: 2,
    // 发放完毕
    FINISH: 3,
  },
  coupon: {
    type: 'coupon',
    value: 1,
    label: '名称',
  },
  couponStyle: {
    default: 0,
    custom: 1,
  },
  useScopeType: {
    common: {
      value: 0,
      label: '通用券',
    },
    online: {
      value: 1,
      label: '线上商城',
    },
    offline: {
      value: 2,
      label: '线下门店',
    },
  },
  // 扫码领券
  sanCode: {
    Support: 1, // 支持
    unSupport: 0, // 不支持
  },

  getStatusDesc() {
    const { INVALID, VALID, EXPIRE, FINISH } = this.status;
    return {
      [INVALID]: '无效',
      [VALID]: '有效',
      [EXPIRE]: '过期',
      [FINISH]: '发放完毕',
    };
  },
};
