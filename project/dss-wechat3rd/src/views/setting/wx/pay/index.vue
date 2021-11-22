<template>
  <div class="wx-setting-pay" v-loading="loading" element-loading-spinner="el-icon-loading">
    <el-tabs type="card" v-model="payConfigType">
      <el-tab-pane :name="payConfig.WX_MA.value" :label="payConfig.WX_MA.label"></el-tab-pane>
      <el-tab-pane :name="payConfig.WX_MP.value" :label="payConfig.WX_MP.label"></el-tab-pane>
    </el-tabs>
    <div class="header">
      <div class="header__label">模式选择：</div>
      <div>
        <el-radio v-model="payType" label="2">普通模式</el-radio>
        <el-radio v-model="payType" label="1">自助申请模式</el-radio>
      </div>
      
    </div>

    <el-form
      label-position="left"
      ref="proxyForm"
      v-if="payType == 2"
      key="proxyForm"
      size="small"
      :model="proxyForm"
      :rules="proxyRules"
      label-width="210px"
      style="margin: 0;height: 100%"
      class="dss-form"
    >
      <el-form-item :label="formLabel + 'APP ID：'" prop="subWxAppId">
        <el-input type="input" v-model="proxyForm.subWxAppId" placeholder="请输入小程序APP ID"></el-input>
      </el-form-item>

      <el-form-item :label="formLabel + 'AppSecret：'" prop="subWxAppSecret">
        <el-input type="input" v-model="proxyForm.subWxAppSecret" placeholder="请输入小程序AppSecret"></el-input>
      </el-form-item>

      <el-form-item label="微信支付子商户号：" prop="subMchId">
        <el-input type="input" v-model="proxyForm.subMchId" placeholder="请输入微信支付子商户号"></el-input>
      </el-form-item>

      <el-form-item label="微信支付Api密钥：" prop="subCertPassword">
        <el-input type="input" v-model="proxyForm.subCertPassword" placeholder="请输入微信支付Api密钥"></el-input>
      </el-form-item>

      <el-form-item label="微信支付apiclient_cert.p12：" prop="subCertPath">
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

      <el-form-item >
        <a href="javascript:;" @click="handleToSort" style="color: #3879FB;" >如需设置经销商商户号，点击这里</a>
      </el-form-item>

      <div class="bottom-button">
        <el-button type="primary" :title="this.allowOperate ? '' : '暂无权限操作'" @click="clickSave">保存</el-button>
      </div>
    </el-form>

    <el-form
      label-position="left"
      ref="selfForm"
      :model="selfForm"
      v-if="payType == 1"
      key="selfForm"
      size="small"
      label-width="210px"
      style="margin:0; height: 100%"
      :rules="selfRules"
      class="dss-form"
    >
      <el-form-item :label="formLabel + 'APP ID：'" prop="wxAppId">
        <el-input type="input" v-model="selfForm.wxAppId" placeholder="请输入小程序APP ID"></el-input>
      </el-form-item>

      <el-form-item :label="formLabel + 'AppSecret：'" prop="wxAppSecret">
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
      <div class="bottom-button">
        <el-button type="primary" :title="this.allowOperate ? '' : '暂无权限操作'" @click="clickSave">保存</el-button>
      </div>
    </el-form>
    
  </div>
</template>

<style>
.wx-setting-pay {
  margin-top: 16px;
  background-color: #fff;
  padding: 20px;
}
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

<script>
import settingsApi from '@/dss-wechat3rd/src/api/settings';
import { mapState } from 'vuex';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';
import payEnum from '@/dss-wechat3rd/src/constants/pay';

function initProxyForm() {
  return {
    subWxAppId: '',
    subWxAppSecret: '',
    subMchId: '',
    subCertPassword: '',
    subCertPath: ''
  };
}

function initSelfForm() {
  return {
    wxAppId: '',
    wxAppSecret: '',
    mchId: '',
    mchKey: '',
    certPath: ''
  };
}

const Error = '不能为空';
export default {
  data() {
    return {
      payConfig: payEnum.PAY_CONFIG,
      loading: true,
      submitting: false,
      payConfigType: payEnum.PAY_CONFIG.WX_MA.value, //支付配置，小程序支付或者公众号支付信息配置
      payRules: [], //后端保存的支付配置信息
      payType: '2', //代理服务商 payType:2 ; 自助申请模式 payType:1
      proxyForm: initProxyForm(),
      proxyRules: {
        subWxAppId: [{ required: true, message: Error, trigger: 'blur' }],
        subWxAppSecret: [{ required: true, message: Error, trigger: 'blur' }],
        subMchId: [{ required: true, message: Error, trigger: 'blur' }]
      },
      selfRules: {
        wxAppId: [{ required: true, message: Error, trigger: 'blur' }],
        wxAppSecret: [{ required: true, message: Error, trigger: 'blur' }],
        mchId: [{ required: true, message: Error, trigger: 'blur' }],
        mchKey: [{ required: true, message: Error, trigger: 'blur' }],
        certPath: [
          {
            required: true,
            message: '请上传微信支付apiclient_cert.p12文件',
            trigger: ['blur', 'change']
          }
        ]
      },
      selfForm: initSelfForm()
    };
  },
  computed: {
    ...mapState({
      roleList: 'roleList',
      wkbScopeMenu: 'wkbScopeMenu'
    }),
    // 只允许企业管理员操作
    allowOperate() {
      const editButton = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.wkbWxSettingMenu.wxPayButton.wx_pay_edit
      );

      if (editButton.isHasPermission) {
        return true;
      } else {
        return false;
      }
    },
    formLabel() {
      return this.payConfigType === payEnum.PAY_CONFIG.WX_MA.value ? '小程序' : '公众号';
    }
  },

  watch: {
    payConfigType: {
      immediate: true,
      handler(newVal, oldVal) {
        this.setPayForm();
      }
    }
  },
  mounted() {
    this.getPaySettings();
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
          this.loading = false;
        });
    },
    setPayForm() {
      const payRules = this.payRules;
      if (payRules && payRules.length) {
        /*当前支付配置信息，是小程序还是公众号*/
        let payRule = payRules.find(item => {
          return (
            item.type === this.payConfigType ||
            (item.type === null && this.payConfigType !== payEnum.PAY_CONFIG.WX_MP.value)
          ); // item.type === null，为了兼容以前的type为null的情况
        });
        if (payRule) {
          this.payType = payRule.payType === 2 ? '2' : payRule.payType === 1 ? '1' : '2';
          if (payRule.payType === 2) {
            for (let key in this.proxyForm) {
              this.proxyForm[key] = payRule[key] || '';
            }
          } else if (payRule.payType === 1) {
            for (let key in this.selfForm) {
              this.selfForm[key] = payRule[key] || '';
            }
          }
        } else {
          this.selfForm = initSelfForm();
          this.proxyForm = initProxyForm();
        }

        this.$nextTick(() => {
          // 切换表单类型之后，重新进行表单验证，目的是为了去除上一类型中的表单验证
          this.$refs[this.payType === '1' ? 'selfForm' : 'proxyForm'].validate(valid => {});
        });
      }
    },
    clickSave() {
      if (this.allowOperate) {
        this.submitting = true;
        this.$refs[this.payType === '1' ? 'selfForm' : 'proxyForm'].validate(valid => {
          if (valid) {
            let form = this.payType === '1' ? this.selfForm : this.proxyForm;
            settingsApi
              .updateWxPaySetting({ type: this.payConfigType, payType: this.payType - 0, ...form })
              .then(() => {
                this.$message({ message: '保存成功', type: 'success' });
                this.getPaySettings();
              })
              .always(() => {
                this.submitting = false;
              });
          } else {
            return false;
          }
        });
      }
    },

    handleSuccess(opt) {
      if (!opt.success) {
        this.$message({
          type: 'error',
          message: `上传失败：${opt.errorMessage}`
        });
      } else {
        //自助申请模式
        if (this.payType === '1') this.selfForm.certPath = opt.data;
        //普通模式
        else this.proxyForm.subCertPath = opt.data;
      }
    },

    handleError(opt) {
      this.$message({
        type: 'error',
        message: `上传失败：${opt && opt.errorMessage ? opt.errorMessage : ''}`
      });
    },
    beforeUpload(file) {
      const type = file.type;
      const passed = !!type && type in { 'application/x-pkcs12': 1, p12: 1 };
      //console.log('type',type,type == 'p12')
      if (!passed) {
        this.$message({
          type: 'warn',
          message: '文件类型不正确'
        });
        return false;
      }
      return true;
    },
    handleToSort() {
      window.location.href = '/system-setting.html#/sorting';
    }
  }
};
</script>
