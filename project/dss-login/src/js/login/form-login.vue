<template>
  <div class="box-login">
    <el-form class="portal-form" :rules="rules" :model="form" ref="elForm">
      <el-form-item prop="userName">
        <el-input placeholder="请输入您的用户名/手机号" v-model="form.userName" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          placeholder="请输入您的用户密码"
          @keyup.enter.native="onLogin"
          v-model="form.password"
        />
      </el-form-item>
    </el-form>
    <div class="footer-pc">
      <div class="btn-box">
        <el-button type="primary" class="btn-ok" @click="onLogin">登 录</el-button>
        <div class="btn-other">
          <!-- <a @click="onJoin">注册账号</a> -->
        </div>
      </div>
      <div class="forget-tip">
        <a @click="onForget">忘记密码？</a>
      </div>
    </div>

    <div class="footer-mobile">
      <div class="btn-box">
        <el-button type="primary" class="btn-ok" @click="onLogin">登 录</el-button>
        <div class="btn-other">
          <!-- <a @click="onJoin">免费注册</a> -->
          <a @click="onForget">忘记密码？</a>
        </div>
      </div>
    </div>
    <form-other></form-other>
  </div>
</template>

<script>
  import loginMixin from '../mixins/login';
  import formOther from './form-other';
  export default {
    mixins: [loginMixin],
    components: {
      formOther,
    },
    data() {
      return {
        form: {
          password: '',
          userName: '',
        },
        rules: {
          password: {
            required: true,
            message: '请输入您的用户密码',
          },
          userName: {
            required: true,
            message: '请输入您的用户名/手机号',
          },
        },
      };
    },
    methods: {
      handleQFLogin() {
        location.href = '/c/oidc/redirectToAuthUrl';
      },

      onForget() {
        this.$emit('forget');
      },
      onLogin() {
        if (this.isNotSafe()) {
          return this.$message({
            showClose: true,
            type: 'error',
            duration: 2000,
            message: '跳转失败',
          });
        }
        this.$refs.elForm.validate(valid => {
          if (!valid) {
            return;
          }
          this.login(this.form);
        });
      },
      onJoin() {
        window.location.href = '/quickjoin.html';
      },
    },
  };
</script>

<style lang="less" scoped>
  .box-login {
    .footer-mobile {
      .btn-other {
        display: flex;
        align-items: center;

        a {
          flex: 1;
        }

        a:first-child {
          text-align: left;
        }

        a:last-child {
          text-align: right;
        }
      }
    }
  }
</style>
