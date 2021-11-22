/**
 * Created by allenhe on 18/9/5.
 * @author allen
 */
import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api';

const WpSchema = wpBaseApi.WpSchema;

export default {
  query(params) {
    return services.get(WpSchema + '/user/query/keyword', {
      action: '获取会员列表',
      params,
    });
  },

  detail(params) {
    return services.get(WpSchema + '/user/user_detail', {
      action: '获取会员信息',
      params,
    });
  },

  memberSchedule(params) {
    return services.post(WpSchema + '/scheduled/list', params, {
      action: '会员预约',
    });
  },

  historyLabel(params) {
    return services.get(WpSchema + '/user/history_label', {
      action: '历史标签',
      params,
    });
  },

  addUserLabel(params) {
    return services.json(WpSchema + '/user/add_label', params, {
      action: '新增标签',
    });
  },

  deleteUserLabel(params) {
    return services.post(WpSchema + '/user/delete_label', params, {
      action: '删除标签',
    });
  },
  deleteUserImpressionTag(params) {
    return services.json(
      WpSchema + `/user/deletelabel?id=${params.labelId}`,
      {},
      {
        action: '删除商家印象标签',
      }
    );
  },

  // getLevelSimplyList(params) {
  //   return services.get(WpSchema + '/user/level/listSimply', {
  //     action: '获取会员等级列表',
  //     params
  //   });
  // },

  getLevelSimplyList(params) {
    return services.json('/plt/level/config/list', params, {
      action: '获取会员等级列表',
    });
  },

  updateMemberLevel(params) {
    return services.post(WpSchema + '/user/update_user_level', params, {
      action: '更新用户等级',
    });
  },

  getMemberCouponList(params) {
    return services.get(WpSchema + '/coupon/ticket/list', {
      action: '获取用户优惠券列表',
      params,
    });
  },

  getMemberCardList(params) {
    return services.get(WpSchema + '/user/card', {
      action: '获取用户持有卡项列表',
      params,
    });
  },

  getMemberScoreList(params) {
    return services.get(WpSchema + '/score/score_record', {
      action: '获取用户积分记录',
      params,
    });
  },

  getMemberScoreStat(params) {
    return services.get(WpSchema + '/score/score_stat', {
      action: '获取用户积分统计',
      params,
    });
  },

  getMemberRechargeList(params) {
    return services.get(WpSchema + '/user/user_charge_record', {
      action: '获取会员的充值记录',
      params,
    });
  },

  getMemberLabelList(params) {
    return services.get(WpSchema + '/user/active_labels', {
      params,
      action: '获取会员标签',
    });
  },

  getMemberGiftCardList(params) {
    return services.get(WpSchema + '/wx_item_gift_card/query_sell_list', {
      action: '获取会员持有礼品卡列表',
      params,
    });
  },
  getLabelCategories(params) {
    return services.get(WpSchema + '/user/business/impression/tag/categories', {
      action: '获取商家印象标签的分类',
      params,
    });
  },
  getTagByCategory(params) {
    return services.get(WpSchema + '/user/business/impression/tag/query', {
      action: '获取商家印象标签',
      params,
    });
  },

  getEmployeeList(params) {
    return services.get(WpSchema + '/verification/employee/query', {
      action: '查询门店可以设置为核销员的会员信息',
      params,
    });
  },
};
