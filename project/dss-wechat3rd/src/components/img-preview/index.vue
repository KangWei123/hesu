<template>
  <!-- 图片预览 -->
  <div v-if="showPreview"
       class="img-preview">
    <!-- 遮罩层 -->
    <div class="preview-mask"
         @click="handleMask"></div>
    <!-- 右上角图片关闭按钮 -->
    <span class="preview-btn preview-close"
          @click="handleClose"
          v-if="showClose">
      <i class="el-icon-circle-close"></i>
    </span>
    <!-- 图片预览 -->
    <div class="preview-content">
      <img :src="imgUrl"
           alt="">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 是否显示图片预览
    showPreview: {
      type: Boolean,
      default: true
    },
    // 需要预览的图片链接
    imgUrl: {
      type: String,
      default: ''
    },
    // 是否显示右上角的关闭按钮
    showClose: {
      type: Boolean,
      default: true
    },
    // 是否允许遮罩层点击事件
    allowMaskClick: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * 点击右上角关闭按钮，
     */
    handleClose() {
      // 关闭图片预览图片弹框
      this.$emit('handleClose');
    },

    /**
     * 点击遮罩层，
     */
    handleMask() {
      // 判断是否允许遮罩层点击事件
      if (!this.allowMaskClick) {
        return;
      }

      // 关闭图片预览图片弹框
      this.$emit('handleClose');
    }
  }
};
</script>

<style lang="less" scoped>
.img-preview {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2001;
}
.preview-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0.5;
  background: #000;
}
.preview-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview-content img {
  transform: scale(1) rotate(0deg);
  margin-left: 0px;
  margin-top: 0px;
  max-height: 100%;
  max-width: 100%;
}
.preview-btn {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0.8;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
}
.preview-close {
  top: 40px;
  right: 40px;
  width: 40px;
  height: 40px;
  font-size: 40px;
}
</style>
