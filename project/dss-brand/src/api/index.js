import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 查询行业类目
   * @param industryCategoryId
   */
  queryIndustry(industryCategoryId) {
    return services.get(WpSchema + '/industry/category/query', {
      action: '查询行业类目',
      params: {
        industryCategoryId
      }
    });
  },

  /**
   * 创建品牌信息
   * @param params
   */
  addBrand(params) {
    return services.post(WpSchema + '/brand/add', params, {
      action: '创建品牌信息'
    });
  },

  /**
   * 更新品牌信息
   * @param params
   */
  updateBrand(params) {
    return services.post(WpSchema + '/brand/update', params, {
      action: '更新品牌信息'
    });
  },

  /**
   * 订购惟客宝或者客流宝
   * @param params
   */
  purchaseFunction(params) {
    return services.post(WpSchema + '/app/setting/purchase', params, {
      action: '订购惟客宝或者客流宝'
    });
  },
  /**
   * 切换门店
   * @param params
   */
  changeStore(params) {
    return services.get(WpSchema + '/store/choose', {
      action: '切换门店',
      params
    });
  }
};
