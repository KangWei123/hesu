<template>
  <div class="login-page">
    <div class="container">
      <div class="bg"></div>
      <img src="../../images/wake-logo.png" class="wake-logo" />
      <img src="../../images/main-img.png" class="main-img" />
      <img src="../../images/block.png" class="block" />
      <div class="login-container" v-loading="loading">
        <el-card class="login-card portal-card">
          <el-tabs class="dss-tab" v-model="activeName">
            <el-tab-pane name="pwd" :label="title">
              <form-reset
                v-if="isReset"
                @ok="onResetOK"
                @onLogin="onLogin"
                @onLoading="showLoading"
                @unLoading="hideLoading"
              ></form-reset>
              <template v-else>
                <form-forget
                  v-if="isForget"
                  @ok="onForgetOK"
                  @onLogin="onLogin"
                  @onLoading="showLoading"
                  @unLoading="hideLoading"
                ></form-forget>
                <form-login v-else @forget="onForget" @onLoading="showLoading" @unLoading="hideLoading"></form-login>
              </template>
            </el-tab-pane>
            <el-tab-pane name="code" label="验证码登录">
              <form-code @onLoading="showLoading" @unLoading="hideLoading"></form-code>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
      <!-- <div class="footer-remind">唤醒企业沉睡的数据资产</div> -->
    </div>
  </div>
</template>

<script>
  // 验证码登录，账号密码登录
  import formLogin from './form-login';
  import formForget from './form-forget';
  import formReset from './form-reset';
  import formCode from './form-code';

  export default {
    components: { formLogin, formReset, formForget, formCode },
    data() {
      return {
        loading: false,
        isForget: false,
        isReset: false,
        activeName: 'pwd',
        title: '账号密码登录',
      };
    },
    methods: {
      onForget() {
        this.title = '找回密码';
        this.isForget = true;
      },
      onForgetOK() {
        this.title = '重置密码';
        this.isReset = true;
        this.isForget = false;
      },
      onResetOK() {
        this.title = '账号密码登录';
        this.isReset = false;
        this.isForget = false;
      },
      onLogin() {
        this.title = '账号密码登录';
        this.isReset = false;
        this.isForget = false;
      },
      showLoading() {
        this.loading = true;
      },
      hideLoading() {
        this.loading = false;
      },
    },
  };
</script>

<style lang="less">
  @r: 37.5rem;
  @s: 7.5%;

  body {
    font-family: PingFangSC, PingFangSC-Medium, Helvetica Neue, Helvetica, Hiragino Sans GB, Microsoft YaHei, Arial,
      sans-serif;
  }

  .login-page {
    min-width: 1200px;
    min-height: 700px;
    height: 100vh;
    overflow: hidden;
  }

  .container {
    width: 1000px;
    height: 100vh;
    margin: 0 auto;
    position: relative;

    .bg {
      position: absolute;
      top: 0;
      right: -461px;
      background: url(../../images/login-bg.png) no-repeat;
      background-size: cover;
      width: 916px;
      height: 1080px;
    }

    .wake-logo {
      position: absolute;
      left: -100px;
      top: 155px;
      width: 180px;
      height: auto;
    }

    .main-img {
      position: absolute;
      left: -250px;
      top: 247px;
      width: 734px;
      height: 396px;
    }

    .block {
      position: absolute;
      left: -195px;
      top: 769px;
      width: 123px;
      height: 48px;
    }
  }

  @media screen and (min-width: 771px) {
    input:-webkit-autofill {
      box-shadow: 0 0 0 1000px #eceff4 inset !important;
    }

    .key-transparent {
      .privateHeader {
        box-shadow: 0 16px 18px 0 #f3f3f3;
      }

      .footer-mobile {
        display: none !important;
      }

      .footer-remind {
        display: none !important;
      }

      .footer-other {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 30px;
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #717378;
        line-height: 22px;

        img {
          width: 64px;
          height: 16px;
          cursor: pointer;
        }
      }

      .login-container {
        display: inline-block;
        width: 400px;
        height: 480px;
        position: absolute;
        top: 180px;
        right: 0;
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 12px 32px 0 rgba(0, 0, 0, 0.06);
        font-weight: 400;
        z-index: 10000;

        .login-card {
          border: none;
          width: 100%;
          height: 100%;
          background-color: #fff;
          box-shadow: 0 12px 32px 0 rgba(0, 0, 0, 0.06);
          border-radius: 10px;
          animation: fade-in-up 0.5s 0.2s ease both;
          -webkit-animation: fade-in-up 0.5s 0.2s ease both;
          -moz-animation: fade-in-up 0.5s 0.2s ease both;
          -ms-animation: fade-in-up 0.5s 0.2s ease both;

          .el-card__body {
            padding: 50px 27px 0 30px !important;
            width: 343px;
            height: 454px;

            .dss-tab {
              .el-tabs__header {
                margin: 0;

                .el-tabs__nav-wrap {
                  .el-tabs__nav-scroll {
                    .el-tabs__nav {
                      float: none;

                      .el-tabs__active-bar {
                        // display: none;
                        width: 108px !important;
                        left: 25px;
                        height: 4px;
                        background: #fa8042;
                      }

                      .el-tabs__item {
                        width: 50%;
                        height: auto;
                        font-size: 18px;
                        color: #3a414a;
                        font-weight: 600;
                      }

                      .is-active {
                        color: #fa8042;
                      }
                    }
                  }
                }

                .el-tabs__nav-wrap::after {
                  display: none;
                }
              }

              .el-tabs__content {
                padding: 50px 0 0;
                height: 340px;

                .el-tab-pane {
                  .el-form {
                    .el-form-item {
                      margin-bottom: 20px;

                      .el-input {
                        .el-input__inner {
                          width: 343px;
                          height: 38px;
                          line-height: 38px;
                          font-size: 14px;
                          background: #fafcfe;
                          border: 1px solid #e2e7f1;
                          border-radius: 3px;
                        }

                        .el-input__inner::-webkit-input-placeholder {
                          /* Webkit browsers */
                          color: #a1a4ab !important;
                        }
                      }

                      .el-button {
                        border-radius: 2px;
                        height: 38px;
                        padding: 11px 20px;
                      }
                    }
                  }

                  .forget-tip {
                    font-size: 12px;
                    color: #a1a4ab;
                    text-align: right;
                    line-height: 20px;
                    text-align: right;
                    margin: 16px 0 0;

                    a {
                      cursor: pointer;
                    }
                  }

                  .btn-box {
                    width: 100%;
                    height: 42px;

                    .btn-ok {
                      width: 100%;
                      height: 42px;
                      line-height: 0;
                      border-radius: 3px;
                    }

                    .btn-other {
                      font-size: 14px;
                      color: #7a7c88;
                      text-align: center;
                      margin: 20px 0 0;

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
      }
    }
  }

  @media screen and (max-width: 770px) {
    .bg {
      display: none;
    }

    .wake-logo {
      display: none;
    }

    .main-img {
      display: none;
    }

    .block {
      display: none;
    }

    .footer-other {
      display: none;
    }

    .login-page {
      min-width: 100%;
    }

    .container {
      width: 100%;
    }

    input:-webkit-autofill {
      box-shadow: 0 0 0 1000px #edf1f7 inset !important;
    }

    .key-transparent {
      .privateHeader {
        box-shadow: 0 6px 10px 0 #f3f3f3 !important;
      }

      .footer-pc {
        display: none !important;
      }

      .footer-mobile {
        display: block !important;
      }

      .el-message {
        max-width: 600 / @r;
        min-width: 600 / @r;
      }

      .login-container {
        position: relative;
        width: 560 / @r;
        margin: 0 auto;
        padding: 130 / @r 95 / @r 214 / @r 95 / @r;

        .login-card {
          border: none;
          box-shadow: none;
          animation: fade-in-up 0.5s 0.2s ease both;
          -webkit-animation: fade-in-up 0.5s 0.2s ease both;
          -moz-animation: fade-in-up 0.5s 0.2s ease both;
          -ms-animation: fade-in-up 0.5s 0.2s ease both;

          .el-card__body {
            padding: 0;

            .el-tabs__header {
              margin-bottom: 66 / @r;

              .el-tabs__nav-wrap::after {
                background: none;
              }

              .el-tabs__nav {
                width: 100%;
                display: flex;
                align-items: center;

                .el-tabs__active-bar {
                  display: none;
                }

                .el-tabs__item {
                  flex: 1;
                  font-size: 26 / @r;
                  font-weight: 400;
                  text-align: center;
                  padding: 0;
                  height: 55 / @r;
                  line-height: 37 / @r;
                }

                .is-active {
                  position: relative;
                }

                .is-active::after {
                  content: '';
                  position: absolute;
                  left: 50%;
                  top: 47 / @r;
                  bottom: auto;
                  right: auto;
                  height: 8 / @r;
                  width: 60 / @r;
                  border-radius: 6 / @r;
                  transform: translateX(-50%);
                }
              }
            }

            .el-tabs__content {
              .el-tab-pane {
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
                          color: #a1a4ab;
                        }

                        .el-input__inner:-moz-placeholder {
                          /* Mozilla Firefox 4 to 8 */
                          color: #a1a4ab;
                        }

                        .el-input__inner::moz-placeholder {
                          /* Mozilla Firefox 19+ */
                          color: #a1a4ab;
                        }

                        .el-input__inner:-ms-input-placeholder {
                          /* Internet Explorer 10+ */
                          color: #a1a4ab;
                        }
                      }
                    }
                  }

                  .el-form-item.is-success {
                    .el-input__inner {
                      border: none;
                    }
                  }
                }

                .btn-box {
                  width: 100%;

                  .btn-ok {
                    color: #fff;
                    border: none;
                    width: 100%;
                    font-size: 30 / @r;
                    font-weight: 400;
                    height: 74 / @r;
                    line-height: 74 / @r;
                    padding: 10 / @r;
                  }

                  .btn-other {
                    font-size: 12px;
                    font-size: 26 / @r;
                    font-weight: 400;
                    color: #999;
                    margin-top: 35 / @r;
                    text-align: center;

                    a {
                      font-size: 30 / @r;
                    }
                  }
                }
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
    .footer-remind {
      position: absolute !important;
      bottom: 0 !important;
      margin-bottom: 0.5rem !important;
    }
  }

  @media screen and (max-height: 414px) and (min-width: 771px) {
    .key-transparent {
      .login-container {
        top: 80px;
        width: 346px;
        height: 320px;

        .login-card {
          .el-card__body {
            padding: 10px 23px !important;
            width: 300px;
            height: 300px;

            .dss-tab {
              .el-tabs__content {
                padding: 30px 0 0;
                height: 225px;
              }
            }
          }
        }
      }
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
