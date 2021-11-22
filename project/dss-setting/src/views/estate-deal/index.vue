<template>
  <div>
    <div class="estate-deal" v-loading="loading">
      <div>上传电子公章：</div>
      <choose-images
        v-model="deal.seal"
        :height="100"
        :width="100"
        style="margin-right: 10px;"
        @delete="onDeleteImg()"
      />
      <div style="color: #858c99; font-size: 12px; font-weight: 400; line-height: 15px; margin-bottom: 20px">
        建议尺寸100*100px，建议图片小于2M
      </div>
      <div class="edit-box">
        <div class="estate-deal-content">
          <w-editor
            class="editor"
            :dataSource="deal"
            :image="false"
            :pasteHandle="true"
            width="480px"
            height="669px"
            :key="id"
          ></w-editor>
          <div class="estate-deal-options">
            <el-button class="wkt-primary-btn" type="primary" @click="saveDeal">保存</el-button>
          </div>
        </div>
      </div>
      <div class="preview-box">
        <div class="phone-nav">
          <span>{{ deal.title }}(预览)</span>
        </div>
        <div class="preview-content-wrapper">
          <div class="preview-content" v-html="deal.describe"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import settingsApi from '@/dss-setting/src/api/index.js';
import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';

export default {
  name: 'Deal',
  components: {
    WEditor,
    ChooseImages
  },
  data() {
    return {
      loading: false,
      id: 0,
      deal: {
        title: '电子协议',
        describe: null,
        seal: null
      }
    };
  },
  mounted() {
    this.getDeal();
  },
  methods: {
    saveDeal() {
      if (!this.deal.describe) {
        this.showMessage('协议内容不能为空', 'warning');
        return;
      }
      if (!this.deal.seal) {
        this.showMessage('请上传电子公章', 'warning');
        return;
      }
      settingsApi
        .updateEDeal({
          content: this.deal.describe,
          title: this.deal.title,
          seal: this.deal.seal ? this.deal.seal.imgUrl : ''
        })
        .then(res => {
          this.showMessage('更新成功', 'success');
        });
    },
    getDeal() {
      this.loading = true;
      settingsApi
        .getEDeal()
        .done(res => {
          if (!!res.data) {
            this.deal.describe = res.data.content;
            this.deal.seal = {
              id: '',
              imgUrl: res.data.seal
            };
            this.id = ++this.id; //改变key值，使组件重新渲染
          }
        })
        .always(() => {
          this.loading = false;
        });
    },
    onDeleteImg() {
      this.deal.seal = null;
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
.estate-deal {
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
      background-image: url('../../images/status_black.png');
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
  .estate-deal-preview {
    margin-bottom: 10px;
    .table-href {
      font-size: @standard-font;
    }
  }
  .estate-deal-switch {
    .deal-tips {
      color: @black-color;
      font-size: @standard-font;
      margin-bottom: 10px;
    }
  }
  .estate-deal-content {
    .editor {
      .w-e-text-container {
        height: 635px !important;
      }
    }
    .estate-deal-options {
      margin-top: 20px;
    }
  }
}
</style>
