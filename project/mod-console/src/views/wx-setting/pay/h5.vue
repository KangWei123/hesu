<template>
  <div>
    <div class="header">
      <div class="header__label">模式选择：</div>
      <div>
        <el-radio v-model="payType" label="2">普通模式</el-radio>
        <el-radio v-model="payType" label="1">自助申请模式</el-radio>
      </div>
    </div>
    <!-- 公众号,小程序,企业微信，APP -->
    <!-- 普通模式 -->
    <el-form
      ref="proxyForm"
      v-if="payType == 2"
      key="proxyForm"
      :model="proxyForm"
      :rules="proxyRules"
      label-width="210px"
      label-suffix=":"
      class="dss-form"
    >
      <el-form-item label="APP ID" prop="subWxAppId">
        <el-input type="input" v-model="proxyForm.subWxAppId" placeholder="请输入APP ID"></el-input>
        <div class="surfix">
          <el-popover
            trigger="hover"
            placement="top-start"
            content="AppId可填写微信公众号/小程序/APP/企业微信中的任意一个AppId"
          >
            <i class="el-icon-warning" slot="reference" />
          </el-popover>
        </div>
      </el-form-item>
      <el-form-item label="微信支付子商户号" prop="subMchId">
        <el-input type="input" v-model="proxyForm.subMchId" placeholder="请输入微信支付子商户号"></el-input>
      </el-form-item>

      <el-form-item label="微信支付Api密钥" prop="subCertPassword">
        <el-input type="input" v-model="proxyForm.subCertPassword" placeholder="请输入微信支付Api密钥"></el-input>
      </el-form-item>

      <el-form-item label="支付apiclient_cert.p12" prop="subCertPath">
        <el-upload
          action="/wp/app/upload_cert"
          :show-file-list="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeUpload"
        >
          <el-input type="input" readonly v-model="proxyForm.subCertPath"></el-input>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <a href="javascript:;" @click="handleToSort" style="color: #3879fb">如需设置经销商商户号，点击这里</a>
      </el-form-item>
    </el-form>

    <!-- 自助申请模式 -->
    <el-form
      ref="selfForm"
      :model="selfForm"
      v-if="payType == 1"
      key="selfForm"
      label-width="210px"
      label-suffix=":"
      :rules="selfRules"
      class="dss-form"
    >
      <el-form-item label="APP ID" prop="wxAppId">
        <el-input type="input" v-model="selfForm.wxAppId" placeholder="请输入APP ID"></el-input>
        <div class="surfix">
          <el-popover
            trigger="hover"
            placement="top-start"
            content="AppId可填写微信公众号/小程序/APP/企业微信中的任意一个AppId"
          >
            <i class="el-icon-warning" slot="reference" />
          </el-popover>
        </div>
      </el-form-item>
      <el-form-item label="微信支付商户号" prop="mchId">
        <el-input type="input" v-model="selfForm.mchId" placeholder="请输入微信支付商户号"></el-input>
      </el-form-item>

      <el-form-item label="微信支付Api密钥" prop="mchKey">
        <el-input type="input" v-model="selfForm.mchKey" placeholder="请输入微信支付Api密钥"></el-input>
      </el-form-item>

      <el-form-item label="微信支付apiclient_cert.p12" prop="certPath">
        <el-upload
          action="/wp/app/upload_cert"
          :show-file-list="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeUpload"
        >
          <el-input type="input" readonly v-model="selfForm.certPath"></el-input>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import settingsApi from '@/mod-console/src/api/settings';
  import payEnum from '@/mod-console/src/constants/pay';

  function initProxyForm() {
    return {
      subWxAppId: '',
      subWxAppSecret: '1x'.repeat(16), // H5不需要AppSecret 这里随便写一个用于后端接口兼容
      subMchId: '',
      subCertPassword: '',
      subCertPath: '',
    };
  }
  function initSelfForm() {
    return {
      wxAppId: '',
      wxAppSecret: '1x'.repeat(16), // H5不需要AppSecret 这里随便写一个用于后端接口兼容
      mchId: '',
      mchKey: '',
      certPath: '',
    };
  }
  const Error = '不能为空';
  export default {
    name: 'H5Form',
    props: {
      formLabel: {
        type: String,
        default: '',
      },
      payConfigType: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        payType: '1', // 代理服务商 payType:2 ; 自助申请模式 payType:1
        payRules: [], // 后端保存的支付配置信息
        proxyForm: initProxyForm(),
        selfForm: initSelfForm(),
        proxyRules: {
          subWxAppId: [{ required: true, message: Error, trigger: 'blur' }],
          subMchId: [{ required: true, message: Error, trigger: 'blur' }],
        },
        selfRules: {
          wxAppId: [{ required: true, message: Error, trigger: 'blur' }],
          mchId: [{ required: true, message: Error, trigger: 'blur' }],
          mchKey: [{ required: true, message: Error, trigger: 'blur' }],
          certPath: [
            {
              required: true,
              message: '请上传微信支付apiclient_cert.p12文件',
              trigger: ['blur', 'change'],
            },
          ],
        },
      };
    },
    mounted() {
      this.getPaySettings();
    },
    watch: {
      payType: {
        immediate: true,
        handler(newVal) {
          const payRules = this.payRules;
          const payRule = payRules.find(item => {
            return (
              (item.type === +this.payConfigType && item.payType === +newVal) ||
              (item.type === null && this.payConfigType !== payEnum.PAY_CONFIG.H5.value)
            ); // item.type === null，为了兼容以前的type为null的情况
          });
          if (!payRule) {
            if (newVal === '1') this.selfForm = initSelfForm();
            if (newVal === '2') this.proxyForm = initProxyForm();
          }
        },
      },
    },
    methods: {
      getPaySettings() {
        settingsApi
          .getWxPaySetting()
          .then(res => {
            this.payRules = res.data || [];
            this.setPayForm();
          })
          .always(() => {
            this.$emit('finished');
          });
      },
      setPayForm() {
        const payRules = this.payRules;
        if (payRules && payRules.length) {
          /* 当前支付配置信息，是小程序还是公众号 */
          const payRule = payRules.find(item => {
            return item.type === +this.payConfigType;
          });

          if (payRule) {
            this.payType = payRule.payType === 2 ? '2' : payRule.payType === 1 ? '1' : '2';
            if (payRule.payType === 2) {
              for (const key in this.proxyForm) {
                this.proxyForm[key] = payRule[key] || '';
              }
            } else if (payRule.payType === 1) {
              for (const key in this.selfForm) {
                this.selfForm[key] = payRule[key] || '';
              }
            }
          } else {
            this.selfForm = initSelfForm();
            this.proxyForm = initProxyForm();
          }

          this.$nextTick(() => {
            // 切换表单类型之后，重新进行表单验证，目的是为了去除上一类型中的表单验证
            this.$refs[this.payType === '1' ? 'selfForm' : 'proxyForm'].clearValidate();
          });
        }
      },
      beforeUpload(file) {
        const type = file.type;
        const passed = !!type && type in { 'application/x-pkcs12': 1, p12: 1 };
        if (!passed) {
          this.$message({
            type: 'warn',
            message: '文件类型不正确',
          });
          return false;
        }
        return true;
      },
      handleSuccess(opt) {
        if (!opt.success) {
          this.$message({
            type: 'error',
            message: `上传失败：${opt.errorMessage}`,
          });
        } else {
          // 自助申请模式
          if (this.payType === '1') this.selfForm.certPath = opt.data;
          // 普通模式
          else this.proxyForm.subCertPath = opt.data;
        }
      },
      handleError(opt) {
        this.$message({
          type: 'error',
          message: `上传失败：${opt && opt.errorMessage ? opt.errorMessage : ''}`,
        });
      },
      handleToSort() {
        window.location.href = '/system-setting.html#/sorting';
      },
      clickSave() {
        this.$refs[this.payType === '1' ? 'selfForm' : 'proxyForm'].validate(valid => {
          if (valid) {
            try {
              this.$emit('load');
              const form = this.payType === '1' ? this.selfForm : this.proxyForm;
              settingsApi.updateWxPaySetting({ type: this.payConfigType, payType: this.payType - 0, ...form });
              this.$message({ message: '保存成功', type: 'success' });
            } catch (error) {
            } finally {
              this.$emit('finished');
            }
          } else {
            return false;
          }
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .wx-setting-pay .header {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .wx-setting-pay .header .header__label {
    width: 210px;
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #717378;
    line-height: 40px;
    box-sizing: border-box;
  }

  .wx-setting-pay .dss-form {
    width: 430px;
    padding-top: 18px;
  }

  .wx-setting-pay .el-form-item__label {
    color: #717378;
  }

  .surfix {
    position: absolute;
    right: -20px;
    top: 0;
  }
</style>
