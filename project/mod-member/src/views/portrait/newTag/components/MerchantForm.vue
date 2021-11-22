<template>
  <el-form :disabled="!canEdit" :model="merchantForm" :rules="merchantFormRules" label-width="150px" ref="merchantForm">
    <!-- 商家印象 -->
    <el-form-item label="标签分类" prop="category" v-loading="loading">
      <el-select placeholder="请选择标签分类" v-model="merchantForm.category">
        <el-option :key="item.value" :label="item.name" :value="item.id" v-for="item in merchantTagOptions"></el-option>
      </el-select>
      <el-button @click="ifMerchantTagCategoryDialogVisible = true" type="text">管理分类</el-button>
    </el-form-item>
    <!-- 管理分类 印象标签分类 对话框 -->
    <MerchantTagDialog
      @change="onSubmitChangeCategory"
      v-if="ifMerchantTagCategoryDialogVisible"
      v-model="ifMerchantTagCategoryDialogVisible"
    ></MerchantTagDialog>
  </el-form>
</template>

<script>
  import MerchantTagDialog from './MerchantTagDialog';
  import api from '@/mod-member/src/api/new-dmp';

  export default {
    name: 'MerchantForm',
    components: { MerchantTagDialog },
    inject: ['canEdit', 'formData'],
    props: {
      sourceData: {
        type: Object,
      },
    },
    data() {
      return {
        merchantForm: this.formData.merchantForm,
        ifMerchantTagCategoryDialogVisible: false,
        merchantFormRules: {
          category: [{ required: true, message: '请选择标签分类', trigger: 'change' }],
        },
        // 商家印象 标签分类选项
        merchantTagOptions: [],
        loading: true,
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      onSubmitChangeCategory() {
        this.merchantForm.category = ''; // 删除分类 清空标签分类值
        this.fetchData();
      },
      // 获取必要数据
      fetchData() {
        api
          .getCategories()
          .then(d => {
            this.merchantTagOptions = d.data;
          })
          .catch(e => {
            this.$message.error(e.errorMessage);
          })
          .finally(_ => {
            this.loading = false;
          });
      },
    },
  };
</script>

<style lang="less" scoped>
  // ! 清除样式冲突
  /deep/ .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
  }
</style>
