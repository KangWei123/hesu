<template>
  <div>
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/retail/goods-mgr/shelf/' + pagePath}"
                          replace>门店上架</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <goods-detail-form :goods-type="goodsType"
                       page-type='detail' />
  </div>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import GoodsDetailForm from '@/dss-wechat3rd/src/components/goods/GoodsDetailForm';
export default {
  name: 'index',
  components: {
    GoodsDetailForm
  },
  data() {
    return {
      goodsType: goodsTypeEnum.product
    };
  },
  computed: {
    // 计算属性设置面包屑页面路径
    pagePath() {
      if (this.$route.path.indexOf('combined-shelf') > 0) {
        return 'combined-shelf';
      }
      return 'goods-shelf';
    }
  }
};
</script>

<style lang="less">
</style>
