<template>
  <el-dialog
    class="dss-dialog"
    :visible.sync="dialogShow"
    title="核销"
    append-to-body
    width="500px"
    :close-on-click-modal="false"
    destory-on-close
    v-loading="loading"
    @close="handleClose"
  >
    <el-form v-if="couponData" class="coupon-form" label-width="130px" label-suffix="：">
      <el-form-item label="券码">
        <span>{{ couponData.codeStr }}</span>
      </el-form-item>
      <el-form-item label="券名称">
        <span>{{ couponData.name }}</span>
      </el-form-item>
      <el-form-item label="券类型">
        <span>{{ couponTypeMap[couponData.couponCategory] }}</span>
      </el-form-item>
      <!-- <el-form-item label="适用项目">
        <div :title="(couponData.storeNameList || []).join('，')" class="limit-line-ellipsis line-3">
          {{ (couponData.storeNameList || []).join('，') || '全部门店' }}
        </div>
      </el-form-item> -->
      <el-form-item label="适用范围">
        <sub-store-info :data="couponData" :show-more="true"></sub-store-info>
      </el-form-item>
      <el-form-item
        label="消费门槛"
        v-if="
          couponData.couponCategory !== CouponType.GIFT_COUPON &&
          couponData.couponCategory !== CouponType.PARKING_DURATION_COUPON &&
          couponData.couponCategory !== CouponType.PARKING_AMOUNT_COUPON
        "
      >
        <span v-if="couponData.minimumFee">￥{{ couponData.minimumFee | price }}</span>
        <span v-else> 无门槛 </span>
      </el-form-item>
      <el-form-item v-if="couponData.couponCategory === CouponType.GIFT_COUPON" label="参考价值">
        <span>￥{{ couponData.referenceValue | price }}</span>
      </el-form-item>
      <el-form-item label="优惠方式">
        <span v-if="couponData.couponCategory === CouponType.DISCOUNT_COUPON" class="orange">
          {{ couponData.discountFee | discount }}折
        </span>
        <span
          v-else-if="
            couponData.couponCategory === CouponType.PARKING_DURATION_COUPON ||
            couponData.couponCategory === CouponType.PARKING_AMOUNT_COUPON
          "
          class="orange"
        >
          <template v-if="!couponData.discountFee"> 免停车费 </template>
          <template v-else-if="couponData.couponCategory === CouponType.PARKING_DURATION_COUPON">
            {{ (couponData.discountFee * 60) | time2String }}
          </template>
          <template v-else>￥{{ couponData.discountFee | price }}</template>
        </span>
        <span
          v-else-if="couponData.couponCategory === CouponType.LOGISTICS_COUPON && couponData.discountFee === 0"
          class="orange"
        >
          免运费
        </span>
        <span v-else-if="couponData.couponCategory === CouponType.GIFT_COUPON" class="orange">实物</span>
        <span v-else class="orange">￥{{ couponData.discountFee | price }}</span>
      </el-form-item>
      <el-form-item label="有效时间" prop="couponType">
        <span v-if="couponData.couponType === 0">领取后{{ couponData.fixedTerm }}天内有效</span>
        <span v-else
          >{{ couponData.beginTime | time('YYYY-MM-DD') }} 至 {{ couponData.endTime | time('YYYY-MM-DD') }} 有效</span
        >
      </el-form-item>
    </el-form>
    <div class="empty-tips" v-else>未查找到该优惠券，无法进行核销</div>
    <template #footer>
      <el-button v-if="couponData" type="primary" @click="handleVerification">核 销</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import couponApi from '@/dss-wechat3rd/src/api/couponApi';
  import { CouponType, couponTypeMap, suitSubStoreTypeEnum } from '@/dss-wechat3rd/src/constants/coupon';
  import SubStoreInfo from '@/dss-wechat3rd/src/components/sub-store-info/index.vue';

  export default {
    name: 'VerificationDialog',
    components: {
      SubStoreInfo,
    },
    data() {
      return {
        dialogShow: false,
        loading: false,
        CouponType,
        couponTypeMap,
        suitSubStoreTypeEnum,
        couponData: null,
      };
    },

    methods: {
      async show(code) {
        this.dialogShow = true;
        const { data } = await couponApi.getDetailList({ code });
        this.couponData = data?.[0];
      },
      async handleVerification() {
        try {
          this.loading = true;
          await couponApi.verification({ couponCode: this.couponData.codeStr });
          this.$emit('submit');
          this.handleClose();
        } catch (error) {
        } finally {
          this.loading = false;
        }
      },
      handleClose() {
        this.dialogShow = false;
        this.$nextTick(() => {
          this.couponData = null;
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .el-dialog__body {
    padding-top: 0;
    padding-bottom: 20px;
  }

  .coupon-form {
    /deep/ .el-form-item__content {
      text-align: left;
    }

    .el-form-item {
      margin-bottom: 0;
    }

    .orange {
      color: rgba(255, 86, 45, 1);
    }
  }

  .empty-tips {
    padding: 100px;
  }
</style>
