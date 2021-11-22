import services from '@/dss-common/utils/services';
import { WpSchema, PortalSchema, PlatformSchema, mallSchema } from '@/business-common/constants/apiEnum';

export default {
  /**
   * 旧接口，是否需要废弃？
   * @param {*} params
   */
  query(params) {
    return services.get(WpSchema + '/user/query', {
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

  delete(params) {
    return services.post(WpSchema + '/user/delete_user', params, {
      action: '删除会员',
    });
  },

  memberSchedule(params) {
    return services.post(WpSchema + '/scheduled/list', params, {
      action: '会员预约',
    });
  },

  historyLabel(params) {
    return services.get('/wp/user/history_label', {
      action: '历史标签',
      params,
    });
  },

  memberMerge(params) {
    return services.get('', {
      action: '会员合并',
      params,
    });
  },

  getUserLabelList(params) {
    return services.get(PlatformSchema + '/member/channel/business/label/list', {
      action: '获取商家标签列表',
      params,
    });
  },

  addUserLabel(params) {
    return services.json(`${PlatformSchema}/member/channel/label/add`, params, {
      action: '新增标签',
    });
  },

  deleteUserLabel(params) {
    return services.json(`${PlatformSchema}/member/channel/label/delete`, params, {
      action: '删除标签',
    });
  },

  getLevelSimplyList(params) {
    return services.get(WpSchema + '/user/level/listSimply', {
      action: '获取会员等级列表',
      params,
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

  getEmployeeList(params) {
    return services.get(WpSchema + '/verification/employee/query', {
      action: '查询门店可以设置为核销员的会员信息',
      params,
    });
  },
  getPassflowInfo(params) {
    return services.get(PortalSchema + '/stat/pf/customer_enter_stat', {
      action: '获取客流信息',
      params,
    });
  },
  getStoreLog(params) {
    return services.get(PortalSchema + '/stat/pf/enter_record', {
      action: '获取到店记录',
      params,
    });
  },

  getUserTrack(params) {
    return services.get(PortalSchema + '/stat/pf/customer_enter_trajectory', {
      action: '获取到店记录',
      params,
    });
  },

  deleteUserImpressionTag(params) {
    return services.json(
      `${WpSchema}/user/deletelabel?id=${params.labelId}`,
      {},
      {
        action: '删除商家印象标签',
      }
    );
  },

  addGuide(params) {
    return services.post(WpSchema + '/member/guide/batch/add', params, {
      action: '指派导购',
    });
  },

  getBrowseLog(params) {
    return services.get(WpSchema + '/user/browse_record', {
      action: '获取浏览记录',
      params,
    });
  },
  // getPhr(params) {
  //   return services.get('/wp/phr/getPhr', {
  //     action: '获取健康档案',
  //     params
  //   });
  // },
  getPhrBloodGlucoseList(params) {
    return services.get(WpSchema + '/phr/getPhrBloodGlucoseList', {
      action: '获取血糖列表',
      params,
    });
  },
  getPhrBloodPressureList(params) {
    return services.get(WpSchema + '/phr/getPhrBloodPressureList', {
      action: '获取血压列表',
      params,
    });
  },
  getPhr(params) {
    return services.get(WpSchema + '/phr/getPhr', {
      action: '获取健康档案',
      params,
    });
  },
  savePh(params) {
    return services.post(WpSchema + '/phr/savePhr', params, {
      action: '更新健康档案',
    });
  },
  createPhrBloodGlucose(params) {
    return services.post(WpSchema + '/phr/createPhrBloodGlucose', params, {
      action: '创建血糖记录',
    });
  },
  createPhrBloodPressure(params) {
    return services.post(WpSchema + '/phr/createPhrBloodPressure', params, {
      action: '创建血压记录',
    });
  },
  getPhrDrugRecordList(params) {
    return services.get(WpSchema + '/phr/getPhrDrugRecordList', {
      action: '获取用药记录',
      params,
    });
  },
  /**
   * 应用中心 、应用相关
   */
  application: {
    getAppList(params) {
      return services.json(PlatformSchema + '/app/queryList', params, {
        action: '查询应用列表',
      });
    },
  },
  /**
   * 渠道
   */
  channel: {
    getList(params) {
      return services.get(PlatformSchema + '/member/source/list', { action: '获取来源渠道' });
    },
  },
  /**
   * 会员档案
   */
  memberCenter: {
    /**
     * 会员导入导出
     */
    UPLOAD_URL: PlatformSchema + '/member/user/import',
    EXPORT_URL: PlatformSchema + '/member/user/export',
    UPLOAD_TEMPLATE: WpSchema + '/materials/template/download?fileName=umpMemberImportTemplate',
    /**
     * 会员列表
     */
    getList(params) {
      return services.json(PlatformSchema + '/member/user/list', params, { action: '获取会员列表' });
    },
    getWeakList(params) {
      return services.json(PlatformSchema + '/member/user/latentUser/list', params, { action: '获取潜在会员列表' });
    },
    getMergeList(params) {
      return services.json(PlatformSchema + '/member/merge/list', params, { action: '获取会员合并列表' });
    },
    addMerge(params) {
      return services.post(PlatformSchema + '/member/merge/merge', params, { action: '新增会员合并' });
    },
    getDetail(params) {
      return services.get(PlatformSchema + '/member/user/detail', { action: '获取会员详情', params });
    },
    create(params) {
      return services.json(WpSchema + '/user/add_user', params, { action: '创建会员' });
    },
    update(params) {
      return services.json(WpSchema + '/user/update_user', params, { action: '更新会员' });
    },
    freeze(params) {
      return services.post(WpSchema + '/user/freeze', params, { action: '冻结会员' });
    },
    getOrderList(params) {
      return services.get(WpSchema + '/order/listV2', { params, action: '获取订单列表' });
    },
    getLevelRecords(params) {
      return services.json(PlatformSchema + '/member/level/record/list', params, { action: '获取等级记录' });
    },
    getGrowthRecords(params) {
      return services.json(PlatformSchema + '/growth/record/list', params, { action: '获取成长值记录' });
    },
    getLifecycleRecords(params) {
      return services.json(PlatformSchema + '/lifecycle/memRecord/queryList', params, { action: '获取生命周期记录' });
    },
    addLifecycleRecords(params) {
      return services.json(PlatformSchema + '/lifecycle/memRecord/addMemberLifecycle', params, {
        action: '新增生命周期记录',
      });
    },
    getCouponRecords(params) {
      return services.json(WpSchema + '/coupon/ticket/list/V2', params, { action: '优惠券明细' });
    },
    getChannelMap(params) {
      return services.json(PlatformSchema + '/member/channel/idList', params, { action: '获取会员图谱' });
    },
    getUserTags(params) {
      return services.get(PlatformSchema + '/member/channel/label/list', { params, action: '获取用户标签' });
    },
    getLoginRecords(params) {
      return services.json(PlatformSchema + '/member/channel/list', params, { action: '获取登录记录' });
    },
    getVisisted(params) {
      return services.get(WpSchema + '/user/browse_record', { params, action: '获取浏览记录' });
    },
    getUserValueStat(params) {
      return services.get(PlatformSchema + '/member/user/queryUserValue', { params, action: '获取用户价值' });
    },
    getAddress(params) {
      return services.json(PlatformSchema + '/member/user/address/list', params, { action: '获取会员地址' });
    },
    getCarQueryList(params) {
      return services.json(mallSchema + '/b/car/binding/queryList', params, { action: '查询车辆绑定信息列表' });
    },
    addAddress(params) {
      return services.json(PlatformSchema + '/member/user/address/save', params, { action: '新增会员地址' });
    },
    updateAddress(params) {
      return services.json(PlatformSchema + '/member/user/address/update', params, { action: '更新会员地址' });
    },
    removeAddress(params) {
      return services.json(PlatformSchema + '/member/user/address/delete', params, { action: '删除会员地址' });
    },
    /**
     * 获取用户优惠券概览
     * @param {number} uniqueAccountId 会员一账通ID
     */
    getUserCoupons(uniqueAccountId) {
      return services.get(PlatformSchema + '/member/user/overviewUserCouponTicket', {
        params: { uniqueAccountId },
        action: '获取用户优惠券概览',
      });
    },
    /**
     * 获取用户充值卡概览
     */
    getUserRechargeCard(uniqueAccountId) {
      return services.get(PlatformSchema + '/member/user/overviewUserRechargeCard', {
        params: { uniqueAccountId },
        action: '获取用户充值卡概览',
      });
    },
    /**
     * 查询用户礼品卡信息
     */
    getUserGiftCard(userId, appId) {
      return services.get(WpSchema + '/member/user/overviewUserGiftCard', {
        params: { userId, appId },
        action: '查询用户礼品卡信息',
      });
    },
  },
  baseConfig: {
    saveBaseConfig(params) {
      return services.json(PlatformSchema + '/base/config/saveBaseConfig', params, { action: '保存基础配置信息' });
    },
    getBaseConfig(params) {
      return services.get(PlatformSchema + '/base/config/getBaseConfigInfo', {
        params,
        action: '获取基础配置信息',
      });
    },
  },
  // 会员等级
  memberLevel: {
    getList(params) {
      return services.json(PlatformSchema + '/member/level/list', params, { action: '获取会员等级列表' });
    },
  },
  // 成长值管理
  growthManager: {
    /**
     * 成长值增减
     */
    growthValueChange(params) {
      return services.json(PlatformSchema + '/growth/value/add', params, { action: '增减成长值' });
    },
    getGrowthTypes(params) {
      return services.get(PlatformSchema + '/growth/config/types', {
        params,
        action: '获取成长值类型',
      });
    },
    /**
     * 获取用户成长值明细
     */
    getUserStat(params) {
      return services.json(PlatformSchema + '/growth/record/list', params, {
        action: '获取会员成长值明细',
      });
    },
  },
  // 成长值配置
  growthConfig: {
    addConfig(params) {
      return services.json(PlatformSchema + '/growth/config/add', params, {
        action: '新增成长值配置',
      });
    },
    deleteConfig(params) {
      return services.get(PlatformSchema + '/growth/config/delete', {
        params,
        action: '删除成长值配置',
      });
    },
    configDetail(params) {
      return services.get(PlatformSchema + '/growth/config/detail', {
        params,
        action: '获取成长值配置详情',
      });
    },
    getConfigList(params) {
      return services.json(PlatformSchema + '/growth/config/list', params, {
        action: '分页查询成长值配置',
      });
    },
    updateConfig(params) {
      return services.json(PlatformSchema + '/growth/config/update', params, {
        action: '更新成长值配置',
      });
    },
  },
  // 权益中心
  rightsCenter: {
    addConfig(params) {
      return services.json(PlatformSchema + '/rights/config/add', params, {
        action: '新增权益配置',
      });
    },
    deleteConfig(id) {
      return services.get(PlatformSchema + '/rights/config/delete', {
        params: { id },
        action: '删除权益配置',
      });
    },
    configDetail(params) {
      return services.get(PlatformSchema + '/rights/config/detail', {
        params,
        action: '获取权益配置详情',
      });
    },
    getConfigList(params) {
      return services.json(PlatformSchema + '/rights/config/list', params, {
        action: '分页查询权益值配置',
      });
    },
    updateConfig(params) {
      return services.json(PlatformSchema + '/rights/config/update', params, {
        action: '更新权益配置',
      });
    },
  },
  // 等级管理
  levelManager: {
    addLevel(params) {
      return services.json(PlatformSchema + '/level/config/add', params, {
        action: '新增会员等级',
      });
    },
    deleteLevel(params) {
      return services.get(PlatformSchema + '/level/config/delete', {
        params,
        action: '删除会员等级',
      });
    },
    levelDetail(params) {
      return services.get(PlatformSchema + '/level/config/detail', {
        params,
        action: '获取会员等级详情',
      });
    },
    getLevelList(params) {
      return services.json(PlatformSchema + '/level/config/list', params, {
        action: '获取会员等级列表',
      });
    },
    updateLevel(params) {
      return services.json(PlatformSchema + '/level/config/update', params, {
        action: '更新会员等级',
      });
    },
    levelList(params) {
      return services.get(PlatformSchema + '/level/config/number/list', {
        params,
        action: '获取会员等级number列表',
      });
    },
  },
  // 积分中心
  scoreCenter: {
    // 积分计算导出-集团
    STAT_EXPORT: PlatformSchema + '/score/settlement/exportExcel',
    // 积分计算导出-业态
    STAT_EXPORT_STORE: PlatformSchema + '/score/settlement/exportStoreExcel',
    /**
     * 手动增减积分
     * @param {*} params
     */
    changeValue(params) {
      return services.json(PlatformSchema + '/score/record/addOrSubtractScore', params, {
        action: '手动增减积分',
      });
    },
    add(params) {
      return services.json(PlatformSchema + '/score/config/add', params, {
        action: '新增积分规则配置',
      });
    },
    update(params) {
      return services.json(PlatformSchema + '/score/config/update', params, {
        action: '更新积分规则配置',
      });
    },
    del(params) {
      return services.get(PlatformSchema + '/score/config/delete', {
        action: '删除积分规则配置',
        params,
      });
    },
    checkDelStatus(params) {
      return services.get(PlatformSchema + '/score/config/checkIsDelete', {
        action: '检查删除积分规则状态',
        params,
      });
    },
    checkUpdateConfig(params) {
      return services.json(PlatformSchema + '/score/config/check/update', params, {
        action: '检查保存积分规则条件',
      });
    },
    detail(params) {
      return services.get(PlatformSchema + '/score/config/detail', {
        action: '获取积分规则配置详情',
        params,
      });
    },
    list(params) {
      return services.json(PlatformSchema + '/score/config/list', params, {
        action: '获取积分规则配置列表',
      });
    },
    queryAppScoreRuleConsume(params) {
      return services.json(PlatformSchema + '/score/app/rule/record/list', params, {
        action: '获取积分规则配置列表',
      });
    },
    eventList(params) {
      return services.json(PlatformSchema + '/score/event/list', params, {
        action: '获取积分事件列表',
      });
    },
    allEvent(params) {
      return services.get(PlatformSchema + '/score/event/listAll', {
        params,
        action: '查询所有积分事件列表',
      });
    },
    eventUmpPlatList(params) {
      return services.get(PlatformSchema + '/score/config/queryAppScoreEvent', {
        action: '业态获取积分事件列表',
        params,
      });
    },
    /**
     * 积分结算 - 应用
     */
    stat(params) {
      return services.json(PlatformSchema + '/score/settlement/queryList', params, {
        action: '获取积分结算-应用',
      });
    },
    /**
     * 积分结算 - 项目
     */
    statStore(params) {
      return services.json(PlatformSchema + '/score/settlement/queryStoreSettlementRecord', params, {
        action: '获取积分结算-项目',
      });
    },
    settlementBelong() {
      return services.json(PlatformSchema + '/score/settlement/belong', {}, { action: '获取积分归属列表' });
    },
    /**
     * 积分明细
     */
    statDetail(params) {
      return services.json(PlatformSchema + '/score/record/list', params, {
        action: '获取积分明细',
      });
    },
    /**
     * 积分明细 - 时间报表
     */
    statDetailByTime(params) {
      return services.json(PlatformSchema + '/score/record/report/createTime', params, {
        action: '获取根据时间统计积分明细报表',
      });
    },
    /**
     * 积分明细 - 类型报表
     */
    statDetailByType(params) {
      return services.json(PlatformSchema + '/score/record/report/scoreEvent', params, {
        action: '根据积分类型统计积分明细报表',
      });
    },
    /**
     * 积分明细导出 - 详情
     */
    STAT_DETAIL_EXPORT: PlatformSchema + '/score/record/export/scoreRecord',
    /**
     * 积分明细导出 - 时间
     */
    STAT_DETAIL_EXPORT_TIME: PlatformSchema + '/score/record/export/createTime',
    /**
     * 积分明细导出 - 类型
     */
    STAT_DETAIL_EXPORT_TYPE: PlatformSchema + '/score/record/export/scoreEvent',
    /**
     * 积分风控详情
     */
    getRiskManagerment(params) {
      return services.json(PlatformSchema + '/score/risk/getScoreRiskConfig', params, {
        action: '获取会员积分风控设置信息',
      });
    },
    /**
     * 设置积分风控详情
     */
    setRiskManagerment(params) {
      return services.json(PlatformSchema + '/score/risk/saveScoreRiskConfig', params, {
        action: '设置会员积分风控设置信息',
      });
    },
    /**
     * 手动执行设置积分过期
     */
    manualSetScoreExpired() {
      return services.post(
        PlatformSchema + '/score/risk/manualSetScoreExpired',
        {},
        {
          action: '手动执行设置积分过期',
        }
      );
    },
    /**
     * 会员积分统计
     */
    getUserStat(params) {
      return services.json(PlatformSchema + '/score/record/queryMemberScoreStatistics', params, {
        action: '获取会员积分统计',
      });
    },
    /**
     * 获取会员积分账号
     */
    getUserAccount(params) {
      return services.get(PlatformSchema + '/member/user/queryMemberScoreAccountById', {
        params,
        action: '获取会员积分账号',
      });
    },
    /// 业态应用
    /**
     * 获取积分倍率列表
     */
    scoreMultipleList(params) {
      return services.json(PlatformSchema + '/score/activity/list', params, {
        action: '获取积分倍率列表',
      });
    },
    /**
     * 获取积分倍率详情
     */
    scoreMultipleDetail(params) {
      return services.get(PlatformSchema + '/score/activity/detail', {
        params,
        action: '获取积分倍率详情',
      });
    },
    /**
     * 新增积分倍率活动
     */
    addScoreMultiple(params) {
      return services.json(PlatformSchema + '/score/activity/add', params, {
        action: '新增积分倍率活动',
      });
    },
    /**
     * 操作积分倍率
     */
    scoreMultipleOperating(parmas) {
      return services.post(PlatformSchema + '/score/activity/operator', parmas, {
        action: '操作积分倍率',
      });
    },
    /**
     * 更新积分倍率活动
     */
    updateScoreMultiple(params) {
      return services.json(PlatformSchema + '/score/activity/update', params, {
        action: '更新积分倍率活动',
      });
    },
    /**
     * 检查活动名称是否重复
     */
    checkActivityName(params) {
      return services.post(PlatformSchema + '/score/activity/checkActivityName', params, {
        action: '检查活动名称是否重复',
      });
    },
  },

  // 商品
  good: {
    goodList(params) {
      return services.get(WpSchema + '/item/queryList', params, {
        action: '获取商品列表',
      });
    },
    categoryList(params) {
      return services.get(WpSchema + '/item/query/app/category', params, {
        action: '获取商品分类列表',
      });
    },
  },

  /**
   * 生命周期
   */
  lifeCycle: {
    list(params) {
      return services.json(PlatformSchema + '/lifecycle/config/list', params, {
        action: '获取生命周期配置列表',
      });
    },
    recovery(params) {
      return services.json(PlatformSchema + '/lifecycle/config/restoreDefaultConfig', params, {
        action: '恢复生命周期',
      });
    },
    remove(id) {
      return services.get(PlatformSchema + '/lifecycle/config/delete', {
        action: '删除生命周期配置',
        params: { id },
      });
    },
    getDetail(id) {
      return services.get(PlatformSchema + '/lifecycle/config/detail', { action: '获取生命周期配置', params: { id } });
    },
    add(params) {
      return services.json(PlatformSchema + '/lifecycle/config/add', params, { action: '创建生命周期配置' });
    },
    update(params) {
      return services.json(PlatformSchema + '/lifecycle/config/update', params, { action: '更新生命周期配置' });
    },
  },
};
