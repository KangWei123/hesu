<template>
  <div class="micro-order-detail-container"
       v-loading="loading"
       v-if="orderNo">
    <div class="order-info">
      <div class="order-info-label">
        <span>{{orderDetail ? orderDetail.orderStatusDesc : '-'}}</span>
        <div class="pre-sell"
             v-if="orderDetail && orderDetail.preSell">
          <span class="order-type">预售订单</span>
          <span class="remain-time"
                v-if="orderDetail.pushWMS && orderDetail.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value">
            已推单发货
          </span>
          <template v-else-if="!orderDetail.pushWMS && (orderDetail.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_PAY.value || orderDetail.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value)">
            <span class="delivery-time"
                  v-if="orderDetail.expectShippingDate">发货时间：{{orderDetail.expectShippingDate}}</span>
            <span class="remain-time">剩余：{{computeRemainTime(remainTime ? remainTime : 0)}} </span>
          </template>
        </div>
      </div>
      <div class="order-info-label">
        订单编号: {{orderDetail ? orderDetail.customizeOrderNo : '-'}}
      </div>
      <div class="order-info-label">
        下单时间: {{computeOrderTime(orderDetail ? orderDetail.createTime : null)}}
      </div>
      <div class="order-info-label">
        付款时间: {{computeOrderTime(orderDetail ? orderDetail.orderInfo && orderDetail.orderInfo.payTime : null)}}
      </div>
      <div class="order-info-label"
           v-if="orderDetail&&orderDetail.shippingTime ">
        发货时间: {{computeOrderTime(orderDetail ? orderDetail.shippingTime : null)}}
      </div>
      <div class="order-info-label"
           v-if="orderDetail&&orderDetail.completeTime ">
        完成时间: {{computeOrderTime(orderDetail ? orderDetail.completeTime : null)}}
      </div>
      <div class="order-info-address"
           v-if="orderDetail && orderDetail.consignee&&orderDetail && orderDetail.detailAddress">
        <div class="order-info-label">
          收货人: {{orderDetail && orderDetail.consignee ? orderDetail.consignee : '-'}}
        </div>
        <div class="order-info-label">
          收货地址: {{orderDetail && orderDetail.detailAddress ? orderDetail.detailAddress : '-'}}
        </div>
        <div class="order-info-label">
          客户留言: {{orderDetail && orderDetail.orderMessage ? orderDetail.orderMessage : '-'}}
        </div>
        <div class="order-info-label">
          物流信息: {{computeShippingInfo}}
        </div>
        <div class="order-info-label"
             v-if="orderDetail && orderDetail.shippingNo">
          物流单号: {{orderDetail.shippingNo}}
        </div>
      </div>
      <div class="order-info-label"
           v-if="orderDetail && orderDetail.tourismOrderVO && orderDetail.itemType === mgrTypeEnum.ticket.value">
        有效期:
        <template v-if="orderDetail.tourismOrderVO.ticketType === mgrTypeEnum.ticket.oddDay.value">
          {{ orderDetail.tourismOrderVO.endTime |getData(-1) }}
        </template>
        <template v-else>
          {{ orderDetail.tourismOrderVO.beginTime |time('YYYY-MM-DD') }} - {{ orderDetail.tourismOrderVO.endTime |time('YYYY-MM-DD') }}
        </template>
      </div>
      <div>
        商家备注: {{orderDetail && orderDetail.sellerMessage ? orderDetail.sellerMessage : '-'}}
      </div>
      <div v-if="orderDetail && orderDetail.examineDetail" style="margin-top:10px">
        拒绝理由: {{orderDetail.examineDetail||'--'}}
      </div>
      <div class="order-info-user"
           v-if="orderDetail && orderDetail.tourismOrderVO">
        <div class="order-info-label">
          联系人：{{orderDetail && orderDetail.tourismOrderVO.name ? orderDetail.tourismOrderVO.name : '-'}}
        </div>
        <div class="order-info-label">
          电话：{{orderDetail && orderDetail.tourismOrderVO.phone ? orderDetail.tourismOrderVO.phone : '-'}}
        </div>
        <div class="order-info-label">
          证件号码：{{orderDetail && orderDetail.tourismOrderVO.iDCard ? orderDetail.tourismOrderVO.iDCard : '-'}}
        </div>
      </div>
    </div>

    <div class="order-content">
      <!-- 会员信息 -->
      <div class="member-info">
        <div class="order-content-title">会员信息</div>
        <div class="member-content">
          <img :src="orderDetail &&orderDetail.userWxAvstar"
               class="icon" />
          <span style="margin-left: 18px">
            昵称: {{orderDetail && orderDetail.userWxNickName ? orderDetail.userWxNickName : '-'}}
          </span>
          <span style="margin-left: 60px">
            会员姓名: {{orderDetail && orderDetail.realName ? orderDetail.realName : '-'}}
          </span>
          <span style="margin-left: 60px">
            联系电话: {{orderDetail && orderDetail.userMobile ? orderDetail.userMobile : '-'}}
          </span>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="goods-info"
           v-if="orderDetail">
        <div class="order-content-title">商品信息</div>
        <div class="goods-info-content">
          <div style="display:flex;flex:4;">
            <span>产品照片：</span>
            <div v-if="orderDetail.pic1"
                 style="display:flex;">
              <div v-for="(item,index) in imgList"
                   :key="index"
                   @click="handleSelect(orderDetail['pic' + item.id])">
                <img class="goods-image"
                     v-if="orderDetail['pic' + item.id]"
                     :src="orderDetail['pic' + item.id]" />
              </div>
            </div>
            <span v-else>-</span>
          </div>
          <div class="desc goods-info-desc">
            <div class="goods-info-desc-content">
              <span>商品名称：{{orderDetail.itemName}}</span>
              <span v-if="orderDetail.itemAttribute">{{item.itemAttribute}}</span>
              <span>单价：￥{{orderDetail.fee |price}}
                <span style="margin-left: 25px;display: inline-block;"
                      v-if="orderDetail.giftAmount">赠送金额：￥{{orderDetail.giftAmount|price}}
                </span>
              </span>
              <span>厂家：{{orderDetail.manufacturerName || '-'}}</span>
              <span>补充说明：{{orderDetail.submitExamineMsg || '-'}}</span>
            </div>
          </div>
          <div class="money out-box">
            <div class="inner-box">
              <span>数量: {{orderDetail.num}}</span>
              <!--小计: ￥{{item.salePrice * item.itemCount |price}}</span>-->
              <span>小计: ￥{{orderDetail.actualFee |price}}</span>
              <span v-if="handleOptionsHidden">运费: {{ orderDetail.logisticsFee | price}}</span>
            </div>
          </div>

          <!-- 优惠信息，拼团跟砍价的优惠信息用订单维度的参数，其他优惠信息用商品维度的参数 -->
          <div class="receipt out-box"
               v-if="orderDetail.orderInfo">
            <div class="inner-box">
              <div class="span"
                   v-if="orderDetail.orderInfo.cardPromFee">卡项：￥-{{orderDetail.orderInfo.cardPromFee | price}}</div>
              <div class="span"
                   v-if="orderDetail.orderInfo.cashPromFee">现金：￥-{{orderDetail.orderInfo.cashPromFee | price}}</div>
              <div class="span"
                   v-if="orderDetail.orderInfo.couponPromFee">优惠券：￥-{{orderDetail.orderInfo.couponPromFee | price}}</div>
              <div class="span"
                   v-if="orderDetail.orderInfo.logisticsCouponPromFee">运费券：￥-{{orderDetail.orderInfo.logisticsCouponPromFee | price}}</div>
              <div class="span"
                   v-if="orderDetail.orderInfo.redPacketPromFee">红包：￥-{{orderDetail.orderInfo.redPacketPromFee | price}}</div>
              <div class="span"
                   v-if="orderDetail.orderInfo.userGiftCardPromFee">礼品卡：￥-{{orderDetail.orderInfo.userGiftCardPromFee | price}}</div>
              <div class="span"
                   v-if="orderDetail.orderInfo.memberPromFee">会员：￥-{{orderDetail.orderInfo.memberPromFee | price}}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 流水信息 -->
      <div class="waterBill-info">
        <div class="order-content-title">流水信息</div>
        <div class="waterBill-content">
          <el-table :data="waterList"
                    class="wkt-table">
            <el-table-column width="180"
                             label="交易流水">
              <template slot-scope="scope">
                {{scope.row.waterBillNo ? scope.row.waterBillNo : '-'}}
              </template>
            </el-table-column>

            <el-table-column label="付款详情">
              <template slot-scope="scope">
                <div v-if="scope.row.orderPayChannelDTO">
                  <div v-if="scope.row.orderPayChannelDTO.wxPayFee">微信支付：￥{{scope.row.orderPayChannelDTO.wxPayFee | price}}</div>
                  <div v-if="scope.row.orderPayChannelDTO.aLiPayFee">支付宝支付：￥{{scope.row.orderPayChannelDTO.aLiPayFee | price}}</div>
                  <div v-if="scope.row.orderPayChannelDTO.accountPayFee">余额支付：￥{{scope.row.orderPayChannelDTO.accountPayFee | price}}</div>
                  <div v-if="scope.row.orderPayChannelDTO.cashPayFee">现金支付：￥{{scope.row.orderPayChannelDTO.cashPayFee | price}}</div>
                  <div v-if="scope.row.orderPayChannelDTO.unionPayFee">银联支付：￥{{scope.row.orderPayChannelDTO.unionPayFee | price}}</div>
                  <div v-if="scope.row.orderPayChannelDTO.otherAppPayFee">第三方渠道支付：￥{{scope.row.orderPayChannelDTO.otherAppPayFee | price}}</div>
                </div>
                <div v-else>{{scope.row.payChannelDesc}}</div>
              </template>
            </el-table-column>

            <el-table-column label="合计(￥)">
              <template slot-scope="scope">
                {{scope.row.actualFee ? scope.row.actualFee : 0 |price}}
              </template>
            </el-table-column>

            <el-table-column label="运费(￥)"
                             v-if="handleOptionsHidden">
              <template slot-scope="scope">
                {{scope.row.logisticsFee ? scope.row.logisticsFee : 0 |price}}
              </template>
            </el-table-column>

            <el-table-column label="抵扣(￥)">
              <template slot-scope="scope">
                -{{ scope.row.orderInfo && scope.row.orderInfo.payChannel ? computePromFee(scope.row) : 0 |price}}
              </template>
            </el-table-column>

            <el-table-column label="实收金额(￥)">
              <template slot-scope="scope">
                {{scope.row.orderInfo && scope.row.orderInfo.payFee |price}}
              </template>
            </el-table-column>

            <el-table-column label="外部订单号">
              <template slot-scope="scope">
                {{scope.row.outTransactionId ? scope.row.outTransactionId : '-'}}
              </template>
            </el-table-column>

          </el-table>

        </div>
      </div>
    </div>

    <!--发货dialog-->
    <shipping-dialog :orderNo="shippingOrderNo"
                     :outBoundNo="outBoundNo"
                     v-if="shippingActive"
                     @cancel="handleShippingCancel"
                     @done="handleShippingDone" />

    <!-- 图片预览 -->
    <img-preview :imgUrl="imgUrl"
                 :showPreview="showPreview"
                 @handleClose="handleClose" />
  </div>
</template>

<script>
import './index.less';
import utils from '@/dss-common/utils';
import orderApi from '@/dss-wechat3rd/src/api/micro-order.js';
import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';
import timeCardBg from '@/dss-wechat3rd/src/images/goods/time-card-bg.png';
import chargeCardBg from '@/dss-wechat3rd/src/images/goods/charge-bg.png';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum.js';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum';
import shippingDialog from '@/dss-wechat3rd/src/bz_components/shipping-dialog/index.vue';
import imgPreview from '@/dss-wechat3rd/src/components/img-preview/index.vue';

import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
export default {
  components: { shippingDialog, imgPreview },
  data() {
    return {
      goodsType: 1,
      mgrTypeEnum,
      goodsTypeEnum,
      orderNo: this.$route.query.orderNo,
      orderStatusEnum,

      loading: false,

      orderDetail: null, // 订单详情
      cardEnum, // 卡项类型
      timeCardBg, // 次数卡背景图片
      chargeCardBg, // 充值卡背景图片

      remainTime: null, // 倒数时间
      remainTimeInterval: null, //倒数定时器

      orderLogisticsVOList: [], //发货单信息

      // 确认发货
      shippingActive: false,
      shippingOrderNo: '', // 确认发货订单
      outBoundNo: '', // 出库单号
      imgList: [{ id: 1 }, { id: 2 }, { id: 3 }],
      imgUrl: '',
      showPreview: false
    };
  },

  computed: {
    // 控制订单特殊项的显隐（客房、票务）
    handleOptionsHidden() {
      return !(this.goodsType === goodsTypeEnum.rooms.value || this.goodsType === goodsTypeEnum.ticket.value);
    },

    // 计算订单时间
    computeOrderTime() {
      return function(time) {
        if (time) {
          return utils.timeFormat(new Date(time));
        }
        return '-';
      };
    },

    waterList() {
      let list = [];
      if (this.orderDetail) {
        list.push(this.orderDetail);
      }
      return list;
    },

    // 计算抵扣金额
    computePromFee() {
      return function(item) {
        let price = 0;
        // 卡项
        if (item.orderInfo.cardPromFee) {
          price = price + item.orderInfo.cardPromFee;
        }
        // 现金
        if (item.orderInfo.cashPromFee) {
          price = price + item.orderInfo.cashPromFee;
        }
        // 优惠券
        if (item.orderInfo.couponPromFee) {
          price = price + item.orderInfo.couponPromFee;
        }
        // 运费券
        if (item.orderInfo.logisticsCouponPromFee) {
          price = price + item.orderInfo.logisticsCouponPromFee;
        }
        // 红包
        if (item.orderInfo.redPacketPromFee) {
          price = price + item.orderInfo.redPacketPromFee;
        }
        // 礼品卡
        if (item.orderInfo.userGiftCardPromFee) {
          price = price + item.orderInfo.userGiftCardPromFee;
        }
        // 会员
        if (item.orderInfo.memberPromFee) {
          price = price + item.orderInfo.memberPromFee;
        }
        return price;
      };
    },

    // 计算物流信息
    computeShippingInfo() {
      if (!this.orderDetail) {
        return '无需物流';
      } else {
        if (this.orderDetail.shippingType === orderStatusEnum.SHIPPING_TYPE.NO_NEED) {
          return '无需物流';
        } else {
          return this.orderDetail.shippingCompany || '-';
        }
      }
    },

    // 预售剩余时间格式转化
    computeRemainTime() {
      return rTime => {
        if (!!rTime) {
          const day = parseInt(rTime / (24 * 3600));

          const hourS = rTime % (24 * 3600);
          const hourInt = parseInt(hourS / 3600);
          const hour = hourInt < 10 ? '0' + hourInt : hourInt;

          const minuteS = hourS % 3600;
          const minuteInt = parseInt(minuteS / 60);
          const minute = minuteInt < 10 ? '0' + minuteInt : minuteInt;

          const second = minuteS % 60 < 10 ? '0' + (minuteS % 60) : minuteS % 60;

          return `${day}天${hour}:${minute}:${second}`;
        } else {
          return '已到期';
        }
      };
    }
  },

  mounted() {
    if (!!this.$route.query.itemType) {
      this.goodsType = Number(this.$route.query.itemType);
    }
    this.getOrderDetail(); //获取订单详情
  },
  filters: {
    getData(val, count) {
      let dd = new Date();
      if (val) {
        dd = new Date(val);
      }
      dd.setDate(dd.getDate() + count);
      let y = dd.getFullYear();
      let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
      let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
      return y + '-' + m + '-' + d;
    }
  },

  methods: {
    //获取订单详情
    getOrderDetail() {
      this.loading = true;
      orderApi
        .orderDetail({ customizeOrderNo: this.orderNo })
        .then(res => {
          this.orderDetail = res.data;

          // 预售剩余时间倒计时
          this.remainTime = this.orderDetail.countdown ? this.orderDetail.countdown : 0;
          this.remainTimeInterval = setInterval(() => {
            if (!!this.remainTime && this.remainTime > 0) {
              this.remainTime--;
            } else {
              this.remainTime = 0; //若无剩余时间，则默认设置为已到期
              clearInterval(this.remainTimeInterval); // 清空定时器
            }
          }, 1000);

          this.queryLogistics(); //查询发货单信息
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 查询物流信息
    logisticsMessage(logistics, index) {
      const params = {
        com: logistics.shippingCode,
        deliveryId: logistics.deliveryId,
        waybillId: logistics.shippingNo,
        resultv2: 1
      };
      orderApi
        .getLogistics(params)
        .then(res => {
          if (res.data && res.data.data) {
            let list = res.data.data || [];
            logistics = Object.assign(logistics, { logisticsDTO: list[0] });
            this.$set(this.orderLogisticsVOList, index, logistics);
          }
        })
        .always(() => {
          this.loading = false;
        });
    },

    // 出现确认发货弹框
    handleShowShippingDialog(outBoundNo) {
      this.shippingActive = true;
      this.shippingOrderNo = this.orderDetail.orderNo;
      this.outBoundNo = outBoundNo;
    },

    // 取消确认发货弹框
    handleShippingCancel() {
      this.shippingActive = false;
    },

    // 确认发货完成
    handleShippingDone() {
      this.shippingActive = false;
      this.getOrderDetail(); //获取订单详情
    },
    handleSelect(url) {
      this.showPreview = true;
      this.imgUrl = url;
    },
    handleClose() {
      this.showPreview = false;
    }
  },

  destroyed() {
    if (!!this.remainTimeInterval) {
      clearInterval(this.remainTimeInterval); // 清空定时器
    }
  }
};
</script>

<style scoped>
</style>
