import services from '../utils/services';
const WpSchema = '/wp';

import {sharedLoginApi} from "@/business-common/api/index";

function gotoLogin() {
  const url = encodeURIComponent(window.location.href);
  window.top.location.href = `/login.html?gotoUrl=${url}`;
}

/**
 * 设置头部登录信息菜单，登录，用户名控制显示
 *
 * @param {boolean} [isLogined=false]
 * @param {*} userName
 * @param {*} epName
 */
function setMenu(isLogined = false, userName, epName) {
  setPCMenu(isLogined, userName, epName); //设置PC端头部登录信息菜单
  setMobileMenu(isLogined); //展示移动端头部登录信息菜单
}

/**
 * 设置PC端头部登录信息菜单，登录，用户名控制显示
 *
 * @param {boolean} [isLogined=false]
 * @param {*} userName
 * @param {*} epName
 */
function setPCMenu(isLogined = false, userName, epName) {
  const trialAndLogin = document.getElementById('trialAndLogin');
  const userDiv = document.getElementById('avatar');
  const logout = document.getElementById('logout');
  const loc = window.location;

  if (!logout) {
    return;
  }
  if (isLogined) {
    trialAndLogin.style.display = 'none';
    userDiv.style.display = '';
    if (!userName) {
      userDiv.querySelector('span').innerText = epName;
    } else {
      userDiv.querySelector('span').innerText = userName;
    }
    logout.href =
      '/c/login/logout?callback=' +
      loc.protocol +
      '//' +
      loc.hostname +
      (loc.port ? ':' + loc.port : '') +
      '&_t=' +
      Date.parse(new Date()) / 1000;
  } else {
    trialAndLogin.style.display = '';
    userDiv.style.display = 'none';
  }
}

/**
 * 展示移动端头部登录信息菜单
 * @param {*} isLogined
 */
function setMobileMenu(isLogined = false) {
  const avataUnLogin = document.getElementById('avata-unLogin');
  const avataLogin = document.getElementById('avata-login');
  const loginAndRegister = document.getElementById('loginAndRegister');
  const logout = document.getElementById('logout-mobile');
  const loc = window.location;

  if (!logout) {
    return;
  }
  if (isLogined) {
    avataUnLogin.style.display = 'none';
    avataLogin.style.display = 'block';
    loginAndRegister.style.display = 'none';
    logout.href =
      '/c/login/logout?callback=' +
      loc.protocol +
      '//' +
      loc.hostname +
      (loc.port ? ':' + loc.port : '') +
      '&_t=' +
      Date.parse(new Date()) / 1000;
  } else {
    avataUnLogin.style.display = 'block';
    avataLogin.style.display = 'none';
    loginAndRegister.style.display = 'block';
  }
}

export default {
  smsCode(phone) {
    return services.post(
      '/c/noauth/buz/ep/sendVCode',
      {
        phone: phone
      },
      {
        action: '获取验证码'
      }
    );
  },
  joinEnterprise(params) {
    return services.post('/c/noauth/buz/ep/enter', params, {
      action: '注册新企业'
    });
  },
  quickJoin(params) {
    return services.post('/c/register/register', params, {
      action: '快速注册'
    });
  },
  login(params) {
    return services.post('/c/login/login', params, {
      action: '登录'
    });
  },
  getUserInfo(isHideError) {
    return services.get('/c/login/query', {
      action: '获取用户信息',
      hidden: isHideError
    });
  },
  getUserMenu(source) {
    return services.get('/c/menu/queryUserMenu', {
      action: '获取用户菜单',
      params: {
        source: source || 1
      }
    });
  },
  getEpList() {
    return services.get('/c/login/login', {
      action: '获取企业列表',
      params: {
        userName: 'test'
      }
    });
  },
  // 超级管理源 切换
  changeEp(epId, storeId) {
    let params = {
      epId
    };
    if (storeId) {
      params.storeId = storeId;
    }
    return services.get('/c/pot/user/choosee', {
      action: '切换企业',
      params
    });
  },
  // 切换店铺
  changeStoreEp(storeId) {
    return services.get('/c/pot/user/choosestore', {
      action: '切换企业',
      params: {
        storeId: storeId
      }
    });
  },
  /**
   * 切换门店
   * @param params
   */
  changeStore(params) {
    return services.get(WpSchema + '/store/choose', {
      action: '切换门店',
      params
    });
  },
  checkCode_resetPwd(params) {
    return services.post('/c/pot/rspd/checkVCode', params, {
      action: '校验验证码'
    });
  },
  changePwd(params) {
    return services.post('/c/pot/rspd/change', params, {
      action: '重置密码'
    });
  },
  smsCode_resetPwd(phone) {
    return services.post(
      '/c/pot/rspd/sendVCode',
      {
        phone: phone
      },
      {
        action: '获取验证码'
      }
    );
  },
  smsCode_login(phone) {
    return services.post(
      '/c/login/sendVCode',
      {
        phone: phone
      },
      {
        action: '获取验证码'
      }
    );
  },
  shopKeeper() {
    return services.get('/c/statistic/index/list/shopkeeper', {
      action: '获取店主数据'
    });
  },
  storeList() {
    return services.get('/c/statistic/report/meta/store', {
      action: '获取店铺数据'
    });
  },
  quota() {
    return services.get('/c/statistic/index/listQuota', {
      action: '获取指标说明'
    });
  },
  getMessage() {
    return services.get(WpSchema + '/notify/message/get', {
      action: '获取更新通知',
      hidden: true
    });
  },
  /**
   * 检验登录状态
   * @param {*} params 请求参数对象
   * params = {
   *  isSetMenu:true   //boolean类型，有引入dss-commmon/partial的顶部菜单设置为ture,否则为false
   *  isRedirect:true   //boolean类型，是否跳转登录页，不需要登录可查看的页面设置为false
   *  isHideError:false   //boolean类型，是否隐藏错误弹框
   * }
   * @returns
   */
  checklogin(opt) {
    const { isSetMenu = true, isRedirect = true, isHideError = false } = opt || {};

    const p = new Promise((resolve, reject) => {
      this.getUserInfo(isHideError).then(
        res => {
          const { data } = res;
          const { userName, userId, epName } = data;
          if (!res.success || !data.userId) {
            if (isRedirect) {
              gotoLogin();
            } else if (isSetMenu && res.success) {
              setMenu(!!userId, userName, epName);
            }
            res.success = false;
            return reject(res);
          }
          if (isSetMenu) {
            setMenu(!!userId, userName, epName);
          }
          return resolve(res);
        },
        res => {
          if (isRedirect) {
            gotoLogin();
          } else if (isSetMenu) {
            setMenu();
          }
          return reject(res);
        }
      );
    });

    return p;
  },

  /**
   * 退出
   *
   */
  logout() {
    sharedLoginApi.logout();
  },
  uploadUrl: '/c/pot/file/upload',
  downloadUrl: '/c/pot/file/download',
  templateUrl: '/c/pot/template/download'
};
