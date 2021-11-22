<template>
  <el-form inline class="filter-form" label-suffix="：">
    <el-form-item>
      <el-input placeholder="请输入订单编号" v-model="form.purchaseOrderNoStr" />
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请输入经销商" v-model="form.dealerName" />
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请输入所属大区" v-model="form.region" />
    </el-form-item>

    <el-form-item>
      <el-input placeholder="请输入所属运营中心" v-model="form.operationCenter" />
    </el-form-item>

    <el-form-item>
      <el-select @change="onFilter" v-model="form.orderStatus">
        <el-option label="全部" :value="null" />
        <el-option label="待确认" :value="0" />
        <el-option label="已确认" :value="1" />
        <el-option label="已取消" :value="2" />
      </el-select>
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
        // dateRange: null,
        purchaseOrderNoStr: null,
        dealerName: null,
        region: null,
        operationCenter: null,
        orderStatus: null
      }
    };
  },
  methods: {
    onFilter() {
      console.log(this.form);
      this.$emit('filter', this.form);
    },
    getFilter() {
      return this.form;
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