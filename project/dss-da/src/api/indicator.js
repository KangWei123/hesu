import services from '@/dss-common/utils/services';
import { API_URL, SUFFIX } from './common.js';

// 指标数据列表-数据详情 日
const URL_INDICATOR_KPI_DETAIL_D = API_URL + 'order.kpi.detail.d' + SUFFIX;
// 指标数据列表-数据详情 周
const URL_INDICATOR_KPI_DETAIL_W = API_URL + 'order.kpi.detail.w' + SUFFIX;
// 指标数据列表-数据详情 月
const URL_INDICATOR_KPI_DETAIL_M = API_URL + 'order.kpi.detail.m' + SUFFIX;

export default {
  URL_INDICATOR_KPI_DETAIL_D,
  URL_INDICATOR_KPI_DETAIL_W,
  URL_INDICATOR_KPI_DETAIL_M,

  getIndicatorKpiDetailByDay(params) {
    return services.get(URL_INDICATOR_KPI_DETAIL_D, {
      params,
      action: '获取日销售指标数据详情'
    });
  },

  getIndicatorKpiDetailByWeek(params) {
    return services.get(URL_INDICATOR_KPI_DETAIL_W, {
      params,
      action: '获取周销售指标数据详情'
    });
  },

  getIndicatorKpiDetailByMonth(params) {
    return services.get(URL_INDICATOR_KPI_DETAIL_M, {
      params,
      action: '获取月销售指标数据详情'
    });
  }
};
