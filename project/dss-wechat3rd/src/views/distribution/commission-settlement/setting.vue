<template>
  <div style="background: #fff;">
    <el-form :rules="rules" ref="form" :model="form" label-width="80px" v-loading="loading">
      <el-form-item label="结算方式" prop="isSettleManually">
        <el-radio-group v-model="form.isSettleManually">
          <el-radio :label="0" disabled>自动结算</el-radio>
          <el-radio :label="1">人工结算</el-radio>
        </el-radio-group>
        <p class="tip" v-if="form.isSettleManually === 0">系统根据你设置的佣金比例，自动与分销员进行结算</p>
        <p class="tip" v-else>需要你自行与分销员进行业绩结算，通过线下方式发放佣金</p>
      </el-form-item>
      <div class="bottom-button">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import distributionApi from '@/dss-wechat3rd/src/api/distribution.js';

export default {
  data() {
    return {
      form: { isSettleManually: 1, isAutoMatching: 0 },
      loading: false,
      rules: {
        isSettleManually: [{ required: true, message: '结算方式不能为空' }]
      }
    };
  },

  methods: {
    async querySetting() {
      try {
        this.loading = true;
        const { data } = await distributionApi.queryItemSetting();
        this.form = { isSettleManually: data.isSettleManually, isAutoMatching: data.isAutoMatching, id: data.id };
      } finally {
        this.loading = false;
      }
    },
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          this.loading = true;
          await distributionApi.updateItemSetting(this.form);
          this.$message({ type: 'success', message: '配置保存成功' });
        } finally {
          this.loading = false;
        }
      });
    }
  },

  mounted() {
    this.querySetting();
  }
};
</script>

<style lang="less" scoped>
.tip {
  margin-top: 10px;
  color: rgba(173, 173, 173, 1);
  font-size: 14px;
  text-align: left;
  font-family: PingFangSC-Regular;
}
</style>