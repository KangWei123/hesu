'use strict';

import App from './app';
import router from './router';
import baseIndex from '@/business-common/base-index.js';
import '@/dss-common/style/custom.css';

baseIndex(App, router, {
  redirectToBrand: true, // 没有创建品牌信息时，是否需要重定向到品牌创建页面。true：需要，false：不需要
  checkAppStatus: true, // 是否检查当前店铺状态，判断是否需要跳转到功能订购页面。true：检查，false：不检查
});
