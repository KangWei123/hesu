/*
 * @Author: LCW 
 * @Date: 2019-04-01 15:10:29 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-07-09 17:17:50
 */
<template>
  <div class="ueditor" :class="{
    newstyle: newstyle,
    error: error ? 'error' : ''
    }">
    <script :id="id" name="content" type="text/plain">
  {{ content }}
    </script>
    <span class="error-tip" v-show="error">正文不能为空</span>
    <materials-image
      v-if="showChooseImageDialog"
      :visible.sync="showChooseImageDialog"
      @cancel="onCancelPickImage"
      @picked="onPickedImage"
      :is-wx-source="isWxSource"
      :multiple="false"
    />
    <!-- 商品sku查询 -->
    <goods-select-dialog
      v-model="showSkuDialog"
      :active-tabs="computeActiveTabs"
      @single-choosed="onChooseSkuProduct"
    ></goods-select-dialog>
    <!--<insertVideo @submit='onPickedVideoAudio' @close='showChooseVideoAudio = false' :visible='showChooseVideoAudio' />-->
    <GoodsDetailDialog @cancelLink="cancelLink" v-model="showGoodsDetailDialog" :goods-id="goodsId" />

    <div class="_mask" v-show="showEmotion" @click="clickHideEmotion"></div>
    <div
      class="_popover"
      :style="{left: emotionLocation.x, top: emotionLocation.y}"
      v-show="showEmotion"
    >
      <div class="emotion_wrap">
        <ul class="block_emotion">
          <li
            v-for="(item, index) in icons"
            :key="index"
            class="item_emotion"
            @click="pickEmotion(item.name) "
          >
            <emotion :bp="item.bp" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';

import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
import Emotion from '../emoji/emotion.vue';
import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
import emoji from "../emoji";
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import GoodsDetailDialog from './goods-detail-dialog/index.vue';
window.$ = window.jQuery = $;

window.UMEDITOR_HOME_URL = process.env.VUE_APP_CDN_URL + '/resources/dss-web-portal/libs/umeditor/static/';
require('../../lib/umeditor/static/umeditor.config.js');
require('../../lib/umeditor/static/umeditor.js');
// import insertVideo from '../insertVideo/index';

export default {
  name: 'VUeditor',
  components: {
    MaterialsImage,
    Emotion,
    GoodsSelectDialog,
    GoodsDetailDialog
    // insertVideo
  },
  props: {
    newstyle: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {}
    },
    isWxSource: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    },
    useCustomUpload: {
      // 使用dxy 公共服务
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      instance: null,
      showChooseImageDialog: false,
      icons: emoji.Icons,
      showEmotion: false,
      isVideo: true,
      showSkuDialog: false,
      content: '',
      goodsId: '',
      showGoodsDetailDialog: false,
      productList: [],
      showChooseVideoAudio: false,
      emotionLocation: {
        x: 0,
        y: 0
      },
      // 当触发过resize事件后元素定位会出现变化，使用这两个值把位置拉回来
      formatTop: 0,
      formatLeft: 0,
      error: null,
      selectedImg: null
    };
  },
  watch: {
    value(newVal, oldVal) {
      if (!this.ready) return;
      if (newVal === this.instance.getContent()) return;
      this.instance.setContent(newVal);
      const range = this.instance.selection.getRange();
      range && range.select();
    }
  },
  computed: {
    computeActiveTabs() {
      return [goodsTypeEnum.product];
    }
  },
  methods: {
    setContent(val) {
      this.instance.setContent(val);
    },
    onCancelPickImage() {
      this.showChooseImageDialog = false;
    },
    onPickedVideoAudio(url) {
      // let wxMediaId = choosed.wxMediaId;
      // let originalName = choosed.originalName;
      const html = `
      <iframe _url='${url}' allowfullscreen='true' width='300' height='225'  class='edui-faked-video' frameborder="0"></iframe>
      `;
      // console.log(choosed);
      this.instance.execCommand('insertHtml', html);
      this.showChooseVideoAudio = false;
    },
    onPickedImage(choosedImg) {
      this.showChooseImageDialog = false;
      let { wxUrl = '', imgUrl = '' } = choosedImg;
      wxUrl = this.isWxSource ? wxUrl : imgUrl;
      const img = `<img width='100%' height='auto' src='${wxUrl}'  class='editor-img' _url='${imgUrl}' data-src='${wxUrl}'/>
      `;
      this.instance.execCommand('insertHtml', img);
    },
    getEmotionLocation() {
      const emotionIcon = document.querySelector('.edui-icon-emotion');
      if (!emotionIcon) return { x: 0, y: 0 };
      const rect = emotionIcon.getBoundingClientRect();
      const x = rect.left + rect.width - 68 - this.formatLeft + 'px';
      const y = rect.top + rect.height - this.formatTop + 'px';
      this.emotionLocation = {
        x,
        y
      };
    },
    windwoResize() {
      this.getEmotionLocation();
    },
    clickHideEmotion() {
      this.showEmotion = false;
    },
    setError(error) {
      this.error = error;
    },
    onChooseSkuProduct(goodsItem) {
      const goodsType = goodsItem.wxItem ? goodsItem.wxItem.type : goodsItem.type;
      const itemNo = goodsItem.itemNo || goodsItem.wxItem.itemNo;
      this.selectedImg.setAttribute('data-itemno', itemNo);
      this.selectedImg.setAttribute('data-goodstype', goodsType);
      this.selectedImg.setAttribute('data-type', 'goods');
      this.selectedImg.classList.add('link-image');
      this.instance.execCommand('insertHtml', this.selectedImg.parentNode.innerHTML);
      this.$message({
        showClose: true,
        message: '添加成功',
        type: 'success'
      });
    },
    cancelLink() {
      this.selectedImg.removeAttribute('data-itemno');
      this.selectedImg.removeAttribute('data-goodstype');
      this.selectedImg.removeAttribute('data-type');
      this.selectedImg.classList.remove('link-image');
      this.instance.execCommand('insertHtml', this.selectedImg.parentNode.innerHTML);
      this.$message({
        showClose: true,
        message: '取消成功',
        type: 'success'
      });
    },
    /**
     * 选中表情
     * @param name
     */
    pickEmotion(name) {
      const currentEmotion = emoji.getEmojiImgByIconName(name);
      const img = `<img style="
                      vertical-align: middle; width: 20px; height: 20px;
                      background: transparent url(https://res.wx.qq.com/mpres/en_US/htmledition/pages/modules/emoji_panel/icon_emotion_panel.2x.png) no-repeat 0 0;
                      background-size: 20px auto;
                      background-position: ${currentEmotion.backgroundPosition}"
                      src='${currentEmotion.src}'
                      class='icon-img'
                      data-w="20"
                      data-ratio="1"
                   />`;
      this.instance.execCommand('insertHtml', img, true);
      this.showEmotion = false;
    },
    init() {
      this.instance = UM.getEditor(this.id, {
        initialFrameWidth: '100%',
        useCustomUpload: this.useCustomUpload,
        editorVersion: '0.4.1',
        ...this.config
      });
      if (config.readonly) {
        this.instance.setDisabled();
      }
      this.instance.ready(() => {
        this.$emit('ready', this.instance);
        this.ready = true;
        this.getEmotionLocation();
      });
      this.instance.addListener('contentChange', () => {
        this.$emit('change', {
          content: this.instance.getContent(),
          text: this.instance.getContentTxt()
        });
        this.$emit('input', this.instance.getContent());
      });
      this.instance.addListener('selectionchange', editor => {
        this.$emit('selectionchange', this.instance.getContent());
        if (this.value !== this.instance.getContent()) {
          this.$emit('input', this.instance.getContent());
        }
      });
      this.instance.addListener('imagClick', name => {
        this.showChooseImageDialog = true;
      });
      this.instance.addListener('emotionClick', editor => {
        this.showEmotion = true;
      });
      this.instance.addListener('videoClick', editor => {
        this.isVideo = true;
        this.showChooseVideoAudio = true;
      });
      this.instance.addListener('audioClick', editor => {
        this.isVideo = false;
        this.showChooseVideoAudio = true;
      });
      this.instance.addListener('linkClick', (_, eventName) => {
        const range = this.instance.selection.getRange();
        const node = range.getClosedNode();
        if (node) {
          const hasLink = node.classList.contains('link-image');
          if (!hasLink) {
            this.showSkuDialog = true;
            this.selectedImg = node;
            return false;
          }
          this.showGoodsDetailDialog = true;
          this.selectedImg = node;
          this.goodsId = node.dataset.itemno;
        }
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
      window.addEventListener('resize', this.windwoResize);
      window.addEventListener('scroll', this.windwoResize, true);
    });
  },
  beforeDestroy() {
    // 组件销毁的时候，要销毁 UEditor 实例
    if (this.instance !== null && this.instance.destroy) {
      this.instance.destroy();
    }
    window.removeEventListener('resize', this.windwoResize);
    window.removeEventListener('scroll', this.windwoResize, true);
  }
};
</script>
<style lang="less" scoped>
@import url('../../lib/umeditor/static/themes/default/css/umeditor.css');
@import url('../../lib/umeditor/static/themes/dxy/ueditor.css');
@import url('./index.less');
.error-tip {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
}
</style>
