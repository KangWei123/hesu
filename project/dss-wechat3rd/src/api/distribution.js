import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  /**
   * 获取该商户下所有门店列表
   * @param {*} params
   */
  queryStoreList(params) {
    return services.get(WpSchema + '/store/query/dept', {
      action: '获取该商户下所有门店列表',
      params
    });
  },

  /**
   * 规则查询
   * @param {*} params
   */
  ruleQuery(params) {
    return services.get(WpSchema + '/distribution/rule/query', {
      action: '规则查询',
      params
    });
  },

  /**
   * 规则设置
   * @param {*} params
   */
  ruleInsertOrUpdate(params) {
    return services.post(WpSchema + '/distribution/rule/insertOrUpdate', params, {
      action: '规则设置'
    });
  },

  /**
   * 查询商品列表
   * @param {*} params
   */
  queryItemList(params) {
    return services.post(WpSchema + '/distribution/item/queryList', params, {
      action: '商品查询'
    });
  },

  /**
   * 员工管理
   */
  staffManage: {
    /**
     * 查询员工列表
     * @param {*} params
     */
    queryDisPersonQueryList(params) {
      return services.get(WpSchema + '/dis_person/queryList', {
        action: '分页查询员工列表',
        params
      });
    },

    /**
     * 员工审核
     * @param {*} params
     */
    updateDisPersonStatus(params) {
      return services.post(WpSchema + '/dis_person/updateStatus', params, {
        action: '员工审核'
      });
    },

    /**
     * 导出员工列表
     */
    disPersonExport: WpSchema + '/dis_person/export'
  },

  /**
   * 业绩统计
   */
  performanceStatistic: {
    /**
     * 分页查询佣金业绩统计
     * @param {*} params
     */
    queryDisCommission(params) {
      return services.get(WpSchema + '/dis_commission/queryStat', {
        action: '分页查询佣金业绩统计',
        params
      });
    },

    /**
     * 导出佣金业绩统计
     */
    disCommissionExport: WpSchema + '/dis_commission/exportStat',

    /**
     * 分页查询订单明细列表
     * @param {*} params
     */
    queryDisOrderList(params) {
      return services.get(WpSchema + '/dis_commission/queryRecord', {
        action: '分页查询订单明细列表',
        params
      });
    },

    /**
     * 导出订单明细
     */
    disOrderListExport: WpSchema + '/dis_commission/exportRecord',
    /**
     * 佣金明细
     */
    exportCommissionRecord: WpSchema + '/dis_commission/exportCommissionRecord'
  },

  /**
   * 佣金结算
   */
  commissionSettlement: {
    /**
     * 查询提现记录
     * @param {*} params
     */
    queryCashOutList(params) {
      return services.post(WpSchema + '/distribution/cash_out/queryList', params, {
        action: '查询提现记录'
      });
    },

    /**
     * 发放佣金
     * @param {*} params
     */
    provideCashOut(params) {
      return services.json(WpSchema + '/distribution/cash_out/provide', params, {
        action: '发放佣金'
      });
    },

    /**
     * 导出佣金提现记录
     */
    cashOutExport: WpSchema + '/distribution/cash_out/export'
  },

  /**
   * 员工内购
   */
  internalPurchase: {
    /**
     * 查询内购券规则
     * @param {*} params
     */
    getVoucherRule(params) {
      return services.get(WpSchema + '/distribution/voucher/rule/getInfo', {
        action: '查询内购券规则',
        params
      });
    },

    /**
     * 保存内购券规则
     * @param {*} params
     */
    saveVoucherRule(params) {
      return services.post(WpSchema + '/distribution/voucher/rule/save', params, {
        action: '保存内购券规则'
      });
    },

    /**
     * 同步门店商品
     * @param {*} params
     */
    syncItem(params) {
      return services.get(WpSchema + '/innerBuy/item/syncItem', {
        action: '同步门店商品',
        params
      });
    },

    /**
     * 批量添加商品
     * @param {*} params
     */
    addItemList(params) {
      return services.json(WpSchema + '/innerBuy/item/add_list', params, {
        action: '批量添加商品'
      });
    },

    /**
     * 商品金额设置
     * @param {*} params
     */
    setItemCommission(params) {
      return services.json(WpSchema + '/innerBuy/item/setCommission', params, {
        action: '商品金额设置'
      });
    },

    /**
     * 删除商品
     * @param {*} params
     */
    deleteItem(params) {
      return services.json(WpSchema + '/innerBuy/item/delete', params, {
        action: '删除商品'
      });
    }
  },

  /**
   * 全员营销
   */
  allMarketing: {
    /**
     * 同步门店商品
     * @param {*} params
     */
    syncItem(params) {
      return services.get(WpSchema + '/distribution/item/syncItem', {
        action: '同步门店商品',
        params
      });
    },

    /**
     * 批量添加商品
     * @param {*} params
     */
    addItemList(params) {
      return services.json(WpSchema + '/distribution/item/add_list', params, {
        action: '批量添加商品'
      });
    },

    /**
     * 商品金额设置
     * @param {*} params
     */
    setItemCommission(params) {
      return services.json(WpSchema + '/distribution/item/setCommission', params, {
        action: '商品金额设置'
      });
    },

    /**
     * 删除商品
     * @param {*} params
     */
    deleteItem(params) {
      return services.json(WpSchema + '/distribution/item/delete', params, {
        action: '删除商品'
      });
    }
  },

  /**
   * 查询员工列表
   */
  queryEmployeeList(params) {
    return services.get(WpSchema + '/dis_participate_emp/querybypage', {
      action: '查询员工列表',
      params
    });
  },

  /**
   * 查询企业组织结构
   */
  queryOrg(params) {
    return services.get(WpSchema + '/dis_participate_emp/queryorg', {
      action: '查询企业组织结构',
      params
    });
  },

  /**
   * 查询部门员工
   */
  queryEmployee(params) {
    return services.get(WpSchema + '/dis_participate_emp/querybypage', {
      action: '查询部门员工',
      params
    });
  },

  /**
   * 批量人工结算
   */
  batchWithDraw(params) {
    return services.get(WpSchema + '/dis_commission/batchwithdraw', { action: '批量人工结算', params });
  },

  drawAll() {
    return services.get(WpSchema + '/dis_commission/withdrawall', { action: '全部标记为人工结算' });
  },

  queryItemSetting(params) {
    return services.get(WpSchema + '/item_comment/config/get', { action: '查询配置', params });
  },

  updateItemSetting(params) {
    // const qs = Object.keys(params).reduce((pre, key) => {
    //   return pre + `${pre ? '&' : ''}${key}=${params[key]}`;
    // }, '');
    return services.post(WpSchema + '/item_comment/config/update', params, { action: '更新配置' });
  }
};
