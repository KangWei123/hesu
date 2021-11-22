<template>
  <div class="btn_operation">
    <!-- 同意申请 -->
    <div class="btn-box" v-if="btnType === 'agreeRequest' && !!item">
      <el-popover placement="top" width="300" popper-class="dss-popover" v-model="agreeRequestRefundPopover">
        <div class="dss-popover-title">
          <img class="title-icon" src="../../images/order/warning.png" />
          <span class="title-text">同意申请</span>
        </div>
        <p class="content-text">确认同意此订单的退款申请吗？</p>
        <p class="content-text" style="margin-top: 10px;" v-if="!currentReturnAddress">* 发送默认退货地址</p>
        <p class="content-text">
          <el-button type="text" style="font-size: 12px;padding: 0px;" @click="handleReturnAddressDialog(item)"
            >更换退货地址</el-button
          >
        </p>
        <p class="content-text" v-if="currentReturnAddress" style="display: flex;height: auto;">
          <span>当前退货地址：</span>
          <span style="flex: 1;">{{ currentReturnAddress }}</span>
        </p>
        <div class="footer-btn-container">
          <el-button size="mini" @click="handleCancelRequestRefund(item)">取消</el-button>
          <el-button type="danger" size="mini" @click="handleAgreeRequestRefund(item)">同意申请</el-button>
        </div>
        <a class="table-href btn-agree-request" href="javascript:;" slot="reference">同意申请</a>
      </el-popover>
    </div>

    <!-- 拒绝申请 -->
    <div class="btn-box" v-if="btnType === 'refuseRequest' && !!item">
      {{ scopeRefundButton }}
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-if="!scopeRefundButton"
        :content="scopeMenuEnum.disabledBtnTip"
      >
        <a href="javascript:;" slot="reference">拒绝申请</a>
      </el-popover>
      <el-popover
        v-if="scopeRefundButton"
        placement="top"
        width="300"
        popper-class="dss-popover"
        v-model="refuseRefundPopover"
      >
        <div class="dss-popover-title">
          <img class="title-icon" src="../../images/order/warning.png" />
          <span class="title-text">拒绝退款申请</span>
        </div>
        <p class="content-text">确认拒绝此订单的退款申请吗？</p>
        <p class="content-text">订单将会进入已完成状态，不可再操作。</p>
        <div class="footer-btn-container">
          <el-button size="mini" @click="refuseRefundPopover = false">考虑一下</el-button>
          <el-button type="danger" size="mini" @click="handleRefuseRefund(item)">确认拒绝</el-button>
        </div>
        <a class="table-href btn-refuse-request" href="javascript:;" slot="reference">拒绝申请</a>
      </el-popover>
    </div>

    <!-- 重置退款状态 -->
    <div class="btn-box" v-if="btnType === 'refuseReset' && !!item">
      <el-popover placement="top" width="300" popper-class="dss-popover" v-model="refuseResetPopover">
        <div class="dss-popover-title">
          <img class="title-icon" src="../../images/order/warning.png" />
          <span class="title-text">重置退款状态</span>
        </div>
        <p class="content-text">确认重置此订单的退款状态吗？</p>
        <p class="content-text">订单将会恢复到申请状态。</p>
        <div class="footer-btn-container">
          <el-button size="mini" @click="refuseResetPopover = false">考虑一下</el-button>
          <el-button type="danger" size="mini" @click="handleRefuseReset(item)">确认重置</el-button>
        </div>
        <a class="table-href btn-refuse_reset" href="javascript:;" slot="reference">重置退款状态</a>
      </el-popover>
    </div>

    <!-- 确认已退货 -->
    <div class="btn-box" v-if="btnType === 'confirmRefundItem' && !!item">
      <a class="table-href btn-confirm-refund-item" href="javascript:;" @click="confirmRefundItem(item)">确认已退货</a>
    </div>

    <!-- 确认退款 -->
    <div class="btn-box" v-if="btnType === 'confirmRefund' && !!item">
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-if="!scopeRefundButton"
        :content="scopeMenuEnum.disabledBtnTip"
      >
        <a href="javascript:;" slot="reference">确认退款</a>
      </el-popover>
      <el-popover
        v-if="scopeRefundButton"
        placement="top"
        width="300"
        :popper-class="
          item.expressType === orderStatusEnum.express_type.express ? 'dss-popover dss-popover-fee' : 'dss-popover'
        "
        v-model="confirmRefundPopover"
      >
        <div class="dss-popover-title">
          <img class="title-icon" src="../../images/order/warning.png" />
          <span class="title-text">确认退款</span>
        </div>

        <!-- 判断发货类型为快递类型才显示退运费设置 -->
        <div class="fee-box">
          <p class="content-text" style="display: inline-block;">退款金额：</p>
          <el-input v-model="refundFee" style="display: inline-block; width: 100px"></el-input>
        </div>

        <p class="content-text">款项将会原路返回客户的账户中。</p>
        <div class="footer-btn-container">
          <el-button size="mini" @click="confirmRefundPopover = false">考虑一下</el-button>
          <el-button type="danger" size="mini" :disabled="disabled" @click="handleQueryRefundOrderStatus(item)"
            >确认退款</el-button
          >
        </div>
        <a class="table-href btn-confirm-refund" href="javascript:;" slot="reference">确认退款</a>
      </el-popover>
    </div>

    <!--更换退货地址dialog-->
    <el-dialog title="发送退货地址" class="return_address_dialog" :visible.sync="returnAddressDialogVisible">
      <div class="select_address">
        <span>退货地址：</span>
        <el-select
          v-model="returnWarehouseId"
          filterable
          size="mini"
          popper-class="refund-address-select-dropdown"
          placeholder="请选择退货地址"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <el-option v-for="item in returnAddressList" :key="item.id" :label="item.returnAddress" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div slot="footer">
        <el-button @click="cancelReturnAddress()">取 消</el-button>
        <el-button class="primary-white" type="primary" @click="confirmReturnAddress()">确 定</el-button>
      </div>
    </el-dialog>

    <!--确认已退货dialog-->
    <el-dialog title="确认已收到退货" class="confirm_refund_item_dialog" :visible.sync="confirmRefundItemDialogVisible">
      <div class="warehouse_remark">
        <span>仓管备注：</span>
        <el-input v-model="confirmRefundItemMsg" size="mini" placeholder="请输入仓管备注"> </el-input>
        <p class="warning" v-if="confirmRefundItemMsg && confirmRefundItemMsg.length > 200">
          长度在不允许超过200个字符
        </p>
      </div>
      <div class="upload_box">
        <span>上传图片：</span>
        <div class="upload_img">
          <div class="icon_box" v-if="!!confirmRefundItemImgs.length">
            <div class="icon_tab" v-for="(item, index) in confirmRefundItemImgs" :key="index">
              <img :src="confirmRefundItemImgs[index]" class="icon" />
              <div class="upload_handle" v-if="confirmRefundItemImgs[index]">
                <i class="el-icon-delete" @click="onRemoveIcon(index)"></i>
                <!-- <p class="upload-reset" @click="onResetIcon(index)">点击重选</p> -->
              </div>
            </div>
          </div>
          <el-upload
            class="icon-uploader"
            action="/wp/materials/addLocal"
            name="files"
            :show-file-list="false"
            :multiple="true"
            :data="uploadParams"
            :accept="accept"
            :limit="5"
            :on-exceed="onExceed"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
          >
            <i class="el-icon-plus" v-if="confirmRefundItemImgs.length < 5"></i>
          </el-upload>
          <div class="note">*最多5张，每张大小不超过10M</div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="confirmRefundItemDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirmRefundItem(item)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import MaterialsConfig from '@/dss-wechat3rd/src/constants/MaterialsConfig';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum.js';
import floatNum from '@/dss-common/utils/float-num.js';
import regex from '@/dss-wechat3rd/src/constants/regex.js';
import scopeMenuEnum from '@/business-common/scopeMenuEnum.js';

import { setTimeout } from 'timers';

export default {
  data() {
    return {
      scopeMenuEnum,
      orderStatusEnum,

      item: null, // 当前该按钮操作的订单

      agreeRequestRefundPopover: false, // 同意申请弹出框

      // 选择退货地址的对话弹框参数
      returnAddressDialogVisible: false,
      returnAddressList: null,
      returnWarehouseId: null,
      // 选中的当前退货仓库ID及地址
      currentReturnWarehouseId: null,
      currentReturnAddress: null,

      refuseRefundPopover: false, // 拒绝申请弹出框

      refuseResetPopover: false, // 重置退款状态弹出框

      // 确认已收到退货的对话弹框参数
      confirmRefundItemDialogVisible: false,
      confirmRefundItemMsg: null, //确认收货的备注
      confirmRefundItemImgs: [], //上传的图片，最多5张
      // 上传图片的参数
      uploadParams: {
        type: 1
      },
      accept: MaterialsConfig.FILE_ACCEPT[MaterialsConfig.FILE_TYPES.THUMB], //上传的类型

      confirmRefundPopover: false, // 确认退款弹出框
      refundFee: 0, //退款自定义金额
      disabled: false //确认退款按钮状态
    };
  },

  props: {
    // 按钮的类型
    btnType: {
      type: String,
      default: ''
    },
    // 操作的订单
    operationOrder: {
      type: Object,
      default: null
    },
    scopeRefundButton: {
      type: Boolean,
      default: true
    }
  },

  mounted() {
    // 当前该按钮操作的订单赋值
    if (this.operationOrder) {
      this.item = this.operationOrder;
      if (this.item.refundFee) {
        this.refundFee = floatNum.floatDiv(this.item.refundFee, 100);
      }
    }
  },

  methods: {
    /**
     * 显示更换退货地址对话弹框
     */
    handleReturnAddressDialog(item) {
      this.$emit('onLoading');

      const params = { refundOrderNo: item.refundOrderNo };
      services
        .get(constants.Api.order.refundAddressList, {
          params,
          action: '查询退货地址'
        })
        .done(res => {
          this.agreeRequestRefundPopover = false; // 隐藏当前操作订单的同意申请弹出框
          this.returnAddressDialogVisible = true; // 显示更换退货地址对话弹框

          let addressList = Object.assign([], res.data);
          addressList.forEach(addressItem => {
            addressItem.returnAddress =
              addressItem.name +
              '(' +
              addressItem.province +
              addressItem.city +
              addressItem.district +
              addressItem.address +
              ')';
          });
          this.returnAddressList = addressList; // 退货地址列表
        })
        .always(() => {
          this.$emit('unLoading');
        });
    },

    /**
     * 取消选择退换货地址
     */
    cancelReturnAddress() {
      this.returnWarehouseId = this.currentReturnWarehouseId; //取消选择退换货地址时将当前退货地址的仓库ID还原为上一个操作的仓库ID

      this.agreeRequestRefundPopover = true; // 显示当前操作订单的同意申请弹出框
      this.returnAddressDialogVisible = false; // 隐藏更换退货地址对话弹框
    },

    /**
     * 确定选择的退换货地址
     */
    confirmReturnAddress() {
      this.currentReturnWarehouseId = this.returnWarehouseId; //确定选择的退换货地址为当前退货地址仓库ID

      //确定选择的退换货地址为当前退货地址
      this.returnAddressList.forEach(item => {
        if (item.id === this.returnWarehouseId) {
          this.currentReturnAddress = item.returnAddress;
        }
      });

      this.agreeRequestRefundPopover = true; // 显示当前操作订单的同意申请弹出框
      this.returnAddressDialogVisible = false; // 隐藏更换退货地址对话弹框
    },

    /**
     * 取消同意退款申请操作
     */
    handleCancelRequestRefund(item) {
      this.returnWarehouseId = null; //选中的退货地址仓库ID
      this.currentReturnWarehouseId = null; //当前退货地址仓库ID
      this.currentReturnAddress = null; //当前退货地址

      this.agreeRequestRefundPopover = false; // 隐藏当前操作订单的同意申请弹出框
      this.$emit('unLoading');
    },

    /**
     * 同意退款申请操作
     */
    handleAgreeRequestRefund(item) {
      this.$emit('onLoading');

      const params = {
        warehouseId: this.currentReturnWarehouseId, //当前退货地址仓库ID
        refundAddress: this.currentReturnAddress, //当前退货地址
        refundOrderNo: item.refundOrderNo
      };
      services
        .get(constants.Api.order.agreeRequestRefund, {
          params,
          action: '同意退款申请'
        })
        .done(res => {
          this.$emit('refresh');
        })
        .always(() => {
          this.agreeRequestRefundPopover = false; // 隐藏当前操作订单的同意申请弹出框
          this.$emit('unLoading');
        });
    },

    /**
     * 拒绝退款操作
     */
    handleRefuseRefund(item) {
      this.$emit('onLoading');

      const params = {
        refundOrderNo: item.refundOrderNo
      };
      services
        .get(constants.Api.order.refuseRefund, {
          params,
          action: '拒绝退款'
        })
        .done(res => {
          this.$emit('refresh');
        })
        .always(() => {
          this.refuseRefundPopover = false; // 隐藏拒绝申请弹出框
          this.$emit('unLoading');
        });
    },

    /**
     * 重置退款状态
     */
    handleRefuseReset(item) {
      this.$emit('onLoading');

      const params = {
        refundOrderNo: item.refundOrderNo
      };
      services
        .get(constants.Api.order.refuseReset, {
          params,
          action: '重置退款状态'
        })
        .done(res => {
          this.$emit('refresh');
        })
        .always(() => {
          this.refuseResetPopover = false; // 隐藏重置退款状态弹出框
          this.$emit('unLoading');
        });
    },

    /**
     * 显示确认已收到退货对话弹框
     */
    confirmRefundItem() {
      this.confirmRefundItemDialogVisible = true;
    },

    // 上传数量超过限制
    onExceed(files, fileList) {
      this.$message.error('上传的图片数量不允许超过5张');
    },
    // 上传成功
    uploadSuccess(res, file) {
      this.confirmRefundItemImgs.push(res.data);
    },
    // 上传失败
    uploadError(err, file, fileList) {
      this.$message.error('图片上传失败，请稍后重试');
    },
    // 上传之前
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传的图片类型不正确!');
      }
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 10MB!');
      }
      return isJPG && isLt2M;
    },
    // 删除某个上传的图片
    onRemoveIcon(index) {
      this.confirmRefundItemImgs.splice(index, 1);
    },
    // 重选某个上传的图片
    onResetIcon() {},

    /**
     * 确认已退货操作
     */
    handleConfirmRefundItem(item) {
      this.$emit('onLoading');

      const params = {
        refundOrderNo: item.refundOrderNo,
        confirmRefundItemMsg: this.confirmRefundItemMsg,
        confirmRefundItemImgs: this.confirmRefundItemImgs
      };

      services
        .json(constants.Api.order.confirmRefundItem, params, {
          action: '确认已退货'
        })
        .done(res => {
          this.$emit('refresh');
        })
        .always(() => {
          this.confirmRefundItemDialogVisible = false; // 隐藏确认已收到退货对话弹框
          this.$emit('unLoading');
        });
    },

    /**
     * 查询退款订单状态
     */
    handleQueryRefundOrderStatus(item) {
      const priceReg = regex.price;
      if (!priceReg.reg.test(this.refundFee)) {
        this.$message({
          message: '请输入正确的退款金额：' + priceReg.msg,
          type: 'warning'
        });
        return;
      }
      this.$emit('onLoading');
      this.disabled = true;
      const params = {
        refundOrderNo: item.refundOrderNo
      };
      services
        .get(constants.Api.order.queryRefundOrderStatus, {
          params,
          action: '查询退款订单状态'
        })
        .done(
          res => {
            console.log('res', res);
            if (res.data) {
              if (res.data.haveDeliveryGood) {
                this.$confirm('订单已经发货，请确认是否退款？', '确认退款', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  center: true,
                  customClass: 'wkt-warning'
                })
                  .then(() => {
                    this.handleConfirmRefund(item); //确认退款操作
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消确认退款'
                    });
                    this.confirmRefundPopover = false; // 隐藏确认退款弹出框
                    this.disabled = false;
                  });
              } else {
                this.handleConfirmRefund(item); //确认退款操作
              }
            }
          },
          error => {
            console.log('error', error);
            this.confirmRefundPopover = false; // 隐藏确认退款弹出框
          }
        )
        .always(() => {
          this.$emit('unLoading');
          setTimeout(e => {
            this.disabled = false;
          }, 500);
        });
    },

    /**
     * 确认退款操作
     */
    handleConfirmRefund(item) {
      this.$emit('onLoading');

      let params = {
        refundOrderNo: item.refundOrderNo,
        refundFee: floatNum.floatMul(this.refundFee, 100)
      };

      services
        .get(constants.Api.order.agreeRefund, {
          params,
          action: '同意退款'
        })
        .done(
          res => {
            this.$notify.success({
              message: '退款成功',
              showClose: false,
              duration: 2000,
              onClose: function() {}
            });
            this.$emit('refresh');
          },
          error => {}
        )
        .always(() => {
          this.confirmRefundPopover = false; // 隐藏确认退款弹出框
          this.$emit('unLoading');
        });
    }
  }
};
</script>

<style lang="less">
@import '~@/dss-common/style/wkt-constants.less';
// 退还运费的参数类型样式
.dss-popover-fee {
  min-width: 350px;

  .fee-box {
    .el-radio__inner {
      width: 14px;
      height: 14px;
      margin-bottom: 2px;
    }
  }
}

.btn_operation {
  display: inline-block;
  font-size: 0px;
  text-align: center;

  .btn-box {
    a {
      line-height: 2;
      display: inline-block;
      text-align: center;
    }

    .btn {
      cursor: pointer;
      height: 24px;
      font-size: 12px;
      color: #999999;
      margin: 0px;
      padding: 0px;
    }

    .btn-blue {
      color: rgba(46, 141, 255, 1);
    }

    .btn-warning {
      color: rgba(251, 73, 56, 1);
    }

    .default-btn {
      background: rgba(255, 255, 255, 1);
      color: rgba(86, 105, 128, 1);
      border: 1px solid rgba(186, 198, 211, 1);
      display: block;
    }

    .primary-btn {
      background: rgba(67, 121, 237, 1);
      border: 1px solid rgba(67, 121, 237, 1);
      color: rgba(248, 249, 254, 1);
      vertical-align: top;
    }

    .primary-btn:hover {
      background: rgba(67, 121, 237, 0.8);
      border: 1px solid rgba(67, 121, 237, 0.8);
      color: rgba(248, 249, 254, 0.8);
    }

    .danger-btn {
      background: rgba(255, 86, 45, 1);
      border: 1px solid rgba(255, 86, 45, 1);
      color: rgba(248, 249, 254, 1);
      vertical-align: top;
    }

    .danger-btn:hover {
      background: rgba(255, 86, 45, 0.8);
      border: 1px solid rgba(255, 86, 45, 0.8);
      color: rgba(248, 249, 254, 0.8);
    }

    .default-btn:hover {
      background: rgba(255, 255, 255, 0.8);
      color: rgba(86, 105, 128, 0.8);
      border: 1px solid rgba(186, 198, 211, 0.8);
    }

    .btn-agree-request {
      padding-right: 5px;
    }

    .btn-refuse-request {
      color: @red-color;
      padding-left: 10px;
      border-left: 1px solid rgba(186, 198, 211, 0.8);
      line-height: 1;
    }
    .btn-refuse-request:hover {
      color: @red-color-hover;
    }

    .btn-confirm-refund {
      padding-right: 5px;
    }
  }

  .return_address_dialog {
    text-align: start;
    .el-dialog {
      width: 600px;
      .el-select {
        width: 480px;
      }
    }
  }

  .confirm_refund_item_dialog {
    text-align: left;
    .el-dialog {
      width: 600px;
    }

    .warehouse_remark {
      text-align: left;
      margin-bottom: 15px;

      .el-input {
        width: 80%;
      }

      .warning {
        margin-top: 5px;
        margin-left: 65px;
        font-size: 12px;
        color: #f56c6c;
      }
    }

    .upload_box {
      text-align: left;
      .upload_img {
        display: inline-block;
        vertical-align: top;
      }

      .icon_box {
        display: inline-block;
        vertical-align: middle;

        .icon_tab {
          display: inline-block;
          min-height: 60px;
          margin-right: 15px;
          position: relative;
          font-size: 0px;
          vertical-align: middle;

          .icon {
            width: 60px;
          }
        }

        .icon_tab:hover {
          .upload_handle {
            display: block;
          }
        }

        .upload_handle {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          font-size: 12px;
          display: none;
          color: #ff5b56;

          .el-icon-delete {
            position: absolute;
            top: 0;
            right: 8px;
            color: #ff5b56;
            cursor: pointer;
          }

          .upload-reset {
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }

      .icon-uploader {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
      }

      .el-icon-plus {
        background-color: #eff2f5;
        width: 60px;
        height: 60px;
        line-height: 60px;
        vertical-align: middle;
      }

      .note {
        color: #858c99;
        font-size: 12px;
        margin-top: 10px;
      }
    }

    .btn-box {
      text-align: center;
      margin-top: 30px;

      .btn {
        min-width: 80px;
      }

      .btn:last-child {
        color: #ffffff;
        margin-left: 20px;
      }
    }
  }
}

.dateil-btn-operation {
  display: block;
  .btn-agree-request {
    padding: 0px !important;
  }

  .btn-refuse-request {
    line-height: 2 !important;
    border-left: none !important;
    padding: 0px !important;
  }

  .btn-confirm-refund {
    padding: 0px !important;
  }
}

// 设置下拉框的宽度跟el-select宽度一致，以免option选项内容过多，超出区域
.refund-address-select-dropdown {
  width: 480px;
}
</style>
