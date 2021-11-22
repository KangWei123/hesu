

<template>
  <span @click="switchFull">
    <slot></slot>
  </span>
</template>

<script>
export default {
  data() {
    return {
      isFull: false
    };
  },
  methods: {
    switchFull() {
      if (this.isFull) {
        this.exitScreen();
      } else {
        this.fullScreen();
      }
    },
    fullScreen() {
      const el = document.documentElement;
      const rfs =
        el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(el);
        this.isFull = true;
      }
    },
    exitScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.isFull = false;
    }
  }
};
</script>

<style lang="less" scoped>
.btn {
  width: 100%;
  height: 100%;
}
</style>
