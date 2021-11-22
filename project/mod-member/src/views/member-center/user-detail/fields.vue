<template>
  <div class="fields">
    <div v-for="item of options" :key="item.k" class="field">
      <div class="key" :style="{ width: labelWidth }">{{ item.k }}:</div>
      <!-- 动态渲染 -->
      <div class="value">
        <template v-if="item.render">
          <jsx :item="item" :renderer="item.render"></jsx>
        </template>
        <template v-else>
          {{ item.v }}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import Jsx from '@/dss-common/components/jsx';

  export default {
    name: 'Fields',
    components: { Jsx },
    props: {
      options: {
        /**
         * @type {Array<{k: string, v: any}>}
         */
        type: Array,
        default: () => [],
      },
      labelWidth: {
        type: String,
        default: '5em',
      },
    },
  };
</script>

<style scoped>
  .field {
    display: flex;
    font-size: 14px;
    line-height: 2;
  }
  .key {
    color: #717378;
    flex-shrink: 0;
  }
  .value {
    color: #303133;
  }
</style>
