<template>
  <div class="box-forget">
    <el-form class="portal-form" :rules="rules" ref="elForm" :model="form">
      <el-form-item prop="phone">
        <el-input type="tel" v-model="form.phone" placeholder="请输入您的手机号" />
      </el-form-item>
      <el-form-item prop="vcode">
        <sms-code v-model="form.vcode" :phone="form.phone"></sms-code>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-button type="primary" class="btn-ok btn-top" @click="onOK">确 认</el-button>
      <div class="btn-other">
        <a @click="onLogin">去登录</a>
      </div>
    </div>
  </div>
</template>

<script>
  import { checkCodeResetPwd } from '@/dss-login/src/api/index';
  import regexps from '@/dss-common/utils/regexps';
  import smsCode from '../sms-code';

  export default {
    components: {
      smsCode,
    },
    data() {
      return {
        form: {
          phone: '',
          vcode: '',
        },
        rules: {
          phone: [
            { required: true, message: '请输入您的手机号', trigger: 'blur' },
            {
              pattern: regexps.phone.reg,
              message: regexps.phone.msg,
              trigger: 'blur',
            },
          ],
          vcode: [
            { required: true, message: '请输入验证', trigger: 'blur' },
            {
              pattern: regexps.smsCode.reg,
              message: regexps.smsCode.msg,
              trigger: 'blur',
            },
          ],
        },
      };
    },
    methods: {
      onOK() {
        this.$refs.elForm.validate(valid => {
          if (!valid) {
            return;
          }
          this.submit();
        });
      },
      submit() {
        this.$emit('onLoading');
        checkCodeResetPwd(this.form)
          .then(res => {
            this.$emit('unLoading');
            if (!res.success || res.success === 'false' || res.data === false || res.data === 'false') {
              this.$message({
                showClose: true,
                type: 'error',
                duration: 2000,
                message: res.errorMessage || '验证码校验失败',
              });
            } else {
              this.$emit('ok');
            }
          })
          .catch(res => {
            this.$emit('unLoading');
          });
      },
      onLogin() {
        this.$emit('onLogin');
      },
    },
  };
</script>
