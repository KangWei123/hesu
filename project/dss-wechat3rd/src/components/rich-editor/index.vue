<template>
  <div class="wx-msg-panel">
    <div class="body" v-if="!(choosedMaterials[this.store.type])  ">
      <div class="_part" style="float: left;">
        <a href="javascript:;" @click="selectFromWx" class="_link">从素材库中选择</a>
      </div>

      <div class="_part" style="float: right;">
        <!-- <el-upload
          class="uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          v-show="typeName !== '图文'"
        >
          <a href="javascript:;" class="_link upload">新建{{typeName}}</a>
        </el-upload>-->
        <!-- <addVideoVoice
          :catchError="catchUploadError"
          @success="uploadSuccess"
          :isLocal="false"
          :uploadProps="uploadProps"
          v-if="typeName === '音频'"
        >
          <a href="javascript:;" class="_link upload">新建{{typeName}}</a>
        </addVideoVoice> -->
        <addImage
          :isLocal="false"
          :catchError="catchUploadError"
          :uploadProps="uploadProps"
          @success="uploadSuccess"
          v-if="typeName === '图片'"
        >
          <a href="javascript:;" class="_link upload">新建{{typeName}}</a>
        </addImage>
        <!-- <a
          href="javascript:;"
          v-show="typeName === '图文'"
          @click="creatArticle"
          class="_link upload"
        >新建{{typeName}}</a> -->
        <!-- <a
          href="javascript:;"
          v-show="typeName === '视频'"
          @click="addVideo"
          class="_link upload"
        >新建{{typeName}}</a> -->
      </div>
    </div>
    <choosed-materials
      @toggleMaterials="toggleMaterials"
      v-else
      :materials="choosedMaterials[store.type]"
      :type="this.store.type"
    />
    <!-- 图片对话框 -->
    <materials-image
      v-if="showChooseImageDialog"
      @cancel="onCancelPick"
      @picked="onPickedImage"
      :isWxSource="true"
      :multiple="false"
    />
    <!-- 图文对话框 -->
    <!-- <materials-article
      v-if="showChooseArticleDialog"
      @cancel="onCancelPick"
      @picked="onPickedArticle"
      :isSelfMotion="isSelfMotion"
      :isMass="isMass"
    /> -->
    <!-- 语音视频对话框 -->
    <!-- <materials-video-audio
      v-if="showChooseVideoAudio"
      :isVideo="isVideo"
      @cancel="onCancelPick"
      @picked="onPickedVideoAudio"
    /> -->
    <p class="_err_h5tips" v-if="err">{{err}}</p>
  </div>
</template>

<style>
._err_h5tips {
  position: absolute;
  margin: 4px 0 -10px;
  color: #e15f63;
}
</style>

<script>
import { MsgTypes, ButtonTypes } from '@/dss-wechat3rd/src/constants/wx-msg';
import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image';
// import MaterialsArticle from '../../../../components/materials/article/index.vue';
// import MaterialsVideoAudio from '../../../../components/materials/video-and-audio/index.vue';
import choosedMaterials from '../choosed-materials/index.vue';
// import addVideoVoice from '../../../../components/materials/addVideoVoice.vue';
import uploadMixin from '@/dss-wechat3rd/src/mixins/uploadMixin.js';
import addImage from '@/dss-wechat3rd/src/components/materials/addImage.vue';
import '@/dss-wechat3rd/src/components/materials/index.less';

const ErrEmpty = '不能为空';
const typeToDialog = {
  [ButtonTypes.IMAGE]: 'showChooseImageDialog',
  [ButtonTypes.Article]: 'showChooseArticleDialog',
  [ButtonTypes.VIDEO]: 'showChooseVideoAudio',
  [ButtonTypes.AUDIO]: 'showChooseVideoAudio'
};
export default {
  mixins: [uploadMixin],
  components: {
    MaterialsImage,
    // MaterialsArticle,
    // addVideoVoice,
    addImage,
    // MaterialsVideoAudio,
    'choosed-materials': choosedMaterials
  },
  props: {
    store: {
      type: Object
    },
    choosedMaterials: {
      type: Object
    },
    isMass: {
      type: Boolean,
      default: false
    },
    isSelfMotion: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      typeToDialog,
      typeName: '图文',
      err: null,
      isVideo: false,
      showChooseImageDialog: false,
      showChooseArticleDialog: false,
      showChooseVideoAudio: false
    };
  },
  mounted() {
    this.updateTypeName(this.store && this.store.type);
  },
  watch: {
    'store.type'(newVal) {
      this.updateTypeName(newVal);
    }
  },
  methods: {
    //todo
    beforeUpload(file) {},
    creatArticle() {
      let path = this.isMass ? '/wechatoa/oa/materials/addGraphic?isMass=1' : '/wechatoa/oa/materials/addGraphic';
      let url = location.protocol + '//' + location.host + '/dsp.html#' + path;
      window.open(url, '_blank');
    },
    catchUploadError(message) {
      this.isUpload = false;
      this.uploadProps.disabled = false;
      this.$message.closeAll();
      this.$message({
        type: 'error',
        message: message
      });
    },
    addVideo() {
      this.$message({
        type: 'warning',
        message: '由于微信接口限制，暂不支持新建视频，请前往微信后台新建视频'
      });
      // let url =
      //   location.protocol + '//' + location.host + '/dsp.html#' + '/wechatoa/oa/materials/addMultimedia?type=Video';
      // window.open(url, '_blank');
    },
    uploadSuccess(e) {
      this.isUpload = false;
      this.uploadProps.disabled = false;
      this.$message.closeAll();
      this.$message({
        type: 'success',
        message: '上传成功'
      });

      let storeType = this.store.type;
      if (storeType === ButtonTypes.IMAGE) {
        this.onPickedImage({
          id: e.id,
          imgUrl: e.url,
          wxMediaId: e.wxMediaId
        });
      } else if (storeType === ButtonTypes.AUDIO) {
        e.originalName = e.originalName ? e.originalName : '啦啦啦';
        this.onPickedVideoAudio(e);
      }
    },
    updateTypeName(newVal) {
      let type = '';
      switch (newVal) {
        case ButtonTypes.IMAGE:
          type = '图片';
          break;
        case ButtonTypes.Article:
          type = '图文';
          break;
        case ButtonTypes.AUDIO:
          type = '音频';
          break;
        case ButtonTypes.VIDEO:
          type = '视频';
          break;
      }
      this.typeName = type;
    },
    //todo
    handleSuccess(es, file) {},
    //打开素材选择框
    selectFromWx() {
      let storeType = this.store.type;
      switch (storeType) {
        case ButtonTypes.IMAGE:
          this.showChooseImageDialog = true;
          break;
        case ButtonTypes.Article:
          this.showChooseArticleDialog = true;
          break;
        case ButtonTypes.AUDIO:
          this.isVideo = false;
          this.showChooseVideoAudio = true;
          break;
        case ButtonTypes.VIDEO:
          this.isVideo = true;
          this.showChooseVideoAudio = true;
          break;
      }
    },
    //选择图片
    onPickedImage(choosedImg) {
      let value = {
        value: choosedImg.id,
        imgUrl: choosedImg.imgUrl,
        wxMediaId: choosedImg.wxMediaId
      };
      this.$emit('changeMaterials', value);
      this.showChooseImageDialog = false;
    },
    //选择图文
    onPickedArticle(choosed) {
      let value = {
        article: choosed,
        wxMediaId: choosed[0].wxMediaId,
        value: choosed[0].id
      };
      this.$emit('changeMaterials', value);
      this.showChooseArticleDialog = false;
    },
    //选择语音 视频
    onPickedVideoAudio(choosed) {
      let originalName = choosed.type === 3 ? choosed.title : choosed.originalName;
      let value = {
        value: choosed.id,
        originalName,
        url: choosed.url,
        wxMediaId: choosed.wxMediaId
      };
      this.$emit('changeMaterials', value);
      this.showChooseVideoAudio = false;
    },
    //取消素材选择
    onCancelPick() {
      let dialogType = this.typeToDialog[this.store.type];
      this[dialogType] = false;
      this.$emit('changeMaterials', null);
    },
    //替换素材
    toggleMaterials() {
      this.selectFromWx();
    },
    verify() {
      const value = this.store.value;
      this.err = !value ? this.typeName + ErrEmpty : null;
      console.log(this.err);
    }
  }
};
</script>


<style rel="stylesheet/less" lang="less">
.wx-msg-panel {
  padding: 0 !important;
  // border-top: 1px solid #DCDDE0;
  box-shadow: none !important;
  .body:after {
    content: '\200B';
    display: block;
    height: 0;
    clear: both;
  }
  .body {
    padding: 0 20px;
    // min-height: 215px;
    ._link {
      display: inline-block;
      vertical-align: middle;
      color: #3879fb;
      text-decoration: none;
      width: 100%;
      height: 211px;
      font-size: 12px;
    }
    ._link:before {
      content: ' ';
      display: block;
      width: 24px;
      height: 24px;
      margin: 65px auto 5px;
      background: url('./creat@2x.png');
      background-size: cover;
    }
    .upload._link:before {
      background: url('./lib@2x.png');
      background-size: cover;
    }
    ._part:after {
      content: ' ';
      display: inline-block;
      vertical-align: middle;
      width: 0;
      height: 100%;
      overflow: hidden;
    }
    ._part:hover {
      border-color: #b3b3b3;
    }
    ._part {
      // border: 2px dotted #e4e8eb;
      width: 48.6%;
      height: 211px;
      text-align: center;
      position: relative;
    }
  }
}
</style>
