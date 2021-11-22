import services from '@/dss-common/utils/services';

const prefix = '/mall/b';

export default {
  /**
   * 拍照积分
   */
  picture: {
    list(params) {
      return services.json(prefix + '/score/offline/photographScoreList', params, {
        action: '拍照积分列表',
      });
    },
    getDetail(id) {
      return services.get(prefix + '/score/offline/Detail', { action: '查看线下积分详情', params: { id } });
    },
    examine(params) {
      return services.json(prefix + '/score/offline/examine', params, {
        action: '审核/撤销审核拍照积分',
      });
    },
    configList(params) {
      return services.json(prefix + '/reply/quick/queryQuickReply', params, {
        action: '快速回复列表',
      });
    },
    deleteQuickReply(id) {
      return services.get(prefix + '/reply/quick/deleteQuickReply', {
        action: '删除快捷回复',
        params: {
          id,
        },
      });
    },
    addQuickReply(params) {
      return services.json(prefix + '/reply/quick/addQuickReply', params, {
        action: '新增快捷回复',
      });
    },
    updateQuickReply(params) {
      return services.json(prefix + '/reply/quick/updateQuickReply', params, {
        action: '更新快捷回复',
      });
    },
  },
  customer: {
    list(params) {
      return services.json(prefix + '/score/offline/list', params, {
        action: '获取服务台积分列表',
      });
    },
    revoke(params) {
      return services.json(prefix + '/score/offline/revoke', params, {
        action: '撤销录入积分',
      });
    },
    supplement(params) {
      return services.json(prefix + '/score/offline/addRemark', params, {
        action: '补充备注',
      });
    },
    add(params) {
      return services.json(prefix + '/score/offline/Input', params, {
        action: '新增录入积分',
      });
    },
    judge(params) {
      return services.json(prefix + '/score/offline/judge', params, {
        action: '判断积分是否重复',
      });
    },
    getMemberByPhone(params) {
      return services.get(prefix + '/score/offline/detailByPhone', {
        params,
        action: '手机号查询会员信息',
      });
    },
    createMember(params) {
      return services.json('wp/user/add_user', params, {
        action: '快速创建会员',
      });
    },
    queryBusinessList(params) {
      return services.json(prefix + '/tenant/queryList', params, {
        action: '查询商户列表',
      });
    },
    queryCalculation(params) {
      return services.json(prefix + '/score/offline/scoreCalculation', params, {
        action: '查询规则并计算积分',
      });
    },
    businessCategoryList(params) {
      return services.json(prefix + '/tenant/category/queryList', params, {
        action: '获取经营类目列表',
      });
    },
  },
  export: prefix + '/score/offline/export/scoreRecord',
  exportList: prefix + '/score/offline/export/OfflineScoreRecord',
  rule: {
    list(params) {
      return services.json(prefix + '/score/offline/config/list', params, {
        action: '查询积分规则列表',
      });
    },
    add(params) {
      return services.json(prefix + '/score/offline/config/add', params, {
        action: '新增积分规则',
      });
    },
    update(params) {
      return services.json(prefix + '/score/offline/config/update', params, {
        action: '更新积分规则',
      });
    },
    delete(params) {
      return services.get(prefix + '/score/offline/config/delete', { params, action: '删除积分规则' });
    },
    detail(params) {
      return services.get(prefix + '/score/offline/config/detail', { params, action: '获取积分规则详情' });
    },
    getFlag(params) {
      return services.get(prefix + '/score/offline/config/detailOpenOrPending', {
        params,
        action: '获取积分规则状态',
      });
    },
    toggle(params) {
      return services.get(prefix + '/score/offline/config/change', {
        params,
        action: '变更积分规则状态',
      });
    },
  },
  score_offline_list(params) {
    return services.json(`${prefix}/score/offline/insensitivityList`, params, {
      action: '查询无感积分列表',
    });
  },

  getBusinessPayInfo(params) {
    return services.json('/mall/b/MallWxPayMch/selectByStoreId', params, {
      action: '获取商圈支付设置信息',
    });
  },

  createBusinessPayInfo(params) {
    return services.json('/mall/b/MallWxPayMch/create', params, {
      action: '创建商圈支付设置信息',
    });
  },

  updateBusinessPayInfo(params) {
    return services.json('/mall/b/MallWxPayMch/update', params, {
      action: '更新商圈支付设置信息',
    });
  },
  export_offline: prefix + '/score/offline/export/scoreRecord',
};
