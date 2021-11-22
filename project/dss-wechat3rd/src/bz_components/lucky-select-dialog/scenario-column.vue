
<template>
  <div>
    <!--<div v-if="row.activityScenario===0">首页</div>-->
    <div v-if="row.activityScenario===1">下单有礼</div>
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
