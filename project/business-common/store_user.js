import { mapState } from 'vuex';
import types from './industry-enum.js';
import store from './store.js';
import wpBaseApi from './wp-base-api.js';
import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';

export default {
  mixins: [appFeaturesMixin],
  computed: {
    ...mapState({
      curApp: state => state.curApp,
      appFeatures: 'appFeatures'
    }),
    // 是否连锁版
    isChain() {
      return !!this.curApp /*&& this.curApp.packageType === types.CHAIN_STORE*/;
    }
  },
  methods: {
    update_userInfo(data) {
      const { appInfo, storeList, storeInfo, roleList } = data;
      const isChain = !!appInfo; /*&& appInfo.packageType === types.CHAIN_STORE*/
      // 有店铺信息，且判断 roleList.indexOf('common_role_enterprise') !== -1 为品牌账号登录进来的，则默认在数组storeList中的首位添加一个总店，否则不添加
      if (isChain && roleList && roleList.indexOf('common_role_enterprise') !== -1) {
        // 连锁版(手动增加一个总店，id 为空)
        data.storeList = [
          {
            id: '',
            name: '总控制台' // 总店名称改为总控制台
          }
        ].concat(storeList || []);
      }
      store.commit('set_userInfo', data);

      if (!storeInfo && isChain) {
        store.commit('set_curStore', '');
      }

      store.dispatch('queryRoleList', storeInfo ? storeInfo.id : null);
      if (appInfo && appInfo.industryKey) {
        // store.dispatch('getScopeByType', appInfo.industryKey);
      }
    },
    __updateWarehouse() {
      store.dispatch('fetchWarehouse');
    },
    /**
     * 刷新vuex里userInfo信息，在门店删除，修改，添加时调用,店铺状态修改也调用。
     */
    refresh_userInfo() {
      if (this.curApp && this.curApp.id) {
        wpBaseApi
          .changeApp({
            appId: this.curApp.id
          })
          .then(res => {
            this.update_userInfo(res.data);
          });
      }
    }
  }
};
