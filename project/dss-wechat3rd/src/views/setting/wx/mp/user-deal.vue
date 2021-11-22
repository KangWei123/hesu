<template>
  <div>
    <div class="user-appointment-deal" v-loading="loading">
      <div style="margin-bottom: 20px">
        <el-select v-model="agreementType"
                   @change="handleChangeDeal"
                   placeholder="请选择">
          <el-option
            v-for="item in agreementTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="handleUseDefault">使用默认协议</el-button>
      </div>
      <div class="edit-box">
        <div class="user-appointment-deal-content" v-if="deal.describe">
          <w-editor class="editor"
                    :dataSource="deal"
                    :image="false"
                    ref="editor"
                    :pasteHandle="true" width="480px" height="669px" :key="id"></w-editor>
          <div class="user-appointment-deal-options">
            <el-button class="wkt-primary-btn" type="primary" @click="saveDeal">保存</el-button>
          </div>
        </div>
      </div>
      <div class="preview-box" v-if="deal.describe">
        <div class="phone-nav">
          <span>{{dealTitle}}（预览）</span>
        </div>
        <div class="preview-content-wrapper">
          <div class="preview-content" v-html="deal.describe"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import settingsApi from '@/dss-wechat3rd/src/api/settings';
  import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';
  import PayProtocol from '@/dss-wechat3rd/src/bz_components/agreement/pay-protocol.vue';

  const DEAL_TYPE = {
    user: 1,
    privacy: 0
  };
  export default {
    name: 'UserDeal',
    components: {
      WEditor,
      PayProtocol
    },
    data() {
      return {
        loading: false,
        userDeal: {
          describe: null
        },
        privacyDeal: {
          describe: null
        },
        id: 0,
        //查询协议请求是否成功
        query: false,
        dialogShow: false,
        agreementType: 1,
        agreementTypeOptions: [
          {
            value: 1,
            label: '用户协议'
          },
          {
            value: 0,
            label: '隐私协议'
          }
        ]
      };
    },
    computed: {
      deal() {
        if (this.agreementType === DEAL_TYPE.privacy) {
          return this.privacyDeal;
        } else {
          return this.userDeal;
        }
      },
      dealTitle() {
        if (this.agreementType === DEAL_TYPE.privacy) {
          return '隐私协议';
        } else {
          return '用户协议';
        }
      }
    },
    mounted() {
      this.getDeal();
    },
    methods: {
      getDealType() {
        if (this.agreementType === DEAL_TYPE.privacy) {
          return this.privacyDeal;
        } else {
          return this.userDeal;
        }
      },
      handleChangeDeal() {
        this.getDeal();
      },
      handleUseDefault() {
        this.$confirm('使用默认协议将会替代当前协议内容，确认使用默认协议?', '默认协议', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning',
          customClass: 'wkt-warning'
        })
          .then(() => {
            const deal = this.getDealType();
            deal.describe = deal.defaultContent;
            const editor = this.$refs.editor;
            if (editor) {
              editor.insertHtml();
            }
          })
          .catch(() => {});
      },
      saveDeal() {
        const deal = this.getDealType();
        if (!deal.describe) {
          this.showMessage('协议内容不能为空', 'warning');
          return;
        }
        this.loading = true;
        settingsApi
          .updateUserDealContent({
            content: deal.describe,
            agreementType: this.agreementType
          })
          .then(res => {
            this.showMessage('保存成功');
          })
          .always(() => {
            this.loading = false;
          });
      },
      getDeal() {
        const deal = this.getDealType();
        if (deal.originDescribe) {
          this.$nextTick(() => {
            deal.describe = deal.originDescribe;
            const editor = this.$refs.editor;
            if (editor) {
              editor.insertHtml();
            }
          });
          return;
        }
        this.loading = true;
        settingsApi
          .getUserDealInfo({
            agreementType: this.agreementType
          })
          .done(res => {
            if (!!res.data) {
              deal.originDescribe = res.data.content || res.data.defaultContent || '默认协议';
              deal.describe = res.data.content || res.data.defaultContent || '默认协议';
              deal.defaultContent = res.data.defaultContent;
            }
          })
          .always(() => {
            this.loading = false;
          });
      },
      showMessage(text, type) {
        this.$message({
          message: text,
          type: type
        });
      }
    }
  };
</script>

<style lang="less">
  .user-appointment-deal {
    padding: 20px 0 20px 20px;
    min-width: 925px;
    box-sizing: border-box;

    .edit-box {
      display: inline-block;
      vertical-align: top;
    }

    .preview-box {
      display: inline-block;
      height: 669px;
      border: 1px solid @border-color;
      overflow: auto;
      box-sizing: border-box;
      margin-left: 20px;

      .phone-nav {
        width: 375px;
        height: 66px;
        line-height: 86px;
        text-align: center;
        color: @black-color;
        top: 0;
        left: 0;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url('../../../../images/decoration/nav/status_black.png');
      }

      .preview-content-wrapper {
        overflow: auto;
        height: 600px;
      }

      .preview-content {
        height: 600px;
        padding: 20px;
        width: 375px;
        box-sizing: border-box;
      }
    }

    .user-appointment-deal-preview {
      margin-bottom: 10px;

      .table-href {
        font-size: @standard-font;
      }
    }

    .user-appointment-deal-switch {
      .deal-tips {
        color: @black-color;
        font-size: @standard-font;
        margin-bottom: 10px;
      }
    }

    .user-appointment-deal-content {
      .editor {
        .w-e-text-container {
          height: 635px !important;
        }
      }

      .user-appointment-deal-options {
        margin-top: 20px;
      }
    }

    .deal-error {
      text-align: center;
    }
  }
</style>
