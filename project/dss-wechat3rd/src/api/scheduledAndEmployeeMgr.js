/**
 * Created by love on 18/9/10.
 * @author trumpli<李志伟>
 */
import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 查询预约列表
   ***/
  getScheduledList(params) {
    return services.get(WpSchema + '/scheduled/list', {
      action: '查询预约列表',
      params
    });
  },

  /**
   * 更改预约
   * @param params
   */
  updateScheduled(params) {
    return services.post(WpSchema + '/scheduled/update', params, {
      action: '更改预约'
    });
  },

  /**
   * 取消预约
   * @param params
   */
  cancelScheduled(params) {
    return services.get(WpSchema + '/scheduled/cancel', {
      action: '取消预约',
      params
    });
  },

  /**
   * 将订单置为已完成
   * @param params
   */
  completeScheduled(params) {
    return services.get(WpSchema + '/scheduled/complete', {
      action: '将订单置为已完成',
      params
    });
  },

  /**
   * 查询员工列表
   * @param params
   */
  getEmployeeList(params) {
    return services.get(WpSchema + '/employee/query', {
      action: '查询员工列表',
      params
    });
  },

  /**
   * 查询超时的跟取消订单的数量
   */
  getScheduledCount() {
    return services.get(WpSchema + '/scheduled/count', {
      action: '查询超时的跟取消订单的数量'
    });
  },
  /**
   * 查询核销数量
   */
  getVerificationCount(params) {
    return services.get(WpSchema + '/verification/employee/count', {
      action: '查询核销数量',
      params
    });
  },
  /**
   * 查询排班信息
   * @param params
   */
  getEmployeeWorkOrder(params) {
    return services.get(WpSchema + '/employee/workOrder/query', {
      action: '查询排班信息',
      params
    });
  },

  /**
   * 查询预约设置
   * @param params
   */
  getScheduledConfig(params) {
    return services.get(WpSchema + '/scheduled/config/query', {
      action: '查询预约设置',
      params
    });
  },

  /**
   * 添加预约设置
   * @param params
   */
  addScheduledConfig(params) {
    return services.post(WpSchema + '/scheduled/config/insert', params, {
      action: '添加预约设置'
    });
  },

  /**
   * 更新预约设置
   * @param params
   */
  updateScheduledConfig(params) {
    return services.post(WpSchema + '/scheduled/config/update', params, {
      action: '更新预约设置'
    });
  },

  /**
   * 查询预约订单详情
   */
  getScheduledOrderDetail(params) {
    return services.get(WpSchema + '/scheduled/query_detail', {
      action: '查询预约订单详情',
      params
    });
  }
};
