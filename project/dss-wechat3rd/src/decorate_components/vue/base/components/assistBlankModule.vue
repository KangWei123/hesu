

<style lang="less">
.assist-blank-module{
  &>div {
    width: 100%;
  }
}
</style>

<template>
    <div class="assist-blank-module">
      <div :style="itemStyle()"></div>
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
      return {
        height: this.dataSource.height + 'px',
        backgroundColor: this.dataSource.backgroundColor
      };
    }
  },
  mounted() {
    //console.log(this.dataSource.textAlign);
  }
};
</script>
