<template>
  <el-dialog class="no-msg-dialog"
             v-loading="loading"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             title="请充值"
             @close="handleCancelConfirm"
             :visible.sync="dialogVisible">
    <div class="content-container">
      <div class="tip-container">
        您的账户短信余额不足，请充值后再重试。
      </div>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="handleConfirm">立即充值</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { SendMsgType, ConfirmStatus } from './enum.js';

import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
export default {
    name: 'group-select-dialog',
    mixins: [AdapterIfr.AdapterMixins],
    props: {
        value: {
            type: Boolean,
            default: false
        },
        selectedCoupons: {
            type: Array,
            default: null
        },
        selectedGroup: {
            type: Array,
            default: null
        },
        label: {
            type: String,
            default: ''
        },
        confirmData: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            SendMsgType,
            dialogVisible: false,
            loading: false,
            isConfirmed: false
        };
    },
    watch: {
        value(newVal, oldVal) {
            this.dialogVisible = newVal;
            this.adapterIfmMask(newVal);
        },
        dialogVisible(newVal, oldVal) {
            this.$emit('input', newVal);
            this.adapterIfmMask(newVal);
        }
    },
    methods: {
        handleConfirm() {
            this.dialogVisible = false;
            this.adapterIfmMask(false);
            window.open('/wkb.html#/marketing/sms-group/recharge');
        },
        handleCancelConfirm() {}
    }
};
</script>

<style lang="less">
.no-msg-dialog {
  text-align: center;
  .el-dialog__header {
    text-align: start;
    padding: 25px 25px 10px;
    .el-dialog__title {
      font-size: 14px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(52, 52, 52, 1);
      line-height: 20px;
    }
    .el-dialog__title:before {
      display: inline-block;
      vertical-align: middle;
      content: ' ';
      width: 19px;
      height: 19px;
      border-radius: 10px;
      margin-right: 6px;
      background-size: contain;
      background-image: url('../../../images/tip.png');
    }

    .el-dialog__headerbtn {
      top: 27px;
      right: 25px;
    }
  }
  .el-dialog {
    display: inline-block;
    width: 362px;
  }
  .el-dialog__body {
    padding: 0 25px 30px;
  }
  .content-container {
    font-size: 14px;
    text-align: start;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(52, 52, 52, 1);
    line-height: 20px;

    .tip-container {
      border-top: 2px solid rgba(235, 235, 235, 1);
      border-bottom: 2px solid rgba(235, 235, 235, 1);
      padding-top: 10px;
      padding-bottom: 50px;
    }

    .confirm-btn-box {
      margin-top: 46px;
      text-align: center;
    }

    .confirm-btn {
      padding: 7px 42px;
    }

    .confirm-btn + .confirm-btn {
      margin-left: 31px;
    }

    .cancel-btn {
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(67, 121, 237, 1);
    }
  }
}
</style>
