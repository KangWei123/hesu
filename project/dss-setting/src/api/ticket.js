import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const wpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 查询票务设置
   * @param params
   */
  getTicket() {
    return services.get(wpSchema + '/ticket/query', {
      action: '查询票务设置'
    });
  },

  /**
   * 修改票务设置
   * @param params
   */
  updateTicket(params) {
    return services.post(wpSchema + '/ticket/update', params, {
      action: '修改票务设置'
    });
  }
};
