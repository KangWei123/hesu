<template>
  <el-drawer
    ref="$drawer"
    custom-class="drawer-layout"
    direction="rtl"
    :size="size"
    :show-close="!title"
    :modal="modal"
    :append-to-body="appendToBody"
    :visible.sync="mShowDialog"
  >
    <template #title>
      <div class="title-box">{{ title }}</div>
    </template>
    <div class="drawer-layout__content">
      <slot name="content"></slot>
    </div>
    <div class="drawer-layout__footer">
      <slot name="button"></slot>
    </div>
  </el-drawer>
</template>

<script>
  import dialogMixin from '@/dss-common/mixins/dialog-mixin';

  export default {
    name: 'DrawerLayout',
    mixins: [dialogMixin],
    props: {
      title: {
        type: String,
        default: '',
      },
      size: {
        type: String,
        default: '42%',
      },
      modal: {
        type: Boolean,
        default: true,
      },
      appendToBody: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {};
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .drawer-layout.rtl {
    overflow: hidden;
  }

  /deep/ .el-drawer__body {
    overflow: auto;
  }

  .drawer-layout {
    .title-box {
      position: relative;
      color: #333;
      font-size: 16px;
      padding-left: 12px;
    }

    &__content {
      padding-top: 30px;
      padding-bottom: 20px;
      height: calc(100% - 56px);
      overflow: auto;
    }

    &__footer {
      position: absolute;
      display: flex;
      width: 100%;
      padding-top: 10px;
      height: 56px;
      padding-bottom: 10px;
      justify-content: center;
      background-color: white;
      bottom: 0;
      z-index: 1;

      /deep/ .el-button {
        padding: 10px 36px;
      }

      /deep/ .el-button + .el-button {
        margin-left: 30px;
      }
    }

    .title-box::after {
      position: absolute;
      content: '';
      width: 4px;
      height: 16px;
      background-color: #fa7516;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
