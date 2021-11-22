//是否允许跨商品
const sameItemSwitchStatus = {
  YES: 0, //跨商品
  NO: 1 //同种商品
};
//是否可用和其他营销共用
const withOthersPreferentialStatus = {
  NO: 0, //不可叠加
  YES: 1 //可叠加
};

const type = {
  all: 0,
  store: 1, //门店
  goods: 2, //商品
  category: 3 //分类
};

const activityContentEnum = {
  halfFare: {
    label: '第二件半价',
    value: '1'
  },
  Send: {
    label: '第二件0元',
    value: '2'
  },
  custom: {
    label: '自定义优惠',
    value: '3'
  }
};

const ActivityStatus = {
  DELETED: -1, // 已删除
  NOT_STARTED: 0, // 未开始
  ON_GOING: 1, // 进行中
  ENDED: 2, // 已结束
  EXPIRE: 3 //"过期"
};

const ActivityOptions = [
  {
    value: null,
    label: '所有状态'
  },
  {
    value: 0,
    label: '未开始'
  },
  {
    value: 1,
    label: '进行中'
  },
  {
    value: 2,
    label: '已结束'
  },
  {
    value: 3,
    label: '已过期'
  }
];

const discountTypeEnum = {
  discount: 0, //折扣
  money: 1, //扣减金额
  price: 2 //固定金额
};

const activityTypeEnum = {
  SECOND_HALF: {
    value: 'second_half',
    label: '第x件y折'
  },
  FIXED_PRICE: {
    value: 'fixed_price',
    label: '一口价'
  },
  MUCH_BY_MORE_DISCOUNT: {
    value: 'much_by_more_discount',
    label: '满x件优惠'
  }
};

export default {
  sameItemSwitchStatus,
  withOthersPreferentialStatus,
  type,
  activityContentEnum,
  discountTypeEnum,
  ActivityStatus,
  activityTypeEnum,
  ActivityOptions
};
