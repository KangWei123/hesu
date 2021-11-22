import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;
export default {
  // add(params) {
  //   return services.json(WpSchema + '/lucky_turning/add', {
  //     params: params,
  //     action: '新建大转盘'
  //   });
  // },
  add(params) {
    return services.json(WpSchema + '/lucky_turning/add', params, {
      action: '新建大转盘'
    });
  },
  modify(params) {
    return services.json(WpSchema + '/lucky_turning/update', params, {
      action: '修改大转盘'
    });
  },
  list(params) {
    const _params = params || {};

    return services.get(WpSchema + '/lucky_turning/query_list_new', {
      params: { ..._params, activityStatus: _params.activityStatus || _params.statusList },
      action: '获取幸运抽奖列表'
    });
  },
  detail(params) {
    return services.get(WpSchema + '/lucky_turning/query', {
      params: params,
      action: '大转盘活动详情'
    });
  },

  update(params) {
    return services.post(WpSchema + '/lucky_turning/update', {
      params: params,
      action: '修改幸运转盘'
    });
  },
  delete(id) {
    return services.post(WpSchema + '/lucky_turning/delete' + '?luckyTurningId=' + id);
  },
  close(id) {
    return services.post(WpSchema + '/lucky_turning/close' + '?luckyTurningId=' + id);
  },
  checkName(params) {
    return services.get(WpSchema + '/lucky_turning/check/name', { params, action: '检测活动名是否重复' });
  },
  stop(params) {
    // 接口请求方式不明
    //action 结束大转盘活动
  },

  draw(params) {
    // 接口请求方式不明
    // action 抽奖接口
  },

  times(params) {
    return services.get(WpSchema + '/lucky_times/query', { params: params, action: '用户可抽奖次数' });
  },

  // 奖品图
  // giftPicupload(params){

  // },
  // 抽奖记录模块
  record: {
    list(params) {
      return services.get(WpSchema + '/turning_records/query/list', { params: params, action: '大转盘活动记录列表' });
    },
    store(params) {
      return services.get(WpSchema + '/turning_records/query/store', {
        params: params,
        action: '大转盘某个店铺的记录'
      });
    },
    user(params) {
      return services.get(WpSchema + '/turning_records/query/user', {
        params: params,
        action: '大转盘某个用户的记录'
      });
    }
  },
  // 礼物模块
  gift: {
    add(params) {
      return services.post(WpSchema + '/lucky_gifts/add', { params: params, action: '礼物单个新增' });
    },
    addlist(params) {
      return services.post(WpSchema + '/lucky_gifts/addList', { params: params, action: '礼物批量新增' });
    },
    update(params) {
      return services.post(WpSchema + '/lucky_gifts/update', { params: params, action: '礼物单个修改' });
    },
    updatelist(params) {
      return services.post(WpSchema + '/lucky_gifts/updateList', { params: params, action: '礼物批量修改' });
    },
    delete(params) {
      return services.post(WpSchema + '/lucky_gifts/delete', { params: params, action: '礼物删除' });
    }
  }
};
