<template>
  <div class="choose-video" :class="{ 'is-allow-edit': !isDisabledEdit }">
    <div
      class="add"
      v-if="!videoUrl"
      @click="handleShowPickedVideo"
      :style="{ cursor: !isDisabledEdit ? 'pointer' : 'not-allowed' }"
    >
      <i class="el-icon-plus"></i>
    </div>

    <template v-else>
      <div class="video-container">
        <video :width="width" :height="height" :src="videoUrl" controls></video>
        <span class="reset-video-btn" @click="handleShowPickedVideo">点击重选</span>
        <el-button class="btn-video-del" icon="el-icon-delete" circle @click.stop="onRemove"></el-button>
      </div>

      <div
        class="video-poster-container"
        v-if="videoUrl"
        :style="{ cursor: !isDisabledEdit ? 'pointer' : 'not-allowed' }"
      >
        <div class="video-poster" v-if="!posterUrl" @click="handleShowPickedImg">
          <i class="el-icon-plus"></i>
        </div>

        <div
          v-else
          class="poster"
          :style="{
            background: 'transparent url(' + posterUrl + ') no-repeat center center / cover',
            maxWidth: '176px',
            maxHeight: '174px'
          }"
        >
          <span class="reset-btn" @click="handleShowPickedImg">点击重选</span>
          <el-button class="btn-img-del" icon="el-icon-delete" circle @click.stop="onRemovePoster"></el-button>
        </div>

        <div class="poster-tips">视频封面</div>
      </div>
    </template>

    <materials-video
      v-if="showChooseVideoDialog"
      :is-video="true"
      @picked="onPickedVideo"
      @cancel="onCancelChooseVideo"
    ></materials-video>

    <images-picker
      v-if="showChooseImageDialog"
      :visible.sync="showChooseImageDialog"
      @cancel="showChooseImageDialog = false"
      @picked="onPickedImage"
      :multiple="false"
      :limit="1"
    />
  </div>
</template>

<script>
import MaterialsVideo from '@/dss-wechat3rd/src/components/material-picker/video-audio-material/index.vue';
import ImagesPicker from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
import emitter from 'element-ui/lib/mixins/emitter.js';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
export default {
  name: 'choose-video',
  mixins: [emitter, AdapterIfr.AdapterMixins],
  components: {
    MaterialsVideo,
    ImagesPicker
  },
  props: {
    video: {
      type: String,
      default: ''
    },
    videoPoster: {
      type: String,
      default: ''
    },
    // 是否禁止编辑
    isDisabledEdit: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 176
    },
    height: {
      type: Number,
      default: 176
    },
    rects: {
      type: Array,
      default() {
        return [
          { w: 800, h: 600 },
          { w: 640, h: 800 },
          { w: 800, h: 800 }
        ];
      }
    },
    rect: {
      type: Object,
      default() {
        return { w: 0, h: 0 };
      }
    }
  },
  data() {
    return {
      showChooseVideoDialog: false,
      showChooseImageDialog: false
    };
  },
  computed: {
    videoUrl: {
      get() {
        return this.video || '';
      },
      set(val) {
        this.$emit('update:video', val);
      }
    },
    posterUrl: {
      get() {
        return this.videoPoster || '';
      },
      set(val) {
        this.$emit('update:videoPoster', val);
      }
    },
    rectTipMsg() {
      let msg = '';
      this.rects.forEach((rect, index) => {
        if (index > 0) {
          msg += '，';
        }
        msg += `${rect.w}x${rect.h}px`;
      });
      return msg;
    }
  },
  methods: {
    onPickedVideo(res) {
      if (!!res) this.videoUrl = res.cdnUrl || res.localUrl;
      this.posterUrl = '';
      this.showChooseVideoDialog = false;
    },
    onCancelChooseVideo() {
      this.showChooseVideoDialog = false;
    },
    handleShowPickedVideo() {
      if (this.isDisabledEdit) return;
      this.showChooseVideoDialog = true;
    },
    handleShowPickedImg() {
      if (this.isDisabledEdit) return;
      this.showChooseImageDialog = true;
    },
    onPickedImage(res) {
      if (!!res) this.posterUrl = res.imgUrl;
      this.showChooseImageDialog = false;
    },
    onRemove() {
      this.videoUrl = '';
      this.posterUrl = '';
    },
    onRemovePoster() {
      this.posterUrl = '';
    }
  }
};
</script>

<style lang="less" scoped>
.choose-video {
  // width: 176px;
  height: 80px;
  margin-bottom: 10px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;

  &.is-allow-edit {
    .video-container:hover {
      .btn-video-del,
      .reset-video-btn {
        display: inline-block;
        z-index: 99;
      }
    }

    .poster:hover {
      .btn-img-del,
      .reset-btn {
        display: inline-block;
        z-index: 99;
      }
    }
  }

  .add {
    width: 80px;
    border-radius: 4px;
    border: 1px solid #eff2f5;
    background: #eff2f5;
    cursor: pointer;
    text-align: center;
  }

  /deep/ .el-icon-plus {
    font-size: 18px;
    line-height: 80px;
    color: #566980;
    font-weight: bold;
  }

  .video-container {
    width: 176px;
    height: 176px;
    margin-right: 10px;
    width: 176px;
    border-radius: 4px;
    border: 1px solid #eff2f5;
    display: inline-block;
    position: relative;
    background: #eff2f5;
  }

  .btn-img-del,
  .btn-video-del {
    position: absolute;
    top: 0;
    right: 8px;
    color: #ff5b56;
    display: none;
  }

  .reset-btn,
  .reset-video-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 2px;
    background: #2c3641;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    color: #ffffff;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    display: none;
    width: 68px;
    height: 24px;
    margin-top: -12px;
    margin-left: -34px;
    cursor: pointer;
  }

  .video-poster-container,
  .poster {
    width: 176px;
    height: 176px;
    width: 176px;
    border-radius: 4px;
    border: 1px solid #eff2f5;
    display: inline-block;
    text-align: center;
    background: #eff2f5;
    cursor: pointer;
    position: relative;
  }

  .poster {
    width: 100%;
    height: 100%;
    border: none;
  }

  .poster-tips {
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    line-height: 24px;
    width: 60px;
    text-align: center;
    font-size: 12px;
    color: rgb(133, 140, 153);
    background-color: #fff;
  }
}
</style>
