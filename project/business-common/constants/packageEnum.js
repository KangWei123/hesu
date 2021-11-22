export default {
  CHAIN_STORE: 2,
  SINGLE_STORE: 1,

  //套餐状态
  PACKAGE_STATUS: {
    VALID: 1, //"有效"),
    NORMAL_EXPIRED: 2, //"套餐过期"),
    TRY_EXPIRED: 3, //"试用过期"),
    TRY: 4, //"试用中"),
    DELETED: -1 //,"已删除"),
  },

  NEAR_TIME_LINE_DAY: 15,

  //微信授权类型
  WX_AUTH_TYPE: {
    MP: 1, //公众号
    MA: 2, //小程序
    ANY: 3 //小程序&公众号
  }
};
