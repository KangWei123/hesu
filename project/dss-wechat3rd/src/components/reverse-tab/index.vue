<template>
  <div class="wkb-reverse-tab">
    <div class="title">{{title}}</div>
    <el-tabs v-model="activeName" @tab-click="handleClick" v-if="!!tabs && tabs.length">
      <el-tab-pane
        v-for="(item ,index) in tabs"
        :key="item.name"
        :label="item.label"
        :name="item.name">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>
  .wkb-reverse-tab {
    position: relative;
  }

  .wkb-reverse-tab .title {
    position: absolute;
    top: 10px;
    left: 20px;
  }

  .wkb-reverse-tab .el-tabs__nav {
    float: right;
  }

  .wkb-reverse-tab .el-tabs__header{
    margin:0;
  }

  .wkb-reverse-tab .el-tabs__nav-wrap::after{
    height: 1px;
  }

</style>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'title'
      },
      defaultTab: {
        type: String,
        default: ''
      },
      tabs: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        activeName: this.defaultTab
      };
    },
    methods: {
      handleClick() {
        this.$emit('change', this.activeName);
      }
    }
};
</script>
