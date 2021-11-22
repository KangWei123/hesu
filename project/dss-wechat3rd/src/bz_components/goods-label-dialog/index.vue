<template>
  <el-dialog :title="editTitle" style="font-size: 30px;" :visible.sync="showPopup" append-to-body class="label-edit-dialog">
    <el-form :model="form" ref="form" :rules="rules" class="label-form">
      <el-form-item label="标签分类" prop="params.categoryId" v-if="!noCategory">
      <el-select style="width: 280px"
                 placeholder="请选择"
                 size="mini"
                 @change="changLabel"
                 v-model="form.params.categoryId"
                 v-loading="loading.input"
                 clearable>
        <el-option v-for="item in labelList"
                   :key="item.id"
                   :label="item.categoryName"
                   :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
      <el-form-item label="标签名称" prop="params.labelName" class="label-item">
        <el-input v-model.trim="form.params.labelName" placeholder="输入标签名" style="margin-left:-48px; width:220px"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeHandler">取 消</el-button>
      <el-button type="primary" @click="saveLabel('form')" :loading="loading.submit">确 认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';

export default {
  name: 'labelEditDialog',
  props: {
    //是否显示弹窗
    visible: {
      type: Boolean,
      default: false
    },
    //弹窗标题
    editTitle: {
      type: String,
      default: '新建标签'
    },
    //编辑的标签对象
    labelEditObj: {
      type: Object,
      default: function() {
        return null;
      }
    },
    // 兼容历史无标签分类
    noCategory: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labelList: [],
      loading: {
        submit: false,
        input: false
      },
      form: {
        params: {
          labelName: '',
          categoryId: ''
        }
      }
      // rules: {
      //   params: {
      //     categoryId: [{ required: true, message: '请选择标签分类', trigger: 'change' }],
      //     labelName: [
      //       { required: true, message: '请输入标签名称', trigger: 'blur' },
      //       {
      //         min: 1,
      //         max: 8,
      //         message: '长度在 1 到 8 个字符',
      //         trigger: 'blur'
      //       }
      //     ]
      //   }
      // }
    };
  },
  computed: {
    //计算属性-是否显示增加标签弹窗
    showPopup: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    },
    rules() {
      return {
        params: {
          categoryId: [{ required: !this.noCategory, message: '请选择标签分类', trigger: 'change' }],
          labelName: [
            { required: true, message: '请输入标签名称', trigger: 'blur' },
            {
              min: 1,
              max: 8,
              message: '长度在 1 到 8 个字符',
              trigger: 'blur'
            }
          ]
        }
      };
    }
  },
  methods: {
    getCategoryList() {
      this.loading.input = true;
      const url = constants.Api.goods.label.cateList;
      let params = {
        pageNo: 0,
        pageSize: 0
      };
      services
        .get(url, {
          params,
          action: '标签分类列表'
        })
        .then(res => {
          let data = res.data || [];
          data.unshift({ categoryName: '默认分类', id: ' ' });
          this.labelList = data;
        })
        .catch(res => {
          this.$message.error(res.errorMessage);
        })
        .finally(e => {
          this.loading.input = false;
        });
    },
    changLabel(item) {
      this.form.params.categoryId = item;
    },
    //关闭增加标签弹窗
    closeHandler() {
      this.showPopup = false;
    },

    /**
     * 保存增加或修改的标签
     */
    saveLabel(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.loading.submit = true;

          const params = this.labelEditObj.labelId
            ? {
                id: this.labelEditObj.labelId,
                label: this.form.params.labelName,
                categoryId: this.form.params.categoryId
              }
            : {
                type: this.labelEditObj.labelType,
                label: this.form.params.labelName,
                categoryId: this.form.params.categoryId
              };

          const url = this.labelEditObj.labelId ? constants.Api.goods.label.update : constants.Api.goods.label.add;
          services
            .post(url, params, {
              action: this.editTitle
            })
            .done(res => {
              this.showPopup = false; //隐藏增加标签弹框

              //发射事件，通知父组件刷新列表
              const labelData = {
                labelId: res.data,
                labelName: this.form.params.labelName,
                categoryId: this.form.params.categoryId
              };
              this.$emit('refresh-data', labelData);
            })
            .always(() => {
              this.loading.submit = false;
            });
        }
      });
    }
  },
  mounted() {
    //获取标签分类列表
    this.getCategoryList();
    //获取父组件传过来的标签对象
    if (this.labelEditObj.labelName) {
      this.form.params.labelName = this.labelEditObj.labelName;
      this.form.params.categoryId = this.labelEditObj.categoryId;
    }
  }
};
</script>
<style lang="less">
.label-edit-dialog {
  .el-dialog {
    width: 400px;
    font-size: 12px;
    margin-top: 30vh !important;
    .el-dialog__header {
      .el-dialog__title {
        /*font-size: 12px !important;*/
        font-size: 16px !important;;
        font-weight: bold;
      }
    }
    /deep/ .el-input{
      width: 230px;
    }
    /deep/ .el-select{
      width: 230px;
    }
    .el-dialog__body {
      padding: 0px 20px 10px 20px;
      .el-input__inner {
        font-size: 12px !important;
      }
    }
  }
}
</style>
