import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';

const WpSchema = wpBaseApi.WpSchema;

export default {
  add(params) {
    return services.json(WpSchema + '/signed_detail/add', params, { action: '新增checkin' });
  },
  query(params) {
    return services.get(WpSchema + '/signed_detail/query', { params, action: '获取checkin' });
  },
  update(params) {
    // return services.json(WpSchema + '/signed_detail/update', { params, action: '编辑checkin' });
    return services.json(WpSchema + '/signed_detail/update', params, { action: '修改checkin' });
  },
  list(params) {
    return services.get(WpSchema + '/signed_records/query/list', { params, action: 'signed_records_query_list' });
  },
  change(params) {
    return services.post(WpSchema + '/signed_detail/change', params, { action: '活动状态修改' });
  },
  // 获取提示给商家的信息，如优惠券过期等
  getInformMessage() {
    return services.get(WpSchema + '/signed_detail/notify', { action: '获取签到通知信息' });
  },
  signedgifts: {
    add(params) {
      return services.json(WpSchema + '/signed_gifts/add', params, { action: '新增礼物' });
    },
    update(params) {
      return services.json(WpSchema + '/signed_gifts/update', params, { action: '修改礼物' });
    },
    delete(params) {
      return services.json(WpSchema + '/signed_gifts/delete', params, { action: '删除礼物' });
    }
  }

  // list(params) {
  //   return services.get(WpSchema + '/signed_records/query/list', { params: params, action: '签到有礼列表页数据' });
  // },
  // query(params) {
  //   return services.get(WpSchema + '/signed_detail/query', { params: params, action: '查询签到详情' });
  // },
  // detail(params) {
  //   return services.get(WpSchema + '/wp/signed/detail', { params: params, action: '查询签到活动详情' });
  // },
  // add(params) {
  //   return services.post(WpSchema + '/wp/signed/add', { params: params, action: '新增签到活动' });
  // },
  // update(params) {
  //   return services.post(WpSchema + '/wp/signed/update', { params: params, action: '更新签到活动' });
  // },
  // onOff(params) {
  //   return services.post(WpSchema + '/wp/signed/onOff', { params: params, action: '开启关闭签到活动' });
  // },
  // // 记录模块
  // record: {
  //   userlist(params) {
  //     return services.get(WpSchema + '/wp/signed/userList', { params: params, action: '查询签到用户记录' });
  //   },
  //   history(params) {
  //     return services.get(WpSchema + '/wp/signed/history', { params: params, action: '签到历史模块' });
  //   }
  // }
};
