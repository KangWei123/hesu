<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>
<script>
/**
 * @param path  such as  /marketing/coupon/coupon-list
 * @returns {*|string}
 */
function getActiveName(path) {
  return path.split('/')[3] || 'coupon-list';
}
export default {
  data() {
    return {
      activeName: getActiveName(this.$route.path)
    };
  },
  watch: {
    '$route.path'(val) {
      this.activeName = getActiveName(val);
    }
  },
  methods: {
    handleCouponClick(tab, event) {
      let sourcePath = this.$route.path;
      let willPath = '/marketing/coupon/' + this.activeName;

      if (sourcePath.indexOf(willPath) === 0) {
        if (this.activeName === 'coupon-list') {
          willPath = '/marketing/coupon/coupon-list';
        }
      }
      this.$router.push(willPath);
    }
  }
};
</script>
