import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  create(params) {
    return services.json(WpSchema + '/much_buy/more_discount/add', params, {
      action: '创建活动'
    });
  },
  update(params) {
    return services.json(WpSchema + '/much_buy/more_discount/update', params, {
      action: '更新活动'
    });
  },
  update_status(params) {
    return services.json(WpSchema + '/much_buy/more_discount/update_status', params, {
      action: '更新状态'
    });
  },
  queryList(params) {
    return services.json(WpSchema + '/much_buy/more_discount/queryList', params, {
      action: '查询活动列表'
    });
  },
  query(params) {
    return services.get(WpSchema + '/much_buy/more_discount/query', {
      action: '查询活动详情',
      params
    });
  },
  query_item(params) {
    return services.get(WpSchema + '/much_buy/more_discount/query/item', {
      action: '查询活动商品',
      params
    });
  }
};
