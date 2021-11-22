<template>
  <div>
    <span>{{ row.activityStartTime | time}} 至 {{ row.activityEndTime | time}}</span>
  </div>
</template>

<script>

export default {
  props: ['row', 'col'],

  data() {
    return {
    };
  }
};
</script>
