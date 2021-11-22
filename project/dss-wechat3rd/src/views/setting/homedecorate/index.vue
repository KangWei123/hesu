<template>
  <WkbPageNav :menuList="mpDecorateMenu" :title-style="{borderRadius: '4px', boxShadow: '0px 2px 6px 0px rgba(0,0,0,0.06)', border: 0}"></WkbPageNav>
</template>
<script>
import { mapState } from 'vuex';
import linkedPages from '@/dss-wechat3rd/src/constants/wxLinkPages.js';
import store from '@/business-common/store.js';
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
import checkinApi from '@/dss-wechat3rd/src/api/checkin.js';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';
export default {
  mixins: [industryHelperMixin],
  components: {
    WkbPageNav
  },
  data() {
    return {
      mpDecorateMenu: []
    };
  },
  computed: {
    ...mapState({
      linkedPages: 'linkedPages',
      env: 'env',
      wkbScopeMenu: 'wkbScopeMenu'
    })
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        if (this.wkbScopeMenu) {
          this.assembleGoodsMgrMenu();
        }
      }
    }
  },
  mounted() {
    const industry = this.mGetIndustryKey();
    // this.mpDecorateMenu = this.mGetDecorateMenu();
    if (!this.linkedPages) {
      store.commit('set_linkedPages', linkedPages[industry].globalLink);
    }
    if (!this.checkinId) {
      checkinApi.query().then(res => {
        const checkinId = res.data && res.data.activityStatus === 1 ? res.data.id : null;
        if (checkinId) {
          const checkinLink = {
            value: 'sign-in',
            label: '签到',
            index: 'wxat-common/pages/signIn/index?id=' + checkinId,
            linkType: 0,
            linkId: 'sign_in',
            tips: '签到'
          };
          const linkPages = this.$plain(linkedPages[industry].globalLink);
          linkPages.push(checkinLink);
          store.commit('set_linkedPages', linkPages);
        }
      });
    }
  },
  methods: {
    assembleGoodsMgrMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.ma_decorate
      );

      this.mpDecorateMenu = scopeMenu && scopeMenu.childMenu;
    }
  }
};
</script>
