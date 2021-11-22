<template>
  <div class="condition-label">
    <template v-for="cdn in conditions">
      <div :key="cdn.id" class="condition-symbol" v-if="cdn.type === 'symbol' || cdn.type === 'brackets'">
        {{ cdn.tag.name }}
      </div>
      <div :key="cdn.id" class="condition-item" v-else>
        <span class="title">{{ cdn.tag.name }}</span
        ><span v-if="cdn.strValue && cdn.tag.name">:</span>
        <span :title="cdn.strValue" class="value">{{ cdn.strValue }} </span>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      conditions: {
        type: Array,
        default() {
          return [];
        },
      },
    },
  };
</script>

<style lang="less">
  .condition-label {
    display: inline;

    .condition-item,
    .condition-symbol {
      display: inline-block;
      float: left;
    }

    .condition-item {
      border-radius: 6px;
      color: #333333;
      font-size: 14px;
      padding: 0;
      box-sizing: border-box;
      max-width: 450px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 10px;
    }

    .condition-symbol {
      overflow: hidden;
      padding: 0 5px;
      opacity: 0.6;
      color: #666;
      height: 40px;
      line-height: 40px;
    }
  }
</style>
