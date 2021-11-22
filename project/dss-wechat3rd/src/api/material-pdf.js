import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  //上下架画册
  onShelveUrl: {
    url: `${WpSchema}/picture_album/onshelve`
  },
  offShelveUrl: {
    url: `${WpSchema}/picture_album/offshelve`
  },
  /**
   * 新增画册分类
   */
  addEbooksGroupList(params) {
    return services.json(WpSchema + '/album_category/add', params, {
      action: '新增分类'
    });
  },
  /**
   * 校验分类名重复
   */
  checkEbooksGroupName(params) {
    return services.get(`${WpSchema}/album_category/check/name`, {
      action: '校验分类名',
      params
    });
  },
  /**
   * 获取PDF素材分组
   */
  getPictureGroupList(params) {
    return services.get(`${WpSchema}/material_group/list`, {
      action: '获取PDF素材分组',
      params
    });
  },
  /**
   * 获取分组下PDF
   */
  getMaterialList(params) {
    return services.get(`${WpSchema}/material/list`, {
      action: '获取分组下PDF',
      params
    });
  },
  /**
   * 删除画册分类
   */
  deleteEbooksGroupById(params) {
    return services.post(`${WpSchema}/album_category/delete`, params, {
      action: '删除分类'
    });
  },
  /**
   * 编辑画册分类
   */
  modifyEbooksGroup(params) {
    return services.json(`${WpSchema}/album_category/update`, params, {
      action: '编辑画册分类'
    });
  },
  /**
   * 获取画册分类
   */
  getEbooksGroupList(params) {
    return services.get(`${WpSchema}/album_category/query/list`, {
      action: '获取画册分类',
      params
    });
  },
  /**
   * 新增电子画册
   */
  addEbooks(params) {
    return services.post(`${WpSchema}/picture_album/add`, params, {
      action: '新增画册'
    });
  },
  /**
   * 删除电子画册
   */
  deleteEbooksById(params) {
    return services.post(`${WpSchema}/picture_album/delete`, params, {
      action: '获取素材中心图片分组列表'
    });
  },
  /**
   * 电子画册列表
   */
  getEbooksList(params) {
    return services.get(`${WpSchema}/picture_album/query/list`, {
      action: '画册列表',
      params
    });
  }
};
