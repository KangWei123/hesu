<template>
  <div class="dialog-module">
    <div
      class="dialog-btn"
      :key="dataSource.collapseImage"
      :style="{
        backgroundImage: dataSource.collapseImage ? `url(${dataSource.collapseImage})` : 'dataSource.collapseImage'
      }"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    dataSource: {
      type: Object,
      default: null
    }
  },
  mounted() {
    console.log(this.dataSource);
  }
};
</script>

<style lang="less" scoped>
.dialog-module {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}
.dialog-btn {
  width: 60px;
  height: 60px;
  background-color: #b38a6b;
  background-image: url('~@/dss-wechat3rd/src/images/decorate/shop-guide.png');
  background-size: contain;
  background-position: center;
  border-radius: 50%;
  position: relative;
  right: 10px;
}
</style>
