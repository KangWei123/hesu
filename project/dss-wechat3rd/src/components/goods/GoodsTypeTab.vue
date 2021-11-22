<template>
  <el-tabs v-model="goodsType" class="goods-type-tab">
    <el-tab-pane v-for="item in goodsTypes"
                 :label="item.label"
                 :name="item.type">

    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import goodsTypeEnum from '../../constants/goodsTypeEnum';

  export default {
    name: 'GoodsTypeTab',

    model: {
      prop: 'activeGoodsType',
      event: 'input'
    },

    props: {
      //当前选中的服务tab项
      activeGoodsType: {
        type: String,
        default: ''
      },
      hidden: {
        type: Number,
        default: -1
      }
    },

    data() {
      return {
        goodsType: null,
        //所有的商品类型
        goodsTypes: [goodsTypeEnum.server, goodsTypeEnum.card, goodsTypeEnum.product]
      };
    },

    watch: {
      goodsType(newVal, oldVal) {
        if (newVal) {
          this.$emit('input', newVal);
        }
      },
      activeGoodsType(newVal, oldVal) {
        this.goodsType = this.activeGoodsType;
      }
    },
    mounted() {
      this.goodsType = this.activeGoodsType;
      if (this.hidden >= 0 && this.hidden < this.goodsTypes.length) {
        this.goodsTypes.splice(this.hidden, 1);
      }
    }
  };
</script>

<style lang="less">
  .goods-type-tab {
    .el-tabs__header {
      margin: 0 0 8px;
    }

  }
</style>
