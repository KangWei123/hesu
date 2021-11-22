import services from '@/dss-common/utils/services.js';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
const warehouseExport = WpSchema + '/warehouse/export_warehouse';
export default {
  warehouseExport,

  /*添加仓库*/
  add(params) {
    return services.json(WpSchema + '/warehouse/add', params, {
      action: '添加仓库'
    });
  },
  /*修改仓库*/
  update(params) {
    return services.json(WpSchema + '/warehouse/update', params, {
      action: '修改仓库'
    });
  },
  /*查询仓库*/
  select(params) {
    return services.get(WpSchema + '/warehouse/select', {
      action: '查询仓库',
      params
    });
  },
  update_status(params) {
    return services.post(WpSchema + '/warehouse/update_status', params, {
      action: '修改状态'
    });
  },
  // v2
  switch(params) {
    return services.post(WpSchema + '/warehouse/delivery/switch', params, {
      action: '修改物流设置'
    });
  },
  // 快递
  express_query(params) {
    return services.get(WpSchema + '/delivery_express/query', {
      action: '查询快递配送配置',
      params
    });
  },
  express_update(params) {
    return services.json(WpSchema + '/delivery_express/update', params, {
      action: '修改快递配置'
    });
  },
  // 同城配送
  local_query(params) {
    return services.get(WpSchema + '/delivery_local/query', {
      action: '查询同城配送配置',
      params
    });
  },
  local_update(params) {
    return services.json(WpSchema + '/delivery_local/update', params, {
      action: '修改同城配送配置'
    });
  },
  bind(params) {
    return services.json(WpSchema + '/delivery_local/bind', params, {
      action: '绑定同城配送服务商'
    });
  },
  support(params) {
    return services.get(WpSchema + '/delivery_local/service/support', {
      action: '查询仓库支持服务商',
      params
    });
  },
  toggle(params) {
    return services.post(WpSchema + '/delivery_local/service/toggle', params, {
      action: '设置同城服务商'
    });
  }
};
