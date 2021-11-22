<template>
  <el-dialog title="移动到…" :visible.sync="showPopup" append-to-body class="common-dialog" width="420px">
    <el-form :model="form" ref="form" :rules="rules" class="upload-from" label-width="90px">
      <el-form-item label="位置：" prop="parentId">
        <el-cascader
          expand-trigger="hover"
          :options="options"
          :props="defaultProps"
          change-on-select
          filterable
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import { elderSpaceApi } from '@/mod-kangyang/src/api';
  import materialEnum from '../material-type';
  import { FOLDER_TYPE } from '@/mod-kangyang/src/views/new-picture/constants';

  export default {
    name: 'MoveFolder',
    inject: { moduleType: { default: undefined }, isElderSpace: { default: false } },
    props: {
      // 是否显示弹窗
      visible: {
        type: Boolean,
        default: false,
      },
      idList: {
        type: Array,
        default() {
          return [];
        },
      },
      groupId: {
        type: Number,
        default: null,
      },
    },
    data() {
      return {
        options: [],
        defaultProps: {
          value: 'id',
          label: 'name',
          children: 'subFolderList',
        },
        form: {
          parentId: null,
          materialType: materialEnum.materialType.IMAGE,
        },
        selectedOptions: [],
        rules: {
          parentId: [{ required: true, message: '请选择创建位置', trigger: 'blur' }],
        },
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
      // 选中内容分析
      materialType() {
        const list = this.idList;
        if (!list.length) {
          return 'empty';
        }

        let videos = 0;
        let images = 0;
        let folders = 0;
        let unknown = 0;

        for (const item of list) {
          switch (item.materialType) {
            case materialEnum.materialType.IMAGE:
              images++;
              break;
            case materialEnum.materialType.VIDEO:
              videos++;
              break;
            case materialEnum.materialType.FOLDER:
              folders++;
              break;
            default:
              unknown++;
              break;
          }
        }

        if (videos === list.length) {
          return 'video';
        } else if (images === list.length) {
          return 'image';
        } else if (folders === list.length) {
          return 'folder';
        } else if (images + folders === list.length) {
          return 'image-mixin';
        } else if (videos + folders === list.length) {
          return 'video-mixin';
        }
        return 'mixin';
      },
    },
    mounted() {
      this.form.parentId = this.groupId;
      this.queryTree();
    },

    methods: {
      queryTree() {
        const params = {
          materialType: materialEnum.materialType.IMAGE,
          moduleType: this.moduleType,
        };

        elderSpaceApi
          .queryTree(params)
          .then(res => {
            this.options = res.data || [];
            const selectOptions = [];
            this.filterOptions(this.options, selectOptions);
          })
          .always(res => {});
      },

      // 递归，过滤数组，获取当前选中
      filterOptions(options, selectOptions) {
        options.forEach(item => {
          item.domainId = [].concat(selectOptions);
          item.domainId.push(item.id);

          // 文件夹最多三级
          if (!this.isElderSpace && item.level === 2) {
            item.subFolderList = null;
          }

          // 编辑时不能移动到自己下级，去除下级
          if (this.groupId && item.id === this.groupId) {
            item.subFolderList = null;
          }
          if (item.subFolderList && item.subFolderList.length) {
            this.filterOptions(item.subFolderList, item.domainId);
          } else {
            item.subFolderList = null;
          }

          if (this.isElderSpace) {
            // 批量移动限制
            if (item.folderType === FOLDER_TYPE.FACE_VERIFY_FAIL) {
              item.disabled = true;
            } else if (
              // 图片目录
              (item.folderType === FOLDER_TYPE.ELDER_PIC && this.materialType !== 'image') ||
              // 视频目录
              (item.folderType === FOLDER_TYPE.ELDER_VIDEO && this.materialType !== 'video')
            ) {
              item.disabled = true;
            }
          }
        });
      },

      handleChange() {
        this.form.parentId = this.selectedOptions[this.selectedOptions.length - 1];
      },
      // 关闭弹窗
      handleClose() {
        this.showPopup = false;
      },
      // 确定
      submit() {
        if (this.selectedOptions && this.selectedOptions.length) {
          this.form.parentId = this.selectedOptions[this.selectedOptions.length - 1];
        }
        this.$refs.form.validate(valid => {
          if (valid) {
            const params = {
              folderId: this.form.parentId,
              ids: this.idList.map(item => item.id).join(','),
            };
            elderSpaceApi
              .moveMaterial(params)
              .then(res => {
                this.$emit('submit');
                this.showPopup = false;
              })
              .always(res => {});
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
