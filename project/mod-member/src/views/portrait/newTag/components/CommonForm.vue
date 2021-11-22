<template>
  <el-form :disabled="!canEdit" :model="commonForm" :rules="rules" label-width="150px" ref="commonForm">
    <!-- 通用 -->
    <!-- 标签类型 -->
    <!-- <el-form-item label="选择标签类型" prop="type">
      <el-radio-group v-model="commonForm.type">
        <el-radio label="商家印象"></el-radio>
        <el-radio label="条件标签"></el-radio>
      </el-radio-group>
    </el-form-item>-->
    <!-- 标签名称 -->
    <el-form-item label="标签名称" prop="name">
      <el-input placeholder="请输入标签名称" style="width: 600px" v-model="commonForm.name"></el-input>
      <!-- <span
        :style="ifOverlength(commonForm.name.length, 20) && 'color: red;'"
      >{{commonForm.name.length}}/20</span>-->
    </el-form-item>
    <!-- 标签描述 -->
    <el-form-item label="标签描述" prop="desc">
      <el-input
        placeholder="请输入标签描述"
        resize="none"
        rows="4"
        type="textarea"
        v-model="commonForm.desc"
      ></el-input>
      <!-- <span
        :style="ifOverlength(commonForm.desc.length, 60) && 'color: red;'"
      >{{commonForm.desc.length}}/60</span>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import api from '@/mod-member/src/api/new-dmp';

  export default {
    name: 'CommonForm',
    inject: ['canEdit', 'formData'],
    props: {
      sourceData: {
        type: Object,
      },
    },
    data() {
      return {
        commonForm: this.formData.commonForm,
        // 规则
        rules: {
          type: [{ required: true, message: '请选择标签类型' }],
          name: [
            {
              pattern: /^[_\-0-9A-Za-z\u4e00-\u9fa5]+$/i,
              message: '标签名称支持字母、数字、汉字、-、或 _',
              trigger: 'change',
            },
            { required: true, message: '请输入标签名称' },
            {
              min: 1,
              max: 20,
              message: '请输入标签名称，长度在 1 到 20 个字符',
              trigger: 'blur',
            },
            { validator: this.validateName, trigger: 'blur' },
          ],
          desc: [
            { required: true, message: '请输入标签描述' },
            {
              min: 1,
              max: 60,
              message: '请输入标签描述，长度不超过 60 个字符',
              trigger: 'blur',
            },
          ],
          catagory: [{ required: true, message: '请选择标签分类' }],
          condition: [{ required: true, message: '请选择打标条件' }],
        },
      };
    },
    mounted() {
      console.log(this.commonForm.type);
    },
    methods: {
      ifOverlength(length, limit) {
        return length > limit;
      },
      onChange() {
        this.$emit('change', {
          ref: this.$refs.commonForm,
          data: this.commonForm,
        });
      },
      // validator
      validateName(rule, val, cb) {
        const errorHandler = data => {
          if ((data.data || {}).exist) cb(new Error('标签重名，请尝试输入其他名称'));
          cb();
        };
        if (this.commonForm.type === '商家印象') {
          api.testImpressionTagExist({ name: this.commonForm.name }).then(errorHandler);
        } else {
          // api
          //   .testAutoLabelExist({ autoLabelValue: this.commonForm.name })
          //   .then(errorHandler)
        }
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
