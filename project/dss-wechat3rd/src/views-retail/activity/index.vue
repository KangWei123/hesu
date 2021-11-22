<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
function getActiveName(path) {
  return path.split('/')[3] || 'list';
}
export default {
  name: 'activity-index',
  watch: {
    '$route.path'(val) {
      getActiveName(val);
    }
  }
};
</script>
