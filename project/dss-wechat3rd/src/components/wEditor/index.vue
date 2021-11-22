<template>
  <div>
    <div ref="editor" :style="`text-align:left;width:${width};height:${height};`"></div>
    <materials-image
      v-if="showChooseImageDialog"
      :visible.sync="showChooseImageDialog"
      @picked="onPickedImage"
      @cancel="onCancelChooseImage"
      :multiple="true"
      :limit="imageLimit"
    ></materials-image>

    <materials-video
      v-if="showChooseVideoDialog"
      :multiple="true"
      :is-video="true"
      @picked="onPickedVideo"
      @cancel="onCancelChooseVideo"
    ></materials-video>
    <graphic-minapp-dialog @on-submit="onPickedMinapp" :visible.sync="showChooseMinappDialog" />
    <rich-vr-dialog @on-submit="onPickedVr" :visible.sync="showChooseVrDialog" />
  </div>
</template>
<style>
  .w-e-text-container {
    z-index: 1000;
  }
</style>

<script>
  import mApi from '@/dss-wechat3rd/src/api/materials';
  // import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import MaterialsVideo from '@/dss-wechat3rd/src/components/material-picker/video-audio-material/index.vue';
  import GraphicMinappDialog from '@/dss-wechat3rd/src/components/graphic-minapp-dialog';
  import richVrDialog from '@/dss-wechat3rd/src/components/rich-vr-dialog';
  import MaterialsConfig from '@/dss-wechat3rd/src/constants/MaterialsConfig';
  import E from './wangEditor';
  export default {
    components: {
      MaterialsImage,
      MaterialsVideo,
      GraphicMinappDialog,
      richVrDialog,
    },
    props: {
      dataSource: {
        type: Object,
      },
      // 定义宽度
      width: {
        type: String,
        default() {
          return '800px';
        },
      },
      height: {
        type: String,
        default: '350px',
      },
      // 是否需要上传图片
      image: {
        type: Boolean,
        default() {
          return true;
        },
      },
      // 是否需要vr
      vr: {
        type: Boolean,
        default() {
          return false;
        },
      },
      // 是否开启粘贴文本过滤
      pasteHandle: {
        type: Boolean,
        default() {
          return false;
        },
      },
      // 自定义富文本内容的参数名
      paramName: {
        type: String,
        default() {
          return 'describe';
        },
      },
      // 自定义富文本内容高度
      contentHeight: {
        type: Number,
        default: 300,
      },
      // 是否引入video项
      isShowVideo: {
        type: Boolean,
        default: true,
      },
      // 是否引入minapp项
      isShowMinapp: {
        type: Boolean,
        default: true,
      },
      imageLimit: {
        type: Number,
        default: 5,
      },
    },
    data() {
      return {
        showChooseImageDialog: false,
        editor: null,
        wait: null,
        showChooseVideoDialog: false,
        waitVideo: null,
        showChooseMinappDialog: false,
        waitMinapp: null,
        showChooseVrDialog: false,
        waitVr: null,
      };
    },

    methods: {
      onChange(html) {
        this.dataSource[this.paramName] = html;
        this.$emit('change', html);
      },
      onPickedImage(res) {
        const urls = [];
        !!res &&
          res.forEach(e => {
            urls.push(e.imgUrl);
          });
        this.wait(urls);
        this.wait = null;
        this.showChooseImageDialog = false;
      },
      onCancelChooseImage() {
        this.showChooseImageDialog = false;
      },
      onPickedVideo(res) {
        // let url = '';
        // if (!!res) url = res.cdnUrl || res.localUrl;
        // this.waitVideo(url);
        let url = [];
        if (!res.length) return;
        url = res.map(item => item.cdnUrl);
        this.waitVideo(url);
        this.waitVideo = null;
        this.showChooseVideoDialog = false;
      },
      onPickedMinapp(data) {
        this.waitMinapp(data);
      },
      onCancelChooseVideo() {
        this.showChooseVideoDialog = false;
      },
      onPickedVr(data) {
        this.waitVr(data);
      },
      insertHtml() {
        if (this.dataSource[this.paramName]) {
          this.editor.txt.html(this.dataSource[this.paramName]);
        }
      },
      inputEvent() {
        const html = this.editor.txt.html();
        if (html === '' || html === '<p><br></p>') {
          this.onChange();
        }
      },
    },
    mounted() {
      const editor = (this.editor = new E(this.$refs.editor));
      const cc = editor.customConfig;
      cc.uploadImgMaxSize = 5 * 1024 * 1024;
      cc.onchange = this.onChange;
      cc.uploadImgServer = mApi.addLocal.url;
      cc.uploadFileName = 'files';
      cc.uploadImgParams = { type: MaterialsConfig.FILE_TYPES.IMAGE };
      cc.showLinkImg = false;
      cc.contentHeight = this.contentHeight;
      if (this.pasteHandle) {
        // 对粘贴内容的过滤，针对HTML标签
        cc.pasteTextHandle = content => {
          // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
          if (content === '' && !content) return '';
          let str = content;
          str = str.replace(/<xml>[\s\S]*?<\/xml>/gi, '');
          str = str.replace(/<style>[\s\S]*?<\/style>/gi, '');
          str = str.replace(/<\/?[^>]*>/g, '');
          str = str.replace(/[ |]*\n/g, '\n');
          str = str.replace(/(&nbsp;|&#160;)/gi, '');
          return str;
        };
      }
      cc.choseLinkImgTrigger = callback => {
        this.wait = callback;
        this.showChooseImageDialog = true;
      };
      cc.choseLinkVideoTrigger = callback => {
        this.waitVideo = callback;
        this.showChooseVideoDialog = true;
      };
      // 小程序卡片选择回调
      cc.choseLinkMinappTrigger = callback => {
        this.waitMinapp = callback;
        this.showChooseMinappDialog = true;
      };
      cc.choseLinkVrTrigger = callback => {
        this.waitVr = callback;
        this.showChooseVrDialog = true;
      };
      cc.menus = [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'foreColor',
        'backColor',
        'list',
        'justify',
        'quote',
        this.image ? 'image' : '',
        'undo',
        'redo',
        // 'video',
        // !!this.vr ? 'vr' : '',
        // 'minapp'
      ];
      if (this.isShowVideo) cc.menus.push('video');
      if (this.vr) cc.menus.push('vr');
      if (this.isShowMinapp) cc.menus.push('minapp');

      editor.create();
      if (this.dataSource[this.paramName]) {
        editor.txt.html(this.dataSource[this.paramName]);
      }

      this.$refs.editor.addEventListener('input', this.inputEvent);
    },
  };
</script>

<style scoped></style>
