<template>
  <div>
    <el-breadcrumb class="wkt-breadcrumb-container"
                   separator="/">
      <el-breadcrumb-item :to="{ path:$route.path.split('/')[1] === 'retail'? '/retail/goods-mgr/classfiy':'/beauty/goods-mgr/classfiy/'+Prefix}"
                          replace>
        分类管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{state}}分类
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="classfiyForm"
             ref="classfiyForm"
             :rules="rules"
             v-loading="loading"
             class="classfiy-form"
             label-width="110px">
      <el-form-item label="分类名称:"
                    prop="category"
                    class="classfiy-label">
        <el-input placeholder="请输入分类名称"
                  v-model.trim="classfiyForm.category"
                  class="classfiy-input"></el-input>
      </el-form-item>
      <el-form-item label="分类图标:"
                    class="goods-label"
                    prop="categoryImgUrl">
        <div class="classfiy-image-choose-container">
          <image-selector style="margin-top: 10px; "
                          v-model="classfiyForm.categoryImgUrl"
                          @delete="onDeleteImg" />
          <div class="img-notes">{{suggestSize}}</div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   round
                   @click="onSubmit('classfiyForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import classfiyApi from '@/dss-wechat3rd/src/api/retail/goodsMgr/classfiyApi.js';
import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';
export default {
  name: 'index',
  mixins: [appFeaturesMixin],
  components: { ImageSelector },
  data() {
    return {
      loading: false,
      Prefix: 'Pm',
      classfiyForm: {},
      rules: {
        category: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
        ]
      }
    };
  },

  computed: {
    state: function() {
      if (this.$route.query.isEdit) {
        this.getDeatil();
        return '修改';
      }
      return '添加';
    },
    suggestSize() {
      return this.isXiCha ? '建议尺寸750*280px' : '建议尺寸160*160px';
    }
  },
  mounted() {
    if (this.$route.query.type === 0) {
      this.Prefix = 'server';
    }
  },
  methods: {
    onDeleteImg() {
      this.classfiyForm.categoryImgUrl = null;
    },

    getDeatil() {
      let row = JSON.parse(this.$route.query.row);
      this.classfiyForm = {
        category: row.category,
        categoryImgUrl: {
          imgUrl: row.categoryImgUrl
        }
      };
    },

    onSubmit(refName) {
      this.$refs[refName]
        .validate()
        .then(valid => {
          if (!valid) {
            return;
          }
          let key = 'add_category';
          let queryparam = {
            category: this.classfiyForm.category,
            type: this.$route.query.type
          };
          if (this.classfiyForm.categoryImgUrl) {
            queryparam.categoryImgUrl = this.classfiyForm.categoryImgUrl.imgUrl;
          }

          if (this.$route.query.isEdit) {
            queryparam.id = this.$route.query.id;
          } else {
            queryparam.parentId = this.$route.query.id;
          }

          if (this.$route.query.isEdit) {
            key = 'update_category';
          }
          classfiyApi[key](queryparam)
            .then(rs => {
              this.$router.back();
            })
            .catch(err => {
              console.error(err);
            })
            .always(() => {});
        })
        .catch(res => {
          return false;
        });
    }
  }
};
</script>
<style  lang="less">
.coupon-breadcrumb {
  margin: 10px 20px 20px 20px;
  font-size: 12px;
}
.classfiy-form {
  padding-top: 20px;
  .classfiy-input {
    width: 200px;
    .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
  }
  .img-notes {
    font-size: 12px;
    line-height: 12px;
    color: rgba(153, 153, 153, 1);
  }
}
</style>
