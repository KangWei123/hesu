<template>
  <div class="invoice-edit"
       v-loading="loading">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/invoice-setting' }">发票模板</el-breadcrumb-item>
      <el-breadcrumb-item>{{isEdit ? '修改' : '创建'}}发票</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="invoiceForm"
             class="invoice-edit-form"
             :model="form"
             :rules="rules"
             label-width="180px">
      <el-form-item prop="name"
                    class="invoice-edit-item"
                    label="发票模板名称">
        <el-input placeholder="南昌灵感之茶科技有限公司"
                  v-model="form.name" />
      </el-form-item>
      <el-form-item prop="nsrsbh"
                    label="企业信息"
                    class="invoice-edit-item"
                    :inline="true">
        <el-select v-model="form.nsrsbh"
                   style="width:100%;">
          <el-option v-for="item in companyList"
                     :key="item.nsrsbh"
                     :label="item.nsrmc"
                     selected
                     :value="item.nsrsbh" />
        </el-select>
      </el-form-item>
      <el-form-item prop="sl"
                    class="invoice-edit-item"
                    label="税率%">
        <el-input v-model.number="form.sl"
                  maxlength="4" />
      </el-form-item>
      <el-form-item prop="spbm"
                    class="invoice-edit-item"
                    label="开票项编码">
        <el-input v-model="form.spbm" />
      </el-form-item>
      <el-form-item prop="spmc"
                    class="invoice-edit-item"
                    label="开票项名称">
        <el-input v-model="form.spmc" />
      </el-form-item>
      <el-form-item prop="kpr"
                    class="invoice-edit-item"
                    label="开票人">
        <el-input v-model="form.kpr" />
      </el-form-item>
      <el-form-item prop="skr"
                    class="invoice-edit-item"
                    label="收款人">
        <el-input v-model="form.skr" />
      </el-form-item>
      <el-form-item prop="fhr"
                    class="invoice-edit-item"
                    label="复核人">
        <el-input v-model="form.fhr" />
      </el-form-item>
      <el-form-item>
        <el-checkbox label="设为默认模板（除商品指定发票模板外，使用默认模板）"
                     v-model="form.defaultFlag"
                     :true-label="selected"
                     :false-label="unSelected"></el-checkbox>
      </el-form-item>
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
import './index.less';
import wxInvoiceTplApi from '@/dss-setting/src/api/wx-invoice-tpl-api';
import regexps from '@/dss-common/utils/regexps.js';

export default {
  computed: {
    isEdit() {
      return !!this.id;
    }
  },
  data() {
    const { name } = regexps;
    const validateSlLimit = (rule, value, callback) => {
      if (value > 100 || value < 0) {
        callback(new Error('税率只能填写0~100之间的数字'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      invoiceStatus: 1,
      id: null,
      form: {
        name: '',
        sl: '',
        spbm: '',
        spmc: '',
        kpr: '',
        skr: '',
        fhr: '',
        nsrsbh: '',
        defaultFlag: 0
      },
      companyList: [],
      selected: 1,
      unSelected: 0,
      rules: {
        name: [
          {
            required: true,
            message: '请输入发票模板名称'
          },
          {
            max: 22,
            message: '最大长度22个字符'
          },
          {
            pattern: name.reg,
            message: name.msg
          }
        ],
        nsrsbh: [{ required: true, message: '请选择企业信息', trigger: 'change' }],
        sl: [
          {
            required: true,
            message: '请输入税率%'
          },
          { type: 'number', message: '税率必须为数字值' },
          { validator: validateSlLimit }
        ],
        spmc: [
          {
            required: true,
            message: '请输入开票项名称'
          },
          {
            max: 32,
            message: '最大长度32个字符'
          },
          {
            pattern: name.reg,
            message: name.msg
          }
        ],
        spbm: [
          { pattern: /^[0-9]*$/, message: '编码必须为数字值' },
          {
            max: 19,
            message: '最大长度19个字符'
          }
        ],
        kpr: [
          {
            required: true,
            message: '请输入开票人'
          },
          {
            max: 16,
            message: '最大长度16个字符'
          },
          {
            pattern: name.reg,
            message: name.msg
          }
        ],
        skr: [
          {
            required: true,
            message: '请输入收款人'
          },
          {
            max: 16,
            message: '最大长度16个字符'
          },
          {
            pattern: name.reg,
            message: name.msg
          }
        ],
        fhr: [
          {
            required: true,
            message: '请输入复核人'
          },
          {
            max: 16,
            message: '最大长度16个字符'
          },
          {
            pattern: name.reg,
            message: name.msg
          }
        ]
      }
    };
  },
  mounted() {
    const id = this.$route.query.id;
    if (!!id) {
      this.id = id;
      wxInvoiceTplApi.invoiceDetail(id).then(
        res => {
          if (!res.data) {
            // 请求后端成功，但返回data为空（data为空，id有可能是乱填的），把id置为null
            this.id = null;
            this.$router.push('/invoice-setting/edit');
            return;
          }
          this.setFormData(res.data || {});
        },
        () => {
          // 异常，路径去掉id进入新建态
          this.id = null;
          this.$router.push('/invoice-setting/edit');
        }
      );
    }
    this.getEntInfo();
  },

  methods: {
    /**
     * 填充表单数据
     */
    setFormData(data) {
      for (const key in this.form) {
        this.form[key] = data[key];
      }
    },

    async getEntInfo() {
      this.companyList = await wxInvoiceTplApi.getEntInfo();
    },

    onSave() {
      this.$refs.invoiceForm.validate(valid => {
        if (!valid) {
          return;
        }
        this.save();
      });
    },
    save() {
      const params = { ...this.form };

      let methodProp = 'addInvoice';
      if (this.isEdit) {
        params.id = this.id;
        methodProp = 'updateInvoice';
      }

      wxInvoiceTplApi[methodProp](params)
        .then(res => {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.$router.push('/invoice-setting');
        })
        .catch(() => {
          this.$message.error('保存失败，请重试');
        });
    },
    // 取消
    onCancel() {
      this.$router.push('/invoice-setting');
    }
  }
};
</script>

<style lang="less" scoped>
.invoice-edit {
  padding-bottom: 20px;

  .invoice-edit-item {
    width: 500px;
  }

  .invoice-edit-form {
    padding: 20px;
  }

  .el-checkbox {
    margin-right: 5px;
  }
}
</style>

