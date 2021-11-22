<template>
  <!-- 如果key发生更改，Vue 就会知道应该删除旧组件并创建新组件 -->
  <iframe-container :key="$route.path"></iframe-container>
</template>

<script>
  import IframeContainer from '@/mod-member/src/components/iframe-container';
  export default {
    components: {
      IframeContainer,
    },
    data() {
      return {};
    },
  };
</script>

<style lang="less"></style>
