<template>
  <div class="img__select">
    <div class="row__image" :style="{ height: imgContentSize, width: imgContentSize }" @click.stop="handleOpenSelect">
      <div v-if="imgUrl" class="com-close" @click.stop="handleDeleteItem" />
      <img v-if="imgUrl" :src="imgUrl" />
      <i v-else class="el-icon-plus" />
    </div>
    <div class="row__tip">
      <span v-show="!imgUrl">添加图片</span>
      <span v-if="showTip">建议尺寸 {{ imgTipSize }} px</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      param: {
        type: [String, Object],
        default: '',
      },
      imgUrl: {
        type: String,
        default: '',
      },
      showTip: {
        type: Boolean,
        default: true,
      },
      imgTipSize: {
        type: String,
        default: '56 x 56',
      },
      imgContentSize: {
        type: String,
        default: '56px',
      },
    },
    methods: {
      handleOpenSelect() {
        this.$emit('handleShow', this.param);
      },
      handleDeleteItem() {
        this.$emit('handleDeleteImg', this.param);
      },
    },
  };
</script>

<style lang="less" scoped>
  .img__select {
    display: flex;
  }
  .com-close {
    position: absolute;
    right: 0;
    top: 0;
  }
  .row__image {
    width: 56px;
    height: 56px;
    position: relative;
    background: #ffffff;
    border: 1px solid #dce1e6;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #717378;
    cursor: pointer;
    overflow: hidden;
    font-size: 20px;
    font-weight: 400;

    & > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .row__tip {
    display: flex;
    flex-direction: column;
    color: gray;
    align-self: flex-end;
    margin-left: 5px;
    font-size: 12px;
  }
</style>
