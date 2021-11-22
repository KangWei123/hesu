import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api';

const WpSchema = wpBaseApi.WpSchema;

export function getCouponListByApp(params) {
  return services.get(WpSchema + '/coupon/listByApp', {
    action: '根据app查询优惠券列表',
    params,
  });
}
