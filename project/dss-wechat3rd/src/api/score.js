/**
 * Created by love on 18/9/14.
 * @author trumpli<李志伟>
 */
import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 积分抵现配置
   * @param params
   */
  add(params) {
    return services.json(`/plt/score/config/addScoreCash`, params, {
      action: '积分抵现配置',
    });
  },
  /**
   * 积分抵现配置
   * @param params
   */
  update(params) {
    return services.json(`/plt/score/config/update`, params, {
      action: '积分抵现配置',
    });
  },
  /**
   * 获取积分抵现配置
   * @param params
   */
  getConfig(params) {
    return services.post(`/plt/score/config/scoreCashdetail`, params, {
      action: '积分抵现配置',
      hidden: true,
    });
  },
};
