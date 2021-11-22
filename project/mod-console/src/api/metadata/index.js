import services from '@/dss-common/utils/services';
import { ScrmSchema } from '@/business-common/constants/apiEnum';
console.log('ScrmSchema', ScrmSchema);

export default {
  /**
   * 获取第三方授权列表
   * @param params
   */
  getAuthList(params) {
    return services.get(ScrmSchema + '/neoCrm/getAuthList', {
      params,
      action: '获取第三方授权列表',
    });
  },
  /**
   * 更新应用信息
   * @param params
   */
  updateAuth(params) {
    return services.post(ScrmSchema + '/neoCrm/updateAuth', params, {
      action: '更新应用信息',
    });
  },
  /**
   * 获取授权地址
   * @param params
   */
  getTtAuthUrl(params) {
    return services.get(ScrmSchema + '/neoCrm/getTtAuthorizationUrl', {
      params,
      action: '获取授权地址',
    });
  },
  /**
   * 同步数据源账号
   * @param params
   */
  syncAccount(params) {
    return services.get(ScrmSchema + '/baiduCrm/createOrSyncAccount', {
      params,
      action: '同步',
    });
  },
  /**
   * 获取数据源账号列表
   * @param params
   */
  getAccountList(params) {
    return services.json(ScrmSchema + '/baiduCrm/getList', params, {
      action: '获取列表',
    });
  },
  /**
   * 删除数据源账号
   * @param params
   */
  deleteAccount(params) {
    return services.get(ScrmSchema + '/baiduCrm/delete', {
      params,
      action: '删除',
    });
  },
};
