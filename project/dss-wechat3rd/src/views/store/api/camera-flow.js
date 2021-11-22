import services from '@/dss-common/utils/services';

export default {
  fetchCustomerList(params) {
    return services.json('/c/customer/query_customer/v2', params, {
      action: '获取客户到店列表'
    });
  },
  fetchRealTimeCustomerList(params) {
    return services.get('/c/statistic/report/store/camera_rt_customer/v2', {
      action: '获取客户到店列表',
      params
    });
  },
  getUserTrack(params) {
    return services.get('/c/stat/pf/customer_enter_trajectory', {
      action: '获取到店记录',
      params
    });
  },
  updateTagFlag(params) {
    return services.post('/c/statistic/report/store/cameraCustomerTagData/update/v2', params, {
      action: '修改用户标签'
    });
  },
  getCustomerRecordDay(params) {
    return services.get('/c/stat/pf/customer/record/day', {
      action: '获取今日客流',
      params
    });
  },
  getCustomerRecordWeek(params) {
    return services.get('/c/stat/pf/customer/record/week', {
      action: '获取本周客流',
      params
    });
  },
  getCustomerRecordMonth(params) {
    return services.get('/c/stat/pf/customer/record/month', {
      action: '获取本月客流',
      params
    });
  },
  getStoreCustomerRecordDay(params) {
    return services.get('/c/flow/count/store/day', {
      action: '获取门店今日客流',
      params
    });
  },
  getStoreCustomerRecordWeek(params) {
    return services.get('/c/flow/count/store/week', {
      action: '获取门店本周客流',
      params
    });
  },
  getStoreCustomerRecordMonth(params) {
    return services.get('/c/flow/count/store/month', {
      action: '获取门店本月客流',
      params
    });
  },
  getEpCustomerRecordDay(params) {
    return services.get('/c/flow/count/ep/day', {
      action: '获取今日客流',
      params
    });
  },
  getEpCustomerRecordWeek(params) {
    return services.get('/c/flow/count/ep/week', {
      action: '获取本周客流',
      params
    });
  },
  getEpCustomerRecordMonth(params) {
    return services.get('/c/flow/count/ep/month', {
      action: '获取本月客流',
      params
    });
  },
  getConversionRate(params) {
    return services.get('c/stat/pf/store/conversion_rate', {
      action: '获取客流画像',
      params
    });
  },
  getEnterRate(params) {
    return services.get('/c/statistic/report/store/enter/rate', {
      action: '获取入店率',
      params
    });
  },
  ENTER_RATE_API: '/c/statistic/report/store/enter/rate'
};
