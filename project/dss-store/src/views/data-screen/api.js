import service from '@/dss-common/utils/services.js';

export default {
  // 日客流分布图
  datyFlowList(params) {
    service.get('/faceHistory/datyFlowList', {
      params,
      action: '获取日客流信息'
    });
  },
  // 今日本月客流
  flow(params) {
    service.get('/faceHistory/flow', {
      params,
      action: '获取客流信息'
    });
  },
  // 实时客流列表
  list(params) {
    service.get('/faceHistory/list', {
      params,
      action: '获取实时客流信息'
    });
  },
  // 月客流分布图
  monthFlowList(params) {
    service.get('/faceHistory/monthFlowList', {
      params,
      action: '获取月客流信息'
    });
  },
  // 所有饼图数据
  proportion(params) {
    service.get('/faceHistory/proportion', {
      params,
      action: '获取客流占比信息'
    });
  }
};
