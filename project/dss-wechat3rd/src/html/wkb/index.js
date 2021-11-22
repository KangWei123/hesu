import '@/dss-wechat3rd/src/partial/base.css';
import '@/dss-wechat3rd/src/partial/index.less';
import '@/dss-wechat3rd/src/style/base.less';
import '@/dss-common/style/wkt-base.less';
import 'wkb-common-ui/packages/theme-chalk/src/index.less'; // 引入wkb-common-ui中的自定义样式

import Vue from 'vue';
//提前引入，规避（dss-common/utils/expromise.js提前覆盖Promise报错）
import baseIndex from '@/business-common/base-index.js';
import baseComponents from '@/dss-wechat3rd/src/decorate_components/vue';
import App from '../../app';
import router from '../../router';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
import uploader from 'vue-simple-uploader';

import featureIf from '@/dss-wechat3rd/src/constants/featureIf';

Vue.use(uploader);
Vue.use(baseComponents);

baseIndex(
  App,
  router,
  {
    getUserTemplate: true, //是否获取用户模板id，wkb需要
    redirectToBrand: true, // 没有创建品牌信息时，是否需要重定向到品牌创建页面。true：需要，false：不需要
    checkAppStatus: true // 是否检查当前店铺状态，判断是否需要跳转到功能订购页面。true：检查，false：不检查
  },
  data => {
    featureIf.config(data.appInfo || {}); //获取features
  },
  {
    useEleUI: AdapterIfr.AdapterWatchEleUI
  }
);
