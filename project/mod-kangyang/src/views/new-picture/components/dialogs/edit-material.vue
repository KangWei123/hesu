<template>
  <el-dialog title="修改名称" :visible.sync="showPopup" append-to-body class="common-dialog" width="420px">
    <el-form :model="form" ref="form" :rules="rules" class="upload-from" label-width="90px">
      <el-form-item label="名称：" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入素材名称" clearable :max-length="20"></el-input>
      </el-form-item>

      <el-form-item v-if="!isElderSpace" label="标签：" prop="tagIds">
        <choose-tags
          placeholder="请选择标签，最多添加5个"
          :tag-ids.sync="form.tagIds"
          :multiple-limit="5"
        ></choose-tags>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="processing" :disabled="processing" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { elderSpaceApi } from '@/mod-kangyang/src/api';
  import chooseTags from '../choose-tags/index.vue';

  export default {
    inject: { moduleType: { default: undefined }, isElderSpace: { default: false } },
    components: {
      chooseTags,
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      data: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        form: {
          name: null,
          tagIds: null,
        },
        tagList: [],
        rules: {
          name: [{ required: true, message: '请输入素材名称', trigger: 'blur' }],
        },
        processing: false,
      };
    },
    computed: {
      showPopup: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
    },
    mounted() {
      this.form.id = this.data.id;
      this.form.name = this.data.name;
      this.form.tagIds = (this.data.tagDTOs || []).map(item => {
        return item.id;
      });
    },
    methods: {
      handleClose() {
        this.showPopup = false;
      },
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            const params = this.form;
            this.processing = true;
            elderSpaceApi
              .updateMaterial(params)
              .then(res => {
                this.$emit('success');
                this.$message.success('修改成功');
                this.showPopup = false;
              })
              .always(res => {
                this.processing = false;
              });
          }
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  @import '../../css/common.less';

  .common-dialog {
    .upload-from {
      padding: 0 12px;
      text-align: left;

      .upload-box {
        text-align: center;

        /deep/ .el-upload-dragger {
          width: 836px;
          height: 224px;
          background: #fff;
          border: 1px solid #ebeef5;
          border-radius: 4px;

          .upload-icon {
            margin-top: 30px;
            width: 68px;
            height: 68px;
          }

          .el-upload__text {
            font-size: 14px;
            color: #303133;
            line-height: 20px;
            margin-top: 8px;
          }

          .el-upload__tip {
            font-size: 14px;
            color: #a1a4ab;
            line-height: 20px;
            margin-top: 8px;
          }
        }
      }
    }
  }
</style>
