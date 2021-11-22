import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  queryTagList(params) {
    return services.get(`${WpSchema}/wxlabel/query/list`, {
      params,
      action: '获取微信标签'
    });
  },
  addTag(params) {
    return services.post(`${WpSchema}/wxlabel/add`, params, { action: '创建微信标签' });
  },
  updateTag(params) {
    return services.post(`${WpSchema}/wxlabel/update`, params, { action: '修改微信标签' });
  },
  deleteTag(params) {
    return services.post(`${WpSchema}/wxlabel/delete`, params, { action: '删除微信标签' });
  }
};
