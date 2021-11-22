<template>
  <div class="register-container" v-loading="loading">
    <el-card class="register-box">
      <div slot="header" class="clearfix">
        <!-- <span>注册账号</span>-->
      </div>

      <el-form class="portal-form" ref="elForm" :model="form" :rules="rules">
        <el-form-item prop="name">
          <el-input placeholder="请输入您的用户名" v-model="form.name" />
        </el-form-item>

        <el-form-item prop="phone">
          <el-input type="tel" placeholder="请输入您的手机号" v-model="form.phone" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input auto-complete="new-password" type="password" placeholder="请输入您的密码" v-model="form.password" />
        </el-form-item>

        <el-form-item prop="againPassword">
          <el-input auto-complete="new-password" type="password" placeholder="确认密码" v-model="form.againPassword" />
        </el-form-item>

        <el-form-item prop="checkCode">
          <sms-code v-model="form.checkCode" :phone="form.phone"></sms-code>
        </el-form-item>
      </el-form>

      <div class="btn-box">
        <el-button type="primary" class="btn-submit" @click="clickSubmit">提交注册 </el-button>
        <div class="btn-other">
          <a @click="toLogin">已有账号，去登录</a>
        </div>
      </div>
    </el-card>
    <div class="footer-remind">唤醒企业沉睡的数据资产</div>
  </div>
</template>

<script>
  import { quickJoin } from '@/dss-login/src/api/index';
  import regexps from '@/dss-common/utils/regexps';
  import smsCode from '../sms-code.vue';
  import loginMixin from '../mixins/login';

  export default {
    mixins: [loginMixin],
    components: {
      smsCode,
      // figureCode
    },
    data() {
      const checkAgainPassword = (rule, value, callback) => {
        if (value === '' || value == null) {
          return callback(new Error('请输入确认密码'));
        } else if (value !== this.form.password) {
          return callback(new Error('确认密码不正确'));
        } else {
          return callback();
        }
      };
      const { phone } = regexps;
      const smsCodeReg = regexps.smsCode;
      return {
        loading: false,
        rules: {
          name: [
            { required: true, message: '请输入您的用户名', trigger: 'blur' },
            {
              pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
              message: '1~16字符，只允许中文、大小写字母、数字组成',
              trigger: 'blur',
            },
            {
              min: 1,
              max: 16,
              message: '1~16字符，只允许中文、大小写字母、数字组成',
              trigger: 'blur',
            },
          ],
          phone: [
            { required: true, message: '请输入您的手机号码', trigger: 'blur' },
            { pattern: phone.reg, message: phone.msg, trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入您的密码', trigger: 'blur' },
            {
              pattern:
                /(^((?=.*\d)((?=.*[a-zA-Z])|(?=.*[~`!@#$%^&*?\(\)\-\_\=\+\[\]\\{}|;:'",./<>])))|((?=.*[a-zA-Z])(?=.*[~`!@#$%^&*?\(\)\-\_\=\+\[\]\\{}|;:'",./<>]).{6,16})$)(^\S*$)/,
              message: '6~16字符，字母、数字、符号中至少2种，不能有空格',
              trigger: 'blur',
            },
            {
              min: 6,
              max: 16,
              message: '6~16字符，字母、数字、符号中至少2种，不能有空格',
              trigger: 'blur',
            },
          ],
          againPassword: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            {
              pattern:
                /(^((?=.*\d)((?=.*[a-zA-Z])|(?=.*[~`!@#$%^&*?\(\)\-\_\=\+\[\]\\{}|;:'",./<>])))|((?=.*[a-zA-Z])(?=.*[~`!@#$%^&*?\(\)\-\_\=\+\[\]\\{}|;:'",./<>]).{6,16})$)(^\S*$)/,
              message: '6~16字符，字母、数字、符号中至少2种，不能有空格',
              trigger: 'blur',
            },
            {
              min: 6,
              max: 16,
              message: '6~16字符，字母、数字、符号中至少2种，不能有空格',
              trigger: 'blur',
            },
            { validator: checkAgainPassword, trigger: 'blur' },
          ],
          checkCode: [
            { required: true, message: '请输入验证码' },
            { pattern: smsCodeReg.reg, message: smsCodeReg.msg },
          ],
          // checkFigureCode: [
          //   { required: true, message: '请输入图形验证码', trigger: 'blur' }
          // ]
        },

        form: {
          name: '',
          phone: '', // 电话
          password: '', // 密码
          againPassword: '',
          checkCode: '', // 验证码
          // checkFigureCode: '' // 图形验证码
        },
      };
    },
    methods: {
      clickSubmit() {
        this.$refs.elForm.validate(valid => {
          if (valid) {
            this.quickJoin();
          } else {
            return false;
          }
        });
      },
      quickJoin() {
        this.loading = true;
        quickJoin({
          userName: this.form.name,
          phone: this.form.phone,
          password: this.form.password,
          checkCode: this.form.checkCode,
        })
          .then(data => {
            if (!data.success || data.success === 'false' || data.data === false || data.data === 'false') {
              this.loading = false;
              this.$message.error(data.errorMessage || '提交失败');
              return;
            }

            this.$message({
              showClose: true,
              type: 'success',
              duration: 3000,
              message: '注册成功',
            });

            setTimeout(() => {
              this.loading = false;

              // 注册完成之后默认登录，跳转给定的链接或首页
              this.login({
                password: this.form.password,
                userName: this.form.name,
              });

              for (const key in this.form) {
                this.form[key] = '';
              }
              this.$refs.elForm.resetFields();

              /* const gotoUrl = utilUrl.queryString('gotoUrl', window.location.href);
              if (gotoUrl) {
                window.top.location.href = gotoUrl;
              } else {
                window.top.location.href = '/login.html';
              } */
            }, 3000);
          })
          .catch(data => {
            this.loading = false;
          });
      },

      // 去登录
      toLogin() {
        window.top.location.href = '/login.html';
      },
    },
  };
</script>

<style rel="stylesheet/less" lang="less">
  @r: 37.5rem;
  @s: 7.5%;

  @media screen and (min-width: 771px) {
    .el-loading-mask {
      z-index: 19;
    }

    .el-message {
      z-index: 20;
    }

    input:-webkit-autofill {
      box-shadow: 0 0 0 1000px #eceff4 inset !important;
    }

    .key-transparent {
      .footer-remind {
        display: none !important;
      }

      .privateHeader {
        box-shadow: 0 16px 18px 0 #f3f3f3;
      }

      .register-container {
        display: inline-block;
        width: 400px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        z-index: 10000;

        .register-box {
          color: #303133;
          border: none;
          padding: 23px !important;
          width: 354px;
          height: 454px;
          background-color: #fff;
          box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1) !important;
          border-radius: 10px;
          animation: fade-in-up 0.5s 0.2s ease both;
          -webkit-animation: fade-in-up 0.5s 0.2s ease both;
          -moz-animation: fade-in-up 0.5s 0.2s ease both;
          -ms-animation: fade-in-up 0.5s 0.2s ease both;

          .el-card__header {
            font-size: 16px;
            color: #3268d6;
            text-align: center;
            padding: 0;
            border: none;
          }

          .el-card__body {
            padding: 31px 0 0;
            position: relative;
            height: 402px;

            .el-form {
              .el-form-item {
                margin: 0 auto 25px;

                .el-form-item__content {
                  .el-input {
                    .el-input__inner {
                      background-color: #eceff4 !important;
                      border-radius: 2px !important;
                      border: none;
                      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                      -webkit-user-modify: read-write-plaintext-only;
                      outline: 0;
                    }
                  }

                  .el-button {
                    background-color: #3268d6;
                    padding: 13px 20px;
                  }

                  .is-disabled {
                    background-color: #c5c5c5 !important;
                    border: #c5c5c5 !important;
                  }
                }
              }
            }

            .btn-box {
              position: absolute;
              width: 100%;
              bottom: 0;

              .el-button--primary {
                width: 100%;
                height: 40px;
                line-height: 0;
                border-radius: 2px;
                background-color: #3268d6;
                border-color: #3268d6;
              }

              .btn-other {
                font-size: 14px;
                text-align: center;
                color: #999;
                margin: 20px auto 0;

                a {
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 770px) {
    input:-webkit-autofill {
      box-shadow: 0 0 0 1000px #edf1f7 inset !important;
    }

    .key-transparent {
      .el-message {
        max-width: 600 / @r;
        min-width: 600 / @r;
      }

      .privateHeader {
        box-shadow: 0 6px 10px 0 #f3f3f3 !important;
      }

      .register-container {
        width: 560 / @r;
        margin: 0 auto;
        padding: 50 / @r 95 / @r 134 / @r 95 / @r;

        .register-box {
          color: #303133;
          border: none;
          box-shadow: none;
          animation: fade-in-up 0.5s 0.2s ease both;
          -webkit-animation: fade-in-up 0.5s 0.2s ease both;
          -moz-animation: fade-in-up 0.5s 0.2s ease both;
          -ms-animation: fade-in-up 0.5s 0.2s ease both;

          .el-card__header {
            margin-bottom: 30 / @r;
            font-size: 26 / @r;
            color: #3268d6;
            text-align: center;
            padding: 0;
            border: none;
          }

          .el-card__body {
            padding: 0;

            .el-form {
              .el-form-item {
                margin-bottom: 40 / @r;

                .el-form-item__content {
                  line-height: 0;

                  .el-input {
                    background-color: #edf1f7 !important;
                    height: 74 / @r;
                    line-height: 74 / @r;

                    .el-input__inner {
                      font-size: 28 / @r;
                      color: #000;
                      border: none;
                      border-radius: 4px;
                      background-color: #edf1f7 !important;
                      height: 40 / @r;
                      line-height: 40 / @r;
                      padding: 0 36 / @r 0 40 / @r;
                      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                      -webkit-user-modify: read-write-plaintext-only;
                      outline: 0;
                    }

                    .el-input__inner::-webkit-input-placeholder {
                      /* Webkit browsers */
                      color: #999;
                    }

                    .el-input__inner:-moz-placeholder {
                      /* Mozilla Firefox 4 to 8 */
                      color: #999;
                    }

                    .el-input__inner::moz-placeholder {
                      /* Mozilla Firefox 19+ */
                      color: #999;
                    }

                    .el-input__inner:-ms-input-placeholder {
                      /* Internet Explorer 10+ */
                      color: #999;
                    }
                  }
                }
              }
            }

            .btn-box {
              width: 100%;

              .btn-submit {
                color: #fff;
                background-color: #3268d6;
                border: none;
                width: 100%;
                font-size: 30 / @r;
                font-weight: 400;
                height: 74 / @r;
                line-height: 74 / @r;
                padding: 0;
              }

              .btn-other {
                font-size: 26 / @r;
                color: #7a7c88;
                text-align: center;
                margin-top: 35 / @r;
              }
            }
          }
        }

        .footer-remind {
          position: fixed;
          left: 0;
          bottom: 81 / @r;
          width: 100%;
          font-size: 24 / @r;
          font-weight: 400;
          color: #999;
          text-align: center;
        }
      }
    }
  }

  @media screen and (max-height: 414px) {
    .register-container {
      position: relative !important;
    }

    .footer-remind {
      position: absolute !important;
      bottom: 0 !important;
      margin-bottom: 0.5rem !important;
    }
  }

  //动画效果
  @-webkit-keyframes fade-in-up {
    0% {
      opacity: 0;
      -webkit-transform: translateY(20px);
      transform: translateY(20px);
    }

    100% {
      opacity: 1;
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
  }

  @-moz-keyframes fade-in-up {
    0% {
      opacity: 0;
      -moz-transform: translateY(20px);
    }

    100% {
      opacity: 1;
      -moz-transform: translateY(0);
    }
  }

  @-ms-keyframes fade-in-up {
    0% {
      opacity: 0;
      -ms-transform: translateY(20px);
    }

    100% {
      opacity: 1;
      -ms-transform: translateY(0);
    }
  }
</style>
