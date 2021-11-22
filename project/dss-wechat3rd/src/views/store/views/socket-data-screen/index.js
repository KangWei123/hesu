import Vue from 'vue';
import App from './app';
import filters from '@/dss-common/utils/filters';
import './css/main.less';
import VuePlain from '@/dss-common/vue-plugins/vue-plain';
// 注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.use(VuePlain);
new Vue({
  render: h => h(App)
}).$mount('#app');
