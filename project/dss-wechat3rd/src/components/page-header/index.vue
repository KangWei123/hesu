<template>
  <div :class="{ 'page-header': true, 'hidden-border': !border }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    border: { type: Boolean, default: () => true }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.page-header {
  background: #fff;
  width: 100%;
  height: 50px;
  padding: 10px 20px;
  border-bottom: 1px solid #dcdee0;
  box-sizing: border-box;
  font-family: PingFangSC-Semibold;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &.hidden-border {
    border: none;
  }
}
</style>
