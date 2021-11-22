/**
 * Created by admin on 2019/7/22.
 * @author lemon<李亦黎>
 */
import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  list(params) {
    return services.get(WpSchema + '/order/present/query/list', {
      action: '获取下单有礼列表',
      params,
    });
  },
  add(params) {
    return services.post(WpSchema + '/order/present/add', params, {
      action: '新增下单有礼',
    });
  },
  detail(orderPresentInfoId, appId) {
    return services.get(WpSchema + `/order/present/query?orderPresentInfoId=${orderPresentInfoId}&appId=${appId}`, {
      action: '查看下单有礼活动详情',
    });
  },
  update(OrderPresentQuery) {
    return services.json(WpSchema + '/order/present/updateStatus', OrderPresentQuery);
  },
  queryList(params) {
    return services.get(WpSchema + '/store/query/dept', {
      action: '获取该商户下所有门店列表',
      params,
    });
  },
  getAllMembers(params) {
    return services.post(WpSchema + '/user/level/list', params, {
      action: '获得该商户下所有会员列表',
    });
  },
  getCouponList(params) {
    return services.get(WpSchema + '/coupon/list', {
      action: '获得所有优惠券列表',
      params,
    });
  },
  getCoupon(params) {
    return services.get(WpSchema + '/coupon/query', {
      action: '获得单个优惠券详情',
      params,
    });
  },
  getLuckyList(params) {
    const _params = params || {};
    return services.get(WpSchema + '/lucky_turning/query_list_new', {
      action: '获得所有幸运转盘列表',
      params: { ..._params, activityStatus: _params.activityStatus || _params.statusList },
    });
  },
  /**
   * 简历转盘引用关系
   * @param params
   * @returns {*}
   */
  buildCitedForLucky(params) {
    return services.post(WpSchema + '/wp/lucky_turning/cited', params, {
      action: '简历转盘引用关系',
    });
  },
};
