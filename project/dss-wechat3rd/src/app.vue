<template>
  <div :class="classObj" class="wkb-root">
    <page-header
      class="wkb-header"
      :user-name="global_info ? global_info.userName : ''"
      :opts-list="operationList"
      :wkb-status="wkbStatus"
      :klb-status="klbStatus"
      :user-infos="userInfo"
      :is-has-sel-store="true"
      v-if="!isCasherPage && !adapterIfrHideTop && !hideNav"
      @changeStore="changeStore"
      @operation-action="onOperationClicked"
    >
    </page-header>

    <div v-if="!isFinished" class="loading-bg" :class="adapterIfrMenu ? 'adapter-loading-size' : 'loading-size'">
      <div class="img-box">
        <img class="loading-gif" src="./images/loading.gif" />
      </div>
    </div>

    <div v-else id="app" :class="adapterIfrNoGap ? 'adapter-ifr-no-padding' : ''" industry="beautiful" class="wkb-app">
      <div
        ref="aside"
        class="wkb-aside"
        :class="adapterIfrMenu ? 'adapter-ifr-menu' : ''"
        :style="{ top: adapterIfrMenu ? '0px' : '' }"
      >
        <!-- <div class="sidebar" v-if="isDistributionMenu">
          <sidebar
            v-if="!adapterIfrMenu"
            class="sidebar-container"
            :menu="normalMenu"
            :sub-active="isDistributionMenu ? '/distribution' : ''"
          />
          <sidebar v-if="isDistributionMenu" class="sidebar-sub-container" :menu="distributionMenu" />
        </div> -->

        <div class="sidebar">
          <div>
            <select-store v-if="!isKangYangIndustry" @changeStore="changeStore" />
            <sidebar
              v-if="!adapterIfrMenu"
              class="sidebar-container"
              :menu="normalMenu"
              :sub-active="isMarketingMenu ? '/marketing' : ''"
            />
          </div>

          <sidebar v-if="isMarketingMenu" class="sidebar-sub-container" :menu="marketingMenu" />
        </div>

        <!--收银台-->
        <div v-if="cashier && !adapterIfrMenu">
          <div class="aside-cashier" v-if="!allowEnter">
            <el-popover placement="left" width="140" trigger="hover" content="该角色暂无权限访问">
              <div slot="reference" style="width: 140px; height: 50px">
                <div style="width: 140px; height: 50px; line-height: 50px" :class="{ disabled: !allowEnter }"></div>
              </div>
            </el-popover>
          </div>
          <div class="aside-cashier" v-else style="cursor: pointer" @click="toCashier">
            <span v-if="sidebar.opened">{{ cashier.name }}</span>
          </div>
        </div>
      </div>

      <div
        id="wkb-box"
        class="wkb-body"
        v-if="!isMarketingCenter || !!curApp"
        :class="{
          scroll: hasScroll,
          'adapter-ifr-margin': (adapterIfrNoGap && isMarketingMenu) || adapterIfrNoGap,
          'adapter-ifr-no-margin': adapterIfrNoGap,
          marketing: isMarketingMenu,
        }"
      >
        <transition name="fade" mode="out-in">
          <router-view v-if="isRouterAlive && pageReady" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import td from 'throttle-debounce';
  import router from './router';
  import store from '@/business-common/store';
  import cBaseApi from '@/dss-common/api/base';
  import wpBaseApi from '@/business-common/wp-base-api';
  import api from '@/dss-wechat3rd/src/api';
  import { sharedStoreApi } from '@/register/console';
  import PageHeader from '@/dss-common/components/page-header/index';
  import Sidebar from '@/dss-common/components/Layout/Sidebar/index';
  // import Sidebar from '@/dss-wechat3rd/src/components/Sidebar';
  import featureIf from '@/dss-wechat3rd/src/constants/featureIf';
  import ClassList from '@/dss-common/utils/class-list';
  import SelectStore from '@/business-common/components/store-select/index';
  import menu from './menu';

  import './app.less';
  import '@/dss-common/style/custom.css';
  import urlUtil from '@/dss-common/utils/url';
  import marketMenu from '@/dss-common/components/sidebar/market-menu';

  import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
  import DeviceHandler from '@/dss-common/components/Layout/Sidebar/mixin/deviceHandler';
  import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';

  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import { handleCurrentPathPermission, filterRoute } from '@/business-common/permission';
  import { industryEnum } from '@/business-common/constants/index';
  import { getRouteLeafs } from '@/dss-common/utils/routeHandle';
  import EventBus, { EventType } from '@/dss-wechat3rd/src/utils/eventBus';

  const { queryProvinceList, queryCityList, queryStoreByLocation } = sharedStoreApi;

  const UI_MODE = {
    ManageStoreEnv: 'ManageStoreEnv',
    CreateStoreEnv: 'CreateStoreEnv',
    EmptyEnv: 'EmptyEnv',
  };
  const bodyClassList = new ClassList(document.body);

  export default {
    name: 'App',
    mixins: [AdapterIfr.AdapterMixins, industryHelperMixin, DeviceHandler, appFeaturesMixin],
    components: {
      PageHeader,
      Sidebar,
      SelectStore,
    },
    data() {
      return {
        scopeMenuEnum,
        operationList: [],
        nowMode: null,
        isRouterAlive: true,
        hasScroll: false,
        isCasherPage: false,
        normalMenu: [],
        provinceList: [],
        cityList: [],
        // 指定 城市/省份 的门店
        lStoreList: [],
        location: [],
        storeLoading: false,
        popoverVisible: false,
        allowEnter: true,
        wkbMenu: [],
        storeName: '',
        showProvince: false,
        tips: '按城市搜索',
        actStoreList: [],
        sear: false,

        // 菜单是否加载完成标识
        isFinished: false,

        // 是否微商城营销菜单
        isMarketingMenu: false,

        // 分销市场菜单
        // isDistributionMenu: false,

        // 是否需要隐藏导航栏和侧边栏标识
        hideNav: false,
      };
    },

    computed: {
      isMarketingCenter() {
        return urlUtil.queryString('source') === 'center';
      },
      // 页面渲染的条件是否已经准备好了
      pageReady() {
        // 路由
        const isRouteReady = !!this.$route;
        // 访问的是否是创建app功能中
        const isInCreateAppPath = Object.prototype.hasOwnProperty.call(menu.path.creating, this.$route.path);
        // 是否app选中了
        const isAppChoose = !!this.$store.state.curApp;
        return isRouteReady && (isInCreateAppPath || isAppChoose);
      },
      ...mapState({
        env: 'env',
        storeList: 'storeList',
        curApp: 'curApp',
        curStore: 'curStore',
        global_info: 'global_info',
        global_appCount: 'appCount',
        wkbStatus: 'wkbStatus',
        klbStatus: 'klbStatus',
        roleList: 'roleList',
        allStoreList: 'allStoreList',
        scopeRoleList: 'scopeRoleList',
        rootScopeMenu: 'rootScopeMenu',
        wkbScopeMenu: 'wkbScopeMenu',
        marketingScopeMenu: 'marketingScopeMenu',
        sidebar: 'sidebar',
        routeLeafs: 'routeLeafs',
        userInfo: 'userInfo',
        accountType: 'accountType',
      }),

      // 当前门店id
      curStoreId: {
        get() {
          if (this.curStore && this.curStore.id) {
            return this.curStore.id;
          }
          // return this.storeList.length > 0 ? this.storeList[0].id : '';
          return '';
        },
        set(val) {
          //
        },
      },

      routerMap() {
        return marketMenu.getMarketCenterMenus(this.wkbStatus);
      },

      currentStoreList() {
        if (this.location[1]) {
          return this.lStoreList;
        } else if (this.storeName) {
          return this.actStoreList;
        } else {
          return this.storeList;
        }
      },

      marketingMenu() {
        const routers = this.$router.currentRoute;

        const list = routers.matched;

        const rs = this.routeLeafs.get(list[0].path);
        return (rs && rs.childMenu) || [];
      },

      distributionMenu() {
        this.setRouteLeafs(this.marketingScopeMenu);
        const routers = this.$router.currentRoute;

        const list = routers.matched;

        const rs = this.routeLeafs.get(list[0].path);
        return (rs && rs.childMenu) || [];
      },

      cashier() {
        const cashier = this.wkbMenu.filter(item => item.identifier === 'mdjy_syt');

        return (cashier && cashier.length && cashier[0]) || false;
      },

      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          'adapter-ifr-hide-top': this.adapterIfrHideTop,
        };
      },
    },

    watch: {
      '$store.state.modifyTag'() {
        this.reload();
        EventBus.$emit(EventType.CHANGE_STORE);
        // 切换门店角色变化重新调用菜单列表
        this.getStoreMenus();
      },
      '$store.state.curApp'(curApp) {
        this.getAppMappingAuth();
        featureIf.config(curApp || {});
      },
      rootScopeMenu(newVal, oldVal) {
        if (!newVal.length) {
          this.$router.push('/403');
        }
        store.dispatch('getWkbMenu').then(res => {
          this.isFinished = true; // 菜单有数据加载完成
        });
        store.dispatch('getMarketingMenu');
      },
      wkbScopeMenu(newVal, oldval) {
        this.assembleWkbScopeMenu();
        this.isFinished = true; // 菜单有数据加载完成
        if (newVal && newVal[0]) {
          newVal[0].childMenu.forEach(item => {
            if (item.name === '收银台') {
              if (+item.isHasPermission === 0) {
                this.allowEnter = false;
              } else {
                this.allowEnter = true;
              }
            }
          });
        }
      },
      location() {
        this.queryStoreList();
      },
      $route(route) {
        // 判断装修页面隐藏导航栏和侧边栏
        this.hideNav = menu.path.regex.DECORATE.test(route.path);
        // 判断是否为微商城营销中的菜单，以便于展示二级菜单，因为分销市场中的部分页面路由也含有marketing，所以需判断路由中没有分销的字段
        this.isMarketingMenu =
          route.path.includes('marketing') &&
          route.path !== '/marketing/template' &&
          !route.path.includes('distribution');
        // this.isDistributionMenu = route.path.includes('distribution') && route.path !== '/distribution';
      },
    },

    mounted() {
      if (this.accountType === industryEnum.accountType.group) {
        // this.operationList.unshift({ key: 'switchApp', isHasPermission: 1, icon: 'icon-buy', name: '切换应用' });
      }

      this.getStoreMenus();

      this.adapterApp();
      this.getAppMappingAuth();
      featureIf.config(this.curApp ? this.curApp : {});

      // 路由ready后，处理 界面的响应模式
      this.$router.onReady(() => {
        const path = this.$router.currentRoute.path;
        const fixedPath = this.getFixedPath(path);
        this.checkMenuSelected(this.$router.currentRoute);
        this.isCasherPage = path === menu.path.CASHIER;
        this.checkIsAppChoosed();
        this.checkMode(fixedPath || path);
        if (fixedPath) {
          this.$router.push(fixedPath);
        }
      });

      // 顶部菜单高亮显示
      router.beforeEach((to, from, next) => {
        const path = to.path;
        const fixedPath = this.getFixedPath(path);
        this.checkMenuSelected(to);
        this.isCasherPage = path === menu.path.CASHIER;
        if (fixedPath) {
          next(fixedPath);
        } else {
          next();
        }
        this.checkMode(fixedPath || path);
      });

      router.afterEach((to, from, next) => {
        if (from && from.meta && from.meta.backUrl) {
          // 执行更改门店后需要跳转的路由
          EventBus.$once(EventType.CHANGE_STORE, () => {
            this.$nextTick(() => {
              if (to.path !== from.meta.backUrl) {
                this.$router.replace(from.meta.backUrl);
              }
            });
          });
        }
      });

      // 监听手动输入URL时无权限跳转
      window.addEventListener(
        'hashchange',
        () => {
          const permission = handleCurrentPathPermission(this.wkbMenu);
          if (!permission.isHavePermission) {
            if (permission.currentPath === '/') {
              const path = filterRoute(this.wkbMenu);
              this.$router.push(path);
            } else {
              this.$router.push('/403');
            }
          }
        },
        false
      );

      // 修复IE顶部菜单点击无法跳转的问题
      if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) {
        window.addEventListener(
          'hashchange',
          () => {
            const currentPath = window.location.hash.slice(1);
            if (this.$route.path !== currentPath) {
              this.jump(currentPath);
            }
          },
          false
        );
      }

      // 这个函数不能放在methods里，同个页面有多个相同组件，debounce会有影响
      this.resize = td.debounce(300, () => {
        this.hasScroll = this.hasScrollbar();
      });

      setTimeout(() => {
        this.hasScroll = this.hasScrollbar();
      }, 300);

      window.addEventListener('resize', this.resize);

      this.queryProvinceList();
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },

    methods: {
      getStoreMenus() {
        store.dispatch('getRootMenu').then(res => {
          // 异常无法返回菜单
          const NO_PERMISSION = 120000;
          if (res && res.code === NO_PERMISSION) {
            this.isFinished = true;
            this.$router.push('/403');
          }
        });
      },
      assembleWkbScopeMenu() {
        const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(this.wkbScopeMenu, scopeMenuEnum.dictionary.wkbMenu);
        this.wkbMenu = scopeMenu && scopeMenu.childMenu;

        /* const marketingMenu = scopeMenuEnum.getMenuScopeByIdentifier(
          this.marketingScopeMenu,
          scopeMenuEnum.dictionary.marketingMenu
        );

        const distributionMenu =
          marketingMenu &&
          marketingMenu.childMenu &&
          marketingMenu.childMenu.filter(item => item.identifier === 'distribution');

        // 为了兼容营销中心的分销入口
        if (distributionMenu && distributionMenu.length) {
          this.wkbMenu.push(distributionMenu[0]);
        } */

        this.normalMenu = this.wkbMenu
          .filter(item => item.identifier !== 'mdjy_syt')
          .filter(item => item.identifier !== 'hx');
        // .filter(item => item.identifier !== 'distribution');

        // 切换到总控制台时屏蔽客流管理的菜单
        if (!this.curStore || !this.curStore.id) {
          this.normalMenu.forEach(item => {
            if (item.identifier === 'store') {
              item.childMenu.forEach(m => {
                if (m.identifier !== 'global_overview') {
                  m.disabled = 1;
                  m.popTitle = '请选择门店';
                }
              });
            }
          });
        }

        this.setRouteLeafs(this.normalMenu);

        // 判断当前路由是否存在权限路由表中
        const permission = handleCurrentPathPermission(this.wkbMenu);

        const currentPath = permission.currentPath;
        const currentIndex = permission.currentIndex;

        let path = filterRoute(this.wkbMenu);

        // 当前选中路径-只能用一级路由
        let selectPath = this.wkbMenu[0].url;

        // 路由存在时保存当前路由
        if (currentIndex !== -1) {
          selectPath = this.wkbMenu[currentIndex].url;
          path = currentPath;
        }

        this.$router.push(path);

        // 更新当前路由
        const url = {};
        url.path = selectPath;

        // 获取到常用菜单，且 DOM 更新循环之后，执行设置左侧常用菜单选中状态。(解决初始化进入页面时菜单无法选中bug)
        this.$nextTick(() => {
          this.checkMenuSelected(url);
        });
      },
      setRouteLeafs(data) {
        const routes = getRouteLeafs(data);
        store.commit('SET_ROUTE_LEAFS', routes);
      },
      checkIsAppChoosed() {
        if (this.isMarketingCenter) {
          if (!this.curApp) {
            this.$confirm('尚未选择店铺，去选择店铺?', '选择店铺', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              closeOnPressEscape: false,
              type: 'warning',
              customClass: 'wkt-warning',
            })
              .then(() => {
                const redirect = encodeURIComponent('/wkb.html?source=center#/marketing/template');
                window.top.location.href = '/wkb.html?redirect=' + redirect + '#/startup/chose';
              })
              .catch(() => {
                window.top.location.href = '/dsp.html';
              });
          }
        }
      },
      async onOperationClicked(cmd) {
        switch (cmd) {
          case 'switchApp':
            window.top.location.href = '/app.html#/startup/chose';
            break;
          case 'createApp':
            if (this.isMarketingCenter) {
              window.top.location.href = '/wkb.html#/startup/industry';
            } else {
              this.$router.push('/startup/industry');
            }
            break;
          case 'quitAccount':
            cBaseApi.logout();
            break;
        }
      },
      hasScrollbar() {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      },
      getAppMappingAuth() {
        if (!this.curApp) {
          return;
        }
        // 查询职位列表
        wpBaseApi.getEmployeePositionList().then(eplRes => {
          store.commit('set_EmployeePositionList', eplRes.data);
        });
      },

      searchByName() {
        const list = this.currentStoreList.length ? this.currentStoreList : this.storeList;
        this.actStoreList = list.filter(i => i.name.indexOf(this.storeName) > -1);
      },

      // 切换搜索模式
      switchSearch() {
        this.storeName = '';
        this.location = [];
        this.showProvince = !this.showProvince;
        this.tips = this.showProvince === true ? '按门店搜索' : '按城市搜索';
      },

      reload() {
        // 当前路由
        const currentPath = window.location.hash.slice(1);
        // 做一次重定向，为了beforeRouteEnter刷新
        const path = '/';

        this.isRouterAlive = false;
        this.$router.push(path);

        this.$nextTick(() => {
          this.isRouterAlive = true;
          this.$router.push(currentPath);
        });
      },

      jump(url, index) {
        const isReturnSecondRoute = this.normalMenu[index].identifier === 'ma_marketing';

        const path = filterRoute(this.normalMenu, index, isReturnSecondRoute);

        this.$router.push(path);
      },

      toCashier() {
        if (this.allowEnter) {
          if (!this.curStore || !this.curStore.id) {
            this.$alert('请选择对应门店后，再进入收银台', '提醒', {
              confirmButtonText: '确定',
            });
          } else {
            const routes = this.$router.resolve({ path: menu.path.CASHIER });
            window.open(routes.href, '_blank');
          }
        }
      },

      // 处理 界面的响应模式
      checkMode(path) {
        // 创建模式
        if (menu.path.regex.CREATING.test(path)) {
          if (this.nowMode !== UI_MODE.CreateStoreEnv) {
            bodyClassList.remove('manage-store-env');
            bodyClassList.remove('empty-store-env');
            bodyClassList.add('create-store-env');
            this.nowMode = UI_MODE.CreateStoreEnv;
          }
        }
        // 空模式
        else if (menu.path.regex.FULL_PAGE_CTRL.test(path) || menu.path.regex.DECORATE.test(path)) {
          if (this.nowMode !== UI_MODE.EmptyEnv) {
            bodyClassList.remove('manage-store-env');
            bodyClassList.remove('create-store-env');
            bodyClassList.add('empty-store-env');
            this.nowMode = UI_MODE.EmptyEnv;
          }
        }
        // 店铺管理模式
        else {
          if (this.nowMode !== UI_MODE.ManageStoreEnv) {
            bodyClassList.remove('empty-store-env');
            bodyClassList.remove('create-store-env');
            bodyClassList.add('manage-store-env');
            this.nowMode = UI_MODE.ManageStoreEnv;
          }
        }
      },

      // 菜单状态
      checkMenuSelected(route) {
        const aside = this.$refs.aside;

        if (aside) {
          const path = !!route.matched && !!route.matched.length ? route.matched[0].path : route.path;
          Array.prototype.forEach.call(aside.querySelectorAll('.menu-item'), item => {
            const itemCl = new ClassList(item);
            if (path === item.getAttribute('data-url') || path === item.getAttribute('data-url2')) {
              itemCl.add('selected');
            } else {
              itemCl.remove('selected');
            }
          });
        }
      },

      /**
       * 强迫优先跳转模块
       */
      getForcePath() {
        return this.global_appCount > 0 ? menu.path.CHOOSE_APP : menu.path.START_CREATE_APP;
      },

      /**
       * type===app => 切换店铺
       * type===account => 退出账户
       * @param type
       */
      changeOpera(type) {
        if (type === 'app') {
          this.$router.push('/startup/chose');
        } else if (type === 'create') {
          this.$router.push('/startup/industry');
        }
      },

      /**
       * 切换门店
       */
      changeStore(id) {
        this.popoverVisible = false;
        // 判断门店下拉框中有多个门店才执行门店切换接口
        if (!!this.storeList && this.storeList.length > 1) {
          api.changeStore({ storeId: id }).then(res => {
            store.dispatch('queryRoleList', id).then(() => {
              store.commit('set_curStore', id);
            });
          });
        }
      },

      // 获取纠正的跳转路径
      getFixedPath(to) {
        if (!this.curApp && !Object.prototype.hasOwnProperty.call(menu.path.creating, to)) {
          return this.getForcePath();
        }
      },

      async queryProvinceList() {
        const { data } = await queryProvinceList();
        this.provinceList = (data || []).map(i => ({ label: i.province, value: i.province, children: [] }));
      },

      async handleCascaderChange([provinceName]) {
        const cityList = await this.queryCityList(provinceName);
        const cur = this.provinceList.find(i => i.value === provinceName);
        if (cur) {
          cur.children = cityList;
        }
      },

      async queryCityList(provinceName) {
        const { data } = await queryCityList({ provinceName });
        return data.map(i => ({ label: i.city, value: i.city }));
      },

      async queryStoreList() {
        // eslint-disable-next-line no-unused-vars
        const [_, cityName] = this.location;
        if (!cityName) {
          this.lStoreList = this.storeList;
          return;
        }
        try {
          this.storeLoading = true;
          const { data } = await queryStoreByLocation({
            dimFlg: 'c',
            cityName: cityName,
          });
          this.lStoreList = data || [];
        } finally {
          this.storeLoading = false;
        }
      },
    },
  };
</script>
<style lang="less">
  .adapter-ifr-no-padding {
    padding-top: 0 !important;
  }

  .adapter-ifr-margin {
    margin-left: 140px !important;
  }

  .adapter-ifr-no-margin {
    margin: 0 0 0 0 !important;
  }
  //

  .adapter-ifr-hide-top {
    .el-message-box__wrapper {
      right: 240px !important;
    }

    .el-dialog {
      // right: 69px;
      margin-top: 60px !important;
    }

    .el-dialog.is-fullscreen {
      right: 140px;
      left: 0;
      top: 0;
      margin: 0 0 40px 0 !important;
      width: calc(100% - 140px);
      height: calc(100% - 40px);
    }
  }

  /* .el-message-box{ */

  /* position: relative!important; */

  /* right: 69px!important; */

  /* bottom: 23px!important; */

  /* } */
</style>
<style lang="less" scoped>
  .store-picker {
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    color: #999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .aside-cashier .disabled {
    cursor: not-allowed;
  }
</style>
