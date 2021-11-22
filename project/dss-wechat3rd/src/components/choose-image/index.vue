<template>
  <div class="img-uploader">
    <div
      :class="{ img: true, isAllowEdit: !isDisabledEdit }"
      v-for="(item, index) in value"
      :key="item.id"
      :style="{
        background: 'transparent url(' + item.imgUrl + ') no-repeat center center / cover',
        width: imgWidth + 'px',
        height: imgHeight + 'px',
      }"
    >
      <el-button
        class="btn-img-del"
        icon="el-icon-delete"
        :style="{ padding: delBtnSize + 'px' }"
        circle
        @click.stop="handleDelete(index)"
      ></el-button>
    </div>

    <div
      v-if="imgLimit"
      class="img"
      :style="{
        cursor: !isDisabledEdit ? 'pointer' : 'not-allowed',
        maxWidth: imgWidth + 'px',
        height: imgHeight + 'px',
      }"
      @click.stop="handleChooseImage"
    >
      <i class="el-icon-plus" :style="{ 'line-height': imgHeight + 'px' }"></i>
    </div>

    <images-picker
      v-if="showChooseImageDialog"
      :visible.sync="showChooseImageDialog"
      @cancel="onCancelPickImage"
      @picked="onPickedImage"
      :multiple="multiple"
      :limit="imgLimit"
    />
  </div>
</template>

<script>
  import emitter from 'element-ui/lib/mixins/emitter.js';
  import ImagesPicker from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';

  export const Size = {
    C: 'custom',
    S: 'small',
    M: 'middle',
    L: 'large',
  };

  const SizeMap = {
    [Size.S]: {
      width: 56,
      height: 56,
      buttonSize: 5,
    },
    [Size.M]: {
      width: 120,
      height: 120,
      buttonSize: 8,
    },
    [Size.L]: {
      width: 176,
      height: 176,
      buttonSize: 10,
    },
  };

  export default {
    name: 'ImageUploader',
    mixins: [emitter, AdapterIfr.AdapterMixins],
    components: {
      ImagesPicker,
    },
    props: {
      value: {
        type: Array,
        default: function () {
          return [];
        },
      },
      // 是否禁止编辑
      isDisabledEdit: {
        type: Boolean,
        default: false,
      },
      // 是否多选
      multiple: {
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
      buttonSize: {
        type: Number,
        default: 10,
      },
      size: {
        type: String,
        default: Size.L,
      },
      // 是否需要删除二次确认
      isDeleteConfirm: {
        type: Boolean,
        default: false,
      },
      // 删除二次确认标题文案
      confirmTitle: {
        type: String,
        default: '此操作将删除图片, 是否继续?',
      },
    },
    computed: {
      imgLimit() {
        const num = this.limit - this.value.length;
        return num > 0 ? num : 0;
      },
      imgWidth() {
        return SizeMap[this.size] ? SizeMap[this.size].width : this.width;
      },
      imgHeight() {
        return SizeMap[this.size] ? SizeMap[this.size].height : this.height;
      },
      delBtnSize() {
        return SizeMap[this.size] ? SizeMap[this.size].buttonSize : this.buttonSize;
      },
    },
    data() {
      return {
        showChooseImageDialog: false,
      };
    },
    methods: {
      handleChooseImage() {
        if (!this.isDisabledEdit) {
          this.showChooseImageDialog = true;
          this.adapterIfmMask(true);
        }
      },
      onCancelPickImage() {
        this.showChooseImageDialog = false;
        this.adapterIfmMask(false);
      },

      onPickedImage(imgs) {
        this.onCancelPickImage();
        const l = imgs.slice(0, this.limit);
        this.$emit('input', l);
        // 触发表单验证
        this.dispatch('ElFormItem', 'el.form.change', l);
      },
      handleDelete(index) {
        if (!this.isDisabledEdit) {
          this.isDeleteConfirm ? this.onRemoveConfirm(index) : this.onRemove(index);
        }
      },
      onRemoveConfirm(index) {
        this.$confirm(this.confirmTitle, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
          closeOnClickModal: false,
        })
          .then(() => {
            this.onRemove(index);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            });
          });
      },
      onRemove(index) {
        this.$emit('delete', index);
      },
    },
  };
</script>

<style lang="less" scoped>
  .img-uploader {
    display: flex;
    overflow: hidden;
    text-align: center;
  }

  .img.isAllowEdit {
    .btn-img-del,
    .upload-desc {
      display: inline-block;
      z-index: 99;
    }
  }

  .img {
    width: 174px;
    height: 174px;
    border-radius: 4px;
    border: 1px dashed #dce1e6;
    position: relative;
    margin: 4px;

    .el-icon-plus {
      font-size: 18px;
      line-height: 132px;
      color: #b1b5bd;
      font-weight: bold;
    }
  }

  .btn-img-del {
    position: absolute;
    right: 5px;
    top: 5px;
    color: #ff5b56;
    display: none;
  }

  .upload-desc {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 2px;
    background: #2c3641;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 12px;
    line-height: 24px;
    display: none;
    width: 68px;
    height: 24px;
    margin-top: -12px;
    margin-left: -34px;
    cursor: pointer;
  }
</style>
