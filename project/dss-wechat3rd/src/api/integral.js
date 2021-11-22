import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  list(params) {
    return services.get(WpSchema + '/integral/shop/query/list', {
      action: '获取积分商城活动列表',
      params
    });
  },
  add(params) {
    return services.json(WpSchema + '/integral/shop/add/activity', params, {
      action: '新增积分商城活动'
    });
  },
  detail(params) {
    return services.get(WpSchema + '/integral/shop/query/detail', {
      action: '获取积分商城活动详情',
      params
    });
  },
  update(params) {
    return services.json(WpSchema + '/integral/shop/update/activity', params, {
      action: '更新积分商城活动'
    });
  },
  updateStatus(params) {
    return services.post(WpSchema + '/integral/shop/update/activity_status', params, {
      action: '更改积分商城状态'
    });
  },
  control(params) {
    return services.post(WpSchema + '/integral/shop/setting/update', params, {
      action: '积分商城开关设置'
    });
  }
};
