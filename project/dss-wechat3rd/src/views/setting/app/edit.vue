<template>
  <div class="edit-app">
    <el-form ref="form"
             :model="form"
             size="mini"
             :rules="rules"
             label-width="95px"
             v-loading="loading"
             element-loading-spinner="el-icon-loading">

      <div class="logo-editor">
        <img v-if="form.logo"
             class="icon"
             :src="form.logo" />
        <img v-else
             class="icon"
             src="/resources/dss-web-portal/img/beautiful.png?t=2df8512" />
        <add-image @success="onLogoUploadSuccess">
          <a href="javascript:;"
             class="dss-upload-title">修改品牌logo</a>
        </add-image>
      </div>

      <el-form-item label="品牌名称"
                    prop="name">
        <el-input type="input"
                  v-model="form.name"
                  placeholder="请输入品牌名称"></el-input>
      </el-form-item>

      <el-form-item label="客服电话"
                    prop="servicePhone">
        <el-input type="input"
                  v-model="form.servicePhone"
                  placeholder="请输入客服电话"></el-input>
      </el-form-item>

      <el-form-item label="联系人姓名"
                    prop="contactsName">
        <el-input type="input"
                  v-model="form.contactsName"
                  placeholder="请输入联系人姓名"></el-input>
      </el-form-item>

      <el-form-item label="联系人电话"
                    prop="contactsPhone">
        <el-input type="input"
                  v-model="form.contactsPhone"
                  placeholder="请输入联系人电话"></el-input>
      </el-form-item>

      <el-form-item label="发货方式"
                    prop="expressType">
        <el-radio-group v-model="form.expressType">
          <el-radio :label="1">仅快递</el-radio>
          <el-radio :label="0">仅自提</el-radio>
          <el-radio :label="2">快递或自提</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>

    <el-button type="primary"
               size="mini"
               class="btn"
               @click="clickSave">保存</el-button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/business-common/store.js';
import AddImage from '@/dss-wechat3rd/src/components/materials/addImage.vue';
import api from '@/dss-wechat3rd/src/api';
import './index.less';

export default {
  components: { AddImage },
  computed: {
    ...mapState({
      curApp: 'curApp'
    })
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        id: '',
        industryId: '',
        industryName: '',
        servicePhone: '',
        contactsName: '',
        contactsPhone: '',
        expressType: 1,
        logo: ''
      },
      rules: {}
    };
  },
  mounted() {
    //赋值
    for (let key in this.form) {
      if (this.curApp.hasOwnProperty(key)) {
        this.form[key] = this.curApp[key];
      }
    }
  },
  methods: {
    clickSave() {
      const params = {
        name: this.form.name,
        id: this.form.id,
        servicePhone: this.form.servicePhone,
        contactsName: this.form.contactsName,
        contactsPhone: this.form.contactsPhone,
        expressType: this.form.expressType,
        logo: this.form.logo
      };
      this.loading = true;
      api
        .updateApp(params)
        .then(res => {
          store.commit('update_curApi', params);
          this.$emit('saved');
        })
        .always(() => {
          this.loading = false;
        });
    },
    onLogoUploadSuccess(url) {
      this.form.logo = url;
    }
  }
};
</script>
