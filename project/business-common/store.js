import Vue from 'vue';
import Vuex from 'vuex';
import baseApi from '@/dss-common/api/base';
import wpBaseApi from './wp-base-api';
import settingsApi from '@/dss-wechat3rd/src/api/settings';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';

Vue.use(Vuex);

const initState = {
  global_info: {
    userId: '',
    userName: '',
    userPhone: '',
  },
  env: {
    TOURISM: false, // 旅游业
    BEAUTIFUL: false, // 美业
    RETAIL: false, // 零售
    MEDICINE: false, // 医药
    HOME: false, // 家居
    ESTATE: false, // 地产
    BUSINESS_CENTER: false, // 商业中心
    KANGYANG: false, // 康养
  },
  userInfo: {
    epId: '',
    storeId: '',
  },
  // 指标说明
  tips: null,
  selectedEp: {
    epId: '',
    epName: '',
  },
  // 门店列表
  storeList: null,
  // 选中店铺
  curApp: null,
  // 选中门店信息
  curStore: {
    id: '',
  },
  // 仓库列表
  warehouseList: [],
  // 变更标示记录
  modifyTag: 0,
  // 已有店铺数量
  appCount: 0,
  // 微信授权信息
  wxAuthInfo: {
    wxMaAppId: null, // 小程序appid
    wxMpAppId: null, // 公众号appid
    wxMaAppIdB: null, // B端小程序appid
  },
  authorizedInfo: {
    nickName: '', // 公众号名字
    appId: '',
    authorizerAppId: '',
    serviceTypeInfo: null, // 1代表订阅号,2代表服务号
    verifyTypeInfo: null, //  0代表未认证,1代表已认证
  },
  // 员工职位列表
  allPositionList: null,
  // 商家当前店铺模板id
  sellerTemplateId: 0,
  // 商家当前id
  sellerId: null,
  // 商家当前店铺模板的可被链接的页面
  linkedPages: null,
  // 商家当前店铺模板的自定义页
  customPages: null,
  // 商家当前的产业id
  industryId: 0,
  // 商家当前的编辑的页面index
  currentEditPageIndex: null,
  // 当前应用程序特征
  appFeatures: null,
  selectedStore: null,
  wkbStatus: 0,
  klbStatus: 0,
  // 获取企业Id
  companyId: null,
  // 企业微信应用信息
  companyAuthInfo: null,
  // 角色信息
  roleList: null,
  // 菜单用到的role列表，需要拿到id
  scopeRoleList: null,
  // 全部门店列表
  allStoreList: [],
  // 菜单权限域id
  industryScope: null,
  // 根菜单
  rootScopeMenu: null,
  // 门店经营菜单
  wkbScopeMenu: null,
  // 会员中心菜单
  dmpScopeMenu: null,
  // 企业管理菜单
  companyScopeMenu: null,
  // 营销中心菜单
  marketingScopeMenu: null,
  // 客流系统菜单
  storeScopeMenu: null,
  // 珊瑚权益库菜单
  shanhuScopeMenu: null,
  // 品牌设置菜单
  settingsScopeMenu: null,
  // 多企业信息
  sellerAppInfoVOList: null,

  // 路由叶子节点
  routeLeafs: null,

  sidebar: {
    opened: true,
  },

  // 判断集团标识
  accountType: null,
  // 珊瑚信息
  shanhuInfo: null,
};

const mutations = {
  /**
   * 数据初始化
   * @param state
   * @param userInfo
   */
  set_userInfo(state, userInfo) {
    const {
      storeList, // 当前店铺对应的门店
      appInfo, // 当前店铺信息
      storeInfo, // 当前门店信息
      userId,
      userName,
      userPhone,
      appCount,
      wxAuthInfo,
      roleList,
      sellerAppInfoVOList,
      accountType,
    } = userInfo;
    !!userId && (state.global_info.userId = userId);
    !!userName && (state.global_info.userName = userName);
    !!userPhone && (state.global_info.userPhone = userPhone);
    !!appInfo && (state.curApp = appInfo);
    !!storeInfo && (state.curStore = storeInfo);
    !!storeList && (state.storeList = storeList);
    !!wxAuthInfo && (state.wxAuthInfo = wxAuthInfo);
    !!roleList && (state.roleList = roleList);
    !!appInfo &&
      (state.env = {
        TOURISM: appInfo.industryKey === 'hotel_travel', // 旅游业
        BEAUTIFUL: appInfo.industryKey === 'beautiful', // 美业
        RETAIL: appInfo.industryKey === 'retail', // 零售
        MEDICINE: appInfo.industryKey === 'medicine', // 医药
        HOME: appInfo.industryKey === 'home', // 家居
        ESTATE: appInfo.industryKey === 'estate', // 地产
        ARROW: appInfo.id === 596, // 箭牌
        BUSINESS_CENTER: appInfo.industryKey === 'business_center', // 商业中心
        KANGYANG: appInfo.industryKey === 'kangyang', // 康养
      });
    !!sellerAppInfoVOList && (state.sellerAppInfoVOList = sellerAppInfoVOList);
    undefined !== appCount && (state.appCount = appCount);
    state.accountType = accountType;
  },

  set_authorizedInfo(state, userInfo) {
    state.authorizedInfo = userInfo;
  },

  set_EpuserInfo(state, userInfo) {
    state.userInfo = userInfo;
    state.selectedEp = {
      epId: userInfo.appInfo ? userInfo.appInfo.epId : null,
      epName: userInfo.appInfo ? userInfo.appInfo.name : null,
    };
  },

  setStores(state, stores) {
    state.stores = stores;
    // 默认store，由后台选中
    if (!!state.userInfo.storeId && !!stores && stores.length > 0) {
      const finded = stores.find(store => store.id === state.storeInfo.id);
      if (finded) {
        state.curStore = finded;
        state.curStore.store_name = finded.name;
      } else {
        const firstStore = stores[0];
        baseApi.changeEp(firstStore.epId, firstStore.id).done(res => {
          state.curStore = firstStore;
          state.curStore.store_name = firstStore.name;
        });
      }
    }
  },

  set_epInfo(state, epInfo) {
    state.selectedEp = epInfo;
  },
  setTips(state, tips) {
    state.tips = tips;
  },
  /**
   * 设置微信信息
   * @param state
   * @param info
   */
  set_wxAuthInfo(state, info) {
    for (const key in info) {
      state.wxAuthInfo[key] = info[key];
    }
    state.modifyTag += 1;
  },

  setCurStore(state, curStore) {
    state.curStore = curStore;
  },
  /**
   * 切换门店
   * @param state
   * @param curStore
   */
  set_curStore(state, id) {
    if (state.storeList) {
      state.storeList.forEach(item => {
        if (item.id === id) {
          state.curStore = item;
          state.modifyTag += 1;
        }
      });
    }
  },

  /**
   * 仓库列表
   * @param state
   * @param curStore
   */
  set_warehouseList(state, data) {
    state.warehouseList = data;
  },

  /**
   * 更新当前店铺信息
   * @param state
   * @param info
   */
  update_curApi(state, info) {
    for (const key in info) state.curApp[key] = info[key];
    state.env = {
      TOURISM: state.curApp.industryKey === 'hotel_travel', // 旅游业
      BEAUTIFUL: state.curApp.industryKey === 'beautiful', // 美业
      RETAIL: state.curApp.industryKey === 'retail', // 零售
      MEDICINE: state.curApp.industryKey === 'medicine', // 医药
      HOME: state.curApp.industryKey === 'home', // 家居
      ESTATE: state.curApp.industryKey === 'estate', // 地产
      ARROW: state.curApp.id === 596, // 箭牌
      BUSINESS_CENTER: state.curApp.industryKey === 'business_center', // 商业中心
      KANGYANG: state.curApp.industryKey === 'kangyang', // 康养
    };
  },

  /**
   * 更新员工职位列表
   * @param state
   * @param info
   */
  set_EmployeePositionList(state, info) {
    state.allPositionList = info;
  },

  /**
   * 更新当前店铺模板ID
   * @param state
   * @param info
   */
  set_sellerTemplateId(state, info) {
    state.sellerTemplateId = info;
  },

  /**
   * 更新当前SellerID
   * @param state
   * @param info
   */
  set_sellerId(state, info) {
    state.sellerId = info;
  },

  /**
   * 商家当前店铺模板的可被链接的页面
   * @param state
   * @param info
   */
  set_linkedPages(state, info) {
    state.linkedPages = info;
  },

  /**
   * 商家当前店铺模板的可被链接的页面
   * @param state
   * @param info
   */
  set_customPages(state, info) {
    state.customPages = info;
  },

  /**
   * 更新当前产业ID
   * @param state
   * @param info
   */
  set_industryId(state, info) {
    state.industryId = info;
  },

  /**
   * 更新当前产业ID
   * @param state
   * @param info
   */
  set_currentEditPageIndex(state, info) {
    state.currentEditPageIndex = info;
  },

  /**
   * 更新当前应用程序特征
   * @param {*} state
   * @param {*} info
   */
  set_app_features(state, info) {
    state.appFeatures = info;
  },

  /**
   * DA选择的当前门店，并不是session里的门店信息
   * @param state
   * @param selectedStore
   */
  setSelectedStore(state, selectedStore) {
    state.selectedStore = selectedStore;
  },
  /* 全局惟客宝的状态，是否存在惟客宝，以及惟客宝的店铺过期情况 */
  setWkbStatus(state, wkbStatus) {
    state.wkbStatus = wkbStatus;
  },

  /* 全局客流宝的状态，是否存在客流宝 */
  setKlbStatus(state, klbStatus) {
    state.klbStatus = klbStatus;
  },

  /* 更新品牌配置项的全局状态 */
  setCurAppTag(state, tagStatus) {
    for (const key in tagStatus) {
      state.curApp[key] = tagStatus[key];
    }
  },
  // 获取企业Id
  get_companyId(state, company) {
    state.companyId = company.data[0].corpId;
    state.companyAuthInfo = company.data || [];
  },
  // 修改企业Id
  update_getCompanyId(state) {
    state.companyId = null;
  },
  // 存储企业ID
  save_companyId(state, companyId) {
    state.companyId = companyId;
  },
  // 修改角色列表
  set_roleList(state, roleList) {
    if (!roleList || !roleList.length) {
      state.roleList = '';
      return;
    }
    state.roleList = roleList.map(item => item.identifier).join(',');
    state.scopeRoleList = roleList;
  },
  setIndustryScope(state, scope) {
    state.industryScope = scope;
  },
  setRootScopeMenu(state, menu) {
    state.rootScopeMenu = menu;
  },
  setWkbScopeMenu(state, menu) {
    state.wkbScopeMenu = menu;
  },
  setDmpScopeMenu(state, menu) {
    state.dmpScopeMenu = menu;
  },
  setCompanyScopeMenu(state, menu) {
    state.companyScopeMenu = menu;
  },
  setMarketingScopeMenu(state, menu) {
    state.marketingScopeMenu = menu;
  },
  setShanhuMenu(state, menu) {
    state.shanhuScopeMenu = menu;
  },
  setStoreScopeMenu(state, menu) {
    state.storeScopeMenu = menu;
  },
  setSettingsScopeMenu(state, menu) {
    state.settingsScopeMenu = menu;
  },
  // 存储全部门店数据
  save_allStoreList(state, allStoreList) {
    state.allStoreList = allStoreList;
  },

  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
  },
  CLOSE_SIDEBAR: state => {
    state.sidebar.opened = false;
  },

  SET_ROUTE_LEAFS: (state, menu) => {
    state.routeLeafs = menu;
  },
  // 储存珊瑚token数据
  setShanhuInfo(state, info) {
    state.shanhuInfo = info;
  },
};

const actions = {
  // 获取店铺列表
  fetchStores(store, data) {
    store.commit('setStores', data.storeList || []);
  },
  // 查询指标说明
  fetchTips(store) {
    return baseApi.quota().then(({ data }) => {
      store.commit('setTips', data);
    });
  },
  fetchWarehouse(store) {
    wpBaseApi
      .queryList({
        pageSize: 1000,
        pageNo: 1,
        status: 1,
      })
      .done(res => {
        store.commit('set_warehouseList', res.data || []);
      });
  },
  // 获取企业Id
  getCompanyId(store) {
    settingsApi.getCompanyAuthCondition().then(res => {
      store.commit('get_companyId', res);
    });
  },
  updateCompany(store) {
    store.commit('update_getCompanyId');
  },
  // 存储企业ID
  saveCompanyId(store, companyId) {
    store.commit('save_companyId', companyId);
  },
  // 角色列表
  queryRoleList(store, id) {
    return wpBaseApi.queryRoleList({ storeId: id }).done(res => {
      store.commit('set_roleList', res.data || null);
    });
  },
  // getScopeByType(store, industryKey) {
  //   return wpBaseApi.getScopeByType({ type: 'industry', key: industryKey }).done(res => {
  //     store.commit('setIndustryScope', res.data || null);
  //   });
  // },
  getRootMenu(store) {
    return wpBaseApi
      .getScopeMenu({
        // scopeId: this.state.industryScope.id,
        // roleIdList: this.state.scopeRoleList.map(role => {
        //   return role.id;
        // }),
        menuIdList: [0],
        allChildren: false,
      })
      .done(res => {
        store.commit('setRootScopeMenu', res.data || null);
      });
  },
  getWkbMenu(store) {
    const rootScopeMenu = this.state.rootScopeMenu;
    if (rootScopeMenu) {
      const wkbMenu = rootScopeMenu.find(item => {
        return item.identifier === scopeMenuEnum.dictionary.wkbMenu;
      });
      if (wkbMenu) {
        return wpBaseApi
          .getScopeMenu({
            // scopeId: this.state.industryScope.id,
            // roleIdList: this.state.scopeRoleList.map(role => {
            //   return role.id;
            // }),
            menuIdList: [wkbMenu.id],
            allChildren: true,
          })
          .done(res => {
            store.commit('setWkbScopeMenu', res.data || null);
          });
      }
    }
  },
  getDmpMenu(store) {
    const rootScopeMenu = this.state.rootScopeMenu;
    if (rootScopeMenu) {
      const dmpMenu = rootScopeMenu.find(item => {
        return item.identifier === scopeMenuEnum.dictionary.dmpMenu;
      });
      if (dmpMenu) {
        return wpBaseApi
          .getScopeMenu({
            menuIdList: [dmpMenu.id],
            findNextChildren: false,
          })
          .done(res => {
            /* res.data = [
              {
                disabled: 0,
                icon: null,
                identifier: 'customer',
                isHasPermission: 1,
                isMenu: 1,
                isShow: 1,
                level: 0,
                name: '客户中心',
                status: 1,
                url: '/dmp.html',
                childMenu: [
                  {
                    identifier: 'member_center',
                    isHasPermission: 1,
                    isMenu: 1,
                    isShow: 1,
                    level: 1,
                    icon: 'icon-member',
                    name: '会员中心',
                    status: 1,
                    url: '/member-center',
                    childMenu: [
                      {
                        identifier: 'archives',
                        isHasPermission: 1,
                        isMenu: 1,
                        isShow: 1,
                        level: 2,
                        icon: null,
                        name: '会员档案',
                        status: 1,
                        url: '/member-center/archives',
                        childMenu: [
                          {
                            identifier: 'normal_archives',
                            isHasPermission: 1,
                            isMenu: 1,
                            isShow: 1,
                            level: 3,
                            icon: null,
                            name: '普通会员',
                            status: 1,
                            url: '/member-center/archives/normal',
                          },
                          {
                            identifier: 'company_archives',
                            isHasPermission: 1,
                            isMenu: 1,
                            isShow: 1,
                            level: 3,
                            icon: null,
                            name: '企业会员',
                            status: 1,
                            url: '/member-center/archives/company',
                          },
                        ],
                      },
                      {
                        identifier: 'merge',
                        isHasPermission: 1,
                        isMenu: 1,
                        isShow: 1,
                        level: 2,
                        icon: null,
                        name: '会员合并',
                        status: 1,
                        url: '/member-center/merge',
                      },
                      {
                        identifier: 'life_cycle',
                        isHasPermission: 1,
                        isMenu: 1,
                        isShow: 1,
                        level: 2,
                        icon: null,
                        name: '生命周期管理',
                        status: 1,
                        url: '/member-center/life-cycle',
                      },
                    ],
                  },
                  {
                    identifier: 'level_center',
                    isHasPermission: 1,
                    isMenu: 1,
                    isShow: 1,
                    level: 1,
                    icon: 'icon-member',
                    name: '等级中心',
                    status: 1,
                    url: '/level-center',
                    childMenu: [
                      {
                        identifier: 'level-mgr',
                        isHasPermission: 1,
                        isMenu: 1,
                        isShow: 1,
                        level: 2,
                        icon: null,
                        name: '等级管理',
                        status: 1,
                        url: '/level-center/level-mgr',
                        // 3月8日需求，暂不实现
                        // childMenu: [
                        // {
                        //   identifier: 'normal_member',
                        //   isHasPermission: 1,
                        //   isMenu: 1,
                        //   isShow: 1,
                        //   level: 3,
                        //   icon: null,
                        //   name: '普通会员',
                        //   status: 1,
                        //   url: '/level-center/level-mgr/normal',
                        // },
                        // {
                        //   identifier: 'paying-member',
                        //   isHasPermission: 1,
                        //   isMenu: 1,
                        //   isShow: 1,
                        //   level: 3,
                        //   icon: null,
                        //   name: '付费会员',
                        //   status: 1,
                        //   url: '/level-center/level-mgr/paying',
                        // },
                        // {
                        //   identifier: 'company-member',
                        //   isHasPermission: 1,
                        //   isMenu: 1,
                        //   isShow: 1,
                        //   level: 3,
                        //   icon: null,
                        //   name: '企业会员',
                        //   status: 1,
                        //   url: '/level-center/level-mgr/company',
                        // },
                        // ],
                      },
                      {
                        identifier: 'growth-mgr',
                        isHasPermission: 1,
                        isMenu: 1,
                        isShow: 1,
                        level: 2,
                        icon: null,
                        name: '成长值管理',
                        status: 1,
                        url: '/level-center/growth-mgr',
                      },
                    ],
                  },
                  {
                    identifier: 'rights_center',
                    isHasPermission: 1,
                    isMenu: 1,
                    isShow: 1,
                    level: 1,
                    icon: 'icon-member',
                    name: '权益中心',
                    status: 1,
                    url: '/rights-center',
                  },
                  {
                    identifier: 'score_center',
                    isHasPermission: 1,
                    isMenu: 1,
                    isShow: 1,
                    level: 1,
                    icon: 'icon-member',
                    name: '积分中心',
                    status: 1,
                    url: '/score-center',
                    childMenu: [
                      {
                        identifier: 'give_rule',
                        isHasPermission: 1,
                        isMenu: 1,
                        isShow: 1,
                        level: 2,
                        icon: null,
                        name: '积分发放规则',
                        status: 1,
                        url: '/score-center/give-rule',
                      },
                      {
                        identifier: 'consume_rule',
                        isHasPermission: 1,
                        isMenu: 1,
                        isShow: 1,
                        level: 2,
                        icon: null,
                        name: '积分消耗规则',
                        status: 1,
                        url: '/score-center/consume-rule',
                      },
                      {
                        identifier: 'stat',
                        isHasPermission: 1,
                        isMenu: 1,
                        isShow: 1,
                        level: 2,
                        icon: null,
                        name: '积分结算',
                        status: 1,
                        url: '/score-center/stat',
                      },
                      {
                        identifier: 'risk-management',
                        isHasPermission: 1,
                        isMenu: 1,
                        isShow: 1,
                        level: 2,
                        icon: null,
                        name: '积分风控',
                        status: 1,
                        url: '/score-center/risk-management',
                      },
                    ],
                  },
                ],
              },
            ]; */
            store.commit('setDmpScopeMenu', res.data || null);
          });
      }
    }
  },
  getCompanyMenu(store) {
    const rootScopeMenu = this.state.rootScopeMenu;
    if (rootScopeMenu) {
      const companyMenu = rootScopeMenu.find(item => {
        return item.identifier === scopeMenuEnum.dictionary.companyMenu;
      });
      if (companyMenu) {
        return wpBaseApi
          .getScopeMenu({
            menuIdList: [companyMenu.id],
            findNextChildren: false,
          })
          .done(res => {
            /* res.data = [
              {
                disabled: 0,
                icon: null,
                identifier: 'company',
                isHasPermission: 1,
                isMenu: 1,
                isShow: 1,
                level: 0,
                name: '企业管理',
                status: 1,
                url: '/console.html',
                childMenu: [
                  {
                    identifier: 'dealer_center',
                    isHasPermission: 1,
                    isMenu: 1,
                    isShow: 1,
                    level: 1,
                    icon: 'icon-member',
                    name: '经销商中心',
                    status: 1,
                    url: '/dealer-center',
                  },
                  {
                    identifier: 'store_center',
                    isHasPermission: 1,
                    isMenu: 1,
                    isShow: 1,
                    level: 1,
                    icon: 'icon-member',
                    name: '门店中心',
                    status: 1,
                    url: '/companyManage/store-center',
                    childMenu: [
                      {
                        identifier: 'store_list',
                        isHasPermission: 1,
                        isMenu: 1,
                        isShow: 1,
                        level: 2,
                        name: '门店管理',
                        status: 1,
                        url: '/companyManage/store-center/store-mgr',
                      },
                      {
                        identifier: 'store_setting',
                        isHasPermission: 1,
                        isMenu: 1,
                        isShow: 1,
                        level: 2,
                        name: '门店设置',
                        status: 1,
                        url: '/companyManage/store-center/store-setting',
                      },
                    ],
                  },
                  {
                    identifier: 'staff_center',
                    isHasPermission: 1,
                    isMenu: 1,
                    isShow: 1,
                    level: 1,
                    icon: 'icon-member',
                    name: '组织人员',
                    status: 1,
                    url: '/companyManage/staff-center',
                  },
                  {
                    identifier: 'role_center',
                    isHasPermission: 1,
                    isMenu: 1,
                    isShow: 1,
                    level: 1,
                    icon: 'icon-member',
                    name: '角色中心',
                    status: 1,
                    url: '/role-center',
                  },
                  {
                    identifier: 'app_center',
                    isHasPermission: 1,
                    isMenu: 1,
                    isShow: 1,
                    level: 1,
                    icon: 'icon-member',
                    name: '应用中心',
                    status: 1,
                    url: '/app-center',
                  },
                  {
                    identifier: 'setting_center',
                    isHasPermission: 1,
                    isMenu: 1,
                    isShow: 1,
                    level: 1,
                    icon: 'icon-member',
                    name: '设置中心',
                    status: 1,
                    url: '/setting-center',
                  },
                  {
                    identifier: 'log-center',
                    isHasPermission: 1,
                    isMenu: 1,
                    isShow: 1,
                    level: 1,
                    icon: 'icon-member',
                    name: '操作日志',
                    status: 1,
                    url: '/log-center',
                  },
                ],
              },
            ]; */
            store.commit('setCompanyScopeMenu', res.data || null);
          });
      }
    }
  },
  getMarketingMenu(store) {
    const rootScopeMenu = this.state.rootScopeMenu;
    if (rootScopeMenu) {
      const marketingMenu = rootScopeMenu.find(item => {
        return item.identifier === scopeMenuEnum.dictionary.marketingMenu;
      });
      if (marketingMenu) {
        return wpBaseApi
          .getScopeMenu({
            // scopeId: this.state.industryScope.id,
            // roleIdList: this.state.scopeRoleList.map(role => {
            //   return role.id;
            // }),
            menuIdList: [marketingMenu.id],
            allChildren: true,
          })
          .done(res => {
            store.commit('setMarketingScopeMenu', res.data || null);
          });
      }
    }
  },
  // 珊瑚权益库菜单
  getShanhuMenu(store) {
    const rootScopeMenu = this.state.rootScopeMenu;
    if (rootScopeMenu) {
      const shanhuMenu = rootScopeMenu.find(item => {
        return item.identifier === scopeMenuEnum.dictionary.shanhuMenu;
      });
      if (shanhuMenu) {
        return wpBaseApi
          .getScopeMenu({
            menuIdList: [shanhuMenu.id],
            allChildren: true,
          })
          .done(res => {
            store.commit('setShanhuMenu', res.data || null);
          });
      }
    }
  },
  getStoreMenu(store) {
    const rootScopeMenu = this.state.rootScopeMenu;
    if (rootScopeMenu) {
      const storeMenu = rootScopeMenu.find(item => {
        return item.identifier === scopeMenuEnum.dictionary.storeMenu;
      });
      if (storeMenu) {
        return wpBaseApi
          .getScopeMenu({
            // scopeId: this.state.industryScope.id,
            // roleIdList: this.state.scopeRoleList.map(role => {
            //   return role.id;
            // }),
            menuIdList: [storeMenu.id],
            allChildren: true,
          })
          .done(res => {
            store.commit('setStoreScopeMenu', res.data || null);
          });
      }
    }
  },
  getSettingsMenu(store) {
    const rootScopeMenu = this.state.rootScopeMenu;
    if (rootScopeMenu) {
      const settingsMenu = rootScopeMenu.find(item => {
        return item.identifier === scopeMenuEnum.dictionary.settingsMenu;
      });
      if (settingsMenu) {
        return wpBaseApi
          .getScopeMenu({
            // scopeId: this.state.industryScope.id,
            // roleIdList: this.state.scopeRoleList.map(role => {
            //   return role.id;
            // }),
            menuIdList: [settingsMenu.id],
            findNextChildren: false,
          })
          .done(res => {
            store.commit('setSettingsScopeMenu', res.data || null);
          });
      }
    }
  },
  // 全部门店列表
  queryAllStoreList(store) {
    return wpBaseApi.queryAllStoreList({ pageSize: 1000, pageNo: 1 }).done(res => {
      store.commit('save_allStoreList', res.data || []);
    });
  },

  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },

  closeSideBar({ commit }) {
    commit('CLOSE_SIDEBAR');
  },
};

export default new Vuex.Store({
  state: initState,
  mutations,
  actions,
  strict: false,
});
