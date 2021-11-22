<template>
  <div class="order-table" v-loading="loading">
    <div class="order-opt-box" v-if="showPatch">
      <el-button
        class="rect-btn"
        size="small"
        v-if="isPowerExport"
        :class="chooseOrderState ? 'export-btn' : ''"
        @click="toggleChooseOrder"
        >批量导出</el-button
      >
      <el-popover placement="bottom" v-else width="200" trigger="hover" :content="scopeMenuEnum.disabledBtnTip">
        <el-button class="rect-btn" size="small" slot="reference">批量导出</el-button>
      </el-popover>
      <el-button v-if="isPowerExport" size="small" class="rect-btn" :disabled="!isSure" @click="patchOrder"
        >一键导出</el-button
      >
      <el-popover placement="bottom" v-else width="200" trigger="hover" :content="scopeMenuEnum.disabledBtnTip">
        <el-button class="rect-btn" size="small" slot="reference">一键导出</el-button>
      </el-popover>
      <!-- 对账单 -->
      <el-button
        class="rect-btn"
        :class="chooseReconciliationState ? 'export-btn' : ''"
        v-if="env.MEDICINE && !isRefund"
        @click="toggleReconciliationOrder"
        >批量导出对账单</el-button
      >
      <!-- 对账单 -->
      <el-button
        class="rect-btn"
        v-if="env.MEDICINE && !isRefund"
        :disabled="!isReconciliationSure"
        @click="patchReconciliationOrder"
        >一键导出对账单</el-button
      >

      <el-button class="rect-btn" v-if="showUploadBtn" @click="showUploadDialog = true">批量导入物流单号</el-button>
      <el-button
        class="rect-btn"
        v-if="showBatchPreShipBtn"
        :class="chooseShipOrderState ? 'export-btn' : ''"
        @click="toggleChooseOrderToShipping"
        >批量提前发货</el-button
      >
    </div>

    <!-- 订单列表表头 -->
    <div
      class="order-table-header"
      :class="chooseOrderState || chooseShipOrderState || chooseReconciliationState ? '' : 'no-check'"
    >
      <el-checkbox
        class="order-check"
        v-if="chooseOrderState || chooseShipOrderState || chooseReconciliationState"
        :indeterminate="mIsIndeterminate"
        v-model="mAllChecked"
        @change="onAllCheckedChanged"
      >
      </el-checkbox>
      <!-- <table class="table table-bordered bg-white">
        <tbody>
          <tr>
            <th class="order-tab-mw20">{{ isEstate ? '楼盘' : '商品' }}信息</th>
            <th class="order-tab-w12">{{ isEstate ? '认筹金' : '金额' }}</th>
            <th class="order-tab-w10" v-if="isCardPack">订单渠道</th>
            <th class="order-tab-w12">实收</th>
            <th class="order-tab-w12"
                v-if="isEstate">置业顾问</th>
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
      </table> -->
    </div>

    <!-- 订单列表 -->
    <div class="order-list" v-if="orderList && orderList.length">
      <div
        :class="chooseOrderState || chooseShipOrderState || chooseReconciliationState ? 'order-item' : ''"
        v-for="item in orderList"
        :key="item.refundOrderNo"
        class="order-list__item"
      >
        <el-checkbox
          class="order-check"
          v-if="chooseOrderState || chooseShipOrderState || chooseReconciliationState"
          v-model="item.checked"
          :disabled="!item.showPushBtn && chooseShipOrderState"
          @change="checked => onItemCheckedChanged(checked, item)"
        >
        </el-checkbox>
        <table class="table table-bordered bg-white">
          <tbody>
            <tr class="tr-head">
              <td :colspan="colspanTd">
                <div style="float: left" class="clearfix">
                  <span class="inline-text" style="width: 14%">{{ item.requestTime || item.orderTime }}</span>
                  <span class="inline-text">订单编号：{{ item.orderNo }}</span>
                  <span class="inline-text" v-if="item.refundOrderNo">退款编号：{{ item.refundOrderNo }}</span>
                  <span class="inline-text">
                    会员：
                    <span
                      v-if="!!item.userWxAvstar"
                      :style="'background: url(' + item.userWxAvstar + ') no-repeat;background-size: 100% 100%;'"
                      class="icon icon-userWxAvstar"
                    ></span>
                    <span class="nick-name" style="margin-top: -3px">{{
                      item.userWxNickName || item.realName || '未知'
                    }}</span>
                  </span>
                  <span class="user-msg inline-text" :title="item.userMessage ? item.userMessage : '--'">
                    买家留言：{{ item.userMessage ? item.userMessage : '--' }}
                  </span>
                  <span class="inline-text" v-if="showShopGuideInfo">
                    订单归属导购: {{ item.employeeName ? item.employeeName : '--' }}
                  </span>
                  <span class="inline-text" v-if="(item.tag3 & 2) === 2">
                    下单导购: {{ item.createdEmployeeName || '--' }}
                  </span>

                  <!-- 推广大使订单信息 -->
                  <template v-if="isCardPack && item.channel === cardPackCHANNEL.PROMOTION.value">
                    <span class="inline-text">
                      推广大使:
                      <span
                        v-if="!!item.promoterAvatar"
                        :style="'background: url(' + item.promoterAvatar + ') no-repeat;background-size: 100% 100%;'"
                        class="icon icon-userWxAvstar"
                      ></span>
                      {{ item.promoterName || '--' }}
                    </span>
                    <span class="inline-text"> 推广导购: {{ item.promoterEmployeeName || '--' }} </span>
                  </template>
                </div>
                <div class="valet-order clearfix" v-if="(item.tag3 & 2) === 2">
                  <span class="inline-text valet-order-text"> 代客下单线上付款 </span>
                </div>
                <div class="valet-order clearfix" v-if="(item.tag3 & 4) === 4">
                  <span class="inline-text valet-order-text"> 代客下单线下付款 </span>
                </div>
              </td>
            </tr>
            <tr class="tr-body">
              <td class="order-tab-mw20">
                <div v-if="item.itemType === cardEnum.cardType.manualRecharge" class="manualPrice">
                  手动充值金额：
                  <span>￥{{ item.totalFee | price }}</span>
                </div>
                <div
                  class="goods-info"
                  :class="item.itemList && item.itemList.length > 1 ? 'border-right' : ''"
                  v-for="(item2, index2) in item.itemList"
                  :key="index2"
                >
                  <!-- 卡券 -->
                  <div
                    class="card-type"
                    v-if="
                      item.itemType === cardEnum.cardType.timesCard || item.itemType === cardEnum.cardType.chargeCard
                    "
                    :class="{
                      'recharge-card': item.itemType === cardEnum.cardType.chargeCard && !item2.thumbnail,
                      'times-card': item.itemType === cardEnum.cardType.timesCard && !item2.thumbnail,
                    }"
                    :style="item2.thumbnail | bgImage"
                  ></div>
                  <!-- 非卡券 -->
                  <div
                    v-else
                    :style="!!item2.thumbnail ? 'background: url(' + item2.thumbnail + ') no-repeat;' : ''"
                    class="icon"
                  ></div>

                  <div class="info">
                    <!-- 促销活动名称 -->
                    <div v-if="item2.activityName" class="name item-name">活动名称：{{ item2.activityName }}</div>
                    <div v-else-if="item.marketingName" class="name item-name">活动名称：{{ item.marketingName }}</div>
                    <div class="name item-name">
                      {{ isEstate ? '楼盘' : '商品' }}名称：<span
                        style="color: #f00; font-size: 14px; margin-right: 4px; vertical-align: 1px"
                        v-if="item2.drugType == 1"
                        >处方药</span
                      >{{ item2.itemName }}
                    </div>
                    <div class="name item-name">商品类型: {{ item2.itemMode === 0 ? '普通商品' : '积分商品' }}</div>
                    <div class="attribute" v-if="item2.itemAttribute">{{ item2.itemAttribute }}</div>
                    <div class="price-info">
                      <div v-if="item.marketingPrice" class="price">
                        秒杀价：￥{{ (item.marketingPrice || 0) | price }}
                      </div>

                      <div class="price" v-if="isEstate">
                        均价：￥{{ (item.estateOrderVO && item.estateOrderVO.averagePriceRange) / 100 || 0 }}/m
                        <sup>2</sup>
                      </div>
                      <template v-else>
                        <!-- 叁拾加线下订单如果有重量显示重量，赠品不显示重量 -->
                        <div
                          class="number"
                          v-if="item2.itemWeight && item.itemType !== orderStatusEnum.ORDER_TYPE.GIFT.value"
                        >
                          {{ item2.itemWeight }}{{ item2.itemUnit }}
                        </div>
                        <div class="number" v-else>数量：{{ item2.itemCount }}</div>
                        <div
                          class="number"
                          v-if="item2.itemWeight && item.itemType !== orderStatusEnum.ORDER_TYPE.GIFT.value"
                        >
                          ￥小计：
                          <div class="price">{{ (item2.payFee || 0) | price }}</div>
                        </div>
                        <!-- 积分商品 -->
                        <div
                          class="price"
                          v-if="item2.itemMode === 1 && item2.consumeIntegral !== 0 && item2.itemCount"
                        >
                          ￥{{ (item2.salePrice || 0) | price }} + {{ item2.consumeIntegral / item2.itemCount }}积分
                        </div>
                        <!-- 线上普通商品 -->
                        <div class="price" v-else>￥{{ (item2.salePrice || 0) | price }}</div>
                        <div class="number" v-if="item2.giftAmount">
                          赠送金额：
                          <span class="price">￥{{ (item2.giftAmount || 0) | price }}</span>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </td>
              <td class="order-tab-w17" :class="item.itemList && item.itemList.length > 1 ? 'border-right' : ''">
                <div class="wp-table-row">
                  <span v-if="isProduct"
                    >运费：
                    <template v-if="freightCollectLabel(item)">运费到付</template>
                    <template v-else>{{ item && item.logisticsFee | price }}</template>
                  </span>
                  <div class="span" v-if="item.offsetCashFee">
                    <span>积分抵现：-￥{{ item.offsetCashFee | price }}</span>
                  </div>
                  <span class="span" v-if="item.logisticsCouponPromFee"
                    >运费券：￥-{{ item.logisticsCouponPromFee | price }}</span
                  >
                  <span class="span" v-if="item.groupLeaderPromFee || item.groupPromFee"
                    >拼团：￥-{{ computeGroupPromFee(item) | price }}</span
                  >
                  <span class="span" v-if="item.cardPromFee">卡项：￥-{{ item.cardPromFee | price }}</span>
                  <span class="span" v-if="item.cashPromFee">现金：￥-{{ item.cashPromFee | price }}</span>
                  <span class="span" v-if="item.couponPromFee">优惠券：￥-{{ item.couponPromFee | price }}</span>
                  <span class="span" v-if="item.redPacketPromFee">红包：￥-{{ item.redPacketPromFee | price }}</span>
                  <span class="span" v-if="item.bargainPromFee">砍价：￥-{{ item.bargainPromFee | price }}</span>
                  <span class="span" v-if="item.userGiftCardPromFee"
                    >礼品卡：￥-{{ item.userGiftCardPromFee | price }}</span
                  >
                  <span class="span" v-if="item.memberPromFee">会员：￥-{{ item.memberPromFee | price }}</span>
                  <span class="span" v-if="item.secKillPromFee">秒杀：￥-{{ item.secKillPromFee | price }}</span>
                  <span class="span" v-if="item.integralPromFee">积分：￥-{{ item.integralPromFee | price }}</span>
                  <span class="span" v-if="item.integralPromFee">消耗积分：{{ item.integralScoreAmount }}</span>
                  <span class="span" v-if="item.innerBuyPromFee">内购券：￥-{{ item.innerBuyPromFee | price }}</span>
                  <span class="span" v-if="item.innerBuyPromFee">消耗内购券：{{ item.innerBuyCouponAmount }}</span>
                  <span class="span" v-if="item.profitSharingFee">分账：￥{{ item.profitSharingFee | price }}</span>
                  <span class="span" v-if="item.frontMoneyItemOrder">定金：￥{{ item.payFee | price }}</span>
                  <span class="span" v-if="item.frontMoneyItemOrder">尾款：￥{{ item.restMoney | price }}</span>
                  <span class="span" v-if="item.estateOrderVO && item.estateOrderVO.identifyFee"
                    >认筹金：￥{{ item.estateOrderVO && item.estateOrderVO.identifyFee | price }}</span
                  >
                  <!-- 促销活动 -->
                  <span class="span" v-for="(full, fullIndex) in item.fullDecrementPromList" :key="fullIndex"
                    >{{ full.ruleName }}：￥-{{ full.promFee | price }}</span
                  >
                  <!-- 合计(价格+积分) -->
                  <span class="span"
                    >合计：
                    <span class="important">
                      ￥{{ item.totalFee | price }}
                      {{ item.totalIntegral ? ` + ${item.totalIntegral} 积分` : '' }}
                    </span>
                  </span>
                  <span class="span" v-if="item.refundFee"
                    >退款：
                    <span class="important">￥{{ item.refundFee | price }}</span>
                  </span>
                  <span class="span" v-if="item.refundIntegral"
                    >退积分：
                    <span class="important">{{ item.refundIntegral }}积分</span>
                  </span>
                </div>
              </td>
              <td
                class="order-tab-w10"
                v-if="isCardPack"
                :class="item.itemList && item.itemList.length > 1 ? 'border-right' : ''"
              >
                {{
                  item.channel === cardPackCHANNEL.PROMOTION.value
                    ? cardPackCHANNEL.PROMOTION.label
                    : cardPackCHANNEL.REGION.label
                }}
              </td>
              <td class="order-tab-w12" :class="item.itemList && item.itemList.length > 1 ? 'border-right' : ''">
                <div class="wp-table-row">
                  <span class="span"
                    >实收：<span class="important"
                      >￥{{ item.payFee | price }}{{ item.totalIntegral ? ` + ${item.totalIntegral}积分` : '' }}</span
                    >
                  </span>
                  <span v-if="item.orderPayChannelDTO" class="span">
                    <span class="span" v-if="item.orderPayChannelDTO.wxPayFee"
                      >微信支付：￥{{ item.orderPayChannelDTO.wxPayFee | price }}</span
                    >
                    <span class="span" v-if="item.orderPayChannelDTO.aLiPayFee"
                      >支付宝支付：￥{{ item.orderPayChannelDTO.aLiPayFee | price }}</span
                    >
                    <span class="span" v-if="item.orderPayChannelDTO.accountPayFee"
                      >余额支付：￥{{ item.orderPayChannelDTO.accountPayFee | price }}</span
                    >
                    <span class="span" v-if="item.orderPayChannelDTO.cashPayFee"
                      >现金支付：￥{{ item.orderPayChannelDTO.cashPayFee | price }}</span
                    >
                    <span class="span" v-if="item.orderPayChannelDTO.unionPayFee"
                      >银联支付：￥{{ item.orderPayChannelDTO.unionPayFee | price }}</span
                    >
                    <span class="span" v-if="item.orderPayChannelDTO.otherAppPayFee"
                      >第三方渠道支付：￥{{ item.orderPayChannelDTO.otherAppPayFee | price }}</span
                    >
                  </span>
                  <span v-else class="span color-gray order-pay"
                    >支付方式：{{ item.payChannel }}
                    <span v-if="item.refundIntegral" class="span color-gray">+积分支付</span>
                  </span>
                </div>
              </td>
              <td class="order-tab-w12" v-if="isEstate">
                <span class="span">{{ item.estateOrderVO && item.estateOrderVO.adviserName }}</span>
                <span class="span">{{ item.estateOrderVO && item.estateOrderVO.adviserPhone }}</span>
              </td>
              <td
                class="order-tab-w12"
                v-if="isProduct"
                :class="item.itemList && item.itemList.length > 1 ? 'border-right' : ''"
              >
                <span class="span">{{ item.storeName }}</span>
              </td>
              <td
                class="order-tab-w17"
                :class="item.itemList && item.itemList.length > 1 ? 'border-right' : ''"
                v-if="isRooms"
              >
                <div v-if="!!item.tourismOrderVO">
                  <span
                    >{{ item.tourismOrderVO.beginTime | format1 }} - {{ item.tourismOrderVO.endTime | format1 }}</span
                  >
                </div>
                <div v-if="!!item.tourismOrderVO && item.tourismOrderVO.activeTime">
                  <span>实际入住：{{ item.tourismOrderVO.activeTime | format3 }}</span>
                </div>
              </td>
              <td
                class="order-tab-w10"
                :class="item.itemList && item.itemList.length > 1 ? 'border-right' : ''"
                v-if="isRooms"
              >
                <span v-if="item.tourismOrderVO">{{ item.tourismOrderVO.endTime | format2 }}</span>
                <span v-else>--</span>
              </td>
              <td
                class="order-tab-w17"
                :class="item.itemList && item.itemList.length > 1 ? 'border-right' : ''"
                v-if="isTicket"
              >
                <template v-for="data in item.itemList">
                  <div v-for="(orderItem, index) in data.orderItemBindVOList" class="human-face" :key="index">
                    <div
                      v-if="!!orderItem.img"
                      class="face"
                      :style="'background-image: url(' + orderItem.img + ')'"
                    ></div>
                    <div class="human">
                      <div>
                        <span>{{ orderItem.name || '--' }}</span>
                      </div>
                      <div>
                        <span>{{ orderItem.phone || '--' }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </td>
              <td
                class="order-tab-w10"
                :class="item.itemList && item.itemList.length > 1 ? 'border-right' : ''"
                v-if="isTicket"
              >
                <template v-if="item.tourismOrderVO && item.tourismOrderVO.ticketType !== null">
                  <span>{{ !item.tourismOrderVO.ticketType ? '单日票' : '套餐票' }}</span>
                </template>
                <template v-else>--</template>
              </td>
              <td class="order-tab-w10" :class="item.itemList && item.itemList.length > 1 ? 'border-right' : ''">
                <!--正常订单 状态描述信息是orderStatusDesc-->
                <div v-if="item.orderStatusDesc">
                  <span class="span span-color">{{ showOrderDesc(item) }}</span>
                </div>
                <!--退款订单, 状态描述信息是statusDesc-->
                <div v-if="item.statusDesc">
                  <span class="span">{{ item.statusDesc }}</span>
                </div>
                <div v-if="item.actuallyGoodStatus">
                  <span class="span">{{ item.actuallyGoodStatus }}</span>
                </div>
                <div v-if="item.refundType">
                  <span class="span important">{{ computeRefundType(item.refundType) }}</span>
                </div>
              </td>
              <td class="order-tab-w10 order-btn-areas">
                <!-- 订单详情 -->
                <div>
                  <a class="table-href" href="javascript:;" @click="handleShowDetail(item)">订单详情</a>
                </div>
                <div class="btn-box" v-if="showPreShip(item)">
                  <a class="table-href" href="javascript:;" @click="doPreShipOrders(item)">提前发货</a>
                </div>

                <!-- 备注 -->
                <div class="btn-box" v-if="showRemark(item)">
                  <a class="table-href" href="javascript:;" @click="handleShowRemarkDialog(item)">备注</a>
                </div>

                <!-- 取消订单 -->
                <div class="btn-box" v-if="showCanel(item)">
                  <a class="table-href" href="javascript:;" @click="confirmCancel(item)">取消订单</a>
                </div>

                <!-- 修改收货地址 -->
                <div class="btn-box" v-if="showUpdateAddress(item)">
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    v-if="!scopeShippingGoods"
                    :content="scopeMenuEnum.disabledBtnTip"
                  >
                    <a href="javascript:;" slot="reference">修改收货地址</a>
                  </el-popover>
                  <a v-else class="table-href" href="javascript:;" @click="handleUpdateAddress(item)">修改收货地址</a>
                </div>

                <!-- 确认自提 -->
                <div class="btn-box" v-if="showShipping(item)">
                  <a class="table-href" href="javascript:;" @click="confirmSelfPickup(item)">确认自提</a>
                </div>

                <!-- 申请退款状态的操作按钮 -->
                <div v-if="showRequestRefundBtn(item)">
                  <!-- 确认退款 -->
                  <btn-operation
                    v-if="item.refundType === orderStatusEnum.refund_type.refund_money"
                    btn-type="confirmRefund"
                    :operation-order="item"
                    :scope-refund-button="scopeRefundButton"
                    @onLoading="onLoading"
                    @unLoading="unLoading"
                    @refresh="handleRefresh"
                  ></btn-operation>

                  <!-- 同意申请 -->
                  <btn-operation
                    v-if="item.refundType === orderStatusEnum.refund_type.refund_item_and_money"
                    btn-type="agreeRequest"
                    :operation-order="item"
                    :scope-refund-button="scopeRefundButton"
                    @onLoading="onLoading"
                    @unLoading="unLoading"
                    @refresh="handleRefresh"
                  ></btn-operation>

                  <!-- 拒绝申请 -->
                  <btn-operation
                    btn-type="refuseRequest"
                    :operation-order="item"
                    :scope-refund-button="scopeRefundButton"
                    @onLoading="onLoading"
                    @unLoading="unLoading"
                    @refresh="handleRefresh"
                  ></btn-operation>
                </div>

                <!-- 重置退款状态，拒绝申请后，可以重置状态，进行再次申请 -->
                <div v-if="showRefuseResetBtn(item)">
                  <btn-operation
                    btn-type="refuseReset"
                    :operation-order="item"
                    @onLoading="onLoading"
                    @unLoading="unLoading"
                    @refresh="handleRefresh"
                  ></btn-operation>
                </div>

                <!-- 更新退款状态，用户撤销申请后，重置退款状态为申请状态 -->
                <div class="btn-box" v-if="showUpdateRefundBtn(item)">
                  <a class="table-href" href="javascript:;" @click="handleUpdateRefundStatus(item)">更新退款状态</a>
                </div>

                <!-- 确认已退货 -->
                <div v-if="showConfirmRefundItemBtn(item)">
                  <btn-operation
                    btn-type="confirmRefundItem"
                    :operation-order="item"
                    @onLoading="onLoading"
                    @unLoading="unLoading"
                    @refresh="handleRefresh"
                  ></btn-operation>
                </div>

                <!-- 确认退款 -->
                <div v-if="showConfirmRefundBtn(item)">
                  <btn-operation
                    btn-type="confirmRefund"
                    :operation-order="item"
                    @onLoading="onLoading"
                    @unLoading="unLoading"
                    @refresh="handleRefresh"
                  ></btn-operation>
                </div>

                <!-- 处方药 审核通过/拒绝 -->
                <div v-if="env.MEDICINE && item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_CHECK.value2">
                  <!-- 待医院审核(禁止使用通过/拒绝操作) -->
                  <a class="table-href" href="javascript:;" @click="handlePassPrescription(item)">通过</a>
                  <a
                    class="table-href"
                    :class="{
                      'table-href-disable': item.orderStatus != orderStatusEnum.ORDER.STATUS.WAIT_CHECK.value2,
                    }"
                    href="javascript:;"
                    @click="handleRejectPrescription(item)"
                    style="color: #f00"
                    >拒绝</a
                  >
                </div>
              </td>
            </tr>
            <tr
              v-if="
                orderType.value !== orderStatusEnum.ORDER_TYPE.CHARGE.value &&
                orderType.value !== orderStatusEnum.ORDER_TYPE.GIFT_CARD.value
              "
              class="consignee-info-box"
            >
              <td :colspan="colspanTd">
                <div class="consignee-info" v-if="isProduct">
                  <template v-if="item.expressType === 0 && (item.tag3 & 4) !== 4">
                    <span class="address">自提门店：{{ item.storeAddress ? item.storeAddress : '-' }}</span>
                  </template>
                  <template v-else-if="item.expressType === 1">
                    <span class="receive">收件人：{{ item.consignee ? item.consignee : '-' }}</span>
                    <span class="tel">电话：{{ item.consigneeMobile ? item.consigneeMobile : '-' }}</span>
                    <span class="address">地址：{{ item.detailAddress ? item.detailAddress : '-' }}</span>
                  </template>
                </div>
                <div class="consignee-info" v-if="(isRooms || isTicket) && item.tourismOrderVO">
                  <span class="receive">联系人：{{ item.tourismOrderVO.name ? item.tourismOrderVO.name : '-' }}</span>
                  <span class="tel">电话：{{ item.tourismOrderVO.phone ? item.tourismOrderVO.phone : '-' }}</span>
                </div>
                <div class="pre-sale-info" v-if="item.preSell">
                  <span class="product-type">预售商品</span>

                  <span
                    class="remain-time"
                    v-if="item.pushWMS && item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value"
                    >已推单发货</span
                  >
                  <template
                    v-else-if="
                      !item.pushWMS &&
                      (item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_PAY.value ||
                        item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value)
                    "
                  >
                    <span class="delivery-time" v-if="item.expectShippingDate"
                      >发货时间：{{ item.expectShippingDate }}</span
                    >
                    <span class="remain-time">剩余：{{ computeRemainTime(item.countdown) }} </span>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--暂无数据时的展示-->
    <place-holder v-if="!(orderList && orderList.length)" />

    <!-- 订单预览弹窗dialog -->
    <preview-order-dialog
      v-model="showPreviewDialog"
      @preview-ok="handlePreviewOk"
      :order-list="mTotalCheckedList"
    ></preview-order-dialog>

    <!--批量导入-->
    <upload
      :visible.sync="showUploadDialog"
      :title="'批量导入'"
      :limit="1"
      @upload-success="onUploadSuccess"
      :upload-server-url="uploadOrderUrl"
      :need-template="false"
      :template-desc="'请以批量导出的订单作为模板，填写物流信息（注：数据量过大时，物流信息同步可能有延迟）'"
    >
    </upload>

    <!--备注dialog-->
    <el-dialog
      title="订单备注"
      width="500px"
      class="remark-dialog dss-dialog-wrapper-extension"
      v-loading="remarkLoading"
      :visible.sync="remarkDialogVisible"
    >
      <el-form :model="remarkInfo" :rules="remarkRules" label-position="left" ref="remarkForm">
        <el-form-item prop="message">
          <el-input type="textarea" v-model="remarkInfo.message" maxlength="128" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="remarkDialogVisible = false">取 消</el-button>
        <el-button class="primary-white" type="primary" @click="handleRemark('remarkForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改收货地址dialog -->
    <el-dialog
      title="编辑收货信息"
      width="500px"
      class="update-address-dealog"
      v-loading="addressLoading"
      :visible.sync="addressDialogVisible"
    >
      <el-form ref="addressForm" :model="addressForm" :rules="addressRules" label-width="100px">
        <el-form-item label="收件人姓名:" prop="consignee">
          <el-input
            placeholder="请输入收件人姓名"
            v-model.trim="addressForm.consignee"
            class="address-info-input"
            size="mini"
          ></el-input>
        </el-form-item>

        <el-form-item label="联系电话:" prop="consigneeMobile">
          <el-input
            placeholder="请输入联系电话"
            v-model.trim="addressForm.consigneeMobile"
            class="address-info-input"
            size="mini"
          ></el-input>
        </el-form-item>

        <el-form-item prop="area" class="required" label="收货地址:">
          <area-picker :area="addressForm.area" @choose="handleChangeArea"></area-picker>
        </el-form-item>

        <el-form-item label="详细地址:" prop="address">
          <el-input
            placeholder="请输入详细地址"
            v-model.trim="addressForm.address"
            class="address-info-input"
            size="mini"
          ></el-input>
          <div class="tips">注：客户详细收货地址，请准确填写</div>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button class="primary-white" type="primary" @click="handleSaveAddress('addressForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 温馨提示dialog -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">订单正在导出，请等候...</span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import '../order-list-table.less';
  import utils from '@/dss-common/utils';
  import date from '@/dss-common/utils/date';
  import moneyUtil from '@/dss-common/utils/money';
  import services from '@/dss-common/utils/services';
  import orderApi from '@/dss-wechat3rd/src/api/order';
  import constants from '@/dss-wechat3rd/src/constants/index';
  import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';
  import placeHolder from '@/dss-common/components/placeholder/index';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';
  import shippingDialog from '@/dss-wechat3rd/src/bz_components/shipping-dialog/index.vue';
  import PreviewOrderDialog from '../preview-order-dialog.vue';
  import btnOperation from '../btn-operation.vue';
  import Upload from '@/dss-common/components/upload/index.vue';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper';
  import exportExcel from '@/dss-common/utils/exportExcel';
  import areaPicker from '@/dss-wechat3rd/src/components/area-picker/index.vue';
  import regexps from '@/dss-common/utils/regexps';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import tplEnum from '@/dss-wechat3rd/src/views-retail/warehouse/freight-tpl/tpl-enum';
  import { CHANNEL as cardPackCHANNEL } from '@/dss-wechat3rd/src/constants/cardPackEnum';
  /*
 单价：单个商品的价格，单个SKU的价格
 小计：单个SKU价格 X 数量 =小计 actualFee
 合计：订单内，所有商品的小计相加后，得出合计 totalFee
 应付：理论上，等同于合计 totalFee
 实付：合计减各种优惠后以及加运费后，最终客户应当支付的金额 payFee
 抵扣：所有promFee后缀相加
*/

  export default {
    mixins: [tableCheckedHelperMixin],
    components: {
      placeHolder,
      shippingDialog,
      PreviewOrderDialog,
      btnOperation,
      Upload,
      areaPicker,
    },
    props: {
      /* 商品类型 */
      goodsType: {
        type: Object,
        default() {
          return goodsTypeEnum.product;
        },
      },

      /* 营销订单类型 */
      marketingType: {
        type: [Object, Array],
        default() {
          return {};
        },
      },

      /* 是否显示批量操作按钮 */
      showPatch: {
        type: Boolean,
        default: false,
      },
      /* 是否只展示预售商品信息，只展示预售商品信息时才显示批量推单的按钮 */
      filterPreSell: {
        type: Boolean,
        default: false,
      },
      /* 订单类型 */
      orderType: {
        type: Object,
        default: function () {
          return {};
        },
      },

      /* 订单类型 */
      filterType: {
        type: String,
        default: null,
      },

      orderTab: {
        type: String,
        default: null,
      },
      orderList: {
        type: Array,
        default: function () {
          return [];
        },
      },
      params: {
        type: Object,
        default: function () {
          return {};
        },
      },
      showShopGuideInfo: {
        type: Boolean,
        default: false,
      },
      isPowerExport: {
        type: Boolean,
        default: true,
      },
      isRefund: {
        type: Boolean,
        default: false,
      },
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
      toPageUnit(val) {
        return moneyUtil.convertHundredMoneyUnit(val, true);
      },
      bgImage(val) {
        if (val) {
          return {
            backgroundImage: 'url(' + val + ')',
          };
        }
      },
    },

    data() {
      const { money } = regexps;
      const checkPrice = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入价格'));
        } else if (!money.reg.test(value)) {
          return callback(new Error('请正确输入价格，最多保留两位小数点'));
        }
        return callback();
      };

      return {
        scopeMenuEnum,
        loading: false,
        showTipDialog: false,
        isSure: true,
        isReconciliationSure: true,
        cardEnum,
        goodsTypeEnum,
        orderStatusEnum,
        scopeImportGoodsOrder: true,
        scopeShippingGoods: true,
        scopeRefundButton: true,

        // 备注的对话框参数
        remarkLoading: false,
        remarkDialogVisible: false,
        remarkItem: null,
        remarkInfo: {
          orderNo: null,
          message: null,
        },
        remarkRules: {
          message: [{ required: true, message: '请输入备注信息', trigger: 'change' }],
        },
        // 是否未选择订单去批量导出的状态
        chooseOrderState: false,
        // 是否未选择订单去批量提前发货的状态
        chooseShipOrderState: false,
        // 是否未选择订单去批量对账单的状态
        chooseReconciliationState: false,
        // 是否展示订单预览弹窗
        showPreviewDialog: false,
        // 是否展示批量导入物流单号弹窗
        showUploadDialog: false,
        uploadOrderUrl: constants.Api.order.uploadOrder,
        unionKeys: this.filterType === 'refund-order' ? ['refundOrderNo'] : ['orderNo'],

        // 修改收货地址dialog参数
        addressLoading: false,
        addressDialogVisible: false,
        addressForm: {
          orderNo: null,
          consignee: null,
          consigneeMobile: null,
          area: [], // 选择的地址id集合，用于下拉组件选择
          areas: [], // 选择的地址详细信息集合，用于接口请求
          address: null,
        },
        addressRules: {
          consignee: [
            { required: true, message: '请输入收件人姓名', trigger: ['blur', 'change'] },
            { max: 10, message: '最大长度10个字符', trigger: ['blur', 'change'] },
          ],
          consigneeMobile: [
            { required: true, message: '请输入联系电话', trigger: ['blur', 'change'] },
            { pattern: regexps.phone.reg, message: regexps.phone.msg, trigger: 'blur' },
          ],
          area: [{ required: true, message: '请选择收货地址', trigger: ['blur', 'change'] }],
          address: [
            { required: true, message: '请输入详细地址', trigger: ['blur', 'change'] },
            { max: 60, message: '最大长度60个字符', trigger: ['blur', 'change'] },
          ],
        },

        pLoading: {
          submit: false,
          log: false,
        },
        actColumn: false,
        priceForm: {
          orderItemList: [],
        },
        priceRule: { price: [{ required: true, validator: checkPrice }] },
        pricePage: {
          pageNo: 1,
          pageSize: 6,
          totalCount: null,
          orderNo: '',
        },
        dailogTitle: null,
        cardPackCHANNEL, // 推广大使
      };
    },

    watch: {
      orderTab(newVal, oldVal) {
        this.mResetCheckedData();
        this.chooseOrderState = false;
        this.chooseShipOrderState = false;
      },
      orderList(newVal, oldVal) {
        this.mSetPageListChecked(this.orderList, this.unionKeys);
        this.mCheckIndeterminateChecked(this.orderList);
        this.mCheckAllSelected(this.orderList);
      },
      wkbScopeMenu: {
        immediate: true,
        handler() {
          this.queryUserManagement();
        },
      },
    },

    computed: {
      ...mapState({
        env: 'env',
        wkbScopeMenu: 'wkbScopeMenu',
        roleList: 'roleList',
        curApp: 'curApp',
        storeList: 'storeList',
      }),

      // 单元格横跨长度
      colspanTd() {
        if (this.isRooms || this.isTicket || this.isCardPack) {
          return '7';
        }
        return '6';
      },
      // 是否是商品类型
      isProduct() {
        return this.goodsType.type === goodsTypeEnum.product.type;
      },
      isEstate() {
        return this.goodsType.type === goodsTypeEnum.estate.type;
      },
      // 是否是客房类型
      isRooms() {
        return this.goodsType.type === goodsTypeEnum.rooms.type;
      },
      // 是否是票务类型
      isTicket() {
        return this.goodsType.type === goodsTypeEnum.ticket.type;
      },
      parseOrderTime() {
        return orderTime => {
          return utils.timeFormat(new Date(orderTime));
        };
      },
      // 是否展示批量导入物流单号按钮，只有代发货的订单才需要导入物流单号
      showUploadBtn() {
        return this.orderTab === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.name;
      },

      showBatchPreShipBtn() {
        return this.orderTab === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.name && this.filterPreSell;
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

      // 显示取消订单按钮
      showCanel() {
        return item => {
          return item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_PAY.value;
        };
      },

      // 判断是否显示修改收货地址按钮
      showUpdateAddress() {
        return item => {
          return (
            (item.orderStatus === orderStatusEnum.ORDER.STATUS.PAID.value || // 已支付
              item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value) && // 待发货
            item.expressType === orderStatusEnum.express_type.express && // 快递类型
            !this.isEstate
          );
        };
      },

      // 判断是否显示确认自提按钮
      showShipping() {
        return item => {
          return (
            (item.orderStatus === orderStatusEnum.ORDER.STATUS.PAID.value || // 已支付
              item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value) && // 待发货
            item.expressType === orderStatusEnum.express_type.self_extraction // 自提类型
          );
        };
      },

      // 预售剩余时间格式转化
      computeRemainTime() {
        return rTime => {
          if (rTime) {
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
      // 判断是否为申请退款状态，以便显示同意申请及拒绝申请按钮
      showRequestRefundBtn() {
        return item => {
          return item.status === orderStatusEnum.REFUND.STATUS.REQUEST_REFUND; // 申请退款
        };
      },

      // 判断是否为是否为退款退货类型且退款商品已发货状态，以便显示确认已退货按钮
      showConfirmRefundItemBtn() {
        return item => {
          let isShow = false;
          if (
            item.refundType === orderStatusEnum.refund_type.refund_item_and_money &&
            item.status === orderStatusEnum.REFUND.STATUS.REFUND_ITEM_SHIPPING
          ) {
            isShow = true;
          }
          return isShow;
        };
      },

      // 判断是否为是否为退款退货类型且确认已退货状态，以便显示确认退款按钮
      showConfirmRefundBtn() {
        return item => {
          let isShow = false;
          if (
            item.refundType === orderStatusEnum.refund_type.refund_item_and_money &&
            item.status === orderStatusEnum.REFUND.STATUS.CONFIRM_REFUND_ITEM
          ) {
            isShow = true;
          }
          return isShow;
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
      },

      showOrderDesc() {
        return item => {
          if (item.orderStatusDesc === '待人工审核') {
            return '待审核';
          }
          if (item.orderStatusDesc === '待医院审核') {
            return '医院审核中';
          }
          if (
            item.itemType === goodsTypeEnum.estate.value &&
            item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SUBSCRIBED.value
          ) {
            return orderStatusEnum.ORDER.STATUS.WAIT_SUBSCRIBED.label;
          }

          return item.orderStatusDesc;
        };
      },

      // 退款货物状态
      computeGoodsType() {
        return type => {
          switch (type) {
            case orderStatusEnum.refund_goods_type.have_goods:
              return '已收货';
            case orderStatusEnum.refund_goods_type.no_goods:
              return '未收货';
            default:
              return '';
          }
        };
      },

      // 判断是否为已拒绝退款状态，以便显示重置退款状态按钮
      showRefuseResetBtn() {
        return item => {
          return item.status === orderStatusEnum.REFUND.STATUS.REFUND_REJECT;
        };
      },

      // 判断是否为撤销退款申请状态，以便显示更新退款状态按钮，用户撤销申请后，重置退款状态为申请状态
      showUpdateRefundBtn() {
        return item => {
          return item.status === orderStatusEnum.REFUND.STATUS.REVERT_REFUND;
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

      // 代金卡包订单
      isCardPack() {
        return this.filterType === 'card-pack';
      },
    },

    methods: {
      /* 导出订单相关逻辑 */
      onAllCheckedChanged(checked) {
        this.mTogglePageListChecked(this.orderList, checked);
        if (this.chooseShipOrderState && checked) {
          this.orderList.forEach(order => {
            order.checked = !!order.showPushBtn;
          });
        }
        this.mCheckIndeterminateChecked(this.orderList);
        this.mUpdateTotalList(this.orderList, this.unionKeys);
      },
      onItemCheckedChanged(checked, orderItem) {
        this.mCheckAllSelected(this.orderList);
        this.mCheckIndeterminateChecked(this.orderList);
        this.mUpdateTotalList([orderItem], this.unionKeys);
      },

      /* 打开选择对账单订单状态 */
      toggleReconciliationOrder() {
        if (this.chooseShipOrderState || this.chooseOrderState) {
          this.chooseShipOrderState = false;
          this.chooseOrderState = false;
          this.mResetCheckedData();
          this.mTogglePageListChecked(this.orderList, false);
        }
        if (this.chooseReconciliationState && this.mTotalCheckedList.length) {
          this.showPreviewDialog = true;
        } else {
          this.chooseReconciliationState = !this.chooseReconciliationState;
        }
      },

      /* 打开选择订单状态 */
      toggleChooseOrder() {
        if (this.chooseShipOrderState || this.chooseReconciliationState) {
          this.chooseShipOrderState = false;
          this.chooseReconciliationState = false;
          this.mResetCheckedData();
          this.mTogglePageListChecked(this.orderList, false);
        }
        if (this.chooseOrderState && this.mTotalCheckedList.length) {
          this.showPreviewDialog = true;
        } else {
          if (this.orderList.length > 0) {
            this.chooseOrderState = !this.chooseOrderState;
          }
        }
      },

      toggleChooseOrderToShipping() {
        if (this.chooseOrderState || this.chooseReconciliationState) {
          this.chooseOrderState = false;
          this.chooseReconciliationState = false;
          this.mResetCheckedData();
          this.mTogglePageListChecked(this.orderList, false);
        }
        if (this.chooseShipOrderState && this.mTotalCheckedList.length) {
          this.showPreviewDialog = true;
        } else {
          this.chooseShipOrderState = !this.chooseShipOrderState;
        }
      },
      handlePreviewOk() {
        if (this.chooseOrderState) {
          this.doExportOrders();
        } else if (this.chooseShipOrderState) {
          this.doPreShipOrders();
        } else if (this.chooseReconciliationState) {
          this.doExportReconciliationOrders();
        }
      },
      // 获取用户是否为管理员
      queryUserManagement() {
        if (this.wkbScopeMenu) {
          const goodsOrderButton = scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.goodsOrderButton;
          const refundOrderButton = scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.refundOrderButton;

          const scopeShippingGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
            this.wkbScopeMenu,
            goodsOrderButton.shipping_action
          );
          this.scopeShippingGoods = !!scopeShippingGoodsButton && !!scopeShippingGoodsButton.status;

          const scopeRefundButton = scopeMenuEnum.getMenuScopeByIdentifier(
            this.wkbScopeMenu,
            refundOrderButton.refund_action
          );
          this.scopeRefundButton = !!scopeRefundButton && !!scopeRefundButton.status;
        }
      },
      // 导出订单
      doExportOrders() {
        const orderNoList = [];
        let itemType = null;
        if (this.orderType && this.orderType.value !== undefined) {
          itemType = this.orderType.value;
        }

        this.mTotalCheckedList.forEach(order => {
          if (this.filterType === 'refund-order') {
            orderNoList.push(order.refundOrderNo);
          } else {
            orderNoList.push(order.orderNo);
          }
        });

        const params = {
          itemType: itemType,
        };

        if (this.filterType === 'refund-order') {
          params.refundOrderNoList = orderNoList;
        } else {
          params.orderNoList = orderNoList;
        }

        // 判断是否为退款订单
        const api =
          this.filterType === 'refund-order' ? constants.Api.order.exportRefund : constants.Api.order.exportOrder;
        // post下载
        exportExcel.download(api, params).then(res => {
          this.chooseOrderState = false;
          this.mResetCheckedData();
          this.mTogglePageListChecked(this.orderList, false);
          this.$message({
            message: '导出订单成功，正在下载',
            type: 'success',
          });
        });
      },

      // 批量导出对账单
      doExportReconciliationOrders() {
        const orderNoList = [];
        let itemType = null;
        if (this.orderType && this.orderType.value !== undefined) {
          itemType = this.orderType.value;
        }

        this.mTotalCheckedList.forEach(order => {
          orderNoList.push(order.orderNo);
        });

        const params = {
          itemType: itemType,
        };
        params.orderNoList = orderNoList;

        // 判断是否为退款订单
        const api = constants.Api.order.patchReconciliationOrder;
        // post下载
        exportExcel.download(api, params).then(res => {
          this.chooseOrderState = false;
          this.mResetCheckedData();
          this.mTogglePageListChecked(this.orderList, false);
          this.$message({
            message: '导出订单成功，正在下载',
            type: 'success',
          });
        });
      },

      doPreShipOrders(singleItem) {
        const orderNoList = [];
        if (singleItem) {
          orderNoList.push(singleItem.orderNo);
        } else {
          this.mTotalCheckedList.forEach(order => {
            orderNoList.push(order.orderNo);
          });
        }
        const params = {
          orderNoList: orderNoList,
        };
        this.loading = true;
        services
          .json(constants.Api.order.preShipOder, params, {
            action: '提前发货',
          })
          .done(res => {
            this.$message.success('提前发货成功');
            this.chooseShipOrderState = false;
            this.mResetCheckedData();
            this.mTogglePageListChecked(this.orderList, false);
            this.$emit('refresh');
          })
          .always(() => {
            this.loading = false;
          });
      },

      gatDay(params) {
        const startTime = new Date(params.startDate);
        const endTime = new Date(params.endDate);
        const time = endTime.getTime() - startTime.getTime();
        const day = parseInt(time / (1000 * 60 * 60 * 24));
        return day;
      },

      patchOrder() {
        this.$confirm('确定一键导出过滤后的订单吗？ ', '一键导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            let params = this.$plain(this.params);
            delete params.pageNo;
            delete params.pageSize;
            const itemTypeList = [];
            if (this.filterType === 'refund-order') {
              Object.keys(params).forEach(key => {
                if (key.indexOf('integerList') >= 0) {
                  if (params[key] !== null) {
                    itemTypeList.push(params[key]);
                  }
                  delete params[key];
                }
              });
              if (itemTypeList.length) {
                params = { ...params, integerList: itemTypeList };
              }
            } else {
              Object.keys(params).forEach(key => {
                if (key.indexOf('itemTypeList') >= 0) {
                  if (params[key] !== null) {
                    itemTypeList.push(params[key]);
                  }
                  delete params[key];
                }
              });
              params = { ...params, itemTypeList: itemTypeList };
            }

            const day = this.gatDay(params);

            if (!params.startDate || !params.endDate) {
              return this.$message({
                message: '请选择导出数据的时间',
                type: 'error',
              });
            } else if (day > 30) {
              return this.$message({
                message: '时间跨度不得超过31天',
                type: 'error',
              });
            }
            // 判断是否为退款订单
            const api =
              this.filterType === 'refund-order' ? constants.Api.order.exportRefund : constants.Api.order.exportOrder;
            // post下载
            this.isSure = false;
            this.showTipDialog = true;
            exportExcel
              .download(api, params)
              .then(res => {
                this.$message({
                  message: '导出订单成功，正在下载',
                  type: 'success',
                });
              })
              .always(() => {
                this.isSure = true;
                this.showTipDialog = false;
              });
          })
          .catch(() => {
            console.log('取消一键导出');
          });
      },

      // 导出对账单
      patchReconciliationOrder() {
        this.$confirm('确定一键导出对账单吗？ ', '一键导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            let params = this.$plain(this.params);
            delete params.pageNo;
            delete params.pageSize;
            const itemTypeList = [];
            Object.keys(params).forEach(key => {
              if (key.indexOf('itemTypeList') >= 0) {
                if (params[key] !== null) {
                  itemTypeList.push(params[key]);
                }
                delete params[key];
              }
            });
            params = { ...params, itemTypeList: itemTypeList };

            const day = this.gatDay(params);

            if (!params.startDate || !params.endDate) {
              return this.$message({
                message: '请选择导出数据的时间',
                type: 'error',
              });
            } else if (day > 30) {
              return this.$message({
                message: '时间跨度不得超过31天',
                type: 'error',
              });
            }
            // 判断是否为退款订单
            const api = constants.Api.order.patchReconciliationOrder;
            // post下载
            this.isReconciliationSure = false;
            this.showTipDialog = true;
            exportExcel
              .download(api, params)
              .then(res => {
                this.$message({
                  message: '导出对账单成功，正在下载',
                  type: 'success',
                });
              })
              .always(() => {
                this.isReconciliationSure = true;
                this.showTipDialog = false;
              });
          })
          .catch(() => {
            console.log('取消一键导出');
          });
      },

      // 上传成功后的回调
      onUploadSuccess(message) {
        if (message) {
          this.$message.error(message);
        } else {
          this.$message.success('上传成功');
          this.showUploadDialog = false;
        }
      },
      // 跳转订单详情页面
      handleShowDetail(item) {
        // 退款订单跳转到退款详情页，其他订单跳转到普通的订单详情页
        if (item.refundOrderNo) {
          if (location.href.indexOf('wkb.html') === -1) {
            location.href = 'wkb.html#/refund/list/detail?refundOrderNo=' + item.refundOrderNo;
          } else {
            this.$router.push({
              path: '/refund/list/detail',
              query: {
                refundOrderNo: item.refundOrderNo + '',
                itemType: this.goodsType.value,
                filterType: this.filterType,
              },
            });
          }
        } else {
          if (location.href.indexOf('wkb.html') === -1) {
            location.href = 'wkb.html#/order/list/detail?orderNo=' + item.orderNo;
          } else if (Object.keys(this.marketingType).length !== 0) {
            // 营销类型 - 秒杀订单
            this.$emit('handleShowDetail', {
              orderNo: item.orderNo + '',
              itemType: this.goodsType.value,
              filterType: this.filterType,
            });
          } else if (this.isEstate) {
            this.$router.push({
              path: '/estate/order-mgr/detail',
              query: {
                orderNo: item.orderNo + '',
                itemType: this.goodsType.value,
              },
            });
          } else {
            // 路由跳转，当前路由加detail
            const path = this.$route.path || '/order/list/detail';
            const query = {
              orderNo: item.orderNo + '',
              itemType: this.goodsType.value,
            };
            if (this.orderStatusEnum.ORDER.STATUS.WAIT_CHECK.name === this.orderTab) {
              query.orderTab = this.orderTab;
            }
            this.$router.push({
              path: path + '/detail',
              query: {
                orderNo: item.orderNo + '',
                itemType: this.goodsType.value,
                filterType: this.filterType,
              },
            });
          }
        }
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
            services
              .get(constants.Api.order.remark, {
                params,
                action: '添加备注',
              })
              .done(res => {
                this.remarkDialogVisible = false;
                this.$emit('refresh');
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

          const params = {
            ...this.addressForm,
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
          services
            .get(constants.Api.order.updateAddress, {
              action: '修改收货地址',
              params,
            })
            .done(res => {
              this.$message.success('修改收货地址成功');
              this.addressDialogVisible = false; // 隐藏修改收货地址dialog
            })
            .always(() => {
              this.loading = false;
            });
        });
      },

      // 确认取消订单
      confirmCancel(item) {
        this.$confirm('是否确认取消订单？', '取消订单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.loading = true;
            const params = {
              orderNo: item.orderNo,
            };

            orderApi
              .cancel(params)
              .then(res => {
                this.$message.success('取消订单成功！');
                this.$emit('refresh');
              })
              .always(() => {
                this.loading = false;
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消确认自提',
            });
          });
      },

      // 确认自提
      confirmSelfPickup(item) {
        this.$confirm('是否确认该订单已自提？', '确认自提', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.loading = true;
            const params = {
              orderNo: item.orderNo,
            };

            services
              .get(constants.Api.order.selfPickup, {
                params,
                action: '确认自提',
              })
              .done(res => {
                this.$message.success('确认自提成功！');
                this.$emit('refresh');
              })
              .always(() => {
                this.loading = false;
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消确认自提',
            });
          });
      },

      /**
       * 更新退款状态，用户撤销申请后，重置退款状态为申请状态
       */
      handleUpdateRefundStatus(item) {
        const params = {
          refundOrderNo: item.refundOrderNo || null,
        };

        this.loading = true;
        services
          .get(constants.Api.order.refundReRequest, {
            action: '更新退款状态',
            params,
          })
          .done(res => {
            this.$message.success('更新退款状态');
          })
          .always(() => {
            this.loading = false;
          });
      },

      /**
       * 通过审核之前，再次确认
       */
      handlePassPrescription(item) {
        // 待医院审核（自动审核）,不需要人工审核
        if (item.orderStatus !== this.orderStatusEnum.ORDER.STATUS.WAIT_CHECK.value2) return;

        this.$confirm('确认审核通过吗？', '审核通过', {
          center: true,
          confirmButtonText: '确认通过',
          cancelButtonText: '考虑一下',
          type: 'warning',
        })
          .then(async () => {
            // 通过
            const { data } = await orderApi.prescriptionApproval({
              orderNo: item.orderNo,
            });

            if (data) {
              this.$message.success('审核成功！');
              this.handleRefresh();
            }
          })
          .catch(() => {
            // 取消
          });
      },

      /**
       * 审核不通过，需要输入理由
       */
      handleRejectPrescription(item) {
        // 待医院审核（自动审核）,不需要人工审核
        if (item.orderStatus !== this.orderStatusEnum.ORDER.STATUS.WAIT_CHECK.value2) return;

        this.$prompt('确认拒绝订单吗？', '拒绝订单', {
          confirmButtonText: '残忍拒绝',
          cancelButtonText: '考虑一下',
          inputPlaceholder: '请输入拒绝理由(必填)',
          center: true,
          inputValidator: (str = '') => {
            const len = str ? str.trim().length : '';
            return len >= 1 && len <= 20;
          },
          inputErrorMessage: '拒绝理由字数限制为：1-20个字符',
        })
          .then(async ({ value }) => {
            // 不通过
            const { data } = await orderApi.prescriptionRefuse({
              orderNo: item.orderNo,
              refuseReason: value,
            });
            // console.log(data);
            if (data) {
              this.$message.warning('已拒绝！');
              this.handleRefresh();
            }
          })
          .catch(() => {});
      },

      // 显示loading
      onLoading() {
        this.loading = true;
      },
      // 隐藏loading
      unLoading() {
        this.loading = false;
      },

      // 刷新退款列表
      handleRefresh() {
        this.$emit('refresh');
      },
    },
  };
</script>
