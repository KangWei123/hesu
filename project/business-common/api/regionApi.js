/**
 * 行政区域服务
 */
import services from '@/dss-common/utils/services';

export function queryRegion(parentId = 0) {
  return services.get('/c/buz/region/query', {
    action: '获取区域',
    params: {
      parentId: parentId,
    },
  });
}

export function getAppList(params) {
  return services.json('/plt/app/queryList', params, {
    action: '查询应用列表',
  });
}
