<template>
  <div>
    <template v-if="isDisabled">
      <el-popover placement="left" width="200" trigger="hover" :content="childItem.popTitle">
        <wk-icon v-if="childItem.icon" :name="childItem.icon" slot="reference" class="wk-icon" />
        <span class="title" slot="reference">{{ childItem.name }}</span>
      </el-popover>
    </template>
    <wk-icon v-if="childItem.icon && !isDisabled" :name="childItem.icon" class="wk-icon" />
    <span v-if="!isDisabled" class="title" slot="title">{{ childItem.name }}</span>
  </div>
</template>
<script>
  export default {
    name: 'MenuItem',
    props: {
      opts: {
        type: Object,
        default: () => {},
      },
      childItem: {
        type: Object,
        default: () => {},
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style scoped>
  .sub-el-icon {
    color: currentColor;
    width: 1em;
    height: 1em;
  }

  .wk-icon {
    width: 20px;
    height: 20px;
    margin-right: 16px;
    fill: #b1b5bd;
  }

  .is-active .wk-icon {
    fill: #fa7516;
  }

  .is-active .title {
    font-weight: 500;
  }
</style>
