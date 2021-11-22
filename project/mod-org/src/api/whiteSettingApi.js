import services from '@/dss-common/utils/services';

const OrgSchema = '/org';

export function getSwitchStatus(params) {
  return services.get(`${OrgSchema}/ip_black_white_list/switchStatus`, {
    action: '获取黑白名单开关状态',
    params,
  });
}

export function updateSwitchStatus(params) {
  return services.get(`${OrgSchema}/ip_black_white_list/updateSwitch`, {
    action: '更新黑白名单开关状态',
    params,
  });
}

export function getWhiteBlackList(params) {
  return services.json(`${OrgSchema}/ip_black_white_list/queryList`, params, {
    action: '获取黑白名单列表',
  });
}

export function ipDelete(params) {
  return services.get(`${OrgSchema}/ip_black_white_list/deleteList`, {
    action: '删除ip规则',
    params,
  });
}

export function ipAdd(params) {
  return services.json(`${OrgSchema}/ip_black_white_list/addList`, params, {
    action: '新增ip规则',
  });
}

export function ipUpdate(params) {
  return services.json(`${OrgSchema}/ip_black_white_list/updateList`, params, {
    action: '更新ip规则',
  });
}
