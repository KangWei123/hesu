import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api';

const WpSchema = wpBaseApi.WpSchema;

export default {
  query(params) {
    return services.get(WpSchema + '/coupon/list', {
      action: '获取优惠券列表',
      params,
    });
  },

  queryV2(params) {
    return services.get(WpSchema + '/coupon/listV2', {
      action: '获取优惠券列表',
      params,
    });
  },

  planList(params) {
    return services.get(WpSchema + '/coupon/auto_plan/list', {
      action: '获取发放列表',
      params,
    });
  },

  itemsList(params) {
    return services.get(WpSchema + '/coupon/query/items', {
      action: '获取优惠券绑定商品列表',
      params,
    });
  },

  categoriesList(params) {
    return services.get(WpSchema + '/coupon/query/categories', {
      action: '获取优惠券绑定类目列表',
      params,
    });
  },

  storesList(params) {
    return services.get(WpSchema + '/coupon/query/stores', {
      action: '获取优惠券绑定门店列表',
      params,
    });
  },

  getQrcode(params) {
    return services.get(WpSchema + '/coupon/getQrcode', {
      action: '生成优惠券二维码',
      params,
    });
  },

  detail(params) {
    return services.get(WpSchema + '/coupon/query', {
      action: '获取优惠券信息',
      params,
    });
  },

  deleteCoupon(params) {
    return services.get(WpSchema + '/coupon/delete', {
      action: '删除优惠券信息',
      params,
    });
  },

  addCoupon(params) {
    return services.json(WpSchema + '/coupon/add', params, {
      action: '添加优惠券',
    });
  },
  updateCoupon(params) {
    return services.post(WpSchema + '/coupon/modify', params, {
      action: '修改优惠券',
    });
  },

  addPlan(params) {
    return services.json(WpSchema + '/coupon/auto_plan/add', params, {
      action: '新建方案',
    });
  },

  updatePlan(params) {
    return services.post(WpSchema + '/coupon/plan/update', params, {
      action: '修改方案',
    });
  },

  detailPlan(params) {
    return services.post(WpSchema + '/coupon/auto_plan/query', params, {
      action: '方案详情',
    });
  },

  deletePlan(params) {
    return services.get(WpSchema + '/coupon/auto_plan/delete', {
      action: '删除方案信息',
      params,
    });
  },

  /** *以下是优惠券详情分析接口 */

  // 获取优惠券 brief 信息
  queryCouponBriefInfo(params) {
    return services.get(WpSchema + '/coupon/statistic/query_brief', {
      action: '获取优惠券简要信息',
      params,
    });
  },

  // 获取领取明细 table 数据
  queryDetailTable(params) {
    return services.get(WpSchema + '/coupon/ticket/query/detail', {
      action: '获取领取明细',
      params,
    });
  },

  // 获取交易情况 line 数据
  queryTradeLine(params) {
    return services.get(WpSchema + '/coupon/statistic/query_deal_report', {
      action: '获取交易情况',
      params,
    });
  },

  // 获取人群占比 pie 数据
  queryPeopleRatioPie(params) {
    return services.post(WpSchema + '/coupon/statistic/query_user_percent', params, {
      action: '获取人群占比',
    });
  },

  // 获取领取趋势 bar 数据
  queryTrendBar(params) {
    return services.post(WpSchema + '/coupon/statistic/query_use_report', params, {
      action: '获取领取趋势',
    });
  },

  // 优惠券领取信息导出
  couponInfoExport() {
    return WpSchema + '/coupon/ticket/export';
  },

  // bbc新增接口

  audit(params) {
    return services.get(WpSchema + '/coupon/audit', {
      action: '审核优惠券',
      params,
    });
  },

  removeAudit(params) {
    return services.get(WpSchema + '/coupon/cancelAudit', {
      action: '撤销优惠券审核',
      params,
    });
  },

  getDetailList(params) {
    return services.json(WpSchema + '/coupon/ticket/detailList', params, {
      action: '获取优惠券明细列表',
    });
  },

  getCouponLifecycle(params) {
    return services.get(WpSchema + '/coupon/ticket/lifeCycle', {
      action: '获取优惠券生命周期',
      params,
    });
  },

  verification(params) {
    return services.json(WpSchema + '/coupon/ticket/verification', params, {
      action: '核销优惠券',
    });
  },

  getVerificationList(params) {
    return services.json(WpSchema + '/coupon/ticket/verification/list', params, {
      action: '获取优惠券核销列表',
    });
  },

  revokeVerification(params) {
    return services.get(WpSchema + '/coupon/ticket/verification/revoke', {
      action: '撤销核销',
      params,
    });
  },
};
