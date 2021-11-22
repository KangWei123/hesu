/**
 * 安装全局 mixin
 * 全局mixin 引入的属性和方法以 global 为前缀
 */
import businessTypeMixin from './mixins/business-type-mixin';
import autorelease from './mixins/auto-release';

/**
 * @type {Vue.PluginObject}
 */
export default {
  install(Vue) {
    Vue.mixin(businessTypeMixin);
    Vue.mixin(autorelease);
  },
};
