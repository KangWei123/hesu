<template>
  <el-form :model="filter">
    <el-form-item label="关键字：">
      <el-input placeholder="关键字搜索"
                style="width: 220px"
                v-model="filter.itemName" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    goodsType: {
      type: Number,
      default: function() {
        return null;
      }
    }
  },
  watch: {
    filter: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.$emit('filter', this.$plain(this.filter));
      }
    }
  },
  data() {
    return {
      filter: {
        itemName: null,
        type: this.goodsType.type
      }
    };
  }
};
</script>

