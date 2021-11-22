import services from '../utils/services';
import Qs from 'qs';

export default {
  list(params) {
    return services.post('/c/buz/store/querylist', params, {
      action: '获取门店列表'
    });
  },
  query(params) {
    return services.get('/c/buz/store/query', {
      action: '查询门店',
      params
    });
  },
  /**
   * 查询获取组织树信息列表
   */
  getOrganizationTree(params) {
    return services.get('/wp/organization/tree/get', {
      params,
      action: '获取组织树',
      hidden: true
    });
  },
  /* detail (id) {
    return services.get(`/api/store/get?id=${id}`, {
      action: '获取门店详情'
    })
  }, */
  create(data) {
    return services.post('/c/buz/store/add', data, {
      action: '新增门店',
      transformRequest: function(params) {
        return Qs.stringify(params, {
          allowDots: true
        });
      }
    });
  },
  update(data) {
    return services.post('/c/buz/store/update', data, {
      action: '更新门店',
      transformRequest: function(params) {
        return Qs.stringify(params, {
          allowDots: true
        });
      }
    });
  },
  remove(id) {
    return services.delete('/c/buz/store/delete', {
      action: '删除门店',
      params: {
        storeId: id
      }
    });
  },
  queryRegion(parentId = 0) {
    return services.get('/c/buz/region/query', {
      action: '获取区域',
      params: {
        parentId: parentId
      }
    });
    // /c/buz/region/query?parentId=0
  },
  batchUploadUrl: '/c/buz/store/batchUpload',

  // 新老用户明细
  customerDetail: '/c/statistic/report/store/newold/custom/detail',

  /**
   * 获取 新老用户明细
   * @param startDate
   * @param endDate
   * @param type
   * @returns {AxiosPromise}
   */
  getCustomerDetail(startDate, endDate, type) {
    return services.delete('/c/statistic/report/store/newold/custom/detail', {
      action: '新老用户明细',
      params: {
        startDate: startDate,
        endDate: endDate,
        type: type
      }
    });
  },
  /**
   * 新老用户概览
   * @param startDate
   * @param endDate
   * @param type
   * @returns {AxiosPromise}
   */
  getCustomerOverview(startDate, endDate, type) {
    return services.delete('/c/statistic/report/store/newold/custom/percent', {
      action: '新老用户概览',
      params: {
        startDate: startDate,
        endDate: endDate,
        type: type
      }
    });
  },
  /**
   * 客户回访周期
   * @param startDate
   * @param endDate
   * @param pageNo
   * @param pageSize
   */
  getCustomerRevisitRate(startDate, endDate, pageNo, pageSize) {
    return services.delete('/c/stat/customer/revisit', {
      action: '客户回访周期',
      params: {
        startDate: startDate,
        endDate: endDate,
        pageNo: pageNo,
        pageSize: pageSize
      }
    });
  },
  /**
   * 查询入住率
   * @param startDate
   * @param endDate
   * @param datetype
   * @param deviceType(设备类型)
   */
  getEnterRate(startDate, endDate, datetype, deviceType) {
    return services.delete('/c/statistic/report/store/enter/rate', {
      action: '客户回访周期',
      params: {
        startDate: startDate,
        endDate: endDate,
        datetype: datetype,
        deviceType: deviceType
      }
    });
  },

  getEnterTimes(date) {
    return services.get('/c/statistic/report/store/times', {
      action: '客户到店次数',
      params: {
        date
      }
    });
  },
  /**
   * 客流量时段对比
   * @param startDate
   * @param endDate
   * @param period
   * @returns {any}
   */
  passengerFlowCompare(startDate, endDate, source, period) {
    return services.get('/c/stat/pfh/list_hour', {
      action: '客流量时段对比',
      params: {
        startDate,
        endDate,
        source,
        period
      }
    });
  },

  // 下载 -客流量时段对比
  PASSENGER_FLOW_COMPARE_DOWNLOAD: '/c/stat/pfh/list_hour_download',

  ENTER_RATE_API: '/c/statistic/report/store/enter/rate',

  /**
   * 客流分析
   * @param startDate
   * @param endDate
   */
  passengerAnalysisList(params) {
    return services.get('/c/stat/pf/list', {
      action: '客流量分析数据',
      params: params
    });
  },

  // 下载 - 客流分析
  DOWNLOAD_PASSENGER_ANALYSIS_LIST: '/c/stat/pf/list_download',

  /**
   * 报表数据（日报）
   * @param startDate
   */
  dailyReportData(params) {
    return services.get('/c/stat/pf/dailyReport', {
      action: '客流量分析数据',
      params: params
    });
  },

  /**
   * 报表数据（周报）
   * @param startDate
   * @param endDate
   */
  weeklyReportData(params) {
    return services.get('/c/stat/pf/weeklyReport', {
      action: '周报数据',
      params: params
    });
  },

  /**
   * 报表数据（周报画像）
   * @param startDate
   * @param endDate
   */
  weeklyReportPortraitsData(params) {
    return services.get('/c/stat/portrait/weeklyReportPortraits', {
      action: '周报数据画像',
      params: params
    });
  },

  /**
   * 报表数据（周报画像）
   * @param startDate
   * @param endDate : 日报的endDate和startDate是一样的
   * @param type : d日报 w周报
   */
  shareReport(params) {
    return services.get('/c/rs/shareReport', {
      action: '报表分享',
      params: params
    });
  },
  /**
   * 获取门店，不包含门店类型是商圈和没设备的列表
   */
  queryDeviceStore() {
    return services.get('/c/buz/store/queryCBDStoreList', {
      action: '获取门店树'
    });
  },
  /**
   * 判断是否有设备
   */
  queryDeviceExist() {
    return services.get('/c/buz/device/queryStoreDeviceType', {
      action: '判断是否有设备'
    });
  },

  /**
   * 获取洞察区域列表
   */
  getAreaList(params) {
    return services.get('/c/buz/store/area/query_list', {
      action: '获取洞察区域列表',
      params
    });
  },

  /**
   * 获取轨迹分布
   */
  getTrackTransform(params) {
    return services.get('/c/stat/store/area/customer_transform', {
      action: '获取轨迹分布',
      params
    });
  },

  /**
   * 获取区域联动分析
   */
  getGanged(params) {
    return services.get('/c/stat/store/area/customer_ganged', {
      action: '区域联动分析',
      params
    });
  },

  /**
   * 获取入口转换
   */
  getEntrance(params) {
    return services.get('/c/stat/store/area/entrance_count', {
      action: '入口转换',
      params
    });
  }
};
