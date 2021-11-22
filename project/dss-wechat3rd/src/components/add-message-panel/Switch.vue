<template>
  <div class="dss-switch" :class="!checked?'__close':''">
    <label>
      <input type="checkbox" v-model="checkBox" class="__input"/>
      <div class="__box"></div>
    </label>
  </div>
</template>
<style rel="stylesheet/less" lang="less" scoped>
  .dss-switch:after {
    content: " ";
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 100%;
    overflow: hidden;
  }

  .dss-switch {
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    label {
      display: inline-block;
      vertical-align: middle;
    }
    .__input {
      box-sizing: border-box;
      padding: 0;
      position: absolute;
      left: -9999px;
    }
    .__box:before {
      -ms-transform: scale(0);
      transform: scale(0);
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      width: 40px;
      height: 20px;
      border-radius: 15px;
      background-color: #C9C9C9;
      transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
    }
    .__box:after {
      -ms-transform: translateX(20px);
      transform: translateX(20px);
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      border-radius: 15px;
      background-color: #FFFFFF;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
    }
    .__box {
      border-color: #04BE02;
      background-color: #04BE02;
      display: block;
      position: relative;
      width: 42px;
      height: 22px;
      outline: 0;
      border-radius: 16px;
      box-sizing: border-box;
      transition: background-color 0.3s, border 0.3s;
      cursor: pointer;
    }
  }

  .dss-switch.__close {
    .__box {
      border: 1px solid #C9C9C9;
      background-color: #C9C9C9;
    }
    .__box:after {
      -ms-transform: translateX(0px);
      transform: translateX(0px);
    }
    .__box:before {
      -ms-transform: scale(1.1);
      transform: scale(1.1);
    }
  }
</style>
<script>
  export default {
    props: {
      isChecked: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: false,
        checked: !!this.isChecked,
        checkBox: !!this.isChecked
      };
    },
    watch: {
      checkBox(newVal, oldVal) {
        if (!this.loading) {
          this.loading = true;
          this.$emit('toSwitch', newVal);
        }
      }
    },
    methods: {
      markChecked(bool) {
        this.checkBox = this.checked = bool;
        this.$nextTick(() => {
          this.loading = false;
        });
      }
    }
  };
</script>
