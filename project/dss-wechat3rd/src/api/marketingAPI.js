/**
 * Created by love on 18/9/14.
 * @author trumpli<李志伟>
 */
import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 获取模板消息配置
   * @param params
   */
  getTempMessageConfig(params) {
    return services.get(`${WpSchema}/seller/temp/msg/list`, {
      action: '获取模板消息配置',
      params
    });
  },

  /**
   * 模板消息开关
   * @param params
   */
  changeTempMessage(params) {
    return services.post(`${WpSchema}/seller/temp/msg/onOff`, params, {
      action: '模板消息开关'
    });
  },

  /**
   * 查询新客进店好礼
   * @param {*} params
   */
  queryCurNewUserGiftActivity(params) {
    return services.get(`${WpSchema}/coupon/first/gift/query`, {
      action: '查询新客进店好礼',
      params
    });
  },

  /**
   * 查询新客进店好礼活动记录
   * @param {*} params
   */
  queryNewUserGiftActivityRecords(params) {
    return services.get(`${WpSchema}/coupon/first/gift/query_history`, {
      action: '查询新客进店好礼活动记录',
      params
    });
  },

  /**
   * 添加优惠券方案
   * @param {*} params
   */
  createNewUserGiftActivity(params) {
    return services.json(`${WpSchema}/coupon/first/gift/add_new`, params, {
      action: '添加优惠券方案'
    });
  },

  /**
   * 删除优惠券方案
   * @param {*} params
   */
  deleteNewUserGiftActivity(params) {
    return services.get(`${WpSchema}/coupon/first/gift/delete`, {
      action: '删除优惠券方案',
      params
    });
  },

  /**
   * 获取短信账户信息
   * @param {*} params
   */
  querySMSCountInfo(params) {
    return services.get(`${WpSchema}/sms/account/query`, {
      action: '获取短信账户信息',
      params
    });
  },

  /**
   * 根据选择的app查短信套餐
   * @param {*} params
   */
  querySMSPackages(params) {
    return services.get(`${WpSchema}/wk_package/query_sms_packages`, {
      action: '根据选择的app查短信套餐',
      params
    });
  },

  /**
   * 查询商家所有短信充值记录
   * @param {*} params
   */
  querySMSRechargesWaterList(params) {
    return services.get(`${WpSchema}/sms/water/list`, {
      action: '查询商家所有短信充值记录',
      params
    });
  },

  /**
   * 查询群发记录列表
   * @param {*} params
   */
  querySMSGroupSendRecords(params) {
    return services.get(`${WpSchema}/sms/batch_send/list`, {
      action: '查询群发记录列表',
      params
    });
  },

  /**
   * 创建群发任务
   * @param {*} params
   */
  createSMSGroupSendTask(params) {
    return services.post(`${WpSchema}/sms/batch_send/add`, params, {
      action: '创建群发任务'
    });
  },

  /**
   * 立刻发送
   * @param {*} params
   */
  sendSMSImmediately(params) {
    return services.get(`${WpSchema}/sms/batch_send/send_now`, {
      action: '立刻发送',
      params
    });
  },

  /**
   * 添加新的定向群发优惠券
   * @param params
   * @returns {*}
   */
  addDirectionalCoupons(params) {
    return services.post(`${WpSchema}/coupon/batch/plan/add/v2`, params, {
      action: '创建定向群发优惠券'
    });
  },
  /**
   * 确定群发优惠券
   * @param params
   * @returns {*}
   */
  confirmDirectionalCoupons(params) {
    return services.get(`${WpSchema}/coupon/batch/plan/confirm`, {
      params,
      action: '确定群发'
    });
  },

  /**
   * 获取定向群发列表
   * @param params
   * @returns {*}
   */
  fetchDirectionalCouponsList(params) {
    return services.get(`${WpSchema}/coupon/batch/plan/list`, {
      params,
      action: '定向群发列表'
    });
  },
  /**
   * 删除定向群发
   * @param params
   * @returns {*}
   */
  deleteDirectionalCoupons(params) {
    return services.get(`${WpSchema}/coupon/batch/plan/delete`, {
      params,
      action: '删除群发'
    });
  }
};
