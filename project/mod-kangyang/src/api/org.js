import services from '@/dss-common/utils/services';

export const orgApi = {
  getRoleOrgTree(params) {
    return services.get('/wp/project/list', {
      action: '查询架构组织',
      params,
    });
  },
};
