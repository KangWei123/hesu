<template>
  <div>
    {{row.name}}{{row.attrValCombineName ? '（' + row.attrValCombineName + '）' : ''}}
  </div>
</template>

<script>
export default {
  props: ['row', 'col']
};
</script>
