<template>
  <div>
    <div class="sqlTip" v-show="result.totalRecord > -1">
      查询用时： 共
      <b>{{ result.took }}</b> 毫秒
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      result: {
        type: Object,
        default() {
          return {
            totalRecord: -1,
          };
        },
      },
    },
    data() {
      return {
        tagAdmin: window.__admin_tags,
      };
    },
    methods: {},
  };
</script>
<style>
  .dmp_table_wrapper {
    margin-bottom: 50px;
  }
</style>
