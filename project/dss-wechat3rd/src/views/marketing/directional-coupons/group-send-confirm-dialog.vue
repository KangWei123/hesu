<template>
  <el-dialog class="group-send-confirm-dialog"
             v-loading="loading"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             title="确认群发"
             @close="handleCancelConfirm"
             :visible.sync="dialogVisible">
    <div class="content-container">
      <div class="coupons-container"
           v-if="selectedCoupons">
        <div class="send-msg-confirm"
             v-if="confirmData && confirmData.sendSmsType === SendMsgType.SEND">
          本次群发将会消耗{{confirmData.consumeCount}}条短信，确定要群发优惠券给以下会员吗？
        </div>
        <div>优惠卷名称：</div>
        <div class="coupon"
             v-for="coupon in selectedCoupons"
             :key="coupon.id">
          {{coupon.name}}
        </div>
      </div>

      <div class="group-container">
        <div v-if="selectedGroup && selectedGroup.length">{{ label }}:</div>
        <template v-if="selectedGroup && selectedGroup.length">
          <div class="group"
               v-for="group in selectedGroup"
               :key="group.id">
            {{group.name}}
          </div>
        </template>
        <template v-else-if="!!confirmData.upload">
          <div class="group">有效人数：{{confirmData.validCount}}人</div>
          <div class="group">无效人数：{{confirmData.unvalidCount}}人</div>
        </template>
        <span v-else>
          所有会员
        </span>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="handleConfirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import marketingApi from '@/dss-wechat3rd/src/api/marketingAPI.js';
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
        this.confirmWithStatus(ConfirmStatus.CONFIRM);
      },
      handleCancelConfirm() {
        if (!this.isConfirmed) {
          this.confirmWithStatus(ConfirmStatus.CANCEL);
        }
      },
      /**
       * 订单确认
       * @param status 确认订单的状态， 1 确认 2 取消
       */
      confirmWithStatus(status) {
        const params = {
          id: this.confirmData ? this.confirmData.id : null,
          confirmStatus: status
        };
        if (status === ConfirmStatus.CONFIRM) {
          this.loading = true;
        }
        marketingApi
          .confirmDirectionalCoupons(params)
          .then(res => {
            if (status === ConfirmStatus.CONFIRM) {
              this.isConfirmed = true;
            }
            this.dialogVisible = false;
            this.adapterIfmMask(false);
            if (status === ConfirmStatus.CONFIRM) {
              this.$router.push('/marketing/directional-cp');
            }
          })
          .always(() => {
            this.loading = false;
          });
      }
    }
  };
</script>

<style lang="less">
  .group-send-confirm-dialog {
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
      .el-dialog__headerbtn {
        top: 27px;
        right: 25px;
      }
    }
    .el-dialog {
      display: inline-block;
      width: auto;
      min-width: 480px;
      max-width: 1000px;
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

      .coupons-container {
        border-top: 2px solid rgba(235, 235, 235, 1);
        border-bottom: 2px solid rgba(235, 235, 235, 1);
        padding-top: 10px;
        padding-bottom: 15px;
      }

      .send-msg-confirm {
        margin-bottom: 10px;
      }
      .coupon {
        margin-top: 10px;
      }

      .group-container {
        margin-top: 15px;
      }

      .group {
        margin-top: 14px;
        display: inline-block;
        margin-right: 41px;
      }

      .confirm-btn-box {
        margin-top: 46px;
        text-align: center;
      }

      .confirm-btn + .confirm-btn {
        margin-left: 31px;
      }
    }
  }
</style>
