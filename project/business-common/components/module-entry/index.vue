<template>
  <div>
    <keep-alive>
      <wkb-page-nav
        :menu-list="moduleMenus"
        :business-scope-child-menu="businessScopeChildMenuList"
        :page-name="pageName"
        v-if="$route.meta.keepAlive"
        :check-store="checkStore"
      />
    </keep-alive>
    <wkb-page-nav
      :menu-list="moduleMenus"
      :business-scope-child-menu="businessScopeChildMenuList"
      :page-name="pageName"
      v-if="!$route.meta.keepAlive"
      :check-store="checkStore"
    />
  </div>
</template>

<script>
  import WkbPageNav from '@/business-common/components/wkb-page-nav/index.vue';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';

  /**
   * 每个子模块的入口基本一样，所以抽成公共组件供各个模块的入口文件引入
   */
  export default {
    components: {
      WkbPageNav,
    },
    props: {
      /**
       * 业务模块菜单，比如wkbScopeMenu，dmpScopeMenu等等
       */
      businessScopeMenu: {
        type: Array,
        default: function () {
          return [];
        },
      },
      /**
       * 子业务的menu key， scopeMenuEnum.dictionary字典中的业务模块的子菜单的key保持一致
       * 如会员中心的scopeMenuEnum.dictionary.dmpChildMenu.member_center
       */
      moduleMenuKey: {
        type: String,
        default: '',
      },
      /**
       * 加入没有子菜单时，页面名称
       */
      pageName: {
        type: String,
        default: '',
      },
      checkStore: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        moduleMenus: [],
      };
    },

    computed: {
      businessScopeChildMenuList() {
        if (this.businessScopeMenu && this.businessScopeMenu.length) {
          return this.businessScopeMenu[0].childMenu || [];
        }
        return [];
      },
    },
    watch: {
      businessScopeMenu: {
        immediate: true,
        handler() {
          if (this.businessScopeMenu && this.businessScopeMenu.length) {
            this.assembleModuleMenus();
          }
        },
      },
    },

    methods: {
      assembleModuleMenus() {
        const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(this.businessScopeMenu, this.moduleMenuKey);
        this.moduleMenus = scopeMenu && scopeMenu.childMenu;
      },
    },
  };
</script>

<style lang="less"></style>
