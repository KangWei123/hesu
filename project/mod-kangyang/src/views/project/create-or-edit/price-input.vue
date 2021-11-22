<template>
  <div class="price">
    <el-input-number
      :value="value.start"
      :min="0"
      :max="9999999"
      :step="100"
      maxlength="7"
      placeholder="请输入区间"
      @input="handleChange('start', $event)"
    ></el-input-number>
    <span style="margin: 0 10px">-</span>
    <el-input-number
      :value="value.end"
      :min="0"
      :max="9999999"
      :step="100"
      maxlength="7"
      placeholder="请输入区间"
      @input="handleChange('end', $event)"
    ></el-input-number>
  </div>
</template>

<script>
  import emitter from 'element-ui/lib/mixins/emitter';

  export default {
    mixins: [emitter],
    props: {
      value: {
        type: Object,
        default: () => ({
          start: undefined,
          end: undefined,
        }),
      },
    },
    methods: {
      handleChange(index, evt) {
        const value = { ...this.value };
        value[index] = evt;
        this.$emit('input', value);
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      },
    },
  };
</script>

<style scoped>
  .price {
    display: inline-block;
  }
</style>
