import services from '@/dss-common/utils/services';
import { WpSchema, PlatformSchema, PortalSchema } from '@/business-common/constants/apiEnum';

export const url = {
  provinceList: WpSchema + '/store/query_avl_poc',
  cityList: WpSchema + '/store/query_avl_poc',
  storeByLocation: WpSchema + '/store/query_store_by_pn',
};

// 查询门店——其他
export function getStoreList(params) {
  return services.get(WpSchema + '/store/query_list', {
    action: '查询门店',
    params,
  });
}

/**
 * 获取门店列表
 * @param {*} params
 */
export function listAllStoreByAppId(params) {
  return services.json(PlatformSchema + '/store/query', params, { action: '获取门店列表' });
}

/**
 * 获取门店省份
 * @param params
 * @returns {*}
 */
export function queryProvinceList(params) {
  return services.get(url.provinceList, {
    action: '获取省份',
    params: {
      ...params,
      dimFlg: 'p',
    },
  });
}

/**
 * 获取门店城市
 * @param params
 * @returns {*}
 */
export function queryCityList(params) {
  return services.get(url.cityList, {
    action: '获取城市',
    params: {
      ...params,
      dimFlg: 'c',
    },
  });
}

/**
 * 根据省份（城市）获取门店列表
 * @param params
 * @returns {*}
 */
export function queryStoreByLocation(params) {
  return services.get(url.storeByLocation, {
    action: '根据省份（城市）获取门店列表',
    params,
  });
}

/**
 *  查询城市列表
 * @param params
 * @returns {*}
 */
export function getCityListByRegion(params) {
  return services.get(WpSchema + 'store/query_by_region', {
    action: '查询城市列表',
    params,
  });
}

export function queryRegion(parentId = 0) {
  return services.get(PortalSchema + '/buz/region/query', {
    action: '获取区域',
    params: {
      parentId: parentId,
    },
  });
}

/**
 * 获取品牌物流方式
 * @param {*} params
 */
export function queryAppConfig(params) {
  return services.get(WpSchema + '/store/queryappconfig', {
    params,
    action: '获取品牌物流方式',
  });
}

/**
 * 添加门店
 * @param params
 */
export function addStore(params) {
  return services.post(WpSchema + '/store/add', params, {
    action: '添加门店',
  });
}

/**
 * 删除门店
 * @param params
 */
export function deleteStore(params) {
  return services.get(WpSchema + '/store/delete', {
    action: '删除门店',
    params,
  });
}

/**
 * 修改门店
 * @param params
 */
export function updateStore(params) {
  return services.post(WpSchema + '/store/update', params, {
    action: '修改门店',
  });
}

/**
 * 查询门店
 * @param params
 */
export function viewStore(params) {
  return services.get(WpSchema + '/store/query', {
    action: '查询门店',
    params,
  });
}

/**
 * 营业开关
 * @param params
 */
export function toggleSwitch(params) {
  return services.get(WpSchema + '/store/close', {
    action: '营业开关',
    params,
  });
}

export function stroeQuery(params) {
  return services.json('/plt/store/queryGrowthStore', params, {
    action: '分页查询项目',
  });
}

export const exportStoreListNew = WpSchema + '/store/info/export';
