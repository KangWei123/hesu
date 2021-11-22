const C_PREFIX = '/c';
const WP_PREFIX = '/wp';
import services from '@/dss-common/utils/services.js';
export default {
  floor_download: C_PREFIX + '/stat/store/area/floor_customer_portrait_download',
  area__download: C_PREFIX + '/stat/store/area/area_customer_portrait_download',
  floorAdd(params) {
    return services.post(`${C_PREFIX}/buz/store/floor/add`, params, {
      action: '添加楼层'
    });
  },
  floorList(params) {
    return services.get(`${C_PREFIX}/buz/store/floor/query_list`, {
      action: '获取楼层',
      params
    });
  },
  floorUpdate(params) {
    return services.post(`${C_PREFIX}/buz/store/floor/update`, params, {
      action: '更新楼层'
    });
  },
  floorDelete(params) {
    return services.post(`${C_PREFIX}/buz/store/floor/delete`, params, {
      action: '删除楼层'
    });
  },
  areaAdd(params) {
    return services.post(`${C_PREFIX}/buz/store/area/add`, params, {
      action: '添加区域'
    });
  },
  areaUpdate(params) {
    return services.post(`${C_PREFIX}/buz/store/area/update`, params, {
      action: '更新区域'
    });
  },
  areaDelete(params) {
    return services.post(`${C_PREFIX}/buz/store/area/delete`, params, {
      action: '删除区域'
    });
  },
  areaDetail(params) {
    return services.get(`${C_PREFIX}/buz/store/area/detail`, {
      action: '获取区域信息',
      params
    });
  },
  peopleDetail(params) {
    return services.get(`${C_PREFIX}/stat/store/area/floor_passenger_flow`, {
      action: '获取人流信息',
      params
    });
  },
  area_customer_portrait(params) {
    return services.get(`${C_PREFIX}/stat/store/area/area_customer_portrait_realtime`, {
      action: '获取区域分布',
      params
    });
  },
  floor_customer_portrait(params) {
    return services.get(`${C_PREFIX}/stat/store/area/floor_customer_portrait_realtime`, {
      action: '获取楼层分布',
      params
    });
  },
  funnel_conversion(params) {
    return services.get(`${C_PREFIX}/statistic/store/area/funnel_conversion`, {
      action: '获取客流转化',
      params
    });
  }
};
