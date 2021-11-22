import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
export default {
  addFreightTpl(params) {
    return services.json(WpSchema + '/freight/template/add', params, {
      action: '添加运费模板'
    });
  },
  updateFreightTpl(params) {
    return services.json(WpSchema + '/freight/template/update', params, {
      action: '更新运费模板'
    });
  },
  getTplList(params) {
    return services.get(WpSchema + '/freight/template/query_list', {
      params,
      action: '获取运费模板列表'
    });
  },
  setTplDefault(params) {
    return services.post(WpSchema + '/freight/template/set_default', params, {
      action: '设置默认模板'
    });
  },
  delTpl(params) {
    return services.post(WpSchema + '/freight/template/delete', params, {
      action: '删除模板'
    });
  },
  getTplDetail(params) {
    return services.get(WpSchema + '/freight/template/query', {
      params,
      action: '获取运费模板详情'
    });
  }
};
