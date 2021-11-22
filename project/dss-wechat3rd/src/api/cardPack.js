import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  list(params) {
    return services.get(WpSchema + '/couponpocket/query', {
      action: '获取卡包列表',
      params
    });
  },
  del(params) {
    return services.post(WpSchema + '/couponpocket/delete', params, {
      action: '删除卡包'
    });
  },
  insert(params) {
    return services.json(WpSchema + '/couponpocket/insert', params, {
      action: params.action
    });
  },
  update(params) {
    return services.json(WpSchema + '/couponpocket/update', params, {
      action: params.action
    });
  },
  detial(params) {
    return services.get(WpSchema + '/couponpocket/querydetial', {
      action: '查询卡包详情',
      params
    });
  },
  shelf(params) {
    return services.post(WpSchema + '/couponpocket/shelf', params, {
      action: '卡包上下架'
    });
  },
  couponList(params) {
    return services.get(WpSchema + '/coupon/listDetial', {
      action: '查询优惠券',
      params
    });
  }
};
