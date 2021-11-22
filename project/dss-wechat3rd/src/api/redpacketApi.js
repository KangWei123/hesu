import services from '@/dss-common/utils/services.js';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  deletePlan(params) {
    return services.post(WpSchema + '/lucky_money/plan/delete', params, {
      action: '删除方案'
    });
  },
  records(params) {
    return services.get(WpSchema + '/lucky_money/plan/query/records', {
      action: '红包记录',
      params
    });
  },
  list(params) {
    return services.get(WpSchema + '/lucky_money/plan/query/list', {
      action: '红包列表',
      params
    });
  },
  stopPlan(params) {
    return services.get(WpSchema + '/lucky_money/plan/stop', {
      action: '结束方案',
      params
    });
  },
  startPlan(params) {
    return services.get(WpSchema + '/lucky_money/plan/start', {
      action: '开启方案',
      params
    });
  },
  planList(params) {
    return services.get(WpSchema + '/lucky_money/plan/query', {
      action: '列表',
      params
    });
  },
  addPlan(params) {
    return services.json(WpSchema + '/lucky_money/plan/add_new', params, {
      action: '添加红包方案'
    });
  },
  cashStatementList(params) {
    return services.get(WpSchema + '/cash/statement/queryList', {
      action: '列表',
      params
    });
  }
};
