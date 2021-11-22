import services from '@/dss-common/utils/services';
import { API_URL, SUFFIX } from './common.js';

// 客单价分析-门店客单价排行
const URL_ATV_STORE_RANK = API_URL + 'order.pct.store.rank' + SUFFIX;

// 客单价分析-门店 客单价 指标数据
const URL_ATV_CUSTOMER_DETAIL = API_URL + 'order.pct.analysis.detail' + SUFFIX;
// 客单价分析-门店 件单价 指标数据
const URL_ATV_PIT_DETAIL = API_URL + 'order.pct.pit.detail' + SUFFIX;
// 客单价分析-门店 连带率 指标数据
const URL_ATV_JONIT_RATE_DETAIL = API_URL + 'order.pct.joint.rate.detail' + SUFFIX;

// 客单价分析-客单价趋势图
const URL_ATV_CUTOMER_TREND_D = API_URL + 'order.pct.trend.d' + SUFFIX;
// 客单价分析-件单价趋势图
const URL_ATV_PIT_TREND_D = API_URL + 'order.pct.pit.trend.d' + SUFFIX;
// 客单价分析-连带率趋势图
const URL_ATV_JONIT_RATE_TREND_D = API_URL + 'order.pct.joint.rate.trend.d' + SUFFIX;

// 订单分析-日门店顾客性别占比
const URL_ATV_CUSTOMER_GENDER_D = API_URL + 'order.pct.customer.gender.d' + SUFFIX;
// 订单分析-日门店顾客年龄占比
const URL_ATV_CUSTOMER_AGE_D = API_URL + 'order.pct.customer.age.d' + SUFFIX;
// 客单价分析-日门店顾客忠诚度占比
const URL_ATV_CUSTOMER_LOYALTY_D = API_URL + 'order.pct.customer.loyalty.d' + SUFFIX;
// 客单价分析-日门店顾客购买力占比
const URL_ATV_CUSTOMER_BUYPOWER_D = API_URL + 'order.pct.customer.buypower.d' + SUFFIX;

export default {
  URL_ATV_STORE_RANK,
  URL_ATV_CUSTOMER_DETAIL,
  URL_ATV_PIT_DETAIL,
  URL_ATV_JONIT_RATE_DETAIL,
  URL_ATV_CUTOMER_TREND_D,
  URL_ATV_PIT_TREND_D,
  URL_ATV_JONIT_RATE_TREND_D,
  URL_ATV_CUSTOMER_GENDER_D,
  URL_ATV_CUSTOMER_AGE_D,
  URL_ATV_CUSTOMER_LOYALTY_D,
  URL_ATV_CUSTOMER_BUYPOWER_D,

  getAtvPctIndicator(params) {
    return services.get(URL_ATV_CUSTOMER_DETAIL, {
      params,
      action: '获取门店客单价指标数据'
    });
  },

  getAtvPitIndicator(params) {
    return services.get(URL_ATV_PIT_DETAIL, {
      params,
      action: '获取门店件单价指标数据'
    });
  },

  getAtvJointRateIndicator(params) {
    return services.get(URL_ATV_JONIT_RATE_DETAIL, {
      params,
      action: '获取门店客连带率指标数据'
    });
  },

  getAtvStoreRank(params) {
    return services.get(URL_ATV_STORE_RANK, {
      params,
      action: '获取门店客单价排行'
    });
  },

  getAtvCustomerTrendByDay(params) {
    return services.get(URL_ATV_CUTOMER_TREND_D, {
      params,
      action: '获取客单价趋势'
    });
  },

  getAtvPitTrendByDay(params) {
    return services.get(URL_ATV_PIT_TREND_D, {
      params,
      action: '获取件单价趋趋势'
    });
  },

  getAtvJointRateTrendByDay(params) {
    return services.get(URL_ATV_JONIT_RATE_TREND_D, {
      params,
      action: '获取连带率趋势'
    });
  }
};
