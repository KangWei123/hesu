<template>
  <el-tabs class="order-tab" @tab-click="tabClick" :value="value">
    <el-tab-pane
      v-for="item in orderStatusTabs"
      :key="item.label"
      :label="item.label"
      :params="item.params"
      :name="json(item.params)"
      @click="tabClick(item.params)"
    />
  </el-tabs>
</template>

<script>
export default {
  name: 'list-tabs',
  props: {
    params: {
      type: Object
    },
    orderStatusTabs: {
      type: Array
    }
  },
  methods: {
    tabClick(tab) {
      this.$emit('params', tab.$attrs.params);
    },

    json(obj) {
      return JSON.stringify(obj);
    }
  },
  computed: {
    value() {
      return JSON.stringify(this.params);
    }
  }
};
</script>

<style lang="less" scoped>
.order-tab {
  padding: 0 20px;

  /deep/ .el-tabs__nav-wrap {
    &::after {
      height: 0;
    }
  }
}
</style>