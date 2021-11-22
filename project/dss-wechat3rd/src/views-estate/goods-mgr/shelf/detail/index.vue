<template>
  <div class="detail-container">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: 'estate/goods-mgr/shelf/list' }" replace>
        门店上架
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <goods-detail-form :goods-type="goodsType" page-type="detail" />
  </div>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import GoodsDetailForm from '@/dss-wechat3rd/src/components/goods/GoodsDetailForm';
export default {
  name: 'detail',
  components: {
    GoodsDetailForm
  },
  data() {
    return {
      goodsType: goodsTypeEnum.estate
    };
  }
};
</script>

<style lang="less">
.detail-container .goods-detail .goods-desc {
  line-height: 40px;
}
</style>
