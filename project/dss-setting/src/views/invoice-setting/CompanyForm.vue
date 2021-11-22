<template>
  <div class="edit-container">
    <div class="header-title">
      <span class="msg-text">企业信息 {{ count + 1 }}</span>
      <el-button v-if="isDelete || !companyData.id && len > 1"
                 type="danger"
                 icon="el-icon-delete"
                 class="msg-icon"
                 @click="handleDelete"
                 circle></el-button>
    </div>
    <el-form ref="companyForm"
             class="invoice-edit-form"
             :model="form"
             :rules="rules"
             label-width="180px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item prop="nsrsbh"
                        required
                        class="invoice-edit-item"
                        label="纳税人识别号">
            <el-input v-model="form.nsrsbh" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="nsrmc"
                        required
                        class="invoice-edit-item"
                        label="纳税人名称">
            <el-input v-model="form.nsrmc" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="xsdzdh"
                        required
                        class="invoice-edit-item"
                        label="销售方地址和电话">
            <el-input v-model="form.xsdzdh" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="xskhhYhzh"
                        class="invoice-edit-item"
                        label="销售方开户行和银行账号">
            <el-input v-model="form.xskhhYhzh" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="provider"
                        label="服务商"
                        class="invoice-edit-item"
                        :inline="true">
            <el-select v-model="provider"
                       style="width:100%;">
              <el-option label="百望电子发票"
                         selected
                         value="bw" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="providerAppId"
                        required
                        class="invoice-edit-item"
                        label="APPID">
            <el-input v-model="form.providerAppId" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="providerContentKey"
                        required
                        class="invoice-edit-item"
                        label="contentkey">
            <el-input v-model="form.providerContentKey" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="providerKeyId"
                        required
                        class="invoice-edit-item"
                        label="KeyId">
            <el-input v-model="form.providerKeyId" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="providerSecret"
                        required
                        class="invoice-edit-item"
                        label="密钥">
            <el-input v-model="form.providerSecret" />
          </el-form-item>
        </el-col>
        <el-col :span="8"
                style="margin-bottom: 15px;">
          <el-form-item prop="khdzs"
                        required
                        class="invoice-edit-item"
                        label="客户端验证证书">
            <cert-upload @clearUploadValidate="fileUrl => clearUploadValidate(fileUrl,'khdzs')"
                         @uploadValidate="uploadValidate('khdzs')" />
            <a v-if="form.khdzs"
               :href="form.khdzs"
               target="_blank"
               class="link">查看客户端证书</a>
          </el-form-item>
        </el-col>
        <el-col :span="8"
                style="margin-bottom: 15px;">
          <el-form-item prop="fwdzs"
                        class="invoice-edit-item"
                        label="服务端验证证书">
            <cert-upload @clearUploadValidate="fileUrl => clearUploadValidate(fileUrl,'fwdzs')"
                         @uploadValidate="uploadValidate('fwdzs')" />
            <a v-if="form.fwdzs"
               :href="form.fwdzs"
               target="_blank"
               class="link">查看服务端证书</a>
          </el-form-item>
        </el-col>
        <el-col :span="8"
                style="margin-bottom: 15px;">
          <el-form-item prop="signCer"
                        required
                        class="invoice-edit-item"
                        label="签名验证证书">
            <cert-upload @clearUploadValidate="fileUrl => clearUploadValidate(fileUrl,'signCer')"
                         @uploadValidate="uploadValidate('signCer')" />
            <a v-if="form.signCer"
               :href="form.signCer"
               target="_blank"
               class="link">查看签名证书</a>
          </el-form-item>
        </el-col>
        <el-col :span="8"
                style="height: 112px;">
          <el-form-item prop="khdzsDetail"
                        class="invoice-edit-item"
                        label="客户端验证证书内容">
            <el-input type="textarea"
                      :rows="4"
                      v-model="form.khdzsDetail" />
          </el-form-item>
        </el-col>
        <el-col :span="8"
                style="height: 112px;">
          <el-form-item prop="fwdzsDetail"
                        class="invoice-edit-item"
                        label="服务端验证证书内容">
            <el-input type="textarea"
                      :rows="4"
                      v-model="form.fwdzsDetail" />
          </el-form-item>
        </el-col>
        <el-col :span="8"
                style="height: 112px;">
          <el-form-item prop="signCerDetail"
                        class="invoice-edit-item"
                        label="签名验证证书内容">
            <el-input type="textarea"
                      :rows="4"
                      v-model="form.signCerDetail" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="khdzsmm"
                        required
                        class="invoice-edit-item"
                        label="客户端验证证书密钥">
            <el-input v-model="form.khdzsmm" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="fwdzsmm"
                        class="invoice-edit-item"
                        label="服务端验证证书密钥">
            <el-input v-model="form.fwdzsmm" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button size="mini"
                   type="primary"
                   @click="onSave">保存</el-button>
        <el-button size="mini"
                   @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CertUpload from './certUpload';
import wxInvoiceTplApi from '@/dss-setting/src/api/wx-invoice-tpl-api';
import regex from '@/dss-common/utils/regexps';
export default {
  components: {
    CertUpload
  },
  props: {
    count: {
      type: Number,
      default: 0
    },
    isDelete: {
      type: Boolean,
      default: true
    },
    companyData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    len: {
      type: Number,
      default: 0
    }
  },
  data() {
    const validate = (rule, value, callback) => {
      if (value.trim() == '' || !regex.charAndNum.reg.test(value)) {
        callback(new Error('请输入字母或者数字'));
      } else {
        callback();
      }
    };
    const spacevalidate = (rule, value, callback) => {
      if (value.trim() == '') {
        callback(new Error('请输入销售方地址和电话'));
      } else {
        callback();
      }
    };
    return {
      id: null,
      provider: 'bw',
      form: {
        id: 0,
        nsrsbh: '',
        nsrmc: '',
        providerAppId: '',
        providerContentKey: '',
        providerKeyId: '',
        providerSecret: '',
        xsdzdh: '',
        xskhhYhzh: '',
        khdzs: '',
        fwdzs: '',
        signCer: '',
        khdzsmm: '',
        fwdzsmm: ''
      },
      rules: {
        providerAppId: [
          {
            required: true,
            message: '请输入APPID'
          },
          {
            max: 80,
            message: '最大长度80个字符'
          },
          { validator: validate }
        ],
        providerContentKey: [
          {
            required: true,
            message: '请输入contentkey'
          },
          {
            max: 80,
            message: '最大长度80个字符'
          },
          { validator: validate }
        ],
        nsrsbh: [
          {
            required: true,
            message: '请输入纳说人识别号'
          },
          {
            max: 20,
            message: '最大长度20个字符'
          },
          { validator: validate }
        ],
        nsrmc: [
          {
            required: true,
            message: '请输入纳税人名称'
          },
          {
            max: 32,
            message: '最大长度32个字符'
          },
          {
            pattern: regex.name.reg,
            message: regex.name.msg
          }
        ],
        providerKeyId: [
          {
            required: true,
            message: '请输入KeyId'
          },
          {
            max: 30,
            message: '最大长度30个字符'
          },
          { validator: validate }
        ],
        providerSecret: [
          {
            required: true,
            message: '请输入密钥'
          },
          {
            max: 30,
            message: '最大长度30个字符'
          },
          { validator: validate }
        ],
        xsdzdh: [
          {
            required: true,
            message: '请输入销售方地址和电话'
          },
          {
            max: 100,
            message: '最大长度100个字符'
          },
          { validator: spacevalidate }
        ],
        xskhhYhzh: [
          {
            max: 100,
            message: '最大长度100个字符'
          }
        ],
        khdzs: {
          required: true,
          message: '请上传客户端验证证书'
        },
        signCer: {
          required: true,
          message: '请上传签名验证证书'
        },
        khdzsmm: [
          {
            required: true,
            message: '请输入客户端验证证书密钥'
          },
          {
            max: 30,
            message: '最大长度30个字符'
          },
          { validator: validate }
        ],
        fwdzsmm: [
          {
            max: 30,
            message: '最大长度30个字符'
          }
        ]
      }
    };
  },
  watch: {
    companyData: {
      deep: true,
      handler(newVal, oldVal) {
        if (oldVal != null) {
          this.setFormData(this.companyData || {});
        }
      }
    }
  },
  mounted() {
    this.setFormData(this.companyData || {});
  },
  methods: {
    uploadValidate(props) {
      this.form[props] = '';
      this.$refs.companyForm.validateField(props);
    },
    clearUploadValidate(fileUrl, props) {
      this.form[props] = fileUrl;
      this.$refs.companyForm.validateField(props);
    },
    /**
     * 填充表单数据
     */
    setFormData(data) {
      for (const key in this.form) {
        if (data.id) {
          this.form[key] = data[key];
        } else {
          this.form[key] = '';
          // 重置表单校验
          this.$refs.companyForm.resetFields();
        }
      }
    },
    onSave() {
      this.$refs.companyForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.sumbit();
      });
    },
    sumbit() {
      const params = { ...this.form };

      wxInvoiceTplApi
        .saveEntInfo(params, this.form.nsrsbh)
        .then(res => {
          this.$message.success('保存成功');
          this.$router.push('/invoice-setting');
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    // 取消
    onCancel() {
      this.$router.push('/invoice-setting');
    },
    handleDelete() {
      this.$confirm('是否删除该企业信息？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.$emit('handleDelete', this.form.nsrsbh, this.count);
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    }
  }
};
</script>

<style lang="less" scoped>
.invoice-edit-form {
  padding: 20px;
  .link {
    display: block;
    cursor: pointer;
    margin-top: 6px;
  }
}

.edit-container {
  .header-title {
    padding: 20px 20px 0;

    .msg-text {
      font-size: 14px;
      vertical-align: middle;
    }

    .msg-icon {
      margin-left: 4px;
      vertical-align: middle;
    }
  }

  .el-col {
    height: 60px;
  }
}
</style>


