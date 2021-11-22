<template>
  <WkbPageNav
    v-if="isTemplate"
    hide-nav
    page-name="营销工具"
    class="wkb-market"
    :re-position="adapterIfrHideTop"
    :show-page-name="false"
  >
    <router-view />
  </WkbPageNav>

  <WkbPageNav
    v-else
    :menu-list="menu"
    class="wkb-market"
    :re-position="adapterIfrHideTop"
    :show-page-name="false"
  ></WkbPageNav>
</template>

<script>
  import { mapState } from 'vuex';
  import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
  import Template from './template.vue';
  import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';

  export default {
    mixins: [AdapterIfr.AdapterMixins, industryHelperMixin],
    components: {
      WkbPageNav,
      Template,
    },
    data() {
      return {
        isTemplate: false,
        menu: [],
      };
    },
    computed: {
      ...mapState({
        env: 'env',
        wkbScopeMenu: 'wkbScopeMenu',
      }),
      // menu() {
      //   return this.mGetMarketingMenu();
      // }
    },
    mounted() {
      this.isTemplate = this.$route.path === '/marketing/template';
    },
    watch: {
      '$route.path'(n) {
        const isTemplate = n === '/marketing/template';
        if (isTemplate !== this.isTemplate) {
          this.isTemplate = isTemplate;
        }
      },
      wkbScopeMenu: {
        immediate: true,
        handler() {
          if (this.wkbScopeMenu) {
            this.assembleGoodsMgrMenu();
          }
        },
      },
    },
    methods: {
      assembleGoodsMgrMenu() {
        const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          scopeMenuEnum.dictionary.wkbChildMenu.ma_marketing
        );
        this.menu = scopeMenu && scopeMenu.childMenu;
      },
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .wkt-breadcrumb-container {
    padding: 0 20px;
  }

  /deep/ .el-form--inline .el-form-item__label {
    min-width: 96px;
  }

  /deep/ .el-range-editor.el-input__inner {
    vertical-align: middle;
  }
</style>
