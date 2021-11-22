import floatNum from '@/dss-common/utils/float-num.js';
/**
 * 钱的处理
 */

export default {
  /**
   * 页面和服务端，汇率为100的 互相转换
   * @param money
   * @param isFromServer
   */
  convertHundredMoneyUnit(mony, isFromServer) {
    if (isFromServer) {
      return !!mony ? mony / 100 : 0;
    }
    return !!mony ? floatNum.floatMul(mony, 100) : 0;
  }
};
