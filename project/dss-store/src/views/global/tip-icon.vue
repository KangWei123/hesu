<template>
  <el-popover :title="title" trigger="hover" :placement="placement">
    <i class="key-icon icon-tip" slot="reference"></i>
    <div class="tip-icon-content">
      <template>
        <p v-for="(item, index) in customerIndicator" :key="index">
          <span class="title">{{ item.title }}：</span>
          <span class="content">{{ item.text }}</span>
        </p>
      </template>
    </div>
  </el-popover>
</template>

<script>
import './style.less';
export default {
  props: {
    title: {
      type: String,
      default: '指标说明'
    },
    // 指标说明
    name: {
      type: String
    },
    // 指标位置
    placement: {
      type: String,
      default: 'right-start'
    },
    customerIndicator: {
      type: Array,
      default: function() {
        return null;
      }
    }
  },
  computed: {}
};
</script>
