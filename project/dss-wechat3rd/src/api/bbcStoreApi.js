/*
 * @Author: your name
 * @Date: 2021-08-11 16:57:56
 * @LastEditTime: 2021-09-07 11:23:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dss-web\project\mod-console\src\api\bbcStoreApi.js
 */
import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api';

const WpSchema = wpBaseApi.WpSchema;

export default {
  // 门店詳情
  queryStoreDetail(params) {
    return services.get(WpSchema + '/store/detail', {
      action: '查询店铺详情',
      params,
    });
  },
  // 查找门店
  queryStoreList(params) {
    return services.json(WpSchema + '/store/list', params, {
      action: '查找门店',
    });
  },

  // 创建门店或者更新店铺
  createStore(params) {
    return services.json(WpSchema + '/store/modify', params, {
      action: params.id ? '更新店铺' : '创建店铺',
    });
  },

  // 门店上下架
  toggleShelfStore(params) {
    return services.json(WpSchema + '/store/shelf_status', params, {
      action: '门店上下架',
    });
  },

  // 设置店铺管理员
  setStoreManager(params) {
    return services.post(WpSchema + '/store/store_manager', params, {
      action: '设置店铺管理员',
    });
  },
  // 获取组织架构
  getOrganization(params) {
    return services.post(WpSchema + '/organization/tree/get', params, {
      action: '获取组织架构',
    });
  },
  //  通过或者拒绝店铺审核
  auditStore(params) {
    return services.json(WpSchema + '/store-audit/audit', params, {
      action: '通过或者拒绝店铺审核',
    });
  },
  // 创建店铺审核
  createAudit(params) {
    return services.json(WpSchema + '/store-audit/create-audit', params, {
      action: '创建店铺审核',
    });
  },
  // 查询店铺审核
  getAudit(params) {
    return services.get(WpSchema + '/wp/store-audit/view', {
      action: '查询店铺审核',
      params,
    });
  },

  services,
};
