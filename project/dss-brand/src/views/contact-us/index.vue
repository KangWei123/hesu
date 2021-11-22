<template>
  <contact-us :jump-link="jumpLink"></contact-us>
</template>
<script>
import contactUs from '@/business-common/components/contact-us/index.vue';
export default {
  components: { contactUs },
  data() {
    return {
      jumpLink: '/klb-detail.html'
    };
  },
  mounted() {
    // 判断是否正确操作进入该页面
    if (!this.$route.query.isAllow || this.$route.query.isAllow != 1) {
      this.$router.replace({ path: '/create/brand' });
    }
  },
  methods: {}
};
</script>

