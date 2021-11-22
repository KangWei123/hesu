<template>
  <div class="choose-video-multi">
    <div v-for="(item, index) of value" :key="`${item.url}-${index}`" class="video-item">
      <div class="choose-video" :class="{ 'is-allow-edit': !disable }">
        <div class="video-container">
          <video :width="width" :height="height" :src="item.url" controls></video>
          <span class="reset-video-btn" @click="handleRePickVideo(index)">点击重选</span>
          <el-button
            class="btn-video-del"
            size="small"
            icon="el-icon-delete"
            style="background: rgba(128, 128, 128, 0.7); border: none"
            circle
            @click.stop="handleRemove(index)"
          ></el-button>
        </div>

        <div v-if="item.url" class="video-poster-container" :style="{ cursor: !disable ? 'pointer' : 'not-allowed' }">
          <div v-if="!item.coverUrl" class="video-poster" @click="handlePickCover(index)">
            <i class="el-icon-plus"></i>
          </div>

          <div
            v-else
            class="poster"
            :style="{
              background: 'transparent url(' + item.coverUrl + ') no-repeat center center / cover',
              maxWidth: '176px',
              maxHeight: '174px',
            }"
          >
            <span class="reset-btn" @click="handlePickCover(index)">点击重选</span>
            <el-button
              class="btn-img-del"
              icon="el-icon-delete"
              circle
              size="small"
              style="background: rgba(128, 128, 128, 0.7); border: none"
              @click.stop="handleRemoveCover(index)"
            ></el-button>
          </div>

          <div class="poster-tips">视频封面</div>
        </div>
      </div>
      <el-input
        :disabled="disable"
        class="video-item__input"
        :value="item.name"
        @input="handleNameChange(index, $event)"
      />
    </div>
    <div class="choose-video">
      <div
        class="add"
        :style="{ cursor: !disable && !disableAdd ? 'pointer' : 'not-allowed' }"
        @click="handlePickVideo"
      >
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <materials-video
      v-if="showChooseVideoDialog"
      is-video
      @picked="onPickedVideo"
      @cancel="onCancelChooseVideo"
    ></materials-video>

    <images-picker
      v-if="showChooseImageDialog"
      :visible.sync="showChooseImageDialog"
      :multiple="false"
      :limit="1"
      @cancel="showChooseImageDialog = false"
      @picked="onPickedImage"
    />
  </div>
</template>

<script>
  import { MaterialsVideo, ImagesPicker } from '@/mod-kangyang/ref/components';
  import emitter from 'element-ui/lib/mixins/emitter.js';
  // eslint-disable-next-line local-rules/no-cross-import
  import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';

  /**
   * 支持多选的视频
   */
  export default {
    name: 'ChooseVideoMulti',
    components: {
      MaterialsVideo,
      ImagesPicker,
    },
    mixins: [emitter, AdapterIfr.AdapterMixins],
    props: {
      value: {
        // Array<{url: string, coverUrl?: string, name: string}>
        type: Array,
        default: () => [],
      },
      limit: {
        type: Number,
        default: 10,
      },
      // 是否禁止编辑
      disable: {
        type: Boolean,
        default: false,
      },
      width: {
        type: Number,
        default: 176,
      },
      height: {
        type: Number,
        default: 176,
      },
      rects: {
        type: Array,
        default() {
          return [
            { w: 800, h: 600 },
            { w: 640, h: 800 },
            { w: 800, h: 800 },
          ];
        },
      },
      rect: {
        type: Object,
        default() {
          return { w: 0, h: 0 };
        },
      },
    },
    data() {
      return {
        editing: -1,
        showChooseVideoDialog: false,
        showChooseImageDialog: false,
      };
    },
    computed: {
      disableAdd() {
        return this.value.length >= this.limit;
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
      },
    },
    methods: {
      handlePickVideo() {
        if (this.disableAdd) {
          return;
        }
        this.editing = -1;
        this.showVideoDialog();
      },

      handleRePickVideo(index) {
        this.editing = index;
        this.showVideoDialog();
      },

      handleRemove(index) {
        if (this.disable) {
          return;
        }

        const value = [...this.value];
        value.splice(index, 1);
        this.updateValue(value);
      },

      handlePickCover(index) {
        this.editing = index;
        this.showImageDialog();
      },

      handleNameChange(index, evt) {
        if (this.disable) {
          return;
        }

        const value = [...this.value];
        value[index] = { ...value[index], name: evt };
        this.updateValue(value);
      },

      handleRemoveCover(index) {
        if (this.disable) {
          return;
        }

        const value = [...this.value];
        value[index] = { ...value[index], coverUrl: '' };
        this.updateValue(value);
      },

      showVideoDialog() {
        if (this.disable) {
          return;
        }
        this.showChooseVideoDialog = true;
      },

      showImageDialog() {
        if (this.disable) {
          return;
        }
        this.showChooseImageDialog = true;
      },

      onPickedVideo(res) {
        const url = res.cdnUrl || res.localUrl;
        const name = res.materialName || res.originalName;
        const value = [...this.value];
        const item = {
          name,
          url,
          coverUrl: res.coverUrl,
        };
        if (this.editing === -1) {
          // 新增
          value.push(item);
        } else {
          // 更新
          value[this.editing] = { ...this.value[this.editing], ...item };
        }

        this.showChooseVideoDialog = false;
        this.updateValue(value);
      },

      onPickedImage(res) {
        if (this.editing === -1) {
          return;
        }

        const value = [...this.value];
        value[this.editing] = { ...value[this.editing], coverUrl: res.imgUrl };

        this.updateValue(value);

        this.showChooseImageDialog = false;
      },

      updateValue(value) {
        this.$emit('input', value);
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      },

      onCancelChooseVideo() {
        this.showChooseVideoDialog = false;
      },

      handleShowPickedVideo() {
        if (this.disable) return;
        this.showChooseVideoDialog = true;
      },
    },
  };
</script>

<style lang="less" scoped>
  .choose-video {
    // width: 176px;
    height: 176px;
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
      width: 176px;
      border-radius: 4px;
      border: 1px solid #eff2f5;
      background: #eff2f5;
      cursor: pointer;
      text-align: center;
    }

    /deep/ .el-icon-plus {
      font-size: 18px;
      line-height: 176px;
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
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
      color: #fff;
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

  .video-item {
    margin-bottom: 24px;
  }

  .video-item__input {
    width: 366px;
  }
</style>
