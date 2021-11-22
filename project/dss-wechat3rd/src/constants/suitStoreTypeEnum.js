export default {
  all: 0, //全部门店
  part: 1, //部分门店

  //进店好礼期限类型（时间）
  limitType: {
    //一直有效
    default: 0,
    //分时段
    custom: 1
  },
  //活动类型
  activity: {
    //品牌活动
    brand: 1,
    //门店活动
    store: 10,
    //砍价-品牌活动
    cutPriceBrand: 0,
    microDecorateBrand: 0
  }
};
