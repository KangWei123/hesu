<template>
    <div class="pintuan-delete-list">
      <pintuan-activity-list :delete-show="true"></pintuan-activity-list>
    </div>
</template>

<script>
  import PintuanActivityList from './activity/List';
  export default {
    components:{
      PintuanActivityList
    }
  };
</script>

<style lang="less">
</style>
