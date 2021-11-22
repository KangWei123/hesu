<template>
  <div class="order-table"
       v-loading="loading">
    <!-- <div class="order-opt-box"
         v-if="showPatch">
      <el-button class="rect-btn"
                 :class="chooseOrderState ? 'export-btn' : ''"
                 @click="toggleChooseOrder">
        批量导出订单
      </el-button>
      <el-button class="rect-btn"
                 :disabled="!isSure"
                 @click="patchOrder">
        一键导出
      </el-button>

      <el-button class="rect-btn"
                 v-if="showUploadBtn"
                 @click="showUploadDialog = true">
        批量导入物流单号
      </el-button>
      <el-button class="rect-btn"
                 v-if="showBatchPreShipBtn"
                 :class="chooseShipOrderState ? 'export-btn' : ''"
                 @click="toggleChooseOrderToShipping">
        批量提前发货
      </el-button>
    </div> -->
    <div class="order-table-header"
         :class="chooseOrderState || chooseShipOrderState ? '' : 'no-check'">
      <el-checkbox class="order-check"
                   v-if="chooseOrderState || chooseShipOrderState"
                   :indeterminate="mIsIndeterminate"
                   v-model="mAllChecked"
                   @change="onAllCheckedChanged">
      </el-checkbox>
      <!-- <table class="table table-bordered bg-white">
        <tbody>
          <tr >
            <th class="order-tab-mw20">商品信息</th>
            <th class="order-tab-w12">金额</th>
            <th class="order-tab-w12">实收</th>
            <th class="order-tab-w12"
                v-if="isProduct">下单店铺</th>
            <th class="order-tab-w10">订单状态</th>
            <th class="order-tab-w10">操作</th>
          </tr>
        </tbody>
      </table> -->
    </div>

    <div class="order-list"
         v-if="orderList && orderList.length">
      <div :class="chooseOrderState || chooseShipOrderState ? 'order-item' : ''"
           v-for="(item,i) in orderList"
           :key="item.refundOrderNo"
           class="order-list__item">
        <el-checkbox class="order-check"
                     v-if="chooseOrderState || chooseShipOrderState"
                     v-model="item.checked"
                     :disabled="!item.showPushBtn && chooseShipOrderState"
                     @change="checked => onItemCheckedChanged(checked, item)">

        </el-checkbox>
        <table class="table table-bordered bg-white">
          <tbody>
            <tr class="tr-head">
              <td :colspan="colspanTd">
                <span class="inline-text"
                      style="width:14%">{{computeOrderTime(item ? item.createTime : null)}}</span>
                <span class="inline-text">订购单编号：{{item.customizeOrderNo}}</span>
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
                      :title="item.orderMessage ? item.orderMessage : '--'">
                  买家留言：{{item.orderMessage ? item.orderMessage : '--'}}
                </span>
              </td>
            </tr>
            <tr>
              <td class="order-tab-mw20">
                <div v-if='item.itemType === cardEnum.cardType.manualRecharge'
                     class="manualPrice">手动充值金额：
                  <span>￥{{item.totalFee | price}}</span>
                </div>
                <div class="goods-info">
                  <div :style="!!item.pic1 ? 'background: url('+item.pic1+') no-repeat;': ''"
                       class="icon"></div>

                  <div class="info">
                    <div class="name item-name">{{item.itemName}} </div>
                    <div class="attribute"
                         v-if="item.itemAttribute">{{item.itemAttribute}}</div>
                    <div class="facturer-name item-name"
                         v-if="item.manufacturerName">厂家：{{item.manufacturerName}}</div>

                    <div class="price-info">
                      <span class="price">￥{{( item.fee || 0) | price}}</span>
                      <span class="number"
                            v-if="item.giftAmount ">赠送金额：
                        <span class="price">￥{{( item.giftAmount || 0) | price}}</span>
                      </span>
                      <!-- 叁拾加重量 -->
                      <span class="number"
                            v-if="item.itemWeight">{{item.itemWeight}}{{item.itemUnit}}</span>
                      <span class="number"
                            v-else>数量：{{item.num}}</span>
                      <span class="number"
                            v-if="item.itemWeight">￥小计：
                        <span class="price">{{( item.payFee || 0) | price}}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="order-tab-w12">
                <div class="wp-table-row">
                  <span v-if="isProduct">
                    运费：{{item.orderInfo && item.orderInfo.logisticsFee |price}}
                  </span>
                  <span class="span"
                        v-if="item.orderInfo && item.orderInfo.logisticsCouponPromFee">运费券：￥-{{item.orderInfo && item.orderInfo.logisticsCouponPromFee | price}}</span>
                  <span class="span"
                        v-if="item.orderInfo && item.orderInfo.cardPromFee">卡项：￥-{{item.orderInfo && item.orderInfo.cardPromFee | price}}</span>
                  <span class="span"
                        v-if="item.orderInfo && item.orderInfo.cashPromFee">现金：￥-{{item.orderInfo && item.orderInfo.cashPromFee | price}}</span>
                  <span class="span"
                        v-if="item.orderInfo && item.orderInfo.couponPromFee">优惠券：￥-{{item.orderInfo && item.orderInfo.couponPromFee | price}}</span>
                  <span class="span"
                        v-if="item.orderInfo && item.orderInfo.redPacketPromFee">红包：￥-{{item.orderInfo && item.orderInfo.redPacketPromFee | price}}</span>
                  <span class="span"
                        v-if="item.orderInfo && item.orderInfo.userGiftCardPromFee">礼品卡：￥-{{item.orderInfo && item.orderInfo.userGiftCardPromFee | price}}</span>
                  <span class="span"
                        v-if="item.orderInfo && item.orderInfo.memberPromFee">会员：￥-{{item.orderInfo && item.orderInfo.memberPromFee | price}}</span>
                  <span class="span">合计：
                    <span class="important">￥{{item.actualFee | price}}</span>
                  </span>
                </div>
              </td>
              <td class="order-tab-w12">
                <div class="wp-table-row">
                  <span class="span">实收：
                    <span class="important">￥{{item.orderInfo && item.orderInfo.payFee | price}}</span>
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
              <td class="order-tab-w10">
                <!--正常订单 状态描述信息是orderStatusDesc-->
                <div v-if="item.orderStatusDesc">
                  <span class="span">{{item.orderStatusDesc}}</span>
                </div>
                <!--退款订单, 状态描述信息是statusDesc-->
                <div v-if="item.statusDesc">
                  <span class="span">{{item.statusDesc}}</span>
                </div>
                <div v-if="item.statusDesc">
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
                <div class="btn-box"
                     v-if="showPreShip(item)">
                  <a class="table-href"
                     href="javascript:;"
                     @click="doPreShipOrders(item)">提前发货</a>
                </div>

                <!-- 备注 -->
                <div class="btn-box"
                     v-if="showRemark(item)">
                  <a class="table-href"
                     href="javascript:;"
                     @click="handleShowRemarkDialog(item)">备注</a>
                </div>

                <!-- 确认自提 -->
                <div class="btn-box"
                     v-if="showShipping(item)">
                  <a class="table-href"
                     href="javascript:;"
                     @click="confirmSelfPickup(item)">确认自提</a>
                </div>

                <!-- 确认发货 -->
                <div class="btn-box"
                     v-if="showDelivery(item)">
                  <a class="table-href"
                     href="javascript:;"
                     @click="handleShowShippingDialog(item)">确认发货</a>
                </div>

                <!-- 自提-确认到货 -->
                <div class="btn-box"
                     v-if="showPickUp(item)">
                  <a class="table-href"
                     href="javascript:;"
                     @click="handlePickUp(item)">确认到货</a>
                </div>

                <div>
                  <a href="javascript:;"
                     class="table-href"
                     v-if="showAudit(item)"
                     @click="handleShowAuditDialog(item,1)">通过</a>
                  <a href="javascript:;"
                     class="table-href"
                     v-if="showAudit(item)"
                     @click="handleShowAuditDialog(item,0)">拒绝</a>
                </div>

                <!-- 申请退款状态的操作按钮 -->
                <div v-if="showRequestRefundBtn(item)">
                  <!-- 确认退款 -->
                  <btn-operation v-if="item.refundType === orderStatusEnum.refund_type.refund_money"
                                 btn-type="confirmRefund"
                                 :operation-order="item"
                                 @onLoading="onLoading"
                                 @unLoading="unLoading"
                                 @refresh="handleRefresh"></btn-operation>

                  <!-- 同意申请 -->
                  <btn-operation v-if="item.refundType === orderStatusEnum.refund_type.refund_item_and_money"
                                 btn-type="agreeRequest"
                                 :operation-order="item"
                                 @onLoading="onLoading"
                                 @unLoading="unLoading"
                                 @refresh="handleRefresh"></btn-operation>

                  <!-- 拒绝申请 -->
                  <btn-operation btn-type="refuseRequest"
                                 :operation-order="item"
                                 @onLoading="onLoading"
                                 @unLoading="unLoading"
                                 @refresh="handleRefresh"></btn-operation>
                </div>

                <!-- 重置退款状态 -->
                <div v-if="showRefuseResetBtn(item)">
                  <btn-operation btn-type="refuseReset"
                                 :operation-order="item"
                                 @onLoading="onLoading"
                                 @unLoading="unLoading"
                                 @refresh="handleRefresh"></btn-operation>
                </div>

                <!-- 确认已退货 -->
                <div v-if="showConfirmRefundItemBtn(item)">
                  <btn-operation btn-type="confirmRefundItem"
                                 :operation-order="item"
                                 @onLoading="onLoading"
                                 @unLoading="unLoading"
                                 @refresh="handleRefresh"></btn-operation>
                </div>

                <!-- 确认退款 -->
                <div v-if="showConfirmRefundBtn(item)">
                  <btn-operation btn-type="confirmRefund"
                                 :operation-order="item"
                                 @onLoading="onLoading"
                                 @unLoading="unLoading"
                                 @refresh="handleRefresh"></btn-operation>
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
                <div class="pre-sale-info"
                     v-if="item.preSell">
                  <span class="product-type">预售商品</span>

                  <span class="remain-time"
                        v-if="item.pushWMS && item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SHIP.value">
                    已推单发货
                  </span>
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
    </div>

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
        <el-form-item prop="sellerMessage">
          <el-input type="textarea"
                    v-model="remarkInfo.sellerMessage"
                    maxlength="128"
                    show-word-limit>

          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="remarkDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="handleRemark('remarkForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--审核dialog-->
    <el-dialog title=""
               width="300px"
               class="audit-dialog"
               v-loading="auditLoading"
               :visible.sync="auditDialogVisible">
      <el-form :model="auditInfo"
               :rules="auditRules"
               label-position="left"
               ref="auditForm">
        <el-form-item v-if="!auditStatus"
                      prop="examineDetail">
          <div class="name"
               style="padding:5px 0;">请填写拒绝理由</div>
          <el-input type="textarea"
                    v-model="auditInfo.examineDetail"
                    maxlength="128"
                    show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item v-if="auditStatus"
                      label="请输入单价："
                      prop="fee">
          <el-input style="width:120px;"
                    v-model="auditInfo.fee"
                    maxlength="10"
                    show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item v-if="auditStatus && isExpress"
                      label="请输入运费："
                      prop="logisticsFee">
          <el-input style="width:120px;"
                    v-model="auditInfo.logisticsFee"
                    maxlength="10"
                    show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary"
                   @click="handleAudit('auditForm')">确 定</el-button>
      </div>
    </el-dialog>

    <preview-order-dialog v-model="showPreviewDialog"
                          @preview-ok="handlePreviewOk"
                          :order-list="mTotalCheckedList">

    </preview-order-dialog>

    <el-dialog title="温馨提示"
               :visible.sync="showTipDialog"
               width="500px">
      <span style="font-size:14px;">订单正在导出，请等候...</span>
    </el-dialog>

    <!--发货dialog-->
    <shipping-dialog :orderNo="shippingOrderNo"
                     :expressType='expressType'
                     :orderType="goodsTypeEnum.micro_order.value"
                     v-if="shippingActive"
                     @cancel="handleShippingCancel"
                     @done="handleShippingDone" />

    <!--批量导入-->
    <upload :visible.sync="showUploadDialog"
            :title="'批量导入'"
            :limit="1"
            @upload-success="onUploadSuccess"
            :uploadServerUrl="uploadOrderUrl"
            :need-template="false"
            :templateDesc="'请以批量导出的订单作为模板，填写物流信息（注：数据量过大时，物流信息同步可能有延迟）'">
    </upload>
    <place-holder v-if="!(orderList && orderList.length)" />
  </div>

</template>

<script>
import utils from '@/dss-common/utils';
import date from '@/dss-common/utils/date';
import moneyUtil from '@/dss-common/utils/money';
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum.js';
import placeHolder from '@/dss-common/components/placeholder/index';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';
import shippingDialog from '@/dss-wechat3rd/src/bz_components/shipping-dialog/index.vue';
import PreviewOrderDialog from '../../preview-order-dialog.vue';
import btnOperation from '../../btn-operation.vue';
import Upload from '@/dss-common/components/upload/index.vue';
import '../../order-list-table.less';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
import exportExcel from '@/dss-common/utils/exportExcel';
import url from '@/dss-common/utils/url.js';

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
    Upload
  },
  props: {
    /*商品类型*/
    goodsType: {
      type: Object,
      default() {
        return goodsTypeEnum.product;
      }
    },

    /*是否显示批量操作按钮*/
    showPatch: {
      type: Boolean,
      default: false
    },
    /*是否只展示预售商品信息，只展示预售商品信息时才显示批量推单的按钮*/
    filterPreSell: {
      type: Boolean,
      default: false
    },
    /*订单类型*/
    orderType: {
      type: Object,
      default: function() {
        return {};
      }
    },

    /*订单类型*/
    filterType: {
      type: String,
      default: null
    },

    orderTab: {
      type: String,
      default: null
    },
    orderList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    params: {
      type: Object,
      default: function() {
        return {};
      }
    }
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
          backgroundImage: 'url(' + val + ')'
        };
      }
    }
  },

  data() {
    const checkNum = {
      reg: /^[0-9]{1,4}(\.[0-9]{1,2})?$/,
      msg: '请输入范围在0~9999.99的数字,只能保留小数点两位'
    };
    return {
      loading: false,
      showTipDialog: false,
      isSure: true,
      cardEnum,
      goodsTypeEnum,
      orderStatusEnum,

      // 备注的对话框参数
      remarkLoading: false,
      remarkDialogVisible: false,
      remarkItem: null,
      remarkInfo: {
        orderNo: null,
        sellerMessage: null
      },
      remarkRules: {
        sellerMessage: [{ required: true, message: '请输入备注信息', trigger: 'change' }]
      },
      // 审核的对话框参数
      auditLoading: false,
      auditDialogVisible: false,
      auditItem: null,
      auditStatus: -1,
      isExpress: false,
      auditInfo: {
        customizeOrderNo: null,
        examineResult: -1,
        fee: null,
        logisticsFee: null,
        examineDetail: null
      },
      // 确认发货
      shippingActive: false,
      auditRules: {
        examineDetail: [{ required: true, message: '请输入退款理由', trigger: 'change' }],
        fee: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { pattern: checkNum.reg, message: checkNum.msg, trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ],
        logisticsFee: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { pattern: checkNum.reg, message: checkNum.msg, trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      //是否未选择订单去批量导出的状态
      chooseOrderState: false,
      //是否未选择订单去批量提前发货的状态
      chooseShipOrderState: false,
      //是否展示订单预览弹窗
      showPreviewDialog: false,
      //是否展示批量导入物流单号弹窗
      showUploadDialog: false,
      uploadOrderUrl: constants.Api.order.uploadOrder,
      unionKeys: this.filterType === 'refund-order' ? ['refundOrderNo'] : ['orderNo']
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
    }
  },

  computed: {
    // 单元格横跨长度
    colspanTd() {
      return '6';
    },
    // 是否是商品类型
    isProduct() {
      return this.goodsType === goodsTypeEnum.product;
    },
    parseOrderTime() {
      return function(orderTime) {
        return utils.timeFormat(new Date(orderTime));
      };
    },
    //是否展示批量导入物流单号按钮，只有代发货的订单才需要导入物流单号
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

    // 显示备注按钮
    showRemark() {
      return item => {
        return item.status !== orderStatusEnum.ORDER.STATUS.SUCCESS.value;
      };
    },

    // 判断是否为待收货状态且送货方式为自提类型，以便显示确认自提按钮
    showShipping() {
      return item => {
        return (
          item.status === orderStatusEnum.MICRO_ORDER.STATUS.WAIT_DELIVERED.value &&
          item.expressType === orderStatusEnum.express_type.self_extraction
        );
      };
    },

    // 快递-判断是否为调货中状态，显示确认发货
    showDelivery() {
      return item => {
        return (
          item.status === orderStatusEnum.MICRO_ORDER.STATUS.TRANSFER.value &&
          item.expressType === orderStatusEnum.express_type.express
        );
      };
    },

    // 自提-判断是否为调货中状态，显示确认到货
    showPickUp() {
      return item => {
        return (
          item.status === orderStatusEnum.MICRO_ORDER.STATUS.TRANSFER.value &&
          item.expressType === orderStatusEnum.express_type.self_extraction
        );
      };
    },

    // 判断是否显示审核状态
    showAudit() {
      return item => {
        return item.status === orderStatusEnum.MICRO_ORDER.STATUS.WAIT_REVIEW.value;
      };
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

    // 判断是否为已拒绝退款状态，以便显示重置退款状态按钮
    showRefuseResetBtn() {
      return item => {
        return item.status === orderStatusEnum.REFUND.STATUS.REFUND_REJECT;
      };
    },

    // 计算订单时间
    computeOrderTime() {
      return function(time) {
        if (time) {
          return utils.timeFormat(new Date(time));
        }
        return '-';
      };
    }
  },

  methods: {
    /*导出订单相关逻辑*/
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
    /*打开选择订单状态*/
    toggleChooseOrder() {
      if (this.chooseShipOrderState) {
        this.chooseShipOrderState = false;
        this.mResetCheckedData();
        this.mTogglePageListChecked(this.orderList, false);
      }
      if (this.chooseOrderState && this.mTotalCheckedList.length) {
        this.showPreviewDialog = true;
      } else {
        this.chooseOrderState = !this.chooseOrderState;
      }
    },
    toggleChooseOrderToShipping() {
      if (this.chooseOrderState) {
        this.chooseOrderState = false;
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
      }
    },
    //导出订单
    doExportOrders() {
      let orderNoList = [];
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
        itemType: itemType
      };

      if (this.filterType === 'refund-order') {
        params.refundOrderNoList = orderNoList;
      } else {
        params.orderNoList = orderNoList;
      }

      //判断是否为退款订单
      let api = this.filterType === 'refund-order' ? constants.Api.order.exportRefund : constants.Api.order.exportOrder;
      //post下载
      exportExcel.download(api, params).then(res => {
        this.chooseOrderState = false;
        this.mResetCheckedData();
        this.mTogglePageListChecked(this.orderList, false);
        this.$message({
          message: '导出订单成功，正在下载',
          type: 'success'
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
        orderNoList: orderNoList
      };
      this.loading = true;
      services
        .json(constants.Api.order.preShipOder, params, {
          action: '提前发货'
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
      let startTime = new Date(params.startDate);
      let endTime = new Date(params.endDate);
      let time = endTime.getTime() - startTime.getTime();
      let day = parseInt(time / (1000 * 60 * 60 * 24));
      return day;
    },

    patchOrder() {
      this.$confirm('确定一键导出过滤后的订单吗？ ', '一键导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          let params = this.params;
          delete params.pageNo;
          delete params.pageSize;
          let itemTypeList = [];
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

          let day = this.gatDay(params);

          if (!params.startDate || !params.endDate || day > 30) {
            return this.$message({
              message: '时间跨度不得超过31天',
              type: 'error'
            });
          }
          //判断是否为退款订单
          let api =
            this.filterType === 'refund-order' ? constants.Api.order.exportRefund : constants.Api.order.exportOrder;
          //post下载
          this.isSure = false;
          this.showTipDialog = true;
          exportExcel
            .download(api, params)
            .then(res => {
              this.$message({
                message: '导出订单成功，正在下载',
                type: 'success'
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

    //上传成功后的回调
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
      //退款订单跳转到退款详情页，其他订单跳转到普通的订单详情页
      if (item.refundOrderNo) {
        if (location.href.indexOf('wkb.html') === -1) {
          location.href = 'wkb.html#/refund/list/detail?refundOrderNo=' + item.refundOrderNo;
        } else {
          this.$router.push({
            path: '/refund/list/detail',
            query: {
              refundOrderNo: item.refundOrderNo + '',
              itemType: this.goodsType.value
            }
          });
        }
      } else {
        if (location.href.indexOf('wkb.html') === -1) {
          location.href = 'wkb.html#/order/list/detail?orderNo=' + item.orderNo;
        } else {
          //路由跳转，当前路由加detail
          let path = this.$route.path || '/micro-order/list/detail';
          this.$router.push({
            path: path + '/detail',
            query: {
              orderNo: item.customizeOrderNo + '',
              itemType: this.goodsType.value
            }
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
      this.remarkInfo.sellerMessage = item.sellerMessage;
    },
    // 确定备注内容
    handleRemark(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.remarkLoading = true;

          this.remarkInfo.customizeOrderNo = this.remarkItem.customizeOrderNo;
          const params = this.remarkInfo;
          services
            .get(constants.Api.micro_order.remark, {
              params,
              action: '添加备注'
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

    // 显示审核弹框
    handleShowAuditDialog(item, status) {
      this.auditDialogVisible = true;
      this.auditStatus = status;
      this.auditItem = item;

      // 判断快递方式
      this.isExpress = false;
      if (item.expressType === orderStatusEnum.express_type.express) {
        this.isExpress = true;
      }
    },

    handleCancel() {
      this.auditDialogVisible = false;
      this.auditInfo = {};
    },

    // 确定审核内容
    handleAudit(refName) {
      this.$refs[refName].validate(valid => {
        if (!valid) {
          return false;
        }

        this.auditLoading = true;

        let data = {};
        let params = { customizeOrderNo: this.auditItem.customizeOrderNo };

        let customizeOrderDTO = {};

        if (this.auditStatus) {
          customizeOrderDTO.logisticsFee = this.auditInfo.logisticsFee && Math.round(this.auditInfo.logisticsFee * 100);
          customizeOrderDTO.fee = Math.round(this.auditInfo.fee * 100);
          customizeOrderDTO.examineResult = 1;
        } else {
          customizeOrderDTO.examineDetail = this.auditInfo.examineDetail;
          customizeOrderDTO.examineResult = 0;
        }

        data.customizeOrderDTO = customizeOrderDTO;
        url.formatObject(params, data, '');

        services
          .post(constants.Api.micro_order.audit, params, {
            action: '审核'
          })
          .done(res => {
            this.auditDialogVisible = false;
            this.$emit('refresh');
            this.auditInfo = {};
          })
          .always(() => {
            this.auditLoading = false;
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
            customizeOrderNo: item.customizeOrderNo
          };

          services
            .get(constants.Api.micro_order.selfPickup, {
              params,
              action: '确认自提'
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
            message: '已取消确认自提'
          });
        });
    },

    //确认自提
    handlePickUp(item) {
      this.$confirm('是否确认到货，确认后用户将可到门店提取商品？', '确认到货', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.loading = true;
          const params = {
            customizeOrderNo: item.customizeOrderNo
          };

          services
            .post(constants.Api.micro_order.confirm_PickUp, params, {
              action: '确认发货'
            })
            .done(res => {
              this.$message.success('确认发货成功！');
              this.$emit('refresh');
            })
            .always(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认发货'
          });
        });
    },

    // 出现确认发货弹框
    handleShowShippingDialog(item) {
      this.shippingActive = true;
      this.expressType = item.expressType;
      this.shippingOrderNo = item.customizeOrderNo;
    },

    // 取消确认发货弹框
    handleShippingCancel() {
      this.shippingActive = false;
    },

    // 确认发货完成
    handleShippingDone() {
      this.shippingActive = false;
      // 更新订单列表
      this.$emit('refresh');
    },

    // 显示loading
    onLoading() {
      this.loading = true;
    },
    // 隐藏loading
    unLoading() {
      this.loading = false;
    },

    //刷新退款列表
    handleRefresh() {
      this.$emit('refresh');
    }
  }
};
</script>

<style scoped>
.facturer-name {
  font-size: 12px;
}
</style>
