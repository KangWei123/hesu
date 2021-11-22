<template>
  <div>
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/retail/goods-mgr/gift-mgr/list'}"
                          replace>赠品列表</el-breadcrumb-item>
      <el-breadcrumb-item>配置门店上下架</el-breadcrumb-item>
    </el-breadcrumb>
    <store-shelf-list-table :type="goodsTypeEnum.gift.value"></store-shelf-list-table>
  </div>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import StoreShelfListTable from './store-shelf-list-table.vue';

export default {
  components: {
    StoreShelfListTable
  },
  data() {
    return {
      goodsTypeEnum
    };
  }
};
</script>