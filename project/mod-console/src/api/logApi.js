import services from '@/dss-common/utils/services';
import { OrgSchema } from '@/business-common/constants/apiEnum';

export function getAuditLog(params) {
  return services.post(OrgSchema + '/permission/log/query', params, {
    action: '获取审计日志列表',
  });
}
