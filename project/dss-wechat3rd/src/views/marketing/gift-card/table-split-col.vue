<template>
  <th class="wkb-table-split-th">
    <slot v-if="!!$slots.default"></slot>
    <span v-else>{{label}}</span>
  </th>
</template>

<script>
export default {
  name: 'tabgle-split-col',
  props: {
    label: {
      type: String,
      default: ''
    },
    width: {
      type: String | Number,
      default: ''
    }
  },
  created() {
    console.log(this.width);
  }
};
</script>

<style>

</style>
