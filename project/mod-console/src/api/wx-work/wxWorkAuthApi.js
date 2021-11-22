import services from '@/dss-common/utils/services';
import { url } from '../appApi';
const SaleScheme = '/sale';
export default {
  getWxWorkAuthStatus(params) {
    return services.get(SaleScheme + '/wxwork_app_auth/status/query', {
      action: '查询企业微信授权状态',
      params,
    });
  },
};
