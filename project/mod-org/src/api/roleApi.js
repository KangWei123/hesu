import { WpSchema, OrgSchema } from '@/business-common/constants/apiEnum';
import services from '@/dss-common/utils/services';

// 查询门店——其他
export function getRoleList(params) {
  return services.get(WpSchema + '/permission/role/query/all', {
    action: '分页查询角色',
    params,
  });
}

export function getRoleLevel(params) {
  return services.get(OrgSchema + '/permission/role/list/level/all', {
    action: '查询角色级别',
    params,
  });
}

export function addOrUpdateRole(params, isEdit) {
  return services.post(isEdit ? OrgSchema + '/permission/role/update' : OrgSchema + '/permission/role/add', params, {
    action: isEdit ? '修改角色' : '新增角色',
  });
}

export function getRoleStaffNum(params) {
  return services.get(OrgSchema + '/employee/countEmployeeByRole', {
    action: '获取角色下的员工数量',
    params,
  });
}

export function delRole(params) {
  return services.get(OrgSchema + '/permission/role/delete', {
    action: '删除角色',
    params,
  });
}

export function getRoleMenu(params) {
  return services.post(OrgSchema + '/permission/role/show/menu', params, {
    action: '根据角色获取菜单树',
  });
}

export function bindRoleMenu(params) {
  return services.post(OrgSchema + '/permission/role/bind/menu', params, {
    action: '角色绑定菜单',
  });
}

export function paramList(params) {
  return services.arrayPost(OrgSchema + '/permission/interface/field/queryFiledList', params, {
    action: '获取菜单变量',
  });
}

export function hideTypeList(params) {
  return services.get(OrgSchema + '/permission/interface/field/getFieldHideType', {
    action: '获取字段隐藏类型',
    params,
  });
}

export function addFieldRal(params) {
  return services.json(OrgSchema + '/permission/interface/field/addFieldRal', params, {
    action: '批量新增角色权限字段关联',
  });
}
