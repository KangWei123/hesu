<template>
  <div class="hamburger-container" @click="toggleClick">
    <wk-icon name="icon-unfold" class="hamburger" :class="{ 'is-active': isActive }" />
  </div>
</template>

<script>
  export default {
    name: 'Hamburger',
    props: {
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      toggleClick() {
        this.$emit('toggleClick');
      },
    },
  };
</script>

<style scoped>
  .hamburger-container {
    display: inline-block;
    padding: 0 10px 0 2px;
  }

  .hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 22px;
    height: 22px;
    transition: transform 0.5s;
  }

  .hamburger.is-active {
    transform: rotate(180deg);
  }
</style>
