<template>
  <form-page-layout
    :rules="formRules"
    :submit-handler="submit"
    label-width="126px"
    :title-visible="false"
    :model="invoiceForm"
    submit-sucess-text=""
  >
    <form-group>
      <template #title>基础设置</template>
      <el-form-item prop="businessType" label="开票业务">
        <el-select :disabled="businessIsDisabled" v-model="invoiceForm.businessType" placeholder="请选择开票业务">
          <el-option label="停车场" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="invoicePlatform" label="开票平台">
        <el-select v-model="invoiceForm.invoicePlatform" placeholder="请选择开票平台">
          <el-option label="中税" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </form-group>
    <form-group>
      <template #title>开票注册/验证</template>
      <el-form-item :error="verifyErr.accountErr" required label="账号">
        <el-input type="text" class="w250" placeholder="请输入开票账号" v-model.trim="invoiceForm.appId"></el-input>
      </el-form-item>
      <el-form-item :error="verifyErr.pwdErr" required label="密码">
        <el-input
          id="invoice_pass"
          class="w250"
          type="text"
          placeholder="请输入开票密码"
          v-model.trim="invoiceForm.appSecret"
        ></el-input>
        <el-button class="check-account" type="primary" @click="checkInvoicePlatform">验证账号</el-button>
      </el-form-item>
    </form-group>
    <form-group>
      <template #title>开票信息配置</template>
      <el-form-item required label-width="186px" label="企业名称">
        <div v-text="invoiceForm.taxCompany"></div>
      </el-form-item>
      <el-form-item required label-width="186px" label="纳税人识别号">
        <div v-text="invoiceForm.taxNo"></div>
      </el-form-item>
      <el-form-item label-width="186px" label="企业地址" prop="enterpriseAddress">
        <el-input class="w250" placeholder="请输入企业地址" v-model.trim="invoiceForm.enterpriseAddress"></el-input>
      </el-form-item>
      <el-form-item label-width="186px" label="联系电话" prop="tel">
        <el-input class="w250" placeholder="请输入联系电话" v-model.trim="invoiceForm.tel"></el-input>
      </el-form-item>
      <el-form-item label-width="186px" prop="maxAmountPerInvoice" label="限制单笔开票金额上限">
        <el-input
          class="w250"
          placeholder="请输入限制单笔开票金额上限"
          v-model.trim="invoiceForm.maxAmountPerInvoice"
        ></el-input>
      </el-form-item>
    </form-group>
    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>

<script>
  import parkApi from '@/dss-wechat3rd/src/api/park';
  import { mapState } from 'vuex';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import regexps from '@/dss-common/utils/regexps';

  export default {
    name: 'AddInvoice',
    components: {
      FormPageLayout,
      FormGroup,
      FormButton,
    },
    data() {
      return {
        invoiceId: null,
        invoiceForm: {
          businessType: null,
          invoicePlatform: null,
          taxCompany: null,
          appId: '', // 0d0c67b8295a11e7b7434cd30abca22q
          appSecret: '', // 57111-78743-49030
          taxNo: null,
          enterpriseAddress: '',
          taxCompanyAbbr: '',
          tel: '',
          maxAmountPerInvoice: null,
        },
        formRules: {
          businessType: [{ required: true, message: '请选择开票业务', trigger: 'change' }],
          invoicePlatform: [{ required: true, message: '请选择开票平台', trigger: 'change' }],
          enterpriseAddress: [
            {
              max: 80,
              message: '最多输入80个字符',
              trigger: 'blur',
            },
          ],
          tel: [
            {
              max: 15,
              message: '最多输入15个字符',
              trigger: 'blur',
            },
          ],
          maxAmountPerInvoice: [
            { required: true, message: '请输入限制单笔开票金额上限', trigger: 'change' },
            {
              pattern: regexps.littleeIntZeroNum.reg,
              message: regexps.littleeIntZeroNum.msg,
              trigger: 'blur',
            },
          ],
        },
        verifyErr: {
          accountErr: '',
          pwdErr: '',
        },
        businessIsDisabled: false,
      };
    },
    created() {
      if (this.$route.query.id) {
        this.businessIsDisabled = true;
        this.initData();
      }
    },
    watch: {
      'invoiceForm.appId'() {
        if (this.verifyErr.accountErr) {
          this.verifyErr.accountErr = '';
        }
      },
      'invoiceForm.appSecret'() {
        if (this.verifyErr.pwdErr) {
          this.verifyErr.pwdErr = '';
        }
      },
    },
    computed: {
      ...mapState({
        globalInfo: 'global_info',
      }),
    },
    methods: {
      initData() {
        const { id } = this.$route.query;
        parkApi
          .findInvoiceById({ id })
          .then(res => {
            this.invoiceForm = res.data;
            const extConfig = JSON.parse(res.data.extConfig);
            this.$set(this.invoiceForm, 'appId', extConfig.appId);
            this.$set(this.invoiceForm, 'appSecret', extConfig.appSecret);
          })
          .catch(err => {
            console.log(err);
          });
      },
      checkInvoicePlatform() {
        if (!this.invoiceForm.appId || !this.invoiceForm.appSecret) {
          if (!this.invoiceForm.appId) {
            this.verifyErr.accountErr = '请输入账号';
          }
          if (!this.invoiceForm.appSecret) {
            this.verifyErr.pwdErr = '请输入密码';
          }
          return;
        }
        const params = {
          invoicePlatform: this.invoiceForm.invoicePlatform,
          extConfig: this.handleExtConfig(),
        };
        parkApi.platformAuth(params).then(res => {
          if (res.success) {
            if (res.data) {
              this.$set(this.invoiceForm, 'taxCompany', res.data.taxCompany);
              this.$set(this.invoiceForm, 'taxNo', res.data.taxNo);
              this.$message({
                showClose: true,
                type: 'success',
                duration: 3000,
                message: '验证账号成功',
              });
            }
          }
        });
      },
      handleExtConfig() {
        return JSON.stringify({
          appId: this.invoiceForm.appId,
          appSecret: this.invoiceForm.appSecret,
        });
      },
      async submit() {
        const params = {
          ...this.invoiceForm,
          extConfig: this.handleExtConfig(),
        };
        params.taxCompanyAbbr = params.taxCompany || '';
        delete params.appId;
        delete params.appSecret;
        if (this.$route.query.id) {
          const res = await parkApi.updateInvoiceSetting(params);
          if (res.success) {
            this.$message({
              showClose: true,
              type: 'success',
              duration: 3000,
              message: '更新开票配置成功',
            });
          }
        } else {
          params.status = 1;
          params.operator = this.globalInfo.userName;
          params.operatorPhone = this.globalInfo.userPhone;
          const res = await parkApi.addInvoice(params);
          if (res.success) {
            this.$message({
              showClose: true,
              type: 'success',
              duration: 3000,
              message: '新增开票配置成功',
            });
          }
        }
      },
    },
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @font-face {
    font-family: 'password';
    src: url('../../../font/password.ttf');
  }

  /deep/ #invoice_pass {
    font-family: 'password';
  }

  .check-account {
    position: relative;
    left: 45px;
    top: -26px;
  }
</style>
