<template>
  <div class="order-detail-container" v-loading="loading" v-if="refundOrderNo">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/refund/list' }" replace>退款列表</el-breadcrumb-item>
      <el-breadcrumb-item>退款详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="order-info">
      <div class="order-info-label">
        <span style="color: #fa7516"
          ><span style="color: #717378">状态：</span>{{ refundOrderDetail ? refundOrderDetail.statusDesc : '-' }}</span
        >
      </div>
      <div class="order-info-label">
        <span>订单编号：</span>{{ refundOrderDetail ? refundOrderDetail.orderNo : '-' }}
      </div>
      <div class="order-info-label">
        <span>退款编号：</span>{{ refundOrderDetail ? refundOrderDetail.refundOrderNo : '-' }}
      </div>
      <div class="order-info-label">
        <span>下单时间：</span>{{ computeOrderTime(refundOrderDetail ? refundOrderDetail.orderTime : null) }}
      </div>
      <div class="order-info-label">
        <span>付款时间：</span>{{ computeOrderTime(refundOrderDetail ? refundOrderDetail.payTime : null) }}
      </div>
      <div class="order-info-label" v-if="handleOptionsHidden">
        <span>发货时间：</span>{{ computeOrderTime(refundOrderDetail ? refundOrderDetail.shippingTime : null) }}
      </div>
      <div class="order-info-label" v-if="refundOrderDetail && refundOrderDetail.completeTime">
        <span>完成时间：</span>{{ computeOrderTime(refundOrderDetail ? refundOrderDetail.completeTime : null) }}
      </div>
      <div class="order-info-label">
        <span>商家备注：</span>
        <span class="label-desc">{{
          refundOrderDetail && refundOrderDetail.sellerMessage ? refundOrderDetail.sellerMessage : '- -'
        }}</span>
      </div>
    </div>

    <div class="order-info-block">
      <!-- 会员信息 -->
      <div class="member-info order-info__item">
        <div class="order-info__title">会员信息</div>
        <div class="member-content">
          <img
            v-if="refundOrderDetail && refundOrderDetail.userWxAvstar"
            :src="refundOrderDetail && refundOrderDetail.userWxAvstar"
            class="icon"
          />
          <div v-else class="member-default-avatar">
            {{
              refundOrderDetail && refundOrderDetail.userWxNickName
                ? refundOrderDetail.userWxNickName.substr(0, 1)
                : 'N/A'
            }}
          </div>
          <div class="member-content__item">
            <div class="member-info-label">
              <span>会员昵称：</span
              >{{ refundOrderDetail && refundOrderDetail.userWxNickName ? refundOrderDetail.userWxNickName : '-' }}
            </div>
            <div class="member-info-label">
              <span>会员姓名：</span>
              <template v-if="handleOptionsHidden">
                {{ refundOrderDetail && refundOrderDetail.realName ? refundOrderDetail.realName : '-' }}
              </template>
              <template v-else>
                {{
                  refundOrderDetail && refundOrderDetail.tourismOrderVO.name
                    ? refundOrderDetail.tourismOrderVO.name
                    : '-'
                }}
              </template>
            </div>
            <div class="member-info-label">
              <span>联系电话：</span
              >{{ refundOrderDetail && refundOrderDetail.userMobile ? refundOrderDetail.userMobile : '-' }}
            </div>
            <div class="member-info-label">
              <span>归属导购：</span
              >{{ refundOrderDetail && refundOrderDetail.employeeName ? refundOrderDetail.employeeName : '-' }}
            </div>
          </div>
        </div>
      </div>

      <div class="order-info order-info__item" v-if="handleOptionsHidden">
        <div class="order-info__title">收货人信息</div>
        <el-scrollbar style="height: 120px">
          <div class="order-info-label">
            <span>收货人：</span
            >{{ refundOrderDetail && refundOrderDetail.consignee ? refundOrderDetail.consignee : '-' }}
          </div>
          <div class="order-info-label">
            <span>收货地址：</span>
            <span class="label-desc">{{
              refundOrderDetail && refundOrderDetail.detailAddress ? refundOrderDetail.detailAddress : '-'
            }}</span>
          </div>
          <div class="order-info-label">
            <span>客户留言：</span>
            <span class="label-desc">{{
              refundOrderDetail && refundOrderDetail.userMessage ? refundOrderDetail.userMessage : '-'
            }}</span>
          </div>
          <div class="order-info-label"><span>物流信息：</span>{{ computeShippingInfo }}</div>
          <div class="order-info-label" v-if="refundOrderDetail && refundOrderDetail.shippingNo">
            <span>物流单号：</span>{{ refundOrderDetail.shippingNo }}
          </div>
        </el-scrollbar>
      </div>
    </div>

    <div class="order-content">
      <!-- 商品信息 -->
      <div class="goods-info" v-if="refundOrderDetail && refundOrderDetail.itemList">
        <div class="goods-info-content goods-info-head" style="border: 0">
          <div class="desc">商品信息</div>
          <div class="money">数量</div>
          <div class="receipt">运费&抵扣</div>
          <div class="pay">实价</div>
        </div>
        <div class="goods-info-content" v-for="(item, index) in refundOrderDetail.itemList" :key="index">
          <div class="desc goods-info-desc">
            <img class="goods-image" v-if="item.thumbnail" :src="item.thumbnail" />
            <img
              class="goods-image"
              v-else
              :src="refundOrderDetail.itemType === cardEnum.cardType.timesCard ? timeCardBg : chargeCardBg"
            />
            <div class="goods-info-desc-content">
              <span>产品：{{ item.itemName }}</span>
              <span v-if="item.itemAttribute">{{ item.itemAttribute }}</span>
              <span
                >单价：<span style="color: red; display: inline-block"
                  >￥{{ item.salePrice | price
                  }}{{ item.consumeIntegral && item.itemMode ? `+${item.consumeIntegral}积分` : '' }}</span
                ></span
              >
            </div>
          </div>
          <div class="money out-box">
            <div class="inner-box">
              <!-- 叁拾加重量 -->
              <span v-if="item.itemWeight">{{ item.itemWeight }}{{ item.itemUnit }}</span>
              <span v-else>{{ item.itemCount }}</span>
              <!--小计: ￥{{item.salePrice * item.itemCount |price}}</span>-->
              <!-- <span>小计: ￥{{item.actualFee |price}}</span> -->
            </div>
          </div>

          <!-- 优惠信息，拼团跟砍价的优惠信息用订单维度的参数，其他优惠信息用商品维度的参数 -->
          <div class="receipt out-box">
            <div class="inner-box">
              <div v-if="handleOptionsHidden">
                运费：
                <template
                  v-if="
                    refundOrderDetail.expressType === orderStatusEnum.express_type.express &&
                    item.freightType === tplEnum.type.freightCollect
                  "
                >
                  运费到付
                </template>
                <template v-else>{{ item.logisticsFee | price }}</template>
              </div>
              <div class="span" v-if="refundOrderDetail.groupLeaderPromFee || refundOrderDetail.groupPromFee">
                拼团：￥-{{ computeGroupPromFee(refundOrderDetail) | price }}
              </div>
              <div class="span" v-if="item.cardPromFee">卡项：￥-{{ item.cardPromFee | price }}</div>
              <div class="span" v-if="item.cashPromFee">现金：￥-{{ item.cashPromFee | price }}</div>
              <div class="span" v-if="item.couponPromFee">优惠券：￥-{{ item.couponPromFee | price }}</div>
              <div class="span" v-if="item.redPacketPromFee">红包：￥-{{ item.redPacketPromFee | price }}</div>
              <div class="span" v-if="item.userGiftCardPromFee">礼品卡：￥-{{ item.userGiftCardPromFee | price }}</div>
              <div class="span" v-if="refundOrderDetail.bargainPromFee">
                砍价：￥-{{ refundOrderDetail.bargainPromFee | price }}
              </div>
              <div class="span" v-if="item.memberPromFee">会员：￥-{{ item.memberPromFee | price }}</div>
              <div class="span" v-if="item.secKillPromFee">秒杀：￥-{{ item.secKillPromFee | price }}</div>
              <div class="span" v-if="item.offsetCashFee && !item.itemMode">
                积分抵扣: -{{ item.offsetCashFee | price }}(消耗{{ item.consumeIntegral }}积分)
              </div>
              <!-- <div class="span" v-if="item.consumeIntegral && item.itemMode">
                积分：{{ item.consumeIntegral }}
              </div> -->
              <div class="span" v-if="refundOrderDetail.innerBuyPromFee">
                内购券：￥-{{ refundOrderDetail.innerBuyPromFee | price }}
              </div>
              <!-- 无折扣时默认值 -->
              <div class="span" v-if="item.actualFee === item.payFee && !handleOptionsHidden">- -</div>
            </div>
          </div>

          <!-- 实收 -->
          <div class="pay out-box">
            <div class="inner-box">
              ￥{{ item.payFee | price }}{{ item.consumeIntegral ? `+${item.consumeIntegral}积分` : '' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 发货单 -->
      <div
        class="invoice-info"
        v-if="
          refundOrderDetail &&
          refundOrderDetail.expressType === orderStatusEnum.express_type.express &&
          orderLogisticsVOList.length > 0
        "
      >
        <!-- <div class="order-content-title">发货单</div> -->
        <div class="invoice-content invoice-content-head">
          <div class="invoice-goods-tab flex-2">发货信息</div>
          <div class="invoice-goods-tab">出库单号</div>
          <div class="invoice-goods-tab">物流信息</div>
        </div>
        <div class="invoice-content" v-for="(olvoItem, idx) in orderLogisticsVOList" :key="idx">
          <div class="invoice-goods-tab flex-2" style="overflow: hidden; padding-right: 20px">
            <el-scrollbar style="height: 112px">
              <div style="display: flex">
                <div class="invoice-goods-info" v-for="(item, index) in olvoItem.itemList" :key="index">
                  <img class="goods-image" :src="item.thumbnail" />

                  <div class="goods-info-desc">
                    <p>{{ item.itemName }}</p>
                    <!-- <p v-if="item.itemAttribute">{{ item.itemAttribute }}</p> -->
                    <p>
                      <span class="salePrice" v-if="item.salePrice">单价：￥{{ item.salePrice | price }}</span>
                      <!-- <span class="itemCount">数量: {{ item.count }}</span> -->
                    </p>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div class="invoice-goods-tab">
            <p v-if="olvoItem.outBoundNo">{{ olvoItem.outBoundNo }}</p>
            <p v-else>- -</p>
          </div>
          <div class="invoice-goods-tab" v-if="olvoItem.outBoundNo">
            <div class="logistics-info">
              <p>发货仓库：{{ olvoItem && olvoItem.warehouseName ? olvoItem.warehouseName : '-' }}</p>
              <p>
                物流信息：{{ olvoItem && olvoItem.shippingCompany ? olvoItem.shippingCompany : '-' }}
                {{ olvoItem && olvoItem.shippingNo ? olvoItem.shippingNo : '-' }}
              </p>
              <p>物流状态：{{ olvoItem && olvoItem.statusDesc ? olvoItem.statusDesc : '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 流水信息 -->
      <div class="waterBill-info">
        <!-- <div class="order-content-title">流水信息</div> -->
        <div class="waterBill-content">
          <el-table :data="waterList" class="wkt-table">
            <el-table-column label="交易流水">
              <template slot-scope="scope">
                {{ scope.row.waterBillNo ? scope.row.waterBillNo : '-' }}
              </template>
            </el-table-column>

            <el-table-column label="付款详情">
              <template slot-scope="scope">
                <div v-if="scope.row.orderPayChannelDTO">
                  <div v-if="scope.row.orderPayChannelDTO.wxPayFee">
                    微信支付：￥{{ scope.row.orderPayChannelDTO.wxPayFee | price }}
                  </div>
                  <div v-if="scope.row.orderPayChannelDTO.aLiPayFee">
                    支付宝支付：￥{{ scope.row.orderPayChannelDTO.aLiPayFee | price }}
                  </div>
                  <div v-if="scope.row.orderPayChannelDTO.accountPayFee">
                    余额支付：￥{{ scope.row.orderPayChannelDTO.accountPayFee | price }}
                  </div>
                  <div v-if="scope.row.orderPayChannelDTO.cashPayFee">
                    现金支付：￥{{ scope.row.orderPayChannelDTO.cashPayFee | price }}
                  </div>
                  <div v-if="scope.row.orderPayChannelDTO.unionPayFee">
                    银联支付：￥{{ scope.row.orderPayChannelDTO.unionPayFee | price }}
                  </div>
                  <div v-if="scope.row.orderPayChannelDTO.otherAppPayFee">
                    第三方渠道支付：￥{{ scope.row.orderPayChannelDTO.otherAppPayFee | price }}
                  </div>
                </div>
                <!-- <div v-else>{{ scope.row.payChannel }}</div> -->
                <div v-else>{{ scope.row.payChannel }}<span v-if="scope.row.refundIntegral">+积分支付</span></div>
              </template>
            </el-table-column>

            <el-table-column label="售价(￥)">
              <template slot-scope="scope">
                {{ scope.row.actualFee ? scope.row.actualFee : 0 | price }}
                {{ scope.row.refundIntegral ? `+${scope.row.refundIntegral}积分` : '' }}
              </template>
            </el-table-column>

            <el-table-column label="运费(￥)" v-if="handleOptionsHidden">
              <template slot-scope="scope">
                <template v-if="freightCollectLabel(refundOrderDetail)">运费到付</template>
                <template v-else>{{ scope.row.logisticsFee ? scope.row.logisticsFee : 0 | price }}</template>
              </template>
            </el-table-column>

            <el-table-column label="抵扣(￥)">
              <template slot-scope="scope">
                -{{ computePromFee(scope.row) | price }}
                <!-- {{scope.row.offsetCashFee}} -->
              </template>
            </el-table-column>

            <el-table-column label="实收金额(￥)">
              <template slot-scope="scope">
                {{ scope.row.payFee ? scope.row.payFee : 0 | price }}
                {{ scope.row.refundIntegral ? `+${scope.row.refundIntegral}积分` : '' }}
              </template>
            </el-table-column>

            <el-table-column label="外部订单号">
              <template slot-scope="scope">
                {{ scope.row.outTransactionId ? scope.row.outTransactionId : '-' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 退换货记录 -->
    <div class="return_and_exchange_records" v-if="refundOrderDetail">
      <div class="title">退换货记录</div>
      <div class="record_content">
        <!-- 退货商品 -->
        <el-row class="tab">
          <el-col :span="24">
            <span>退货商品：</span>
            <div class="goods-image-box" v-for="(item, index) in refundOrderDetail.refundOrderItemVOS" :key="index">
              <el-image style="width: 100px; height: 100px" :src="item.thumbnail" :preview-src-list="previewImgList">
              </el-image>
            </div>
          </el-col>
        </el-row>

        <!-- 申请退款信息 -->
        <el-row class="tab">
          <el-col :span="8">
            <div class="tab_info">
              <div class="return_info" style="vertical-align: top; margin-bottom: 10px">
                <div>退款金额：￥{{ refundOrderDetail.refundFee | price }}</div>
                <div v-if="refundOrderDetail.refundIntegral">退款积分：{{ refundOrderDetail.refundIntegral }}积分</div>
                <div>
                  退款类型：
                  <span style="color: rgba(251, 104, 56, 1)">{{
                    computeRefundType(refundOrderDetail.refundType)
                  }}</span>
                </div>
                <div>申请时间：{{ refundOrderDetail.requestTime | time }}</div>
                <div>申请货物状态：{{ refundOrderDetail.goodsStatus === 1 ? '已收到货' : '未收到货' }}</div>
                <div>实际货物状态：{{ refundOrderDetail.actuallyGoodStatus || '-' }}</div>
                <div>退款原因：{{ refundOrderDetail.refundGist || '' }}</div>
              </div>
              <div style="display: inline-block; font-size: 0">
                <div
                  class="goods-image-box"
                  v-for="(item, index) in refundOrderDetail.refundReasonImgPaths"
                  :key="index"
                >
                  <el-image style="width: 100px; height: 100px" :src="item" :preview-src-list="reasonImgList">
                  </el-image>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="tab_info desc" v-if="refundOrderDetail.refundReason">
              <span>说明：</span>
              <span class="desc_text">{{ refundOrderDetail.refundReason }}</span>
            </div>
          </el-col>
          <el-col :span="5" class="status">
            <!-- 已确认退款申请 -->
            <div class="tab_info" v-if="showConfirmRefundInfo(refundOrderDetail)">
              <span style="color: rgba(55, 190, 143, 1)">{{ refundOrderDetail.statusDesc }}</span>
              <span>{{ refundOrderDetail.confirmTime | time }}</span>
              <span>操作员：{{ refundOrderDetail.confirmName }}</span>
            </div>
            <!-- 已同意申请 -->
            <div class="tab_info" v-if="showAgreeRequestInfo(refundOrderDetail)">
              <span style="color: rgba(55, 190, 143, 1)">已同意申请</span>
              <span>{{ refundOrderDetail.agreeRequestTime | time }}</span>
              <span>操作员：{{ refundOrderDetail.agreeRequestByName }}</span>
            </div>
            <!-- 已拒绝申请 -->
            <div class="tab_info" v-if="showRejectRequestInfo(refundOrderDetail)">
              <span style="color: rgba(55, 190, 143, 1)">已拒绝申请</span>
              <span>{{ refundOrderDetail.rejectRefundTime | time }}</span>
              <span>操作员：{{ refundOrderDetail.rejectRefundName }}</span>
            </div>
            <!-- 已撤销退款申请 -->
            <div class="tab_info" v-if="showRevertRefundInfo(refundOrderDetail)">
              <span style="color: rgba(55, 190, 143, 1)">已撤销退款申请</span>
            </div>
          </el-col>
          <el-col :span="5">
            <!-- 申请退款状态的操作按钮 -->
            <div class="tab_info" style="text-align: center" v-if="showRequestRefundBtn(refundOrderDetail)">
              <!-- 确认退款 -->
              <btn-operation
                v-if="refundOrderDetail.refundType === orderStatusEnum.refund_type.refund_money"
                class="dateil-btn-operation"
                btn-type="confirmRefund"
                :operation-order="refundOrderDetail"
                :scope-refund-button="scopeRefundButton"
                @onLoading="onLoading"
                @unLoading="unLoading"
                @refresh="handleRefresh"
              ></btn-operation>

              <!-- 同意申请 -->
              <btn-operation
                v-if="refundOrderDetail.refundType === orderStatusEnum.refund_type.refund_item_and_money"
                class="dateil-btn-operation"
                btn-type="agreeRequest"
                :operation-order="refundOrderDetail"
                :scope-refund-button="scopeRefundButton"
                @onLoading="onLoading"
                @unLoading="unLoading"
                @refresh="handleRefresh"
              ></btn-operation>

              <!-- 拒绝申请 -->
              <btn-operation
                class="dateil-btn-operation"
                btn-type="refuseRequest"
                :operation-order="refundOrderDetail"
                :scope-refund-button="scopeRefundButton"
                @onLoading="onLoading"
                @unLoading="unLoading"
                @refresh="handleRefresh"
              ></btn-operation>
            </div>

            <!-- 重置退款状态 -->
            <div class="tab_info" v-if="showRefuseResetBtn(refundOrderDetail)">
              <btn-operation
                btn-type="refuseReset"
                :operation-order="refundOrderDetail"
                @onLoading="onLoading"
                @unLoading="unLoading"
                @refresh="handleRefresh"
              ></btn-operation>
            </div>
          </el-col>
        </el-row>

        <!-- 买家退货物流信息 -->
        <el-row class="tab" v-if="showRefundShippingInfo(refundOrderDetail)">
          <el-col :span="8" class="logistics">
            <div class="tab_info">
              <span>物流：{{ refundOrderDetail.refundShippingCompany }}</span>
              <span>物流单号：{{ refundOrderDetail.refundShippingNo }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="tab_info">
              <span>物流状态：已发货</span>
            </div>
          </el-col>
          <el-col :span="5" class="status">
            <div class="tab_info">
              <span style="color: rgba(55, 190, 143, 1)">买家发出货物</span>
              <span>{{ refundOrderDetail.refundShippingTime | time }}</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="tab_info">
              <!-- 确认已退货 -->
              <btn-operation
                v-if="showConfirmRefundItemBtn(refundOrderDetail)"
                class="dateil-btn-operation"
                btn-type="confirmRefundItem"
                :operation-order="refundOrderDetail"
                @onLoading="onLoading"
                @unLoading="unLoading"
                @refresh="handleRefresh"
              ></btn-operation>
            </div>
          </el-col>
        </el-row>

        <!-- 已确认退货信息 -->
        <el-row class="tab" v-if="showConfirmRefundItemInfo(refundOrderDetail)">
          <el-col :span="8" style="padding-top: 0">
            <div class="tab_info">
              <div
                class="goods-image-box"
                v-for="(item, index) in refundOrderDetail.confirmRefundItemImgs"
                :key="index"
              >
                <el-image style="width: 100px; height: 100px" :src="item" :preview-src-list="confirmImgList" />
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="tab_info">
              <span>{{ refundOrderDetail.confirmRefundItemMsg }}</span>
            </div>
          </el-col>
          <el-col :span="5" class="status">
            <div class="tab_info">
              <span style="color: rgba(55, 190, 143, 1)">已确认退货</span>
              <span>{{ refundOrderDetail.confirmRefundItemTime | time }}</span>
              <span>操作员：{{ refundOrderDetail.confirmRefundItemName }}</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="tab_info">
              <!-- 确认退款 -->
              <btn-operation
                v-if="showConfirmRefundBtn(refundOrderDetail)"
                class="dateil-btn-operation"
                btn-type="confirmRefund"
                :operation-order="refundOrderDetail"
                @onLoading="onLoading"
                @unLoading="unLoading"
                @refresh="handleRefresh"
              ></btn-operation>
            </div>
          </el-col>
        </el-row>

        <!-- 已确认退款信息 -->
        <el-row class="tab" v-if="showRefundInfo(refundOrderDetail)">
          <el-col :span="8">
            <div class="tab_info"></div>
          </el-col>
          <el-col :span="6">
            <div class="tab_info"></div>
          </el-col>
          <el-col :span="5" class="status">
            <div class="tab_info">
              <span style="color: rgba(55, 190, 143, 1)">{{ refundOrderDetail.statusDesc }}</span>
              <span>{{ refundOrderDetail.confirmTime | time }}</span>
              <span>操作员：{{ refundOrderDetail.confirmName }}</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="tab_info"></div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 放大图片对话弹框 -->
    <el-dialog class="enlarge_image_dialog" :visible.sync="enlargeImageDialog">
      <img :src="enlargeImageUrl" />
    </el-dialog>
  </div>
</template>

<script>
  import '@/dss-wechat3rd/src/bz_components/order-detail/index.less';
  import utils from '@/dss-common/utils';
  import services from '@/dss-common/utils/services';
  import constants from '@/dss-wechat3rd/src/constants/index';
  import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';
  import timeCardBg from '@/dss-wechat3rd/src/images/goods/time-card-bg.png';
  import chargeCardBg from '@/dss-wechat3rd/src/images/goods/charge-card-bg.png';
  import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import btnOperation from '../btn-operation.vue';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import { mapState } from 'vuex';
  import tplEnum from '@/dss-wechat3rd/src/views-retail/warehouse/freight-tpl/tpl-enum';

  export default {
    components: {
      btnOperation,
    },
    data() {
      return {
        scopeMenuEnum,
        refundOrderNo: this.$route.query.refundOrderNo,
        orderStatusEnum,
        goodsType: '',
        goodsTypeEnum,
        scopeRefundButton: true,

        loading: false,

        refundOrderDetail: null, // 退款订单详情
        cardEnum, // 卡项类型
        timeCardBg, // 次数卡背景图片
        chargeCardBg, // 充值卡背景图片

        orderLogisticsVOList: [], // 发货单信息

        enlargeImageDialog: false, // 放大图片对话弹框
        enlargeImageUrl: null, // 放大的图片地址
        tplEnum,
      };
    },
    watch: {
      wkbScopeMenu: {
        immediate: true,
        handler() {
          this.queryUserManagement();
        },
      },
    },

    computed: {
      ...mapState({
        wkbScopeMenu: 'wkbScopeMenu',
      }),
      // 控制订单特殊项的显隐（客房、票务）
      handleOptionsHidden() {
        return !(this.goodsType === goodsTypeEnum.rooms.value || this.goodsType === goodsTypeEnum.ticket.value);
      },

      // 计算订单时间
      computeOrderTime() {
        return function (time) {
          if (time) {
            return utils.timeFormat(new Date(time));
          }
          return '-';
        };
      },

      waterList() {
        const list = [];
        if (this.refundOrderDetail) {
          list.push(this.refundOrderDetail);
        }
        return list;
      },
      // 计算拼团优惠
      computeGroupPromFee() {
        return function (refundOrderDetail) {
          let price = 0;
          if (refundOrderDetail.groupLeaderPromFee) {
            price = price + refundOrderDetail.groupLeaderPromFee;
          }
          if (refundOrderDetail.groupPromFee) {
            price = price + refundOrderDetail.groupPromFee;
          }
          return price;
        };
      },

      // 计算抵扣金额
      computePromFee() {
        return function (item) {
          let price = 0;
          if (item.groupLeaderPromFee) {
            price = price + item.groupLeaderPromFee;
          }
          if (item.groupPromFee) {
            price = price + item.groupPromFee;
          }
          if (item.cardPromFee) {
            price = price + item.cardPromFee;
          }
          if (item.cashPromFee) {
            price = price + item.cashPromFee;
          }
          if (item.couponPromFee) {
            price = price + item.couponPromFee;
          }
          if (item.redPacketPromFee) {
            price = price + item.redPacketPromFee;
          }
          if (item.bargainPromFee) {
            price = price + item.bargainPromFee;
          }
          if (item.memberPromFee) {
            price = price + item.memberPromFee;
          }
          if (item.integralPromFee) {
            price = price + item.integralPromFee;
          }
          if (item.repurchasePromFee) {
            price = price + item.repurchasePromFee;
          }
          if (item.innerBuyPromFee) {
            price = price + item.innerBuyPromFee;
          }
          // 积分抵现
          if (item.offsetCashFee) {
            price = price + item.offsetCashFee;
          }
          // 促销活动
          if (item.fullDecrementPromList && item.fullDecrementPromList.length) {
            item.fullDecrementPromList.forEach(full => {
              price += full.promFee;
            });
          }
          return price;
        };
      },

      // 计算物流信息
      computeShippingInfo() {
        if (!this.refundOrderDetail) {
          return '无需物流';
        } else {
          if (this.refundOrderDetail.shippingType === orderStatusEnum.SHIPPING_TYPE.NO_NEED) {
            return '无需物流';
          } else {
            return this.refundOrderDetail.shippingCompany || '-';
          }
        }
      },

      // 退款类型
      computeRefundType() {
        return type => {
          return type === 1 ? '退款退货' : '仅退款';
        };
      },

      // 显示退货商品
      showReturnGood() {
        return item => {
          return item.refundType === 1; // 退款退货类型
        };
      },

      // 显示确认退款的操作信息
      showConfirmRefundInfo() {
        return item => {
          let isShow = false;
          if (
            item.refundType === orderStatusEnum.refund_type.refund_money && // 申请售后类型为仅退款
            (item.status === orderStatusEnum.REFUND.STATUS.CONFIRM_REFUND || // 已确认退款
              item.status === orderStatusEnum.REFUND.STATUS.REFUND_FAILED || // 退款失败
              item.status === orderStatusEnum.REFUND.STATUS.REFUND_SUCCESS || // 退款完成
              item.status === orderStatusEnum.REFUND.STATUS.REFUND) // 退款中
          ) {
            isShow = true;
          }
          return isShow;
        };
      },

      // 显示同意申请的操作信息
      showAgreeRequestInfo() {
        return item => {
          let isShow = false;
          if (
            item.refundType === orderStatusEnum.refund_type.refund_item_and_money && // 申请售后类型为退款退货
            (item.status === orderStatusEnum.REFUND.STATUS.AGREE_REFUND_REQUEST || // 已同意申请
              item.status === orderStatusEnum.REFUND.STATUS.REFUND_ITEM_SHIPPING || // 退款商品已发货
              item.status === orderStatusEnum.REFUND.STATUS.CONFIRM_REFUND_ITEM || // 已确认退货
              item.status === orderStatusEnum.REFUND.STATUS.CONFIRM_REFUND || // 已确认退款
              item.status === orderStatusEnum.REFUND.STATUS.REFUND_FAILED || // 退款失败
              item.status === orderStatusEnum.REFUND.STATUS.REFUND_SUCCESS || // 退款完成
              item.status === orderStatusEnum.REFUND.STATUS.REFUND) // 退款中
          ) {
            isShow = true;
          }
          return isShow;
        };
      },

      // 显示拒绝申请的操作信息
      showRejectRequestInfo() {
        return item => {
          return item.status === orderStatusEnum.REFUND.STATUS.REFUND_REJECT; // 已拒绝退款
        };
      },

      // 显示已撤销退款申请的操作信息
      showRevertRefundInfo() {
        return item => {
          return item.status === orderStatusEnum.REFUND.STATUS.REVERT_REFUND; // 已撤销退款申请
        };
      },

      // 判断是否为申请退款状态，以便显示同意申请及拒绝申请按钮
      showRequestRefundBtn() {
        return item => {
          return item.status === orderStatusEnum.REFUND.STATUS.REQUEST_REFUND; // 申请退款
        };
      },

      // 判断是否为已拒绝退款状态，以便显示重置退款状态按钮
      showRefuseResetBtn() {
        return item => {
          return item.status === orderStatusEnum.REFUND.STATUS.REFUND_REJECT; // 已拒绝退款
        };
      },

      // 显示退货物流信息
      showRefundShippingInfo() {
        return item => {
          let isShow = false;
          if (
            item.refundType === 1 && // 退款退货类型
            (item.status === orderStatusEnum.REFUND.STATUS.REFUND_ITEM_SHIPPING || // 退款商品已发货
              item.status === orderStatusEnum.REFUND.STATUS.CONFIRM_REFUND_ITEM || // 已确认退货
              item.status === orderStatusEnum.REFUND.STATUS.CONFIRM_REFUND || // 已确认退款
              item.status === orderStatusEnum.REFUND.STATUS.REFUND_FAILED || // 退款失败
              item.status === orderStatusEnum.REFUND.STATUS.REFUND_SUCCESS || // 退款完成
              item.status === orderStatusEnum.REFUND.STATUS.REFUND) // 退款中
          ) {
            isShow = true;
          }
          return isShow;
        };
      },

      // 判断是否为退款商品已发货状态，以便显示确认已退货按钮
      showConfirmRefundItemBtn() {
        return item => {
          return item.status === orderStatusEnum.REFUND.STATUS.REFUND_ITEM_SHIPPING; // 退款商品已发货
        };
      },

      // 显示已确认退货信息
      showConfirmRefundItemInfo() {
        return item => {
          let isShow = false;
          if (
            item.refundType === 1 && // 退款退货类型
            (item.status === orderStatusEnum.REFUND.STATUS.CONFIRM_REFUND_ITEM || // 已确认退货
              item.status === orderStatusEnum.REFUND.STATUS.CONFIRM_REFUND || // 已确认退款
              item.status === orderStatusEnum.REFUND.STATUS.REFUND_FAILED || // 退款失败
              item.status === orderStatusEnum.REFUND.STATUS.REFUND_SUCCESS || // 退款完成
              item.status === orderStatusEnum.REFUND.STATUS.REFUND) // 退款中
          ) {
            isShow = true;
          }
          return isShow;
        };
      },

      // 判断是否为确认已退货状态，以便显示确认退款按钮
      showConfirmRefundBtn() {
        return item => {
          return item.status === orderStatusEnum.REFUND.STATUS.CONFIRM_REFUND_ITEM; // 已确认退货
        };
      },

      // 显示退换货完成信息
      showRefundInfo() {
        return item => {
          let isShow = false;
          if (
            item.refundType === 1 && // 退款退货类型
            (item.status === orderStatusEnum.REFUND.STATUS.REFUND_FAILED || // 退款失败
              item.status === orderStatusEnum.REFUND.STATUS.REFUND_SUCCESS || // 退款完成
              item.status === orderStatusEnum.REFUND.STATUS.REFUND) // 退款中
          ) {
            isShow = true;
          }
          return isShow;
        };
      },
      freightCollectLabel() {
        return item => {
          if (item.expressType !== orderStatusEnum.express_type.express || !item.itemList || !item.itemList.length) {
            return false;
          } else {
            return item.itemList.every(goods => goods.freightType === tplEnum.type.freightCollect);
          }
        };
      },
      previewImgList() {
        return this.refundOrderDetail.refundOrderItemVOS.map(item => {
          return item.thumbnail;
        });
      },
      reasonImgList() {
        return this.refundOrderDetail.refundReasonImgPaths.map(item => {
          return item;
        });
      },
      confirmImgList() {
        return this.refundOrderDetail.confirmRefundItemImgs.map(item => {
          return item;
        });
      },
    },

    mounted() {
      if (this.$route.query.itemType) {
        this.goodsType = Number(this.$route.query.itemType);
      }
      this.getRefundOrderDetail(); // 获取订单详情
    },

    methods: {
      // 获取用户是否为管理员
      queryUserManagement() {
        if (this.wkbScopeMenu) {
          const refundOrderButton = scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.refundOrderButton;
          const scopeRefundButton = scopeMenuEnum.getMenuScopeByIdentifier(
            this.wkbScopeMenu,
            refundOrderButton.refund_action
          );
          this.scopeRefundButton = !!scopeRefundButton && !!scopeRefundButton.status;
        }
      },
      // 获取订单详情
      getRefundOrderDetail() {
        this.loading = true;
        const params = {
          refundOrderNo: this.refundOrderNo,
        };
        services
          .get(constants.Api.order.refundDetail, {
            params,
            action: '退款订单详情',
          })
          .then(res => {
            // 退款图片凭证，将后台获取的退款图片做处理，避免修改退款申请时清空之前的图片后，后台的退款图片凭证中还是返回一个有值的参数，引起前端显示错误
            if (res.data.refundReasonImgPaths && res.data.refundReasonImgPaths[0] === '[]') {
              res.data.refundReasonImgPaths = [];
            }
            this.refundOrderDetail = res.data;

            this.queryLogistics(); // 查询发货单信息
          })
          .catch(() => {
            this.loading = false;
          });
      },

      // 查询发货单信息
      queryLogistics() {
        const params = {
          orderNo: this.refundOrderDetail.orderNo,
        };
        services
          .get(constants.Api.order.queryLogistics, {
            params,
            action: '发货单',
          })
          .done(res => {
            this.orderLogisticsVOList = res.data || [];
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 放大图片
      enlargeImage(url) {
        this.enlargeImageDialog = true;
        this.enlargeImageUrl = url;
      },

      // 显示loading
      onLoading() {
        this.loading = true;
      },
      // 隐藏loading
      unLoading() {
        this.loading = false;
      },

      // 刷新退款详情
      handleRefresh() {
        this.getRefundOrderDetail(); // 刷新退款详情
      },
    },
  };
</script>

<style lang="less" scoped>
  .refund-detail-wrapper {
    .order-detail-container .el-breadcrumb {
      font-size: 12px;
    }
  }

  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
