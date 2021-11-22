import { WpSchema, PortalSchema, OrgSchema, PerSchema } from '@/business-common/constants/apiEnum';
import services from '@/dss-common/utils/services';

export function quickJoin(params) {
  return services.post(PortalSchema + '/register/register', params, {
    action: '快速注册',
  });
}
export function login(params) {
  return services.post(PerSchema + '/login/login', params, {
    action: '登录',
  });
}
export function appList(params) {
  return services.get(OrgSchema + '/app/listByUserEpId', {
    action: '获取应用列表',
    params,
  });
}
export function getUserInfo(isHideError) {
  return services.get(OrgSchema + '/login/query', {
    action: '获取用户信息',
    hidden: isHideError,
  });
}
export function checkCodeResetPwd(params) {
  return services.post(PortalSchema + '/pot/rspd/checkVCode', params, {
    action: '校验验证码',
  });
}
export function changePwd(params) {
  return services.post(PortalSchema + '/pot/rspd/change', params, {
    action: '重置密码',
  });
}

export function getSmsCode(phone) {
  return services.post(
    PerSchema + '/login/sendVCode',
    {
      phone: phone,
    },
    {
      action: '获取验证码',
    }
  );
}

/**
 * 退出
 *
 */
export function logout() {
  const loc = window.location;
  window.location.href = `${PerSchema}/login/logout?callback=${loc.protocol}//${loc.hostname}${
    loc.port ? ':' + loc.port : ''
  }&_t=${Date.parse(new Date()) / 1000}`;
}
