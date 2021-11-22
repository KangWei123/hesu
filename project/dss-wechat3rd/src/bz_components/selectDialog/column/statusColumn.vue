<template>
  <div class="goods-info-column">
    <span v-if='row.status===distcountEnum.ActivityStatus.NOT_STARTED'>未开始</span>
    <span v-if='row.status===distcountEnum.ActivityStatus.ON_GOING'>进行中</span>
  </div>
</template>

<script>
import distcountEnum from '@/dss-wechat3rd/src/constants/distcountEnum.js';
export default {
  name: 'timeStampColumn',
  props: ['row', 'col'],
  data() {
    return {
      distcountEnum
    };
  },
  filters: {}
};
</script>

<style lang="less" scoped>
</style>
