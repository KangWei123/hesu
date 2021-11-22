export default {
  isXiCha(appFeatures) {
    // return true;
    return appFeatures && appFeatures.indexOf('xiCha') !== -1;
  },
  isByx(appFeatures) {
    // return true;
    return appFeatures && appFeatures.indexOf('byx') !== -1;
  },
  isZhongJun(appFeatures) {
    return appFeatures && appFeatures.indexOf('zhongjun') !== -1;
  },
  // 判断是否佳兆业账号
  isJzy(appFeatures) {
    return appFeatures && appFeatures.indexOf('kaisa') !== -1;
  }
};
