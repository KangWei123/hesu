import services from '@/dss-common/utils/services';

export function getAccessList(params) {
  return services.get('/org/access/log/query', {
    action: '获取访问日志列表',
    params,
  });
}
