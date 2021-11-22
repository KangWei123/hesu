import services from '@/dss-common/utils/services';
import { API_URL, SUFFIX } from './common.js';

// 会员分析-日会员趋势
const URL_USER_TREND_D = API_URL + 'user.trend.d' + SUFFIX;
// 会员分析-会员数据详情
const URL_USER_TREND_DETAL = API_URL + 'user.trend.detail' + SUFFIX;
// 会员贡献分析-会员复购率
const URL_USER_REPEAT_PURCHASE_D = API_URL + 'user.repeat.purchase.d' + SUFFIX;
// 会员贡献分析-日店铺顾客忠诚度占比
const URL_USER_CUSTOMER_LOYALTY_D = API_URL + 'user.repeat.customer.loyalty.d' + SUFFIX;
// 会员贡献分析-日店铺顾客购买力占比
const URL_UESER_CUSTOMER_BUYPOWER_D = API_URL + 'user.repeat.customer.buypower.d' + SUFFIX;
//会员概览-实时数据
const URL_USER_REALTIME_OVERVIEW = API_URL + 'user.realtime.overview' + SUFFIX;

const URL_USER_REALTIME_NEW_TREND = API_URL + 'user.realtime.new.trend' + SUFFIX;
const URL_USER_REALTIME_ACTIVE_TREND = API_URL + 'user.realtime.active.trend' + SUFFIX;
const URL_USER_REALTIME_NEW_RATE_TREND = API_URL + 'user.realtime.new.rate.trend' + SUFFIX;
const URL_USER_REALTIME_PCT_TREND = API_URL + 'user.realtime.pct.trend' + SUFFIX;

//会员概览-会员消费金额分布
const URL_USER_REALTIME_OVERVIEW_DISTRIBUTI = API_URL + 'user.realtime.consume.distributi' + SUFFIX;
//会员概览-会员生命周期分布
const URL_USER_REALTIME_OVERVIEW_DISTRIBUTION = API_URL + 'user.realtime.lifecycle.distribution' + SUFFIX;
//会员概览-会员等级分布
const URL_USER_REALTIME_OVERVIEW_LEVEL = API_URL + 'user.realtime.level.distribution' + SUFFIX;
export default {
  URL_USER_TREND_D,
  URL_USER_TREND_DETAL,
  URL_USER_REPEAT_PURCHASE_D,
  URL_USER_CUSTOMER_LOYALTY_D,
  URL_UESER_CUSTOMER_BUYPOWER_D,
  URL_USER_REALTIME_OVERVIEW_DISTRIBUTI,
  URL_USER_REALTIME_OVERVIEW_DISTRIBUTION,
  URL_USER_REALTIME_OVERVIEW_LEVEL,
  listTrendData(params) {
    return services.get(URL_USER_TREND_D, {
      params,
      action: '获取趋势指标'
    });
  },
  listLoyaltyAnalysisData(params) {
    return services.get(URL_USER_CUSTOMER_LOYALTY_D, {
      params,
      action: '获取忠诚度分析'
    });
  },
  listPurchaseAnalysisData(params) {
    return services.get(URL_UESER_CUSTOMER_BUYPOWER_D, {
      params,
      action: '获取购买力分析'
    });
  },
  listRepeatPurchase(params) {
    return services.get(URL_USER_REPEAT_PURCHASE_D, {
      params,
      action: '获取复购率'
    });
  },
  getMemberRealData(params) {
    return services.get(URL_USER_REALTIME_OVERVIEW, {
      params,
      action: '获取实时指标'
    });
  },
  getMemberTData(params) {
    return services.get(URL_USER_TREND_DETAL, {
      params,
      action: '获取昨日指标'
    });
  },
  listNewHourData(params) {
    return services.get(URL_USER_REALTIME_NEW_TREND, {
      params,
      action: '获取新增会员小时指标'
    });
  },
  listActiveHourData(params) {
    return services.get(URL_USER_REALTIME_ACTIVE_TREND, {
      params,
      action: '获取活跃会员小时指标'
    });
  },
  listNewRateHourData(params) {
    return services.get(URL_USER_REALTIME_NEW_RATE_TREND, {
      params,
      action: '获取新增会员占比小时指标'
    });
  },
  listPctHourData(params) {
    return services.get(URL_USER_REALTIME_PCT_TREND, {
      params,
      action: '获取会员客单价小时指标'
    });
  },
  listDistributiData(params) {
    return services.get(URL_USER_REALTIME_OVERVIEW_DISTRIBUTI, {
      params,
      action: '获取会员消费金额分布'
    });
  },
  listDistributionData(params) {
    return services.get(URL_USER_REALTIME_OVERVIEW_DISTRIBUTION, {
      params,
      action: '获取会员消费金额分布'
    });
  },
  listLEVELData(params) {
    return services.get(URL_USER_REALTIME_OVERVIEW_LEVEL, {
      params,
      action: '获取会员等级分布'
    });
  }
};
