<template>
  <io-bound-detail bound-type="out"
                   :bound-no="outboundNo"
                   v-if="outboundNo"></io-bound-detail>
</template>

<script>
import IoBoundDetail from '../../IoBoundDetail.vue';

export default {
  name: 'OutboundDetail',
  components: {
    IoBoundDetail
  },
  data() {
    return {
      outboundNo: this.$route.query.outboundNo
    };
  }
};
</script>

<style scoped>
</style>
