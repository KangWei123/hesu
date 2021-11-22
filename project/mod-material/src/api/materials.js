/**
 * Created by love on 18/9/14.
 * @author trumpli<李志伟>
 */
import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
export default {
  // 上传地址
  add: {
    url: `${WpSchema}/materials/add`,
    //, params:['sellerId','wxAppId','file','type','title','introduction']
  },
  // 上传本地地址
  addLocal: {
    url: `${WpSchema}/materials/addLocal`,
    //, params:['sellerId','wxAppId','file','type','title','introduction']
  },

  addTemporary: {
    url: `${WpSchema}/materials/mediaUploadTemporary`,
  },
  /**
   * 通过id列表查素材
   */
  queryMaterialsById(params) {
    return services.get('/wp/materials/listById', {
      params,
      action: '根据id查素材',
    });
  },
  /**
   * 删除微信素材
   */
  delete(params) {
    return services.get(WpSchema + '/materials/delete', {
      action: '删除微信素材',
      params,
    });
  },
  /**
   * 微信素材列表
   */
  list(params) {
    return services.get(WpSchema + '/materials/list', {
      action: '微信素材列表',
      params,
    });
  },
  /**
   * 增加分组
   * @param params
   */
  addGroup(params) {
    return services.post(WpSchema + '/materials/group/add', params, {
      action: '增加分组',
    });
  },
  /**
   * 删除分组
   */
  deleteGroup(params) {
    return services.get(WpSchema + '/materials/group/delete', {
      action: '删除分组',
      params,
    });
  },
  /**
   * 重命名分组
   */
  renameGroup(params) {
    return services.post(WpSchema + '/materials/group/rename', params, {
      action: '重命名分组',
    });
  },
  /**
   * 查询分组
   */
  listGroup(params) {
    return services.get(WpSchema + '/materials/group/list', {
      action: '查询分组',
      params,
    });
  },
  /**
   * 文件变更分组
   */
  changeGroup(params) {
    return services.post(WpSchema + '/materials/group/change', params, {
      action: '文件变更分组',
    });
  },
  /**
   * 查询文章列表
   */
  articleList(params) {
    return services.get(WpSchema + '/article/list', {
      params,
      action: '微信文章列表',
    });
  },
};
