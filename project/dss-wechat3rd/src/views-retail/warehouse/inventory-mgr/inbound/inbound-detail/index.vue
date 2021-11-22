<template>
  <io-bound-detail bound-type="in"
                   :bound-no="inboundNo"
                   v-if="inboundNo"></io-bound-detail>
</template>

<script>
import IoBoundDetail from '../../IoBoundDetail.vue';

export default {
  name: 'InboundDetail',
  components: {
    IoBoundDetail
  },
  data() {
    return {
      inboundNo: this.$route.query.inboundNo
    };
  }
};
</script>

<style scoped>
</style>
