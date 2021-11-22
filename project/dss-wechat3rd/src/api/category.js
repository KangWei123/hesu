import services from '@/dss-common/utils/services';
// 后端接口前缀
import wpBaseApi from '@/business-common/wp-base-api.js';

export default {
  /**
   *经营类目
   */
  category: {
    list(params) {
      return services.json('/mall/b/tenant/category/queryList', params, {
        action: '查询商户经营分类列表',
      });
    },
    add(params) {
      return services.json('/mall/b/tenant/category/create', params, {
        action: '新增经营分类',
      });
    },
    delete(params) {
      return services.get('/mall/b/tenant/category/deleteById', {
        params,
        action: '根据主键删除指定经营分类',
      });
    },
    updata(params) {
      return services.json('/mall/b/tenant/category/update', params, {
        action: '更新经营分类信息',
      });
    },
  },
};
