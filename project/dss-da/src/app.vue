<template>
  <div>
    <page-header :user-name="global_info ? global_info.userName : ''"
                 :wkb-status="wkbStatus"
                 :klb-status="klbStatus"
                 :operation-list="operationList"
                 @operation-action="onOperationClicked">

    </page-header>
    <div id="app"
         class="dss-app-with-side-bar">

      <template>
        <side-bar :menu-list="menus"
                  v-loading="loading"></side-bar>

        <div class="body-div"
             v-if="curApp">
          <transition name="fade"
                      mode="out-in">
            <router-view class="main" />
          </transition>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import './app.less';
import env from '@/dss-common/utils/env';
import mixin from '@/dss-common/mixins/base';
import PageHeader from '@/dss-common/components/page-header/index.vue';
import SideBar from '@/dss-common/components/sidebar/index.vue';
import baseApi from '@/dss-common/api/base.js';

import analysisMenus from '@/dss-common/components/sidebar/analysis-menu.js';

const operationList = [{ id: 'quitAccount', name: '退出账户' }];

export default {
  mixins: [mixin],
  components: {
    PageHeader,
    SideBar
  },

  data() {
    return {
      operationList,
      loading: false,
      icons: {
        '/passflow': 'icon-passflow',
        '/portrait': 'icon-scan',
        '/diagnosis': 'icon-diagnosis'
      },
      menus: {},
      openeds: []
    };
  },

  computed: {
    ...mapState({
      userInfo: 'userInfo',
      global_info: 'global_info',
      wkbStatus: 'wkbStatus',
      klbStatus: 'klbStatus',
      curApp: 'curApp'
    })
  },

  mounted() {
    this.$router.onReady(() => {
      const path = this.$route.path;
      this.checkIsAppChoosed(path);
    });
    this.getMenus();
    if (this.isIE()) {
      // 修复IE顶部菜单点击无法跳转的问题
      window.addEventListener(
        'hashchange',
        () => {
          let currentPath = window.location.hash.slice(1);
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath);
          }
        },
        false
      );
    }
  },

  methods: {
    checkIsAppChoosed(path) {
      if (!this.curApp) {
        this.$alert('尚未选择店铺，去选择店铺?', '选择店铺', {
          confirmButtonText: '确定',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        })
          .then(() => {
            const redirect = encodeURIComponent('/da.html#' + path);
            window.top.location.href = '/wkb.html?redirect=' + redirect + '#/startup/chose';
          })
          .catch(() => {
            window.top.location.href = '/store.html';
          });
      }
    },
    onOperationClicked(cmd) {
      switch (cmd) {
        case 'switchApp':
          window.top.location.href = '/wkb.html#/startup/chose';
          break;
        case 'createApp':
          window.top.location.href = '/wkb.html#/startup/industry';
          break;
        case 'quitAccount':
          baseApi.logout();
          break;
      }
    },
    getMenus() {
      this.menus = analysisMenus.getAnalysisMenus(this.wkbStatus);
    },

    isIE() {
      return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
    }
  }
};
</script>
