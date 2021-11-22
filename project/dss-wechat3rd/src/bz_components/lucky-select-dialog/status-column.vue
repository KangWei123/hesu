
<template>
  <div>
    <div v-if="row.activityStatus===0">未开始</div>
    <!--<div v-if="row.activityStatus===1">引用</div>-->
    <div v-if="row.activityStatus===2">开始未进行</div>
    <div v-if="row.activityStatus===3">进行中</div>
    <!--<div v-if="row.activityStatus===4">已结束</div>-->
  </div>
</template>

<script>
export default {
  props: ['row', 'col'],

  data() {
    return {};
  }
};
</script>
