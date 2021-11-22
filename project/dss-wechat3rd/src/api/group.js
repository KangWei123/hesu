import services from '@/dss-common/utils/services';
import Qs from 'qs';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 查询拼团列表
   * @param {Object} params ｛pageNo 页数, pageSize 页大小, status 拼团状态, activityName 拼团活动名称, activityId 拼团活动id｝
   * @returns Promise
   */
  groupQuery(params) {
    return services.post(WpSchema + '/pt_group/list', params, {
      action: '获取拼团列表',
      transformRequest(data) {
        return Qs.stringify(data, {
          allowDots: true
        });
      }
    });
  },

  /**
   * 获取拼团详情
   * @param {*} id
   */
  groupDetail(id) {
    return services.get(`${WpSchema}/pt_group/detail?groupNo=${id}`, {
      action: '获取拼团详情'
    });
  },

  /**
   * 创建拼团活动
   * @param {Object} params 拼团活动参数
   */
  createActivity(params) {
    return services.json(WpSchema + '/pt/create', params, {
      action: '创建拼团活动'
    });
  },

  /**
   * 更新拼团活动
   * @param {*} params
   */
  updateActivity(params) {
    return services.json(WpSchema + '/pt/update', params, {
      action: '更新拼团活动'
    });
  },

  /**
   * 获取拼团活动列表
   * @param {Object} params 分页参数
   *
   */
  queryActivity(params) {
    return services.get(WpSchema + '/pt/list', {
      action: '获取拼团活动列表',
      params
    });
  },

  /**
   * 获取拼团活动列表
   * @param {Object} params 分页参数
   *
   */
  queryActivityV2(params) {
    return services.get(WpSchema + '/pt/listV2', {
      action: '获取拼团活动列表',
      params
    });
  },

  /**
   * 校验拼团门店
   * @param {*} params 商品信息
   */
  queryUnavaliableStore(params) {
    return services.get(WpSchema + '/pt/queryUnavaliableStore', {
      action: '获取不符合规则的门店',
      params
    });
  },

  /**
   * 获取拼团活动详情
   * @param {*} params
   *
   */
  getActivityDetail(params) {
    return services.get(WpSchema + '/pt/select', {
      action: '获取拼团活动详情',
      params
    });
  },

  /**
   * 更新活动状态，上下架或删除
   * @param {*} params {activityId, status}
   *
   */
  updateActivityStatus(params) {
    return services.get(WpSchema + '/pt/update_status', {
      action: '获取拼团活动详情',
      params
    });
  },

  /**
   * 获取拼团设置
   *
   */
  getActivitySetting() {
    return services.get(WpSchema + '/pt_setting/select', {
      action: '获取拼团设置'
    });
  },

  /**
   * 更新拼团设置
   * @param {*} params
   */
  updateActitvitySetting(params) {
    return services.json(WpSchema + '/pt_setting/update', params, {
      action: '更新拼团设置'
    });
  },

  /**
   * 创建拼团设置
   * @param {*} params
   */
  createActivitySetting(params) {
    return services.json(WpSchema + '/pt_setting/create', params, {
      action: '创建拼团设置'
    });
  }
};
