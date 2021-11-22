<template>
  <div class="banner-upload">
    <div
      class="uploader-wrapper"
      :style="{
        ...(bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : { backgroundImage: `url(${defaultBanner})` })
      }"
    >
      <div class="uploader" @click="showChooseImageDialog = true">+更改图片</div>
    </div>
    <a class="recover" @click="handleRecover">恢复默认</a>
    <images-picker
      v-if="showChooseImageDialog"
      :visible.sync="showChooseImageDialog"
      @cancel="showChooseImageDialog = false"
      @picked="onPickedImage"
    />
  </div>
</template>

<script>
import defaultBanner from '../../assets/form-util-banner-default.png';
import ImagesPicker from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';

export default {
  mixins: [AdapterIfr.AdapterMixins],
  props: {
    value: {
      type: String,
      default: ''
    }
  },

  components: {
    ImagesPicker
  },

  data() {
    return {
      defaultBanner: defaultBanner,
      bannerUrl: '',
      showChooseImageDialog: false
    };
  },

  methods: {
    onPickedImage(e) {
      const value = e.imgUrl;
      this.bannerUrl = e.imgUrl;
      this.showChooseImageDialog = false;
      this.$emit('input', value);
    },
    handleRecover() {
      this.bannerUrl = '';
      this.$emit('input', '');
    }
  },

  mounted() {
    this.bannerUrl = this.value;
  },

  watch: {
    // dsp iframe 遮罩处理
    showChooseImageDialog(val) {
      this.adapterIfmMask(val);
    }
  }
};
</script>

<style lang="less" scoped>
.uploader {
  position: absolute;
  cursor: pointer;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(96, 96, 96, 0.52);
  border-radius: 2px;

  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 60px;
  text-align: center;
}
.uploader-wrapper {
  width: 187.5px;
  height: 60px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  border-radius: 2px;
  position: relative;
  margin: 16px 0;
}

.recover {
  cursor: pointer;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(56, 120, 251, 1);
  line-height: 17px;
  margin: 0;
  margin-top: 10px;
}
</style>
