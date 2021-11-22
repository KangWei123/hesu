import { WpSchema, OrgSchema, BaseSchema, McSchema } from '@/business-common/constants/apiEnum';
import services from '@/dss-common/utils/services';
import { sharedLoginApi } from '@/register/login';

const { getUserInfo } = sharedLoginApi;

function gotoLogin() {
  const url = encodeURIComponent(window.location.href);
  window.top.location.href = `/login.html?gotoUrl=${url}`;
}

function postPayLoadData(url, params, hint) {
  return services.post(url, params, {
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: function (data) {
      return JSON.stringify(data);
    },
    action: hint,
  });
}

export default {
  WpSchema,
  OrgSchema,
  postPayLoadData,
  BaseSchema,
  McSchema,
  /**
   * 查询某员工排班
   */
  getEmployeePositionList() {
    return services.get(WpSchema + '/employee/query/position/list', {
      action: '查询职位列表',
    });
  },
  /**
   * 获取用户菜单
   * @returns {*}
   */
  queryUserMenu() {
    return services.get(WpSchema + '/login/queryUserMenu?source=3', {
      action: '获取用户菜单',
    });
  },
  /**
   * 获取用户管理员权限
   * @returns {*}
   */
  queryUserManagement() {
    return services.get(WpSchema + '/login/queryUserComponent?source=1', {
      action: '获取用户管理员权限',
    });
  },
  /**
   * 获取用户权限组件
   * @returns {*}
   */
  queryUserComponent() {
    return services.get(WpSchema + '/login/queryUserComponent?source=3', {
      action: '获取用户权限组件',
    });
  },
  /**
   * 获取用户单个店铺模板配置
   * @param params
   */
  getUserTemplate(params) {
    return services.get(BaseSchema + '/sellerTemplate/get', {
      action: '获取用户单个店铺模板配置',
      params,
    });
  },
  /**
   * 切换店铺
   * @param params
   */
  changeApp(params) {
    return services.get(OrgSchema + '/app/choose', {
      action: '切换店铺',
      params,
    });
  },
  /**
   * 检验登录状态
   * @param {boolean} [isRedirect=true] 是否跳转登录页，不需要登录可查看的页面设置为false
   * @returns
   */
  checkWpLogin(isRedirect = true) {
    const p = new Promise((resolve, reject) => {
      getUserInfo().then(
        res => {
          const { data } = res;
          if (!data.login) {
            if (isRedirect) {
              gotoLogin();
            }
            return reject(res);
          }
          return resolve(res);
        },
        res => {
          console.log('checkLogin catch', JSON.stringify(res));
          if (isRedirect) {
            gotoLogin();
          }
          return reject(res);
        }
      );
    });

    return p;
  },
  /**
   * 切换店铺
   * @param storeId 店铺Id
   */
  changeStore(storeId) {
    return services.get(WpSchema + '/store/choose', {
      action: '切换店铺',
      params: {
        storeId,
      },
    });
  },

  /**
   * 获取仓库列表
   * @param
   */
  queryList(params) {
    return services.get(WpSchema + '/warehouse/queryList', {
      action: '获取仓库列表',
      params,
    });
  },

  /**
   * 获取对应角色列表
   * @param storeId  非必填  如果有传，就是查询在这个门店的角色列表 如果没有传，就是在企业纬度下所有角色
   */
  queryRoleList(params) {
    return services.get(OrgSchema + '/employee/query/role_list', {
      action: '获取角色列表',
      params,
    });
  },
  // getScopeByType(params) {
  //   return services.post(WpSchema + '/permission/business/get', params, {
  //     action: '获取业务域'
  //   });
  // },
  getScopeMenu(params) {
    return services.post(OrgSchema + '/permission/menu/show/menu', params, {
      action: '获取菜单权限',
    });
  },
  /**
   * 获取全部门店列表
   * @param params
   */
  queryAllStoreList(params) {
    return services.get(WpSchema + '/store/query_all_list', {
      action: '获取所有门店列表',
      params,
    });
  },
  /**
   * 获取珊瑚信息
   * @param params
   */
  getShanhuToken(params) {
    return services.json('/coral/b/sso/data/get', params, {
      action: '获取珊瑚信息',
    });
  },
};
