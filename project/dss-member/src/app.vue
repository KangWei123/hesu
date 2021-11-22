<template>
  <AppContainer
    :is-menu-done="isMenuDone"
    :final-menus="finalMenus"
    :page-menu-key="pageMenuKey"
    @rootMenuDone="onRootMenuLoad"
    class="wkt-member"
    :sub-active="subActive"
    :fourth-menus="subActive ? fourthMenus : []"
  ></AppContainer>
</template>

<script>
  import { mapState } from 'vuex';
  import AppContainer from '@/dss-common/components/Layout/AppContainer/index';
  import './app.less';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import wpBaseApi from '@/business-common/wp-base-api';

  export default {
    components: { AppContainer },

    data() {
      return {
        isMenuDone: false,
        finalMenus: [],
        pageMenuKey: scopeMenuEnum.dictionary.dmpMenu,
        subActive: '',
      };
    },

    computed: {
      ...mapState({
        dmpScopeMenu: 'dmpScopeMenu',
        routeLeafs: 'routeLeafs',
      }),

      // 获取第四级菜单
      fourthMenus() {
        if (this.subActive && this.routeLeafs) {
          const routers = this.$router.currentRoute;
          const list = routers.matched;
          const rs = this.routeLeafs.get(list[1].path);
          console.log('fourthMenus', rs.childMenu);
          return (rs && rs.childMenu) || [];
        }
        return [];
      },
    },
    watch: {
      $route(route) {
        // 判断是否是第四级菜单的路由
        this.subActive = route.path.includes('shanhu') ? route.matched[1].path : '';
      },
      subActive(val) {
        if (val) this.getShanhuToken();
      },
    },
    methods: {
      getShanhuToken() {
        wpBaseApi.getShanhuToken().then(res => {
          this.$store.commit('setShanhuInfo', res.data);
        });
      },
      onRootMenuLoad() {
        this.$store.dispatch('getDmpMenu').then(res => {
          if (this.dmpScopeMenu && this.dmpScopeMenu.length) {
            const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
              this.dmpScopeMenu,
              scopeMenuEnum.dictionary.dmpMenu
            );
            this.finalMenus = scopeMenu && scopeMenu.childMenu;
            console.log(this.finalMenus);
          }
          this.isMenuDone = true; // 菜单有数据加载完成
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .wkt-member /deep/ .wkt-breadcrumb-container {
    height: auto !important;
    line-height: normal !important;
    background: none !important;
  }
</style>
