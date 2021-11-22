<template>
  <el-dialog :title="editTitle" :visible.sync="dialogVisible" append-to-body class="classfiy-add">
    <el-form
      :model="classfiyForm"
      ref="classfiyForm"
      :rules="rules"
      v-loading="loading"
      class="classfiy-add-form"
      label-width="94px"
    >
      <el-form-item label="分类名称：" prop="category" class="classfiy-label">
        <el-input placeholder="请输入分类名称" v-model.trim="classfiyForm.category" class="classfiy-input"></el-input>
      </el-form-item>
      <el-form-item label="分类图标：" class="goods-label" prop="categoryImgUrl">
        <div class="classfiy-image-choose-container">
          <image-selector style="margin-top: 10px; " v-model="classfiyForm.categoryImgUrl" @delete="onDeleteImg" :width="84" :height="84" />
          <div class="img-notes">{{ suggestSize }}</div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit('classfiyForm')">确 认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import classfiyApi from '@/dss-wechat3rd/src/api/retail/goodsMgr/classfiyApi.js';
import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';

export default {
  name: 'goodsClassfiyAdd',
  mixins: [appFeaturesMixin],
  components: { ImageSelector },

  props: {
    //是否显示弹窗
    visible: {
      type: Boolean,
      default: false
    },
    //弹窗标题
    editTitle: {
      type: String,
      default: '添加子分类'
    },
    //编辑的对象
    editObj: {
      type: Object,
      default: function() {
        return null;
      }
    },
    //保存分类关闭弹窗后执行的函数
    onSaveClassfiy: {
      type: Function
    }
  },
  data() {
    return {
      loading: false,
      classfiyForm: {}
    };
  },
  computed: {
    ...mapState({ curApp: 'curApp' }),
    rules() {
      const validCategoryImgUrl = this.editObj && this.editObj.deepth && this.banlan;

      return {
        category: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        // @WARN 需要区分斑兰
        categoryImgUrl: validCategoryImgUrl ? [{ required: true, message: '请上传分类图标' }] : undefined
      };
    },
    banlan() {
      return this.curApp.multiSkuApp;
    },
    //计算属性-是否显示增加弹窗
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    },
    suggestSize() {
      // @WARN 斑兰做区分
      if (this.banlan) {
        return '建议尺寸750*300px';
      }
      // return this.isXiCha ? '建议尺寸750*280px' : '建议尺寸750*300px';
      return this.isXiCha ? '建议尺寸750*280px' : '建议尺寸160*160px';
    }
  },
  mounted() {
    this.getDeatil();
  },

  methods: {
    // 删除图片
    onDeleteImg() {
      this.classfiyForm.categoryImgUrl = null;
    },

    /**
     * 判断当前操作是否有编辑，是则获取编辑的对象详情
     */
    getDeatil() {
      if (this.editObj) {
        this.classfiyForm = {
          category: this.editObj.category,
          categoryImgUrl: {
            imgUrl: this.editObj.categoryImgUrl
          }
        };
      }
    },

    /**
     * 保存分类
     */
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
            type: this.editObj.type
          };
          if (this.classfiyForm.categoryImgUrl) {
            queryparam.categoryImgUrl = this.classfiyForm.categoryImgUrl.imgUrl;
          } else {
            queryparam.categoryImgUrl = '';
          }
          if (!queryparam.categoryImgUrl && this.editObj && this.editObj.deepth && this.banlan) {
            this.$message({ type: 'error', message: '请上传分类图标' });
            return;
          }
          if (this.editObj.isEdit) {
            queryparam.id = this.editObj.id;
          } else {
            queryparam.parentId = this.editObj.id;
          }

          if (this.editObj.isEdit) {
            key = 'update_category';
          }
          classfiyApi[key](queryparam)
            .then(res => {
              this.onSaveClassfiy(res); // 保存分类关闭弹窗后执行的函数
              this.dialogVisible = false;
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
.classfiy-add {
  .el-dialog {
    width: 450px;
  }

  .classfiy-add-form {
    .el-input__inner {
      width: 200px;
      height: 30px;
      line-height: 30px;
    }
    .el-form-item {
      margin-bottom: 15px;
    }
    .img-notes {
      font-size: 12px;
      line-height: 12px;
      color: rgba(153, 153, 153, 1);
      margin-left: 10px;
    }
  }

  .classfiy-image-choose-container {
    .el-dialog {
      width: 50%;
    }
  }

  .classfiy-save {
    padding: 7px 40px;
    border-radius: 15px;
  }

  .classfiy-label {
    .el-input {
      left: -65px;
    }
  }

  .classfiy-image-choose-container {
      position: relative;
      left: -10px;
      display: flex;
      align-items: flex-end;
  }
}
</style>
