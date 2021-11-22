import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
export default {
  supplier: {
    add_supplier(params) {
      return services.post(WpSchema + '/supplier/add_supplier', params, {
        action: '添加供应商'
      });
    },
    update_supplier(params) {
      return services.post(WpSchema + '/supplier/update_supplier', params, {
        action: '修改供应商'
      });
    },
    update_supplier_status(params) {
      return services.get(WpSchema + '/supplier/update_supplier_status', {
        action: '更新是否启用供应商',
        params
      });
    },
    supplier_detail(supplierId) {
      return services.get(`${WpSchema}/supplier/supplier_detail?supplierId=${supplierId}`, {
        action: '获取供应商信息'
      });
    },
    query(params) {
      return services.get(WpSchema + '/supplier/query', {
        action: '获取供应商列表',
        params
      });
    }
  },
  area: {
    queryRegion(parentId = 0) {
      return services.get('/c/buz/region/query', {
        action: '获取区域',
        params: {
          parentId: parentId
        }
      });
    }
  }
};
