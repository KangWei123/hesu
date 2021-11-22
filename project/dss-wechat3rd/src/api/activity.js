import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
export default {
  supplier: {
    add_activity(params) {
      return services.json(WpSchema + '/topic_activity/create', params, {
        action: '创建主题活动'
      });
    },
    getActivityDetail(params) {
      return services.get(WpSchema + '/topic_activity/detail', {
        action: '获取主题活动详情',
        params
      });
    },
    updateActivityData(params) {
      return services.json(WpSchema + '/topic_activity/update', params, {
        action: '更新主题活动'
      });
    },
    getGoodList(params) {
      return services.get(WpSchema + '/item/query/item/sku', {
        action: '查商品列表',
        params
      });
    },
    getGoodTypeList(params) {
      return services.get(WpSchema + '/item/query/app/category', {
        action: '查商品类型列表',
        params
      });
    },
    query(params) {
      return services.get(WpSchema + '/topic_activity/list', {
        action: '获取主题活动列表',
        params
      });
    },
    topic_with_items(params) {
      return services.get(WpSchema + '/topic_activity/topic_with_items', {
        action: '获取主题活动带商品',
        params
      });
    }
  }
};
