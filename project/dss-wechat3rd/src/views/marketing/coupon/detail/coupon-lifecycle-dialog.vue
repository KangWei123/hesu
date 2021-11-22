<template>
  <el-dialog
    class="dss-dialog"
    :visible.sync="dialogShow"
    title="优惠券状态明细"
    append-to-body
    width="660px"
    :close-on-click-modal="false"
    destory-on-close
  >
    <div class="coupon-header">优惠券名称：{{ coupon.name }}</div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="优惠券状态" v-slot="{ row }">
        <span>{{ couponUseStatusMap[row.status] }}</span>
      </el-table-column>
      <el-table-column label="时间" v-slot="{ row }">
        <span>{{ row.createTime | time }}</span>
      </el-table-column>
      <el-table-column label="操作人" prop="operator" />
    </el-table>
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import couponApi from '@/dss-wechat3rd/src/api/couponApi';
  import { couponUseStatusMap } from '@/dss-wechat3rd/src/constants/coupon';

  export default {
    name: 'CouponLifecycleDialog',
    data() {
      return {
        dialogShow: false,
        couponUseStatusMap,
        tableData: [],
        coupon: {},
      };
    },

    methods: {
      async show(coupon) {
        this.dialogShow = true;
        try {
          const { data } = await couponApi.getCouponLifecycle({ code: coupon.codeStr });
          this.coupon = coupon;
          this.tableData = data;
        } catch (error) {
          this.coupon = {};
          this.tableData = [];
        }
      },

      handleClose() {
        this.dialogShow = false;
        this.coupon = {};
        this.tableData = [];
      },
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .el-dialog__body {
    padding-top: 0;
    padding-bottom: 20px;
  }

  .coupon-header {
    text-align: left;
    padding-left: 5px;
  }
</style>
