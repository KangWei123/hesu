const actTypes = {
  // 积分抽奖
  drawByscore: 1,
  // 免费抽奖
  free: 0
};

// 活动场景
const actFrame = {
  // 下单有礼
  afterBuy: 0,
  // 首页活动
  indexAct: 1
};

const staTus = {
  // // 未开始
  // unOpen: 0,
  // // 进行中
  // doing: 1,
  // // 已结束
  // end: 2,
  // // 已删除
  // deleted: 3

  // 未开始012
  //进行中3
  //已结束4

  //初始化不传
  Initial: 0,
  //下单引用
  Cited: 1,
  //已开始
  Starting: 2,
  //  进行中
  Ongoing: 3,
  // 已关闭
  Closed: 4,
  Ondelete: 5,
  //未开始
  unStarting: '0,1,2'
};

const radioGiftType = {
  //  礼物
  coupon: 1,
  //  积分
  point: 0
};

export { actFrame, actTypes, staTus, radioGiftType };
