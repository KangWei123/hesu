<template>
  <div>
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/retail/goods-mgr/product/parameter'}"
                          replace>参数设置</el-breadcrumb-item>
      <el-breadcrumb-item>{{state}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form v-loading='loading.list' :rules="rules" :model="form" label-width="120px" ref="Form" class="form-wrap">
      <el-form-item label="模板名称:" prop="templateName">
        <el-input
          style="width: 220px"
          placeholder="请输入"
          v-model.trim="form.templateName"
        />
        <span
          class="form-item-tip"
          :class="{ error: form.templateName.length > 20 }"
        >{{ form.templateName.length }}/20</span>
      </el-form-item>
      <!-- 分类 -->
      <el-form-item :label="'可选分类:'" class="goods-label" prop="categoryIds">
        <el-select v-model="form.categoryIds" multiple placeholder="请选择" @change="handleChange">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.category"
            :value="item.id"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 新增参数 -->
      <el-form-item
          label="商品参数:"
          class="goods-label"
          prop="paramList"
          :rules="[{ validator: reg.checkPrameter }]"
        >
        <el-button style="margin-bottom:10px" @click="addParameter">新增参数</el-button>
        <el-table
            style="width:220px"
            class="table-wrap"
            :data="form.paramList"
            v-if="form.paramList && form.paramList.length > 0"
          >
          <el-table-column label="参数名称" width="120" align="center" prop="name">
            <template slot-scope="scope">
              <el-input placeholder="请输入" v-model="scope.row.name" class="middle-width" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <a href="javascript:;" @click="deleteParameter(scope.$index)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      
    </el-form>
    <div class="bottom-button">
      <el-button type="primary" @click="submitForm('Form')" :loading="loading.submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/dss-wechat3rd/src/api/template.js';
import GoodsLabelSelect from '@/dss-wechat3rd/src/bz_components/goods-label-select/index.vue';

export default {
  data() {
    // 组合商品数量校验规则
    const regs = /^[_\-0-9A-Za-z\u4e00-\u9fa5]+$/i;
    const checkPrameter = (rule, value, callback) => {
      if (!value || value.length < 1) {
        return callback('请新增参数');
      } else {
        value.forEach(v => {
          if (!v.name) {
            return callback('请输入参数名称');
          } else if (!regs.test(v.name)) {
            return callback('参数名称支持字母、数字、汉字、-、或 _');
          }
        });
      }
      return callback();
    };
    return {
      rules: {
        templateName: [
          { required: true, message: '请填写模板名称' },
          {
            max: 20,
            message: '模板名称在20字以内'
          }
        ],
        categoryIds: [{ required: true, message: '请选择模板分类', trigger: 'change' }]
      },
      // 行内表单验证规则
      reg: {
        checkPrameter
      },
      form: {
        templateName: '',
        categoryIds: [],
        paramList: []
      },
      categoryList: [],
      loading: {
        list: false,
        cate: false,
        submit: false
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
  methods: {
    getCategoryList() {
      this.loading.cate = true;
      let params = {
        type: 1
      };
      api
        .queryCategoryList(params)
        .then(res => {
          this.categoryList = res.data || [];
        })
        .catch(res => {
          this.$message.error(res.errorMessage);
        })
        .finally(_ => {
          this.loading.cate = false;
        });
    },
    addParameter() {
      this.form.paramList.push({
        name: ''
      });
    },
    deleteParameter(index) {
      this.form.paramList.splice(index, 1);
    },
    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.loading.submit = true;
          let list = this.form.paramList.map(item => item.name);
          let params = {
            templateName: this.form.templateName,
            categoryIdList: this.form.categoryIds,
            paramList: list
          };
          if (this.$route.query.id) {
            params.id = this.$route.query.id;
          }
          api
            .saveParameter(params)
            .then(res => {
              if (!!res && res.data) {
                let tips = this.$route.query.id ? '修改参数模板成功' : '新增参数模板成功';
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
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleChange(ids) {
      this.form.categoryIds = ids;
    },
    initTemplateList() {
      this.loading.list = true;
      api
        .getTemplateListById({ id: this.$route.query.id })
        .then(res => {
          let data = res.data || {};
          this.form.templateName = data.templateName || '';
          this.form.categoryIds = data.categoryList.map(item => item.categoryId);
          data.paramList.forEach(item => {
            this.form.paramList.push({ name: item });
          });
        })
        .finally(_ => {
          this.loading.list = false;
        });
    }
  },
  mounted() {
    //获取分类列表
    this.getCategoryList();
    //编辑时初始化页面数据
    if (this.state == '编辑模板') {
      this.initTemplateList();
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
.form-wrap{
  padding: 50px 60px;
  background: #fff;
}
</style>

