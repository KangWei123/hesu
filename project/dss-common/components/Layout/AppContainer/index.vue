<template>
  <div class="app-container" :class="{ hideSidebar: !sidebar.opened }">
    <page-header
      :user-name="userInfo ? userInfo.userName || userInfo.epName : ''"
      :page-menu-key="pageMenuKey"
      :wkb-status="wkbStatus"
      :klb-status="klbStatus"
      :user-infos="userInfo"
      @changeStore="changeStore"
      :is-has-sel-store="true"
      :opts-list="optsList"
      @operation-action="onOperationClicked"
    >
    </page-header>
    <div v-if="!isMenuDone" class="loading-bg">
      <div class="img-box">
        <img class="loading-gif" :src="loadingGif" />
      </div>
    </div>
    <div class="app-body" v-else>
      <div class="app-aside">
        <sidebar class="sidebar-container" :menu="finalMenus" :sub-active="subActive" />
        <sidebar class="sidebar-sub-container" v-if="!!subActive" :sub-active="$route.path" :menu="fourthMenus" />
      </div>
      <div
        :class="[sidebar.opened ? 'app-content-with-sidebar' : 'app-content-hide-sidebar', !!subActive ? 'sub' : '']"
      >
        <transition name="fade" mode="out-in">
          <router-view class="main" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import PageHeader from '@/dss-common/components/page-header/index.vue';
  import Sidebar from '@/dss-common/components/Layout/Sidebar/index';
  import loadingGif from '@/dss-common/img/loading.gif';
  import { filterRoute, handleCurrentPathPermission } from '@/business-common/permission';
  import { getRouteLeafs } from '@/dss-common/utils/routeHandle';
  import browser from '@/dss-common/utils/browser';
  import cBaseApi from '@/dss-common/api/base';
  import wpBaseApi from '@/business-common/wp-base-api';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import { industryEnum } from '@/business-common/constants/index';
  import chooseApi from '@/business-common/api/epApi.js';

  export default {
    name: 'AppContainer',
    components: { PageHeader, Sidebar },
    props: {
      isMenuDone: {
        type: Boolean,
        default: false,
      },
      pageMenuKey: {
        type: String,
        default: scopeMenuEnum.dictionary.wkbMenu,
      },
      finalMenus: {
        type: Array,
        default: function () {
          return [];
        },
      },
      // 第四级路由菜单数据
      fourthMenus: {
        type: Array,
        default: function () {
          return [];
        },
      },
      // 第四级子路由
      subActive: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        loadingGif,
        optsList: [],
      };
    },
    computed: {
      ...mapState({
        userInfo: 'userInfo',
        wkbStatus: 'wkbStatus',
        klbStatus: 'klbStatus',
        rootScopeMenu: 'rootScopeMenu',
        sidebar: 'sidebar',
        accountType: 'accountType',
      }),
    },
    watch: {
      finalMenus(newMenus, oldMenus) {
        if (newMenus && newMenus.length) {
          this.setRouteLeafs(newMenus);

          // 判断当前路由是否存在权限路由表中
          const permission = handleCurrentPathPermission(newMenus);

          const currentPath = permission.currentPath;
          const currentIndex = permission.currentIndex;

          let path = filterRoute(newMenus);

          // 当前选中路径-只能用一级路由
          let selectPath = newMenus[0].url;

          // 路由存在时保存当前路由
          if (currentIndex !== -1) {
            selectPath = newMenus[currentIndex].url;
            path = currentPath;
          }

          this.$router.push(path);

          // 更新当前路由
          const url = {};
          url.path = selectPath;
        }
      },
    },
    mounted() {
      this.getRootMenus();
      this.addHashchangeListener();

      if (this.accountType === industryEnum.accountType.group) {
        // this.optsList.unshift({ key: 'switchApp', isHasPermission: 1, icon: 'icon-buy', name: '切换应用' });
      }
      console.log(this.subActive, this.fourthMenus);
    },
    methods: {
      getRootMenus() {
        this.$store.dispatch('getRootMenu').then(res => {
          this.$emit('rootMenuDone');
        });
      },
      setRouteLeafs(menus) {
        const routes = getRouteLeafs(menus);
        this.$store.commit('SET_ROUTE_LEAFS', routes);
      },
      changeStore(id) {
        // fixme todo 是否可以放到选择门店组件中去做？
        wpBaseApi.changeStore(id).then(res => {
          this.$store.dispatch('queryRoleList', id).then(() => {
            this.$store.commit('set_curStore', id);
          });
        });
      },
      async onOperationClicked(cmd) {
        switch (cmd) {
          case 'switchApp':
            window.top.location.href = '/app.html#/startup/chose';
            break;
          case 'quitAccount':
            cBaseApi.logout();
            break;
        }
      },
      addHashchangeListener() {
        // 监听手动输入URL时无权限跳转
        window.addEventListener(
          'hashchange',
          () => {
            const permission = handleCurrentPathPermission(this.finalMenus);
            if (!permission.isHavePermission) {
              if (permission.currentPath === '/') {
                const path = filterRoute(this.finalMenus);
                this.$router.push(path);
              } else {
                this.$router.push('/403');
              }
            }
          },
          false
        );
        if (browser.isIE()) {
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
    },
  };
</script>

<style lang="less">
  .app-container {
    @hide-sidebar-width: 56px !important;

    &.hideSidebar {
      .sidebar-container {
        width: @hide-sidebar-width !important;
      }
    }

    .app-body {
      padding-top: @header-height;
    }

    .app-aside {
      display: flex;
      position: fixed;
      top: @header-height;
      left: 0;
      overflow: hidden;
      height: 100%;
      background: #fff;
      z-index: 10;

      .sidebar {
        display: flex;
        height: calc(88% - 30px);
      }

      .sidebar-container {
        width: @sidebar-width;
        transition: width 0.28s;
        height: 100%;
      }

      .sidebar-sub-container {
        width: @sidebar-sub-width;
        transition: width 0.28s;
        height: 100%;
      }

      .horizontal-collapse-transition {
        transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
      }

      .scrollbar-wrapper {
        overflow-x: hidden !important;
      }

      .el-menu {
        border: none;
        height: 100%;
        width: 100% !important;
      }

      .is-horizontal {
        display: none;
      }

      .el-scrollbar {
        height: 100%;
      }
    }

    .loading-bg {
      position: absolute;
      background-color: #f2f4f7;
      min-height: calc(100vh - @header-height);
      z-index: 99;
      box-sizing: border-box;
      width: calc(100% - 140px - 20px);
      margin: @header-height auto 0 140px;

      .img-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        min-height: calc(100vh - @header-height - 20px);
        background-color: #fff;
        margin: 10px;
      }

      .loading-gif {
        width: 160px;
        height: 100%;
      }
    }

    .app-content-with-sidebar {
      margin-left: @sidebar-width;
    }

    .app-content-hide-sidebar {
      margin-left: @hide-sidebar-width;
    }

    .sub.app-content-with-sidebar {
      margin-left: calc(@sidebar-width + @sidebar-sub-width);
    }

    .sub.app-content-hide-sidebar {
      margin-left: calc(@hide-sidebar-width + @sidebar-sub-width);
    }
  }
</style>
