import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 更新品牌信息基础资料
   * @param params
   */
  updateBrand(params) {
    return services.post(WpSchema + '/brand/update', params, {
      action: '更新品牌信息',
    });
  },

  /**
   * 更新快递方式
   * @param params
   */
  updateExpress(params) {
    return services.post(WpSchema + '/app/setting/express', params, {
      action: '更新快递方式',
    });
  },

  /**
   * 更新物流方式v2
   * @param params
   */
  updateDelivery(params) {
    return services.post(WpSchema + '/app/setting/delivery/switch', params, {
      action: '更新物流方式',
    });
  },

  /**
   * 查询物流服务商
   * @param params
   */
  queryServicer(params) {
    return services.get(WpSchema + '/app/setting/delivery/select', {
      action: '查询物流服务商',
      params,
    });
  },

  /**
   * 开通达达快递
   * @param params
   */
  applyDada(params) {
    return services.post(WpSchema + '/app/setting/delivery/dada/apply', params, {
      action: '开通达达快递',
    });
  },

  /**
   * 设置物流服务商
   * @param params
   */
  toggleServicer(params) {
    return services.post(WpSchema + '/app/setting/delivery/merchant/toggle', params, {
      action: '设置物流服务商',
    });
  },

  /**
   * 获取达达支持的配送城市
   * @param params
   */
  queryCityInfo(params) {
    return services.get(WpSchema + '/delivery_local/dada/city_info/list', {
      action: '查询城市数据',
      params,
    });
  },

  /**
   * 查询品牌信息
   * @param params
   */
  queryBrandInfo(params) {
    return services.get(WpSchema + '/brand/select', {
      action: '查询品牌信息',
      params,
    });
  },

  /**
   * 订购惟客宝或者客流宝
   * @param params
   */
  purchaseFunction(params) {
    return services.post(WpSchema + '/app/setting/purchase', params, {
      action: '订购惟客宝或者客流宝',
    });
  },

  /**
   * 查询订单设置
   * @param params
   */
  queryOrderSetting(params) {
    return services.get(WpSchema + '/order/setting/query', {
      action: '查询订单设置',
      params,
    });
  },

  /**
   * 修改订单设置
   * @param params
   */
  updateOrderSetting(params) {
    return services.get(WpSchema + '/order/setting/update', {
      action: '修改订单设置',
      params,
    });
  },

  /**
   * 修改品牌配置项
   * @param params
   */
  updateAppTag(params) {
    return services.post(WpSchema + '/app/update/tag', params, {
      action: '修改品牌配置项',
    });
  },
  getEDeal(params) {
    return services.get(WpSchema + '/app/agreement/estate/query', {
      params,
      action: '获取电子协议',
    });
  },
  updateEDeal(params) {
    return services.post(WpSchema + '/app/agreement/estate/addOrUpdate', params, {
      action: '更新电子协议',
    });
  },
};
