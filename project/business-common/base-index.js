'use strict';

import 'promise-polyfill/src/polyfill';
import Vue from 'vue';
import ElementUI from 'element-ui';
import Egrid from 'egrid';
import uploader from 'vue-simple-uploader';
import WkbUI from 'wkb-common-ui';

// 规避webapck线上打包版本自动treeshake
// import Promise from '@/dss-common/promise-polyfill/polyfill.js';
import '@/dss-common/lib/babel-browser-polyfill/browser-polyfill.min';
import 'wkb-common-ui/style';
import 'wkb-common-ui/packages/theme-chalk/src/index.less'; // 引入wkb-common-ui中的自定义样式
import '@/dss-common/style/base.css';
import '@/dss-common/style/anim.css';
import '@/dss-common/style/custom.css';
import '@/dss-common/style/icon2.css';
import '@/dss-common/style/atomic.css';

import VuePlain from '@/dss-common/vue-plugins/vue-plain';

import packageEnum from '@/business-common/constants/packageEnum';
import '@/dss-common/icons/index.js';

import wpBaseApi from './wp-base-api.js';
import storeUser from './store_user.js';
import store from './store.js';
import dmpStore from './dmp.js';
import globalmixins from './global-mixins';
import globalFilters from './global-filters';

const packageStatus = packageEnum.PACKAGE_STATUS;
const noop = (...args) => args;

window.Promise = Promise;

Vue.use(WkbUI);
Vue.use(VuePlain);
Vue.use(ElementUI);
Vue.use(Egrid);
Vue.use(uploader);
Vue.use(globalmixins);
Vue.use(globalFilters);

// 注册dmp模块
store.registerModule('dmp', dmpStore);

export default function (
  App,
  router,
  config,
  callback = noop,
  opt = {
    useEleUI: null,
  }
) {
  !!opt && !!opt.useEleUI ? opt.useEleUI(ElementUI) : Vue.use(ElementUI);
  wpBaseApi.checkWpLogin().done(({ data = {} }) => {
    const { appInfo, userId, accountType, wkbStatus, sellerAppInfoVOList } = data;
    let appFeatures = []; // 当前账户应用特征
    let curAppStatus = null; // 后台返回的店铺状态
    if (appInfo) {
      appFeatures = appInfo.appFeatures; // 获取当前账户应用特征
      curAppStatus = appInfo.status || null; // 获取后台返回的店铺状态\
    }

    // 更新当前应用程序特征
    store.commit('set_app_features', appFeatures);

    storeUser.methods.update_userInfo(data);
    store.commit('set_EpuserInfo', data);
    store.commit('setWkbStatus', wkbStatus);
    store.commit('setKlbStatus', 1);

    if (config && config.fetchTips) {
      store.dispatch('fetchTips');
    }
    store.dispatch('fetchStores', data);

    // 根据当前店铺状态判断是否跳转到功能订购页面
    if (
      config &&
      config.checkAppStatus && // 判断是否检查当前店铺状态
      curAppStatus && // 判断后台返回的店铺状态
      (curAppStatus === packageStatus.NORMAL_EXPIRED || // 套餐过期
        curAppStatus === packageStatus.TRY_EXPIRED) // 试用过期
    ) {
      // 跳转到功能订购页面
      window.location.href = '/system-setting.html#/function-buy';
      return;
    }

    if (
      !appInfo &&
      sellerAppInfoVOList &&
      sellerAppInfoVOList.length &&
      !~window.location.pathname.indexOf('enterprise.html')
    ) {
      // 多企业信息，则跳转至选择企业页
      window.top.location.href = '/enterprise.html';
    } else if (!store.state.curApp) {
      // 如果没有创建品牌信息，则跳转到品牌页面，进行创建品牌信息
      if (config && config.redirectToBrand) {
        window.top.location.href = '/brand.html';
      } else {
        typeof callback === 'function' && callback(data);
        new Vue({
          router,
          store,
          render: h => h(App),
        }).$mount('#app');
      }
    } else {
      /* //没有门店列表storeList，或者如果只有总店跳转至创建店铺，roleList.indexOf('common_role_enterprise') !== -1 为品牌账号登录，默认会在storeList数组首位增加一个总店
      if (
        !store.state.storeList ||
        (store.state.storeList.length <= 1 &&
          res.data.roleList &&
          res.data.roleList.indexOf('common_role_enterprise') !== -1)
      ) {
        if (config && config.redirectToBrand) {
          window.top.location.href = '/brand.html#/create/store?isAllow=1';
          return;
        }
      } */
      if (config && config.getUserTemplate) {
        wpBaseApi.getUserTemplate().then(response => {
          if (response.data && response.data.templateId) {
            store.commit('set_sellerTemplateId', response.data.id);
            store.commit('set_sellerId', response.data.sellerId);
          }
          typeof callback === 'function' && callback(data);
          new Vue({
            router,
            store,
            render: h => h(App),
          }).$mount('#app');
        });
      } else {
        typeof callback === 'function' && callback(data);
        new Vue({
          router,
          store,
          render: h => h(App),
        }).$mount('#app');
      }
    }
  });
}
