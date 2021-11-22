<template>
  <div class="edit-app">
    <el-form
      ref="form"
      :model="form"
      size="mini"
      :rules="rules"
      label-width="95px"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
    >
      <div class="logo-editor">
        <img v-if="form.logo" class="icon" :src="form.logo" />
        <img v-else class="icon" :src="require('@/dss-common/img/brand/logo-default.png')" />
        <add-image @success="onLogoUploadSuccess">
          <a href="javascript:;" class="table-href">修改品牌logo</a>
        </add-image>
      </div>

      <el-form-item label="品牌名称" prop="name">
        <el-input type="input" placeholder="请输入品牌名称" v-model.trim="form.name"></el-input>
      </el-form-item>

      <el-form-item label="客服电话" prop="servicePhone">
        <el-input type="input" placeholder="请输入客服电话" v-model.trim="form.servicePhone"></el-input>
      </el-form-item>

      <el-form-item label="联系人姓名" prop="contactsName">
        <el-input type="input" placeholder="请输入联系人姓名" v-model.trim="form.contactsName"></el-input>
      </el-form-item>

      <el-form-item label="联系人电话" prop="contactsPhone">
        <el-input type="input" placeholder="请输入联系人电话" v-model.trim="form.contactsPhone"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSave('form')">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import './index.less';
  import { mapState } from 'vuex';
  import store from '@/business-common/store.js';
  import brandSettingApi from '@/mod-console/src/api/brand-setting/index';
  import regexps from '@/dss-common/utils/regexps';
  import { AddImage } from '@/register/wechat3rd';

  export default {
    components: { AddImage },
    computed: {
      ...mapState({
        curApp: 'curApp',
      }),
    },
    data() {
      return {
        loading: false,
        form: {
          id: '',
          name: '',
          logo: '',
          servicePhone: '',
          contactsName: '',
          contactsPhone: '',
          industryId: '',
          industryName: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { pattern: regexps.simpleName.reg, message: '品牌名称字母、数字或汉字 组成', trigger: 'blur' },
            {
              min: 1,
              max: 30,
              message: '长度在 1 到 30 个字符',
              trigger: 'blur',
            },
          ],
          servicePhone: [{ pattern: regexps.servicePhone.reg, message: regexps.servicePhone.msg, trigger: 'blur' }],
          contactsName: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
            { pattern: regexps.simpleName.reg, message: '请输入正确的联系人姓名', trigger: 'blur' },
            {
              min: 1,
              max: 8,
              message: '长度在 1 到 8 个字符',
              trigger: 'blur',
            },
          ],
          contactsPhone: [
            { required: true, message: '请输入联系人电话', trigger: 'blur' },
            { pattern: regexps.phone.reg, message: '请输入正确的联系人电话', trigger: 'blur' },
          ],
        },
      };
    },
    mounted() {
      // 赋值
      for (const key in this.form) {
        if (!!this.curApp && this.curApp.hasOwnProperty(key)) {
          this.form[key] = this.curApp[key];
        }
      }
    },
    methods: {
      // 保存
      onSave(data) {
        this.$refs[data].validate().then(valid => {
          if (!valid) {
            return;
          }

          const params = {
            id: this.form.id,
            name: this.form.name,
            logo: this.form.logo,
            servicePhone: this.form.servicePhone,
            contactsName: this.form.contactsName,
            contactsPhone: this.form.contactsPhone,
            industryId: this.form.industryId,
          };
          this.loading = true;
          brandSettingApi
            .updateBrand(params)
            .then(res => {
              // 全局更新当前店铺信息
              for (const key in this.curApp) {
                if (!!this.form && this.form.hasOwnProperty(key)) {
                  this.curApp[key] = this.form[key];
                }
              }
              store.commit('update_curApi', this.curApp);
              this.$emit('saved');
            })
            .catch(() => {
              this.$message.error('保存基础失败，请重试');
            })
            .always(() => {
              this.loading = false;
            });
        });
      },
      // 取消
      onCancel() {
        this.$emit('cancel');
      },
      // logo上传成功
      onLogoUploadSuccess(url) {
        this.form.logo = url;
      },
    },
  };
</script>
