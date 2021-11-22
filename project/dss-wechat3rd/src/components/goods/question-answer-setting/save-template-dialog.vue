<template>
  <el-dialog
    title="保存常见问题模板"
    :visible.sync="visible"
    width="500"
    @close="resetForm('form')">
    <el-form
      ref="form"
      class="form-warp"
      :rules="formRules"
      :model="form">
      <!-- 模板名称 -->
      <el-form-item label="模板名称：" prop="templateName">
        <el-input
          style="width: 200px"
          maxlength="20"
          placeholder="请输入"
          v-model.trim="form.templateName"
        />
      </el-form-item>
      <!-- 模板分类 -->
      <el-form-item label="模板分类：" class="goods-label" prop="categoryId">
        <el-select
          :loading="loading.cate"
          placeholder="请选择"
          clearable
          v-model="form.categoryId"
          @change="onChangeCategoryId">
            <el-option :key="item.id" :label="item.categoryName" :value="item.id" v-for="item in categoryList"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" style="text-align: center;">
        <el-button @click="resetForm('form')">取消</el-button>
        <el-button type="primary" v-loading="loading.submit" @click="onSubmit('form')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '@/dss-wechat3rd/src/api/template.js';

export default {
  name: 'save-template-dialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    commonQa: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    commonQa: {
      immediate: true,
      handler() {
        this.form.qaContentList = this.commonQa || [];
      }
    }
  },
  data() {
    return {
      loading: {
        submit: false,
        form: false,
        cate: false
      },
      categoryList: [],
      form: {
        templateName: '',
        categoryId: '',
        qaContentList: []
      },
      formRules: {
        templateName: [
          { required: true, message: '请填写模板名称' },
          {
            max: 20,
            message: '模板名称在20字以内'
          }
        ],
        categoryId: [{ required: true, message: '请选择模板分类', trigger: 'change' }],
        qaContentList: [{ required: true, message: '问题不能为空', trigger: 'blur' }]
      }
    };
  },
  computed: {
    visible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      }
    }
  },
  mounted() {
    this.getTemCategoryList();
  },
  methods: {
    getTemCategoryList() {
      this.loading.cate = true;
      let params = {
        pageNo: 0,
        pageSize: 0
      };
      return api
        .queryTemCategoryList(params)
        .then(res => {
          this.categoryList = res.data || [];
        })
        .always(_ => {
          this.loading.cate = false;
        });
    },

    saveForm() {
      this.loading.submit = true;
      let params = {
        templateName: this.form.templateName,
        qaContentList: this.form.qaContentList,
        categoryId: this.form.categoryId
      };
      api
        .saveAskTemplate(params)
        .then(res => {
          if (!!res && res.data) {
            this.visible = false;
            this.$message.success('保存问答模板成功');
          }
        })
        .always(() => {
          this.loading.submit = false;
        });
    },

    onChangeCategoryId(id) {
      this.form.categoryId = id;
    },

    onSubmit(formName) {
      if (!this.form.qaContentList.length) {
        this.$message.error('请新增问题 !');
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveForm();
        } else {
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.visible = false;
      this.categoryList = [];
      this.loading = {
        submit: false,
        form: false,
        cate: false
      };
    }
  }
};
</script>

<style lang='less' scoped>
.form-item-tip {
  color: #a8a6a6;
  font-size: 14px;
  &.error {
    color: red;
  }
}
.form-warp{
  padding: 30px 50px;
}
.table-box{
  width: 100%;
  border: 1px solid #f5f7fa;
  .table-header{
    height: 25px;
    background: #f5f7fa;
  }
  /deep/ .el-input{
    width: 550px !important;
  }
}
.item-box{
  padding: 15px 10px;
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #f5f7fa;
}
.item-input{
  display: inline;
}
.form-empty{
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 18px;
  color: #999;
}
.del-btn{
  display: inline;
  line-height: 80px;
  .el-icon-delete{
    font-size: 18px;
    color: #96b9fe;
  }
}
.add-btn{
  margin-bottom: 20px;
}
.save-btn{
  margin-top: 30px;
}
.form-item-tip {
  color: #a8a6a6;
  font-size: 14px;
  &.error {
    color: red;
  }
}
/deep/ .el-form-item__content{
  display: inline-block;
}
</style>