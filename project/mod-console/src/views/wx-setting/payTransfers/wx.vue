<template>
  <div>
    <el-form
      label-position="left"
      ref="selfForm"
      :model="selfForm"
      key="selfForm"
      size="small"
      label-width="210px"
      style="margin: 0; height: 100%"
      :rules="selfRules"
      class="dss-form"
    >
      <el-form-item label=" APP ID：" prop="wxAppId">
        <el-input type="input" v-model="selfForm.wxAppId" placeholder="请输入小程序APP ID"></el-input>
      </el-form-item>

      <el-form-item label="AppSecret：" prop="wxAppSecret">
        <el-input type="input" v-model="selfForm.wxAppSecret" placeholder="请输入小程序AppSecret"></el-input>
      </el-form-item>

      <el-form-item label="微信支付商户号：" prop="mchId">
        <el-input type="input" v-model="selfForm.mchId" placeholder="请输入微信支付商户号"></el-input>
      </el-form-item>

      <el-form-item label="微信支付Api密钥：" prop="mchKey">
        <el-input type="input" v-model="selfForm.mchKey" placeholder="请输入微信支付Api密钥"></el-input>
      </el-form-item>

      <el-form-item label="微信支付apiclient_cert.p12：" prop="certPath">
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

  function initSelfForm() {
    return {
      wxAppId: '',
      wxAppSecret: '',
      mchId: '',
      mchKey: '',
      certPath: '',
    };
  }
  const Error = '不能为空';
  export default {
    name: 'WXForm',
    props: {
      payConfigType: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        payRules: {}, // 后端保存的支付配置信息
        selfForm: initSelfForm(),
        selfRules: {
          wxAppId: [{ required: true, message: Error, trigger: 'blur' }],
          wxAppSecret: [{ required: true, message: Error, trigger: 'blur' }],
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
    methods: {
      getPaySettings() {
        settingsApi
          .getWxPayTransfersSetting()
          .then(res => {
            this.payRules = res.data || {};
            this.setPayForm();
          })
          .always(() => {
            this.$emit('finished');
          });
      },
      setPayForm() {
        if (this.payRules && Object.keys(this.payRules).length) {
          for (const key in this.selfForm) {
            this.selfForm[key] = this.payRules[key] || '';
          }
          this.$nextTick(() => {
            // 切换表单类型之后，重新进行表单验证，目的是为了去除上一类型中的表单验证
            this.$refs.selfForm.validate(valid => {});
          });
        } else {
          this.selfForm = initSelfForm();
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
          this.selfForm.certPath = opt.data;
        }
      },
      handleError(opt) {
        this.$message({
          type: 'error',
          message: `上传失败：${opt && opt.errorMessage ? opt.errorMessage : ''}`,
        });
      },
      clickSave() {
        this.$refs.selfForm.validate(valid => {
          if (valid) {
            const form = this.selfForm;
            settingsApi.updatePayTransfersSetting(form).then(() => {
              this.$message({ message: '保存成功', type: 'success' });
              this.getPaySettings();
            });
          } else {
            return false;
          }
        });
      },
    },
  };
</script>

<style scoped>
  .wx-setting-pay .header {
    display: flex;
    flex-direction: row;
  }

  .wx-setting-pay .header .header__label {
    width: 210px;
    text-align: left;
    color: #717378;
    font-size: 15px;
    padding-left: 10px;
  }

  .wx-setting-pay .dss-form {
    padding-top: 18px;
  }

  .wx-setting-pay .el-form-item__label {
    color: #717378;
  }
</style>
