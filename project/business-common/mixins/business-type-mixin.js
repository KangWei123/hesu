import { mapState } from 'vuex';
import { industryEnum } from '@/business-common/constants';

export default {
  computed: {
    ...mapState({
      curApp: 'curApp',
    }),
    globalAppId() {
      return this.curApp.id;
    },
    globalAppName() {
      return this.curApp.appName;
    },
    globalEpId() {
      return this.curApp.epId;
    },
    globalEpName() {
      return this.curApp.epName;
    },
    // 判断是否属于集团
    globalIsUmpPlatformApp() {
      return this.curApp.industryKey === industryEnum.cateringPlatform.key;
    },
  },
};
