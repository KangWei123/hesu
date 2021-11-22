<template>
  <div class="h5-setting">
    <!-- 二维码 -->
    <H5QrCode></H5QrCode>
  </div>
</template>

<script>
  import H5QrCode from '@/mod-console/src/components/h5-QrCode';
  import { mapState } from 'vuex';

  export default {
    data() {
      return {};
    },
    components: {
      H5QrCode,
    },
    computed: {
      ...mapState({
        curTemplateId: 'sellerTemplateId',
        curApp: 'curApp',
        userInfo: 'userInfo',
        sellerId: 'sellerId',
        wxAuthInfo: 'wxAuthInfo',
      }),
    },
    methods: {},
  };
</script>

<style lang="less" scoped>
  .h5-setting {
    background: #fff;
    height: 300px;
    padding: 80px 50px;
  }
</style>
