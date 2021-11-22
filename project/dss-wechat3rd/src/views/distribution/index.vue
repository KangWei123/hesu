<template>
  <wkb-page-nav :menu-list="menuList"></wkb-page-nav>
</template>

<script>
  import store from '@/business-common/store.js';
  import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
  import { mapState } from 'vuex';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';

  /* const distributionMenus = [
  {
    path: 'staff-manage',
    name: '员工管理',
    children: [
      {
        path: 'all',
        name: '全部'
      },
      {
        path: 'marketing',
        name: '全员营销'
      },
      {
        path: 'purchase',
        name: '员工内购'
      },
      {
        path: 'employee',
        name: '企业员工'
      }
    ]
  },
  {
    path: 'performance-statistic',
    name: '业绩统计',
    children: [
      {
        path: 'marketing',
        name: '全员营销'
      },
      {
        path: 'purchase',
        name: '员工内购'
      }
    ]
  },
  {
    path: 'commission-settlement',
    name: '佣金结算',
    children: [
      {
        path: 'marketing',
        name: '全员营销'
      },
      {
        path: 'purchase',
        name: '员工内购'
      },
      {
        path: 'setting',
        name: '结算设置'
      }
    ]
  },
  {
    path: 'internal-purchase',
    name: '员工内购',
    children: [
      {
        path: 'goods-setting',
        name: '商品设置'
      },
      {
        path: 'voucher-setting',
        name: '内购券设置'
      },
      {
        path: 'rule-setting',
        name: '规则设置'
      }
    ]
  },
  {
    path: 'all-marketing',
    name: '全员营销',
    children: [
      {
        path: 'goods-setting',
        name: '商品设置'
      },
      {
        path: 'rule-setting',
        name: '规则设置'
      }
    ]
  }
]; */
  export default {
    components: {
      WkbPageNav,
    },
    data() {
      return {
        // menuList: distributionMenus
        menuList: [],
      };
    },
    computed: {
      ...mapState({
        env: 'env',
        authorizedInfo: state => state.authorizedInfo,
        wxAuthInfo: state => state.wxAuthInfo,
        wkbScopeMenu: 'wkbScopeMenu',
      }),
    },
    watch: {
      wkbScopeMenu: {
        immediate: true,
        handler(newVal, oldVal) {
          if (this.wkbScopeMenu && this.wkbScopeMenu.length) {
            this.assembleDistributionMenu();
          }
        },
      },
    },
    mounted() {
      // 重定向跳转，避免iframe屏蔽父级页面，直接打开子页面
      if (window.location.href.indexOf('hideTop&hideMenu&noGap') > -1) {
        window.top.location.href = '/dsp.html#/distribution';
      }

      // 监听事件
      if (window.addEventListener) {
        window.addEventListener('message', this.displayMessage, false);
      } else {
        window.attachEvent('onmessage', this.displayMessage);
      }
    },
    methods: {
      assembleDistributionMenu() {
        const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          scopeMenuEnum.dictionary.wkbChildMenu.distribution
        );
        this.menuList = scopeMenu && scopeMenu.childMenu;
      },
      // 监听iframe父页面想当前页面传过来的门店信息
      displayMessage(event) {
        // 判断监听获取到的参数是否含有门店的参数，是则更新门店
        if (event.data.hasOwnProperty('id') && event.data.hasOwnProperty('name')) {
          store.commit('setCurStore', event.data); // 更新选择的门店
        }
      },
    },

    beforeDestroy() {
      // 组件销毁的时候，要销毁监听事件
      window.removeEventListener('message', this.displayMessage);
    },
  };
</script>
