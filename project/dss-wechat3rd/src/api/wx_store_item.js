import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
export default {
  queryItemList(params) {
    return services.get(WpSchema + '/wx_store_item/query/Item_list', {
      action: '查询门店商品列表',
      params
    });
  },

  queryGoodsList(params) {
    return services.get(WpSchema + '/item/queryList', {
      action: '查询总店商品列表',
      params
    });
  },

  queryAllCategoryList(params) {
    return services.get(WpSchema + '/item/query/app/category', {
      action: '获取总店店商品分类列表',
      params
    });
  },

  queryRootCategoryList(params) {
    return services.get(WpSchema + '/app/category/select/root', {
      action: '获取总店店商品分类列表',
      params
    });
  },

  updateCategoryItemSort(params) {
    return services.post(WpSchema + '/item/category/app/update_order', params, {
      action: '更新门店自定义分类排序'
    });
  },

  queryCustomCategoryList(params) {
    return services.get(WpSchema + '/item/category/app/queryCategory', {
      action: '获取门店自定义分类列表',
      params
    });
  },

  addCustomCategory(params) {
    return services.post(WpSchema + '/item/category/app/add', params, {
      action: '添加门店自定义分类'
    });
  },

  deleteCustomCategory(params) {
    return services.post(WpSchema + '/item/category/app/delete', params, {
      action: '删除门店自定义分类'
    });
  },

  updateCustomCategory(params) {
    return services.post(WpSchema + '/item/category/app/update', params, {
      action: '更新门店自定义分类'
    });
  },

  changeCategoryItems(params) {
    return services.post(WpSchema + '/item/category/app/add_item', params, {
      action: '自定义分类添加商品'
    });
  },

  queryFirstCategory(params) {
    return services.get(WpSchema + '/app/category/select/root', {
      params,
      action: '查询一级类目配置'
    });
  },

  querySecondCategory(params) {
    return services.get(WpSchema + '/app/category/select/category', {
      params,
      action: '查询二级类目配置'
    });
  },

  saveCategory(params) {
    return services.post(WpSchema + '/app/category/config/update', params, {
      action: '保存类目配置'
    });
  },

  queryUseCategory(params) {
    return services.get(WpSchema + '/app/category/use/select', {
      params,
      action: '查询店铺使用类目级别配置'
    });
  },

  //该接口返回值包裹类目级别，小程序上类目一行排列数
  queryUseCategoryV2(params) {
    return services.get(WpSchema + '/app/category/use/select/v2', {
      params,
      action: '查询店铺使用类目级别配置'
    });
  },

  updateUseCategory(params) {
    return services.post(WpSchema + '/app/category/use/update', params, {
      action: '修改店铺使用类目级别配置'
    });
  }
};
