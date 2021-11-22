import services from '@/dss-common/utils/services';

export const relativeVerifyApi = {
  queryList(params) {
    return services.get('/wp/project/list', {
      action: '查询活动列表',
      params,
    });
  },
  approve(params) {
    return services.get('/wp/project/list', {
      action: '审核亲友',
      params,
    });
  },
};
