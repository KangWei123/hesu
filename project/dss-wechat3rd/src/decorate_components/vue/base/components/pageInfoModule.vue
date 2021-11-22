<style lang="less">
  .page-info-module {
    margin-top: 12px;
    width: 100%;
    font-weight: 600;
    font-size: 17px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
</style>

<template>
  <div class="page-info-module" :style="itemStyle()">
    {{ dataSource.name }}
  </div>
</template>
<script>
  export default {
    props: {
      dataSource: {
        type: Object,
        default: {},
      },
    },
    methods: {
      itemStyle() {
        return {
          bgColor: this.dataSource.bgColor,
        };
      },
    },
    mounted() {},
  };
</script>
