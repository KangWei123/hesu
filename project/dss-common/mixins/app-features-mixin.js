/**
 * dialog mixins
 * 添加一个变量，控制展示和显示dialog
 * 使用方式可参考dss-wechat3rd/src/views/order/preview-order-dialog
 */
import { mapState } from 'vuex';
import appFeaturesEnum from '@/dss-wechat3rd/src/constants/appFeaturesEnum.js';

export default {
  computed: {
    ...mapState({
      appFeatures: 'appFeatures'
    }),
    isXiCha() {
      return appFeaturesEnum.isXiCha(this.appFeatures);
    },
    isByx() {
      return appFeaturesEnum.isByx(this.appFeatures);
    },
    isZhongJun() {
      return appFeaturesEnum.isZhongJun(this.appFeatures);
    },
    isKaisa() {
      return appFeaturesEnum.isJzy(this.appFeatures);
    }
  }
};
