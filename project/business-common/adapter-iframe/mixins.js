/**
 * Created by admin on 2019/6/26.
 * @author lemon<李亦黎>
 */
import config from './config';
export default {
  data() {
    return {
      adapterIfrNoGap: config.adapterIfrNoGap,
      adapterIfrHideTop: config.adapterIfrHideTop,
      adapterIfrMenu: config.adapterIfrMenu
    };
  },
  methods: {
    adapterIfmMask(visible) {
      config.notifyIfmParent('notifyIfmMask', !!visible);
    },
    adapterApp() {
      //增加页面跳转
      this.$router.__proto__.switchPage = function(path, otherPage = '') {
        console.log('switchPage', path, otherPage);
        if (config.adapterIfrNoGap) {
          //父页面跳转
          config.notifyIfmParent('urlchange', otherPage ? otherPage : location.origin + location.pathname + '#' + path);
        } else {
          window.location.href = otherPage
            ? otherPage
            : location.origin + location.pathname + location.search + '#' + path;
        }
      };
    }
  }
};
