import services from '@/dss-common/utils/services';
import { WpSchema, OrgSchema, BusinessSchema } from '@/business-common/constants/apiEnum';
/**
 * 校验员工手机号
 */
export function checkEmployeePhone(params) {
  return services.get(OrgSchema + '/employee/phone/check', {
    action: '校验员工手机号',
    params,
  });
}

/**
 * 根据手机号查询部门员工信息
 */
export function getUserInfoByPhone(params) {
  return services.get(BusinessSchema + '/dept/user/info/phone/query', {
    action: '获取员工信息',
    hidden: true,
    params,
  });
}

/**
 * 获取企业应用的授权信息
 */
export function getUserInfoAuth(params) {
  return services.get(WpSchema + '/wxwork/auth/app/get', {
    action: '获取员工信息',
    hidden: true,
    params,
  });
}

/**
 * 获取员工角色列表
 */
export function getPositionList(params) {
  return services.get(OrgSchema + '/employee/position/list', {
    action: '获取角色列表',
    params,
  });
}

/**
 *  新增员工
 *
 */
// export function insertEmployeed(params) {
//   return services.json(WpSchema + '/employee/insert/v2', params, {
//     action: '新增员工',
//   });
// }

/**
 * 修改员工
 */
// export function changeEmployee(params) {
//   return services.json(WpSchema + '/employee/update/v2', params, {
//     action: '修改员工',
//   });
// }

/**
 * 查询员工列表
 * @param params
 */
export function getEmployeeList(params) {
  return services.get(BusinessSchema + '/employee/query', {
    action: '查询员工列表',
    params,
  });
}

/**
 * 查询员工列表v2
 * @param params
 */
export function getEmployeeListV2(params) {
  return services.get(WpSchema + '/employee/query/v2', {
    action: '查询员工列表',
    params,
  });
}

/**
 * 查询员工列表v3
 * @param params
 */
export function getEmployeeListV3(params) {
  return services.get(OrgSchema + '/employee/query/v3', {
    action: '查询员工列表',
    params,
  });
}

/**
 *  新增员工
 *
 */
export function insertEmployeed(params) {
  return services.json(OrgSchema + '/employee/add', params, {
    action: '新增员工',
  });
}

/**
 * 修改员工
 * @param params
 */
export function changeEmployee(params) {
  return services.json(OrgSchema + '/employee/update', params, {
    action: '修改员工',
  });
}

/**
 * 删除员工
 * @param params
 */
export function delEmployee(params) {
  return services.get(OrgSchema + '/employee/delete', {
    action: '删除员工',
    params,
  });
}

/**
 * 恢复员工
 * @param params
 */
export function recoveryEmployee(params) {
  return services.get(OrgSchema + '/employee/recovery', {
    action: '恢复员工',
    params,
  });
}

/**
 * 员工分组查询
 * @param params
 */
export function getEmployeeByGroup(params) {
  return services.get(WpSchema + '/employee/group/query', {
    action: '员工分组查询',
    params,
  });
}

/**
 * 新增员工分组
 * @param params
 */
export function addEmployeeGroup(params) {
  return services.post(WpSchema + '/employee/group/insert', params, {
    action: '新增员工分组',
  });
}

/**
 * 删除员工分组
 * @param params
 */
export function delEmployeeByGroup(params) {
  return services.get(WpSchema + '/employee/group/delete', {
    action: '删除员工分组',
    params,
  });
}

/**
 * 更新排班
 * @param params
 */
export function updateEmployeeWorkOrder(params) {
  return services.post(BusinessSchema + '/employee/workOrder/update', params, {
    action: '更新排班',
  });
}
/**
 * 查询核销数量
 */
export function getVerificationCount(params) {
  return services.get(WpSchema + '/verification/employee/count', {
    action: '查询核销数量',
    params,
  });
}

/**
 * 查询排班信息
 * @param params
 */
export function getEmployeeWorkOrder(params) {
  return services.get(BusinessSchema + '/employee/workOrder/query', {
    action: '查询排班信息',
    params,
  });
}

/**
 * 批量删除员工
 * @param params
 */
export function deleteEmployee(params) {
  return services.post(OrgSchema + '/employee/batchDelete', params, {
    action: '批量删除员工',
  });
}

/**
 * 员工组织层级
 * @param params
 */
export function organizationEmployee(params) {
  return services.get(WpSchema + '/employee/organizationEmployee', {
    action: '查询员工组织层级',
    params,
  });
}

/**
 * 组织树层级
 * @param params
 */
export function getOrganizationTree(params) {
  return services.json(OrgSchema + '/organization/old/query', params, {
    action: '查询员工组织层级',
  });
}

export function getVerificationEmployeeList(params) {
  return services.get(WpSchema + '/verification/employee/query', {
    action: '查询门店可以设置为核销员的会员信息',
    params,
  });
}

// 导出员工信息
export const exportEmployeeUrl = WpSchema + '/employee/export';

// 导入员工信息
export const importEmployeeUrl = WpSchema + '/employee/import';
