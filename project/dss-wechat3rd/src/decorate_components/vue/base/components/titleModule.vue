<template>
  <div class="title-module">
    <div class="title-module-title" :style="itemStyle()">{{ dataSource.title }}</div>
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
    data() {
      return {};
    },
    methods: {
      itemStyle() {
        return {
          'background-color': this.dataSource.backgroundColor,
          'text-align': this.dataSource.textAlign,
          'border-radius': this.dataSource.radius + 'px',
          padding: this.dataSource.margin + 'px ' + '10px',
          margin:
            this.dataSource.marginUp +
            'px ' +
            this.dataSource.marginLeftRight +
            'px' +
            this.dataSource.marginDown +
            'px',
          color: this.dataSource.titleColor,
        };
      },
    },
    mounted() {},
  };
</script>

<style lang="less">
  .title-module {
    .title-module-title {
      font-size: 20px;
      font-family: PingFangSC-Semibold;
      font-weight: 500;
      color: #303133;
      line-height: 30px;

      font-size: 20px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
    }
  }
</style>
