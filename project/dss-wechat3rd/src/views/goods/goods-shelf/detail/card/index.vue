<template>
  <div v-if="goodsType">
    <goods-manage-bread first-label="商品上下架"
                        :second-label="goodsType.label + '上下架'"
                        :final-label="goodsType.label + '详情'"
                        :active-goods-type="goodsType"
                        path-prefix="/goods-shelf/list/"/>
    <goods-detail-form :goods-type="goodsType"/>
  </div>
</template>

<script>
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import GoodsDetailForm from '@/dss-wechat3rd/src/components/goods/GoodsDetailForm';
  import GoodsManageBread from '@/dss-wechat3rd/src/components/goods/GoodsManageBread';

  export default {
    name: 'index',
    components: {
      GoodsManageBread,
      GoodsDetailForm
    },
    data() {
      return {
        goodsType: goodsTypeEnum.card
      };
    }
  };
</script>

<style lang="less">

</style>
