<template>
  <div v-if="goodsType">
    <router-view/>
  </div>
</template>

<script>
  import GoodsTypeTab from '@/dss-wechat3rd/src/components/goods/GoodsTypeTab';
  export default {
    name: 'AddGoods',
    components: {
      GoodsTypeTab
    },
    data() {
      return {
        //选中的商品类型
        goodsType: this.$route.path.replace('/goods-manage/add/', '') || 'server'
      };
    },

    watch: {
      goodsType(newVal, oldVal) {
        if (newVal) {
          this.$router.push(`/goods-manage/add/${newVal}`);
        }
      }
    }
  };
</script>

<style lang="less" scoped>

</style>
