import services from '@/dss-common/utils/services';

export const elderSpaceApi = {
  getList(params) {
    return services.json('/ky/ProjectVisit/appointInfo/queryPage', params, {
      action: '查询项目预约列表',
    });
  },
  getSetting(params) {
    return services.get('/wp/project/tags', {
      action: '查询项目预约设置',
      params,
    });
  },
  EXPORT_URL: '',
  validateSetting(params) {
    return services.get('/wp/project/tags', {
      action: '校验项目预约设置',
      params,
    });
  },
  updateSetting(params) {
    return services.get('/wp/project/tags', {
      action: '更新项目预约设置',
      params,
    });
  },
  queryTree(params) {
    return services.json('/ky/web/elderSpace/folder/treeQry', params, {
      action: '查询长者空间目录',
    });
  },
  getTagListV2(params) {
    return services.json('/ky/web/elderSpace/folder/treeQry', params, {
      action: '查询长者空间目录',
    });
  },
  filtersList(params) {
    return services.get('/ky/web/elderSpace/material/type.query', {
      action: '查询长者空间素材类型数量',
      params,
    });
  },
  materialList(params) {
    return services.json('/ky/web/elderSpace/material/page', params, {
      action: '查询素材列表',
    });
  },
  recycleBinList(params) {
    return services.json('/wp/project/tags', params, {
      action: '查询长者空间目录',
    });
  },
  elderSpaceList(params) {
    return services.json('/ky/web/elderSpace/material/page', params, {
      action: '查询长者空间素材列表',
    });
  },
  addFolder(params) {
    return services.json('/ky/web/elderSpace/folder/create', params, {
      action: '创建文件夹',
    });
  },
  updateFolder(params) {
    return services.get('/ky/web/elderSpace/folder/rename', {
      action: '修改文件夹',
      params,
    });
  },
  deleteFolder(params) {
    return services.get('/ky/web/elderSpace/folder/batchDelete', {
      action: '删除文件夹',
      params,
    });
  },
  getDetail(params) {
    return services.json('/ky/web/elderSpace/material/detail', params, {
      action: '查询素材详情',
    });
  },
  moveMaterial(params) {
    return services.get('/ky/web/elderSpace/file/batchRemove', {
      action: '批量移动文件',
      params,
    });
  },
  updateMaterial(params) {
    return services.get('/ky/web/elderSpace/file/rename', {
      action: '修改文件名称',
      params,
    });
  },
};
