<template>
  <div class="base-info">
      <div class="base-info-item" v-for="item in config" :key="item.id">
        <el-checkbox
          style="width: 60px;"
          v-model="item.checked"
          :checked="item.checked"
          :disabled="item.id === 'detail'">
          {{item.label}}
        </el-checkbox>
        <el-input v-model.trim="item.name" maxlength="6" style="width: 300px" placeholder="修改tab名称"></el-input>
      </div>
  </div>
</template>

<script>
const options = [
  {
    id: 'detail',
    label: '详情',
    name: '',
    checked: true
  },
  {
    id: 'params',
    label: '参数',
    name: '',
    checked: false
  },
  {
    id: 'cp',
    label: 'CP',
    name: '',
    checked: false
  },
  {
    id: 'show',
    label: '晒单',
    name: '',
    checked: false
  }
];

export default {
  name: 'base-info',
  props: {
    config: {
      type: Array,
      default: () => options
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.base-info {
  padding: 20px;

  .base-info-item {
    margin: 20px 0;
  }
}
</style>