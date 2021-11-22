<template>
  <div v-if="goodsType">
    <goods-manage-bread first-label=""
                        :second-label="goodsType.label + '列表'"
                        :final-label="state + goodsType.label"
                        path-prefix="/beauty/goods-mgr/goods/"
                        :active-goods-type="goodsType"/>
    <card-add-form :show-add-charge="false" :disable-edit="disableEdit"/>
  </div>
</template>

<script>
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import CardAddForm from '@/dss-wechat3rd/src/components/goods/CardAddForm';
  import GoodsManageBread from '@/dss-wechat3rd/src/components/goods/GoodsManageBread';

  export default {
    name: 'index',
    components: {
      GoodsManageBread,
      CardAddForm
    },
    data() {
      return {
        goodsType: goodsTypeEnum.card
      };
    },
    computed: {
      state: function() {
        if (this.$route.query.itemNo) {
          return '更新';
        }
        return '添加';
      },
      disableEdit() {
        return this.$route.query.disableEdit;
      }
    }
  };
</script>

<style lang="less">

</style>
