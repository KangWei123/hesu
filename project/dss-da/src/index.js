'use strict';
import 'promise-polyfill/src/polyfill';
import '@/dss-common/lib/babel-browser-polyfill/browser-polyfill.min';
import '@/dss-common/style/base.css';
import '@/dss-common/style/anim.css';
import '@/dss-common/partial/key-header/console.css';
import '@/dss-common/partial/key-footer/tpl.less';
import '@/dss-common/style/base.less';
import '@/dss-common/style/custom.css';
import '@/dss-common/style/icon2.css';
import 'echarts/map/js/china.js';
import './style/da-base.less';

import App from './app.vue';
import router from './router';
import baseIndex from '@/business-common/base-index.js';

baseIndex(App, router, {
  redirectToBrand: true, // 没有创建品牌信息时，是否需要重定向到品牌创建页面。true：需要，false：不需要
  checkAppStatus: true, // 是否检查当前店铺状态，判断是否需要跳转到功能订购页面。true：检查，false：不检查
});
