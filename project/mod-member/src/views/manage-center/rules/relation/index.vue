<template>
  <div class="user-relation-data-source-config">
    <el-form label-width="120px" label-suffix="：" label-position="right" v-loading="loading">
      <el-form-item label="客户归属关系">
        <el-radio-group v-model="isConfigActive">
          <el-radio :label="true" :disabled="!isConfigActive">开启</el-radio>
          <el-radio :label="false" :disabled="isConfigActive">关闭</el-radio>
        </el-radio-group>
        <p>
          开启后，客户将依据是否产生归属关系分为线索和客户；企业需在授权企业微信后将企微成员置为导购，指派导购跟进客户。
        </p>
      </el-form-item>
      <template>
        <el-form-item label="客户归属规则" v-if="isConfigActive">
          <div v-if="settings.effectiveScope === 1">
            <div>企业一对一</div>
            <p>企业内只允许一位导购跟进客户</p>
          </div>
          <div v-if="settings.effectiveScope === 2">
            <div>门店一对一</div>
            <p>支持企业内每个门店有一名导购跟进客户</p>
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
  import './index.less';
  import services from '@/dss-common/utils/services';

  export default {
    data() {
      return {
        loading: true,
        isConfigActive: undefined,
        bindWxwork: false, // 是否授权企微
        hasGuide: false, // 是否已有导购
        settings: {
          effectiveScope: undefined,
        },
      };
    },
    methods: {
      // 暂不允许客户界面上切换归属关系
      async confirmRelation() {
        let confirm = null;
        let confirmBtn = null;
        if (!this.isConfigActive) {
          // 关闭
          confirm = [
            '关闭后，将不再区分线索与客户，且不再产生客户归属关系；已经产生归属关系的客户将保留相关归属数据，再次开启后将重新启用。导购相关业务，如雷达反馈等也将被关闭。',
            '关闭客户归属关系',
          ];
          confirmBtn = { confirmButtonText: '关闭' };
        } else if (!this.bindWxwork) {
          // 开启：未授权企微
          confirm = ['您的企业未授权微信，请在授权企业微信后，开启相关成员的导购权限。', '温馨提示'];
          confirmBtn = { confirmButtonText: '去授权' };
        } else if (!this.hasGuide) {
          // 开启：已授权企微，无导购
          confirm = [
            '开启后，客户将依据是否产生归属关系分为线索和客户。您的企业当前暂无导购，请前往企业通讯录开启相关成员的导购权限，并尽快指派导购跟进客户。',
            '开启客户归属关系',
          ];
        } else {
          // 开启：已授权企微，有导购
          confirm = ['开启后，客户将依据是否产生归属关系分为线索和客户，请尽快指派导购跟进客户。', '开启客户归属关系'];
        }
        try {
          const comfirmResult = await this.$confirm(...confirm, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'relation-message-box',
            type: '',
            ...confirmBtn,
          });
          if (this.isConfigActive && !this.bindWxwork) {
            window.location.href = '/wkb.html#/setting/wx/qy';
            return;
          }
          const res = await this.commit();
          if (res && res.data) {
            this.$emit('toggle', !this.isConfigActive);
            this.$store.commit('set_attribution', !this.isConfigActive);
          }
        } catch (err) {
          this.isConfigActive = !this.isConfigActive;
        }
      },
      // 暂不允许客户界面上切换归属规则
      async confirmRule() {
        try {
          const confirmResult = await this.$confirm('确定？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'relation-message-box',
            type: '',
          });
          this.commit();
        } catch (err) {
          this.settings.effectiveScope = +this.settings.effectiveScope === 1 ? 2 : 1;
        }
      },
      async commit() {
        const data = {
          status: +this.isConfigActive,
          effectiveScope: this.settings.effectiveScope,
        };
        this.loading = true;
        const res = await services.post('/wp/client/bind/setting/save', data, {
          action: '企业绑定规则设置',
        });
        this.loading = false;
        return res;
      },
    },
    mounted() {
      this.loading = true;
      services.get('/wp/client/bind/setting/get', { action: '查询企业绑定规则设置' }).then(({ data }) => {
        const { status, effectiveScope, bindWxwork, hasGuide } = data;
        this.isConfigActive = !!status;
        this.bindWxwork = bindWxwork;
        this.hasGuide = hasGuide;
        if (status) {
          this.$emit('toggle');
        }
        this.settings.effectiveScope = effectiveScope;
        this.loading = false;
      });
    },
  };
</script>

<style lang="less">
  .user-relation-data-source-config {
    .el-form-item__content,
    .el-radio__label {
      font-size: 12px;
    }
  }

  .relation-message-box {
    border-radius: 0;
    padding-bottom: 18px;
    .el-message-box__header {
      background: #f4f4f4;
      padding: 15px 20px !important;
    }
    .el-message-box__title {
      color: #333;
      font-size: 14px;
      font-weight: normal;
      text-align: left;
    }
    .el-message-box__content {
      font-size: 12px;
      padding: 32px 83px;
      text-align: center;
    }
    .el-button--small {
      width: 100px !important;
      font-size: 12px !important;
      border-radius: 50px !important;
      color: #256eff !important;
      border: 1px solid #256eff !important;
      background: rgba(56, 121, 251, 0.06);
    }
    .el-button--primary {
      color: #fff !important;
    }
    .el-message-box__btns button:nth-child(2) {
      margin-left: 20px;
    }
  }
</style>
