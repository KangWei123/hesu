<template>
  <div class="img-uploader-multi">
    <div
      v-for="(item, index) of value"
      :key="item"
      :class="['img-uploader', { isAllowEdit: !disable }]"
      :style="{ width: width + 'px', height: height + 'px', 'line-height': height + 'px' }"
    >
      <div class="avatar" :style="{ background: 'transparent url(' + item + ') no-repeat center center / cover' }">
        <div class="hover-content">
          <span v-if="canReset" class="upload-desc" @click="handleReChooseImage(index)">点击重选</span>
          <slot name="actions" />
        </div>
        <el-button
          class="btn-img-del"
          icon="el-icon-delete"
          plain
          circle
          size="mini"
          @click.stop="handleRemove(index)"
        ></el-button>
      </div>
    </div>

    <div
      :class="['img-uploader', { isAllowEdit: !disable && !disableAdd }]"
      :style="{ width: width + 'px', height: height + 'px', 'line-height': height + 'px' }"
    >
      <div :style="{ cursor: !disable && !disableAdd ? 'pointer' : 'not-allowed' }" @click="handleChooseImage">
        <i class="el-icon-plus" :style="{ 'line-height': height + 'px' }"></i>
      </div>
    </div>

    <images-picker
      v-if="showChooseImageDialog"
      :visible.sync="showChooseImageDialog"
      :multiple="editingIndex === -1"
      :limit="editingIndex !== -1 ? 1 : limit - value.length"
      @cancel="onCancelPickImage"
      @picked="onPickedImage"
    />
    <slot></slot>
  </div>
</template>

<script>
  import emitter from 'element-ui/lib/mixins/emitter.js';
  import { ImagesPicker } from '@/mod-kangyang/ref/components';
  import uniq from 'lodash/uniq';
  // eslint-disable-next-line local-rules/no-cross-import
  import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';

  export default {
    name: 'ImageUploaderMulti',
    components: {
      ImagesPicker,
    },
    mixins: [emitter, AdapterIfr.AdapterMixins],

    props: {
      value: {
        // string[]
        type: Array,
        default: () => [],
      },
      // 是否禁止编辑
      disable: {
        type: Boolean,
        default: false,
      },
      limit: {
        type: Number,
        default: 5,
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
      canReset: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        // 正在编辑
        editingIndex: -1,
        showChooseImageDialog: false,
      };
    },
    computed: {
      disableAdd() {
        return this.value.length >= this.limit;
      },
    },

    methods: {
      handleChooseImage() {
        this.editingIndex = -1;

        if (this.disableAdd) {
          return;
        }
        this.showChooseDialog();
      },

      handleReChooseImage(index) {
        this.editingIndex = index;
        this.showChooseDialog();
      },

      handleRemove(index) {
        const value = [...this.value];
        value.splice(index, 1);
        this.updateValue(value);
      },

      showChooseDialog() {
        // 判断是否禁止编辑
        if (!this.disable) {
          this.showChooseImageDialog = true;
          this.adapterIfmMask(true);
        }
      },

      onCancelPickImage() {
        this.showChooseImageDialog = false;
        this.adapterIfmMask(false);
      },

      onPickedImage(choosedImg) {
        this.showChooseImageDialog = false;
        this.adapterIfmMask(false);
        const value = [...this.value];
        if (this.editingIndex === -1) {
          value.push(...choosedImg.map(i => i.imgUrl));
        } else {
          value[this.editingIndex] = choosedImg.imgUrl;
        }

        this.updateValue(value);
      },

      updateValue(value) {
        const uvalue = uniq(value);
        this.$emit('input', uvalue);
        this.dispatch('ElFormItem', 'el.form.change', [uvalue]);
      },
    },
  };
</script>

<style lang="less" scoped>
  .img-uploader {
    display: inline-block;
    width: 176px;
    height: 132px;
    background: #eff2f5;
    border-radius: 4px;
    border: 1px solid #eff2f5;
    position: relative;
    line-height: 132px;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center;
    margin-right: 10px;

    .el-icon-plus {
      font-size: 18px;
      line-height: 132px;
      color: #566980;
      font-weight: bold;
    }
  }

  .isAllowEdit:hover {
    .btn-img-del,
    .upload-desc {
      display: block;
      z-index: 99;
    }
  }

  .avatar {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .btn-img-del {
    position: absolute;
    top: 0;
    right: 8px;
    color: #ff5b56;
    display: none;
    transform: scale(0.8);
    background-color: rgba(128, 128, 128, 0.7);
    border: none;
  }

  .btn-img-del:hover {
    .btn-img-del();
  }

  .hover-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<style>
  .upload-desc {
    border-radius: 2px;
    background: #2c3641;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 12px;
    line-height: 24px;
    display: none;
    width: 68px;
    height: 24px;
    cursor: pointer;
    margin-bottom: 5px;
  }
</style>
