<template>
  <div>
    <keep-alive>
      <wkb-page-nav :menuList="orderMenu"
                    v-if="$route.meta.keepAlive" />
    </keep-alive>
    <wkb-page-nav :menuList="orderMenu"
                  v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
import { mapState } from 'vuex';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';

export default {
  mixins: [industryHelperMixin],
  components: {
    WkbPageNav
  },
  data() {
    return {
      orderMenu: [],
      orderTab: orderStatusEnum,
      orderTypeName: this.$route.path.replace('/order/', '') || `${orderStatusEnum.ORDER.name}-list`
    };
  },
  computed: {
    ...mapState({
      wkbScopeMenu: 'wkbScopeMenu'
    }),
    computeOrderTypeName: {
      get() {
        return this.orderTypeName.replace('-list', '');
      },
      set(val) {
        this.orderTypeName = `${val}-list`;
      }
    }
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        if (this.wkbScopeMenu) {
          this.assembleOrderMgrMenu();
        }
      }
    }
  },

  // mounted() {
  //   this.orderMenu = this.mGetOrderMenu();
  //   if (this.wkbScopeMenu) {
  //     this.assembleOrderMgrMenu();
  //   }
  // },

  methods: {
    gotoSale() {
      window.location.href = '/da.html#/sales/overview';
    },
    handleOderTypeClick(tab, event) {
      this.$router.push({ path: `/order/${this.orderTypeName}` });
    },
    assembleOrderMgrMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.order_mgr
      );
      this.orderMenu = scopeMenu && scopeMenu.childMenu;
    }
  }
};
</script>

<style lang="less"></style>
