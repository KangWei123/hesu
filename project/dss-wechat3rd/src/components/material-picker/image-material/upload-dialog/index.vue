<template>
  <el-dialog title="上传素材" :visible.sync="showPopup" append-to-body class="common-dialog" width="900px">
    <el-form :model="form" ref="form" :rules="rules" class="upload-from" label-width="56px">
      <el-form-item label="上传到：" prop="folderId" label-width="80px">
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

      <uploader
        :options="uploadOptions"
        class="upload-box"
        ref="upload"
        :auto-start="false"
        @file-added="onFileAdded"
        @file-removed="onFileRemoved"
        @file-success="onFileSuccess"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <uploader-btn :attrs="attrs">
            <img src="../images/upload.png" alt class="upload-icon" />
          </uploader-btn>
          <div class="el-upload__text">
            将图片或文件夹拖放到此处上传，点击上传
            <uploader-btn :attrs="attrs">图片</uploader-btn>或
            <uploader-btn :directory="true">文件夹</uploader-btn>
          </div>
          <div class="el-upload__tip">为了保证素材的正常使用，图片仅支持5M以内png、jpg、gif、jpeg、bmp格式文件上传</div>
          <div class="el-upload__text">支持选择多张图片上传，支持拖拽文件夹上传</div>
        </uploader-drop>
        <uploader-list></uploader-list>
      </uploader>

      <el-form-item label="标签：" prop="tagIds">
        <choose-tags
          placeholder="请选择标签，最多添加5个"
          :tag-ids.sync="form.tagIds"
          :multiple-limit="5"
        ></choose-tags>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitUpload">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import api from '../../new-materials';
  import { FILE_TYPES, FILE_ACCEPT, SIZE_LIMIT } from '../../../../constants/MaterialsConfig';
  import materialEnum from '../material-type';
  import chooseTags from '../choose-tags/index.vue';
  import './index.less';
  export default {
    components: {
      chooseTags,
    },
    props: {
      // 是否显示弹窗
      visible: {
        type: Boolean,
        default: false,
      },
      groupId: {
        type: Number,
        default: null,
      },
    },
    data() {
      return {
        queryParams: {},
        uploadOptions: {
          target: '/wp/material/v2/upload',
          fileParameterName: 'files',
          testChunks: false,
          chunkSize: 1024 * 1024 * 5, // 限制分片大小
          // totalSize: 1024 * 1024 * 2, //2MB
          simultaneousUploads: 20, // 并发上传数
          query: {},
        },
        attrs: {
          accept: 'image/*',
        },
        count: 0,
        options: [], // 上传位置数据
        defaultProps: {
          value: 'id',
          label: 'groupName',
          children: 'childGroup',
        },
        form: {
          folderId: null,
          tagIds: null,
        },
        selectedOptions: [],
        tagList: [],
        fileList: [],
        selectList: [],
        loading: false,
        rules: {
          folderId: [{ required: true, message: '请选择上传位置', trigger: 'change' }],
          // tagIds: [{ required: true, message: '请选择标签', trigger: 'blur' }]
        },
      };
    },
    computed: {
      // 计算属性-是否显示弹窗
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
      this.queryTree();
    },
    methods: {
      queryTree() {
        const params = {
          materialType: materialEnum.materialType.IMAGE,
        };
        api
          .queryTree(params)
          .then(res => {
            this.options = res.data || [];
            if (this.groupId) {
              this.form.folderId = this.groupId;
              const selectOptions = [];
              this.filterOptions(this.options, selectOptions);
            }
          })
          .always(res => {});
      },

      //, 递归，过滤数组，获取当前选中
      filterOptions(options, selectOptions) {
        options.forEach(item => {
          item.domainId = [].concat(selectOptions);
          item.domainId.push(item.id);
          // 得到当前选中的节点
          if (item.id === this.groupId) {
            this.selectedOptions = item.domainId;
          }
          if (item.childGroup && item.childGroup.length) {
            this.filterOptions(item.childGroup, item.domainId);
          } else {
            item.childGroup = null;
          }
        });
      },

      handleChange() {
        this.form.folderId = this.selectedOptions[this.selectedOptions.length - 1];
      },
      // 关闭弹窗
      handleClose() {
        this.showPopup = false;
      },

      // 添加文件时
      onFileAdded(file) {
        const extname = file.getType();
        if (!extname) {
          file.cancel();
          return false;
        } else {
          this.fileList.push(file);
        }
      },

      // 移除文件时
      onFileRemoved(file) {
        if (file.isFolder) {
          this.fileList = this.fileList.filter(item => {
            return item.relativePath.indexOf(file.path) !== 0;
          });
        } else {
          this.fileList.splice(
            this.fileList.findIndex(item => {
              return item.id === file.id;
            }),
            1
          );
        }
      },

      // 上传成功时
      onFileSuccess(rootFile, file, response, chunk) {
        this.count++;
        const res = JSON.parse(response);
        console.log(file, response);
        if (!res.success) {
          this.$message.error(res.errorMessage);
        } else {
          if (res.data && res.data.id) {
            this.selectList.unshift(res.data);
          }
        }
        // 上传完
        if (this.count === this.fileList.length) {
          this.showPopup = false;
          this.$emit('success', this.selectList);
        }
      },

      // 确定
      submitUpload() {
        if (this.selectedOptions && this.selectedOptions.length) {
          this.form.folderId = this.selectedOptions[this.selectedOptions.length - 1];
        }
        const params = {
          folderId: this.form.folderId,
        };
        if (this.form.tagIds && this.form.tagIds.length) {
          params.tagIds = this.form.tagIds.join(',');
        }
        this.$refs.form.validate(valid => {
          if (valid) {
            if (!this.fileList || !this.fileList.length) {
              return this.$message({
                type: 'error',
                message: '请选择上传的图片！',
              });
            }
            const imgType = [];
            const largeImgList = [];
            this.fileList.forEach(item => {
              if (FILE_ACCEPT[FILE_TYPES.IMAGE].indexOf(item.fileType) == -1) {
                imgType.push(item);
              }
              if (item.size / (1024 * 1024) > 5) {
                largeImgList.push(item);
              }
            });
            if (imgType.length) {
              return this.$message({
                type: 'error',
                message: `${imgType[0].name} 不是图片文件！`,
              });
            }
            if (largeImgList.length) {
              return this.$message({
                type: 'error',
                message: `${largeImgList[0].name} 图片不能大于 5M ！`,
              });
            }
            this.count = 0;
            this.fileList.forEach(file => {
              this.queryParams = {
                ...params,
                fullPath: file.relativePath,
                materialType: materialEnum.materialType.IMAGE,
              };
              Object.assign(file.uploader.opts, {
                query: this.queryParams,
              });
              // 开始上传
              file.resume();
            });
          }
        });
      },
    },
  };
</script>
<style lang="less" scoped>
  .common-dialog {
    .upload-from {
      padding: 0 12px;
      text-align: left;
      .upload-box {
        margin-bottom: 20px;
        text-align: center;
        /deep/ .uploader-list {
          max-height: 250px;
          overflow: auto;
          /deep/ .uploader-file {
            border: none;
          }
          /deep/ .uploader-file-resume {
            display: none;
          }
        }
        /deep/ .uploader-drop {
          width: 836px;
          height: 224px;
          background: #ffffff;
          border: 1px solid #ebeef5;
          border-radius: 4px;
          padding: 0;
          .upload-icon {
            margin-top: 30px;
            width: 68px;
            height: 68px;
          }
          .uploader-btn {
            border: none;
            padding: 0;
            color: #409eff;
          }
          .uploader-btn:hover {
            background: #ffffff;
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
