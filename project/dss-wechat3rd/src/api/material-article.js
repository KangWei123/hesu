import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  getMaterialArticleList(params) {
    return services.get(WpSchema + '/material_article/list', {
      action: '获取素材中心图文列表',
      params
    });
  },
  /**
   * 获取素材中心图文分组列表
   */
  getGraphicGroupList(params) {
    return services.get(`${WpSchema}/article_group/list`, {
      action: '获取素材中心图文分组列表',
      params
    });
  }
};
