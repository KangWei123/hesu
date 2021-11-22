<template>
  <el-dialog
    title="评估记录详情"
    width="600px"
    :center="true"
    custom-class="dialog-evalution-result"
    :visible.sync="open"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-row v-loading="loading" class="base-info" style="margin-top: 20px" element-loading-text="数据加载中">
      <el-row class="box-title result" style="font-size: 16px; font-weight: 500; color: #303133">评估结果</el-row>
      <el-row>
        <el-form label-width="10em" label-position="left">
          <el-form-item v-if="detail.loseEnergyLevel" label="失能照护等级：">
            <span class="level">{{ detail.loseEnergyLevel }}</span>
            <span :class="factoryPrice(detail.loseEnergyPrice, 'getClass')" class="price">{{
              factoryPrice(detail.loseEnergyPrice, 'getPrice')
            }}</span>
          </el-form-item>
          <el-form-item v-if="detail.loseBrainsLevel" label="失智照护等级：">
            <span class="level">{{ detail.loseBrainsLevel }}</span>
            <span :class="factoryPrice(detail.loseBrainsPrice, 'getClass')" class="price">{{
              factoryPrice(detail.loseBrainsPrice, 'getPrice')
            }}</span>
          </el-form-item>
          <el-form-item v-if="detail.insuranceType" label="每月最高费用减免：">
            <span class="level">{{ detail.insuranceType }}</span>
            <span class="price price-deductions">-￥{{ detail.insuranceSubsidyPrice }}</span>
          </el-form-item>
          <el-form-item label="护理费用预估：">
            <span :class="factoryPrice(detail.totalPrice, 'getClass')" class="price">{{
              factoryPrice(detail.totalPrice, 'getPrice')
            }}</span>
          </el-form-item>
          <el-form-item label="估价结果预期情况：">
            <span>{{ detail.expectType ? detail.expectType : '—' }}</span>
          </el-form-item>
        </el-form>
      </el-row>

      <el-row style="font-size: 16px; font-weight: 500; color: #303133" class="box-title gist1"
        >测评依据-身体状况</el-row
      >

      <el-row style="margin-top: 20px" element-loading-text="数据加载中">
        <el-row v-if="detail.healthDTOList && detail.healthDTOList.length">
          <el-form label-width="10em" label-position="left">
            <el-form-item label="行动能力：" v-if="detail.healthDTOList && detail.healthDTOList[0]">
              <span>{{ detail.healthDTOList[0] }}</span>
            </el-form-item>
            <el-form-item label="进食能力：" v-if="detail.healthDTOList && detail.healthDTOList[1]">
              <span>{{ detail.healthDTOList[1] }}</span>
            </el-form-item>
            <el-form-item label="洗澡能力：" v-if="detail.healthDTOList && detail.healthDTOList[2]">
              <span>{{ detail.healthDTOList[2] }}</span>
            </el-form-item>
            <el-form-item label="如厕情况：" v-if="detail.healthDTOList && detail.healthDTOList[3]">
              <span>{{ detail.healthDTOList[3] }}</span>
            </el-form-item>
            <el-form-item label="记忆力情况：" v-if="detail.healthDTOList && detail.healthDTOList[4]">
              <span>{{ detail.healthDTOList[4] }}</span>
            </el-form-item>
          </el-form>
        </el-row>
      </el-row>
      <el-row style="font-size: 16px; font-weight: 500; color: #303133" class="box-title gist2"
        >测评依据-身份信息</el-row
      >
      <el-row style="margin-top: 20px" element-loading-text="数据加载中">
        <el-row v-if="detail.identityDTOList && detail.identityDTOList.length">
          <el-form label-width="10em" label-position="left">
            <el-form-item label="项目名称：">
              <span>{{ detail.identityDTOList[0] }}</span>
            </el-form-item>
            <el-form-item label="长者年龄：">
              <span>{{ detail.identityDTOList[1] }}</span>
            </el-form-item>
            <el-form-item label="性别：">
              <span>{{ detail.identityDTOList[2] }}</span>
            </el-form-item>
            <el-form-item label="医疗关系：">
              <span>{{ detail.identityDTOList[3] }}</span>
            </el-form-item>
          </el-form>
        </el-row>
      </el-row>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        open: this.visible,
        loading: false,
      };
    },
    props: {
      evaluateDetail: {
        type: Object,
        default() {
          return {};
        },
      },
      visible: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      detail() {
        return this.evaluateDetail;
      },
    },
    watch: {
      visible(val) {
        this.open = val;
      },
    },
    methods: {
      handleClose() {
        this.$emit('close');
      },
      factoryPrice(price, action) {
        let ret;
        switch (action) {
          case 'getClass':
            ret = price ? (price * 1 > 0 ? 'price-payments' : 'price-deductions') : '';
            break;
          case 'getPrice':
            ret = price || price === 0 ? `￥${price}` : '-';
            break;
          default:
            throw new Error("'action' is necessary");
        }
        return ret;
      },
    },
  };
</script>
<style lang="less" scoped>
  .base-info {
    display: inline-block;

    .box-title {
      padding-left: 1.5em;
      font-size: 16px;
      color: #303133;
      line-height: 22px;
      font-weight: bold;
      margin-bottom: 14px;
    }

    .label {
      color: #717378;
    }

    .level {
      font-size: 14px;
    }

    .price {
      font-size: 14px;

      &-payments {
        color: #ff8400;
      }

      &-deductions {
        color: #00b963;
      }
    }
  }
</style>

<style lang="less">
  .dialog-evalution-result {
    .el-dialog__header {
      background: #2c2b2c;

      .el-dialog__title,
      .el-icon-close {
        color: white;
      }
    }

    .el-dialog__body {
      text-align: center;

      .el-form,
      .box-title {
        text-align: left;
      }

      .el-form {
        margin-bottom: 40px;
      }

      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
</style>
