<template>
  <div>
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/retail/goods-mgr/product/question-answer'}"
                          replace>问答模板</el-breadcrumb-item>
      <el-breadcrumb-item>{{state}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form  ref="form"
                class="form-warp"
                :rules="formRules"
                :model="form"
                v-loading='loading.form'>
      <!-- 模板名称 -->
      <el-form-item label="模板名称：" prop="templateName">
        <el-input
          style="width: 195px"
          placeholder="请输入"
          v-model.trim="form.templateName"
        />
        <span
          class="form-item-tip"
          :class="{ error: form.templateName.length > 20 }"
        >{{ form.templateName.length }}/20</span>
      </el-form-item>
      <!-- 模板分类 -->
      <el-form-item label="模板分类：" class="goods-label" prop="templateId">
        <el-select
          :loading="loading.temp"
          placeholder="请选择"
          clearable
          v-model="form.templateId"
          @change="onChangeTemplateId">
            <el-option :key="item.id" :label="item.categoryName" :value="item.id" v-for="item in templateList"></el-option>
        </el-select>
      </el-form-item>
      <!-- 问答 -->
      <el-button v-if="form.askList.length <= 10" @click="addItem" class="add-btn">新增问题</el-button>
      <el-button v-else @click="onWarning"  class="add-btn">新增问题</el-button>
      <div class="table-box">
        <div class="table-header"></div>
        <div v-if="form.askList && form.askList.length">
          <div  v-for="(item, index) in form.askList" :key="index" class="item-box">
            <div class="item-input">
              <el-form-item
                label="问"
                :prop="'askList.' + index + '.q'"
                :rules="[
                  { required: true, message: '问题不能为空', trigger: 'change' },
                  { max: 100, message: '限制在100个字符以内'}
                ]"
              >
                <el-input style="width: 200px" placeholder="请输入" v-model.trim="item.q" />
                <span
                  class="form-item-tip"
                  :class="{ error: item.q.length > 100 }"
                >{{ item.q.length }}/100</span>
              </el-form-item>
              <el-form-item
                label="答"
                :prop="'askList.' + index + '.a'"
                :rules="[
                  { required: true, message: '回答不能为空', trigger: 'change' },
                  { max: 100, message: '限制在100个字符以内'}
                ]"
                >
                <el-input style="width: 200px" placeholder="请输入" v-model.trim="item.a" />
                  <span
                    class="form-item-tip"
                    :class="{ error: item.a.length > 100 }"
                  >{{ item.a.length }}/100</span>
              </el-form-item>
            </div>
            <div class="del-btn">
              <i class="el-icon-delete" @click="deleteItem(item, index)"></i>
            </div>
          </div>
        </div>
        <div v-else class="form-empty">暂无数据</div>
      </div>
    </el-form>
    <div class="bottom-button">
      <el-button type="primary" @click="onSubmit('form')" class="save-btn" v-loading="loading.submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/dss-wechat3rd/src/api/template.js';

export default {
  data() {
    return {
      tableData: [],
      templateList: [],
      formRules: {
        templateName: [
          { required: true, message: '请填写模板名称' },
          {
            max: 20,
            message: '模板名称在20字以内'
          }
        ],
        templateId: [{ required: true, message: '请选择模板分类', trigger: 'change' }],
        askList: [{ required: true, message: '问题不能为空', trigger: 'blur' }]
      },
      loading: {
        submit: false,
        form: false,
        temp: false
      },
      form: {
        templateName: '',
        templateId: '',
        askList: []
      }
    };
  },
  computed: {
    state: function() {
      if (this.$route.query.id) {
        return '编辑模板';
      }
      return '新增模板';
    }
  },
  mounted() {
    this.getTemCategoryList();
    //编辑页面获取初始值
    if (this.state == '编辑模板') {
      this.getAskList();
    }
  },
  methods: {
    onSubmit(formName) {
      if (!this.form.askList.length) {
        this.$message.error('请新增问题 !');
        return;
      }
      this.$refs[formName].validate(valid => {
        console.log('submitForm start ---->', valid);
        if (valid) {
          this.saveForm();
          console.log(this.form, 'form-result------------');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getAskList() {
      this.loading.form = true;
      api
        .getAskTemplateListById({ id: parseFloat(this.$route.query.id) })
        .then(res => {
          let data = res.data || {};
          this.form.templateName = data.templateName || '';
          (this.form.askList = data.qaContentList || []), (this.form.templateId = data.categoryId || '');
        })
        .finally(() => {
          this.loading.form = false;
        });
    },
    saveForm() {
      this.loading.submit = true;
      let params = {
        templateName: this.form.templateName,
        qaContentList: this.form.askList,
        categoryId: this.form.templateId
      };
      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      }
      api
        .saveAskTemplate(params)
        .then(res => {
          if (!!res && res.data) {
            let tips = this.$route.query.id ? '修改问答模板成功' : '新增问答模板成功';
            this.$message.success(tips);
            this.$router.back(-1);
          }
        })
        .catch(err => {
          console.error('saveParameter', err);
        })
        .always(() => {
          this.loading.submit = false;
        });
    },
    getTemCategoryList() {
      this.loading.temp = true;
      let params = {
        pageNo: 0,
        pageSize: 0
      };
      api
        .queryTemCategoryList(params)
        .then(res => {
          this.templateList = res.data || [];
        })
        .catch(res => {
          this.$message.error(res.errorMessage);
        })
        .finally(_ => {
          this.loading.temp = false;
        });
    },
    addItem() {
      this.form.askList.push({
        q: '',
        a: ''
      });
    },
    deleteItem(item, index) {
      this.form.askList.splice(index, 1);
    },
    onChangeTemplateId(id) {
      this.form.templateId = id;
    },
    onWarning() {
      this.$confirm('问答数量限制10个以内', '新增问答模板', {
        confirmButtonText: '确定',
        customClass: 'tips-warning',
        center: true
      }).catch(() => {});
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
  background: #fff;
  padding: 30px 50px;
}
.table-box{
  width: 800px;
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
