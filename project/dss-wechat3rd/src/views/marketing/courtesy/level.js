/**
 * Created by admin on 2019/7/16.
 * @author lemon<李亦黎>
 */
const vip = {
  all: 0, //全部会员
  part: 1 //指定会员等级
};
const activityStatus = {
  UNOPEN: 0, //未开始
  GOING: 1, //进行中
  END: 2, //已结束,
  DELETE: 3 //已删除
};
const rightsType = {
  TICKET: 0, //优惠券
  LUCKY: 1, //幸运转盘
  POINT: 2 //积分
};
const joinAmount = {
  DAYSCOUNT: 0, //按天算
  PERSONCOUNT: 1 //按人算
};
export { vip, activityStatus, rightsType, joinAmount };
