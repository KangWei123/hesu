export default {
  /*运费模板类型，buyerBear：买家承担，freeShipping：卖家包邮 freightCollect：运费到付*/
  type: {
    buyerBear: 0,
    freeShipping: 1,
    freightCollect: 2
  },
  /*计价方式，number：按件数，weight：按重量*/
  valuationWay: {
    number: 0,
    weight: 1
  }
};
