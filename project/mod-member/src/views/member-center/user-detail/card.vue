<template>
  <el-card class="card">
    <template #header>
      <div class="header">
        <div class="title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="$slots.extra" class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <div class="body">
      <slot></slot>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: 'Card',
    props: {
      title: { type: String, default: '' },
    },
  };
</script>

<style scoped>
  .card {
    border-color: #dce1e6;
    border-radius: 8px;
  }

  .card /deep/ .el-card__header {
    padding: 13px 20px;
    border-bottom: 1px solid #dce1e6;
  }

  .header {
    display: flex;
  }

  .title {
    font-size: 16px;
    color: #303133;
    font-weight: 500;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .extra {
    display: flex;
    align-items: center;
  }

  .extra /deep/ .icon {
    cursor: pointer;
  }
</style>
