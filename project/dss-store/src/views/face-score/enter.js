import Vue from 'vue';
import App from './app';
import filters from '@/dss-common/utils/filters';
import './css/main.less';

// 注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

new Vue({
  render: h => h(App)
}).$mount('#app');
