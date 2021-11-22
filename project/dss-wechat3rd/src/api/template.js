import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
export default {
  /**
   * 新增/编辑标签分类
   */
  addCategory(params) {
    return services.post(WpSchema + '/item/label/category/save', params, {
      action: '编辑商品分类'
    });
  },
  /**
   * 删除标签分类
   */
  deleteCategoryById(params) {
    return services.post(WpSchema + '/item/label/category/delete', params, {
      action: '删除标签分类'
    });
  },
  /**
   * 查询参数模板列表
   */
  getParameterList(params) {
    return services.get(WpSchema + '/item/param/template/list', {
      action: '查询参数模板',
      params
    });
  },
  /**
   * 查询商品分类
   */
  queryCategoryList(params) {
    return services.get(`${WpSchema}/item/category/queryCategoryList`, {
      params,
      action: '查询商品分类'
    });
  },
  /**
   * 删除商品参数模板
   */
  delParameter(params) {
    return services.post(WpSchema + '/item/param/template/delete', params, {
      action: '删除商品参数模板'
    });
  },
  /**
   * 保存商品参数模板
   */
  saveParameter(params) {
    return services.json(WpSchema + '/item/param/template/save', params, {
      action: '保存参数模板'
    });
  },
  /**
   * 根据id查询参数模板详情
   */
  getTemplateListById(params) {
    return services.get(WpSchema + '/item/param/template/detail', {
      action: '查询参数模板详情',
      params
    });
  },
  /**
   * 查询问答模板列表
   */
  getAskTemplateList(params) {
    return services.get(WpSchema + '/item/qa/template/list', {
      params,
      action: '查询问答模板列表'
    });
  },
  /**
   * 查询问答模板分类
   */
  queryTemCategoryList(params) {
    return services.get(WpSchema + '/item/qa/template/category/list', {
      params,
      action: '查询问答模板分类'
    });
  },
  /**
   * 保存问答模板分类
   */
  saveQaTemCategory(params) {
    return services.post(WpSchema + '/item/qa/template/category/save', params, {
      action: '保存问答模板分类'
    });
  },
  /**
   * 删除问答模板分类
   */
  delQaTemCategory(params) {
    return services.post(WpSchema + '/item/qa/template/category/delete', params, {
      action: '保存问答模板分类'
    });
  },
  /**
   * 删除问答模板
   */
  delQaTemplate(params) {
    return services.post(WpSchema + '/item/qa/template/delete', params, {
      action: '删除问答模板'
    });
  },

  /**
   * 保存问答模板
   */
  saveAskTemplate(params) {
    return services.json(WpSchema + '/item/qa/template/save', params, {
      action: '保存问答模板'
    });
  },
  /**
   * 根据id查询问答模板详情
   */
  getAskTemplateListById(params) {
    return services.get(WpSchema + '/item/qa/template/detail', {
      params,
      action: '查询问答模板详情'
    });
  }
};
