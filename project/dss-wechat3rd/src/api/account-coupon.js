import services from '@/dss-common/utils/services';
import { mtoolSchema } from '@/business-common/constants/apiEnum';

export function getAccountList(params) {
  return services.json(mtoolSchema + '/b/coupon/account/queryPage', params, {
    action: '获取账号列表',
  });
}

export function getInAccount(params) {
  return services.json(mtoolSchema + '/b/coupon/account/queryAllInnerAccount', params, {
    action: '查询组织人员',
  });
}

export function addAccount(params) {
  return services.json(mtoolSchema + '/b/coupon/account/addAccount', params, {
    action: '添加账号',
  });
}

export function detailAccount(params) {
  return services.json(mtoolSchema + '/b/coupon/account/queryAccount', params, {
    action: '查询账号信息',
  });
}

export function editAccount(params) {
  return services.json(mtoolSchema + '/b/coupon/account/editAccount', params, {
    action: '编辑账号信息',
  });
}
export function updateAccountStatus(params) {
  return services.json(mtoolSchema + '/b/coupon/account/editAccountStatus', params, {
    action: '更新账号状态信息',
  });
}

export function delAccount(params) {
  return services.json(mtoolSchema + '/b/coupon/account/deleteAccount', params, {
    action: '删除账号信息',
  });
}

export function permissionMenu(params) {
  return services.json(mtoolSchema + '/b/coupon/account/queryAllMenu', params, {
    action: '查询权限',
  });
}

export function insertCouponAuth(params) {
  return services.json(mtoolSchema + '/b/coupon/auth/insertCouponAuth', params, {
    action: '新增优惠券权限',
  });
}

export function editCouponAuth(params) {
  return services.json(mtoolSchema + '/b/coupon/auth/editCouponAuth', params, {
    action: '编辑优惠券权限',
  });
}

export function queryCouponPage(params) {
  return services.json(mtoolSchema + '/b/coupon/auth/queryPage', params, {
    action: '查询券权限列表',
  });
}

export function queryCreditPage(params) {
  return services.json(mtoolSchema + '/b/coupon/change/queryPage', params, {
    action: '发券宝券额度变化明细分页查询',
  });
}

export function queryAccountCouponAuthByList(params) {
  return services.json(mtoolSchema + '/b/coupon/auth/queryAccountCouponAuthByList', params, {
    action: '发券宝券已选择的优惠券查询',
  });
}
