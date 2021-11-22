import services from '@/dss-common/utils/services';
import { WpSchema } from '@/business-common/constants/apiEnum';

/**
 * 查询员工
 */
export function getEmployeeId(params) {
  return services.get(WpSchema + '/employee/query', {
    action: '置为导购',
    params,
  });
}

/**
 * 置为导购
 */
export function setShopGuide(params) {
  return services.post(WpSchema + '/dept/add/guide', params, {
    action: '置为导购',
  });
}

/**
 * 关键字查询员工
 */
export function getEmployee(params) {
  return services.get(WpSchema + '/dept/keyword/query', {
    action: '查询员工',
    params,
  });
}

/**
 * 获取部门组织树
 */
export function getDeptTree(params) {
  return services.get(WpSchema + '/dept/tree/get', {
    action: '获取部门组织树',
    params,
  });
}

/**
 * 添加部门员工
 */
export function addDepartmentStaff(params) {
  return services.post(WpSchema + '/dept/employee/add', params, {
    action: '添加部门员工',
  });
}

/**
 * 移动部门
 */
export function moveDepartment(params) {
  return services.post(WpSchema + '/dept/move', params, {
    action: '移动部门',
  });
}

/**
 * 查询部门员工列表
 */
export function getStaffList(params) {
  return services.get(WpSchema + '/dept/employee/list', {
    action: '查询部门员工列表',
    params,
  });
}

/**
 * 添加子部门
 */
export function addDepartment(params) {
  return services.post(WpSchema + '/dept/add', params, {
    action: '添加子部门',
  });
}

/**
 * 修改部门名称
 */
export function changeDepartmentName(params) {
  return services.post(WpSchema + '/dept/name/update', params, {
    action: '修改部门名称',
  });
}

/**
 * 同步到企业微信
 */
export function syncCompanyWx(params) {
  return services.post(WpSchema + '/dept/sync/info/push', params, {
    action: '同步至企业微信',
  });
}

/**
 *
 * 设置部门上级
 */
export function setDepartmentSuperior(params) {
  return services.post(WpSchema + '/dept/set/leader', params, {
    action: ' 设置部门上级',
  });
}

/**
 * 批量删除员工
 */
export function batchDelete(params) {
  return services.post(WpSchema + '/dept/employee/delete', params, {
    action: ' 批量删除员工',
  });
}

/**
 * 批量修改员工部门
 */
export function batchUpdate(params) {
  return services.post(WpSchema + '/dept/employee/dept/update', params, {
    action: ' 批量修改员工部门',
  });
}

/**
 * 部门批量关联门店
 */
export function deptConnectStore(params) {
  return services.post(WpSchema + '/dept/relevance/store', params, {
    action: ' 部门批量关联门店',
  });
}

/**
 * 设置门店上级部门
 */
export function setStoreSuperiorDepartment(params) {
  return services.post(WpSchema + '/dept/store/leader/set', params, {
    action: ' 部门批量关联门店',
  });
}

/**
 * 获取企业微信同步信息
 */
export function getCompanyWxInformation() {
  return services.get(WpSchema + '/dept/sync/info/pull', {
    action: ' 获取企业微信同步信息',
  });
}

/**
 * 获取成员信息
 */
export function getMemberInformation(params) {
  return services.get(WpSchema + '/dept/user/info/get', {
    action: ' 获取成员信息',
    params,
  });
}

/**
 * 修改成员信息
 */
export function updateMemberInformation(params) {
  return services.post(WpSchema + '/dept/employee/update', params, {
    action: ' 修改成员信息',
  });
}

/**
 * 批量从其它部门导入员工
 */
export function batchImportMember(params) {
  return services.post(WpSchema + '/dept/import/from/dept', params, {
    action: ' 批量从其它部门导入员工',
  });
}

/**
 * 删除部门
 */
export function deleteDepartment(params) {
  return services.post(WpSchema + '/dept/delete', params, {
    action: ' 删除部门',
  });
}

/**
 * 部门上下移动
 */
export function departmentMove(params) {
  return services.post(WpSchema + '/dept/order/move', params, {
    action: ' 删除部门',
  });
}

/**
 * 获取设置成员信息
 */
export function getEmployeeInformation(params) {
  return services.get(WpSchema + '/dept/direct/employee/list', {
    params,
    action: ' 获取设置成员信息',
  });
}

/**
 * 店铺营业or打样
 */
export function setStoreIsOpen(params) {
  return services.get(WpSchema + '/store/close', {
    params,
    action: '设置店铺是否营业',
  });
}

/**
 * 交接外部联系人
 */
export function allotMembersLeft(params) {
  return services.json(WpSchema + '/client/bind/handover/ext', params, {
    action: ' 离职成员分配',
  });
}

/**
 * 离职员工列表
 */
export function getmembersLeft(params) {
  return services.get(WpSchema + '/client/bind/handover/list', {
    params,
    action: '查询交接客户列表',
  });
}

/**
 * 查询导购信息列表
 */
export function getShoppingGuideList(params) {
  return services.get(WpSchema + '/client/guide/list', {
    params,
    action: ' 获取导购信息',
  });
}

/**
 * 查询获取组织树信息列表
 */
export function getOrganizationTree(params) {
  return services.get(WpSchema + '/organization/tree/get', {
    params,
    action: '获取组织树',
    hidden: true,
  });
}

/**
 * 新增组织树信息
 */
export function addOrganization(params) {
  return services.json(WpSchema + '/organization/dept/add', params, { action: '添加组织树' });
}

/**
 * 删除组织树
 */
export function delOrganization(params) {
  return services.post(WpSchema + '/organization/dept/delete', params, { action: '删除组织树', hidden: true });
}

/**
 * 编辑组织树
 */
export function updateOrganization(params) {
  return services.json(WpSchema + '/organization/dept/update', params, { action: '更新组织树' });
}

/**
 * 查询门店
 */
export function getStoreList(params) {
  return services.get(WpSchema + '/store/query/dept', { params, action: '查询门店' });
}

/**
 * 查询组织属性
 */
export function getAttrList(params) {
  return services.get(WpSchema + '/organization/attr/list', { action: '查询组织属性' });
}

/**
 * 增加组织属性
 */
export function addOrganizationAttr(params) {
  return services.json(WpSchema + '/organization/attr/add', params, { action: '增加组织属性' });
}

/**
 * 删除组织属性
 */
export function deleteOrganizationAttr(params) {
  return services.post(WpSchema + '/organization/attr/delete', params, { action: '删除组织属性' });
}

/**
 * 修改组织属性
 */
export function updateOrganizationAttr(params) {
  return services.json(WpSchema + '/organization/attr/update', params, { action: '修改组织属性' });
}
