import { WpSchema } from '@/business-common/constants/apiEnum';
import services from '@/dss-common/utils/services';

// 查询门店——其他
export function getRoleList(params) {
  return services.get(WpSchema + '/permission/role/query/all', {
    action: '分页查询角色',
    params,
  });
}

export function getRoleLevel(params) {
  return services.get(WpSchema + '/permission/role/query/level/all', {
    action: '查询角色级别',
    params,
  });
}

export function addOrUpdateRole(params, isEdit) {
  return services.post(isEdit ? WpSchema + '/permission/role/update' : WpSchema + '/permission/role/add', params, {
    action: isEdit ? '修改角色' : '新增角色',
  });
}

export function getRoleStaffNum(params) {
  return services.get(WpSchema + '/employee/countEmployeeByRole', {
    action: '获取角色下的员工数量',
    params,
  });
}

export function delRole(params) {
  return services.get(WpSchema + '/permission/role/delete', {
    action: '删除角色',
    params,
  });
}

export function getRoleMenu(params) {
  return services.post('/wp/permission/role/show/menu', params, {
    action: '根据角色获取菜单树',
  });
}

export function bindRoleMenu(params) {
  console.log(params);
  return services.post(WpSchema + '/permission/role/bind/menu', params, {
    action: '角色绑定菜单',
  });
}
