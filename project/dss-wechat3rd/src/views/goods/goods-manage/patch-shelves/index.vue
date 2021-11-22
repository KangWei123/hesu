<template>
  <div class="patch-shelves-container">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: goodsListPath }" replace>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>配置门店上下架</el-breadcrumb-item>
    </el-breadcrumb>
    <store-shelf-list-table :type="goodsTypeValue"></store-shelf-list-table>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import goodsTypeEnum from '../../../../constants/goodsTypeEnum';
  import StoreShelfListTable from '@/dss-wechat3rd/src/components/goods/store-shelf-list-table.vue';

  export default {
    name: 'PatchShelf',
    components: {
      StoreShelfListTable,
    },
    data() {
      return {
        goodsTypeEnum,
      };
    },
    computed: {
      ...mapState({
        env: 'env',
      }),
      goodsTypeValue() {
        return `${this.$route.query.type}`; // 获取商品类型type
      },
      goodsListPath() {
        let path = '';
        // 判断是否为美业
        if (this.env.BEAUTIFUL) {
          // 判断商品类型为服务或产品
          path =
            this.goodsTypeValue === goodsTypeEnum.server.value
              ? '/beauty/goods-mgr/goods/server'
              : '/beauty/goods-mgr/goods/product';
        } else if (this.goodsTypeValue === goodsTypeEnum.combinationItem.value) {
          // 判断商品类型是否为组合商品
          path = '/retail/goods-mgr/goods-combined/goods-list';
        } else {
          // 默认为商品类型
          path = '/retail/goods-mgr/product/list';
        }

        return path;
      },
    },
  };
</script>
