import services from '@/dss-common/utils/services';

export function createForm(params) {
  return services.post('/wp/client/form/add', params, {
    action: '创建预约表单'
  });
}

export function updateForm(params) {
  return services.post('/wp/client/form/update', params, {
    action: '更新客户表单信息'
  });
}

export function copyForm(params) {
  return services.post('/wp/client/form/copy', params, {
    action: '复制预约表单'
  });
}

export function deleteForm(params) {
  return services.post('/wp/client/form/delete', params, {
    action: '删除预约表单'
  });
}

export function queryFormList(params) {
  return services.get('/wp/client/form/list', {
    action: '查询预约表单分页',
    params
  });
}

export function queryForm(params) {
  return services.get('/wp/client/form/get', {
    action: '查询预约表单',
    params
  });
}

export function querySubmitList(params) {
  return services.get('/wp/client/form/submit/list', {
    params,
    action: '查询客户提交表单列表'
  });
}

export function querySubmitListV2(params) {
  return services.get('/wp/client/form/submit/activitylist', {
    params,
    action: '查询客户提交表单列表'
  });
}
