<template>
  <div class="base-info">
      <div class="base-info-item" v-for="item in config" :key="item.id">
        <el-checkbox
          style="width: 60px;"
          v-model="item.checked"
          :checked="item.checked"
          :disabled="item.id === 'show'">
          {{item.label}}
        </el-checkbox>
        <el-input v-model.trim="item.name" maxlength="6" style="width: 300px" placeholder="修改tab名称"></el-input>
      </div>
  </div>
</template>

<script>
const options = [
  {
    id: 'show',
    label: '晒单',
    name: '',
    checked: true
  },
  {
    id: 'questions',
    label: '问答',
    name: '',
    checked: false
  }
];

export default {
  name: 'buyer-show',
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