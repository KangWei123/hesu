import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  list: WpSchema + '/gift/getGiftList', // 获取赠品列表
  addGift(params) {
    return services.post(WpSchema + '/gift/addGift', params, {
      action: '添加赠品',
    });
  },
  getGiftInfo(params) {
    return services.get(WpSchema + '/gift/getGiftInfo', {
      action: '获取赠品信息',
      params,
    });
  },
  abandonGift(params) {
    return services.get(WpSchema + '/gift/abandonGift', {
      action: '废弃赠品',
      params,
    });
  },
  getAbandonGiftInfo(params) {
    return services.get(WpSchema + '/gift/getAbandonGiftInfo', {
      action: '获取废弃赠品信息',
      params,
    });
  },
  getAbandonGiftList(params) {
    return services.get(WpSchema + '/gift/getAbandonGiftList', {
      action: '获取废弃赠品列表',
      params,
    });
  },
  getGiftList(params) {
    return services.get(WpSchema + '/gift/getGiftList', {
      action: '获取赠品列表',
      params,
    });
  },
  syncGift(params) {
    return services.post(WpSchema + '/gift/syncGift', params, {
      action: '同步赠品',
    });
  },
  updateGift(params) {
    return services.post(WpSchema + '/gift/updateGift', params, {
      action: '修改赠品',
    });
  },

  query_gift_list(params) {
    return services.get(WpSchema + '/store_gift/query/gift_list', {
      action: '查询门店赠品列表',
      params,
    });
  },

  query_store(params) {
    return services.json(WpSchema + '/store_gift/query_store', params, {
      action: '同一个赠品-多个门店同时上下架(列表)',
    });
  },

  store_gift_shelf(params) {
    return services.post(WpSchema + '/store_gift/shelf/gift', params, {
      action: '同一个门店-多个赠品上下架',
    });
  },

  store_gift_unify(params) {
    return services.post(WpSchema + '/store_gift/shelf/gift/unify', params, {
      action: '同一个赠品-多个门店同时上下架',
    });
  },

  store_batch_gift_shelf(params) {
    return services.post(WpSchema + '/store_gift/batch/shelf/gift', params, {
      action: '多个门店多个赠品上下架',
    });
  },

  // 赠品专区

  getLevelSimplyList(params) {
    return services.json('/plt/level/config/list', {
      action: '获取会员等级列表',
      params,
    });
  },

  setGiftRule(params) {
    return services.json(WpSchema + '/gift_rule/set', params, {
      action: '修改赠品规则',
    });
  },
  getGiftRule(params) {
    return services.get(WpSchema + '/gift_rule/get', {
      action: '查询赠品规则',
      params,
    });
  },

  batchSet(params) {
    return services.json(WpSchema + '/gift_activity/batchSet', params, {
      action: '批量/设置赠品活动属性',
    });
  },

  batchSyncGift(params) {
    return services.post(WpSchema + '/gift_activity/batchSyncGift', params, {
      action: '批量同步赠品',
    });
  },

  listGift(params) {
    return services.get(WpSchema + '/gift_activity/listGift', {
      action: '查询可参加活动的赠品列表',
      params,
    });
  },
  listActivity(params) {
    return services.arrayGet(WpSchema + '/gift_activity/listActivity', {
      action: '查询赠品活动列表',
      params,
    });
  },
  getActivity(params) {
    return services.get(WpSchema + '/gift_activity/getActivity', {
      action: '查询赠品活动详情',
      params,
    });
  },
  updateStatus(params) {
    return services.json(WpSchema + '/gift_activity/updateStatus', params, {
      action: '删除或结束赠品活动',
    });
  },
};
