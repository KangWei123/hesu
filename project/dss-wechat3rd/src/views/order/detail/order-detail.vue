<template>
  <div class="order-detail-wrap">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: breadcrumbPath }" replace>{{ breadcrumbPathName }}</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <order-detail></order-detail>
  </div>
</template>

<script>
import orderDetail from '@/dss-wechat3rd/src/bz_components/order-detail/index.vue';

export default {
  components: {
    orderDetail
  },
  data() {
    return {
      breadcrumbPath: '/order/list', // 面包屑路径
      breadcrumbPathName: '/order/list' // 面包屑路径名称
    };
  },

  props: {
    marketingType: {
      type: [Object, Array],
      default() {
        return {};
      }
    }
  },

  mounted() {
    const currentPath = this.$route.path || null;
    if (currentPath === '/order/list/detail') {
      this.breadcrumbPath = '/order/list';
      this.breadcrumbPathName = '订单列表';
    } else if (currentPath === '/storedVal/list/detail') {
      this.breadcrumbPath = '/storedVal/list';
      this.breadcrumbPathName = '储值列表';
    } else if (currentPath === '/giftCard/list/detail') {
      this.breadcrumbPath = '/giftCard/list';
      this.breadcrumbPathName = '礼品卡列表';
    } else if (currentPath === '/offline/list/detail') {
      this.breadcrumbPath = '/offline/list';
      this.breadcrumbPathName = '线下订单';
    } else if (currentPath === '/estate/order-mgr/detail') {
      this.breadcrumbPath = '/estate/order-mgr/list';
      this.breadcrumbPathName = '订单列表';
    } else if (currentPath === '/marketing/seckill/management/detail') {
      this.breadcrumbPath = '/marketing/seckill/management/list';
      this.breadcrumbPathName = '秒杀订单';
    } else if (currentPath === '/card-pack/list/detail') {
      this.breadcrumbPath = '/card-pack/list';
      this.breadcrumbPathName = '代金卡包列表';
    } else if (currentPath === '/marketing/discount/manage/detail') {
      this.breadcrumbPath = '/marketing/discount/manage/list';
      this.breadcrumbPathName = '活动订单';
    } else if (currentPath === '/marketing/full-reduction/manage/detail') {
      this.breadcrumbPath = '/marketing/full-reduction/manage/list';
      this.breadcrumbPathName = '活动订单';
    } else if (currentPath === '/marketing/mouthful/manage/detail') {
      this.breadcrumbPath = '/marketing/mouthful/manage/list';
      this.breadcrumbPathName = '活动订单';
    }
  }
};
</script>
