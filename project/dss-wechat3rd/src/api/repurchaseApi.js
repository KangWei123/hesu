import services from '@/dss-common/utils/services.js';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  query(params) {
    return services.json(WpSchema + '/repurchase/list', params, {
      action: '获取加价换购列表'
    });
  },
  addRepurchase(params) {
    return services.json(WpSchema + '/repurchase/save', params, {
      action: '添加加价换购'
    });
  },
  statusUpdate(params) {
    return services.get(WpSchema + '/repurchase/status/update', {
      params,
      action: '更新加价购活动状态'
    });
  },
  repurchaseDetail(params) {
    return services.get(WpSchema + '/repurchase/detail', {
      params,
      action: '获取加价购活动详情'
    });
  }
};
