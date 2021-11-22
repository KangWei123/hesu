<template>
  <el-dialog
    class="dss-dialog"
    :visible.sync="visible"
    width="480px"
    append-to-body
    destory-on-close
    :close-on-click-modal="false"
  >
    <div v-if="row" class="container">
      <template v-if="row.status === MemberStatus.Active">
        <div class="tip__icon error">!</div>
        <div class="tip__title">冻结会员</div>
        <div class="tip__content">会员冻结后不再计入成长值和积分，<br />积分、会员权益不再可用，是否确认冻结会员?</div>
      </template>
      <template v-else>
        <div class="tip__icon info">!</div>
        <div class="tip__title">激活会员</div>
        <div class="tip__content">确认激活？</div>
      </template>
    </div>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 认</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import api from '@/mod-member/src/api/memberAPI';
  import { MemberStatus } from '@/mod-member/src/enum';

  /**
   * 批量操作
   */
  export default {
    name: 'StatusChangeDialog',
    data() {
      return {
        row: null,
        memberStatusToggleing: false,
        visible: false,
        MemberStatus,
      };
    },
    methods: {
      show(row) {
        this.row = row;
        this.visible = true;
      },

      async handleConfirm() {
        if (this.memberStatusToggleing) {
          return;
        }

        const isActive = this.row.status === MemberStatus.Active;
        const nextStatus = isActive ? MemberStatus.Freeze : MemberStatus.Active;

        try {
          this.memberStatusToggleing = true;
          await api.memberCenter.freeze({
            memberId: this.row.id,
            status: nextStatus,
          });
          this.$emit('status-change-success');
          this.visible = false;
          this.$message.success(isActive ? '已冻结' : '已激活');
        } finally {
          this.memberStatusToggleing = false;
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tip__icon {
    width: 42px;
    height: 42px;
    font-size: 28px;
    border-radius: 100%;
    color: #fff;

    &.error {
      background: #f5222d;
    }

    &.info {
      background: #1890ff;
    }
  }

  .tip__title {
    height: 26px;
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: center;
    color: #303133;
    line-height: 26px;
    padding-top: 12px;
  }

  .tip__content {
    opacity: 1;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #717378;
    line-height: 22px;
    padding-top: 16px;
  }
</style>
