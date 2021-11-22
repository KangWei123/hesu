<template>
  <div class="card-title" :class="{ border: border, 'size-medium': size === 'medium', 'size-small': size === 'small' }">
    <!--右侧slot-->
    <div class="right-frame">
      <slot name="right"></slot>
    </div>
    <!--标题-->
    <h3>
      <slot>{{ text }}</slot>
    </h3>
    <!--提示框-->
    <tip-icon :name="tipName" :placement="tipPlacement" :customer-indicator="customerIndicator" v-if="customerIndicator || tipName"></tip-icon>
  </div>
</template>

<script>
  import './style.less';
  import TipIcon from '../tip-icon';

  export default {
    name: 'CardTitle',
    components: {TipIcon},
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
      },
      // 添加可自定义传入指标说明，无需从配置中获取,优先级低于网络配置
      customerIndicator: {
        type: Object,
        default: function () {
          return null;
        }
      }
    }
  };
</script>
