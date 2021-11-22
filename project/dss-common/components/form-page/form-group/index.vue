<template>
  <div class="form-group">
    <div class="form-group__title"><slot name="title"></slot></div>
    <div class="form-group__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  /**
   * 表单分组
   * @slot title 标题
   * @slot default 表单主体
   */
  export default {
    name: 'FormGroup',
    props: {},
  };
</script>

<style lang="less" scoped>
  .form-group {
    margin-bottom: 20px;

    &__title {
      position: relative;
      padding-left: 14px;
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: 500;
      color: #303133;
      line-height: 22px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 5px;
        height: 24px;
        background: #fa7516;
      }
    }
  }
</style>
