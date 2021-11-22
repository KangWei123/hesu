import services from '@/dss-common/utils/services.js';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
export default {
  /*查询类目列表*/
  queryCategoryList(params) {
    return services.get(WpSchema + '/item/category/queryCategoryList', {
      action: '查询类目列表',
      params
    });
  },
  /*添加类目*/
  add_category(params) {
    return services.post(WpSchema + '/item/category/add_category', params, {
      action: '添加类目'
    });
  },
  /*批量修改类目排序*/
  order_category(params) {
    return services.json(WpSchema + '/item/category/batch_update_category_seq', params, {
      action: '批量修改类目排序'
    });
  },
  /*删除类目*/
  delete_category(params) {
    return services.post(WpSchema + '/item/category/delete_category', params, {
      action: '删除类目'
    });
  },
  /*修改类目*/
  update_category(params) {
    return services.post(WpSchema + '/item/category/update_category', params, {
      action: '修改类目'
    });
  },
  /*隐藏或者显示类目*/
  hide_category(params) {
    return services.post(WpSchema + '/item/category/hide_category', params, {
      action: '隐藏或者显示类目'
    });
  }
};
