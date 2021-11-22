/**
 * Created by love on 18/9/14.
 * @author trumpli<李志伟>
 */
import wpBaseApi from '@/business-common/wp-base-api.js';
import services from '@/dss-common/utils/services';
const WpSchema = wpBaseApi.WpSchema;
export default {
  materialAddUrl: {
    url: `${WpSchema}/material/add`
  },
  list(params) {
    return services.get(WpSchema + '/material/list', {
      action: '微信素材列表',
      params
    });
  },
  /**
   * 获取素材中心图文列表
   */
  getGraphicList(params) {
    return services.get(`${WpSchema}/material_article/list`, {
      action: '获取素材中心图文列表',
      params
    });
  },
  /**
   * 获取素材中心图片分组列表
   */
  getGroupList(params) {
    return services.get(`${WpSchema}/material_group/list`, {
      action: '获取素材中心图片分组列表',
      params
    });
  },
  /**
   * 获取素材中心素材列表
   */
  getPicList(params) {
    return services.get(`${WpSchema}/material/list`, {
      action: '获取素材中心素材列表',
      params
    });
  }
};
