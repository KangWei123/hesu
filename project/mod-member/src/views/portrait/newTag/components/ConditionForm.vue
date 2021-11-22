<template>
  <el-form
    :disabled="!canEdit"
    :model="conditionForm"
    :rules="conditionFormRules"
    label-width="150px"
    ref="conditionForm"
  >
    <!-- 打标条件 -->
    <el-form-item class="form" label="打标条件" prop="condition">
      <div style="color: #ccc">*需满足以下所有被选中的条件</div>
      <!-- 不可使用 el-checkbox-group 嵌套 el-checkbox 会导致选项选择错误问题-->
      <el-checkbox label="消费" v-model="conditionForm.condition.consumption"></el-checkbox>
      <ConsumptionForm ref="consumptionForm" v-if="conditionForm.condition.consumption"></ConsumptionForm>
      <el-checkbox label="充值" v-model="conditionForm.condition.charge"></el-checkbox>
      <ChargeForm ref="chargeForm" v-if="conditionForm.condition.charge"></ChargeForm>
      <el-checkbox label="浏览" v-model="conditionForm.condition.scean"></el-checkbox>
      <SceanForm ref="sceanForm" v-if="conditionForm.condition.scean"></SceanForm>
    </el-form-item>
  </el-form>
</template>

<script>
  import ConsumptionForm from './ConsumptionForm';
  import ChargeForm from './ChargeForm';
  import SceanForm from './SceanForm';

  export default {
    name: 'ConditionForm',
    components: { ConsumptionForm, ChargeForm, SceanForm },
    inject: ['canEdit', 'formData'],
    data() {
      return {
        conditionForm: this.formData.conditionForm,
        conditionFormRules: {
          condition: [{ required: true, message: '请选择打标条件' }],
        },
      };
    },
  };
</script>

<style lang="less" scoped>
  .form .el-checkbox {
    display: block !important;
    margin: 10px 5px;
  }
</style>
