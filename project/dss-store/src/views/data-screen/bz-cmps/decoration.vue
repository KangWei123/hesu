<template>
  <div>
    <img 
      src="../../../asserts/images/dec-left.png" 
      class="dec-left" 
      v-for="(item) in decoration.left" 
      :key="item"
      :style="{top: item + 'px'}" />
    <img 
      src="../../../asserts/images/dec-right.png" 
      class="dec-right" 
      v-for="(item) in decoration.right" 
      :key="item"
      :style="{top: item + 'px'}" />
  </div>
</template>

<script>
export default {
  props: {
    decoration: {
      type: Object,
      default() {
        return {
          left: [],
          right: []
        }
      }
    }
  }
}
</script>


<style>
.dec-left {
  position: absolute;
  width: 6px;
  left: -6px;
}

.dec-right {
  position: absolute;
  right: -6px;
  width: 6px;
}
</style>
