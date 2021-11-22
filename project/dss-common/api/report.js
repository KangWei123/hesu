import services from '../utils/services';
import Qs from 'qs';

const AI_PORTRAIT_URL = '/c/stat/portrait/ep_camera_portrait';
const AP_PORTRAIT_URL = '/c/stat/portrait/globalPortraits';

// 全局分析
export default {
  AI_PORTRAIT_URL,
  AP_PORTRAIT_URL,

  distri(params) {
    return services.get('/c/statistic/report/customer/area/distri', {
      action: '店铺客流量分布',
      params
    });
  },
  areaTree() {
    return services.get('c/buz/store/locationsTree', {
      action: '获取地区'
    });
  },
  area() {
    return services.get('/c/statistic/report/meta/area', {
      action: '获取地区'
    });
  },
  trend(params) {
    return services.get('/c/stat/pf/compare', {
      action: '查询店铺、地区 对比数据',
      params,
      paramsSerializer(params) {
        return Qs.stringify(params, { arrayFormat: 'indices', allowDots: true });
      }
    });
  },
  rtInfo(params) {
    return services.get('/c/stat/pf/globalRTInfo', {
      action: '查询实时统计数据',
      params
    });
  },
  topTen(params) {
    return services.get('/c/stat/pf/topTen', {
      action: '查询店铺流量TOP10',
      params
    });
  },
  location() {
    return services.get('/c/buz/store/locations', {
      action: '获取区域列表'
    });
  },
  // 泉后用户洞察 - 概览
  getDmpAnalysis(params) {
    return services.get('/c/dmp/analysis', {
      action: '获取用户洞察数据',
      params: params
    });
  },
  getXSWeeklyPortraits(params) {
    return services.get('/c/stat/portrait/weeklyReportGlobalPortraits', {
      action: '获取周报画像信息',
      params
    });
  },
  getXSWeeklyPassflow(params) {
    return services.get('/c/stat/pf/globalWeeklyPassengerFlow', {
      action: '获取周报客流信息',
      params
    });
  },
  getXSWeeklyfieldPassflow(params) {
    return services.get('/c/stat/pf/fieldPassengerFlow', {
      action: '获取周报客流趋势信息',
      params
    });
  },
  getGloalConversionRate(params) {
    return services.get('/c/stat/pf/conversion_rate', {
      action: '获取客户画像',
      params
    });
  },
  queryDeviceExist() {
    return services.get('/c/buz/device/queryEpDeviceType', {
      action: '判断是否有设备'
    });
  },
  trendUrl: '/c/stat/pf/compare_download',
  report: {
    //实时客流数据
    passengerStatistics: 'c/stat/pf/storeRTInfo',
    // 实时客户量数据
    customerStatistics: 'c/stat/pf/storeRTUVInfo',
    // 客流量分析
    passengerFlow: '/c/statistic/report/customer/analyse',
    // 客流量时段对比
    passengerFlowCompare: '/c/statistic/report/customer/analyse/period/compare',
    // 客流标签
    passengerTag: '/c/statistic/report/store/customerTagData'
  }
};
