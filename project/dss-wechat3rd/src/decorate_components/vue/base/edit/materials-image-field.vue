<template>
  <div class="materials-image-field">
    <div class="com-row">
      <span class="com-column">{{this.label}}：</span>
      <span class="com-column">
        <div class="change-image-wrap">
          <div class="img" :style="{backgroundImage:'url(' + img + ')'}"></div>
          <!-- <img :src="this.img" /> -->
          <div class="change-action" @click="changeImage">
            修改图片
            <div class="tip">建议尺寸375*125像素，支持JPG、PNG、JPEG格式</div>
          </div>
        </div>
      </span>
    </div>
    <materials-image
      v-if="showChooseImageDialog"
      :visible.sync="showChooseImageDialog"
      @cancel="onCancelPickImage"
      @picked="onPickedImage"
      :multiple="false"
    />
  </div>
</template>
<script>
/**
 * 图片上传
 */
import './css/common.less';
import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';

export default {
  props: {
    label: {
      type: String,
      required: true
    },
    img: {
      type: String,
      required: false
    }
  },
  components: {
    MaterialsImage
  },
  data() {
    return {
      showChooseImageDialog: false
    };
  },
  methods: {
    changeImage() {
      this.showChooseImageDialog = true;
    },
    onCancelPickImage() {
      this.showChooseImageDialog = false;
    },
    onPickedImage(choosedImg) {
      this.showChooseImageDialog = false;
      this.$emit('update:img', choosedImg.imgUrl);
    }
  }
};
</script>
<style lang="less" scope>
.change-image-wrap {
  position: relative;
  display: flex;
  align-items: flex-end;

  .img {
    width: 78px;
    height: 78px;
    border-radius: 4px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
  .change-action {
    cursor: pointer;
    text-align: left;
    font-size: 14px;
    box-sizing: border-box;
    color: #2e8dff;
    margin-left: 6px;
    flex: 1;

    .tip {
      width: 150px;
      font-size: 12px;
      color: #909399;
      margin-top: 8px;
    }
  }
}
</style>