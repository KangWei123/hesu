<template>
  <div class="box-reset">
    <el-form :rules="rules" :model="form" ref="elForm">
      <el-form-item prop="password1">
        <el-input type="password" placeholder="请输入您的新密码" v-model="form.password1" />
      </el-form-item>
      <el-form-item prop="password2">
        <el-input type="password" placeholder="请再次输入您的新密码" v-model="form.password2" />
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
  import { changePwd } from '@/dss-login/src/api/index';
  import regexps from '@/dss-common/utils/regexps';

  export default {
    data() {
      const checkPwd = (rules, value, callback) => {
        if (this.form.password1 !== value) {
          return callback(new Error('两次密码不匹配，请重新输入'));
        }
        return callback();
      };
      const { password } = regexps;
      return {
        form: {
          password1: '',
          password2: '',
        },
        rules: {
          password1: [
            { required: true, message: '请输入您的密码', trigger: 'blur' },
            {
              pattern: password.reg,
              message: '6~16字符，字母、数字、符号中至少2种，不能有空格',
              trigger: 'blur',
            },
          ],
          password2: [
            {
              required: true,
              message: '请再次输入您的新密码',
              trigger: 'blur',
            },
            {
              pattern: password.reg,
              message: '6~16字符，字母、数字、符号中至少2种，不能有空格',
              trigger: 'blur',
            },
            { validator: checkPwd, trigger: 'blur' },
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
        changePwd(this.form)
          .then(res => {
            if (!res.success || res.success === 'false' || res.data === false || res.data === 'false') {
              this.$emit('unLoading');
              this.$message({
                showClose: true,
                type: 'error',
                duration: 2000,
                message: res.errorMessage || '密码重置失败',
              });
            } else {
              this.$message({
                showClose: true,
                type: 'success',
                duration: 3000,
                message: '密码重置成功',
              });

              setTimeout(() => {
                this.$emit('unLoading');
                this.$emit('ok');
              }, 3000);
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
