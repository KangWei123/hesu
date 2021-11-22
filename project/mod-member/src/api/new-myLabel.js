import services from '@/dss-common/utils/services';
const PREFIX = '/wp';
const PREFIX_WP = '/wp/user';
const PREFIX_WP_ITEM = '/wp/item';

export default {
  /**
   * 获取门店列表
   */
  getStoreList(params) {
    return services.get(`${PREFIX}/store/query_list`, params, {
      action: '获取门店列表',
    });
  },
  /**
   * 获取地区列表
   */
  getRegionList(parentId = 0) {
    return services.get('/c/buz/region/query', {
      action: '查询所有地区',
      params: {
        parentId: parentId,
      },
    });
  },
  /**
   * 获取客户属性的会员等级列表
   */
  getVipList(params) {
    return services.get(`${PREFIX}/user/level/listSimply`, params, {
      action: '获取客户属性的会员等级列表',
    });
  },
  /**
   * 获取标签保存列表
   */
  getSaveList(params) {
    return services.json(`${PREFIX}/portrait/dmp_tag/tag/auto_label/add`, params, {
      action: '获取标签保存列表',
    });
  },
  /**
   * 获取属性级联列表
   */
  getAttributeList(params) {
    return services.get(`${PREFIX}/portrait/dmp_tag/tag/condition_dim/list`, {
      params,
      action: '获取属性级联列表',
    });
  },
  /**
   * 获取订单属性级联列表
   */
  getOrderList(params) {
    return services.get(`${PREFIX}/analysis/tag/tree`, params, {
      action: '获取订单属性级联列表',
    });
  },
  /**
   * 获取用户属性级联列表
   */
  getBehaviorList(params) {
    return services.get(`${PREFIX}/analysis/tag/tree`, params, {
      action: '获取用户属性级联列表',
    });
  },
  /**
   * 获取筛选条件列表
   */
  getFilterList(params) {
    return services.get(`${PREFIX}/portrait/dmp_tag/tag/condition_conf/list`, {
      params,
      action: '获取筛选条件列表',
    });
  },
  /**
   * 获取指定商品
   */
  getDesignatedCommodityList(params) {
    return services.get(`${PREFIX_WP_ITEM}/queryList`, {
      params,
      action: '获取筛选条件列表',
    });
  },
  /**
   * 获取指定分类列表
   */
  getClassificationList(params) {
    return services.get(`${PREFIX_WP_ITEM}/category/queryCategoryList`, {
      params,
      action: '获取指定分类列表',
    });
  },
  /**
   * 获取商品标签列表
   */
  getCommodityLabelList(params) {
    return services.get(`${PREFIX_WP_ITEM}/label/query`, {
      params,
      action: '获取商品标签列表',
    });
  },
};
