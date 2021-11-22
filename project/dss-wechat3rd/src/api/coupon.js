/**
 * Created by love on 18/9/14.
 * @author trumpli<李志伟>
 */
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
const postPayLoadData = wpBaseApi.postPayLoadData;

export default {
  /**
   * 查询门店会员信息
   * @param params
   */
  queryUserCoupons(params) {
    return postPayLoadData(WpSchema + '/cashier_board/query_favourable', params, '查询用户优惠券列表');
  }
};
