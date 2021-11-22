<template>
  <div class="coupon-plan-add">
    <el-breadcrumb class="wkt-breadcrumb-container"
                   separator="/">
      <el-breadcrumb-item :to="{ path: `/marketing/coupon/plan`}"
                          replace>
        自动发放设置
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{state}}方案
      </el-breadcrumb-item>
    </el-breadcrumb>
    <scheme-edit />

  </div>
</template>
<script>
import SchemeEdit from './schemeEdit.vue';

export default {
  name: 'index',
  components: {
    SchemeEdit
  },

  data() {
    return {
      couponPlanId: this.$route.query.couponPlanId
    };
  },
  computed: {
    state: function() {
      if (this.$route.query.couponPlanId) {
        return '更新';
      }
      return '新建';
    }
  }
};
</script>
<style lang="less">
@header: 48px; //头部高度
@scroll: 17px; //滚动条高度
@footerHeight: 44px; //footer高度
@titleHeight: 58px; //标题高度
.coupon-plan-add {
  background: #fff;
  margin-bottom: 30px;
  min-height: calc(100vh - @header - @footerHeight - @titleHeight - 10px);
}
.coupon-breadcrumb {
  margin: 10px 20px 20px 20px;
  font-size:12px;
}
</style>
