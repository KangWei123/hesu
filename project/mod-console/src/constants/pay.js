/**
 * Created by love on 18/10/13.
 * @author trumpli<李志伟>
 */
export default {
  /* 支付信息配置 */
  PAY_CONFIG: {
    WX_MA: {
      label: '微信小程序支付',
      value: '1',
    }, // 小程序支付配置
    WX_MP: {
      label: '公众号支付',
      value: '2',
    }, // 公众号支付配置
    H5: {
      label: 'H5支付',
      value: '3',
    }, // H5支付
    TT: {
      label: '字节小程序支付',
      value: '4',
    }, // 字节支付
    BUSINESS_AREA: {
      label: '商圈支付',
      value: '5',
    },
  },
  /* 付款到零钱配置 */
  PAY_TRANSFERS_CONFIG: {
    WX: {
      label: '微信支付',
      value: '1',
    }, // 微信支付
  },
  PAY_CHANNEL: {
    WX_PAY: 1, // "微信支付"),
    ALIPAY: 2, // "支付宝支付"),
    ACCOUNT: 3, // "账户余额支付"),
    CARD_COUPON: 4, // "次数卡抵扣"),
    PAYMENT_TO_THE_STORE: 5, //, "到店支付"),
    WX_CARD_PAY: 6, //, "微信刷卡支付"),
    CASHIER_PAY: 7, //, "收银台支付"),
    CASH_PAY: 8, //, "现金支付"),
  },

  PAY_CHANNEL_NAME: {
    1: '微信支付', // "微信支付"),
    2: '支付宝支付', // "支付宝支付"),
    3: '账户余额支付', // "账户余额支付"),
    4: '次数卡抵扣', // "次数卡抵扣"),
    5: '到店支付', //, "到店支付"),
    6: '微信刷卡支付',
    7: '收银台支付',
    8: '现金支付',
  },

  PAY_STATUS: {
    NOT_PAY: 10, // "待支付"),
    PAID: 20, // "已支付"),
    REFUND: -10, // "退款中"),
    REFUND_COMPLETED: -20, // "退款完成"),
    NO_NEET_PAY: 30, //, "无需支付”),
  },

  WX_PAY_STATUS: {
    SUCCESS: 'SUCCESS', // 支付成功
    REFUND: 'REFUND', // 转入退款
    NOTPAY: 'NOTPAY', // 未支付
    CLOSED: 'CLOSED', // 已关闭
    REVOKED: 'REVOKED', // 已撤销（刷卡支付）
    USERPAYING: 'USERPAYING', // 用户支付中
    PAYERROR: 'PAYERROR', // 支付失败(其他原因，如银行返回失败)
  },
};
