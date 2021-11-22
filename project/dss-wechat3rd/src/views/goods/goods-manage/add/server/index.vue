<template>
  <div v-if="goodsType">
    <goods-manage-bread first-label=""
                        :second-label="goodsType.label + '列表'"
                        :final-label="state + goodsType.label"
                        path-prefix="/beauty/goods-mgr/goods/"
                        :active-goods-type="goodsType"/>
    <good-add-form :goods-type="goodsType"
                   :disabled-form="disabledForm"
                   :is-disabled-edit="isDisabledEdit"/>
  </div>
</template>

<script>
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import GoodAddForm from '@/dss-wechat3rd/src/components/goods/GoodEditForm';
  import GoodsManageBread from '@/dss-wechat3rd/src/components/goods/GoodsManageBread';

  export default {
    name: 'index',
    components: {
      GoodsManageBread,
      GoodAddForm
    },
    data() {
      return {
        goodsType: goodsTypeEnum.server
      };
    },
    computed: {
      state: function() {
        if (this.$route.query.itemNo) {
          return '更新';
        }
        return '添加';
      },
      // 是否不允许整个商品
      disabledForm() {
        if (this.$route.query.disabledForm && this.$route.query.disabledForm != 0) {
          return true;
        }
        return false;
      },

      // 是否不允许编辑敏感信息
      isDisabledEdit() {
        if (this.$route.query.isDisabledEdit && this.$route.query.isDisabledEdit != 0) {
          return true;
        }
        return false;
      }
    }
  };
</script>

<style lang="less">

</style>
