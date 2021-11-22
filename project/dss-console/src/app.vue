<template>
  <AppContainer
    :is-menu-done="isMenuDone"
    :final-menus="finalMenus"
    :page-menu-key="pageMenuKey"
    @rootMenuDone="onRootMenuLoad"
  ></AppContainer>
</template>

<script>
  import { mapState } from 'vuex';
  import AppContainer from '@/dss-common/components/Layout/AppContainer/index';
  import './app.less';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';

  export default {
    components: { AppContainer },

    data() {
      return {
        isMenuDone: false,
        finalMenus: [],
        pageMenuKey: scopeMenuEnum.dictionary.companyMenu,
      };
    },

    computed: {
      ...mapState({
        companyScopeMenu: 'companyScopeMenu',
      }),
    },

    mounted() {},

    methods: {
      onRootMenuLoad() {
        this.$store.dispatch('getCompanyMenu').then(res => {
          if (this.companyScopeMenu && this.companyScopeMenu.length) {
            const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
              this.companyScopeMenu,
              scopeMenuEnum.dictionary.companyMenu
            );
            this.finalMenus = scopeMenu && scopeMenu.childMenu;
          }
          this.isMenuDone = true; // 菜单有数据加载完成
        });
      },
    },
  };
</script>
