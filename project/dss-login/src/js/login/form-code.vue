<template>
  <div class="box-code">
    <el-form class="portal-form" ref="elForm" :model="form" :rules="rules">
      <el-form-item prop="phone">
        <el-input type="tel" placeholder="请输入您的手机号" v-model="form.phone" />
      </el-form-item>
      <el-form-item prop="vCode">
        <sms-code v-model="form.vCode" :phone="form.phone"></sms-code>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-button type="primary" class="btn-ok btn-top" @click="onOK">登 录</el-button>
      <div class="btn-other">
        <!--<a @click="onJoin">注册账号</a> -->
      </div>
    </div>
    <form-other></form-other>
  </div>
</template>

<script>
  import loginMixin from '../mixins/login';
  import regexps from '@/dss-common/utils/regexps';
  import smsCode from '../sms-code';
  import formOther from './form-other';

  export default {
    mixins: [loginMixin],
    components: {
      smsCode,
      formOther,
    },
    data() {
      return {
        form: {
          phone: '',
          vCode: '',
          identityType: 4,
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
          this.login(this.form);
        });
      },
      onJoin() {
        window.top.location.href = '/quickjoin.html';
      },
    },
  };
</script>
