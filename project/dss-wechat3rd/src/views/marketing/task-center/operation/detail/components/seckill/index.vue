<template>
  <div class="order-table"
       v-loading="loading" style="padding:10px 20px">
    <!-- 订单列表表头 -->
    <div  v-if="orderList && orderList.length">
      <div class="order-table-header" >
        <table class="table table-bordered bg-white">
          <tbody>
            <tr>
              <th class="order-tab-mw20">商品信息</th>
              <th class="order-tab-w12">金额</th>
              <th class="order-tab-w12">实收</th>
              <th class="order-tab-w12"
                  v-if="isProduct">下单店铺</th>
              <th class="order-tab-w17"
                  v-if="isRooms">预订及入住</th>
              <th class="order-tab-w10"
                  v-if="isRooms">离店</th>
              <th class="order-tab-w17"
                  v-if="isTicket">关联人脸</th>
              <th class="order-tab-w10"
                  v-if="isTicket">类型</th>
              <th class="order-tab-w10">订单状态</th>
              <th class="order-tab-w10">操作</th>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 订单列表 -->
      <div class="order-list"
          v-for="item in orderList"
            :key="item.refundOrderNo">
        <table class="table table-bordered bg-white">
          <tbody>
            <tr>
              <td :colspan="colspanTd">
                <span class="inline-text"
                      style="width:14%">{{item.requestTime || item.orderTime}}</span>
                <span class="inline-text">订单编号：{{item.orderNo}}</span>
                <span class="inline-text"
                      v-if="item.refundOrderNo">退款编号：{{item.refundOrderNo}}</span>
                <span class="inline-text">
                  会员：
                  <span v-if="!!item.userWxAvstar"
                        :style="'background: url('+item.userWxAvstar+') no-repeat;background-size: 100% 100%;'"
                        class="icon icon-userWxAvstar"></span>
                  <span class="nick-name">{{item.userWxNickName || item.realName ||'未知'}}</span>
                </span>
                <span class="user-msg inline-text"
                      :title="item.userMessage ? item.userMessage : '--'">
                  买家留言：{{item.userMessage ? item.userMessage : '--'}}
                </span>
              </td>
            </tr>
            <tr>
              <td class="order-tab-mw20">
                <div v-if='item.itemType === cardEnum.cardType.manualRecharge'
                      class="manualPrice">手动充值金额：
                  <span>￥{{item.totalFee | price}}</span>
                </div>
                <div class="goods-info"
                      v-for="(item2,index2) in item.itemList"
                      :key="index2">
                  <!-- 卡券 -->
                  <div class="card-type "
                        v-if="item.itemType === cardEnum.cardType.timesCard || item.itemType === cardEnum.cardType.chargeCard"
                        :class="{'recharge-card': item.itemType === cardEnum.cardType.chargeCard && !item2.thumbnail, 'times-card': item.itemType === cardEnum.cardType.timesCard && !item2.thumbnail}"
                        :style="item2.thumbnail | bgImage">
                  </div>
                  <!-- 非卡券 -->
                  <div v-else
                        :style="!!item2.thumbnail ? 'background: url('+item2.thumbnail+') no-repeat;': ''"
                        class="icon"></div>

                  <div class="info">
                    <div v-if="item.marketingName" class="name item-name">活动名称：{{item.marketingName}} </div>
                    <div class="name item-name">商品名称：{{item2.itemName}} </div>
                    <div class="attribute"
                          v-if="item2.itemAttribute">{{item2.itemAttribute}}</div>
                    <div class="price-info">
                      <div v-if="item.marketingPrice" class="price">秒杀价：￥{{( item.marketingPrice || 0) | price}}</div>
                      <span class="price">￥{{( item2.salePrice || 0) | price}}</span>
                      <span class="number"
                            v-if="item2.giftAmount ">赠送金额：
                        <span class="price">￥{{( item2.giftAmount || 0) | price}}</span>
                      </span>
                      <!-- 叁拾加线下订单如果有重量显示重量，赠品不显示重量 -->
                      <span class="number"
                            v-if="item2.itemWeight&&item.itemType!==orderStatusEnum.ORDER_TYPE.GIFT.value">{{item2.itemWeight}}{{item2.itemUnit}}</span>
                      <span class="number"
                            v-else>数量：{{item2.itemCount}}</span>
                      <span class="number"
                            v-if="item2.itemWeight&&item.itemType!==orderStatusEnum.ORDER_TYPE.GIFT.value">￥小计：
                        <span class="price">{{( item2.payFee || 0) | price}}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="order-tab-w12">
                <div class="wp-table-row">
                  <span v-if="isProduct">运费：{{item && item.logisticsFee |price}}</span>
                  <span class="span"
                        v-if="item.logisticsCouponPromFee">运费券：￥-{{item.logisticsCouponPromFee | price}}</span>
                  <span class="span"
                        v-if="item.groupLeaderPromFee || item.groupPromFee">拼团：￥-{{computeGroupPromFee(item) | price}}</span>
                  <span class="span"
                        v-if="item.cardPromFee">卡项：￥-{{item.cardPromFee | price}}</span>
                  <span class="span"
                        v-if="item.cashPromFee">现金：￥-{{item.cashPromFee | price}}</span>
                  <span class="span"
                        v-if="item.couponPromFee">优惠券：￥-{{item.couponPromFee | price}}</span>
                  <span class="span"
                        v-if="item.redPacketPromFee">红包：￥-{{item.redPacketPromFee | price}}</span>
                  <span class="span"
                        v-if="item.bargainPromFee">砍价：￥-{{item.bargainPromFee | price}}</span>
                  <span class="span"
                        v-if="item.userGiftCardPromFee">礼品卡：￥-{{item.userGiftCardPromFee | price}}</span>
                  <span class="span"
                        v-if="item.memberPromFee">会员：￥-{{item.memberPromFee | price}}</span>
                  <span class="span"
                        v-if="item.secKillPromFee">秒杀：￥-{{item.secKillPromFee | price}}</span>
                  <span class="span"
                        v-if="item.integralPromFee">积分：￥-{{item.integralPromFee | price}}</span>
                  <span class="span"
                        v-if="item.integralPromFee">消耗积分：{{item.integralScoreAmount }}</span>
                  <span class="span"
                        v-if="item.innerBuyPromFee">内购券：￥-{{item.innerBuyPromFee | price}}</span>
                  <span class="span"
                        v-if="item.innerBuyPromFee">消耗内购券：{{item.innerBuyCouponAmount }}</span>
                  <span class="span"
                        v-if="item.profitSharingFee">分账：￥{{item.profitSharingFee | price}}</span>
                  <span class="span"
                        v-if="item.frontMoneyItemOrder">定金：￥{{item.payFee | price}}</span>
                  <span class="span"
                        v-if="item.frontMoneyItemOrder">尾款：￥{{item.restMoney | price}}</span>

                  <span class="span">合计：
                    <span class="important">￥{{item.totalFee | price}}</span>
                  </span>
                  <span class="span"
                        v-if="item.refundFee">退款：
                    <span class="important">￥{{item.refundFee | price}}</span>
                  </span>
                </div>
              </td>
              <td class="order-tab-w12">
                <div class="wp-table-row">
                  <span class="span">实收：
                    <span class="important">￥{{item.payFee | price}}</span>
                  </span>
                  <span v-if="item.orderPayChannelDTO"
                        class="span">
                    <span class="span"
                          v-if="item.orderPayChannelDTO.wxPayFee">微信支付：￥{{item.orderPayChannelDTO.wxPayFee | price}}</span>
                    <span class="span"
                          v-if="item.orderPayChannelDTO.aLiPayFee">支付宝支付：￥{{item.orderPayChannelDTO.aLiPayFee | price}}</span>
                    <span class="span"
                          v-if="item.orderPayChannelDTO.accountPayFee">余额支付：￥{{item.orderPayChannelDTO.accountPayFee | price}}</span>
                    <span class="span"
                          v-if="item.orderPayChannelDTO.cashPayFee">现金支付：￥{{item.orderPayChannelDTO.cashPayFee | price}}</span>
                    <span class="span"
                          v-if="item.orderPayChannelDTO.unionPayFee">银联支付：￥{{item.orderPayChannelDTO.unionPayFee | price}}</span>
                    <span class="span"
                          v-if="item.orderPayChannelDTO.otherAppPayFee">第三方渠道支付：￥{{item.orderPayChannelDTO.otherAppPayFee | price}}</span>
                  </span>
                  <span v-else
                        class="span">{{item.payChannel}}</span>
                </div>
              </td>
              <td class="order-tab-w12"
                  v-if="isProduct">
                <span class="span">{{item.storeName}}</span>
              </td>
              <td class="order-tab-w17"
                  v-if="isRooms">
                <div v-if="!!item.tourismOrderVO">
                  <span>{{item.tourismOrderVO.beginTime | format1}} - {{item.tourismOrderVO.endTime | format1}}</span>
                </div>
                <div v-if="!!item.tourismOrderVO && item.tourismOrderVO.activeTime">
                  <span>实际入住：{{item.tourismOrderVO.activeTime | format3}}</span>
                </div>
              </td>
              <td class="order-tab-w10"
                  v-if="isRooms">
                <span v-if="item.tourismOrderVO">{{item.tourismOrderVO.endTime | format2}}</span>
                <span v-else>--</span>
              </td>
              <td class="order-tab-w17"
                  v-if="isTicket">
                <template v-for="data in item.itemList">
                  <div v-for="(orderItem,index) in data.orderItemBindVOList"
                        class="human-face"
                        :key="index">
                    <div v-if="!!orderItem.img"
                          class="face"
                          :style="'background-image: url('+orderItem.img+')'"></div>
                    <div class="human">
                      <div>
                        <span>{{orderItem.name || "--"}}</span>
                      </div>
                      <div>
                        <span>{{orderItem.phone || "--"}}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </td>
              <td class="order-tab-w10"
                  v-if="isTicket">
                <template v-if="item.tourismOrderVO && item.tourismOrderVO.ticketType !== null">
                  <span>{{!item.tourismOrderVO.ticketType ? '单日票' : '套餐票'}}</span>
                </template>
                <template v-else>--</template>
              </td>
              <td class="order-tab-w10">
                <!--正常订单 状态描述信息是orderStatusDesc-->
                <div v-if="item.orderStatusDesc">
                  <span class="span">{{item.orderStatusDesc}}</span>
                </div>
                <!--退款订单, 状态描述信息是statusDesc-->
                <div v-if="item.statusDesc">
                  <span class="span">{{item.statusDesc}}</span>
                </div>
                <div v-if="item.actuallyGoodStatus">
                  <span class="span">{{item.actuallyGoodStatus}}</span>
                </div>
                <div v-if="item.refundType">
                  <span class="span important">{{computeRefundType(item.refundType)}}</span>
                </div>
              </td>
              <td class="order-tab-w10 order-btn-areas">
                <!-- 订单详情 -->
                <div>
                  <a class="table-href"
                      href="javascript:;"
                      @click="handleShowDetail(item)">订单详情</a>
                </div>

                <!-- 备注 -->
                <div class="btn-box"
                      v-if="showRemark(item)">
                  <a class="table-href"
                      href="javascript:;"
                      @click="handleShowRemarkDialog(item)">备注</a>
                </div>

                <!-- 修改收货地址 -->
                <div class="btn-box"
                      v-if="showUpdateAddress(item)">
                  <a class="table-href"
                      href="javascript:;"
                      @click="handleUpdateAddress(item)">修改收货地址</a>
                </div>

                <!-- 确认自提 -->
                <div class="btn-box"
                      v-if="showShipping(item)">
                  <a class="table-href"
                      href="javascript:;"
                      @click="confirmSelfPickup(item)">确认自提</a>
                </div>
              </td>
            </tr>
            <tr class="consignee-info-box">
              <td :colspan="colspanTd">
                <div class="consignee-info"
                      v-if="isProduct">
                  <span class="receive">收件人：{{item.consignee ? item.consignee : '-'}}</span>
                  <span class="tel">电话：{{item.consigneeMobile ? item.consigneeMobile : '-'}}</span>
                  <span class="address">地址：{{item.detailAddress ? item.detailAddress : '-'}}</span>
                </div>
                <div class="consignee-info"
                      v-if="(isRooms || isTicket) && item.tourismOrderVO">
                  <span class="receive">联系人：{{item.tourismOrderVO.name ? item.tourismOrderVO.name : '-'}}</span>
                  <span class="tel">电话：{{item.tourismOrderVO.phone ? item.tourismOrderVO.phone : '-'}}</span>
                </div>
                <div class="pre-sale-info"
                      v-if="item.preSell">
                  <span class="product-type">预售商品</span>

                  <span class="remain-time"
                        v-if="item.pushWMS && item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value">已推单发货</span>
                  <template v-else-if="!item.pushWMS && (item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_PAY.value || item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value)">
                    <span class="delivery-time"
                          v-if="item.expectShippingDate">发货时间：{{item.expectShippingDate}}</span>
                    <span class="remain-time">剩余：{{computeRemainTime(item.countdown)}} </span>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <el-pagination v-if="page.totalCount"
        layout="prev, pager, next, jumper, sizes, total"
        :total="page.totalCount"
        :page-size="page.pageSize"
        :current-page="page.pageNo"
        :page-sizes="[5, 10, 20,50, 100, 500]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="wkt-pagination">
      </el-pagination>
    </div>
    <!--暂无数据时的展示-->
    <place-holder v-else />

    <!--备注dialog-->
    <el-dialog title="订单备注"
               width="500px"
               class="remark-dialog"
               v-loading="remarkLoading"
               :visible.sync="remarkDialogVisible">
      <el-form :model="remarkInfo"
               :rules="remarkRules"
               label-position="left"
               ref="remarkForm">
        <el-form-item prop="message">
          <el-input type="textarea"
                    class="text-area"
                    v-model="remarkInfo.message"
                    maxlength="128"
                    show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="remarkDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="handleRemark('remarkForm')">确 定</el-button>
      </div>
    </el-dialog>

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

</template>

<script>
import utils from '@/dss-common/utils/index';
import date from '@/dss-common/utils/date';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import cardEnum from '../../../../constants/cardEnum.js';
import goodsTypeEnum from '../../../../constants/goodsTypeEnum';
import orderStatusEnum from '../../../../constants/orderStatusEnum';
import areaPicker from '../../../../components/area-picker/index';
import regexps from '@/dss-common/utils/regexps';
import api from '@/dss-wechat3rd/src/api/task-center.js';

export default {
  components: {
    PlaceHolder,
    areaPicker
  },
  mounted() {
    this.fetchData();
  },

  filters: {
    // 公历日期的两种格式
    format1(val) {
      return date.format(new Date(val), 'YYYY年MM月DD日');
    },
    format2(val) {
      return date.format(new Date(val), 'YYYY-MM-DD');
    },
    format3(val) {
      return date.format(new Date(val));
    },
    bgImage(val) {
      if (val) {
        return {
          backgroundImage: 'url(' + val + ')'
        };
      }
    }
  },

  data() {
    return {
      loading: false,
      isSure: true,
      cardEnum,
      goodsTypeEnum,
      orderStatusEnum,
      page: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      // 备注的对话框参数
      remarkLoading: false,
      remarkDialogVisible: false,
      remarkItem: null,
      remarkInfo: {
        orderNo: null,
        message: null
      },
      orderList: [],
      remarkRules: {
        message: [{ required: true, message: '请输入备注信息', trigger: 'change' }]
      },
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
    // 单元格横跨长度
    colspanTd() {
      if (this.isRooms || this.isTicket) {
        return '7';
      }
      return '6';
    },
    // 是否是商品类型
    isProduct() {
      return this.goodsType === goodsTypeEnum.product;
    },
    // 是否是客房类型
    isRooms() {
      return this.goodsType === goodsTypeEnum.rooms;
    },
    // 是否是票务类型
    isTicket() {
      return this.goodsType === goodsTypeEnum.ticket;
    },
    parseOrderTime() {
      return orderTime => {
        return utils.timeFormat(new Date(orderTime));
      };
    },

    showPreShip() {
      return item => {
        return item.showPushBtn;
      };
    },

    // 计算拼团优惠
    computeGroupPromFee() {
      return item => {
        let price = 0;
        if (item.groupLeaderPromFee) {
          price = price + item.groupLeaderPromFee;
        }
        if (item.groupPromFee) {
          price = price + item.groupPromFee;
        }
        return price;
      };
    },

    // 显示备注按钮
    showRemark() {
      return item => {
        return item.orderStatus !== orderStatusEnum.ORDER.STATUS.SUCCESS.value;
      };
    },

    // 判断是否显示修改收货地址按钮
    showUpdateAddress() {
      return item => {
        return (
          (item.orderStatus === orderStatusEnum.ORDER.STATUS.PAID.value || // 已支付
            item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value) && // 待发货
          item.expressType === orderStatusEnum.express_type.express // 快递类型
        );
      };
    },

    // 判断是否显示确认自提按钮
    showShipping() {
      return item => {
        return (
          (item.orderStatus === orderStatusEnum.ORDER.STATUS.PAID.value || // 已支付
          item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value || // 待发货
          item.orderStatus === orderStatusEnum.ORDER.STATUS.REFUSE_REFUND.value || //拒绝退款
            item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_OFF.value) && // 待核销
          item.expressType === orderStatusEnum.express_type.self_extraction // 自提类型
        );
      };
    },
    // 退款类型
    computeRefundType() {
      return type => {
        switch (type) {
          case orderStatusEnum.refund_type.refund_item_and_money:
            return '退款退货';
          case orderStatusEnum.refund_type.refund_money:
            return '仅退款';
          default:
            return '';
        }
      };
    }
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true;
        let params = {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          shareId: this.$route.query.id
        };
        let res = await api.getTaskRecord(params);
        if (res && res.data) {
          let params = {
            marketingID: 1,
            pageNo: this.page.pageNo,
            pageSize: this.page.pageSize,
            orderNos: res.data.join()
          };
          api
            .getTaskSekillList(params)
            .then(res => {
              if (res && res.data) {
                this.orderList = res.data || [];
                this.page.totalCount = res.totalCount;
              }
            })
            .always(res => {})
            .finally(_ => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      } finally {
      }
    },

    // 跳转订单详情页面
    handleShowDetail(item) {
      this.$router.push(`/marketing/task-center/operation/order/detail?orderNo=${item.orderNo}&orderType=seckill`);
    },

    // 显示备注对话弹框
    handleShowRemarkDialog(item) {
      this.remarkItem = item;
      this.remarkDialogVisible = true;
      Object.keys(this.remarkInfo).forEach(key => {
        this.remarkInfo[key] = null;
      });
      this.remarkInfo.message = item.sellerMessage;
    },
    // 确定备注内容
    handleRemark(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.remarkLoading = true;
          this.remarkInfo.orderNo = this.remarkItem.orderNo;
          const params = this.remarkInfo;
          api
            .addOrderRemark(params)
            .then(res => {
              this.remarkDialogVisible = false;
              this.fetchData();
            })
            .always(() => {
              this.remarkLoading = false;
            });
        } else {
          return false;
        }
      });
    },

    /**
     * 点击修改收货地址
     */
    handleUpdateAddress(item) {
      // 赋值修改地址的订单号
      this.addressForm.orderNo = item.orderNo ? item.orderNo : null;
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
            this.addressDialogVisible = false;
          })
          .always(() => {
            this.loading = false;
          });
      });
    },

    //确认自提
    confirmSelfPickup(item) {
      this.$confirm('是否确认该订单已自提？', '确认自提', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.loading = true;
          const params = {
            orderNo: item.orderNo
          };

          api
            .confirmOrderRemark(params)
            .done(res => {
              this.$message.success('确认自提成功！');
              this.fetchData();
            })
            .always(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认自提'
          });
        });
    },
    // 每页条数变化
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.fetchData();
    },
    // 翻页
    onPageChange(page) {
      this.page.pageNo = page;
      this.fetchData();
    }
  }
};
</script>
<style scoped>
</style>
<style lang='less'>
.text-area .el-textarea__inner{
  width: 450px !important;
  height: 200px;
}
.order-table-header{
  padding-left: 0 !important;
}
</style>
