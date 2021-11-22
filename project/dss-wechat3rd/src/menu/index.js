/**
 * Created by love on 18/11/2.
 * @author trumpli<李志伟>
 */

export default {
  path: {
    /**
     * 店铺创建相关页面
     */
    creating: {
      '/startup/industry': '选择行业',
      '/startup/create': '创建app',
      '/startup/order': '店铺订单',
      '/startup/chose': '店铺选择',
      '/startup/pay': '支付店铺套餐',
      '/startup/template-list': '选择模版'
    },
    /**
     * 选择店铺(已有)
     */
    CHOOSE_APP: '/startup/chose',
    /**
     * 开始创建店铺
     */
    START_CREATE_APP: '/startup/industry',

    /**
     * 收银台
     */
    CASHIER: '/cashier',

    /**
     * 特征 正则匹配
     */
    regex: {
      FULL_PAGE_CTRL: /(\/cashier)/,
      CREATING: /(\/startup)/,
      DECORATE: /(\/decorate)/
    }
  }
};
