<template>
  <div class="ticket-edit">
    <!-- <div class="edit-item">
      <span class="label">刷脸过闸</span>
      <div class="item">
        <el-checkbox v-model="ticket.brushFaceLock">支持人脸过闸</el-checkbox>
        <span class="tip-label">需要打通闸机摄像头，请联系您的销售经理</span>
      </div>
    </div> -->
    <div class="edit-item">
      <span class="label">登记信息</span>
      <div class="item">
        <div class="checkbox-group">
          <el-checkbox v-model="ticket.registerPurchaseName">购票者姓名</el-checkbox>
          <el-checkbox v-model="ticket.registerPurchasePhone">手机号</el-checkbox>
          <el-checkbox v-model="ticket.registerPurchaseCard">身份证</el-checkbox>
        </div>
        <span class="tip-label">请至少选择一项信息</span>
      </div>
    </div>
    <div class="btn-area">
      <el-button class="dss-btn-primary dss-btn-middle"
                 type="primary"
                 @click="onSave">保存
      </el-button>
    </div>
  </div>
</template>

<script>
import ticketApi from '@/dss-setting/src/api/ticket';
export default {
  data() {
    return {
      ticket: {
        registerPurchaseName: true,
        registerPurchasePhone: true,
        registerPurchaseCard: true
      }
    };
  },
  mounted() {
    this.getTicketInfo();
  },
  methods: {
    onSave() {
      const params = { ...this.ticket };
      if (this.ticket.registerPurchaseName || this.ticket.registerPurchasePhone || this.ticket.registerPurchaseCard) {
        ticketApi
          .updateTicket(params)
          .then(res => {
            this.$message({
              message: '设置成功',
              type: 'success'
            });
          })
          .catch(err => {
            this.$message({
              message: '设置失败，请重新再试',
              type: 'error'
            });
          });
      } else {
        this.$message({
          message: '请至少选择一项登记信息',
          type: 'warning'
        });
      }
    },
    getTicketInfo() {
      ticketApi.getTicket().then(res => {
        for (const key in this.ticket) {
          this.ticket[key] = res.data[key];
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@base: 20px;
.ticket-edit {
  padding: @base;

  .edit-item {
    margin-bottom: @base;
  }

  .label {
    margin-right: @base;
  }

  .item {
    display: inline;
  }

  .tip-label {
    display: block;
    color: #d3d3d3;
    margin-left: 80px;
    margin-top: 10px;
  }

  .checkbox-group {
    display: inline;
  }
}
</style>

