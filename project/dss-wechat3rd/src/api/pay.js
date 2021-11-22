/**
 * Created by love on 18/9/14.
 * @author trumpli<李志伟>
 */
import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 提交刷卡支付
   */
  microPay(params) {
    return services.get(WpSchema + '/pay/micropay', {
      action: '提交刷卡支付',
      params
    });
  },
  /**
   * 查询订单
   * queryOrder({'orderNo':1})
   */
  queryOrder(params) {
    return services.get(WpSchema + '/pay/queryOrder', {
      action: '查询订单',
      params
    });
  },
  /**
   * 撤销订单
   * reverseOrder({'orderNo':1})
   */
  reverseOrder(params) {
    return services.get(WpSchema + '/pay/reverseOrder', {
      action: '撤销订单',
      params
    });
  }
};
