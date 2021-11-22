// 积分消耗/积分发放列表跳转详情
export function getUrlByEventKey({ eventKey, refId, refName, refIdStr }) {
  let path = '';
  switch (eventKey) {
    case 'event_invite':
    case 'event_seckill':
    case 'event_group_booking':
    case 'event_bargain':
      path = `/wkb.html#/marketing/task-center/establish/detail?id=${refId}`;
      break;
    case 'event_sign_in':
    case 'event_retroactive':
      //  签到
      path = `/wkb.html#/marketing/checkin/setting?isEnable=true&signedDetailId=${refId}`;
      break;
    case 'event_lottery':
    case 'event_lottery_exchange':
      //  抽奖
      path = `/wkb.html#/marketing/lucky/add?id=${refId}`;
      break;
    case 'event_share_activity':
      //  分享有礼
      path = `/wkb.html#/marketing/share-gift/add?sharePresentInfoId=${refId}`;
      break;
    case 'event_member_upgrade':
      //  会员升级
      path = `/level-center/level-mgr/normal?id=${refId}`;
      break;
    case 'event_item_exchange':
      // 商品兑换
      path = `/wkb.html#/marketing/integral/list?name=${encodeURIComponent(refName)}`;
      break;
    case 'event_coupon_exchange':
      // 优惠券兑换
      path = `/wkb.html#/marketing/coupon/coupon-list/add?couponNo=${refId}`;
      break;
    case 'event_deduction':
      path = `/wkb.html#/marketing/score-set-off`;
      break;
    case 'event_shanhu_subtract':
      path = `https://jifen.m.qq.com`;
      break;
    case 'event_parking_deduction':
      path = `/wkb.html#/park/park-config/list`;
      break;
    case 'event_offline_consume':
      path = `/wkb.html#/largeMemScore/rule/edit?id=${refId}`;
      break;
    case 'event_bonus_money_exchange':
      path = `/wkb.html#/marketing/exchange-money/detail?id=${refIdStr}`;
      break;
    default:
      break;
  }
  return path;
}
