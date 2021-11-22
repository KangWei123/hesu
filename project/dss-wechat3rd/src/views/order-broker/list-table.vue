<template>
  <div class="order-table" v-loading="loading">
    <div class="order-opt-box">
      <el-button class="rect-btn" :class="chooseOrderState ? 'export-btn' : ''" @click="toggleChooseOrder" size="small">
        批量导出订单
      </el-button>
      <el-button class="rect-btn" @click="patchOrder" size="small">一键导出</el-button>
    </div>

    <!-- 订单列表表头 -->
    <div class="order-table-header" :class="chooseOrderState ? '' : 'no-check'">
      <el-checkbox
        class="order-check"
        v-if="chooseOrderState"
        :indeterminate="mIsIndeterminate"
        v-model="mAllChecked"
        @change="onAllCheckedChanged"
      >
      </el-checkbox>
      <!-- <table class="table table-bordered bg-white">
        <tbody>
          <tr>
            <th class="order-tab-mw20">商品信息</th>
            <th class="order-tab-w12">金额</th>
            <th class="order-tab-w12">实收</th>
            <th class="order-tab-w10">支付方式</th>
            <th class="order-tab-w12">下单店铺</th>
            <th class="order-tab-w10">订单状态</th>
            <th class="order-tab-w10">操作</th>
          </tr>
        </tbody>
      </table> -->
    </div>

    <!-- 订单列表 -->
    <div class="order-list" v-if="list && list.length">
      <div :class="chooseOrderState ? 'order-item' : ''" v-for="item in list" :key="item.valetOrderNoStr" class="order-list__item">
        <el-checkbox
          class="order-check"
          v-if="chooseOrderState"
          v-model="item.checked"
          @change="checked => onItemCheckedChanged(checked, item)"
        >
        </el-checkbox>
        <table class="table table-bordered bg-white">
          <tbody>
            <tr class="tr-head">
              <td colspan="1000">
                <div style="float: left;" class="clearfix">
                  <span class="inline-text" style="width:14%">{{ item.createTime }}</span>
                  <span class="inline-text">代客订单编号：{{ item.valetOrderNoStr }}</span>
                  <span class="inline-text">订单号：{{ item.orderNo || '--' }}</span>
                  <span class="inline-text">
                    {{ item.paymentMethod === 0 ? '会员' : '客户' }}:
                    <span
                      v-if="!!item.userAvatar"
                      :style="'background: url(' + item.userAvatar + ') no-repeat;background-size: 100% 100%;'"
                      class="icon icon-userWxAvstar"
                    ></span>
                    <span class="nick-name">{{ item.userName || item.userPhone || '未知' }}</span>
                  </span>
                  <span class="inline-text"> 订单归属导购: {{ item.guideName || '--' }} </span>
                  <span class="inline-text"> 下单导购: {{ item.createdByName || '--' }} </span>
                  
                  <span class="inline-text" v-if="item.storeKeeperName"> 审核人: {{ item.storeKeeperName }} </span>
                </div>
                <div class="valet-order clearfix">
                  <span class="inline-text valet-order-text">
                    代客下单{{item.paymentMethod ? '线下付款' : '线上付款'}}
                  </span>
                </div>
              </td>
            </tr>
            <tr class="tr-body">
              <td class="order-tab-mw20">
                <div class="goods-info" v-for="(item2, index2) in item.valetItemList.slice(0, 3)" :key="index2">
                  <div :style="`background: url(${item2.thumbnail}) no-repeat;`" class="icon" />

                  <div class="info">
                    <div class="name item-name">
                      商品名称：
                      {{ item2.itemName }}
                    </div>
                    <div class="attribute" v-if="item2.itemAttr">{{ item2.itemAttr }}</div>
                    <div class="price-info">
                      <template>
                        <span class="price">￥{{ (item2.salePrice || 0) | price }}</span>
                        <span class="number">数量：{{ item2.itemCount }}</span>
                      </template>
                    </div>
                  </div>
                </div>
                <a style="padding: 20px" v-if="item.valetItemList.length > 3" @click="handleShowDetail(item)">
                  共 {{ item.valetItemList.length }} 件商品...
                </a>
              </td>
              <td class="order-tab-w12">
                <div class="wp-table-row">
                  <span class="span">
                    合计：
                    <span class="important">￥{{ item.totalFee | price }}</span>
                  </span>
                </div>
              </td>
              <td class="order-tab-w12">
                <div class="wp-table-row">
                  <span class="span">
                    实收：
                    <span class="important">￥{{ item.payFee | price }}</span>
                  </span>
                </div>
              </td>
              <td class="order-tab-w10">
                {{ item.paymentMethod === 0 ? '线上支付' : '线下支付' }}
              </td>
              <td class="order-tab-w12">
                <span class="span">{{ item.storeName }}</span>
              </td>
              <td class="order-tab-w10">
                <!-- 订单状态  paymentMethod===1? 线下支付 : 线上支付 -->
                {{
                  item.paymentMethod
                    ? VALET_STATUS_MAP[item.valetOrderStatus]
                    : STATUS_MAP[item.orderStatus] || VALET_STATUS_MAP[item.valetOrderStatus]
                }}
              </td>
              <td class="order-tab-w10 order-btn-areas">
                <!-- 订单详情 -->
                <div>
                  <a class="table-href" href="javascript:;" @click="handleShowDetail(item)">订单详情</a>
                </div>

                <!-- 备注 -->
                <div class="btn-box" v-if="item.orderStatus !== ORDER_STATUS.SUCCESS.value">
                  <a class="table-href" href="javascript:;" @click="handleShowRemarkDialog(item)">备注</a>
                </div>
              </td>
            </tr>
            <tr class="consignee-info-box">
              <td colspan="1000">
                <div class="consignee-info">
                  <span class="receive">收件人：{{ item.userName ? item.userName : '-' }}</span>
                  <span class="tel">电话：{{ item.userPhone ? item.userPhone : '-' }}</span>
                  <span class="address" v-if="item.paymentMethod">地址：{{ item.userAddress ? item.userAddress : '-' }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!--暂无数据时的展示-->
    <place-holder v-if="!(list && list.length)" />

    <!-- 订单预览弹窗dialog -->
    <preview-dialog
      v-model="showPreviewDialog"
      @preview-ok="handlePreviewOk"
      :order-list="mTotalCheckedList"
    ></preview-dialog>

    <!--备注dialog-->
    <el-dialog
      title="订单备注"
      width="500px"
      class="remark-dialog"
      v-loading="remarkLoading"
      :visible.sync="remarkDialogVisible"
    >
      <el-form
        :model="remarkInfo"
        :rules="remarkRules"
        :validate-on-rule-change="false"
        label-position="left"
        ref="remarkForm"
      >
        <el-form-item prop="guideComment">
          <el-input type="textarea" v-model="remarkInfo.guideComment" maxlength="128" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="hideRemark">取 消</el-button>
        <el-button type="primary" @click="handleRemark">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 温馨提示dialog -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size:14px;">订单正在导出，请等候...</span>
    </el-dialog>
  </div>
</template>

<script>
import PreviewDialog from './preview-dialog.vue';

import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import placeHolder from '@/dss-common/components/placeholder/index';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
import exportExcel from '@/dss-common/utils/exportExcel';
/*
 单价：单个商品的价格，单个SKU的价格
 小计：单个SKU价格 X 数量 =小计 actualFee
 合计：订单内，所有商品的小计相加后，得出合计 totalFee
 应付：理论上，等同于合计 totalFee
 实付：合计减各种优惠后以及加运费后，最终客户应当支付的金额 payFee
 抵扣：所有promFee后缀相加
*/

const STATUS_MAP = {
  '-1': '已取消',
  '10': '待付款',
  '60': '已完成',
  '0': '待确认',
  '2': '待付款',
  '3': '待付款',
  '20': '待自提', // 已支付
  '30': '待自提', // 商家已确认
  '31': '等待骑手接单',
  '38': '待核销',
  '-10': '申请退款',
  '-20': '退款成功',
  '-30': '退款已拒绝',
  '41': '骑手配送中'
};

const VALET_STATUS_MAP = {
  '0': '待审核',
  '1': '待确认',
  '2': '已确认',
  '3': '未通过',
  '4': '已取消',
  '5': '已完成'
};

export default {
  mixins: [tableCheckedHelperMixin],
  components: {
    placeHolder,
    PreviewDialog
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: function() {
        return [];
      }
    },
    filter: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },

  data() {
    return {
      STATUS_MAP,
      VALET_STATUS_MAP,
      ORDER_STATUS: orderStatusEnum.ORDER.STATUS,

      showTipDialog: false,

      // 备注的对话框参数
      remarkLoading: false,
      remarkDialogVisible: false,
      remarkInfo: {
        id: null,
        guideComment: null
      },
      remarkRules: {
        guideComment: [{ required: true, message: '请输入备注信息', trigger: 'change' }]
      },
      //是否未选择订单去批量导出的状态
      chooseOrderState: false,
      //是否展示订单预览弹窗
      showPreviewDialog: false,
      unionKeys: ['valetOrderNoStr']
    };
  },

  watch: {
    list(newVal, oldVal) {
      this.mSetPageListChecked(this.list, this.unionKeys);
      this.mCheckIndeterminateChecked(this.list);
      this.mCheckAllSelected(this.list);
    }
  },

  computed: {},

  methods: {
    /*导出订单相关逻辑*/
    onAllCheckedChanged(checked) {
      this.mTogglePageListChecked(this.list, checked);
      this.mCheckIndeterminateChecked(this.list);
      this.mUpdateTotalList(this.list, this.unionKeys);
    },
    onItemCheckedChanged(checked, orderItem) {
      this.mCheckAllSelected(this.list);
      this.mCheckIndeterminateChecked(this.list);
      this.mUpdateTotalList([orderItem], this.unionKeys);
    },

    /*打开选择订单状态*/
    toggleChooseOrder() {
      if (this.chooseOrderState && this.mTotalCheckedList.length) {
        this.showPreviewDialog = true;
      } else {
        this.chooseOrderState = !this.chooseOrderState;
      }
    },

    handlePreviewOk() {
      if (this.chooseOrderState) {
        this.doExportOrders();
      }
    },
    //导出订单
    doExportOrders() {
      const url = constants.Api.order.valetExport;
      const params = {
        valetIdList: this.mTotalCheckedList.map(i => i.id).join(',')
      };

      exportExcel.getDownload(url, params).then(res => {
        this.chooseOrderState = false;
        this.mResetCheckedData();
        this.mTogglePageListChecked(this.list, false);
        this.$message({
          message: '导出订单成功，正在下载',
          type: 'success'
        });
      });
    },

    async patchOrder() {
      try {
        await this.$confirm('确定一键导出过滤后的订单吗？ ', '一键导出', {
          type: 'warning',
          customClass: 'wkt-warning',

          confirmButtonText: '确定',
          cancelButtonText: '取消'
        });

        let params = this.$plain(this.filter);

        const start = new Date(params.startDate);
        const end = new Date(params.endDate);
        // 开始时间 和 结束时间 相差的天数
        const day = parseInt((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        if (!params.startDate || !params.endDate) {
          return this.$message({ message: '请选择导出数据的时间', type: 'error' });
        } else if (day > 30) {
          return this.$message({ message: '时间跨度不得超过31天', type: 'error' });
        }
        const url = constants.Api.order.valetExport;
        try {
          this.showTipDialog = true;
          await exportExcel.getDownload(url, params);
          this.$message({ message: '导出订单成功，正在下载', type: 'success' });
        } finally {
          this.showTipDialog = false;
        }
      } catch (e) {
        console.log('取消一键导出');
      }
    },

    // 跳转订单详情页面
    handleShowDetail(item) {
      this.$router.push({
        path: '/broker/list/detail',
        query: { valetOrderNo: item.valetOrderNoStr }
      });
    },

    // 显示备注对话弹框
    handleShowRemarkDialog(item) {
      this.remarkInfo.id = item.id;
      this.remarkInfo.guideComment = item.guideComment;

      // 清楚上一次校验信息
      this.$nextTick(() => {
        this.$refs.remarkForm && this.$refs.remarkForm.clearValidate();
      });
      this.remarkDialogVisible = true;
    },

    hideRemark() {
      this.remarkDialogVisible = false;
    },

    // 确定备注内容
    handleRemark() {
      this.$refs.remarkForm.validate(async valid => {
        if (valid) {
          this.remarkLoading = true;

          const params = {
            id: this.remarkInfo.id,
            guideComment: this.remarkInfo.guideComment
          };
          const url = constants.Api.order.valetRemark;

          try {
            await services.post(url, params, { action: '添加备注' });
            this.hideRemark();
          } finally {
            this.remarkLoading = false;
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped src="./list-table.less" /> 
