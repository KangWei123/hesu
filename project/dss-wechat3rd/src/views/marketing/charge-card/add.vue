<template>
  <div style="background: #fff;">
    <el-breadcrumb class="wkt-breadcrumb-container"
                   separator="/">
      <el-breadcrumb-item v-if="!isDiscard"
                          :to="{ path: '/marketing/charge-card/list' }">充值卡</el-breadcrumb-item>
      <el-breadcrumb-item v-else
                          :to="{ path: '/marketing/charge-card/discard' }">废弃充值卡</el-breadcrumb-item>
      <el-breadcrumb-item>{{isEdit ? '充值卡详情' : '新建充值卡'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <charge-add-form @done="handleGoToCardList" />
  </div>
</template>

<script>
import ChargeAddForm from '@/dss-wechat3rd/src/bz_components/charge-card-add-form/index.vue';

export default {
  name: 'ChargeAddIndex',
  components: {
    ChargeAddForm
  },
  data() {
    return {
      isEdit: !!this.$route.query.itemNo,
      isDiscard: !!this.$route.query.isDiscard
    };
  },
  methods: {
    handleGoToCardList() {
      this.$router.push('/marketing/charge-card/list');
    }
  }
};
</script>

<style scoped>
</style>
