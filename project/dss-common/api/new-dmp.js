import services from '../utils/services';

const PREFIX = '/dmp2/rest';
export default {
  getTagTree() {
    return services.post(`${PREFIX}/analysis/tag/tree`, {
      action: '获取标签'
    });
  },
  getTags(params) {
    return services.post(`${PREFIX}/analysis/tag/dim`, params, {
      action: '获取标签可选值'
    });
  },
  getAnalysisCount(params) {
    return services.post(`${PREFIX}/analysis/count`, params, {
      action: '获取条件分析结果'
    });
  },
  getAnalysis(params) {
    return services.post(`${PREFIX}/analysis/metric`, params, {
      action: '获取指标分析结果'
    });
  },
  getCustomTags(params) {
    return services.post(`${PREFIX}/tag/listTag`, params, {
      action: '获取自定义标签列表'
    });
  },
  getCrowd(params) {
    return services.post(`${PREFIX}/crowd/query`, params, {
      action: '获取我的人群'
    });
  },
  saveCrowd(params) {
    return services.post(`${PREFIX}/crowd/add`, params, {
      action: '保存我的人群'
    });
  },
  updateCrowd(params) {
    return services.post(`${PREFIX}/crowd/update`, params, {
      action: '更新我的人群'
    });
  },
  delCrowd(id) {
    return services.get(`${PREFIX}/crowd/delete?id=${id}`, {
      action: '删除我的人群'
    });
  },
  getCrowdById(id) {
    return services.get(`${PREFIX}/crowd/query/by/id?id=${id}`, {
      action: '查询人群'
    });
  },
  login(params) {
    return services.get(`${PREFIX}/login/in`, {
      action: '登录',
      params
    });
  },
  checkLogin() {
    return services.get(`${PREFIX}/login/check`, {
      action: '获取用户信息'
    });
  },
  logout() {
    return services.get(`${PREFIX}/login/out`, {
      action: '注销登录'
    });
  },
  getAreaTree() {
    return services.get(`${PREFIX}/analysis/tag/store`, {
      ation: '获取区域'
    });
  },
  crowdImport(params) {
    return services.post(`${PREFIX}/crowd/import`, params, {
      action: '人群导入'
    });
  }
};
