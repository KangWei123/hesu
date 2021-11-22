<template>
  <div class="container">
    <el-input
      class="num__input"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :value="minVal"
      @input="val => handleInput(val, 'minVal')"
    />
    {{ rangeSeparator }}
    <el-input
      class="num__input"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :value="maxVal"
      :readonly="typeof minVal === 'undefined'"
      @input="val => handleInput(val, 'maxVal')"
    />
  </div>
</template>
<script>
  export default {
    name: 'NumberRange',
    data() {
      return {
        minVal: this.value ? this.value[0] : null,
        maxVal: this.value ? this.value[1] : null,
      };
    },
    props: {
      value: {
        type: Array,
        default() {
          return [];
        },
      },
      rangeSeparator: {
        type: String,
        default: '至',
      },
      placeholder: String,
      maxlength: [String, Number],
      maxNumber: Number,
      precision: {
        type: Number,
        default: 2,
      },
    },
    watch: {
      value(newVal) {
        if (!newVal) {
          this.minVal = null;
          this.maxVal = null;
        } else if (Array.isArray(newVal)) {
          this.minVal = newVal[0] || null;
          this.maxVal = newVal[1] || null;
        }
      },
      minVal(newVal) {
        this.$emit('input', [newVal, this.maxVal]);
      },
      maxVal(newVal) {
        this.$emit('input', [this.minVal, newVal]);
      },
    },
    methods: {
      handleInput(value, type) {
        if (
          !new RegExp(`^[0-9]{0,8}(\\.[0-9]{0,${this.precision}})?$`).test(value) ||
          (this.maxNumber && +value > this.maxNumber)
        ) {
          return;
        }
        this[type] = value;
      },
    },
  };
</script>
<style lang="less" scoped>
  .container {
    display: flex;
  }

  .num__input {
    &:first-child {
      margin-right: 10px;
    }

    &:last-child {
      margin-left: 10px;
    }
  }
</style>
