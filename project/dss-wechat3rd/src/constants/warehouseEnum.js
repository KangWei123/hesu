import orderStatusEnum from './orderStatusEnum';

const EXPRESS_TYPES = {
  SELF_DELIVERY: {
    value: orderStatusEnum.express_type.self_extraction,
    label: '门店自提'
  },

  EXPRESS: {
    value: orderStatusEnum.express_type.express,
    label: '快递'
  },

  CITY_DELIVERY: {
    value: orderStatusEnum.express_type.city_delivery,
    label: '同城配送'
  }
};

const BUSINESSTYPES = [
  {
    value: 1,
    label: '食品小吃'
  },
  {
    value: 2,
    label: '饮料'
  },
  {
    value: 3,
    label: '鲜花'
  },
  {
    value: 4,
    label: '文印票务'
  },
  {
    value: 5,
    label: '便利店'
  },
  {
    value: 6,
    label: '水果生鲜'
  },
  {
    value: 7,
    label: '同城电商'
  },
  {
    value: 8,
    label: '医药'
  },
  {
    value: 9,
    label: '蛋糕'
  },
  {
    value: 10,
    label: '酒品'
  },
  {
    value: 11,
    label: '小商品市场'
  },
  {
    value: 12,
    label: '服装'
  },
  {
    value: 13,
    label: '汽修零配'
  },
  {
    value: 14,
    label: '数码'
  },
  {
    value: 15,
    label: '小龙虾'
  },
  {
    value: 16,
    label: '其他'
  }
];
export { EXPRESS_TYPES, BUSINESSTYPES };
