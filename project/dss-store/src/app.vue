<template>
  <div :class="{ hideSidebar: !sidebar.opened }">
    <page-header
      :user-name="userInfo ? userInfo.userName || userInfo.epName : ''"
      :wkb-status="wkbStatus"
      :klb-status="klbStatus"
      :opts-list="operationList"
      :user-infos="userInfo"
      @changeStore="changeStore"
      :is-has-sel-store="true"
      @operation-action="onOperationClicked"
    >
    </page-header>
    <div id="app" class="dss-app-with-side-bar store-app">
      <template v-if="showMenu">
        <div class="wkb-aside">
          <sidebar-layout class="sidebar-container" v-loading="loading" :menu="menus" :refuch="refuch" />
        </div>

        <div class="body-div">
          <transition name="fade" mode="out-in">
            <router-view class="main" v-if="isRouterAlive" />
          </transition>
        </div>
      </template>
      <router-view v-else />
      <!--门店布局-->
      <a v-if="isHaveStoreLayout" href="javascript:void(0)" class="aside-store" @click="toStore"></a>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import './app.less';
  import env from '@/dss-common/utils/env';
  import mixin from '@/dss-common/mixins/base';
  import PageHeader from '@/dss-common/components/page-header/index.vue';
  import baseApi from '@/dss-common/api/base';
  import SidebarLayout from '@/dss-common/components/Layout/Sidebar/index';
  import storeMenus from '@/dss-common/components/sidebar/store-menu.js';
  import store from '@/business-common/store.js';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import api from '@/dss-wechat3rd/src/api';
  import { handleCurrentPathPermission, filterRoute } from '@/business-common/permission.js';
  import { getRouteLeafs } from '@/dss-common/utils/routeHandle.js';
  import chooseApi from '@/business-common/api/epApi.js';

  export default {
    mixins: [mixin],
    components: {
      PageHeader,
      SidebarLayout,
    },

    data() {
      return {
        operationList: [],
        loading: true,
        storeList: [],
        showMenu: false,
        value: '',
        menus: [],
        isRouterAlive: true,
        refuch: true,
        scopeMenu: [],
      };
    },

    computed: {
      path() {
        return this.$route.path;
      },
      ...mapState({
        stores: state => state.stores,
        userInfo: 'userInfo',
        curStore: state => state.curStore,
        wkbStatus: 'wkbStatus',
        klbStatus: 'klbStatus',
        rootScopeMenu: 'rootScopeMenu',
        wkbScopeMenu: 'wkbScopeMenu',
        storeScopeMenu: 'storeScopeMenu',
        scopeRoleList: 'scopeRoleList',
        sidebar: 'sidebar',
        routeLeafs: 'routeLeafs',
      }),
      isHaveStoreLayout() {
        if (this.scopeMenu && this.scopeMenu.length) {
          const result = this.scopeMenu.find(item => item.identifier === 'store_layout');
          if (result) {
            if (Object.keys(result).length !== 0) {
              return true;
            }
          }
        }

        return false;
      },
    },
    watch: {
      '$store.state.curStore'() {
        this.reload();
      },
      path() {
        this.showMenu = ['/report/week'].indexOf(this.path) === -1;
      },
      showMenu(val) {
        this.setBody(val);
      },
      curStore: {
        deep: true,
        handler(newVal, oldVal) {
          if (oldVal) {
            // this.getMenus();
            this.getStoreMenus();
          }
        },
      },
      scopeRoleList() {
        this.getStoreMenus();
      },
      rootScopeMenu() {
        store.dispatch('getStoreMenu');
        this.isHaveStoreMenu();
      },
      storeScopeMenu: {
        immediate: true,
        handler() {
          if (this.storeScopeMenu && this.storeScopeMenu.length) {
            this.getMenus();
          }
        },
      },
    },

    mounted() {
      // 监听手动输入URL时无权限跳转
      window.addEventListener(
        'hashchange',
        () => {
          const permission = handleCurrentPathPermission(this.scopeMenu);
          if (!permission.isHavePermission) {
            if (permission.currentPath === '/') {
              const path = filterRoute(this.scopeMenu);
              this.$router.push(path);
            } else {
              this.$router.push('/403');
            }
          }
        },
        false
      );
      this.getBrandList();
      this.getStoreMenus();
      this.value = this.epId || '';

      this.setBody(this.showMenu);
      if (env.isThirdCorp()) {
        document.body.classList.add('third-corp');
      }
      if (this.isIE()) {
        // 修复IE顶部菜单点击无法跳转的问题
        window.addEventListener(
          'hashchange',
          () => {
            const currentPath = window.location.hash.slice(1);
            if (this.$route.path !== currentPath) {
              this.$router.push(currentPath);
            }
          },
          false
        );
      }
    },

    created() {
      this.setStore();
    },

    methods: {
      getBrandList() {
        api
          .getUserStoreList()
          .then(res => {
            const data = res.data || [];

            const len = data.length;

            if (len > 1) {
              // this.operationList.unshift({ key: 'switchApp', isHasPermission: 1, icon: 'icon-buy', name: '切换应用' });
            }
          })
          .always(res => {
            this.loading = false;
          });
      },
      getStoreMenus() {
        store.dispatch('getRootMenu');
      },
      isHaveStoreMenu() {
        const index = this.rootScopeMenu.findIndex(item => item.identifier === scopeMenuEnum.dictionary.storeMenu);
        if (index === -1) {
          this.$router.push('/403');
        }
      },
      setStore() {
        const storeList = this.$plain(this.stores);
        if (storeList) {
          storeList.forEach((element, index) => {
            if (!element.id) {
              storeList.splice(index, 1);
            }
          });
          if (!this.curStore.id && storeList && storeList[0]) {
            baseApi.changeStore({ storeId: storeList[0].id }).then(res => {
              store.commit('setCurStore', storeList[0]);
            });
          }
          store.commit('setStores', storeList);
        }
      },

      async onOperationClicked(cmd) {
        switch (cmd) {
          case 'switchApp':
            window.top.location.href = '/app.html#/startup/chose';
            break;
          case 'quitAccount':
            baseApi.logout();
            break;
        }
      },
      setBody(val) {
        document.body.style.overflow = !val ? 'auto' : '';
      },

      getMenus() {
        this.loading = true;
        const curRole = (this.userInfo && this.userInfo.roleList) || '';

        const scopeMenu =
          scopeMenuEnum.getMenuScopeByIdentifier(this.storeScopeMenu, scopeMenuEnum.dictionary.storeMenu) &&
          scopeMenuEnum.getMenuScopeByIdentifier(this.storeScopeMenu, scopeMenuEnum.dictionary.storeMenu).childMenu;

        const storeMenu = scopeMenu.map(item => {
          item.business = '/store.html#';
          return item;
        });

        this.scopeMenu = this.$plain(storeMenu);

        storeMenus
          .getStoreMenus(storeMenu, this.klbStatus, this.wkbStatus, this.curStore, curRole)
          .then(menus => {
            this.menus = menus;
            this.setRouteLeafs(this.menus);
          })
          .always(() => {
            this.loading = false;
          });

        // 判断当前路由是否存在权限路由表中
        const permission = handleCurrentPathPermission(this.scopeMenu);

        const currentPath = permission.currentPath;
        const currentIndex = permission.currentIndex;

        let path = filterRoute(this.scopeMenu);

        // 路由存在时保存当前路由
        if (currentIndex !== -1) {
          path = currentPath;
        }

        this.$router.push(path);
      },

      setRouteLeafs(data) {
        const routes = getRouteLeafs(data);
        store.commit('SET_ROUTE_LEAFS', routes);
      },

      reload() {
        this.isRouterAlive = false;
        this.$nextTick(() => (this.isRouterAlive = true));
      },

      isIE() {
        return (
          '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
        );
      },

      toStore() {
        if (!this.klbStatus) {
          this.$alert('需购买客流宝套餐', '提醒', {
            confirmButtonText: '确定',
          });
        } else {
          this.$router.push('/passflow/store-layout');
          this.refuch = !this.refuch;
        }
      },
      // /**
      //  * 切换门店
      //  */
      changeStore(id) {
        const storeList = this.$plain(this.stores);
        this.popoverVisible = false;
        // 判断门店下拉框中有多个门店才执行门店切换接口
        if (!!storeList && storeList.length > 1) {
          api.changeStore({ storeId: id }).then(res => {
            store.dispatch('queryRoleList', id).then(() => {
              store.commit('set_curStore', id);
            });
          });
        }
      },
    },
  };
</script>
