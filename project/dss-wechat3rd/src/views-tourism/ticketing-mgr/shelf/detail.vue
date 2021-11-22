<template>
  <div class="detail-container">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/ticketing-mgr/shelf/list' }" replace>
        门店上架
      </el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <goods-detail-form :goods-type="goodsType" page-type="detail" />
  </div>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import GoodsDetailForm from '@/dss-wechat3rd/src/components/goods/GoodsDetailForm';
export default {
  components: {
    GoodsDetailForm
  },
  data() {
    return {
      goodsType: goodsTypeEnum.ticket
    };
  }
};
</script>

<style lang="less">
.detail-container .goods-detail .goods-desc {
  line-height: 40px;
}
</style>
