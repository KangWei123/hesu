/**
 * Created by love on 18/9/14.
 * @author trumpli<李志伟>
 */
import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
const postPayLoadData = wpBaseApi.postPayLoadData;

export default {
  /**
   * 拉取店铺商品
   * @param params
   */
  allItems(params) {
    return services.get(WpSchema + '/cashier_board/item', {
      action: '拉取店铺商品',
      params
    });
  },

  /**
   * 计算选中商品的价格
   * @param params
   */
  getCalPrice(params) {
    return postPayLoadData(WpSchema + '/cashier_board/cal_price', params, '计算选中商品的价格');
  },

  /**
   * 批量下单
   * @param params
   */
  batchSubOrder(params) {
    return postPayLoadData(WpSchema + '/cashier_board/batch_sub_order', params, '批量下订单');
  },

  /**
   * 自定义金额充值下单
   * @param params
   */
  rechargeOrder(params) {
    return services.get(WpSchema + '/cashier_board/recharge', {
      action: '自定义金额充值下单',
      params
    });
  },

  /**
   * 自定义金额充值下单和支付合并
   * @param params
   */
  rechargePay(params) {
    return services.get(WpSchema + '/cashier_board/recharge_pay', {
      action: '自定义金额充值下单',
      params
    });
  },

  /**
   * 支付订单
   * @param params
   */
  payOrder(params) {
    return services.get(WpSchema + '/cashier_board/pay_order', {
      action: '支付订单',
      params
    });
  },

  /**
   * 合并下单和支付
   * @param params
   * @returns {*}
   */
  subPayOrder(params) {
    return services.json(WpSchema + '/cashier_board/sub_pay_order', params, {
      action: '支付订单'
    });
  },

  /**
   * 扫码查询用户以及相关信息
   * @param params
   */
  getUserAndProductInfoByScanInfo(params) {
    return services.get(WpSchema + '/cashier_board/query_user', {
      action: '扫码查询用户以及相关信息',
      params
    });
  }
};
