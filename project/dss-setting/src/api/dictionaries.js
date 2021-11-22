import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const wpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 数据字典列表
   * @param params
   */
  queryList(params) {
    return services.get(wpSchema + '/medicine/dictionary/list', {
      action: '数据字典列表',
      params
    });
  },

  /**
   * 删除标签
   * @param params
   */
  delete(params) {
    return services.post(wpSchema + '/medicine/dictionary/label/delete', params, {
      action: '删除标签'
    });
  },

  /**
   * 数据字典标签列表
   * @param params
   */
  label_list(params) {
    return services.get(wpSchema + '/medicine/dictionary/label/list', {
      action: '数据字典标签列表',
      params
    });
  },

  /**
   * 创建数据字典标签
   * @param params
   */
  create(params) {
    return services.json(wpSchema + '/medicine/dictionary/label/create', params, {
      action: '创建数据字典标签'
    });
  },
  /**
   * 批量添加清分门店
   * @param params
   */
  update(params) {
    return services.json(wpSchema + '/medicine/dictionary/label/update', params, {
      action: '创建数据字典标签'
    });
  }
};
