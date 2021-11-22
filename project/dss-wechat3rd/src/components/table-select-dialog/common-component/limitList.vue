<template>
  <!--限制条件-->
  <div class="limit-list" style="text-align: left; padding-left: 20px;">
    <span v-for="(item, index) in limitParams"
          :key="index">
      {{item.label}}：{{item.name}}
    </span>
  </div>
</template>

<script>
export default {
  name: 'LimitList',
  props: {
    limitParams: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less">
.limit-list {
  font-size: 13px;
}
</style>
