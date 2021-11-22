<template>
  <div>
    <PageHeader v-if="$route.query.orderType=='group'"><router-link style="color:#333" to><span @click="$router.back()">拼团列表</span></router-link>/拼团详情</PageHeader>
    <PageHeader v-if="$route.query.orderType=='seckill'"><router-link style="color:#333" to><span @click="$router.back()">秒杀列表</span></router-link>/秒杀详情</PageHeader>
    <div class="order-task-detail-container"
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
          订单编号: {{orderDetail ? orderDetail.orderNo : '-'}}
        </div>
        <div class="order-info-label">
          下单时间: {{computeOrderTime(orderDetail ? orderDetail.orderTime : null)}}
        </div>
        <div class="order-info-label">
          付款时间: {{computeOrderTime(orderDetail ? orderDetail.payTime : null)}}
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
            客户留言: {{orderDetail && orderDetail.userMessage ? orderDetail.userMessage : '-'}}
          </div>
          <div class="order-info-label">
            物流信息: {{computeShippingInfo}}
          </div>
          <div class="order-info-label"
              v-if="orderDetail && orderDetail.shippingNo">
            物流单号: {{orderDetail.shippingNo}}
          </div>
        </div>
        <div v-if="orderDetail && orderDetail.tourismOrderVO && orderDetail.itemType === mgrTypeEnum.hotel.value">
          <div class="order-info-label">
            预约入住: {{computeOrderTime(orderDetail ? orderDetail.tourismOrderVO.beginTime : null)}}
          </div>
          <div class="order-info-label">
            离店时间: {{computeOrderTime(orderDetail ? orderDetail.tourismOrderVO.endTime : null)}}
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
            v-if="orderDetail && orderDetail.itemList">
          <div class="order-content-title">商品信息</div>
          <div class="goods-info-content"
              v-for="(item, index) in orderDetail.itemList"
              :key="index">
            <div class="desc goods-info-desc">
              <img class="goods-image"
                  v-if="item.thumbnail"
                  :src='item.thumbnail' />
              <img class="goods-image"
                  v-else
                  :src='orderDetail.itemType===cardEnum.cardType.timesCard?timeCardBg:chargeCardBg' />

              <div class="goods-info-desc-content">
                <span>产品：{{item.itemName}}</span>
                <span v-if="item.itemAttribute">{{item.itemAttribute}}</span>
                <span>单价：￥{{item.salePrice |price}}
                  <span style="margin-left: 25px;display: inline-block;"
                        v-if="item.giftAmount">赠送金额：￥{{item.giftAmount|price}}
                  </span>
                </span>
              </div>
            </div>
            <div class="money out-box">
              <div class="inner-box">
                <!-- 叁拾加重量 -->
                <span v-if="item.itemWeight&&orderDetail.itemType!==orderStatusEnum.ORDER_TYPE.GIFT.value">{{item.itemWeight}}{{item.itemUnit}}</span>
                <span v-else>数量: {{item.itemCount}}</span>
                <!--小计: ￥{{item.salePrice * item.itemCount |price}}</span>-->
                <span>小计: ￥{{item.actualFee |price}}</span>
                <!-- <span v-if="handleOptionsHidden">运费: {{ item.logisticsFee | price}}</span> -->
                <template v-if="isRooms">
                  <el-button size="mine"
                            v-if="orderDetail.orderStatus === orderStatusEnum.HOTEL.STATUS.PAID.value"
                            type="primary"
                            class="table-btn"
                            @click="checkingIn(orderDetail.orderNo)">入住</el-button>
                  <span v-if="orderDetail.orderStatus === orderStatusEnum.HOTEL.STATUS.CHECK_IN.value">{{orderDetail.orderStatusDesc}}</span>
                </template>
              </div>
            </div>

            <!-- 优惠信息，拼团跟砍价的优惠信息用订单维度的参数，其他优惠信息用商品维度的参数 -->
            <div class="receipt out-box">
              <div class="inner-box">
                <!--参加加价购的商品需要根据tag值做判断-->
                <div class="span"
                    v-if="((1 << 15) & item.tag1) === (1 << 15)">加价购折扣：￥-{{(item.actualFee-item.payFee) | price}}</div>
                <div class="span"
                    v-if="orderDetail.groupLeaderPromFee || orderDetail.groupPromFee">拼团：￥-{{computeGroupPromFee(orderDetail) | price}}</div>
                <div class="span"
                    v-if="orderDetail.bargainPromFee">砍价：￥-{{orderDetail.bargainPromFee | price}}</div>
                <div class="span"
                    v-if="orderDetail.secKillPromFee">秒杀：￥-{{orderDetail.secKillPromFee | price}}</div>
                <div class="span"
                    v-if="orderDetail.integralPromFee">积分：￥-{{orderDetail.integralPromFee | price}}</div>
                <div class="span"
                    v-if="orderDetail.innerBuyPromFee">内购券：￥-{{orderDetail.innerBuyPromFee | price}}</div>
                <div class="span"
                    v-if="item.cardPromFee">卡项：￥-{{item.cardPromFee | price}}</div>
                <div class="span"
                    v-if="item.cashPromFee">现金：￥-{{item.cashPromFee | price}}</div>
                <div class="span"
                    v-if="item.couponPromFee">优惠券：￥-{{item.couponPromFee | price}}</div>
                <div class="span"
                    v-if="item.redPacketPromFee">红包：￥-{{item.redPacketPromFee | price}}</div>
                <div class="span"
                    v-if="item.userGiftCardPromFee">礼品卡：￥-{{item.userGiftCardPromFee | price}}</div>
                <div class="span"
                    v-if="item.memberPromFee">会员：￥-{{item.memberPromFee | price}}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 发货单 -->
        <div class="invoice-info"
            v-if="orderDetail && orderDetail.expressType === orderStatusEnum.express_type.express && orderLogisticsVOList.length > 0">
          <div class="order-content-title">发货单</div>
          <div class="invoice-content"
              v-for="(olvoItem, idx) in orderLogisticsVOList"
              :key="idx">
            <div class="invoice-goods-tab">
              <div class="logistics-goods-info">
                <div class="invoice-goods-info"
                    v-for="(item, index) in olvoItem.itemList"
                    :key="index">
                  <img class="goods-image"
                      :src='item.thumbnail' />

                  <div class="goods-info-desc">
                    <p>产品：{{item.itemName}}</p>
                    <p v-if="item.itemAttribute">{{item.itemAttribute}}</p>
                    <p>
                      <span class="salePrice"
                            v-if="item.salePrice">单价：￥{{item.salePrice |price}}</span>
                      <span class="itemCount">数量: {{item.count}}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="invoice-goods-tab"
                v-if="olvoItem.status === orderStatusEnum.LOGISTICS.STATUS.DELIVERING
                  || olvoItem.status === orderStatusEnum.LOGISTICS.STATUS.DELIVERED">
              <div class="logistics-info">
                <p>发货仓库：{{olvoItem && olvoItem.warehouseName ? olvoItem.warehouseName : '-'}}</p>
                <p v-if="olvoItem.outBoundNo">出库单号：{{olvoItem.outBoundNo}}</p>
                <p>物流信息：{{olvoItem && olvoItem.shippingCompany ? olvoItem.shippingCompany : '-'}} {{olvoItem && olvoItem.shippingNo ? olvoItem.shippingNo : '-'}}</p>
                <p>物流状态：
                  <span v-if="olvoItem && olvoItem.logisticsDTO">{{olvoItem.logisticsDTO.logisticsType}}</span>
                  <span v-else>{{olvoItem && olvoItem.statusDesc ? olvoItem.statusDesc : '-'}}</span>
                </p>
                <p>
                  <span>物流追踪：</span>
                  <span v-if="olvoItem&&olvoItem.logisticsDTO">{{olvoItem.logisticsDTO.context}}</span>
                  <span v-else>--</span>
                </p>
              </div>
            </div>
            <div class="invoice-goods-tab"
                v-if="olvoItem.status === orderStatusEnum.LOGISTICS.STATUS.TO_DELIVERY">
              <div class="btn-box">
                <!-- 第三方仓库不展示确认发货 -->
                <div v-if="!olvoItem.useWMSConfig">
                  <a class="table-href"
                    href="javascript:;"
                    @click="handleShowShippingDialog(olvoItem.outBoundNo)">确认发货</a>
                </div>

                <!-- 修改收货地址 -->
                <div v-if="showUpdateAddress">
                  <a class="table-href"
                    href="javascript:;"
                    @click="handleUpdateAddress">修改收货地址</a>
                </div>

                <span v-else>{{olvoItem.warehouseName}}：{{olvoItem.statusDesc}}</span>
                <div v-if="olvoItem.outBoundNo">出库单号：{{olvoItem.outBoundNo}}</div>
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
              <el-table-column label="交易流水">
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
                  <div v-else>{{scope.row.payChannel}}</div>
                </template>
              </el-table-column>

              <el-table-column label="售价(￥)">
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
                  -{{ scope.row.payChannel ? computePromFee(scope.row) : 0 |price}}
                </template>
              </el-table-column>

              <el-table-column label="实收金额(￥)">
                <template slot-scope="scope">
                  {{scope.row.payFee ?(scope.row.payFee) : 0 |price}}
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

      <!-- 修改收货地址dialog -->
      <el-dialog title="编辑收货信息"
                width="500px"
                class="update-address-dealog"
                v-loading="addressLoading"
                :visible.sync="addressDialogVisible">
        <el-form ref="addressForm"
                :model="addressForm"
                :rules="addressRules"
                label-width="100px">

          <el-form-item label="收件人姓名:"
                        prop="consignee">
            <el-input placeholder="请输入收件人姓名"
                      v-model.trim="addressForm.consignee"
                      class="address-info-input"
                      size="mini"></el-input>
          </el-form-item>

          <el-form-item label="联系电话:"
                        prop="consigneeMobile">
            <el-input placeholder="请输入联系电话"
                      v-model.trim="addressForm.consigneeMobile"
                      class="address-info-input"
                      size="mini"></el-input>
          </el-form-item>

          <el-form-item prop="area"
                        class="required"
                        label="收货地址:">
            <area-picker :area='addressForm.area'
                        @choose="handleChangeArea"></area-picker>
          </el-form-item>

          <el-form-item label="详细地址:"
                        prop="address">
            <el-input placeholder="请输入详细地址"
                      v-model.trim="addressForm.address"
                      class="address-info-input"
                      size="mini"></el-input>
            <div class="tips">注：客户详细收货地址，请准确填写</div>
          </el-form-item>

        </el-form>

        <div slot="footer">
          <el-button @click="addressDialogVisible = false">取 消</el-button>
          <el-button class="primary-white" type="primary"
                    @click="handleSaveAddress('addressForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import './index.less';
import utils from '@/dss-common/utils/index';
import api from '@/dss-wechat3rd/src/api/task-center.js';
import cardEnum from '../../constants/cardEnum';
import timeCardBg from '@/dss-wechat3rd/src/images/goods/time-card-bg.png';
import chargeCardBg from '@/dss-wechat3rd/src/images/goods/charge-card-bg.png';
import orderStatusEnum from '../../constants/orderStatusEnum';
import goodsTypeEnum from '../../constants/goodsTypeEnum';
import mgrTypeEnum from '../../constants/mgrTypeEnum';
import shippingDialog from '../shipping-dialog/shippingDialog';
import services from '@/dss-common/utils/services';
import areaPicker from '../area-picker/index';
import regexps from '@/dss-common/utils/regexps';
import PageHeader from '../page-header-tab/page-header';

export default {
  components: { shippingDialog, areaPicker, PageHeader },
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

      // 修改收货地址dialog参数
      addressLoading: false,
      addressDialogVisible: false,
      addressForm: {
        orderNo: null,
        consignee: null,
        consigneeMobile: null,
        area: [], // 选择的地址id集合，用于下拉组件选择
        areas: [], // 选择的地址详细信息集合，用于接口请求
        address: null
      },
      addressRules: {
        consignee: [
          { required: true, message: '请输入收件人姓名', trigger: ['blur', 'change'] },
          { max: 10, message: '最大长度10个字符', trigger: ['blur', 'change'] }
        ],
        consigneeMobile: [
          { required: true, message: '请输入联系电话', trigger: ['blur', 'change'] },
          { pattern: regexps.phone.reg, message: regexps.phone.msg, trigger: 'blur' }
        ],
        area: [{ required: true, message: '请选择收货地址', trigger: ['blur', 'change'] }],
        address: [
          { required: true, message: '请输入详细地址', trigger: ['blur', 'change'] },
          { max: 60, message: '最大长度60个字符', trigger: ['blur', 'change'] }
        ]
      }
    };
  },

  computed: {
    // 控制订单特殊项的显隐（客房、票务）
    handleOptionsHidden() {
      return !(this.goodsType === goodsTypeEnum.rooms.value || this.goodsType === goodsTypeEnum.ticket.value);
    },

    // 是否是客房类型
    isRooms() {
      return this.goodsType === goodsTypeEnum.rooms.value;
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

    // 计算拼团优惠
    computeGroupPromFee() {
      return function(orderDetail) {
        let price = 0;
        if (orderDetail.groupLeaderPromFee) {
          price = price + orderDetail.groupLeaderPromFee;
        }
        if (orderDetail.groupPromFee) {
          price = price + orderDetail.groupPromFee;
        }
        return price;
      };
    },

    // 计算抵扣金额
    computePromFee() {
      return function(item) {
        let price = 0;
        // 团长优惠
        if (item.groupLeaderPromFee) {
          price = price + item.groupLeaderPromFee;
        }
        // 拼团优惠
        if (item.groupPromFee) {
          price = price + item.groupPromFee;
        }
        // 卡项
        if (item.cardPromFee) {
          price = price + item.cardPromFee;
        }
        // 现金
        if (item.cashPromFee) {
          price = price + item.cashPromFee;
        }
        // 优惠券
        if (item.couponPromFee) {
          price = price + item.couponPromFee;
        }
        // 红包
        if (item.redPacketPromFee) {
          price = price + item.redPacketPromFee;
        }
        // 礼品卡
        if (item.userGiftCardPromFee) {
          price = price + item.userGiftCardPromFee;
        }
        // 砍价
        if (item.bargainPromFee) {
          price = price + item.bargainPromFee;
        }
        // 会员
        if (item.memberPromFee) {
          price = price + item.memberPromFee;
        }
        // 秒杀
        if (item.secKillPromFee) {
          price = price + item.secKillPromFee;
        }
        // 积分
        if (item.integralPromFee) {
          price = price + item.integralPromFee;
        }
        // 内购券
        if (item.innerBuyPromFee) {
          price = price + item.innerBuyPromFee;
        }
        // 加价换购
        if (item.repurchasePromFee) {
          price = price + item.repurchasePromFee;
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
    },

    // 判断是否显示修改收货地址按钮
    showUpdateAddress() {
      if (
        (this.orderDetail.orderStatus === orderStatusEnum.ORDER.STATUS.PAID.value || // 已支付
          this.orderDetail.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value) && // 待发货
        this.orderDetail.expressType === orderStatusEnum.express_type.express // 快递类型
      ) {
        return true;
      }
      return false;
    }
  },

  mounted() {
    if (!!this.$route.query.itemType) {
      this.goodsType = Number(this.$route.query.itemType);
    }
    this.getOrderDetail(); //获取订单详情
  },
  filters: {
    price(value, scale = 100) {
      return value ? (value / scale).toFixed(2) : '0.00';
    },
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
      api
        .getOrderDetail({ orderNo: this.orderNo })
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

    // 查询发货单信息
    queryLogistics() {
      const params = {
        orderNo: this.orderNo
      };
      api
        .getQueryLogistics(params)
        .then(res => {
          this.orderLogisticsVOList = res.data || [];
          this.orderLogisticsVOList.forEach((item, index) => {
            if (item.shippingNo && item.shippingCode) {
              this.logisticsMessage(item, index);
            }
          });
        })
        .always(() => {
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
      api
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

    /**
     * 点击修改收货地址
     */
    handleUpdateAddress(item) {
      // 赋值修改地址的订单号
      this.addressForm.orderNo = this.orderDetail.orderNo ? this.orderDetail.orderNo : null;
      this.addressDialogVisible = true; // 显示修改收货地址dialog
    },

    /**
     * 完成收件人地址选择
     */
    handleChangeArea(areas, area) {
      this.addressForm.areas = areas; // 地址区域详细信息赋值
      this.addressForm.area = area; // 地址区域id赋值
    },

    /**
     * 确定修改收件人地址
     */
    handleSaveAddress(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }

        let params = {
          ...this.addressForm
        };

        // 选择的省市区赋值
        if (params.areas && params.areas.length > 0) {
          const province = params.areas[0];
          const city = params.areas[1];
          const district = params.areas[2];

          if (province) {
            params.provinceId = province.id;
            params.province = province.name;
          }
          if (city) {
            params.cityId = city.id;
            params.city = city.name;
          }
          if (district) {
            params.districtId = district.id;
            params.district = district.name;
          }
        }
        delete params.area;
        delete params.areas;

        this.loading = true;
        api
          .updateAdress(params)
          .done(res => {
            this.$message.success('修改收货地址成功');
            this.addressDialogVisible = false; // 隐藏修改收货地址dialog
          })
          .always(() => {
            this.loading = false;
          });
      });
    },

    // 客房入住
    checkingIn(itemNo) {
      console.log(itemNo);
      let params = { orderNo: itemNo };
      this.loading = true;
      api
        .updateAdress(params)
        .done(res => {
          this.getOrderDetail();
        })
        .always(() => {
          this.loading = false;
        });
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
