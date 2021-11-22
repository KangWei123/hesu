<template>
  <div class="redpacke-list"
       v-loading="isLoading">
    <div class="wkt-opt-label-container">
      <span>发起人：</span>
      <el-input placeholder="发起人搜索"
                style="width: 220px"
                class="dss-filter-large-input"
                v-model="itemName" />
    </div>
    <div class="redpacke-list-card">
      <record-list :nickname="itemName" />
    </div>
  </div>
</template>

<script>
import recordList from './record-list.vue';
export default {
  name: 'redpacketplan',
  components: { recordList },
  data() {
    return {
      itemName: null,
      isLoading: false
    };
  }
};
</script>
<style lang="less">
.wkt-opt-label-container {
  padding-left: 20px;
}
</style>
