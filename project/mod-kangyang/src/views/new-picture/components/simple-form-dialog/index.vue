<template>
  <el-dialog :title="title" :visible.sync="showPopup" append-to-body class="common-dialog" width="420px">
    <el-form :model="form" ref="form" :rules="rules">
      <el-form-item :label="label" prop="value">
        <el-input v-model.trim="form.value" :placeholder="placeholder" clearable :max-length="byte"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import regexps from 'wk-bz-common/src/modules/dsp/utils/regexps';

  export default {
    name: 'SimpleFormDialog',
    props: {
      // 是否显示弹窗
      visible: {
        type: Boolean,
        default: false,
      },
      // 弹窗标题
      title: {
        type: String,
        default: '标题',
      },
      // label
      label: {
        type: String,
        default: '请输入',
      },
      // placeholder
      placeholder: {
        type: String,
        default: '请输入内容',
      },
      byte: {
        type: Number,
        default: 20,
      },
      // 默认value
      defaultValue: {
        type: String,
        default: '',
      },
      // loading
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      // 规则，中文占2个字节，其他算一个字节
      const checkByte = (rule, value, callback) => {
        if (value.replace(/[\u4e00-\u9fa5]/g, 'aa').length > this.byte) {
          callback(new Error(`不超过${this.byte}字节，中文2字节，英文/数字1字节`));
        }
        callback();
      };

      return {
        form: {
          value: '',
        },
        rules: {
          value: [
            { required: true, message: this.placeholder, trigger: 'blur' },
            { validator: checkByte, trigger: 'blur' },
            {
              pattern: regexps.simpleName.reg,
              message: regexps.simpleName.msg,
              trigger: 'blur',
            },
          ],
        },
      };
    },
    computed: {
      // 计算属性-是否显示弹窗
      showPopup: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
    },
    mounted() {
      this.form.value = this.defaultValue;
    },
    methods: {
      // 关闭弹窗
      handleClose() {
        this.showPopup = false;
      },

      // 确定
      handleSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$emit('handleSubmit', this.form.value);
          }
        });
      },
    },
  };
</script>
<style lang="less" scoped>
  @import '../../css/common.less';

  .common-dialog {
    /deep/ .el-form {
      margin: 26px 0 35px;
    }

    /deep/ .el-form-item {
      display: flex;
      justify-content: center;
    }
  }
</style>
