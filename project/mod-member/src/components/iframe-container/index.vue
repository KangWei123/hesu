<template>
  <div v-loading="loading">
    <iframe class="iframe-container" :src="wkbUrl" frameborder="0" id="iframe" height="100%" scrolling="no"></iframe>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: 'IframeContainer',
    data() {
      return {
        wkbUrl: '', // 根据路由配置生成珊瑚页面链接
        loading: false,
      };
    },
    computed: {
      ...mapState({
        shanhuInfo: 'shanhuInfo',
      }),
    },

    watch: {
      shanhuInfo() {
        this.getUrl();
      },
    },
    methods: {
      getUrl() {
        const shanhuInfo = this.shanhuInfo;
        const path = this.$route.path ? this.$route.path.replace('/shanhu', '') : '';
        if (shanhuInfo) {
          this.wkbUrl = this.wkbUrl =
            shanhuInfo.domain +
            '/oauth/authorize?response_type=jwt&appid=1&redirect_url=' +
            encodeURIComponent(shanhuInfo.domain + '?iframe=1' + '&appid=' + shanhuInfo.coralProductId + '#' + path) +
            '&scope=third-app&third_appid=' +
            shanhuInfo.thirdAppId +
            '&third_code=' +
            shanhuInfo.thirdCode +
            '&coral_entid=' +
            shanhuInfo.coralEnterpriseId;
          this.onIframeLoad();
        }
      },
      // iframe加载
      onIframeLoad() {
        const iframe = document.querySelector('#iframe');
        this.loading = true;
        if (iframe.attachEvent) {
          iframe.attachEvent('onload', () => {
            // iframe加载完毕以后执行操作
            this.loading = false;
          });
        } else {
          iframe.onload = () => {
            // iframe加载完毕以后执行操作
            this.loading = false;
          };
        }
      },
    },
    mounted() {
      this.getUrl();
    },
  };
</script>

<style lang="less">
  .iframe-container {
    // margin: 20px;
    width: 100%;
    min-height: calc(~'100vh - 60px');
    transition: width 0.28s;
  }
</style>
