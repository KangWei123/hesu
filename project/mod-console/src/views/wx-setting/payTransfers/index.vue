<template>
  <div class="wx-setting-pay" v-loading="loading" element-loading-spinner="el-icon-loading">
    <el-tabs type="card" v-model="payConfigType">
      <el-tab-pane :name="payConfig.WX.value" :label="payConfig.WX.label"> </el-tab-pane>
    </el-tabs>
    <!-- 微信部分 -->
    <div v-if="payConfigType === payConfig.WX.value || payConfigType === payConfig.WX.value">
      <WXForm ref="wxForm" @finished="finished" :pay-config-type="payConfigType"></WXForm>
    </div>

    <div class="bottom-button">
      <el-button type="primary" :disabled="!allowOperate" @click="clickSave">{{
        allowOperate ? '保存' : '暂无权限操作'
      }}</el-button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import payEnum from '@/mod-console/src/constants/pay';
  import WXForm from './wx.vue';

  export default {
    data() {
      return {
        payConfig: payEnum.PAY_TRANSFERS_CONFIG,
        payConfigType: payEnum.PAY_TRANSFERS_CONFIG.WX.value, // 付款到零钱配置
        loading: true,
      };
    },
    components: {
      WXForm,
    },
    computed: {
      ...mapState({
        roleList: 'roleList',
        companyScopeMenu: 'companyScopeMenu',
      }),
      // 只允许企业管理员操作
      allowOperate() {
        const editButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.companyScopeMenu,
          scopeMenuEnum.dictionary.companyChildMenu.wkbWxSettingMenu.wxPayTransfersButton.wx_pay_transfers_edit
        );
        if (editButton?.isHasPermission) {
          return true;
        } else {
          return false;
        }
      },
    },
    watch: {
      payConfigType: {
        immediate: true,
        handler(newVal) {
          if (newVal === this.payConfig.WX.value || newVal === this.payConfig.WX.value) {
            this.$nextTick(() => this.$refs.wxForm.setPayForm());
          }
        },
      },
    },
    methods: {
      clickSave() {
        if (this.allowOperate) {
          this.$refs.wxForm.clickSave();
        }
      },
      finished() {
        this.loading = false;
      },
    },
  };
</script>

<style scoped>
  .wx-setting-pay {
    margin-top: 16px;
    background-color: #fff;
    padding: 20px;
  }
</style>
