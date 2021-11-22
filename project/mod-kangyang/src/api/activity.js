import services from '@/dss-common/utils/services';

export const activityApi = {
  queryList(params) {
    return services.json('/ky/web/activity/page', params, {
      action: '查询活动列表',
    });
  },
  queryDraftList(params) {
    return services.json('/ky/web/activity/draft/page', params, {
      action: '查询活动草稿列表',
    });
  },
  getIdsList(params) {
    return services.json('/ky/app/activity/id.list.query', params, {
      action: '查询活动列表',
    });
  },
  copyActivity(params) {
    return services.get('/ky/web/activity/copy', {
      action: '复制活动',
      params,
    });
  },
  publish(params) {
    return services.json('/ky/web/activity/publish', params, {
      action: '发布活动',
    });
  },
  up(params) {
    return services.get('/ky/web/activity/onShelf', {
      action: '上架活动',
      params,
    });
  },
  down(params) {
    return services.get('/ky/web/activity/offShelf', {
      action: '下架活动',
      params,
    });
  },
  cancel(params) {
    return services.get('/ky/web/activity/cancel', {
      action: '取消活动',
      params,
    });
  },
  getDetail(params) {
    return services.get('/ky/web/activity/detail', {
      action: '查询活动详情',
      params,
    });
  },
  getDraftDetail(params) {
    return services.get('/ky/web/activity/draft/detail', {
      action: '查询活动详情',
      params,
    });
  },
  getUsers(params) {
    return services.json('/ky/web/activity/application/page', params, {
      action: '分页查询参与人列表',
    });
  },
  EXPORT_USER_URL: '/ky/web/activity/application/export',
  remove(params) {
    return services.get('/ky/web/activity/delete', {
      action: '删除活动',
      params,
    });
  },

  saveDraft(params) {
    return services.json('/ky/web/activity/draft/save', params, {
      action: '保存草稿',
    });
  },
  removeDraft(params) {
    return services.get('/ky/web/activity/draft/delete', {
      action: '删除草稿',
      params,
    });
  },

  costAssessments(params) {
    return services.get('/wp/project/list', {
      action: '查询费用评估列表',
      params,
    });
  },
  projectTypes(params) {
    return services.get('/ky/web/activity/type/page', {
      action: '查询项目类型列表',
      params,
    });
  },
  projectTags(params) {
    return services.get('/wp/project/tags', {
      action: '查询项目标签列表',
      params,
    });
  },
  userList(params) {
    return services.json('/ky/web/activity/application/page', params, {
      action: '查询参与人列表',
    });
  },
  staticDetail(params) {
    return services.get('/wp/project/list', {
      action: '查询活动列表',
      params,
    });
  },

  getTypes(params) {
    return services.json('/ky/web/activity/type/page', params, {
      action: '查询活动类型',
    });
  },
  addType(params) {
    return services.json('/ky/web/activity/type/add', params, {
      action: '添加活动类型',
    });
  },
  updateType(params) {
    return services.json('/ky/web/activity/type/update', params, {
      action: '更新活动类型',
    });
  },
  removeType(params) {
    return services.get('/ky/web/activity/type/delete', {
      action: '删除活动类型',
      params,
    });
  },

  getTickets(params) {
    return services.json('/ky/web/activity/ticket/page', params, {
      action: '查询活动票种',
    });
  },
  saveTicket(params) {
    return services.json('/ky/web/activity/ticket/batchSave', params, {
      action: '保存活动票种',
    });
  },
  signUpStatistic(params) {
    return services.json('/ky/web/activity/statistic/signUp', params, {
      action: '报名统计',
    });
  },
  signInStatistic(params) {
    return services.json('/ky/web/activity/statistic/signIn', params, {
      action: '签到统计',
    });
  },
};
