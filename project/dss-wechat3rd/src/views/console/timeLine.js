import storeConst from '@/business-common/constants/packageEnum.js';
const status = storeConst.PACKAGE_STATUS;
export default {
  // 套餐可用期描述
  getPackageValidTimeDesc(curApp) {
    return curApp && curApp.status === status.VALID ? '有效期' : '试用期';
  },
  // 是否过期
  isExpire(curApp) {
    if (!curApp) {
      return false;
    }
    return curApp.expireDay <= 0;
  },
  //15天内标示即将 过期
  isNearExpire(curApp) {
    if (!curApp) {
      return false;
    }
    return curApp.expireDay <= types.NEAR_TIME_LINE_DAY && curApp.expireDay > 0;
  },
  //是否试用中
  isTrying(curApp) {
    return !!curApp && curApp.status === status.TRY;
  },
  // 是否连锁版
  isChain(curApp) {
    return !!curApp /* && curApp.packageType === types.CHAIN_STORE*/;
  },
  /*有效期是否失效了30天*/
  isExpire30Day(curApp) {
    if (!curApp) {
      return false;
    }
    return curApp.expireDay <= -30;
  }
};
