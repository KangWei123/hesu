<template>
  <el-dialog :visible.sync="showPopup" append-to-body class="image-dialog" width="950px" :close-on-click-modal="false">
    <div slot="title">
      <span class="title">选择图片</span>
      <span class="title-tip">（格式为jpg、png、gif 的图片）</span>
      <span class="error" v-if="limit > 0 && idList.length > limit">最多选择{{ limit }}张图片</span>
    </div>
    <div class="flex-box">
      <category-tree
        height="450px"
        width="200px"
        @nodeClick="handleNodeClick"
        ref="tree"
        :default-key="groupId"
      ></category-tree>
      <div class="picture-content" @mouseup="mouseup" @mousedown="mousedown">
        <div class="filter-box">
          <div class="search-box">
            <el-input
              ref="input"
              placeholder="搜索图片或文件夹"
              class="box"
              v-model="filterParams.keyword"
              clearable
              @input="reLoad"
              @keyup.enter.native="reLoad"
            ></el-input>
            <el-button type="primary" class @click="reLoad" style="margin-right: 8px">搜索</el-button>
            <choose-tags select-width="220px" :tag-ids.sync="filterParams.tagIds" :multiple-limit="5"></choose-tags>
          </div>

          <el-button type="primary" icon="el-icon-upload" @click="handleShowUpload">上传素材</el-button>
        </div>
        <div class="picture-list" v-loading="loading" @scroll="handleScroll" ref="imgPickArea">
          <image-item
            v-for="(item, index) in tableData"
            :key="index"
            :data="item"
            @handleGroup="handleGroup"
            :id-list="idList"
            @selectImg="selectImg"
            @mouseenter="mouseenter"
          ></image-item>
          <div class="empty-box" v-if="!tableData || !tableData.length">
            <img src="./images/empty-icon.png" alt />
            <div class="empty-text">这里还没有图片哦～</div>
          </div>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <div class="dialog_ft_desc">已选 {{ idList.length }} 个</div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
    <upload-dialog
      :visible.sync="showUploadDialog"
      v-if="showUploadDialog"
      @success="uploadSuccess"
      :group-id="groupId"
    ></upload-dialog>
  </el-dialog>
</template>
<script>
  import api from '../new-materials';
  import materialEnum from './material-type';
  import chooseTags from './choose-tags/index.vue';
  import categoryTree from './category-tree/index.vue';
  import imageItem from './image-item/index.vue';
  import uploadDialog from './upload-dialog/index.vue';
  import './index.less';

  export default {
    components: {
      categoryTree,
      chooseTags,
      imageItem,
      uploadDialog,
    },
    props: {
      // 是否显示弹窗
      visible: {
        type: Boolean,
        default: false,
      },
      // 多选
      multiple: {
        type: Boolean,
        default: false,
      },
      // 素材来源是否 微信素材库，否则只存本地素材
      isWxSource: {
        type: Boolean,
        default: false,
      },
      limit: {
        type: Number,
        default: 5,
      },
    },
    data() {
      return {
        filterParams: {
          keyword: null,
          tagIds: null,
        },
        page: {
          pageNo: 1,
          pageSize: 20,
          totalCount: 0,
        },
        tableData: [],
        groupId: 0,
        tagList: [],
        idList: [],
        loading: false,
        showUploadDialog: false,
        openDrag: false,
        interval: {
          min: null,
          max: null,
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
    watch: {
      'filterParams.tagIds': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          this.getList();
        },
      },
    },
    mounted() {
      this.getList();
    },
    methods: {
      reLoad() {
        this.$refs.imgPickArea.scrollTop = 0;
        this.page.pageNo = 1;
        this.getList();
      },

      // 鼠标按下事件，开启拖动选择
      mousedown() {
        console.log('mousedown');
        this.openDrag = true;
      },

      // 鼠标移动获取元素位置，计算选择索引
      mouseenter(id) {
        if (this.openDrag && this.multiple) {
          const index = this.tableData.findIndex(item => item.id === id);
          if (index > -1) {
            if (this.interval.min == null) {
              this.interval.min = index;
            } else {
              this.interval.max = index;
            }
          }
        }
      },
      // 鼠标松开事件，关闭拖动选择，计算选择图片
      mouseup() {
        console.log('mouseup', this.interval.min, this.interval.max);
        if (this.openDrag && this.interval.max !== null && this.interval.min !== null) {
          if (this.interval.max > this.interval.min) {
            this.idList = this.tableData.slice(this.interval.min, this.interval.max + 1);
          } else {
            this.idList = this.tableData.slice(this.interval.max, this.interval.min + 1);
          }
        }
        this.openDrag = false;
        // 失焦，去除蓝色拖影
        this.$refs.input.focus();
        this.interval = {
          min: null,
          max: null,
        };
      },

      getList() {
        let params = {
          pageSize: this.page.pageSize,
          pageNo: this.page.pageNo,
          status: 1,
          groupId: this.groupId ? this.groupId : null,
          queryType: materialEnum.queryType.material,
        };
        params = { ...this.filterParams, ...params };
        if (this.filterParams.tagIds) {
          params.tagIds = this.filterParams.tagIds.join(',');
        }

        this.loading = true;
        api
          .materialList(params)
          .then(res => {
            const data = res.data || [];
            this.page.totalCount = res.totalCount;
            // 不是第一页合并数组
            if (this.page.pageNo === 1) {
              this.tableData = data;
            } else {
              this.tableData = this.tableData.concat(data);
            }
          })
          .always(res => {
            this.loading = false;
          });
      },

      // 滚动时间
      handleScroll() {
        // 所有数据据加载完成
        if (this.tableData.length >= this.page.totalCount || this.loading) {
          return;
        }
        const scrollHeight = this.$refs.imgPickArea.scrollHeight;
        const scrollBottom = this.$refs.imgPickArea.clientHeight + this.$refs.imgPickArea.scrollTop;
        // 触底加载
        if (scrollHeight <= scrollBottom + 100) {
          this.page.pageNo += 1;
          this.getList();
        }
      },

      selectImg(data) {
        // 计算当前选中的值
        if (this.multiple) {
          if (data.isChecked) {
            this.idList.push(data);
          } else {
            this.idList.splice(
              this.idList.findIndex(item => item.id === data.id),
              1
            );
          }
        } else {
          if (data.isChecked) {
            this.idList = [];
            this.idList.push(data);
          } else {
            this.idList = [];
          }
        }
      },

      // 双击文件夹
      handleGroup(data) {
        this.idList = [];
        this.groupId = data.id;
        this.page.pageNo = 1;
        this.getList();
      },

      handleNodeClick(node) {
        this.groupId = node.id;
        this.page.pageNo = 1;
        // this.idList = [];
        this.getList();
      },

      handleShowUpload() {
        this.showUploadDialog = true;
      },

      // 关闭弹窗
      handleClose() {
        this.showPopup = false;
        this.$emit('cancel');
      },

      uploadSuccess(selectList) {
        // 上传图片后默认选中
        if (selectList) {
          if (this.multiple) {
            this.idList = selectList.splice(0, this.limit);
          } else {
            this.idList = selectList.splice(0, 1);
          }
        }
        this.getList();
        this.$refs.tree.queryTree();
      },

      // 确定
      submit() {
        const images = this.idList.map(item => {
          return {
            id: item.id,
            imgUrl: item.localUrl,
            wxUrl: item.localUrl,
            materialName: item.materialName,
            wxMediaId: item.wxMediaId,
          };
        });
        if (this.multiple) {
          if (images.length > this.limit) {
            return;
          }
          this.$emit('picked', images);
        } else {
          this.$emit('picked', images[0]);
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .image-dialog {
    .title {
      font-size: 16px;
      font-weight: 600;
      text-align: left;
      color: #303133;
    }

    .title-tip {
      font-size: 14px;
      color: #a1a4ab;
    }

    .error {
      color: red;
      margin-left: 20px;
    }

    .flex-box {
      display: flex;
      flex-direction: row;
      flex: 1 auto;
    }

    .picture-content {
      padding-left: 25px;
      width: 690px;

      /deep/ .el-button {
        height: 36px;
        line-height: 1;
        border-radius: 2px;
      }

      /deep/ .el-button--primary {
        border: none;
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
          margin-right: 10px;
        }

        /deep/ .el-input__inner {
          width: 220px;
          height: 36px;
          line-height: 1;
          background: #fff;
          border: 1px solid #dce1e6;
          border-radius: 0;
        }
      }

      .picture-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-top: 16px;
        overflow: auto;
        height: 400px;

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

      // el-input设置clearable在这里会出现两个删除图标

      /deep/ .el-input__icon.el-input__validateIcon.el-icon-circle-close {
        display: none;
      }
    }

    .dialog_ft_desc {
      position: absolute;
      left: 20px;
    }
  }
</style>
