/**
 * Created by love on 18/10/20.
 * @author trumpli<李志伟>
 */
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import api from '@/dss-wechat3rd/src/api';
import couponApi from '@/dss-wechat3rd/src/api/coupon';
import memberAPI from '@/dss-wechat3rd/src/api/memberAPI';
import payApi from '@/dss-wechat3rd/src/api/pay';
import orderApi from '@/dss-wechat3rd/src/api/order';
import saeApi from '@/dss-wechat3rd/src/api/scheduledAndEmployeeMgr';

import Data from './data';
export default {
  /**
   * 标记预约已完成
   * @param orderNo
   * @returns {*}
   */
  apiCompleteScheduled(orderNo) {
    return saeApi.completeScheduled({ orderNoStr: orderNo });
  },
  /**
   * 查询优惠券&次数卡
   * @returns {*}
   */
  apiQueryCoupons() {
    return couponApi.queryUserCoupons({
      orderRequestItemDTOS: this.productsToOrderRequestItemDTOS(Data.chosenProducts),
      userId: Data.vip.id
    });
  },

  /**
   * 获取会员信息通过用户id
   * @param userId
   * @returns {*}
   */
  apiQueryUserDetailByUserId(userId) {
    return memberAPI.detail({ userId: userId });
  },

  /**
   * 获取会员信息通过关键字搜索
   * @param keyword
   * @returns {*}
   */
  apiQueryUsersByKeyWord(keyword) {
    return memberAPI.query({ keyword: keyword });
  },

  /**
   * 调用扫码枪支付
   * @param orderNo
   * @param authCode
   * @returns {*}
   */
  apiMicroPay(orderNo, authCode) {
    return payApi.microPay({ orderNo: orderNo, authCode: authCode });
  },

  /**
   * 按订单id 查询 扫描枪的 订单支付结果
   * @param orderNo
   * @returns {*}
   */
  apiQueryMicroPayResultByOrderNo(orderNo) {
    return payApi.queryOrder({ orderNo: orderNo });
  },

  /**
   * 撤销 扫码枪 唤起得支付订单
   * @param orderNo
   * @returns {*}
   */
  apiReverseMicroPayOrderByOrderNo(orderNo) {
    return payApi.reverseOrder({ orderNo: orderNo });
  },

  /**
   * 门店商品详情
   * @param params
   */
  apiGetStoreItemDetail(params) {
    return services.get(constants.Api.store.itemDetail, {
      params: params,
      action: '门店商品详情'
    });
  },

  /**
   * 获取订单详情
   * @param orderNo
   * @returns {*}
   */
  apiGetOrderDetailByOrderNo(orderNo) {
    return orderApi.getOrderDetail({ orderNo: orderNo });
  },
  /**
   * 根据条形码查询商品
   * @param barcode
   * @returns {*}
   */
  apiGetItemDetailByBarCode(barcode) {
    return api.itemDetailByBarCode({ barcode: barcode });
  },

  //非重复产品列表 ，转化成 后台的请求参数列表
  productsToOrderRequestItemDTOS(list) {
    const map = {};
    list.forEach(item => {
      let id = item.skuId || item.itemNo;
      //重复
      if (map.hasOwnProperty(id)) {
        map[id].itemCount += 1;
      } else {
        map[id] = {
          itemCount: 1,
          itemNo: item.itemNo,
          itemType: item.type,
          skuId: item.skuId
        };
      }
    });
    const result = [];
    for (let key in map) {
      result.push(map[key]);
    }
    return result;
  },
  //订单结果
  buildOrderInfo(data) {
    return {
      payFee: data.payFee, //应付款
      orderNo: data.orderNo, //订单id
      itemType: data.itemType, //商品类型
      userId: data.userId
    };
  }
};
