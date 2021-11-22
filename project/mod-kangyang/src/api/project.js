import services from '@/dss-common/utils/services';

export const projectApi = {
  queryList(params) {
    return services.json('/ky/prj/info/page', params, {
      action: '查询项目列表',
    });
  },
  getSimpleList(params) {
    return services.get('/ky/prj/info/list', {
      action: '查询项目列表',
      params,
    });
  },
  getIdsList(params) {
    return services.json('/ky/app/project/id.list.query', params, {
      action: '查询项目列表',
    });
  },
  getDetail(params) {
    return services.get('/ky/prj/info/detail', {
      action: '查询项目详情',
      params: params,
    });
  },
  add(params) {
    return services.json('/ky/prj/info/add', params, {
      action: '添加项目',
    });
  },
  update(params) {
    return services.json('/ky/prj/info/update', params, {
      action: '更新项目',
    });
  },
  delete(params) {
    return services.get('/ky/prj/info/delete', {
      params,
      action: '删除项目',
    });
  },
  down(params) {
    return services.json('/ky/prj/info/offshelf', params, {
      action: '下架项目',
    });
  },
  up(params) {
    return services.json('/ky/prj/info/onshelf', params, {
      action: '上架项目',
    });
  },
  costAssessments(params) {
    return services.get('/wp/project/list', {
      action: '查询费用评估列表',
      params,
    });
  },
  addProjectType(params) {
    return services.json('/ky/prj/type/add', params, {
      action: '添加项目类型',
    });
  },
  updateProjectType(params) {
    return services.json('/ky/prj/type/update', params, {
      action: '更新项目类型',
    });
  },
  deleteProjectType(params) {
    return services.get('/ky/prj/type/delete', {
      action: '删除项目类型',
      params,
    });
  },
  getTypes(params) {
    return services.json('/ky/prj/type/page', params, {
      action: '查询项目类型列表',
    });
  },
  getTagTypes(params) {
    return services.json('/ky/tag/type/list', params, {
      action: '查询项目标签分类列表',
    });
  },
  addTagType(params) {
    return services.json('/ky/tag/type/add', params, {
      action: '添加项目标签分类',
    });
  },
  updateTagType(params) {
    return services.json('/ky/tag/type/update', params, {
      action: '更新项目标签分类',
    });
  },
  deleteTagType(params) {
    return services.get('/ky/tag/type/delete', {
      action: '删除项目标签分类',
      params,
    });
  },

  getTags(params) {
    return services.json('/ky/tag/list', params, {
      action: '查询项目标签列表',
    });
  },
  addTag(params) {
    return services.json('/ky/tag/add', params, {
      action: '添加项目标签',
    });
  },
  updateTag(params) {
    return services.json('/ky/tag/update', params, {
      action: '更新项目标签',
    });
  },
  deleteTag(params) {
    return services.get('/ky/tag/delete', {
      action: '删除项目标签',
      params,
    });
  },

  getHouseTypes(params) {
    return services.json('/ky/prj/house/layout/page', params, {
      action: '查询户型列表',
    });
  },
  getHouseTypeDetail(params) {
    return services.get('/ky/prj/house/layout/detail', {
      action: '查询户型详情',
      params,
    });
  },
  addHouseType(params) {
    return services.json('/ky/prj/house/layout/add', params, {
      action: '添加户型',
    });
  },
  updateHouseType(params) {
    return services.json('/ky/prj/house/layout/update', params, {
      action: '更新户型',
    });
  },
  removeHouseType(params) {
    return services.get('/ky/prj/house/layout/delete', {
      action: '删除户型',
      params,
    });
  },

  getQrcode(params) {
    return services.get('/wp/wx/qrcode/generator', {
      params,
      action: '二维码生成',
    });
  },
};

export const projectAppointmentApi = {
  getList(params) {
    return services.json('/ky/ProjectVisit/appointInfo/queryPage', params, {
      action: '查询预约列表',
    });
  },
  EXPORT_URL: '/ky/ProjectVisit/appointInfo/exportData',
  getSettings(params) {
    return services.json('/ky/ProjectVisit/rule/queryPage', params, {
      action: '查询设置列表',
    });
  },
  addSetting(params) {
    return services.json('/ky/ProjectVisit/rule/add', params, {
      action: '新增设置',
    });
  },
  getSetting(params) {
    return services.get('/ky/ProjectVisit/rule/queryDetail', {
      action: '查询预约设置',
      params,
    });
  },
  removeSetting(params) {
    return services.json('/ky/ProjectVisit/rule/delete', params, {
      action: '删除预约设置',
    });
  },
  validateSetting(params) {
    return services.get('/wp/project/tags', {
      action: '校验预约设置',
      params,
    });
  },
  updateSetting(params) {
    return services.json('/ky/ProjectVisit/rule/update', params, {
      action: '更新预约设置',
    });
  },

  getAvailableProjects(params) {
    return services.json('/ky/ProjectVisit/rule/prjList', params, {
      action: '获取可设置预约规则的项目列表',
    });
  },
};
