import services from '@/dss-common/utils/services';

const WpSchema = '/mall/b';

export default {
  queryList(params) {
    return services.json(`${WpSchema}/parkingLot/list`, params, {
      action: '查询停车场列表',
    });
  },
  getById(params) {
    return services.get(`${WpSchema}/parkingLot/queryById`, {
      action: '查询停车场信息',
      params,
    });
  },
  add(params) {
    return services.json(`${WpSchema}/parkingLot/add`, params, {
      action: '新增停车场',
    });
  },
  update(params) {
    return services.json(`${WpSchema}/parkingLot/update`, params, {
      action: '修改停车场信息',
    });
  },
  getConfig(params) {
    return services.json(`${WpSchema}/parking/payment/config/get`, params, {
      action: '获取车场缴费配置',
    });
  },
  updateConfig(params) {
    return services.json(`${WpSchema}/parking/payment/config/add`, params, {
      action: '获取车场缴费配置',
    });
  },

  orderList(params) {
    return services.json(`${WpSchema}/parking/order/list`, params, {
      action: '查询车场订单列表',
    });
  },
  checkLog(params) {
    return services.get(`${WpSchema}/parking/order/log/list`, {
      params,
      action: '停车场订单日志相关接口',
    });
  },
  fusingList(params) {
    return services.json(`${WpSchema}/parking/fusing/list`, params, {
      action: '熔断记录',
    });
  },
  findInvoiceById(params) {
    return services.get(`${WpSchema}/invoice/queryById`, {
      params,
      action: '根据id查询开票配置',
    });
  },
  addInvoice(params) {
    return services.json(`${WpSchema}/invoice/add`, params, {
      action: '添加开票配置',
    });
  },
  invoiceSetting(params) {
    return services.json(`${WpSchema}/invoice/list`, params, {
      action: '查询开票配置',
    });
  },
  platformAuth(params) {
    return services.json(`${WpSchema}/invoice/auth`, params, {
      action: '根据平台账号密码查询发票配置信息',
    });
  },
  updateInvoiceSetting(params) {
    return services.json(`${WpSchema}/invoice/update`, params, {
      action: '更新开票配置',
    });
  },
  updateStatus(params) {
    return services.post(`${WpSchema}/invoice/updateStatus`, params, {
      action: '更新开票配置状态',
    });
  },
  query_invoice_records(params) {
    return services.json(`${WpSchema}/invoice/record/queryList`, params, {
      action: '查询开票记录',
    });
  },

  parkingStatistics(params) {
    return services.json(`${WpSchema}/parking/order/data/statistics`, params, {
      action: '查询数据统计',
    });
  },

  brokenLineGraphByDays(params) {
    return services.json(`${WpSchema}/parking/order/charge/day/statistics`, params, {
      action: '查询停车收费统计 (日统计)',
    });
  },

  brokenLineGraphHours(params) {
    return services.json(`${WpSchema}/parking/order/charge/hour/statistics`, params, {
      action: '停车收费统计 (时段统计)',
    });
  },
  car_category_list(params) {
    return services.get(`${WpSchema}/car/category/list`, {
      action: '查询车辆品牌列表',
      params,
    });
  },

  car_queryList(params) {
    return services.json(`${WpSchema}/car/binding/queryList`, params, {
      action: '查询车辆绑定信息列表',
    });
  },

  bindingCar(params) {
    return services.json(`${WpSchema}/car/binding/binding`, params, {
      action: '车辆绑定',
    });
  },

  unbindingCar(params) {
    return services.json(`${WpSchema}/car/binding/unbinding`, params, {
      action: '车辆解绑',
    });
  },

  updateCar(params) {
    return services.json(`${WpSchema}/car/binding/update`, params, {
      action: '修改车辆绑定信息',
    });
  },

  // 导出发票记录
  exportInvoiceData: `${WpSchema}/invoice/record/export`,
  // 导出订单
  exportOrder: `${WpSchema}/parking/order/export`,
  // 导出车辆信息
  exportCar: `${WpSchema}/car/binding/export`,
};
