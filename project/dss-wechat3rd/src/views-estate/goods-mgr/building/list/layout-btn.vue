<template>
  <a href="javascript:;" slot="reference" @click="setLayout()">户型设置</a>
</template>

<script>
export default {
  name: 'layout-btn',
  props: ['row', 'col', 'itemData'],
  methods: {
    setLayout() {
      this.$router.push({
        path: '/estate/goods-mgr/building/list/layout/list',
        query: { estateItemNo: this.itemData.itemNo }
      });
    }
  }
};
</script>

<style scoped></style>
