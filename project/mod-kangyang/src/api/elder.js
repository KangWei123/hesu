import services from '@/dss-common/utils/services';

export const elderApi = {
  addElder(params) {
    return services.json('/ky/elder/info/save', params, {
      action: '新增长者',
    });
  },
  delElder(params) {
    return services.json('/ky/elder/info/remove', params, {
      action: '删除长者',
    });
  },
  getElders(params) {
    return services.json('/ky/elder/info/page', params, {
      action: '查询长者列表',
    });
  },
  getBusinessTypes(params) {
    return services.json('/ky/web/activity/draft/page', params, {
      action: '查询业务列表',
    });
  },
  getServiceTypes(params) {
    return services.get('/ky/web/activity/copy', {
      action: '查询服务列表',
      params,
    });
  },
  getImportedExcelStatus(params) {
    return services.json('/ky/web/activity/publish', params, {
      action: '查询导入状态',
    });
  },
  delFaceImg(params) {
    return services.json('/ky/web/activity/publish', params, {
      action: '删除长者人脸照片',
    });
  },
  changeFaceId(params) {
    return services.json('/ky/web/activity/publish', params, {
      action: '修改长者人脸照片',
    });
  },
  getDetail(params) {
    return services.json('/ky/elder/info/detail', params, {
      action: '查询长者详情',
    });
  },
  unbind(params) {
    return services.json('/ky/elder/info/relation/unbind', params, {
      action: '解绑长者',
    });
  },
  EXPORT_URL: '/ky/elder/info/export',
  EXPORT_MEMBERS_URL: '/ky/relation/info/export',

  getMembers(params) {
    return services.json('/ky/relation/info/page', params, {
      action: '家属列表',
    });
  },
  getMemberDetail(params) {
    return services.json('/ky/relation/info/detail', params, {
      action: '家属详情',
    });
  },
  getSources(params) {
    return services.get('/ky/dict/user/source', {
      action: '查询会员来源',
      params,
    });
  },
  getEvaluationRecords(params) {
    return services.get('/ky/user/source/type/list', {
      action: '查询评估记录',
      params,
    });
  },
  getEvaluationDetail(params) {
    return services.get('/ky/user/source/type/list', {
      action: '查询评估详情',
      params,
    });
  },
  getMyInvitations(params) {
    return services.get('/ky/user/source/type/list', {
      action: '查询我的邀请',
      params,
    });
  },
  getActivityList(params) {
    return services.json('/ky/web/activity/application/page', params, {
      action: '查询活动记录',
    });
  },
  saveElderMember(params) {
    return services.json('/ky/elder/info/relation/save', params, {
      action: '保存亲友',
    });
  },
  getElderMemberDetail(params) {
    return services.json('/ky/elder/info/relation/detail', params, {
      action: '长者亲友详情',
    });
  },
  getRelationTypes(params) {
    return services.get('/ky/dict/user/relation', {
      action: '查询亲友关系列表',
      params,
    });
  },
  getCardTypes(params) {
    return services.get('/ky/dict/credential/type', {
      action: '查询证件类型列表',
      params,
    });
  },
  getNursingGrades() {
    return services.get('/ky/dict/nursing/grade', {
      action: '获取护理等级列表',
    });
  },
};

export const elderAppointmentApi = {
  getList(params) {
    return services.json('/ky/relative/appoint/page', params, {
      action: '查询预约探访列表',
    });
  },
  getSettings(params) {
    return services.json('/ky/relative/appoint/rule/page', params, {
      action: '查询预约探访设置列表',
    });
  },
  getSetting(params) {
    return services.get('/ky/relative/appoint/rule/detail', {
      action: '查询预约探访设置',
      params,
    });
  },
  EXPORT_URL: '/ky/relative/appoint/exportData',
  validateSetting(params) {
    return services.get('/wp/project/tags', {
      action: '校验项目预约设置',
      params,
    });
  },
  addSetting(params) {
    return services.json('/ky/relative/appoint/rule/add', params, {
      action: '新增预约探访设置',
    });
  },
  updateSetting(params) {
    return services.json('/ky/relative/appoint/rule/update', params, {
      action: '更新预约探访设置',
    });
  },
  removeSetting(params) {
    return services.get('/ky/relative/appoint/rule/delete', {
      action: '删除预约探访设置',
      params,
    });
  },
  getAvailableProjects(params) {
    return services.json('/ky/relative/appoint/rule/prjList', params, {
      action: '获取可设置预约规则的项目列表',
    });
  },
};

export const customerApi = {
  getList(params) {
    return services.json('/ky/member/info/normal/list', params, {
      action: '查询普通顾客列表',
    });
  },
};
