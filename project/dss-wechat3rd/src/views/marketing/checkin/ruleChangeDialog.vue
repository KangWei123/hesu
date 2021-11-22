<template>
  <el-dialog class="check-rule" :visible.sync="dialogVisible">
    <div class="check-rule__title">
      <div class="el-icon-warning yellow"></div>
      <p>签到活动已开启，如果您确定修改设置，请填写以下说明，我们将在用户下一次打开签到页时进行弹窗提醒</p>
    </div>
    <el-form @submit.native.prevent :model="form" ref="form" :rules="rules">
      <el-form-item prop="modifyRuleDesc">
        <el-input
          class="shot-input"
          type="textarea"
          v-model.trim="form.modifyRuleDesc"
          :autosize="{minRows:10,maxRows:10}"
          style="line-height: 1.3;"
        ></el-input>
      </el-form-item>
      <el-form prop="overlayDisplayNotify">
        <el-checkbox v-model="form.overlayDisplayNotify"></el-checkbox>
        <span class="popupReminderText">在规则修改通知下展示新的签到规则</span>
      </el-form>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">继续</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Object
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        modifyRuleDesc: '',
        overlayDisplayNotify: true
      },
      dialogVisible: false,
      rules: {
        modifyRuleDesc: [
          {
            required: true,
            message: '内容不能为空',
            trigger: 'change'
          }
        ]
      }
    };
  },
  watch: {
    visible(val) {
      if (val !== this.dialogVisible) {
        this.dialogVisible = val;
      }
    },
    dialogVisible(val) {
      if (val !== this.visible) {
        this.$emit('update:visible', val);
      }
    },
    value(val) {
      if (val !== this.form) {
        this.form = val;
      }
    },
    'form.modifyRuleDesc'(val) {
      if (val !== this.value.modifyRuleDesc) {
        this.$emit('input', this.form);
      }
    },
    'form.overlayDisplayNotify'(val) {
      if (val !== this.value.overlayDisplayNotify) {
        this.$emit('input', this.form);
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('onOk');
        }
      });
    }
  }
};
</script>

<style lang="less">
.check-rule {
  &__title {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    .yellow {
      color: #e6a23c;
      margin-right: 10px;
    }
  }
}
</style>