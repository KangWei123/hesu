<template>
  <div class="couponAdd">
    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/marketing/coupon/coupon-list' }" replace> 优惠券 </el-breadcrumb-item>
      <el-breadcrumb-item> {{ state }}优惠券 </el-breadcrumb-item>
    </el-breadcrumb>
    <coupon-edit-form v-if="couponNo" />
    <coupon-add-form v-else />
  </div>
</template>
<script>
  import couponAddForm from './couponCrete.vue';
  import couponEditForm from './couponEdit.vue';
  import './index.less';

  export default {
    name: 'CouponEdit',
    components: {
      couponEditForm,
      couponAddForm,
    },
    data() {
      return {
        couponNo: this.$route.query.couponNo,
      };
    },
    computed: {
      state: function () {
        const query = this.$route.query;
        if (query.couponNo) {
          return '编辑';
        }
        return '新建';
      },
    },
  };
</script>
<style>
  .couponAdd {
    background: #fff;
    margin-bottom: 30px;
  }

  .coupon-breadcrumb {
    margin: 10px 20px 20px 20px;
    font-size: 12px;
  }
</style>
