<template>
  <div class="header">
    <div class="left">
      <img src="../images/home.png" class="home" alt="" />
      <span class="cur-store"> 当前门店：{{ curStore.name }} </span>
    </div>
    <div class="right">
      <span class="btn lock-screen"> 锁屏 </span>
      <span class="btn lock-screen"> 交班 </span>
      <span class="btn lock-screen"> 日结 </span>
      <span class="notice">
        <span class="news">24</span>
      </span>
      <span class="logo">
        <img src="../images/qier.png" width="48" class="qier" />
      </span>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import './header.less';

  export default {
    data() {
      return {
        theCoupon: null,
        coupons: null,
      };
    },
    computed: {
      ...mapState({
        curStore: 'curStore', // 当前门店信息
      }),
    },

    mounted() {
      console.log(this.curStore);
    },

    methods: {},
  };
</script>
