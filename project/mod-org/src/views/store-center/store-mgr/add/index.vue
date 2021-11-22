<template>
  <div class="storemgr-edit">
    <store-form class="new-store-form" @colsed="colsed"></store-form>
  </div>
</template>

<script>
  import storeForm from '@/mod-org/src/components/store-form.vue';
  import { mapState } from 'vuex';

  export default {
    components: { storeForm },
    computed: {
      ...mapState({
        curApp: 'curApp',
        storeList: 'storeList',
        env: 'env',
        appFeatures: 'appFeatures',
      }),
      storeLabel() {
        // return this.env.ESTATE ? '区域' : '门店';
        if (this.appFeatures && this.appFeatures.indexOf('zhongjun') > -1) {
          return '商场';
        } else {
          return this.env.ESTATE ? '区域' : '门店';
        }
      },
    },
    methods: {
      colsed() {
        const url = '/companyManage/store-center';
        this.$nextTick(() => {
          this.$router.push({
            path: url,
          });
        });
      },
    },
  };
</script>
