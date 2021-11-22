import { API_URL, SUFFIX } from './common.js';
import services from '@/dss-common/utils/services';
// 销售额分析-日销售额趋势图
const URL_SALE_TREND_D = API_URL + 'order.sale.trend.d' + SUFFIX;
// 销售额分析-品类销售额气泡图
const URL_SALE_BUBBLE = API_URL + 'order.sale.bubble' + SUFFIX;
// 销售额分析-销售指标
const URL_SALE_ANALYSIS = API_URL + 'order.sale.analysis.detail' + SUFFIX;
// 销售额分析-单品销售额排行
const URL_SALE_ITEM_RANK = API_URL + 'order.sale.item.rank' + SUFFIX;
// 销售额分析-日门店顾客忠诚度占比
const URL_SALE_CUSTOMER_LOYALTY_D = API_URL + 'order.sale.customer.loyalty.d' + SUFFIX;
// 销售额分析-日门店顾客购买力占比
const URL_SALE_CUSTOMER_BUYPOWER_D = API_URL + 'order.sale.customer.buypower.d' + SUFFIX;
// 销售额分析-日门店顾客性别占比
const URL_SALE_CUSTOMER_GENDER_D = API_URL + 'order.sale.customer.gender.d' + SUFFIX;
// 销售额分析-日门店顾客年龄占比
const URL_SALE_CUSTOMER_AGE_D = API_URL + 'order.sale.customer.age.d' + SUFFIX;
// 销售额分析-门店销售额排行
const URL_SALE_STOER_FEE_RANK = API_URL + 'order.sale.store.fee.rank' + SUFFIX;
// 销售额分析-门店销量排行(deprecated)
const URL_SALE_FEE_STORE_COUNT_RANK = API_URL + 'order.sale.fee.store.count.rank' + SUFFIX;

// 销售概览-今日实时(deprecated)
const URL_SALE_OVERVIEW_ANALYSIS = API_URL + 'order.realtime.store.analysis.detail' + SUFFIX;
// 销售概览-全部门店今日实时(deprecated)
const URL_SALE_OVERVIEW_APP_ANALYSIS = API_URL + 'order.realtime.app.analysis.detail' + SUFFIX;
// 销售概览-门店销售额排行(deprecated)
const URL_SALE_OVERVIEW_STORE_FEE = API_URL + 'order.realtime.store.fee.rank' + SUFFIX;
// 销售概览-门店订单量排行(deprecated)
const URL_SALE_OVERVIEW_STORE_CNT = API_URL + 'order.realtime.store.cnt.rank' + SUFFIX;
// 销售分析概览-门店同比增长排行
const URL_SALE_OVERVIEW_STORE_RATE = API_URL + 'order.realtime.store.increase.rate.rank' + SUFFIX;

// 销售分析概览-门店实时销售额趋势图
const URL_SALE_OVERVIEW_TREND_SALE = API_URL + 'order.realtime.store.sale.trend' + SUFFIX;
// 销售分析概览-门店实时订单量趋势图
const URL_SALE_OVERVIEW_TREND_CNT = API_URL + 'order.realtime.store.order.cnt.trend' + SUFFIX;
// 销售分析概览-门店实时客单价趋势图
const URL_SALE_OVERVIEW_TREND_PRICE = API_URL + 'order.realtime.store.pct.trend' + SUFFIX;
// 销售分析概览-门店实时件单价趋势图
const URL_SALE_OVERVIEW_ITEM_PRICE = API_URL + 'order.realtime.store.item.price.trend' + SUFFIX;
// 销售分析概览-门店实时连带率趋势图
const URL_SALE_OVERVIEW_ITEM_RATE = API_URL + 'order.realtime.store.rate.trend' + SUFFIX;

// 销售分析概览-全部门店实时销售额趋势图
const URL_SALE_OVERVIEW_TREND_APP_SALE = API_URL + 'order.realtime.app.sale.trend' + SUFFIX;
// 销售分析概览-全部门店实时订单量趋势图
const URL_SALE_OVERVIEW_TREND_APP_CNT = API_URL + 'order.realtime.app.order.cnt.trend' + SUFFIX;
// 销售分析概览-全部门店实时客单价趋势图
const URL_SALE_OVERVIEW_TREND_APP_PRICE = API_URL + 'order.realtime.app.pct.trend' + SUFFIX;
// 销售分析概览-全部门店实时件单价趋势图
const URL_SALE_OVERVIEW_ITEM_APP_PRICE = API_URL + 'order.realtime.app.item.price.trend' + SUFFIX;
// 销售分析概览-全部门店实时连带率趋势图
const URL_SALE_OVERVIEW_ITEM_APP_RATE = API_URL + 'order.realtime.app.rate.trend' + SUFFIX;

// 销售分析概览-单品销售额排行
const URL_SALE_OVERVIEW_RANK_FEE = API_URL + 'order.realtime.app.item.fee.rank' + SUFFIX;
// 销售分析概览-单品订单量排行
const URL_SALE_OVERVIEW_RANK_CNT = API_URL + 'order.realtime.app.item.cnt.rank' + SUFFIX;
// 销售分析概览-单品增长率排行
const URL_SALE_OVERVIEW_RANK_RATE = API_URL + 'order.realtime.app.item.increase.rate.rank' + SUFFIX;

// 销售分析概览-门店单品销售额排行
const URL_SALE_OVERVIEW_RANK_STORE_FEE = API_URL + 'order.realtime.store.item.fee.rank' + SUFFIX;
// 销售分析概览-门店单品订单量排行
const URL_SALE_OVERVIEW_RANK_STORE_CNT = API_URL + 'order.realtime.store.item.cnt.rank' + SUFFIX;
// 销售分析概览-门店单品增长率排行
const URL_SALE_OVERVIEW_RANK_STORE_RATE = API_URL + 'order.realtime.store.item.increase.rate.rank' + SUFFIX;

// 销售分析概览-门店品类销售额气泡图
const URL_SALE_OVERVIEW_STORE_BUBBLE = API_URL + 'order.realtime.sotre.category.bubble' + SUFFIX;
// 销售分析概览-店铺品类销售额气泡图
const URL_SALE_OVERVIEW_APP_BUBBLE = API_URL + 'order.realtime.app.category.bubble' + SUFFIX;

export default {
  URL_SALE_TREND_D,
  URL_SALE_BUBBLE,
  URL_SALE_ITEM_RANK,
  URL_SALE_CUSTOMER_LOYALTY_D,
  URL_SALE_CUSTOMER_BUYPOWER_D,
  URL_SALE_CUSTOMER_GENDER_D,
  URL_SALE_CUSTOMER_AGE_D,
  URL_SALE_STOER_FEE_RANK,
  URL_SALE_FEE_STORE_COUNT_RANK,
  URL_SALE_ANALYSIS,
  URL_SALE_OVERVIEW_STORE_FEE,
  URL_SALE_OVERVIEW_STORE_CNT,
  URL_SALE_OVERVIEW_STORE_RATE,
  URL_SALE_OVERVIEW_TREND_SALE,
  URL_SALE_OVERVIEW_TREND_CNT,
  URL_SALE_OVERVIEW_TREND_PRICE,
  URL_SALE_OVERVIEW_ITEM_PRICE,
  URL_SALE_OVERVIEW_ITEM_RATE,
  URL_SALE_OVERVIEW_RANK_FEE,
  URL_SALE_OVERVIEW_RANK_CNT,
  URL_SALE_OVERVIEW_RANK_RATE,
  URL_SALE_OVERVIEW_APP_ANALYSIS,
  URL_SALE_OVERVIEW_ANALYSIS,

  URL_SALE_OVERVIEW_TREND_APP_SALE,
  URL_SALE_OVERVIEW_TREND_APP_CNT,
  URL_SALE_OVERVIEW_TREND_APP_PRICE,
  URL_SALE_OVERVIEW_ITEM_APP_PRICE,
  URL_SALE_OVERVIEW_ITEM_APP_RATE,

  URL_SALE_OVERVIEW_RANK_STORE_FEE,
  URL_SALE_OVERVIEW_RANK_STORE_CNT,
  URL_SALE_OVERVIEW_RANK_STORE_RATE,
  URL_SALE_OVERVIEW_STORE_BUBBLE,
  URL_SALE_OVERVIEW_APP_BUBBLE,
  getBubbleData(params) {
    return services.get(URL_SALE_BUBBLE, {
      params,
      action: '获取销售额分析品类气泡图'
    });
  },
  getItemRankData(params) {
    return services.get(URL_SALE_ITEM_RANK, {
      params,
      action: '获取销售额分析单品销售额排行'
    });
  },
  getTrendData(params) {
    return services.get(URL_SALE_TREND_D, {
      params,
      action: '获取销售额分析趋势图'
    });
  },
  getStoreData(params) {
    return services.get(URL_SALE_STOER_FEE_RANK, {
      params,
      action: '获取门店销售额排行'
    });
  },
  getAnalysisData(params) {
    return services.get(URL_SALE_ANALYSIS, {
      params,
      action: '获取销售指标'
    });
  },
  getOverviewAnalysisData(params) {
    return services.get(URL_SALE_OVERVIEW_ANALYSIS, {
      params,
      action: '获取概览今日实时'
    });
  },
  getOverviewStoreFeeData(params) {
    return services.get(URL_SALE_OVERVIEW_STORE_FEE, {
      params,
      action: '获取概览门店销售额排行'
    });
  },
  getOverviewStoreCntData(params) {
    return services.get(URL_SALE_OVERVIEW_STORE_CNT, {
      params,
      action: '获取概览门店订单量排行'
    });
  }
};
