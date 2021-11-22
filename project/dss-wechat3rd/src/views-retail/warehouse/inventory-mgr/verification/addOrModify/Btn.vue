<template>
  <el-button @click="choose">选择</el-button>
</template>

<script>
export default {
  props: ['row', 'col'],

  methods: {
    choose() {
      this.$emit('choose-item', this.row);
    }
  }
};
</script>

<style scoped>
.product-select-dialog .el-table .el-button {
  width: 60px;
}
</style>

