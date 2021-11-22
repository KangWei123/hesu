<template>
  <div class="order-detail-container" v-loading="loading" v-if="orderNo">
    <div class="order-info">
      <div class="order-info__title">订单基本信息</div>
      <div class="order-info-label">
        <span style="color: #fa7516"
          ><span style="color: #717378">状态：</span>{{ orderDetail ? orderDetail.orderStatusDesc : '-' }}</span
        >
        <div class="pre-sell" v-if="orderDetail && orderDetail.preSell">
          <span class="order-type">预售订单</span>
          <span
            class="remain-time"
            v-if="orderDetail.pushWMS && orderDetail.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value"
          >
            已推单发货
          </span>
          <template
            v-else-if="
              !orderDetail.pushWMS &&
              (orderDetail.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_PAY.value ||
                orderDetail.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value)
            "
          >
            <span class="delivery-time" v-if="orderDetail.expectShippingDate"
              >发货时间：{{ orderDetail.expectShippingDate }}</span
            >
            <span class="remain-time">剩余：{{ computeRemainTime(remainTime ? remainTime : 0) }} </span>
          </template>
        </div>
      </div>
      <div class="order-info-label"><span>订单编号：</span>{{ orderDetail ? orderDetail.orderNo : '-' }}</div>
      <div class="order-info-label">
        <span>下单时间：</span>{{ computeOrderTime(orderDetail ? orderDetail.orderTime : null) }}
      </div>
      <div class="order-info-label">
        <span>付款时间：</span>{{ computeOrderTime(orderDetail ? orderDetail.payTime : null) }}
      </div>
      <div class="order-info-label" v-if="orderDetail && orderDetail.shippingTime">
        <span>发货时间：</span>{{ computeOrderTime(orderDetail ? orderDetail.shippingTime : null) }}
      </div>
      <div class="order-info-label" v-if="orderDetail && orderDetail.completeTime">
        <span>完成时间：</span>{{ computeOrderTime(orderDetail ? orderDetail.completeTime : null) }}
      </div>

      <div v-if="orderDetail && orderDetail.tourismOrderVO && orderDetail.itemType === mgrTypeEnum.hotel.value">
        <div class="order-info-label">
          <span>预约入住：</span>{{ computeOrderTime(orderDetail ? orderDetail.tourismOrderVO.beginTime : null) }}
        </div>
        <div class="order-info-label">
          <span>离店时间：</span>{{ computeOrderTime(orderDetail ? orderDetail.tourismOrderVO.endTime : null) }}
        </div>
      </div>
      <div
        class="order-info-label"
        v-if="orderDetail && orderDetail.tourismOrderVO && orderDetail.itemType === mgrTypeEnum.ticket.value"
      >
        <span>有效期：</span>
        <template v-if="orderDetail.tourismOrderVO.ticketType === mgrTypeEnum.ticket.oddDay.value">
          {{ orderDetail.tourismOrderVO.endTime | getData(-1) }}
        </template>
        <template v-else>
          {{ orderDetail.tourismOrderVO.beginTime | time('YYYY-MM-DD') }} -
          {{ orderDetail.tourismOrderVO.endTime | time('YYYY-MM-DD') }}
        </template>
      </div>
      <div v-if="orderDetail && orderDetail.estateOrderVO">
        <div class="order-info-label">
          <span>认筹项目：</span
          >{{ orderDetail && orderDetail.itemList[0].itemName ? orderDetail.itemList[0].itemName : '-' }}
        </div>
        <div class="order-info-label">
          <span>意向房源：</span
          >{{ orderDetail && orderDetail.itemList[0].itemAttribute ? orderDetail.itemList[0].itemAttribute : '-' }}
        </div>
        <div v-if="orderDetail && orderDetail.estateOrderVO.buildArea" class="order-info-label">
          <span>建筑面积：</span
          >{{ orderDetail && orderDetail.estateOrderVO.buildArea ? orderDetail.estateOrderVO.buildArea : '-' }}/m<sup
            >2</sup
          >
        </div>
        <div class="order-info-label">
          <span>置业顾问：</span
          >{{ orderDetail && orderDetail.estateOrderVO.adviserName ? orderDetail.estateOrderVO.adviserName : '-' }}
          {{ orderDetail && orderDetail.estateOrderVO.adviserPhone ? orderDetail.estateOrderVO.adviserPhone : '-' }}
        </div>
      </div>

      <div class="order-info-label">
        <span>商家备注：</span>{{ orderDetail && orderDetail.sellerMessage ? orderDetail.sellerMessage : '- -' }}
      </div>

      <div class="order-info-label" v-if="orderDetail && (orderDetail.tag3 & 2) === 2">
        <span>自提门店：</span>{{ orderDetail && orderDetail.storeAddress ? orderDetail.storeAddress : '-' }}
      </div>

      <div class="order-info-label" v-if="orderDetail && (orderDetail.tag3 & 4) === 4">
        <span>收货地址：</span>{{ orderDetail && orderDetail.userAddress ? orderDetail.userAddress : '-' }}
      </div>

      <div class="order-info-user" v-if="orderDetail && orderDetail.estateOrderVO">
        <div class="order-info-label">
          <span>客户姓名：</span
          >{{ orderDetail && orderDetail.estateOrderVO.name ? orderDetail.estateOrderVO.name : '-' }}
        </div>
        <div class="order-info-label">
          <span>手机电话：</span
          >{{ orderDetail && orderDetail.estateOrderVO.phone ? orderDetail.estateOrderVO.phone : '-' }}
        </div>
        <div class="order-info-label">
          <span>身份证号：</span
          >{{ orderDetail && orderDetail.estateOrderVO.idCardNo ? orderDetail.estateOrderVO.idCardNo : '-' }}
        </div>
        <div class="order-info-label">
          <span>地址：</span
          >{{ orderDetail && orderDetail.estateOrderVO.address ? orderDetail.estateOrderVO.address : '-' }}
        </div>
      </div>

      <!-- 推广大使订单信息 -->
      <template v-if="isCardPack && orderDetail">
        <div class="order-info-label">
          <span>订单渠道：</span
          >{{
            orderDetail.channel === cardPackCHANNEL.PROMOTION.value
              ? cardPackCHANNEL.PROMOTION.label
              : cardPackCHANNEL.REGION.label
          }}
        </div>

        <template v-if="orderDetail.channel === cardPackCHANNEL.PROMOTION.value">
          <div class="order-info-label">
            <span>推广大使：</span
            ><img v-if="!!orderDetail.promoterAvatar" :src="orderDetail.promoterAvatar" class="promoter-avatar" />
            {{ orderDetail.promoterName || '--' }}
          </div>
          <div class="order-info-label"><span>推广导购：</span>{{ orderDetail.promoterEmployeeName || '--' }}</div>
        </template>
      </template>
    </div>

    <div class="order-info-block">
      <!-- 会员信息 -->
      <div class="member-info order-info__item">
        <div class="order-info__title">会员信息</div>
        <div class="member-content">
          <img
            style="margin-top: 10px"
            v-if="orderDetail && orderDetail.userWxAvstar"
            :src="orderDetail && orderDetail.userWxAvstar"
            class="icon"
          />
          <div v-else class="member-default-avatar">
            {{ orderDetail && orderDetail.userWxNickName ? orderDetail.userWxNickName.substr(0, 1) : 'N/A' }}
          </div>
          <div class="member-content__item">
            <div class="member-info-label">
              <span>会员昵称：</span
              >{{ orderDetail && orderDetail.userWxNickName ? orderDetail.userWxNickName : '- -' }}
            </div>
            <div class="member-info-label">
              <span>会员姓名：</span>{{ orderDetail && orderDetail.realName ? orderDetail.realName : '- -' }}
            </div>
            <div class="member-info-label">
              <span>联系电话：</span>{{ orderDetail && orderDetail.userMobile ? orderDetail.userMobile : '- -' }}
            </div>
            <div class="member-info-label" v-if="showShopGuideInfo">
              <span>归属导购：</span>{{ orderDetail && orderDetail.employeeName ? orderDetail.employeeName : '- -' }}
              <span
                v-if="roleList.indexOf('common_role_storeKeeper') !== -1"
                style="margin-left: 8px; color: #3879fb; cursor: pointer; vertical-align: baseline"
                @click="showChangeBelong"
                >修改</span
              >
            </div>
            <div class="member-info-label" v-if="orderDetail && (orderDetail.tag3 & 2) === 2">
              <span>下单导购：</span>{{ orderDetail.createdEmployeeName || '- -' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 收件人信息 -->
      <div
        class="order-info order-info__item"
        v-if="orderDetail && orderDetail.consignee && orderDetail && orderDetail.detailAddress"
      >
        <div class="order-info__title">收货人信息</div>
        <el-scrollbar style="height: 120px">
          <div class="order-info-label">
            <span>收货人：</span>{{ orderDetail && orderDetail.consignee ? orderDetail.consignee : '-' }}
          </div>
          <div class="order-info-label">
            <span>收货地址：</span>
            <span class="label-desc">{{
              orderDetail && orderDetail.detailAddress ? orderDetail.detailAddress : '-'
            }}</span>
          </div>
          <div class="order-info-label">
            <span>客户留言：</span>
            <span class="label-desc">{{ orderDetail && orderDetail.userMessage ? orderDetail.userMessage : '-' }}</span>
          </div>
          <div class="order-info-label">
            <span>物流信息：</span>
            <span class="label-desc">{{ computeShippingInfo }}</span>
          </div>
          <div class="order-info-label" v-if="orderDetail && orderDetail.shippingNo">
            <span>物流单号：</span>{{ orderDetail.shippingNo }}
          </div>
        </el-scrollbar>
      </div>

      <!-- 旅游行业联系人信息 -->
      <div class="order-info order-info__item" v-if="orderDetail && orderDetail.tourismOrderVO">
        <div class="order-info__title">联系人信息</div>
        <div class="order-info-label">
          <span>联系人：</span
          >{{ orderDetail && orderDetail.tourismOrderVO.name ? orderDetail.tourismOrderVO.name : '-' }}
        </div>
        <div class="order-info-label">
          <span>电话：</span
          >{{ orderDetail && orderDetail.tourismOrderVO.phone ? orderDetail.tourismOrderVO.phone : '-' }}
        </div>
        <div class="order-info-label">
          <span>证件号码：</span
          >{{ orderDetail && orderDetail.tourismOrderVO.iDCard ? orderDetail.tourismOrderVO.iDCard : '-' }}
        </div>
      </div>
    </div>

    <div class="order-content">
      <!-- 商品信息 -->
      <div class="goods-info" v-if="orderDetail && orderDetail.itemList">
        <!-- <div class="order-content-title"></div> -->
        <div class="goods-info-content goods-info-head" style="border: 0">
          <div class="desc">{{ isEstate ? '楼盘' : '商品' }}信息</div>
          <div v-if="!isEstate" class="money">数量</div>
          <div class="receipt">运费&抵扣</div>
          <div class="pay">{{ isEstate ? '认筹金' : '实价' }}</div>
        </div>
        <div class="goods-info-content" v-for="(item, index) in orderDetail.itemList" :key="index">
          <div class="desc goods-info-desc">
            <img class="goods-image" v-if="item.thumbnail" :src="item.thumbnail" />
            <img
              class="goods-image"
              v-else
              :src="orderDetail.itemType === cardEnum.cardType.timesCard ? timeCardBg : chargeCardBg"
            />

            <div class="goods-info-desc-content">
              <span
                >{{ isEstate ? '楼盘' : '产品' }}：<i
                  style="font-style: normal; color: #f00; font-size: 14px; margin-right: 4px; vertical-align: 1px"
                  v-if="showPrescription && item.drugType == 1"
                  >处方药</i
                >{{ item.itemName }}</span
              >
              <span v-if="item.itemAttribute" style="color: #999">{{ item.itemAttribute }}</span>
              <span class="price" v-if="isEstate"
                >均价：￥{{
                  ((orderDetail.estateOrderVO && orderDetail.estateOrderVO.averagePriceRange) || 0) | price
                }}/m<sup>2</sup></span
              >
              <span v-else
                >单价：
                <span style="color: red; display: inline-block"
                  >￥{{ item.salePrice | price
                  }}{{ item.consumeIntegral && item.itemMode ? `+${item.consumeIntegral}积分` : '' }}
                </span>
                <span style="margin-left: 25px; display: inline-block" v-if="item.giftAmount"
                  >赠送金额：￥{{ item.giftAmount | price }}
                </span>
              </span>

              <div
                class="contract-info-content"
                v-if="
                  isEstate &&
                  orderDetail.orderStatus !== orderStatusEnum.ORDER.STATUS.CANCELED.value &&
                  orderDetail.orderStatus !== orderStatusEnum.ORDER.STATUS.WAIT_SUBSCRIBED.value
                "
              >
                <span @click="hanldeDownContract">合同下载</span>
              </div>
            </div>
          </div>
          <div v-if="!isEstate" class="money out-box">
            <div class="inner-box">
              <!-- 叁拾加重量 -->
              <span v-if="item.itemWeight && orderDetail.itemType !== orderStatusEnum.ORDER_TYPE.GIFT.value"
                >{{ item.itemWeight }}{{ item.itemUnit }}</span
              >
              <span v-else-if="!isEstate">{{ item.itemCount }}</span>
              <!--小计: ￥{{item.salePrice * item.itemCount |price}}</span>-->
              <!-- <span v-if="orderDetail.estateOrderVO && orderDetail.estateOrderVO.identifyFee"
                >认筹金：￥{{ orderDetail.estateOrderVO && orderDetail.estateOrderVO.identifyFee | price }}</span
              > -->
              <!-- <span v-if="!isEstate">小计: ￥{{ item.actualFee | price }}</span> -->
              <!-- <span v-if="handleOptionsHidden">运费: {{ item.logisticsFee | price}}</span> -->
              <template v-if="isRooms">
                <el-button
                  size="mine"
                  v-if="orderDetail.orderStatus === orderSFtatusEnum.HOTEL.STATUS.PAID.value"
                  type="primary"
                  class="table-btn"
                  @click="checkingIn(orderDetail.orderNo)"
                  >入住</el-button
                >
                <span v-if="orderDetail.orderStatus === orderStatusEnum.HOTEL.STATUS.CHECK_IN.value">{{
                  orderDetail.orderStatusDesc
                }}</span>
              </template>
            </div>
          </div>

          <!-- 优惠信息，拼团跟砍价的优惠信息用订单维度的参数，其他优惠信息用商品维度的参数 -->
          <div class="receipt out-box">
            <div class="inner-box">
              <!--参加加价购的商品需要根据tag值做判断-->
              <div class="span" v-if="((1 << 15) & item.tag1) === 1 << 15">
                加价购折扣：￥-{{ (item.actualFee - item.payFee) | price }}
              </div>
              <div class="span" v-if="item.groupLeaderPromFee || item.groupPromFee">
                拼团：￥-{{ computeGroupPromFee(item) | price }}
              </div>
              <div class="span" v-if="item.bargainPromFee">砍价：￥-{{ item.bargainPromFee | price }}</div>
              <div class="span" v-if="item.secKillPromFee">秒杀：￥-{{ item.secKillPromFee | price }}</div>
              <div class="span" v-if="item.offsetCashFee && !item.itemMode">
                积分抵扣: -{{ item.offsetCashFee | price }}(消耗{{ item.consumeIntegral }}积分)
              </div>
              <!-- <div v-if="item.consumeIntegral && item.itemMode">积分：{{ item.consumeIntegral }}</div> -->
              <div class="span" v-if="item.innerBuyPromFee">内购券：￥-{{ item.innerBuyPromFee | price }}</div>
              <div class="span" v-if="item.cardPromFee">卡项：￥-{{ item.cardPromFee | price }}</div>
              <div class="span" v-if="item.cashPromFee">现金：￥-{{ item.cashPromFee | price }}</div>
              <div class="span" v-if="item.couponPromFee">优惠券：￥-{{ item.couponPromFee | price }}</div>
              <div class="span" v-if="item.redPacketPromFee">红包：￥-{{ item.redPacketPromFee | price }}</div>
              <div class="span" v-if="item.userGiftCardPromFee">礼品卡：￥-{{ item.userGiftCardPromFee | price }}</div>
              <div class="span" v-if="item.memberPromFee">会员：￥-{{ item.memberPromFee | price }}</div>

              <!-- 无折扣时默认值 -->
              <div class="span" v-if="item.actualFee === item.payFee">- -</div>
            </div>
          </div>

          <!-- 实收 -->
          <div class="pay out-box">
            <div class="inner-box">
              <!-- 地产认筹金 -->
              <span v-if="orderDetail.estateOrderVO && orderDetail.estateOrderVO.identifyFee">
                ￥{{ orderDetail.estateOrderVO && orderDetail.estateOrderVO.identifyFee | price }}
              </span>
              <span v-else
                >￥{{ item.payFee | price }}{{ item.consumeIntegral ? `+${item.consumeIntegral}积分` : '' }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 处方信息 -->
      <div class="prescription-info" v-if="drugs">
        <div class="prescription-info-title">处方信息</div>
        <div class="prescription-content">
          <span v-if="drugs.drugUser && drugs.drugUser.realName">{{ drugs.drugUser.realName }}</span>
          <span class="line-vertical"></span>
          <span v-if="drugs.drugUser && drugs.drugUser.gender">{{ drugs.drugUser.gender }}</span>
          <span class="line-vertical" v-if="drugs.drugUser.gender"></span>
          <span v-if="drugs.drugUser && drugs.drugUser.age">{{ drugs.drugUser.age }}岁</span>
          <span
            class="status"
            :class="{
              'href-disable': drugApprove == 0,
              'green-txt': drugApprove == 1 || drugApprove == 2 || drugApprove == 4,
              'wran-text': drugApprove == 3,
            }"
          >
            {{ drugs.status | filterDrugApprove }}</span
          >
          <!-- href="http://test.open.gzch120.com/open/file/2020/7/13/730875741462175429.pdf"  -->
          <a
            :href="!disablePdfUrl ? 'javascript:;' : drugs.pdfUrl"
            class="detail-btn"
            :class="[!disablePdfUrl && 'href-disable']"
            :target="!disablePdfUrl ? '' : '_blank'"
            >处方单详情</a
          >
        </div>
      </div>

      <!-- 发货单 -->
      <div
        class="invoice-info"
        v-if="
          orderDetail &&
          (orderDetail.expressType === orderStatusEnum.express_type.express ||
            orderDetail.expressType === orderStatusEnum.express_type.city_delivery) &&
          orderLogisticsVOList.length > 0
        "
      >
        <!-- <div class="order-content-title">发货单</div> -->
        <div class="invoice-content invoice-content-head">
          <div class="invoice-goods-tab flex-2">发货信息</div>
          <div class="invoice-goods-tab">出库单号</div>
          <div class="invoice-goods-tab">物流信息</div>
          <div class="invoice-goods-tab">操作</div>
        </div>
        <div class="invoice-content" v-for="(olvoItem, idx) in orderLogisticsVOList" :key="idx">
          <div class="invoice-goods-tab flex-2" style="overflow: hidden; padding-right: 20px">
            <el-scrollbar style="height: 112px">
              <div>
                <div
                  class="invoice-goods-info"
                  style="display: flex"
                  v-for="(item, index) in olvoItem.itemList"
                  :key="index"
                >
                  <img class="goods-image" :src="item.thumbnail" />

                  <div class="goods-info-desc">
                    <p class="limit-line-ellipsis">
                      <i
                        style="font-style: normal; color: #f00; font-size: 14px; margin-right: 4px; vertical-align: 1px"
                        v-if="showPrescription && item.drugType == 1"
                        >处方药</i
                      >{{ item.itemName }}
                    </p>
                    <!-- <p v-if="item.itemAttribute">{{ item.itemAttribute }}</p> -->
                    <p>
                      <span class="salePrice" v-if="item.salePrice">单价：￥{{ item.salePrice | price }}</span>
                      <span class="itemCount">x{{ item.count }}</span>
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
          <div class="invoice-goods-tab">
            <div
              class="logistics-info"
              v-if="
                olvoItem.status === orderStatusEnum.LOGISTICS.STATUS.DELIVERING ||
                olvoItem.status === orderStatusEnum.LOGISTICS.STATUS.DELIVERED
              "
            >
              <p>发货仓库：{{ olvoItem && olvoItem.warehouseName ? olvoItem.warehouseName : '-' }}</p>
              <p>
                物流信息：{{ olvoItem && olvoItem.shippingCompany ? olvoItem.shippingCompany : '-' }}
                {{ olvoItem && olvoItem.shippingNo ? olvoItem.shippingNo : '-' }}
              </p>
              <p>
                物流状态：
                <span v-if="olvoItem && olvoItem.logisticsDTO">{{ olvoItem.logisticsDTO.logisticsType }}</span>
                <span v-else>{{ olvoItem && olvoItem.statusDesc ? olvoItem.statusDesc : '-' }}</span>
              </p>
              <p>
                <span>物流追踪：</span>
                <span v-if="olvoItem && olvoItem.logisticsDTO">{{ olvoItem.logisticsDTO.context }}</span>
                <span v-else>--</span>
              </p>
            </div>
            <div v-else>- -</div>
          </div>
          <div class="invoice-goods-tab">
            <div class="btn-box" v-if="olvoItem.status === orderStatusEnum.LOGISTICS.STATUS.TO_DELIVERY">
              <!-- 处方药审核通过/不通过 -->
              <div v-if="showDrugType">
                <a
                  class="table-href"
                  :class="[drugApprove != 1 && 'href-disable']"
                  href="javascript:;"
                  @click="handlePassPrescription(olvoItem)"
                  >通过</a
                >
                <a
                  class="table-href"
                  href="javascript:;"
                  :class="[drugApprove != 1 && 'href-disable']"
                  @click="handleRejectPrescription(olvoItem)"
                  style="color: #f00"
                  >拒绝</a
                >
              </div>
              <!-- 第三方仓库不展示确认发货 -->
              <div v-if="showConfirmReceipt(olvoItem)">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  v-if="!scopeShippingGoods"
                  :content="scopeMenuEnum.disabledBtnTip"
                >
                  <a href="javascript:;" slot="reference">确认发货</a>
                </el-popover>
                <a v-else class="table-href" href="javascript:;" @click="handleShowShippingDialog(olvoItem.outBoundNo)"
                  >确认发货</a
                >
              </div>

              <!-- 修改收货地址 -->
              <div v-if="showUpdateAddress">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  v-if="!scopeShippingGoods"
                  :content="scopeMenuEnum.disabledBtnTip"
                >
                  <a href="javascript:;" slot="reference">修改收货地址</a>
                </el-popover>
                <a v-else class="table-href" href="javascript:;" slot="reference" @click="handleUpdateAddress"
                  >修改收货地址</a
                >
              </div>

              <span v-else>{{ olvoItem.warehouseName }}：{{ olvoItem.statusDesc }}</span>
            </div>
            <div v-else>- -</div>
          </div>
        </div>
      </div>

      <!-- 流水信息 -->
      <div class="waterBill-info">
        <!-- <div class="order-content-title">流水信息</div> -->
        <div class="waterBill-content">
          <el-table :data="waterList" class="wkt-table" :header-cell-style="{ 'text-align': 'left' }">
            <el-table-column align="left" label="交易流水">
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
                <div v-else>{{ scope.row.payChannel }}<span v-if="scope.row.consumeIntegral">+积分支付</span></div>
              </template>
            </el-table-column>

            <el-table-column :label="isEstate ? '认筹金(￥)' : '售价(￥/积分)'">
              <template slot-scope="scope">
                <span v-if="orderDetail && orderDetail.frontMoneyItemOrder">{{
                  scope.row.totalFee ? scope.row.totalFee : 0 | price
                }}</span>
                <span v-if="orderDetail && orderDetail.estateOrderVO">{{
                  (orderDetail.estateOrderVO && orderDetail.estateOrderVO.identifyFee) || 0 | price
                }}</span>
                <span v-else
                  >￥{{ scope.row.actualFee ? scope.row.actualFee : 0 | price }}
                  {{ scope.row.consumeIntegral ? `+${scope.row.consumeIntegral}积分` : '' }}</span
                >
              </template>
            </el-table-column>

            <el-table-column label="运费(￥)" v-if="handleOptionsHidden">
              <template slot-scope="scope">
                <template v-if="freightCollectLabel(orderDetail)">运费到付</template>
                <template v-else>{{ scope.row.logisticsFee ? scope.row.logisticsFee : 0 | price }}</template>
              </template>
            </el-table-column>

            <el-table-column label="定金" v-if="orderDetail && orderDetail.frontMoneyItemOrder">
              <template slot-scope="scope">
                {{ scope.row.payFee ? scope.row.payFee : 0 | price }}
              </template>
            </el-table-column>

            <el-table-column label="抵扣(￥)">
              <template slot-scope="scope"> -{{ computePromFee(scope.row) | price }} </template>
            </el-table-column>

            <el-table-column label="分账(￥)" v-if="orderDetail && orderDetail.frontMoneyItemOrder">
              <template slot-scope="scope">
                {{ scope.row.profitSharingFee ? scope.row.profitSharingFee : 0 | price }}
              </template>
            </el-table-column>

            <el-table-column label="实收金额(￥/积分)">
              <template slot-scope="scope">
                {{ scope.row.payFee ? scope.row.payFee : 0 | price }}
                {{ scope.row.consumeIntegral ? `+${scope.row.consumeIntegral}积分` : '' }}
              </template>
            </el-table-column>

            <el-table-column align="left" label="外部订单号">
              <template slot-scope="scope">
                {{ scope.row.outTransactionId ? scope.row.outTransactionId : '-' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!--发货dialog-->
    <shipping-dialog
      :order-no="shippingOrderNo"
      :out-bound-no="outBoundNo"
      v-if="shippingActive"
      @cancel="handleShippingCancel"
      @done="handleShippingDone"
    />

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
        <el-button type="primary" @click="handleSaveAddress('addressForm')">确 定</el-button>
      </div>
    </el-dialog>

    <choose-guide-dialog
      :visible.sync="guideDialogVisible"
      :store-id="orderDetail && orderDetail.storeId"
      :order-no="orderDetail && orderDetail.orderNo"
      :belong-guides="belongGuides"
      @successChange="getOrderDetail"
    >
    </choose-guide-dialog>
  </div>
</template>

<script>
  import './index.less';
  import utils from '@/dss-common/utils';
  import orderApi from '@/dss-wechat3rd/src/api/order';
  import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';
  import timeCardBg from '@/dss-wechat3rd/src/images/goods/time-card-bg.png';
  import chargeCardBg from '@/dss-wechat3rd/src/images/goods/charge-bg.png';
  import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum';
  import shippingDialog from '@/dss-wechat3rd/src/bz_components/shipping-dialog/index';
  import services from '@/dss-common/utils/services';
  import constants from '@/dss-wechat3rd/src/constants/index';
  import areaPicker from '@/dss-wechat3rd/src/components/area-picker/index';
  import regexps from '@/dss-common/utils/regexps';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import { mapState } from 'vuex';
  import tplEnum from '@/dss-wechat3rd/src/views-retail/warehouse/freight-tpl/tpl-enum';
  import { CHANNEL as cardPackCHANNEL } from '@/dss-wechat3rd/src/constants/cardPackEnum';
  import ChooseGuideDialog from './choose-guide-dialog.vue';
  import Template from '../../views/marketing/template.vue';

  export default {
    components: { shippingDialog, areaPicker, ChooseGuideDialog, Template },
    mixins: [industryHelperMixin],
    data() {
      return {
        filterType: '',
        scopeMenuEnum,
        goodsType: 1,
        mgrTypeEnum,
        goodsTypeEnum,
        orderNo: this.$route.query.orderNo,
        orderStatusEnum,
        scopeShippingGoods: true,

        loading: false,

        orderDetail: null, // 订单详情
        cardEnum, // 卡项类型
        timeCardBg, // 次数卡背景图片
        chargeCardBg, // 充值卡背景图片

        remainTime: null, // 倒数时间
        remainTimeInterval: null, // 倒数定时器

        orderLogisticsVOList: [], // 发货单信息

        // 确认发货
        shippingActive: false,
        shippingOrderNo: '', // 确认发货订单
        outBoundNo: '', // 出库单号

        // 处方单详情dialog参数
        PrescriptionLoading: false,
        PrescriptionDialogVisible: false,
        drugs: null, // 处方信息
        showPrescription: false, // 是否显示处方药标识
        drugApprove: 0, // 0：待开方 1：医院审核完成，待人工审核 2：处方订单完成 3：医院开放拒绝或者人工拒绝 4: 商家拒绝

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

        cardPackCHANNEL, // 推广大使

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

        guideDialogVisible: false, // 修改订单归属弹窗显隐
        belongGuides: [], // 订单归属导购列表
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
        roleList: 'roleList',
      }),
      // 控制订单特殊项的显隐（客房、票务）
      handleOptionsHidden() {
        return !(
          this.goodsType === goodsTypeEnum.rooms.value ||
          this.goodsType === goodsTypeEnum.ticket.value ||
          this.goodsType === goodsTypeEnum.estate.value
        );
      },

      // 是否是客房类型
      isRooms() {
        return this.goodsType === goodsTypeEnum.rooms.value;
      },

      isEstate() {
        return this.goodsType === goodsTypeEnum.estate.value;
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
        if (this.orderDetail) {
          list.push(this.orderDetail);
        }
        return list;
      },

      // 计算拼团优惠
      computeGroupPromFee() {
        return function (orderDetail) {
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
        return function (item) {
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

      // 判断是否显示修改收货地址按钮
      showUpdateAddress() {
        if (
          (this.orderDetail.orderStatus === orderStatusEnum.ORDER.STATUS.PAID.value || // 已支付
            this.orderDetail.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value) && // 待发货
          this.orderDetail.expressType === orderStatusEnum.express_type.express // 快递类型
        ) {
          return true;
        }
        // 含有处方药订单，待开方，待审批
        if ([0, 1].includes(this.drugApprove)) {
          return true;
        }
        return false;
      },

      // 运费展示到付
      freightCollectLabel() {
        return item => {
          if (item.expressType !== orderStatusEnum.express_type.express || !item.itemList || !item.itemList.length) {
            return false;
          } else {
            return item.itemList.every(goods => goods.freightType === tplEnum.type.freightCollect);
          }
        };
      },

      // 是否处方药待审批
      showDrugType() {
        // let check = [orderStatusEnum.ORDER.STATUS.WAIT_CHECK.value, orderStatusEnum.ORDER.STATUS.WAIT_CHECK.value2];
        // return check.includes(this.orderDetail.orderStatus);
        if (!this.drugs) {
          return false;
        }
        return this.drugs.status === 1;
      },

      /**
       * 处方单详情是否可点击
       */
      disablePdfUrl() {
        if (!this.drugs || !this.drugs.pdfUrl) {
          return false;
        }
        // 1，2，4 已开方
        // 0 待开方
        // 3 医院拒绝开方
        const arr = [1, 2, 4];
        return arr.includes(this.drugApprove);
      },

      // 展示归属导购
      showShopGuideInfo() {
        return ['order', 'refund-order'].includes(this.filterType);
      },

      // 是否为代金卡包订单
      isCardPack() {
        return this.filterType === 'card-pack';
      },
    },

    mounted() {
      if (this.$route.query.itemType) {
        this.goodsType = Number(this.$route.query.itemType);
      }
      this.filterType = this.$route.query.filterType;
      this.getOrderDetail(); // 获取订单详情
    },
    filters: {
      getData(val, count) {
        let dd = new Date();
        if (val) {
          dd = new Date(val);
        }
        dd.setDate(dd.getDate() + count);
        const y = dd.getFullYear();
        const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; // 获取当前月份的日期，不足10补0
        const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
        return y + '-' + m + '-' + d;
      },
      // 处方药审核
      filterDrugApprove(status = 0) {
        // 0：待开方 1：医院审核完成，待人工审核 2：处方订单完成 3：医院开放拒绝或者人工拒绝 4: 商家拒绝
        const statusObj = {
          0: '待开方',
          1: '已开方',
          2: '已开方',
          3: '拒绝开方',
          4: '已开方',
        };
        return statusObj[status];
      },
    },

    methods: {
      // 获取订单详情
      getOrderDetail() {
        this.loading = true;
        orderApi
          .getOrderDetail({ orderNo: this.orderNo })
          .then(res => {
            this.orderDetail = res.data;
            // 预售剩余时间倒计时
            this.remainTime = this.orderDetail.countdown ? this.orderDetail.countdown : 0;
            this.remainTimeInterval = setInterval(() => {
              if (!!this.remainTime && this.remainTime > 0) {
                this.remainTime--;
              } else {
                this.remainTime = 0; // 若无剩余时间，则默认设置为已到期
                clearInterval(this.remainTimeInterval); // 清空定时器
              }
            }, 1000);

            this.queryLogistics(); // 查询发货单信息
            this.getPrescriptionDetail(); // 查询处方订单
          })
          .catch(() => {
            this.loading = false;
          });
      },

      // 判断是否显示确认收货按钮
      showConfirmReceipt(olvoItem) {
        // 处方药审批完成
        if (this.drugs && this.drugApprove === 2) {
          return true;
        } else if (
          !this.drugs &&
          !olvoItem.useWMSConfig &&
          this.orderDetail.expressType === orderStatusEnum.express_type.express
        ) {
          return true;
        }

        return false;
      },

      // 获取处方订单详情
      getPrescriptionDetail() {
        const { orderNo } = this.$route.query;

        // if (!orderTab || orderTab != this.orderStatusEnum.ORDER.STATUS.WAIT_CHECK.name) {
        //   return;
        // }
        // 是否含有处方药
        if (!this.orderDetail || !this.orderDetail.itemList.find(v => v.drugType === 1)) {
          return;
        }
        this.showPrescription = true;
        orderApi
          .queryPrescriptionDetail({
            orderNo,
          })
          .then(res => {
            if (res.data) {
              this.drugs = res.data;
              this.drugApprove = res.data.status;
            }
          });
      },

      // 查询发货单信息
      queryLogistics() {
        const params = {
          orderNo: this.orderNo,
        };
        services
          .get(constants.Api.order.queryLogistics, {
            params,
            action: '发货单',
          })
          .done(res => {
            const { data } = res;
            this.orderLogisticsVOList = data || [];
            this.orderLogisticsVOList.forEach((item, index) => {
              // 喜茶不根据第三方仓库屏蔽发货按钮
              if (this.isXiCha) {
                item.useWMSConfig = false;
              }
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
          resultv2: 1,
        };
        orderApi
          .getLogistics(params)
          .then(res => {
            if (res.data && res.data.data) {
              const list = res.data.data || [];
              logistics = Object.assign(logistics, { logisticsDTO: list[0] });
              this.$set(this.orderLogisticsVOList, index, logistics);
            }
          })
          .always(() => {
            this.loading = false;
          });
      },

      /**
       * 通过审核之前，再次确认
       */
      handlePassPrescription(item) {
        // 不可审批
        if (this.drugApprove !== 1) {
          return;
        }
        this.$confirm('确认审核通过吗？', '审核通过', {
          center: true,
          confirmButtonText: '确认通过',
          cancelButtonText: '考虑一下',
          type: 'warning',
        })
          .then(async () => {
            // 通过
            const { data } = await orderApi.prescriptionApproval({
              orderNo: this.orderNo,
            });

            if (data) {
              this.$message.success('审核成功！');
              this.getOrderDetail();
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
        // 不可审批
        if (this.drugApprove !== 1) {
          return;
        }
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
        }).then(async ({ value }) => {
          // 不通过
          const { data } = await orderApi.prescriptionRefuse({
            orderNo: this.orderNo,
            refuseReason: value,
          });
          if (data) {
            this.$message.warning('已拒绝！');
            this.getOrderDetail();
          }
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
        this.getOrderDetail(); // 获取订单详情
      },

      /**
       * 点击修改收货地址
       */
      handleUpdateAddress() {
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
              this.getOrderDetail();
            })
            .always(() => {
              this.loading = false;
            });
        });
      },

      // 客房入住
      checkingIn(itemNo) {
        console.log(itemNo);
        const params = { orderNo: itemNo };
        this.loading = true;
        services
          .get(constants.Api.order.checkingIn, {
            params,
            action: '客房入住',
          })
          .done(res => {
            this.getOrderDetail();
          })
          .always(() => {
            this.loading = false;
          });
      },

      hanldeDownContract() {
        window.open('https://www.wakedata.com/wp/app/agreement/download?orderNo=' + this.orderNo, '_blank');
      },
      // 获取用户是否为管理员
      queryUserManagement() {
        if (this.wkbScopeMenu) {
          const goodsOrderButton = scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.goodsOrderButton;
          const scopeShippingGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
            this.wkbScopeMenu,
            goodsOrderButton.shipping_action
          );
          this.scopeShippingGoods = !!scopeShippingGoodsButton && !!scopeShippingGoodsButton.status;
        }
      },

      // 显示修改订单归属导购弹窗
      showChangeBelong() {
        this.belongGuides = ((this.orderDetail && this.orderDetail.clientGuideOrderList) || []).map(
          item => item.employeeId
        );
        this.guideDialogVisible = true;
      },
    },

    destroyed() {
      if (this.remainTimeInterval) {
        clearInterval(this.remainTimeInterval); // 清空定时器
      }
    },
  };
</script>

<style lang="less" scoped>
  .promoter-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 5px;
  }

  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
