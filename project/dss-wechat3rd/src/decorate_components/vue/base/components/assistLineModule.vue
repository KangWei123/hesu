

<style lang="less">
.assist-line-module{
  // margin: 0 15px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;

  .line {
    border-top-width: 1px;
    height: 1px;
    width: 100%;
  }
}
</style>

<template>
    <div class="assist-line-module" >
      <div class="line" :style="itemStyle()"></div>
    </div>
</template>
<script>
export default {
  props: {
    dataSource: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {};
  },
  methods: {
    itemStyle() {
      let margin = 0;
      if (this.dataSource.showMargin == 'true') {
        margin = 15;
      } else {
        margin = 0;
      }
      return {
        borderTopStyle: this.dataSource.style,
        borderTopColor: this.dataSource.lineColor,
        margin: margin + 'px'
      };
    }
  },
  mounted() {
    //console.log(this.dataSource.textAlign);
  }
};
</script>
