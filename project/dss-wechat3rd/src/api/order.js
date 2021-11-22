/**
 * Created by love on 18/9/14.
 * @author trumpli<李志伟>
 */
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 拉取订单详情
   * @param params
   */
  getOrderDetail(params) {
    return services.get(constants.Api.order.detail, {
      params: params,
      action: '订单详情'
    });
  },

  /**
   * 拉取代客下单订单详情
   * @param params
   */
  getValetOrderDetail(params) {
    return services.get(constants.Api.order.valetDetail, {
      params: params,
      action: '代客下单订单详情'
    });
  },

  /**
   * 物流公司列表
   * @param params
   * @returns {*}
   */
  getShippingCompanyList(params) {
    return services.get(WpSchema + '/order/shipping_company_list', {
      params: params,
      action: '物流公司列表'
    });
  },
  /**
   * 发货
   * @param params
   * @returns {*}
   */
  shipping(params) {
    return services.get(WpSchema + '/order/shipping', {
      params: params,
      action: '发货'
    });
  },
  /**
   * 订购订单发货
   * @param params
   * @returns {*}
   */
  micro_shipping(params) {
    return services.get(WpSchema + '/order/customize/shipping', {
      params: params,
      action: '发货'
    });
  },
  /**
   * 查询物流信息
   * @param params
   * @returns {*}
   */
  getLogistics(params) {
    return services.get(WpSchema + '/logistics/message/query', {
      params: params,
      action: '查询物流信息'
    });
  },

  /**
   * 取消订单
   * @param params
   * @returns {*}
   */
  cancel(params) {
    return services.get(WpSchema + '/order/close', {
      params: params,
      action: '取消订单'
    });
  },

  /**
   * 订单改价
   * @param params
   * @returns {*}
   */
  changePrice(params) {
    return services.json(WpSchema + '/order/price/change', params, {
      action: '订单改价'
    });
  },
  /**
   * 根据id查询订单价格
   * @param params
   * @returns {*}
   */
  queryPriceInfoById(params) {
    return services.get(WpSchema + '/order/price/item/list', {
      params: params,
      action: '查询价格'
    });
  },
  /**
   * 订单改价日志
   * @param params
   * @returns {*}
   */
  queryChangePriceLog(params) {
    return services.get(WpSchema + '/order/price/log/list', {
      params: params,
      action: '查询订单日志'
    });
  },
  /**
   * 处方单详情
   * @param params
   * @returns {*}
   */
  queryPrescriptionDetail(params) {
    return services.get(WpSchema + '/medicine/prescription/detail', {
      params: params,
      action: '处方单详情'
    });
  },
  /**
   * 处方药-通过审核
   * @param params
   * @returns {*}
   */
  prescriptionApproval(params) {
    console.log(params);
    return services.post(WpSchema + '/medicine/prescription/review/approval', params, {
      action: '审核通过'
    });
  },
  /**
   * 处方药-不通过审核
   * @param params
   * @returns {*}
   */
  prescriptionRefuse(params) {
    return services.post(WpSchema + '/medicine/prescription/review/refuse', params, {
      action: '拒绝'
    });
  },
  /**
   * 获取导购列表
   * @param params
   * @returns {*}
   */
  queryGuideList(params) {
    return services.get(WpSchema + '/client/guide/list', {
      params: params,
      action: '获取导购列表'
    });
  },
  /**
   * 修改订单归属导购
   * @param params
   * @returns {*}
   */
  changeBelongGuide(params) {
    return services.json(WpSchema + '/order/belong/change', params, {
      action: '修改订单归属导购'
    });
  }
};
