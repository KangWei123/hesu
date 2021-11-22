<template>
  <div class="card-title"
       :class="{ border: border, 'size-medium': size === 'medium', 'size-small': size === 'small' }">
    <!--右侧slot-->
    <div class="right-frame">
      <slot name="right"></slot>
    </div>
    <!--标题-->
    <h3>
      <slot>{{ text }}</slot>
    </h3>
    <!--提示框-->
    <tip-icon :name="tipName" :placement="tipPlacement" v-if="tipName"></tip-icon>
  </div>
</template>

<script>
  import TipIcon from './TipIcon';

  export default {
    name: 'CardTitle',
    components: {
      TipIcon
    },
    props: {
      // 是否显示border
      border: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: 'medium '
      },
      // 标题文本
      text: String,
      // 指标说明
      tipName: null,
      // 指标位置
      tipPlacement: {
        type: String,
        default: 'right-start'
      }
    }
  };
</script>

<style lang="less" scoped>
  .card-title {
    margin-bottom: 18px;
    overflow: hidden;

    &.border {
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(151, 151, 151, .14);
    }

    &.size-small {
      margin-bottom: 8px;

      h3 {
        font-size: 14px;
      }
    }

    &.size-medium {
      h3 {
        font-size: 18px;
      }
    }

    h3 {
      display: inline-block;
      color: #3b4757;
      font-weight: 600;
      letter-spacing: 0;
      margin: 0;
    }

    .right-frame {
      float: right;
    }
  }

  // 弹出框在body下面
  .card-title-tip {
    p {
      margin-top: 5px;
      margin-bottom: 5px;
    }

    .title {
      display: inline-block;
      text-align: right;
    }
  }
</style>
