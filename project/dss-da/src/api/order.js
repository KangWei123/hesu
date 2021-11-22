import services from '@/dss-common/utils/services';
import { API_URL, SUFFIX } from './common.js';

// 订单分析-门店订单量排行
const URL_ORDER_STORE_RANK = API_URL + 'order.cnt.store.rank' + SUFFIX;
// 订单分析-门店订单量趋势图
const URL_ORDER_TREND_D = API_URL + 'order.cnt.trend.d' + SUFFIX;
// 订单分析-门店订单指标数据
const URL_ORDER_DATA_DETAIL = API_URL + 'order.cnt.analysis.detail' + SUFFIX;
// 订单分析-品类订单量气泡图
const URL_ORDER_BUBBLE = API_URL + 'order.cnt.bubble' + SUFFIX;
// 订单分析-单品订单量排行
const URL_ORDER_ITEM_RANK = API_URL + 'order.cnt.item.rank' + SUFFIX;
// 订单分析-日门店顾客性别占比
const URL_ORDER_CUSTOMER_GENDER_D = API_URL + 'order.cnt.customer.gender.d' + SUFFIX;
// 订单分析-日门店顾客年龄占比
const URL_ORDER_CUSTOMER_AGE_D = API_URL + 'order.cnt.customer.age.d' + SUFFIX;
// 订单分析-日门店顾客忠诚度占比
const URL_ORDER_CUSTOMER_LOYALTY_D = API_URL + 'order.cnt.customer.loyalty.d' + SUFFIX;
// 订单分析-日门店顾客购买力占比
const URL_ORDER_CUSTOMER_BUYPOWER_D = API_URL + 'order.cnt.customer.buypower.d' + SUFFIX;

export default {
  URL_ORDER_STORE_RANK,
  URL_ORDER_TREND_D,
  URL_ORDER_DATA_DETAIL,
  URL_ORDER_BUBBLE,
  URL_ORDER_ITEM_RANK,
  URL_ORDER_CUSTOMER_LOYALTY_D,
  URL_ORDER_CUSTOMER_BUYPOWER_D,
  URL_ORDER_CUSTOMER_GENDER_D,
  URL_ORDER_CUSTOMER_AGE_D,

  getOrderTrendByDay(params) {
    return services.get(URL_ORDER_TREND_D, {
      params,
      action: '获取门店订单量趋势图'
    });
  },

  getOrderItemRank(params) {
    return services.get(URL_ORDER_ITEM_RANK, {
      params,
      action: '获取门店单品订单量排行'
    });
  },

  getOrderIndicator(params) {
    return services.get(URL_ORDER_DATA_DETAIL, {
      params,
      action: '获取门店订单指标数据'
    });
  },

  getStoreOrderRank(params) {
    return services.get(URL_ORDER_STORE_RANK, {
      params,
      action: '获取门店订单量排行数据'
    });
  }
};
