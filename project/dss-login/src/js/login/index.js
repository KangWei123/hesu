'use strict';
import 'promise-polyfill/src/polyfill';
import 'wkb-common-ui/packages/theme-chalk/src/index.less'; // 引入wkb-common-ui中的自定义样式
import '@/dss-common/partial/key-header/tpl.less';
import '@/dss-common/partial/key-footer/tpl.less';
// import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import ElementUI from 'element-ui';
import login from './login.vue';
import mediaInquiry from '../mediaInquiry';
import WkbUI from 'wkb-common-ui';

import 'wkb-common-ui/style';
import wpBaseApi from '@/business-common/wp-base-api';

window.Promise = Promise;

Vue.use(ElementUI);
Vue.use(WkbUI);

// js方法的媒体查询
mediaInquiry.mediaInquiry();

function gotoHome() {
  window.top.location.href = '/wkb.html';
}

wpBaseApi.checkWpLogin(false).done(res => {
  gotoHome();
});

new Vue({
  render: h => h(login),
}).$mount('#login-div');
