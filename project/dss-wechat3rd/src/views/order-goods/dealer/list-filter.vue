<template>
  <el-form inline class="filter-form">
    <el-form-item>
      <el-input placeholder="请输入经销商编码" v-model="form.dealerNo" />
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请输入经销商名称" v-model="form.dealerName" />
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请输入经销商所属区域" v-model="form.region" />
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请输入经销商手机号" v-model="form.dealerPhone" />
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请输入所属运营中心" v-model="form.operationCenter" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="mini" class="search-btn" @click="onFilter">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        dealerNo: null,
        dealerName: null,
        dealerRegion: null,
        dealerPhone: null,
        operationCenter: null
      }
    };
  },
  methods: {
    onFilter() {
      this.$emit('filter', this.form);
    }
  }
};
</script>

<style lang="less" scoped>
.filter-form {
  padding: 30px 20px 10px 20px;
  background-color: rgb(245, 247, 250);
}
</style>