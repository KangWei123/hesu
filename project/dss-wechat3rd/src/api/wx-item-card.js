import services from '@/dss-common/utils/services.js';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
export default {
  add(params) {
    return services.json(WpSchema + '/wx_item_card/add', params, {
      action: '新增卡项'
    });
  },
  delete(params) {
    return services.get(WpSchema + '/wx_item_card/delete_card', {
      action: '删除卡项',
      params
    });
  },
  order(params) {
    return services.json(WpSchema + '/wx_item_card/order', params, {
      action: '新增卡项'
    });
  },
  query(params) {
    return services.get(WpSchema + '/wx_item_card/query', {
      action: '查询卡项详情',
      params
    });
  },
  query_cards(params) {
    return services.get(WpSchema + '/wx_item_card/query/cards', {
      action: '查询卡项列表',
      params
    });
  },
  query_list(params) {
    return services.get(WpSchema + '/wx_item_card/query_list', {
      action: '查询卡项列表',
      params
    });
  },
  shelf(params) {
    return services.post(WpSchema + '/wx_item_card/shelf', params, {
      action: '查询卡项列表'
    });
  },
  update(params) {
    return services.json(WpSchema + '/wx_item_card/update', params, {
      action: '修改卡项'
    });
  },
  query_sell_statistic(params) {
    return services.get(WpSchema + '/wx_item_gift_card/query_sell_statistic', {
      action: '获取礼品卡售卖统计信息',
      params
    });
  },
  query_sell_list(params) {
    return services.get(WpSchema + '/wx_item_gift_card/query_sell_list', {
      action: '获取礼品卡售卖列表',
      params
    });
  },
  query_user_info(params) {
    return services.get(WpSchema + '/wx_item_gift_card/query_user_info', {
      action: '获取用户礼品卡信息',
      params
    });
  },
  query_order_list(params) {
    return services.get(WpSchema + '/wx_item_gift_card/query_order_list', {
      action: '查询用户礼品卡关联订单列表',
      params
    });
  },
  theme_select(params) {
    return services.get(WpSchema + '/item/gift_card/theme/select', {
      action: '获取礼品卡售卖列表',
      params
    });
  },
  theme_update(params) {
    return services.get(WpSchema + '/item/gift_card/theme/update', {
      action: '更新礼品卡背景',
      params
    });
  },
  theme_add(params) {
    return services.get(WpSchema + '/item/gift_card/theme/add', {
      action: '添加礼品卡背景',
      params
    });
  },
  theme_delete(params) {
    return services.get(WpSchema + '/item/gift_card/theme/delete', {
      action: '删除礼品卡背景',
      params
    });
  }
};
