/**
 * Created by love on 18/9/14.
 * @author trumpli<李志伟>
 */
import services from '@/dss-common/utils/services';
const CSchema = '/c';

export default {
  /**
   * 商品排行
   * @param params
   */
  itemStat(params) {
    return services.json(CSchema + '/da/item/analysis/get', params, {
      action: '商品排行'
    });
  },
  /**
   * 订单概览
   * @param params
   */
  orderOverview_Today(params) {
    const param = params.storeId ? 'store' : 'app';
    return services.get(CSchema + '/uni_data_report/order.realtime.' + param + '.analysis.detail/get', {
      action: '订单概览',
      params
    });
  },

  /** 销售额 */
  async orderOverview_history_sale(params) {
    try {
      const res = await services.get(CSchema + '/da/marketinganalysis/order.sale.trend.d/entrance/get', {
        action: '订单概览',
        params
      });
      return res.data || [];
    } catch (error) {
      return error;
    }
  },
  /** 订单量 */
  async orderOverview_history_order(params) {
    try {
      const res = await services.get(CSchema + '/da/marketinganalysis/order.cnt.trend.d/entrance/get', {
        action: '订单概览',
        params
      });
      return res.data || [];
    } catch (error) {
      return error;
    }
  },
  /*  获取帮助中心pdf文件*/
  getHelpData(params) {
    return services.post('/wp/help/file/query', params, {
      action: '获取帮助中心文档'
    });
  }
};
