<template>
  <el-dialog :title="editTitle"
             :visible.sync="dialogVisible"
             append-to-body
             class="puppet-add"
             center>
    <el-form :model="form"
             ref="form"
             :rules="rules"
             :loading="loading"
             class="puppet-add-form"
             label-width="110px">
      <el-form-item label="马甲昵称："
                    prop="name"
                    class="puppet-label">
        <el-input placeholder="请输入用户昵称"
                  v-model.trim="form.name"
                  class="puppet-input"></el-input>
      </el-form-item>
      <el-form-item label="马甲头像："
                    class="puppet-label"
                    prop="avatarImgUrl">
        <div class="puppet-image-choose-container">
          <image-selector style="margin-top: 10px; "
                          :width='95'
                          :height='70'
                          v-model="form.avatarImgUrl"
                          @delete="onDeleteImg" />
          <div class="img-notes">{{suggestSize}}</div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
                 :loading='loading'
                 @click="onSubmit('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';
import marketArticleApi from '@/dss-wechat3rd/src/api/market-article';

export default {
  name: 'pupetCommentsAdd',
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
      default: '创建新马甲'
    },
    //编辑的对象
    editObj: {
      type: Object,
      default: function() {
        return null;
      }
    },
    //发表评论关闭弹窗后执行的函数
    onSavePuppet: {
      type: Function
    }
  },
  data() {
    return {
      loading: false,
      form: {},
      suggestSize: '建议尺寸800*800像素',
      rules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    //计算属性-是否显示增加弹窗
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  methods: {
    // 删除图片
    onDeleteImg() {
      this.form.avatarImgUrl = null;
    },

    /**
     * 保存账号
     */
    onSubmit(refName) {
      this.$refs[refName]
        .validate()
        .then(valid => {
          if (!valid) {
            return;
          }
          let queryparam = {
            name: this.form.name
          };
          if (this.form.avatarImgUrl) {
            queryparam.avatar = this.form.avatarImgUrl.imgUrl;
          } else {
            queryparam.avatar = '';
          }
          this.loading = true;
          marketArticleApi
            .PuppetAdd(queryparam)
            .then(res => {
              this.onSavePuppet(res); // 发表评论关闭弹窗后执行的函数
            })
            .catch(err => {
              console.error(err);
            })
            .finally(_ => {
              this.loading = false;
            });
        })
        .catch(res => {
          return false;
        });
    }
  }
};
</script>
<style  lang="less">
.puppet-add {
  .el-dialog {
    width: 450px;
  }
  /deep/.el-dialog__title{
    font-size: 17px !important;
    font-weight: 600;
  }

  .puppet-add-form {
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
    }
  }

  .puppet-image-choose-container {
    .el-dialog {
      width: 50%;
    }
  }
}
</style>
