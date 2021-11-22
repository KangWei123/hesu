<template>
  <div class="user-info-item">
    <span class="user-info-item__key"><slot name="name" /></span>
    <span class="user-info-item__value"><slot /></span>
  </div>
</template>

<style lang="less" scoped>
  .user-info-item {
    font-size: 14px;
    line-height: 20px;

    &__key {
      color: #717378;
      margin-right: 5px;
    }

    &__value {
      color: #303133;
    }
  }
</style>
