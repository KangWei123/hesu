<template>
  <el-dialog v-if="showPopup" :visible.sync="showPopup" append-to-body class="message-dialog" width="480px">
    <header class="header">
      更新通知
      <i class="el-icon-close" @click="showPopup = false"></i>
    </header>
    <div class="content limit-line-ellipsis line-3" v-text="message.brief"></div>

    <span slot="footer">
      <div class="btn-box">
        <div class="understand">
          <div class="understand-wrap" @click="setActive">
            <span class="custom-radio" :class="{ active: understandable }"></span>
            不再提示
          </div>
        </div>
        <el-button type="primary" @click="handleJumpToDetail">查看详情</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import MessageHandler from '@/dss-common/components/page-header/handler/messageHandler';

export default {
  data() {
    return {
      message: {},
      showPopup: false,
      understandable: false
    };
  },
  computed: {
    ...mapState({
      userInfo: 'userInfo'
    })
  },
  mounted() {},
  watch: {
    userInfo: {
      immediate: true,
      handler(newVal) {
        this.messageOperate(newVal || {});
      }
    }
  },
  beforeDestroy() {
    this._messageHandler = null;
  },
  methods: {
    setActive() {
      this.understandable = !this.understandable;

      if (this.understandable) {
        setTimeout(() => {
          this.showPopup = false;
          this._messageHandler.setRead();
        }, 500);
      }
    },

    // 关闭弹窗
    handleClose() {
      this.showPopup = false;
    },

    async messageOperate(userInfo) {
      if (userInfo.appInfo && !this._messageHandler) {
        const { userPhone } = this.userInfo;
        const { epId } = this.userInfo.appInfo;

        this._messageHandler = new MessageHandler('dialog', { userPhone, epId });
        const { isNew, message } = await this._messageHandler.getMessage();

        if (isNew) {
          this.showPopup = true;
          this.message = message;
        }
      }
    },

    handleJumpToDetail() {
      this._messageHandler.setRead();

      location = `message-center.html#/detail?id=${this.message.id}`;
    }
  }
};
</script>
<style lang="less" scoped>
.message-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  color: #333;
  /deep/ .el-dialog {
    margin: 0 !important;
    box-shadow: none;
    width: 480px;
    height: 408px;
    background: url('../../images/message-dailog-bg.png') 0px 0px no-repeat transparent;
    background-size: cover !important;
  }
  /deep/ .el-dialog__header {
    display: none;
  }
  /deep/ .el-dialog__body {
    padding: 0;
    font-size: inherit;
    color: inherit;
  }
  /deep/ .el-dialog__footer {
    border-top: 1px solid #e1e1e1;
    padding: 10px 40px;
    margin: 24px 0 0;
  }
  .header {
    padding: 117px 0 0 40px;
    font-size: 16px;
    font-size: 32px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    color: #ffffff;
    position: relative;
    text-align: left;

    .el-icon-close {
      width: 14px;
      height: 14px;
      opacity: 0.8;
      position: absolute;
      top: 98px;
      right: 20px;
      font-size: 18px;
      cursor: pointer;
    }
  }
  .content {
    min-height: 66px;
    line-height: 22px;
    margin: 98px 40px 0;
    font-size: 14px;
    color: #717378;
    text-align: left;
  }

  /deep/ .btn-box,
  .understand,
  .understand-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /deep/ .el-button {
    width: 100px;
    border-radius: 15px !important;
  }

  /deep/ .el-button--primary {
    margin-left: 15px;
    width: 100px;
    height: 30px;
    line-height: 30px;
    padding: 0;
  }

  .understand {
    color: #999;
  }

  .understand-wrap {
    cursor: pointer;
  }

  .custom-radio {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    background: #fff;
    border: 1px solid #dcdde0;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .active {
    position: relative;
    border-color: #3879fb;
    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 12px;
      height: 12px;
      background: #3879fb;
      border-radius: 50%;
    }
  }
}
</style>
