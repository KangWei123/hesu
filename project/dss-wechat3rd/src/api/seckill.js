import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 获取秒杀列表
   * @param {*} params
   */
  seckillList(params) {
    return services.get(WpSchema + '/seckill/list', {
      action: '获取秒杀列表',
      params
    });
  },

  /**
   * 秒杀活动状态变更
   * @param {*} params
   */
  updateSeckillStatus(params) {
    return services.get(WpSchema + '/seckill/update_status', {
      action: '秒杀活动状态变更',
      params
    });
  },

  /**
   * 创建秒杀活动
   * @param {*} params
   */
  createSeckill(params) {
    return services.json(WpSchema + '/seckill/create', params, {
      action: '创建秒杀活动'
    });
  },

  /**
   * 查询秒杀活动详情
   * @param {*} params
   */
  seckillDetail(params) {
    return services.get(WpSchema + '/seckill/select', {
      action: '查询秒杀活动详情',
      params
    });
  },

  /**
   * 更新秒杀活动
   * @param {*} params
   */
  updateSeckill(params) {
    return services.json(WpSchema + '/seckill/update', params, {
      action: '更新秒杀活动'
    });
  },

  /**
   * 新建规则
   * @param {*} params
   */
  createSeckillSetting(params) {
    return services.json(WpSchema + '/seckill_setting/create', params, {
      action: '新建规则'
    });
  },

  /**
   * 查询秒杀规则
   * @param {*} params
   */
  selectSeckillSetting(params) {
    return services.get(WpSchema + '/seckill_setting/select', {
      action: '查询秒杀规则',
      params
    });
  },

  /**
   * 更新秒杀规则
   * @param {*} params
   */
  updateSeckillSetting(params) {
    return services.json(WpSchema + '/seckill_setting/update', params, {
      action: '更新秒杀规则'
    });
  },
  /**
   * 查询秒杀配额
   * @param {*} params
   */
  getListQuota(params) {
    return services.post(WpSchema + '/warehouse/stock/queryStoreStockByItem', params, {
      action: '查询秒杀配额'
    });
  },

  /**
   * 校验秒杀门店
   * @param {*} params 商品信息
   */
  queryUnavaliableStore(params) {
    return services.get(WpSchema + '/seckill/selectStore', {
      action: '获取不符合规则的门店',
      params
    });
  }
};
