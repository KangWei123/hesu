/* 创建积分规则选择商品的类型 */
export const CHOOSE_TYPE = {
  GOODS: 1, // 商品
  CATEGORY: 2, // 分类
};

// 拓展入口
export const EX_CONTENT = {
  //  签到
  SIGN_IN: { content: '请前往营销中心-签到有礼设置对应签到规则', url: '/wkb.html#marketing/checkin' },
  //  抽奖
  LOTTERY: { content: '请前往营销中心-幸运转盘设置对应抽奖规则', url: '/wkb.html#marketing/lucky' },
  //  分享有礼
  SHARE: { content: '请前往营销中心-分享有礼设置对应积分规则', url: '/wkb.html#marketing/share-gift' },
  //  会员升级
  MEMBER_UPGRADE: { content: '请前往会员等级中心设置升级积分值', url: '/level-center/level-mgr/normal' },
  //  品牌代言
  INVITE: { content: '请前往营销中心-品牌代言人设置对应积分规则', url: '/wkb.html#/marketing/task-center/list' },
  // 商品兑换
  GOOD_EXCHANGE: { content: '请前往营销中心-积分商城对应积分规则', url: '/wkb.html#/marketing/integral/list' },
  // 优惠券兑换
  COUPON_EXCHANGE: { content: '请前往营销中心-优惠券对应积分规则', url: '/wkb.html#/marketing/coupon/coupon-list' },
  // 积分抵现
  DEDUCTION: { content: '请前往营销中心-积分抵现对应积分规则', url: '/wkb.html#/marketing/score-set-off' },
  // 珊瑚积分活动
  SHANHU_SUBTRACT: { content: '请前往腾讯珊瑚积分权益库', url: 'https://jifen.m.qq.com' },
  // 停车场积分抵扣
  PARK_DEDUCTION: {
    content: '如需配置停车场积分抵扣对应积分规则，请前往停车场管理-缴费配置页面',
    url: '/wkb.html#/park/park-config/list',
  },
  OFFLINE: {
    content: '如需配置线下消费对应积分规则，请前往积分管理-积分规则页面',
    url: '/wkb.html#/largeMemScore/rule/list',
  },
  // 积分兑钱
  EVENT_BONUS_MONEY_EXCHANGE: {
    content: '请前往营销中心-积分兑钱进行配置',
    url: '/wkb.html#/marketing/exchange-money',
  },
};
// 事件类型选项对应的提示语及拓展入口
export const EVENT_TYPE = {
  event_sign_in: EX_CONTENT.SIGN_IN,
  event_retroactive: EX_CONTENT.SIGN_IN,
  event_lottery: EX_CONTENT.LOTTERY,
  event_lottery_exchange: EX_CONTENT.LOTTERY,
  event_share_activity: EX_CONTENT.SHARE,
  event_member_upgrade: EX_CONTENT.MEMBER_UPGRADE,
  event_invite: EX_CONTENT.INVITE,
  event_seckill: EX_CONTENT.INVITE,
  event_group_booking: EX_CONTENT.INVITE,
  event_bargain: EX_CONTENT.INVITE,
  event_item_exchange: EX_CONTENT.GOOD_EXCHANGE,
  event_coupon_exchange: EX_CONTENT.COUPON_EXCHANGE,
  event_deduction: EX_CONTENT.DEDUCTION,
  event_shanhu_subtract: EX_CONTENT.SHANHU_SUBTRACT,
  event_parking_deduction: EX_CONTENT.PARK_DEDUCTION,
  event_offline_consume: EX_CONTENT.OFFLINE,
  event_bonus_money_exchange: EX_CONTENT.EVENT_BONUS_MONEY_EXCHANGE,
};
