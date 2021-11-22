import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  list(params) {
    return services.get(WpSchema + '/item_estate/layout/list', {
      action: '获取户型列表',
      params
    });
  },
  add(params) {
    return services.post(WpSchema + '/item_estate/layout/add', params, {
      action: '新增户型'
    });
  },
  detail(params) {
    return services.get(WpSchema + '/item_estate/layout/detail', {
      action: '获取户型详情',
      params
    });
  },
  update(params) {
    return services.post(WpSchema + '/item_estate/layout/update', params, {
      action: '更新户型'
    });
  },
  delete(params) {
    return services.post(WpSchema + '/item_estate/layout/delete', params, {
      action: '删除户型'
    });
  }
};
