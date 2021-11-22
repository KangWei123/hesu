import services from '@/dss-common/utils/services';
const PREFIX = '/wp';
export default {
  /**
   * 查询经销商列表
   */
  queryDealer(params) {
    return services.get(`${PREFIX}/dealer/list/query/by/role`, {
      action: '查询经销商',
      params,
    });
  },
  /**
   * 总部角色查询经销商列表
   */
  queryDealerStoreStatistic(params) {
    return services.get(`${PREFIX}/dealer/queryDealerStoreStatistic`, {
      action: '查询经销商',
      params,
    });
  },
  /**
   * 查询门店列表
   */
  queryStoreList(params) {
    return services.get(`${PREFIX}/store/query_list`, {
      action: '查询门店',
      params,
    });
  },
  /**
   * 获取导购列表
   */
  queryGuideList(params) {
    return services.get(`${PREFIX}/client/guide/list`, {
      action: '查询导购信息',
      params,
    });
  },
  // 批量导出门店客户/线索
  export: '/wp/client/info/store/export',
  /**
   * 查询小区列表页
   */
  queryEstateList(params) {
    return services.get(`${PREFIX}/housing/estate/page/query`, {
      action: '查询小区列表',
      params,
    });
  },
  /**
   * 删除小区信息
   */
  delEstate(params) {
    return services.post(`${PREFIX}/housing/estate/delete`, params, {
      action: '删除小区信息',
    });
  },
  /**
   * 批量分配小区线索
   */
  batchEstateList(params) {
    return services.json(`${PREFIX}/housing/estate/distribution/batch`, params, {
      action: '批量分配',
    });
  },
  /**
   * 查询小区详情
   */
  queryEstateDetail(params) {
    return services.get(`${PREFIX}/housing/estate/detail`, {
      action: '查询小区详情',
      params,
    });
  },
  // 新增小区
  estateCueAddUrl: {
    url: `${PREFIX}/housing/estate/insert`,
  },
  // 更新小区信息
  estateUpdateAddUrl: {
    url: `${PREFIX}/housing/estate/update`,
  },
  /**
   * 查询客户线索列表
   */
  queryClientCue(params) {
    return services.get(`${PREFIX}/client/info/query`, {
      action: '查询客户列表',
      params,
    });
  },
  /**
   * 添加客户
   */
  addClientCue(params) {
    return services.post(`${PREFIX}/client/info/add`, params, {
      action: '添加客户',
    });
  },
  // 移除客户
  removeBinding: {
    url: '/wp/client/bind/remove/bind',
  },
  // 批量移除客户
  batchRemoveBinding: {
    url: '/wp/client/bind/batch/remove/bind',
  },

  // 根据手机号查询客户
  getClientInfoByPhone(params) {
    return services.get(`${PREFIX}/client/info/get/phone`, {
      action: '查询客户',
      params,
    });
  },
  // 线索/客户分配
  bindInfo(params) {
    return services.post(`${PREFIX}/client/bind/set`, params, {
      action: '分配操作',
    });
  },
  // 线索添加至电销列表
  addTelesales(params) {
    return services.post(`${PREFIX}/client/telesales/add`, params, {
      action: '添加电销列表',
    });
  },
};
