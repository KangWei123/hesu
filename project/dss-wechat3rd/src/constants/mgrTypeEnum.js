export default {
  hotel: {
    type: 'hotel',
    value: 18,
    label: '房型',
    oddDay: {
      value: 0,
      label: '普通房'
    },
    combo: {
      value: 1,
      label: '钟点房'
    }
  },
  reservationTimeType: {
    number: 0, //天数
    range: 1 //时间段
  },
  ticket: {
    type: 'ticket',
    value: 19,
    label: '门票',
    oddDay: {
      value: 0,
      label: '单日票'
    },
    combo: {
      value: 1,
      label: '套餐票'
    }
  },
  article: {
    type: 'article',
    value: 20,
    label: '营销图文'
  }
};
