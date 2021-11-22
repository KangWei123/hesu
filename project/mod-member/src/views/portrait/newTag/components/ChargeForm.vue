<template>
  <el-form :disabled="!canEdit" :model="chargeForm" :rules="chargeFormRules" label-width="150px" ref="chargeForm">
    <!-- 计算时间 -->
    <el-form-item label="选择计算时间：" prop="calcTime">
      <span>在最近的</span>
      <!-- <el-input-number :min="0" v-model="chargeForm.calcTime"></el-input-number> -->
      <el-input style="width: 60px" v-model.number="chargeForm.calcTime"></el-input>
      <span>天内</span>
    </el-form-item>
    <!-- 可选项 -->
    <el-form-item prop="chargeOptions">
      <el-checkbox-group v-model="chargeForm.chargeOptions">
        <div>
          <el-checkbox label="累计充值金额"></el-checkbox>
          <!-- 累计消费金额表单 -->
          <el-form
            :disabled="!chargeForm.chargeOptions.includes('累计充值金额') || !canEdit"
            :inline="true"
            :model="chargeForm.chargeOptionForm"
            :rules="chargeOptionFormRules"
            class="inline-form"
            label-width="150px"
            ref="chargeOptionForm"
          >
            <el-form-item prop="low">
              <el-input
                placeholder="最低值"
                style="width: 80px"
                v-model.number="chargeForm.chargeOptionForm.low"
              ></el-input>
              <span>元~</span>
            </el-form-item>
            <el-form-item prop="high">
              <el-input
                placeholder="最高值"
                style="width: 80px"
                v-model.number="chargeForm.chargeOptionForm.high"
              ></el-input>
              <span>元</span>
            </el-form-item>
          </el-form>
        </div>

        <div>
          <el-checkbox label="累计充值次数"></el-checkbox>
          <!-- 累计消费次数表单 -->
          <el-form
            :disabled="!chargeForm.chargeOptions.includes('累计充值次数') || !canEdit"
            :inline="true"
            :model="chargeForm.countOptionForm"
            :rules="countOptionFormRules"
            class="inline-form"
            label-width="150px"
            ref="countOptionForm"
          >
            <el-form-item prop="low">
              <el-input
                placeholder="最低值"
                style="width: 80px"
                v-model.number="chargeForm.countOptionForm.low"
              ></el-input>
              <span>次~</span>
            </el-form-item>
            <el-form-item prop="high">
              <el-input
                placeholder="最高值"
                style="width: 80px"
                v-model.number="chargeForm.countOptionForm.high"
              ></el-input>
              <span>次</span>
            </el-form-item>
          </el-form>
        </div>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script>
  import { validator as elValidator } from '@/dss-common/utils';

  export default {
    name: 'ChargeForm',
    inject: ['canEdit', 'formData'],
    watch: {
      chargeForm: {
        deep: true,
        handler() {
          if (!this.chargeForm.chargeOptions.includes('累计充值金额')) this.$refs.chargeOptionForm.resetFields();
          if (!this.chargeForm.chargeOptions.includes('累计充值次数')) this.$refs.countOptionForm.resetFields();
        },
      },
    },
    data() {
      return {
        chargeForm: this.formData.conditionForm.chargeForm,
        // 验证规则
        chargeFormRules: {
          calcTime: [{ validator: elValidator.numOrEmptyStr, trigger: 'blur' }],
          chargeOptions: [{ required: true, message: '请选择充值打标条件', trigger: 'change' }],
        },
        // 充值选项 累计充值金额规则
        chargeOptionFormRules: {
          low: [
            {
              type: 'number',
              message: '请输入正确的数值',
              trigger: 'blur',
            },
            {
              validator: (rule, val, cb) => {
                if (val < 0) {
                  cb(new Error('请输入大于零的正整数'));
                } else {
                  if (val < this.chargeForm.chargeOptionForm.high || this.chargeForm.chargeOptionForm.high === '') {
                    this.$refs.chargeOptionForm.clearValidate('low');
                    cb();
                  } else {
                    cb(new Error('最低值需要小于最高值'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
          high: [
            {
              validator: elValidator.numOrEmptyStr,
              trigger: 'blur',
            },
            {
              validator: (rule, val, cb) => {
                if (val < 0) {
                  cb(new Error('请输入大于零的正整数'));
                } else {
                  if (val > this.chargeForm.chargeOptionForm.low || this.chargeForm.chargeOptionForm.high === '') {
                    this.$refs.chargeOptionForm.clearValidate('high');
                    cb();
                  } else {
                    cb(new Error('最高值需要大于最低值'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
        },
        // 充值选项 累计充值次数规则
        countOptionFormRules: {
          low: [
            {
              type: 'number',
              message: '请输入正确的数值',
              trigger: 'blur',
            },
            {
              validator: (rule, val, cb) => {
                if (val < 0) {
                  cb(new Error('请输入大于零的正整数'));
                } else {
                  if (val < this.chargeForm.countOptionForm.high || this.chargeForm.countOptionForm.high === '') {
                    this.$refs.countOptionForm.clearValidate('low');
                    cb();
                  } else {
                    cb(new Error('最低值需要小于最高值'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
          high: [
            {
              validator: elValidator.numOrEmptyStr,
              trigger: 'blur',
            },
            {
              validator: (rule, val, cb) => {
                if (val < 0) {
                  cb(new Error('请输入大于零的正整数'));
                } else {
                  if (val > this.chargeForm.countOptionForm.low || this.chargeForm.countOptionForm.high === '') {
                    this.$refs.countOptionForm.clearValidate('high');
                    cb();
                  } else {
                    cb(new Error('最高值需要大于最低值'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
        },
      };
    },
  };
</script>
