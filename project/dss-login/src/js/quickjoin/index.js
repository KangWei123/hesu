'use strict';

import 'promise-polyfill/src/polyfill';
import 'wkb-common-ui/packages/theme-chalk/src/index.less'; // 引入wkb-common-ui中的自定义样式
import '@/dss-common/partial/key-header/tpl.less';
import '@/dss-common/partial/key-footer/tpl.less';
// import 'element-ui/lib/theme-chalk/index.css';

import Vue from 'vue';
import register from './register';
import ElementUI from 'element-ui';
import mediaInquiry from '../mediaInquiry.js';
import WkbUI from 'wkb-common-ui';
window.Promise = Promise;

// js方法的媒体查询
mediaInquiry.mediaInquiry();
Vue.use(ElementUI);
Vue.use(WkbUI);

new Vue({
  render: h => h(register),
}).$mount('#join-div');
