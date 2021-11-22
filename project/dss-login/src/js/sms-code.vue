<template>
  <div class="code-item">
    <div class="code-pc">
      <el-input
        :maxlength="6"
        v-model="code"
        placeholder="请输入您收到的验证码"
        @input="onInput"
        @blur="onBlur"
      ></el-input>
      <el-button
        type="primary"
        class="btn-code"
        :disabled="isDisabled"
        @click="onGetSmsCode"
      >{{text}}</el-button>
    </div>

    <div class="code-mobile">
      <el-input
        type="number"
        :maxlength="6"
        v-model="code"
        placeholder="请输入您收到的验证码"
        @input="onInput"
        @blur="onBlur"
      ></el-input>
      <el-button type="text" class="btn-code" :disabled="isDisabled" @click="onGetSmsCode">{{text}}</el-button>
    </div>
  </div>
</template>

<script>
import {getSmsCode} from '@/dss-login/src/api/index';
import emitter from 'element-ui/lib/mixins/emitter.js';
import regexps from '@/dss-common/utils/regexps';

export default {
  mixins: [emitter],
  props: {
    phone: {
      type: String,
      default: '',
      required: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      text: '获取验证码',
      isDisabled: false
    };
  },
  computed: {
    code: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  watch: {
    value(val) {
      //this.dispatch('ElFormItem', 'el.form.blur', [val]);
    }
  },
  beforeDestroy() {
    if (this.taskId) {
      clearInterval(this.taskId);
    }
  },
  methods: {
    inputSmsCode() {
      if (this.taskId) {
        clearInterval(this.taskId);
        this.taskId = null;
        this.isDisabled = false;
      }
      let time = 60;
      this.text = `${time}s`;
      this.isDisabled = true;
      this.taskId = setInterval(() => {
        time--;
        if (time <= 0) {
          clearInterval(this.taskId);
          this.isDisabled = false;
          this.taskId = null;
          this.text = '获取验证码';
          return;
        }
        this.text = `${time}s`;
      }, 1000);
    },
    onGetSmsCode() {
      if (!this.phone) {
        this.$message({
          showClose: true,
          type: 'error',
          duration: 3000,
          message: '请输入您的手机号'
        });
        return;
      } else if (!regexps.phone.reg.test(this.phone)) {
        return;
      }

      getSmsCode(this.phone).done(res => {
        if (res.success) {
          //开始定时器倒数
          this.inputSmsCode();
        }
      });
    },
    onInput(val) {
      this.dispatch('ElFormItem', 'el.form.change', [val]);
    },
    onBlur() {
      this.dispatch('ElFormItem', 'el.form.blur', [this.code]);
    }
  }
};
</script>

<style lang="less" scope>
@r: 37.5rem;
@s: 7.5%;

@media screen and (min-width: 771px) {
  .code-item {
    .code-pc {
      padding-right: 130px;
      .btn-code {
        position: absolute;
        top: 0;
        right: 0;
        width: 116px;
        border-radius: 2px !important;
      }
      .el-button {
        padding: 13px 20px;
      }
      .is-disabled {
        background-color: #c5c5c5 !important;
        border: #c5c5c5 !important;
      }
    }
    .code-mobile {
      display: none !important;
    }
  }
}

@media screen and (max-width: 770px) {
  .code-item {
    .code-pc {
      display: none !important;
    }
    .code-mobile {
      background-color: #edf1f7;
      display: flex;
      .el-input {
        position: static;
        display: inline-block;
        width: auto;
        flex: 1;
      }
      .btn-code {
        display: inline-block;
        width: 203 / @r;
        border-radius: 2px !important;
        padding: 0;
      }
      .el-button--text {
        font-size: 28 / @r;
        font-weight: 400;
        height: 40 / @r !important;
        line-height: 40 / @r !important;
        margin: 17 / @r 0;
        border-left: 2px solid #b3b3b3 !important;
      }
      .is-disabled {
        color: #c0c4cc !important;
      }
    }
  }
}
</style>
