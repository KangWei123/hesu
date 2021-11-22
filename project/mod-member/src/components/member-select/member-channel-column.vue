<template>
  <el-tooltip effect="light" :content="row.channelName" placement="top">
    <span class="channel">
      {{ row.channelName }}
    </span>
  </el-tooltip>
</template>

<script>
  export default {
    props: ['row', 'col'],
  };
</script>

<style lang="less" scoped>
  .channel {
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }
</style>
