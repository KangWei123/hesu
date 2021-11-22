<template>
  <div class="switch-container">
    <span v-if="!!label" class="switch-label">{{ label }}</span>
    <div :class="{ 'block-switch': true, disabled }" @click="toggle"></div>
    <el-switch
      :width="53"
      :active-color="activeColor"
      :inactive-color="inactiveColor"
      :disabled="disabled"
      :value="current"
    />
    <span class="statusTip show" v-if="current">{{ status[0] }}</span>
    <span class="statusTip hidden" v-else>{{ status[1] }}</span>
  </div>
</template>
<script>
  export default {
    props: {
      label: {
        type: String,
        default: '是否启用：',
      },
      open: {
        type: Boolean,
        default: false,
      },
      status: {
        type: Array,
        default() {
          return ['开启', '关闭'];
        },
      },
      activeColor: {
        type: String,
        default: '#52C41A',
      },
      inactiveColor: {
        type: String,
        default: '#B1B5BD',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      toggle: {
        type: Function,
        default() {},
      },
    },
    watch: {
      open(val) {
        this.current = val;
      },
    },
    data() {
      return {
        current: this.open,
      };
    },
  };
</script>
<style lang="less" scoped>
  .switch-container {
    display: flex;
    align-items: center;
    padding: 0;

    .switch-label {
      color: #717378;
    }

    .statusTip {
      position: relative;
      color: #fff;
      font-size: 12px;

      &.show {
        right: 46px;
      }

      &.hidden {
        right: 32px;
      }
    }

    .block-switch {
      position: absolute;
      top: 0;
      left: 50px;
      width: 100px;
      height: 30px;
      z-index: 2;
      cursor: pointer;

      &.disabled {
        cursor: not-allowed;
      }
    }
  }
</style>
