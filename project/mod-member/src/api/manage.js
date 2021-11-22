/**
 * Created by admin on 2019/10/12.
 * @author lemon<李亦黎>
 */
import services from '@/dss-common/utils/services';
export default {
  query(params) {
    return services.get('/wp/client/info/query', {
      action: '查询客户列表',
      params: params,
    });
  },
  add(params) {
    return services.post('/wp/client/info/add', params, {
      action: '手动添加客户',
    });
  },
  /*  bind(params){
    return services.post('/wp/client/info/bind',params,{
      action:'线索客户分配'
    })
  }, */
  bind(params, action) {
    return services.post('/wp/client/bind/set', params, {
      action,
    });
  },
  delete(params) {
    return services.post('/wp/client/info/delete', params, {
      action: '删除客户',
    });
  },
  getClient(params) {
    return services.get('/wp/client/info/get', {
      action: '根据id查询客户',
      params: params,
    });
  },
  getTeleMarketList(params) {
    return services.get('/wp/client/telesales/record/query', {
      params,
      action: '查询客户电销记录',
    });
  },
  import(params) {
    return services.post('/wp/client/info/import', params, {
      action: '批量导入客户信息',
    });
  },
  update(params) {
    return services.post('/wp/client/info/update', params, {
      action: '更新客户信息',
    });
  },
  queryList(params) {
    return services.get('/wp/store/query_list', {
      action: '查询店铺列表',
      params: params,
    });
  },
  region(parentId = 0) {
    return services.get('/c/buz/region/query', {
      action: '查询所有地区',
      params: {
        parentId: parentId,
      },
    });
  },
  regionByPage(params) {
    return services.get('/c/buz/region/queryByPage', {
      action: '查询地区分页',
      params: params,
    });
  },
  addLabel(params) {
    return services.json('/wp/client/label/add', params, {
      action: '添加客户商家标签',
    });
  },
  deleteLabel(params) {
    return services.post('/wp/client/label/delete', params, {
      action: '删除客户商家标签',
    });
  },
  getTask(params) {
    return services.get('/wp/client/distribute/tasks/get', {
      action: '获取线索自动分发任务列表',
      params: params,
    });
  },
  getTaskDetail(params) {
    return services.get('/wp/client/distribute/task/info/get', {
      action: '查询线索自动分发任务详情',
      params: params,
    });
  },
  saveTask(params) {
    return services.json('/wp/client/distribute/task/save', params, {
      action: '保存线索自动分发任务',
    });
  },
  changeStatus(params) {
    return services.post('/wp/client/distribute/task/status/change', params, {
      action: '修改任务状态',
    });
  },
  deleteTask(params) {
    return services.post('/wp/client/distribute/tasks/delete', params, {
      action: '删除任务列表',
    });
  },
  getSepEmployeeList(params) {
    return services.get('wp/employee/query', {
      action: '查询离职员工列表',
      params: params,
    });
  },
  // 导出客户信息
  export: '/wp/client/info/export',
  // 客户跟进记录
  getFollowUpList(params) {
    return services.get('/wp/client/maintain/query', {
      action: '查询客户跟进记录',
      params,
    });
  },

  // 客户阶段
  getClientStage(params) {
    return services.get('/wp/client/stage/list', {
      action: '查询客户阶段列表',
      params,
    });
  },
  getClientStageCount(params) {
    return services.get('/wp/client/stage/count', {
      action: '获取客户阶段人数',
      params,
    });
  },
  updateClientStageName(params) {
    return services.json('/wp/client/stage/save', params, {
      action: '保存客户阶段',
    });
  },
  updateClientStageStatus(params) {
    return services.post('/wp/client/stage/status/update', params, {
      action: '修改客户阶段状态',
    });
  },
  sortClientStage(params) {
    return services.json('/wp/client/stage/move/batch', params, {
      action: '修改客户阶段顺序',
    });
  },

  // 客户来源
  getClientSource(params, hidden = true) {
    return services.json('/wp/client/source/list', params, {
      hidden,
      action: '查询客户来源',
    });
  },
  addClientSource(params) {
    return services.json('/wp/client/source/save', params, {
      action: '新增客户来源',
    });
  },
  updateClientSource(params) {
    return services.json('/wp/client/source/update', params, {
      action: '更新客户来源',
    });
  },
  deleteClientSource(params) {
    return services.post('/wp/client/source/delete', params, {
      action: '删除客户来源',
    });
  },

  /** 全域客户 */

  getClientGuideList(params) {
    return services.get('/wp/client/guide/list', {
      action: '获取导购员列表',
      params,
    });
  },

  saveTelesaleSyncSet(params) {
    return services.json('/wp/client/telesales/sync/setting/save', params, {
      action: '保存电销同步设置',
    });
  },
  // 查询电销同步设置
  getTelesaleSyncSet(params) {
    return services.get('/wp/client/telesales/sync/setting/query', {
      action: '查询电销同步设置',
      params,
    });
  },

  // 移入无效列表
  moveInvalid: {
    url: `/wp/client/info/move/invalid`,
  },
  // 批量移入无效
  batchMoveInvalid: {
    url: `/wp/client/info/batch/move/invalid`,
  },
  bindClientSet(params) {
    return services.post('/wp/client/bind/set', params, {
      action: '移交导购',
    });
  },
  addTelesales(params) {
    return services.post('/wp/client/telesales/add', params, {
      action: '添加至电销列表',
    });
  },
  batchAddTelesales(params) {
    return services.json('/wp/client/telesales/batch/add', params, {
      action: '批量添加至电销列表',
    });
  },
  // 电销
  getTelesaleList(params) {
    return services.get('/wp/client/telesales/query', {
      action: '查询电销列表',
      params,
    });
  },

  getTelesaleRecord(params) {
    return services.get('/wp/client/telesales/record/query', {
      action: '查询电销记录',
      params,
    });
  },
  // 无效列表
  deleteClientInfo(params) {
    return services.post('/wp/client/info/delete', params, {
      action: '删除客户',
    });
  },
  deleteBatchClientInfo(params) {
    return services.post('/wp/client/info/batch/delete', params, {
      action: '批量删除客户',
    });
  },
  recoverClientInfo(params) {
    return services.post('/wp/client/info/recover/invalid', params, {
      action: '恢复无效客户',
    });
  },

  // 客户详情-客户意向
  getClientIntention(params) {
    return services.get('/wp/client/intention/record/get', {
      action: '获取客户意向',
      params,
    });
  },
  // 客户分析
  getClientIndicators(params) {
    return services.get('/wp/clientAnalyse/queryRealtimeClientCount', {
      action: '获取实时指标',
      params,
    });
  },
  getNewClientTrend(params) {
    return services.json('/wp/clientAnalyse/queryClientIncreasingTrend', params, {
      action: '获取客户新增趋势',
    });
  },
  getLifeCycleDistribution(params) {
    return services.get('/wp/clientAnalyse/queryClientDistributionByStage', {
      action: '获取客户生命周期分布',
      params,
    });
  },
  getInvalidReasonData(params) {
    return services.get('/wp/clientAnalyse/queryInvalidClientDistributionByReason', {
      action: '获取客户无效原因分析',
      params,
    });
  },
  getInvalidChannelData(params) {
    return services.get('/wp/clientAnalyse/queryInvalidClientDistributionBySource', {
      action: '获取无效客户来源分析',
      params,
    });
  },
  getNewClientRank(params, action) {
    return services.get('/wp/clientAnalyse/queryNewClientTop10By', {
      action,
      params,
    });
  },
  getClientData(params, action) {
    return services.get('/wp/clientAnalyse/queryNewClientTop10ByEmployee', {
      action: '获取导购客户数据',
      params,
    });
  },
  getEmployee(params) {
    return services.get('/wp/employee/query', {
      params,
      action: '查询员工列表',
    });
  },
};
