<template>
  <el-dialog :close-on-click-modal="false" :visible="show" :before-close="onClosed">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="ruleDescription" label="规则说明">
        <el-input
          class="long-input"
          type="textarea"
          placeholder="规则说明将被展示在活动页底部，500字以内"
          :autosize="{ minRows: 5, maxRows:6}"
          v-model="form.ruleDescription"
          @change="onChange"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button @click="onSubmit()" type="primary" :loading="loading">修 改</el-button>
    </span>
  </el-dialog>
</template>
<script>
import luckyApi from '@/dss-wechat3rd/src/api/lucky.js';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },

    initRuleDescription: {
      type: String,
      required: false,
      default: ''
    },
    id: {
      type: Number,
      required: true
    }
  },

  watch: {
    initRuleDescription() {
      this.form.ruleDescription = this.initRuleDescription;
    }
  },

  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          luckyApi
            .modify({ ...this.form, id: this.id })
            .then(data => {
              if (data.success) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
              }
            })
            .always(() => {
              this.loading = false;
              this.show = false;
            });
        }
      });
    },
    onChange() {
      this.form.ruleDescription = this.form.ruleDescription.trim();
    },
    onCancel() {
      this.resetDesc();
      this.show = false;
    },
    onClosed() {
      this.resetDesc();
      this.show = false;
    },
    resetDesc() {
      this.form.ruleDescription = this.initRuleDescription;
    }
  },

  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },

  data() {
    return {
      loading: false,
      form: {
        ruleDescription: ''
      },
      rules: {
        ruleDescription: [
          { required: true, message: '请输入活动规则说明', trigger: 'blur' },
          {
            min: 1,
            max: 500,
            message: '活动规则只能在500字以内！',
            trigger: 'change'
          }
        ]
      }
    };
  }
};
</script>
