export default {
  NONE: 0, //不作任何设置
  WKB_PACKAGE_ORDER: 1, //惟客宝套餐订单
  SCHEDULE_ORDER: 1 << 1, //服务商品订单
  NO_NEED_PAY: 1 << 2, //无需支付订单
  NEED_CONFIRM: 1 << 3, //是否需要商家确认
  PAY_SUBTRACT_STOCK: 1 << 4, //付款减库存
  MEDICINE: 1 << 13, // 是否药品
  IS_PRESCRIPTION_DRUG: 1 << 19, // 是否是处方药
  DISCOUNT: 1 << 20, // 第x件y折
  FULL_REDUCTION: 1 << 21, // 满x件优惠
  MOUTHFUL: 1 << 22 //  一口价
};
