<template>
  <el-dialog title="上传素材" :visible.sync="showPopup" append-to-body class="common-dialog" width="900px">
    <el-form :model="form" ref="form" :rules="rules" class="upload-from">
      <el-form-item label="上传到：" prop="folderId">
        <el-cascader
          expand-trigger="hover"
          :options="options"
          :props="defaultProps"
          change-on-select
          filterable
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>

        <template v-if="isElderSpace && allowType === 'all'">
          <span class="media-select">
            <el-radio v-model="mediaType" label="image">图片</el-radio>
            <el-radio v-model="mediaType" label="video">视频</el-radio>
          </span>
        </template>
      </el-form-item>

      <template v-if="uploadType === 'image'">
        <uploader
          :options="uploadOptionsImage"
          key="image"
          class="upload-box"
          ref="upload"
          :auto-start="false"
          @file-added="onFileAdded"
          @file-removed="onFileRemoved"
          @file-success="onFileSuccess"
          @upload-start="uploading = true"
          @complete="uploading = false"
        >
          <uploader-unsupport></uploader-unsupport>

          <uploader-drop>
            <uploader-btn :attrs="attrsImage">
              <img src="../../../../images/category/upload.png" alt class="upload-icon" />
            </uploader-btn>

            <div class="el-upload__text">
              将图片或文件夹拖放到此处上传，点击上传
              <uploader-btn :attrs="attrsImage">图片</uploader-btn>或
              <uploader-btn :directory="true">文件夹</uploader-btn>
            </div>

            <div class="el-upload__tip">
              为了保证素材的正常使用，图片仅支持 {{ MAX_IMAGE_SIZE / (1024 * 1024) }} M
              以内png、jpg、gif、jpeg、bmp格式文件上传
            </div>

            <div class="el-upload__text">支持选择多张图片上传，支持拖拽文件夹上传</div>
          </uploader-drop>

          <uploader-list></uploader-list>
        </uploader>
      </template>

      <template v-else>
        <uploader
          :options="uploadOptionsVideo"
          key="video"
          class="upload-box"
          ref="upload"
          :auto-start="false"
          @file-added="onFileAdded"
          @file-removed="onFileRemoved"
          @file-success="onFileSuccess"
          @upload-start="uploading = true"
          @complete="uploading = false"
        >
          <uploader-unsupport></uploader-unsupport>
          <uploader-drop>
            <uploader-btn :attrs="attrsVideo">
              <img src="../../../../images/category/upload.png" alt class="upload-icon" />
            </uploader-btn>
            <div class="el-upload__text">
              将视频或文件夹拖放到此处上传，点击上传
              <uploader-btn :attrs="attrsVideo">视频</uploader-btn>或
              <uploader-btn :directory="true">文件夹</uploader-btn>
            </div>
            <div class="el-upload__tip">
              为了保证素材的正常使用，视频仅支持 {{ MAX_VIDEO_SIZE / (1024 * 1024) }}M 以内 mp4 格式文件上传
            </div>
            <div class="el-upload__text">支持选择多个视频上传，支持拖拽文件夹上传</div>
          </uploader-drop>
          <uploader-list></uploader-list>
        </uploader>
      </template>

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
      <el-button type="primary" @click="submitUpload" :loading="uploading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { elderSpaceApi } from '@/mod-kangyang/src/api';
  import { FOLDER_TYPE, MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from '../../constants';
  import materialEnum, { UploadFileType } from '../material-type';

  import chooseTags from '../choose-tags/index.vue';

  export default {
    name: 'UploadDialog',
    components: {
      chooseTags,
    },
    inject: { moduleType: { default: undefined }, isElderSpace: { default: false } },
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
        uploading: false,
        MAX_IMAGE_SIZE,
        MAX_VIDEO_SIZE,
        uploadOptionsImage: {
          target: '/ky/web/elderSpace/file/upload',
          fileParameterName: 'file',
          testChunks: false,
          chunkSize: MAX_IMAGE_SIZE * 2,
          simultaneousUploads: 20, // 并发上传数
          query: {},
        },
        mediaType: 'image',
        uploadOptionsVideo: {
          target: '/ky/web/elderSpace/file/upload',
          fileParameterName: 'file',
          chunkSize: MAX_VIDEO_SIZE * 2,
          testChunks: false,
          simultaneousUploads: 20, // 并发上传数
          query: {},
        },
        attrsImage: {
          accept: 'image/*',
        },
        attrsVideo: {
          accept: '.mp4',
        },
        count: 0,
        options: [], // 上传位置数据
        defaultProps: {
          value: 'id',
          label: 'name',
          children: 'subFolderList',
        },
        form: {
          folderId: null,
          tagIds: null,
        },
        selectedOptions: [],
        tagList: [],
        fileList: [],
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
      folderInfo() {
        if (this.selectedOptions && this.selectedOptions.length && this.folderCache) {
          return this.folderCache[this.selectedOptions[this.selectedOptions.length - 1]];
        }
      },
      // all, image, video
      allowType() {
        if (!this.folderInfo) {
          return 'image';
        }
        const { type } = this.folderInfo;
        if (type === 4) {
          return 'image';
        } else if (type === 5) {
          return 'video';
        }
        return 'image';
      },
      uploadType() {
        if (!this.folderInfo) {
          return 'image';
        }
        const { type } = this.folderInfo;
        if (type === 4) {
          return 'image';
        } else if (type === 5) {
          return 'video';
        }
        return 'image';
        // return this.folderInfo
        //   ? this.folderInfo.allowType === 'all'
        //     ? this.mediaType
        //     : this.folderInfo.allowType
        //   : 'image';
      },
    },
    mounted() {
      this.folderCache = {};
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
            // 目录处理，便于获取目录信息
            this.options = this.preprocessTree(res.data || []);

            // 默认选中
            if (this.groupId) {
              const info = this.folderCache[this.groupId];
              if (info.disabled) {
                return;
              }

              this.form.folderId = this.groupId;
              const selectOptions = [];
              this.filterOptions(this.options, selectOptions);
            }
          })
          .always(res => {});
      },

      preprocessTree(list) {
        for (const item of list) {
          // 默认只支持图片
          item.allowType = 'image';
          item.allowFolder = true;

          if (this.isElderSpace) {
            // 识别失败目录不允许上传
            if (item.folderType === FOLDER_TYPE.FACE_VERIFY_FAIL) {
              item.disabled = true;
            } else if (item.folderType === FOLDER_TYPE.ELDER_PIC) {
              item.allowType = 'image';
            } else if (item.folderType === FOLDER_TYPE.ELDER_VIDEO) {
              item.allowType = 'video';
            }
          }

          this.folderCache[item.id] = item;

          if (item.subFolderList && item.subFolderList.length) {
            this.preprocessTree(item.subFolderList);
          }
        }
        return list;
      },

      // 递归，过滤数组，获取当前选中
      filterOptions(options, selectOptions) {
        options.forEach(item => {
          item.domainId = [].concat(selectOptions);
          item.domainId.push(item.id);
          // 得到当前选中的节点
          if (item.id === this.groupId) {
            this.selectedOptions = item.domainId;
          }
          if (item.subFolderList && item.subFolderList.length) {
            this.filterOptions(item.subFolderList, item.domainId);
          } else {
            item.subFolderList = null;
          }
        });
      },

      handleChange() {
        this.form.folderId = this.selectedOptions[this.selectedOptions.length - 1];
        this.fileList.forEach(file => {
          this.addQueryParamsToFile(file);
        });
      },
      // 关闭弹窗
      handleClose() {
        this.showPopup = false;
      },

      // 添加文件时
      onFileAdded(file) {
        if (!this.form.folderId) {
          this.$refs.form.validate(valid => {
            if (!valid) {
              file.ignored = true;
            }
          });
          return;
        }
        const max = this.uploadType === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
        if (file.size < max) {
          this.addQueryParamsToFile(file);
          this.fileList.push(file);
        } else {
          this.$message.error(`文件大小不能超过 ${max / (1024 * 1024)} M`);
          file.ignored = true;
        }
      },

      // 移除文件时
      onFileRemoved(file) {
        if (!file.isFolder) {
          const targetIndex = this.fileList.findIndex(item => {
            return item.id === file.id;
          });

          if (targetIndex > -1) {
            this.fileList.splice(targetIndex, 1);
          }
        } else {
          // 如果是文件夹，就删除文件夹下所有文件
          this.fileList = this.fileList.filter(item => !item.isFolder && !item.relativePath.startsWith(file.path));
        }
        if (!this.fileList.length) {
          this.uploading = false;
        }
      },

      // 上传成功时
      onFileSuccess(rootFile, file, response, chunk) {
        this.count++;
        const res = JSON.parse(response);
        console.log(res);
        if (!res.success) {
          this.$message.error(res.msg || res.message);
        }

        // 上传完
        if (this.count === this.fileList.length) {
          this.showPopup = false;
          this.$emit('success');
        }
      },

      // 确定
      submitUpload() {
        if (this.fileList && this.fileList.length && !this.fileList.some(i => !i.completed)) {
          // 已全部上传
          this.handleClose();
          return;
        }

        if (this.selectedOptions && this.selectedOptions.length) {
          this.form.folderId = this.selectedOptions[this.selectedOptions.length - 1];
        }

        const params = {
          folderId: this.form.folderId,
          groupId: this.form.folderId,
          moduleType: this.moduleType,
        };

        if (this.form.tagIds && this.form.tagIds.length) {
          params.tagIds = this.form.tagIds.join(',');
        }

        this.$refs.form.validate(valid => {
          if (valid) {
            if (!this.fileList || !this.fileList.length) {
              return this.$message({
                type: 'error',
                message: `请选择上传的${this.uploadType === 'video' ? '视频' : '图片'}！`,
              });
            }

            this.count = 0;
            this.fileList.forEach(file => {
              this.addQueryParamsToFile(file);
              // 开始上传
              file.resume();
            });
          }
        });
      },

      addQueryParamsToFile(file) {
        const params = {
          folderId: this.form.folderId,
        };
        if (this.form.tagIds && this.form.tagIds.length) {
          params.tagIds = this.form.tagIds.join(',');
        }
        const queryParams = {
          ...params,
          path: file.relativePath,
          name: file.name,
          fileType: this.uploadType === 'video' ? UploadFileType.VIDEO : UploadFileType.IMAGE,
        };

        Object.assign(file.uploader.opts, {
          query: queryParams,
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  @import '../../css/common.less';

  .common-dialog {
    .media-select {
      margin-left: 10px;

      .el-radio {
        margin-right: 10px;
      }
    }

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
          background: #fff;
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
            background: #fff;
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
