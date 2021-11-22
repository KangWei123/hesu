const STATUS = {
  INITIAL: {
    value: 0,
    label: '未开始'
  },

  ONGOING: {
    value: 1,
    label: '进行中'
  },

  SELL_OUT: {
    value: 2,
    label: '已售罄'
  },

  FINISHED: {
    value: 3,
    label: '已结束'
  },

  DELETED: {
    value: 4,
    label: '已删除'
  }
};

const CHANNEL = {
  REGION: {
    value: 1,
    label: '卡包专区'
  },

  PROMOTION: {
    value: 2,
    label: '推广大使'
  }
};

export { STATUS, CHANNEL };
