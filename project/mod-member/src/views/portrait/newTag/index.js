export default () => ({
  // 通用表单
  commonForm: {
    type: '商家印象',
    name: '',
    desc: '',
  },
  // 商家印象表单
  merchantForm: {
    category: '',
  },
  // 条件标签
  conditionForm: {
    // 打标条件 消费 充值 或浏览
    condition: {
      consumption: false,
      charge: false,
      scean: false,
    },
    // 消费
    consumptionForm: {
      calcTime: '', // 计算时间
      production: 'all', // 选择商品
      targetList: [],
      productionOptions: [], // 选择商品选项
      // 消费选项 累计消费金额
      feeOptionForm: {
        low: '',
        high: '',
      },
      // 消费选项 累计消费次数
      countOptionForm: {
        low: '',
        high: '',
      },
      // 上次消费距今
      lastOptionForm: {
        condition: 'gt',
        day: '',
      },
    },
    // 充值
    chargeForm: {
      calcTime: '',
      chargeOptions: [], // 可选项
      chargeOptionForm: { low: '', high: '' }, // 累计充值金额
      countOptionForm: { low: '', high: '' }, // 累计充值次数
    },
    // 浏览
    sceanForm: {
      calcTime: '',
      targetList: [], // 选择的商品标签
      production: 'all', // 选择商品
      sceanOptions: [], // 可选项
      countOptionForm: { low: '', high: '' }, // 累计浏览次数
    },
  },
});
