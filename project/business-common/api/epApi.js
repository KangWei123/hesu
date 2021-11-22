import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const OrgSchema = wpBaseApi.OrgSchema;

export default {
  /**
   * 选择进入惟客宝的企业
   * @param employeeChooseAppId 企业appid
   * @param employeeId 员工id
   */
  chooseEp(params) {
    return services.get(OrgSchema + '/login/choose', {
      action: '选择企业',
      params,
    });
  },
};
