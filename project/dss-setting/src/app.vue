<template>
  <div :class="{ hideSidebar: !sidebar.opened }">
    <page-header
      :user-name="userInfo ? userInfo.userName || userInfo.epName : ''"
      :wkb-status="wkbStatus"
      :klb-status="klbStatus"
      :opts-list="operationList"
      :user-infos="userInfo"
      @operation-action="onOperationClicked"
    >
    </page-header>

    <div id="app" class="system-setting-body">
      <!-- 菜单信息 -->
      <div class="menu-box" ref="aside">
        <sidebar class="sidebar-container" :menu="normalMenu" />
      </div>

      <!-- 页面内容 -->
      <div class="content-box">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import PageHeader from '@/dss-common/components/page-header/index.vue';
  import Sidebar from '@/dss-common/components/Layout/Sidebar/index';
  import cBaseApi from '@/dss-common/api/base.js';
  import ClassList from '@/dss-common/utils/class-list.js';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
  import './app.less';
  import store from '@/business-common/store.js';
  import api from '@/dss-wechat3rd/src/api';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import { handleCurrentPathPermission, filterRoute } from '@/business-common/permission.js';
  import chooseApi from '@/business-common/api/epApi.js';

  export default {
    mixins: [industryHelperMixin],
    components: {
      PageHeader,
      Sidebar,
    },

    data() {
      return {
        scopeMenuEnum,
        normalMenu: [],
        operationList: [{ id: 'quitAccount', name: '退出账户' }],
      };
    },

    computed: {
      path() {
        return this.$route.path;
      },
      ...mapState({
        userInfo: 'userInfo',
        wkbStatus: 'wkbStatus',
        klbStatus: 'klbStatus',
        allStoreList: 'allStoreList',
        rootScopeMenu: 'rootScopeMenu',
        sidebar: 'sidebar',
        settingsScopeMenu: 'settingsScopeMenu',
      }),
    },

    watch: {
      // 监听路由变化，实现菜单高亮
      $route: {
        handler: function (val, oldVal) {
          this.checkMenuSelected(val);
        },
        // 深度观察监听
        deep: true,
      },
      rootScopeMenu() {
        store.dispatch('getSettingsMenu');
        this.isHaveSettingMenu();
      },
      settingsScopeMenu() {
        this.assembleSettingsScopeMenu();
      },
    },

    mounted() {
      // 监听手动输入URL时无权限跳转
      window.addEventListener(
        'hashchange',
        () => {
          const permission = handleCurrentPathPermission(this.normalMenu);
          if (!permission.isHavePermission) {
            if (permission.currentPath === '/') {
              const path = filterRoute(this.normalMenu);
              this.$router.push(path);
            } else {
              this.$router.push('/403');
            }
          }
        },
        false
      );
      this.getSettingsMenus();
      this.getBrandList();
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
      getSettingsMenus() {
        store.dispatch('getRootMenu');
      },
      isHaveSettingMenu() {
        const index = this.rootScopeMenu.findIndex(item => item.identifier === scopeMenuEnum.dictionary.settingsMenu);
        if (index === -1) {
          this.$router.push('/403');
        }
      },
      assembleSettingsScopeMenu() {
        const scopMenu = scopeMenuEnum.getMenuScopeByIdentifier(
          this.settingsScopeMenu,
          scopeMenuEnum.dictionary.settingsMenu
        );
        this.normalMenu = scopMenu && scopMenu.childMenu;
        if (this.normalMenu && this.normalMenu.length) {
          this.normalMenu.forEach(item => {
            const menu = scopeMenuEnum.getMenuScopeByIdentifier(this.settingsScopeMenu, item.identifier);
            if (menu) {
              item.disabled = !menu.status;
            }
          });
        }

        // 判断当前路由是否存在权限路由表中
        const permission = handleCurrentPathPermission(this.normalMenu);

        const currentPath = permission.currentPath;
        const currentIndex = permission.currentIndex;

        let path = filterRoute(this.normalMenu);

        // 当前选中路径-只能用一级路由
        let selectPath = this.normalMenu[0].url;

        // 路由存在时保存当前路由
        if (currentIndex !== -1) {
          selectPath = this.normalMenu[currentIndex].url;
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

      // 右上角账户区域操作
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

      // 将选择的菜单状态置为高亮
      checkMenuSelected(route) {
        const aside = this.$refs.aside;
        if (aside) {
          const path = !!route.matched && !!route.matched.length ? route.matched[0].path : route.path;
          Array.prototype.forEach.call(aside.querySelectorAll('.menu-item'), item => {
            const itemCl = new ClassList(item);
            if (path === item.getAttribute('data-url')) {
              itemCl.add('selected');
            } else {
              itemCl.remove('selected');
            }
          });
        }
      },

      // 跳转不同菜单页面
      jump(url) {
        this.$router.push(url);
      },
    },
  };
</script>
