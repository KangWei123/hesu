import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 订单列表
   * @param params
   */
  orderList(params) {
    return services.get(constants.Api.micro_order.list, {
      params: params,
      action: '订购订单列表'
    });
  },
  /**
   * 订单详情
   * @param params
   */
  orderDetail(params) {
    return services.get(constants.Api.micro_order.detail, {
      params: params,
      action: '订购订单详情'
    });
  }
};
