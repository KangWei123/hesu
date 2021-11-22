<template>
  <div class="appiont-setting"
       v-loading="loading"
       element-loading-spinner="el-icon-loading">
    <div class="header">
      <span class="icon">!</span>
      <span class="tip">合理分配时间段，以及每个时间段可以预约的客人，避免预约订单过于集中，导致服务体验不佳。</span>
    </div>

    <div class="theme">预约限制</div>

    <div class="content">
      <span>每</span>
      <el-select size="mini"
                 class="select"
                 v-model="unitTime"
                 placeholder="选择时间">
        <el-option v-for="item in times"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <span>可预约</span>
      <el-input-number size="mini"
                       class="input"
                       type="number"
                       :controls="false"
                       v-model="scheduledNumber"
                       placeholder="输入人数"></el-input-number>
      <span>人</span>
    </div>

    <el-button style="margin-top: 20px"
               type="primary"
               :loading="submitting"
               @click="clickSave">保存
    </el-button>
  </div>
</template>

<script>
import saeApi from '@/dss-wechat3rd/src/api/scheduledAndEmployeeMgr';
import './index.less';
export default {
  data() {
    return {
      loading: true,
      submitting: false,
      scheduledNumber: 0,
      unitTime: '',
      id: '',
      times: [
        { label: '30分钟', value: '30' },
        { label: '60分钟', value: '60' },
        { label: '90分钟', value: '90' },
        { label: '120分钟', value: '120' },
        { label: '150分钟', value: '150' },
        { label: '180分钟', value: '180' }
      ]
    };
  },
  mounted() {
    saeApi
      .getScheduledConfig({})
      .then(res => {
        const { scheduledNumber, unitTime, id } = res.data || {};
        if (id !== undefined) {
          this.id = id;
          this.scheduledNumber = scheduledNumber;
          this.unitTime = unitTime + '';
        }
      })
      .always(() => {
        this.loading = false;
      });
  },
  methods: {
    clickSave() {
      const positiveInteger = /^([0-9]*)$/; //正整数
      if (!positiveInteger.test(this.scheduledNumber) || this.scheduledNumber > 1000) {
        this.$message.error('请输入0到1000之间的预约人数');
        return false;
      }

      if (!this.scheduledNumber) {
        this.$message({ message: '请输入人数', type: 'warn' });
      } else if (!this.unitTime) {
        this.$message({ message: '请选择时间', type: 'warn' });
      } else {
        this.submitting = false;
        saeApi
          .updateScheduledConfig({
            unitTime: this.unitTime - 0,
            scheduledNumber: this.scheduledNumber - 0,
            id: this.id ? this.id : undefined
          })
          .then(() => {
            this.$message({ message: '保存成功', type: 'success' });
          })
          .always(() => {
            this.submitting = false;
          });
      }
    }
  }
};
</script>
