<template>
  <div class="picture-content">
    <div class="filter-box" v-if="!isRecycle">
      <el-button type="primary" icon="el-icon-upload" @click="handleShowUpload">上传素材</el-button>
      <div class="search-box">
        <el-input
          placeholder="搜索图片或文件夹"
          class="box"
          v-model="filterParams.name"
          clearable
          @keyup.enter.native="getList"
        ></el-input>
        <el-button type="primary" class @click="getList">搜索</el-button>
      </div>
    </div>

    <div class="operation-box">
      <div class="check-box">
        <el-checkbox v-model="checkedAll" @change="handleChange">全选</el-checkbox>
        <span class="delete-button" @click="handleDelete" v-if="idList && idList.length && !isRecycle">删除</span>
        <span class="delete-button" @click="showMove" v-if="idList && idList.length && !isRecycle">移动</span>
        <span class="delete-button" @click="handleClear" v-if="idList && idList.length && isRecycle">清除</span>
      </div>

      <div class="filter-area" v-if="!isRecycle">
        <filter-tool ref="filter" :group-id="groupId" @filter="filter"></filter-tool>
      </div>

      <div class="toolbar-box" v-if="!isRecycle">
        <div
          class="tile-icon"
          :class="iconChecked === showType.tile ? 'icon-checked' : ''"
          @click="checkeIcon(showType.tile)"
        ></div>
        <div
          class="list-icon"
          :class="iconChecked === showType.list ? 'icon-checked' : ''"
          @click="checkeIcon(showType.list)"
        ></div>
      </div>
    </div>

    <div class="content-box" v-loading="loading">
      <el-scrollbar class="table-scrollbar">
        <!-- 平铺 -->
        <div class="picture-list" v-if="iconChecked === showType.tile || iconChecked === showType.screen">
          <image-item
            v-for="(item, index) in tableData"
            :key="index"
            :data="item"
            :is-recycle="isRecycle"
            :id-list="idList"
            :selectable="isSelectable"
            @editorImg="editImg"
            @moveImg="moveImg"
            @deleteImg="deleteImg"
            @handleGroup="handleGroup"
            @click="$emit('click', $event)"
            @revertImg="revertImg"
            @selectImg="selectImg"
            @viewImg="previewImg"
          ></image-item>

          <div class="empty-box" v-if="!tableData || !tableData.length">
            <img src="../../../../images/category/empty-icon.png" alt />
            <div class="empty-text">这里还没有 {{ isElderSpace ? '素材' : '图片' }} 哦～</div>
          </div>
        </div>

        <!-- 列表 -->
        <el-table
          :data="tableData"
          v-if="iconChecked === showType.list"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          stripe
          class="wkt-table"
        >
          <el-table-column type="selection" :selectable="isSelectable" width="55px"></el-table-column>
          <el-table-column label="文件">
            <template slot-scope="scope">
              <div @click="$emit('click', scope.row)">
                <img
                  v-if="scope.row.type === materialEnum.materialType.IMAGE"
                  :src="getCover(scope.row)"
                  class="picture-img"
                />
                <div v-else-if="scope.row.type === materialEnum.materialType.VIDEO" class="video">
                  <img :src="getCover(scope.row)" />
                </div>
                <div class="folder" v-else @dblclick="handleGroup(scope.row)">
                  <img src="../../../../images/category/big-folder.png" />
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="名称">
            <template slot-scope="scope">
              <div v-if="scope.row.type === materialEnum.materialType.IMAGE">{{ scope.row.name }}</div>
              <div v-else-if="scope.row.type === materialEnum.materialType.VIDEO">
                {{ scope.row.name }}
              </div>
              <div v-else>{{ scope.row.name }}</div>
            </template>
          </el-table-column>

          <el-table-column label="文件类型" prop="materialType">
            <template slot-scope="scope">
              <div v-if="scope.row.type === materialEnum.materialType.IMAGE">图片</div>
              <div v-else-if="scope.row.type === materialEnum.materialType.VIDEO">视频</div>
              <div v-else>文件夹</div>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="上传时间"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <template v-if="isSelectable(scope.row)">
                <span
                  class="edit-item"
                  @click="editImg(scope.row)"
                  v-if="scope.row.type === materialEnum.materialType.IMAGE"
                  >编辑</span
                >
                <!-- <span class="edit-item" @click="editorFolder(scope.row)" v-else>编辑</span> -->
                <!-- 移动弹窗 -->
                <el-popover
                  v-if="scope.row.type != materialEnum.materialType.FOLDER"
                  width="160"
                  :visible-arrow="false"
                  popper-class="custom-popper"
                  v-model="scope.row.visiblePopover"
                  trigger="click"
                >
                  <div style="padding: 10px 10px 0 10px">移动到：</div>
                  <category-tree
                    v-if="scope.row.visiblePopover"
                    as-selector
                    width="160px"
                    height="220px"
                    :show-operation="false"
                    :show-all="false"
                    :source-material="scope.row"
                    @nodeClick="moveImg(scope.row, $event.id)"
                  ></category-tree>
                  <span class="edit-item" slot="reference">移动</span>
                </el-popover>
                <span
                  v-if="scope.row.type != materialEnum.materialType.FOLDER"
                  class="delete-item"
                  @click="deleteImg(scope.row)"
                  >删除</span
                >
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>

      <!-- 页码 -->
      <div class="layout-pagination">
        <el-pagination
          v-if="showPagination"
          :current-page.sync="page.pageNo"
          :page-size.sync="page.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
          :total="page.totalCount"
          @current-change="onPageChange"
          @size-change="onSizeChange"
          layout="prev, pager, next, jumper, sizes, total"
        ></el-pagination>
      </div>
    </div>

    <upload-dialog
      :visible.sync="showUploadDialog"
      v-if="showUploadDialog"
      @success="uploadSuccess"
      :group-id="groupId"
    ></upload-dialog>

    <edit-material
      :visible.sync="showMaterial"
      v-if="showMaterial"
      :data="editItem"
      @success="uploadSuccess"
    ></edit-material>

    <add-folder
      :visible.sync="showFolder"
      @submit="folderSuccess"
      v-if="showFolder"
      :show-group="showGroup"
      :is-edit="true"
      :data="editFolder"
    ></add-folder>

    <preview-image :visible.sync="showPreviewImage" v-if="showPreviewImage" :data="previewItem"></preview-image>

    <VideoPlayer
      v-if="showVideo && currentVideoPlayer.url"
      :value="currentVideoPlayer.value"
      :url="currentVideoPlayer.url"
      :original-name="currentVideoPlayer.originalName"
      @closeVideo="closeVideoPlayer"
    />

    <move-folder
      :visible.sync="showMoveFolder"
      v-if="showMoveFolder"
      :id-list="idList"
      :group-id="groupId"
      @submit="handleMove"
    ></move-folder>
  </div>
</template>

<script>
  import imageItem from '../image-item';
  import filterTool from '../filter-tool';
  import uploadDialog from '../upload-dialog';
  import editMaterial from '../dialogs/edit-material';
  import materialEnum from '../material-type';
  import addFolder from '../dialogs/add-folder';
  import { VideoPlayer } from '@/mod-kangyang/ref/components';
  import { elderSpaceApi } from '@/mod-kangyang/src/api';
  import { isEditableFolder, getCover } from '@/mod-kangyang/src/utils';
  import categoryTree from '../category-tree/index.vue';
  import previewImage from '../preview-image/index.vue';
  import moveFolder from '../dialogs/move-folder';

  export default {
    name: 'PictureContent',
    inject: { moduleType: { default: undefined }, isElderSpace: { default: false } },
    components: {
      imageItem,
      filterTool,
      uploadDialog,
      editMaterial,
      addFolder,
      categoryTree,
      previewImage,
      VideoPlayer,
      moveFolder,
    },
    props: {
      // 是否是回收站
      isRecycle: {
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
        filterParams: {
          name: null,
        },
        checkedAll: false,
        page: {
          pageNo: 1,
          pageSize: 20,
          totalCount: 0,
        },
        currentVideoPlayer: {
          value: 0,
          url: '',
          originalName: '',
        },
        showVideo: false,
        loading: false,
        iconChecked: materialEnum.showType.tile,
        showType: materialEnum.showType, // 展示类型枚举
        tableData: [],
        showUploadDialog: false,
        showFolder: false,
        showMaterial: false,
        showGroup: true,
        showPreviewImage: false,
        showMoveFolder: false,
        materialEnum,
        idList: [],
        editItem: null, // 当前编辑素材
        editFolder: null, // 当前编辑文件夹
        previewItem: null, // 当前预览图片
      };
    },

    watch: {
      groupId(val) {
        this.idList = [];
        this.checkedAll = false;
        this.filterParams.keyword = '';
        this.page.pageNo = 1;

        if (this.$refs.filter) {
          const filterParams = this.$refs.filter.reset();
          this.filterParams = { ...this.filterParams, ...filterParams };
        }

        this.getList();
      },
    },

    computed: {
      showPagination() {
        return this.page.pageNo !== 1 || (this.tableData && this.tableData.length);
      },
    },

    mounted() {
      this.getList();
    },

    methods: {
      getCover,
      isSelectable(row) {
        if (this.isElderSpace) {
          // 系统目录不允许删除和移动
          return row.type === materialEnum.materialType.FOLDER ? isEditableFolder(row) : true;
        }

        return true;
      },
      getList() {
        let params = {
          pageSize: this.page.pageSize,
          pageNo: this.page.pageNo,
          status: this.isRecycle ? 0 : 1,
          folderId: this.groupId,
          queryType: materialEnum.queryType.folder,
          moduleType: this.moduleType,
        };

        if (this.isRecycle || this.groupId) {
          params.queryType = materialEnum.queryType.all;
        }

        // 有搜索条件查全部
        if (this.groupId === 0) {
          Object.keys(this.filterParams).forEach(key => {
            if (this.filterParams[key]) {
              params.folderId = null;
              params.queryType = materialEnum.queryType.all;
            }
          });
        }

        params = { ...this.filterParams, ...params };

        this.loading = true;
        let fun = elderSpaceApi.materialList;
        if (this.isRecycle) {
          fun = elderSpaceApi.recycleBinList;
        } else if (this.isElderSpace) {
          fun = elderSpaceApi.elderSpaceList;
        }

        fun(params)
          .then(res => {
            this.tableData = res.data || [];
            this.page.totalCount = res.totalCount;
          })
          .always(res => {
            this.loading = false;
          });
      },

      checkeIcon(type) {
        this.iconChecked = type;
        this.idList = [];
        this.checkedAll = false;
      },

      closeVideoPlayer() {
        this.showVideo = false;
      },

      selectImg(data) {
        // 计算当前选中的值
        if (data.isChecked) {
          this.idList.push(data);
        } else {
          this.idList.splice(
            this.idList.findIndex(item => item.id === data.id),
            1
          );
        }
        this.$emit('getIds', this.idList);
      },

      previewImg(data) {
        if (data.type == materialEnum.materialType.IMAGE) {
          this.previewItem = data;
          this.showPreviewImage = true;
        } else {
          // 视频预览
          this.currentVideoPlayer = {
            value: data.id,
            url: data.cdnUrl || data.localUrl,
            originalName: data.originalName,
          };
          this.showVideo = true;
        }
      },

      uploadSuccess() {
        this.$emit('Refresh');
        this.getList();
      },

      handleChange() {
        // 全选切换选中
        if (this.iconChecked === this.showType.list) {
          this.$refs.multipleTable.toggleAllSelection();
        } else {
          if (this.checkedAll) {
            this.idList = this.$plain(this.tableData.filter(i => this.isSelectable(i)));
          } else {
            this.idList = [];
          }
          this.$emit('getIds', this.Ids);
        }
      },

      deleteImg(data) {
        const isFolder = data.materialType === materialEnum.materialType.FOLDER;
        let msg = '删除文件夹内项目会被放进回收站，7天内可以在回收站还原';
        let title = '是否确定删除所选文件夹？';

        if (!isFolder) {
          msg = '删除图片会被放进回收站，7天内可以在回收站还原';
          title = '是否确定删除所选图片？';
        }

        if (this.isElderSpace) {
          msg = '删除后将无法恢复，确认删除？';
          title = '是否确定删除所选文件?';
        }

        this.$confirm(msg, title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning',
          customClass: 'wkb-confirm',
        }).then(() => {
          const params = {
            ids: data.id,
          };
          elderSpaceApi
            .deleteFolder(params)
            .then(res => {
              this.$message.success('删除成功');
              this.init();
              // 如果是文件夹刷新树状列表
              if (isFolder) {
                this.$emit('Refresh');
              }
            })
            .always(res => {});
        });
      },

      // 移动
      moveImg(data, groupId) {
        const params = { folderId: groupId, ids: data.id };
        elderSpaceApi
          .moveMaterial(params)
          .then(res => {
            this.init();
            if (data.type === materialEnum.materialType.FOLDER) {
              this.$emit('Refresh');
            }
          })
          .always(res => {});
      },

      editImg(row) {
        this.editItem = row;
        this.showMaterial = true;
      },

      editorFolder(row) {
        this.editFolder = row;
        this.showGroup = false;
        this.showFolder = true;
      },

      // 双击文件夹
      handleGroup(data) {
        this.idList = [];
        this.checkedAll = false;
        this.$emit('handleGroup', data);
      },

      // 恢复文件夹
      revertImg(data) {
        const params = {
          id: data.id,
          isFolder: data.materialType === materialEnum.materialType.FOLDER,
        };
        elderSpaceApi
          .revertFolder(params)
          .then(res => {
            this.init();
            // 如果是文件夹刷新树状列表
            if (params.isFolder) {
              this.$emit('Refresh');
            }
            this.$message.success('还原成功！');
          })
          .catch(error => {
            // errorCode 等于 54016 文件夹名称重复
            if (error.code === 54016) {
              this.repetitionFolder(data.id);
            }
          })
          .always(res => {});
      },

      // 修改重名文件夹
      repetitionFolder(id) {
        this.$confirm('文件夹名称重复，请修改重复的文件夹名称后再还原', '是否修改重名文件夹？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning',
          customClass: 'wkb-confirm',
        }).then(() => {
          elderSpaceApi.duplicate({ folderId: id, moduleType: this.moduleType }).then(res => {
            if (res.data) {
              this.editFolder = {
                parentId: res.data.parentId,
                id: res.data.conflictId,
                groupName: res.data.conflictName,
              };
              this.showGroup = true;
              this.showFolder = true;
            }
          });
        });
      },

      folderSuccess() {
        this.$emit('Refresh');
        if (!this.showGroup) {
          this.getList();
        }
      },

      handleSelectionChange(val) {
        this.idList = val;
        this.$emit('getIds', this.idList);
      },

      showMove() {
        this.showMoveFolder = true;
      },

      // 批量清除
      handleClear() {
        this.$confirm('清除的文件不可还原，请谨慎操作', '是否确定清除所选文件', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning',
          customClass: 'wkb-confirm',
        }).then(() => {
          const idList = this.idList.map(item => {
            return {
              id: item.id,
              isFolder: item.materialType === materialEnum.materialType.FOLDER,
            };
          });

          elderSpaceApi
            .clearMaterial(idList)
            .then(res => {
              this.$message.success('清除成功');
              this.init();
              const isFolderList = idList.filter(item => {
                return item.isFolder;
              });
              // 如果包含文件夹刷新树状列表
              if (isFolderList.length) {
                this.$emit('Refresh');
              }
            })
            .always(res => {});
        });
      },

      // 批量移动
      handleMove(idList) {
        const isFolderList = this.idList.filter(item => {
          return item.materialType === materialEnum.materialType.FOLDER;
        });
        // 如果包含文件夹刷新树状列表
        if (isFolderList.length) {
          this.$emit('Refresh');
        }
        this.init();
      },

      // 初始化列表
      init() {
        if (this.page.pageNo > 1 && this.tableData.length === 1) {
          this.page.pageNo--;
        }
        this.checkedAll = false;
        this.idList = [];
        this.getList();
      },

      // 批量删除
      handleDelete() {
        this.$confirm('删除文件会被放进回收站7天内可以在回收站还原', '是否确定删除所选文件', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning',
          customClass: 'wkb-confirm',
        }).then(() => {
          const idList = this.idList.map(item => {
            return {
              id: item.id,
              isFolder: item.materialType === materialEnum.materialType.FOLDER,
            };
          });
          elderSpaceApi
            .deleteMaterial(idList)
            .then(res => {
              this.$message.success('删除成功');
              this.init();
              const isFolderList = idList.filter(item => {
                return item.isFolder;
              });
              // 如果包含文件夹刷新树状列表
              if (isFolderList.length) {
                this.$emit('Refresh');
              }
            })
            .always(res => {});
        });
      },

      filter(filterParams) {
        this.filterParams = { ...this.filterParams, ...filterParams };
        this.page.pageNo = 1;
        this.getList();
      },

      handleShowUpload() {
        this.showUploadDialog = true;
      },

      onPageChange(val) {
        this.page.pageNo = val;
        this.getList();
      },

      onSizeChange(val) {
        this.page.pageSize = val;
        this.page.pageNo = 1;
        this.getList();
      },
    },
  };
</script>

<style lang="less" scoped>
  .picture-content {
    border-left: 1px solid #ebeef5;
    padding: 25px 15px;
    flex: 1;
    max-height: calc(100vh - 155px);

    .search-box /deep/ .el-input__inner {
      width: 220px;
      border: 1px solid #dce1e6;
      border-radius: 2px 0 0 2px;
    }

    /deep/ .el-checkbox__inner {
      border: 1px solid #dce1e6;
    }

    .el-checkbox {
      margin-right: 10px;
    }

    .filter-box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 18px;
    }

    .search-box {
      display: flex;
      justify-content: flex-start;

      /deep/ .el-button {
        border-radius: 0 2px 2px 0;
      }
    }

    .operation-box {
      position: relative;
      display: flex;
      justify-content: space-between;
      line-height: 24px;

      .delete-button {
        box-sizing: border-box;
        margin-left: 5px;
        display: inline-block;
        cursor: pointer;
        text-align: center;
        width: 50px;
        height: 24px;
        line-height: 22px;
        background: #fff;
        border: 1px solid #dce1e6;
        border-radius: 2px;
        font-size: 12px;
        color: #717378;
      }

      .delete-button:hover {
        border: 1px solid rgba(24, 144, 255, 1);
        color: rgba(24, 144, 255, 1);
      }

      .filter-area {
        position: absolute;
        left: 200px;
      }

      .toolbar-box {
        div {
          width: 16px;
          height: 16px;
          display: inline-block;
          vertical-align: middle;
          background-size: contain;
          background-repeat: no-repeat;
          background-color: transparent;
          cursor: pointer;
        }

        .list-icon {
          background-image: url('../../../../images/category/list-icon.png');
        }

        .tile-icon {
          background-image: url('../../../../images/category/tile-icon.png');
        }

        .screen-icon {
          background-image: url('../../../../images/category/screen-icon.png');
        }

        .icon-checked.list-icon {
          background-image: url('../../../../images/category/blue-list-icon.png');
        }

        .icon-checked.tile-icon {
          background-image: url('../../../../images/category/blue-tile-icon.png');
        }

        .icon-checked.screen-icon {
          background-image: url('../../../../images/category/blue-screen-icon.png');
        }
      }
    }

    .content-box {
      margin-top: 25px;

      .table-scrollbar {
        height: 640px;

        /deep/ .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }

      /deep/ .el-table {
        margin-top: 0;

        tr:hover {
          background: #edf6ff !important;

          td {
            background: #edf6ff;
          }
        }
      }

      /deep/ .el-table .el-table__header th {
        background-color: #f5f7fa;
        border-top: none;
      }

      /deep/ .el-table__header th:first-child {
        border-left: none;
      }

      /deep/ .el-table .el-table__header th:nth-last-child(2) {
        border-right: none;
      }

      /deep/ .el-table .el-table__header .cell {
        padding: 10px 15px;
        line-height: 30px;
        color: #717378;
      }

      /deep/ .el-table .cell {
        padding: 10px 15px;
        color: #303133;
      }

      /deep/ .el-table .el-table__empty-block {
        border: none;
        border-bottom: 1px solid #ebeef5;
      }

      /deep/ .el-table--border::after,
      .el-table--group::after,
      .el-table::before {
        content: none;
      }

      /deep/ .el-table .el-table__body tr td {
        border: none;
        border-bottom: 1px solid #ebeef5;
      }

      .folder {
        text-align: center;
        width: 60px;
        height: 60px;
        background: #fff;
        border: 1px solid #ebeef5;
        box-sizing: border-box;
        cursor: pointer;

        img {
          margin-top: 13px;
          width: 32px;
          height: 32px;
          display: inline-block;
        }
      }

      .video {
        position: relative;
        width: 80px;
        height: 60px;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .video::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        background-image: url('../../../../images/play.png');
        width: 30px;
        height: 30px;
        background-size: contain;
        transform: translate(-50%, -50%);
      }

      .picture-img {
        width: 60px;
        height: 60px;
      }

      .edit-item {
        display: inline-block;
        text-align: center;
        cursor: pointer;
        width: 40px;
        height: 24px;
        font-size: 12px;
        color: #2e8dff;
        line-height: 24px;
        background: rgba(46, 141, 255, 0.15);
        border-radius: 2px;
        margin-right: 5px;
      }

      .delete-item {
        display: inline-block;
        text-align: center;
        cursor: pointer;
        width: 40px;
        height: 24px;
        font-size: 12px;
        color: rgba(255, 63, 46, 1);
        line-height: 24px;
        background: rgba(255, 63, 46, 0.15);
        border-radius: 2px;
        margin-right: 5px;
      }

      // 平铺

      .picture-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-top: 25px;

        .empty-box {
          margin: 0 auto;
          width: 195px;
          height: 224px;
          text-align: center;

          img {
            margin-top: 30px;
            width: 107px;
            height: 116px;
          }

          .empty-text {
            margin-top: 20px;
            font-size: 14px;
            color: #757575;
            line-height: 20px;
          }
        }
      }
    }

    .layout-pagination {
      text-align: right;
    }
  }
</style>
