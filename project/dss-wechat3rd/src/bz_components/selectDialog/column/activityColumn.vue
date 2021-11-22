<template>
  <div class="article-type-column">
    <span v-if="row.activityLevel == '1'">品牌活动</span>
    <span v-if="row.activityLevel == '10'">门店活动</span>
  </div>
</template>

<script>
export default {
  name: 'activityColumn',
  props: ['row', 'col'],
  data() {
    return {};
  }
};
</script>
