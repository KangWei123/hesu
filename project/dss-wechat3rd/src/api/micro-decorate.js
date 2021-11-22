import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  list(params) {
    return services.get(WpSchema + '/scenemodel/list', {
      action: '查询微装方案',
      params
    });
  },
  del(params) {
    return services.get(WpSchema + '/scenemodel/delete', {
      action: '删除方案',
      params
    });
  },
  add(params) {
    return services.json(WpSchema + '/scenemodel/add', params, {
      action: '新增方案'
    });
  },
  update(params) {
    return services.json(WpSchema + '/scenemodel/update', params, {
      action: '更新方案'
    });
  },
  detial(params) {
    return services.get(WpSchema + '/scenemodel/query', {
      action: '查询方案详情',
      params
    });
  },
  shelf(params) {
    return services.get(WpSchema + '/scenemodel/shelf', {
      action: '方案上下架',
      params
    });
  },

  labelList(params) {
    return services.get(WpSchema + '/scenemodel/label/list', {
      action: '查询标签',
      params
    });
  },
  labelDel(params) {
    return services.get(WpSchema + '/scenemodel/label/delete', {
      action: '删除标签',
      params
    });
  },
  labelAdd(params) {
    return services.json(WpSchema + '/scenemodel/label/add', params, {
      action: '新增标签'
    });
  },
  labelUpdate(params) {
    return services.json(WpSchema + '/scenemodel/label/update', params, {
      action: '更新标签'
    });
  },
  labelCheckName(params) {
    return services.get(WpSchema + '/scenemodel/label/checkname', {
      action: '检查标签名称',
      params
    });
  }
};
