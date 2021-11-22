<template>
  <form-page-layout
    class="wx-setting-pay"
    :title-visible="false"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    @submit="clickSave"
  >
    <el-tabs type="card" v-model="payConfigType">
      <el-tab-pane :name="payConfig.WX_MA.value" :label="payConfig.WX_MA.label"> </el-tab-pane>
      <el-tab-pane :name="payConfig.WX_MP.value" :label="payConfig.WX_MP.label"> </el-tab-pane>
      <el-tab-pane :name="payConfig.TT.value" :label="payConfig.TT.label"> </el-tab-pane>
      <el-tab-pane :name="payConfig.H5.value" :label="payConfig.H5.label"> </el-tab-pane>
      <el-tab-pane
        v-if="env.BUSINESS_CENTER"
        :name="payConfig.BUSINESS_AREA.value"
        :label="payConfig.BUSINESS_AREA.label"
      >
      </el-tab-pane>
    </el-tabs>

    <!-- 微信部分 -->
    <div v-if="payConfigType === payConfig.WX_MA.value || payConfigType === payConfig.WX_MP.value">
      <wx-form
        ref="wxForm"
        @load="load"
        @finished="finished"
        :pay-config-type="payConfigType"
        :form-label="formLabel"
      ></wx-form>
    </div>

    <!-- 字节部分 -->
    <div v-if="payConfigType === payConfig.TT.value">
      <tt-form ref="ttForm" @load="load" :pay-config-type="payConfigType" @finished="finished"> </tt-form>
    </div>

    <!-- H5部分 -->
    <div v-if="payConfigType === payConfig.H5.value">
      <h5-form ref="h5Form" @load="load" :pay-config-type="payConfigType" @finished="finished"></h5-form>
    </div>

    <!-- 商圈设置 -->
    <!-- <div v-if="payConfigType === payConfig.BUSINESS_AREA.value">
      <business-area-form ref="businessForm" @load="load" @finished="finished" :pay-config-type="payConfigType" />
    </div> -->

    <template #footer>
      <form-button :title="allowOperate ? '' : '暂无权限操作'">保存</form-button>
    </template>

    <!-- <div class="bottom-button">
      <el-button type="primary" :title="allowOperate ? '' : '暂无权限操作'" @click="clickSave">保存</el-button>
    </div> -->
  </form-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import { FormPageLayout, FormButton } from '@/dss-common/components/form-page';
  import payEnum from '@/mod-console/src/constants/pay';
  import WxForm from './wx.vue';
  import TtForm from './tt.vue';
  import H5Form from './h5.vue';
  import BusinessAreaForm from './business-area.vue';

  export default {
    data() {
      return {
        payConfig: payEnum.PAY_CONFIG,
        loading: true,
        payConfigType: payEnum.PAY_CONFIG.WX_MA.value, // 支付配置，小程序支付或者公众号支付信息配置
      };
    },
    components: {
      FormPageLayout,
      FormButton,
      WxForm,
      TtForm,
      H5Form,
      BusinessAreaForm,
    },
    computed: {
      ...mapState({
        companyScopeMenu: 'companyScopeMenu',
        env: 'env',
      }),
      // 只允许企业管理员操作
      allowOperate() {
        const editButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.companyScopeMenu,
          scopeMenuEnum.dictionary.companyChildMenu.wkbWxSettingMenu.wxPayButton.wx_pay_edit
        );

        if (editButton?.isHasPermission) {
          return true;
        } else {
          return false;
        }
      },
      formLabel() {
        return this.payConfigType === payEnum.PAY_CONFIG.WX_MA.value ? '微信小程序' : '微信公众号';
      },
    },
    watch: {
      payConfigType: {
        immediate: true,
        handler(newVal) {
          if (newVal === this.payConfig.WX_MA.value || newVal === this.payConfig.WX_MP.value) {
            this.$nextTick(() => this.$refs.wxForm.setPayForm());
          }
        },
      },
    },
    methods: {
      clickSave() {
        if (this.allowOperate && !this.loading) {
          if (this.payConfigType === this.payConfig.TT.value) {
            this.$refs.ttForm.clickSave();
          } else if (this.payConfigType === this.payConfig.H5.value) {
            this.$refs.h5Form.clickSave();
          } else if (this.payConfigType === this.payConfig.BUSINESS_AREA.value) {
            this.$refs.businessForm.clickSave();
          } else {
            this.$refs.wxForm.clickSave();
          }
        }
      },
      load() {
        this.loading = true;
      },
      finished() {
        this.loading = false;
      },
    },
  };
</script>

<style lang="less" scoped>
  .wx-setting-pay {
    margin-top: 16px;
    background-color: #fff;
    padding: 20px;
  }

  /deep/ .el-upload {
    width: 100%;
  }

  /deep/ .el-form-item__label {
    color: #717378;
  }
</style>
