import services from '@/dss-common/utils/services.js';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
export default {
  skuList(params) {
    return services.get(WpSchema + '/item/query/item/sku', {
      action: '获取商品sku列表',
      params
    });
  },

  stockList(params) {
    return services.get(WpSchema + '/warehouse/stock/list', {
      action: '获取商品库存列表',
      params
    });
  }
};
