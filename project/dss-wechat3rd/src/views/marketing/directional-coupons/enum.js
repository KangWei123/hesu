const Month = [
  { id: 1, name: '一月' },
  { id: 2, name: '二月' },
  { id: 3, name: '三月' },
  { id: 4, name: '四月' },
  { id: 5, name: '五月' },
  { id: 6, name: '六月' },
  { id: 7, name: '七月' },
  { id: 8, name: '八月' },
  { id: 9, name: '九月' },
  { id: 10, name: '十月' },
  { id: 11, name: '十一月' },
  { id: 12, name: '十二月' }
];
const GroupTypeKey = {
  ALL: 'all',
  LEVEL: 'filterUserLevelId',
  // LABEL: 'filterUserLabelNames',
  CROWD: 'filterCrowPackageId',
  BIRTH: 'filterMonth',
  PHONE: 'filterPhone',
  MEMBER_ID: 'filterMemberId'
};
const FilterType = {
  [GroupTypeKey.ALL]: 0,
  [GroupTypeKey.LEVEL]: 1,
  // [GroupTypeKey.LABEL]: 2,
  [GroupTypeKey.CROWD]: 2,
  [GroupTypeKey.BIRTH]: 3,
  [GroupTypeKey.PHONE]: 4,
  [GroupTypeKey.MEMBER_ID]: 5
};

const SelectLabel = {
  [GroupTypeKey.ALL]: '全部',
  [GroupTypeKey.LEVEL]: '指定等级',
  [GroupTypeKey.LABEL]: '指定商家标签',
  [GroupTypeKey.BIRTH]: '生日人群',
  [GroupTypeKey.PHONE]: '指定手机号',
  [GroupTypeKey.MEMBER_ID]: '指定会员id',
  [GroupTypeKey.CROWD]: '指定人群包'
};

const Label = {
  [GroupTypeKey.ALL]: '全部',
  [GroupTypeKey.LEVEL]: '会员等级',
  [GroupTypeKey.LABEL]: '商家标签',
  [GroupTypeKey.BIRTH]: '会员月份',
  [GroupTypeKey.PHONE]: '会员手机号',
  [GroupTypeKey.MEMBER_ID]: '会员id'
};

const SendMsgType = {
  NO: 0,
  SEND: 1
};

const ConfirmStatus = {
  CONFIRM: 1,
  CANCEL: 2
};

export { Month, GroupTypeKey, FilterType, SelectLabel, Label, SendMsgType, ConfirmStatus };
