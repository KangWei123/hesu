import services from '@/dss-common/utils/services';

const WpSchema = '/mtool/b';

export default {
  create(params) {
    return services.json(`${WpSchema}/bonusMoneyExchangeRule/create`, params, {
      action: '新增积分兑钱规则',
    });
  },
  queryList(params) {
    return services.json(`${WpSchema}/bonusMoneyExchangeRule/queryList`, params, {
      action: '查询规则列表',
    });
  },
  getById(params) {
    return services.post(`${WpSchema}/bonusMoneyExchangeRule/queryById`, params, {
      action: '查询积分兑钱规则详情',
    });
  },
  update(params) {
    return services.json(`${WpSchema}/bonusMoneyExchangeRule/update`, params, {
      action: '更新积分兑钱规则',
    });
  },
  record(params) {
    return services.json(`${WpSchema}/bonusMoneyExchangeRecord/queryList`, params, {
      action: '查询积分兑钱记录',
    });
  },
  tenant_queryList(params) {
    return services.json(`mall/b/tenant/queryList`, params, {
      action: '查询商户列表',
    });
  },
};
