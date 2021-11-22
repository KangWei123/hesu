import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const wpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 清分门店查询
   * @param params
   */
  queryList(params) {
    return services.get(wpSchema + '/dis_store/queryList', {
      action: '清分门店查询',
      params
    });
  },
  /**
   * 移除清分门店
   * @param params
   */
  delete(params) {
    return services.get(wpSchema + '/dis_store/delete', {
      action: '移除清分门店',
      params
    });
  },

  /**
   * 修改清分配置
   * @param params
   */
  updateStore(params) {
    return services.json(wpSchema + '/dis_store/update', params, {
      action: '修改清分配置'
    });
  },
  /**
   * 批量添加清分门店
   * @param params
   */
  batchAdd(params) {
    return services.json(wpSchema + '/dis_store/batchAdd', params, {
      action: '批量添加清分门店'
    });
  },
  /**
   * 关闭清分功能开关
   * @param params
   */
  clearing(params) {
    return services.post(wpSchema + '/app/setting/clearing', params, {
      action: '开启/关闭清分功能开关'
    });
  },

  /**
   * 查询经销商列表
   * @param params
   */
  queryDealerStoreTree(params) {
    return services.get(wpSchema + '/dealer/queryDealerStoreStatistic', {
      action: '查询经销商列表',
      params
    });
  },

  /**
   * 添加经销商分销配置
   * @param params
   */
  dis_add(params) {
    return services.json(wpSchema + '/dis_dealer/add', params, {
      action: '开启/添加经销商分销配置'
    });
  },

  /**
   * 更新经销商分销配置
   * @param params
   */
  dis_update(params) {
    return services.json(wpSchema + '/dis_dealer/update', params, {
      action: '更新经销商分销配置'
    });
  },
  /**
   * 查询经销商分销配置
   * @param params
   */
  dealer_setting(params) {
    return services.get(wpSchema + '/dis_dealer/dealer_setting', {
      action: '查询经销商分销配置',
      params
    });
  },
  /**
   * 根据经销商id查询门店的分销配置
   * @param params
   */
  dealer_store_setting(params) {
    return services.get(wpSchema + '/dis_dealer/dealer_store_setting', {
      action: '根据经销商id查询门店的分销配置',
      params
    });
  },
  /**
   * 删除经销商分销配置
   * @param params
   */
  dis_delete(params) {
    return services.get(wpSchema + '/dis_dealer/delete', {
      action: '删除经销商分销配置',
      params
    });
  }
};
