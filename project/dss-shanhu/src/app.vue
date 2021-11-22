<template>
  <AppContainer
    :is-menu-done="isMenuDone"
    :final-menus="finalMenus"
    :page-menu-key="pageMenuKey"
    @rootMenuDone="onRootMenuLoad"
    class="wkt-member"
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
        pageMenuKey: scopeMenuEnum.dictionary.shanhuMenu,
      };
    },

    computed: {
      ...mapState({
        shanhuScopeMenu: 'shanhuScopeMenu',
      }),
    },

    mounted() {
      this.getShanhuToken();
    },

    methods: {
      getShanhuToken() {
        wpBaseApi.getShanhuToken().then(res => {
          this.$store.commit('setShanhuInfo', res.data);
        });
      },
      onRootMenuLoad() {
        this.$store.dispatch('getShanhuMenu').then(res => {
          if (this.shanhuScopeMenu && this.shanhuScopeMenu.length) {
            const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
              this.shanhuScopeMenu,
              scopeMenuEnum.dictionary.shanhuMenu
            );
            this.finalMenus = scopeMenu && scopeMenu.childMenu;
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
