import '@/dss-common/style/base.less';
import '@/dss-common/style/wkt-base.less';

import App from './app.vue';
import router from './router';
import baseIndex from '@/business-common/base-index.js';

baseIndex(App, router, {
  redirectToBrand: true // 没有创建品牌信息时，是否需要重定向到品牌创建页面。true：需要，false：不需要
});
