export const EVENT_LIST = [
  {
    eventCode: 1,
    value: 0,
    eventDesc: '消费金额',
  },
  {
    eventCode: 2,
    value: 0,
    eventDesc: '消费次数',
  },
];

export const scoreEvent = [
  { ...EVENT_LIST[0] },
  // {
  //   eventCode: 3,
  //   value: 0,
  //   eventDesc: '会员升级',
  // },
  {
    eventCode: 4,
    value: 0,
    eventDesc: '签到事件',
  },
  {
    eventCode: 5,
    value: 0,
    eventDesc: '抽奖事件',
  },
  {
    eventCode: 6,
    value: 0,
    eventDesc: '参与活动分享',
  },
  // {
  //   eventCode: 7,
  //   value: 0,
  //   eventDesc: '品牌代言人/参与秒杀',
  // },
  // {
  //   eventCode: 9,
  //   value: 0,
  //   eventDesc: '品牌代言人/参与拼团',
  // },
  // {
  //   eventCode: 10,
  //   value: 0,
  //   eventDesc: '品牌代言人/参与砍价',
  // },
  // {
  //   eventCode: 11,
  //   value: 0,
  //   eventDesc: '品牌代言人/邀请新用户',
  // },
];

export const SCORE_EVENT_DESC = new Map();
EVENT_LIST.forEach(v => SCORE_EVENT_DESC.set(v.eventCode, v.eventDesc));
scoreEvent.forEach(v => SCORE_EVENT_DESC.set(v.eventCode, v.eventDesc));
