
<template>
  <div>
    {{ row | level}}
  </div>
</template>

<script>
export default {
  props: ['row', 'col'],

  data() {
    return {};
  },
  filters: {
    level(row) {
      if (row.memberRestrictType === 2) {
        return '全部';
      }

      if (row.memberRestrictType === 0) {
        return '新人(首次下单)';
      }

      if (row.memberLevelDTOS) {
        return row.memberLevelDTOS.map(item => item.levelName).join(' ');
      }
    }
  }
};
</script>
