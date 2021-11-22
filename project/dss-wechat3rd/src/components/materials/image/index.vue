<template>
  <el-dialog title="选择图片"
             class="choose-img"
             :visible="true"
             :append-to-body="isAppendToBody">
    <div class="materials-image">
      <div class="dialog_bd">
        <!--分组栏-->
        <div class="inner_side table-cell">
          <div class="group_list">
            <dl class="inner_menu"
                v-loading="groupLoading"
                element-loading-spinner="el-icon-loading">
              <dd v-for="(item,index) in groups"
                  class="inner_menu_item"
                  @click="pickGroup(item.id)"
                  :key="index"
                  :class="item.id==selectGroupId?'selected':''">
                <a href="javascript:;"
                   class="inner_menu_link inline-text"
                   :title="item.name">
                  <strong>{{item.name}}</strong>
                  <em class="num"
                      v-if="item.num>0">
                    (
                    <span>{{item.num||0}}</span>)
                  </em>
                </a>
              </dd>
            </dl>

            <div class="inner_menu_item">
              <a href="javascript:;"
                 @click="addNewGroup"
                 class="inner_menu_link inline-text">
                <i class="new-group-btn"></i>
                新建分组
              </a>
            </div>

            <add-group v-if="editGrouping"
                       :callback="onGroupAdded"></add-group>
          </div>
        </div>
        <!--图片列表-->
        <div class="inner_main table-cell">
          <div class="img_pick_area">
            <!--上传按钮-->
            <div class="sub_title_bar in_dialog">
              <el-input placeholder="请输入图片名称"
                        class="imgName"
                        @change="searchImage"
                        v-model="originalName"
                        maxlength="30"></el-input>
              <add-image @success="onImageUploaded"
                         :is-local="!isWxSource"
                         :groupId.sync="selectGroupId"
                         :catchError="onUploadError">
                <el-button class="dss-btn-primary dss-btn-middle"
                           type="primary">本地上传</el-button>
              </add-image>
              <div class="upload-tip table-cell">
                <span class="error">{{error}}</span>
                大小不超过2MB,支持bmp/png/jpeg/jpg/gif格式
              </div>
            </div>
            <!--图片显示区域-->
            <div class="img_pick_area_inner"
                 v-loading="imgLoading"
                 element-loading-spinner="el-icon-loading"
                 ref="Box"
                 @scroll="scrollImg">
              <div class="img_pick">
                <div class="img_block img_float"
                     v-for="(item) in tableData"
                     :key="item.id"
                     @click="pickImg(item.id,item.url, item.wxMediaId)"
                     :class="item.id in selectImg ? 'img_selected': ''">
                  <div class="img_box">
                    <img :src="item.url" style="width: 100%;">
                  </div>
                  <div class="desc inline-text">{{item.originalName}}</div>
                  <div class="selected_mask">
                    <div class="selected_mask_inner"></div>
                    <div class="selected_mask_icon"></div>
                  </div>
                </div>

                <div v-if="!imgLoading"
                     class="area-tail">
                  <span v-if="!tableData.length">没有更多数据</span>
                  <a @click="apiLoadImage"
                     href="javascript:;"
                     v-if="totalCount>pageSize*pageNo"
                     class="dss-link">加载更多</a>
                </div>
                <div v-else
                     class="area-tail">
                  <span>加载中...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p class="dialog_ft_desc">
          已选
          <span>{{selectLength}}</span>个
        </p>
      </div>
      <div slot="footer"
           class="dialog_ft">
        <el-button class="dss-btn-primary dss-btn-middle"
                   type="primary"
                   :disabled="selectLength==0"
                   :loading="submitting"
                   @click="clickSure">确定
        </el-button>
        <el-button class="dss-btn-plain dss-btn-middle"
                   :loading="submitting"
                   @click="clickCancel">取消
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import mApi from '@/dss-wechat3rd/src/api/materials';
import './index.less';
import config from '@/dss-wechat3rd/src/constants/MaterialsConfig';
import AddGroup from './addGroup';
import AddImage from '../addImage';

export default {
  components: { AddGroup, AddImage },
  props: {
    // 是否将对话弹框插入至 body 元素上
    isAppendToBody: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 5
    },
    //素材来源是否 微信素材库，否则只存本地素材
    isWxSource: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      error: '',
      submitting: false,
      groupLoading: true,
      imgLoading: false,
      editGrouping: false,

      totalCount: 0,
      pageNo: 1,
      pageSize: 10,
      tableData: [],

      selectLength: 0,
      selectImg: {},
      selectGroupId: 0,
      //id ;name 分组名称 ; type 0普通分组1默认分组
      groups: [],
      originalName: ''
    };
  },

  methods: {
    // 这里监听 scrollBottom 等于0 触发获取数据的方法 否则不触发
    scrollImg() {
      let scrollBottom = this.$refs.Box.scrollHeight - this.$refs.Box.clientHeight - this.$refs.Box.scrollTop;
      if (scrollBottom < 1) {
        // 判断当前页数是最后一页 return false 加载完毕
        if (this.pageNo * this.pageSize < this.totalCount) {
          this.apiLoadImage();
        }
      }
    },

    onUploadError(ermsg) {
      this.error = ermsg;
      setTimeout(() => {
        this.error = null;
      }, 2500);
    },
    //选中图片
    pickImg(id, url, wxMediaId) {
      if (!this.multiple) {
        if (this.selectImg.hasOwnProperty(id)) {
          this.selectImg = {};
          this.selectLength = 0;
        } else {
          this.selectImg = {};
          this.selectImg[id] = url;
          this.selectLength = 1;
        }
      } else {
        if (this.selectImg.hasOwnProperty(id)) {
          delete this.selectImg[id];
          this.selectLength -= 1;
        } else {
          if (this.selectLength < this.limit) {
            this.selectImg[id] = url;
            this.selectLength += 1;
          }
        }
      }
    },
    //选中分组
    pickGroup(id, force) {
      if (this.selectGroupId != id || force) {
        this.selectGroupId = id - 0;
        this.$refs.Box.scrollTop = 0;
        this.pageNo = 1;
        this.originalName = '';
        this.apiImageList();
      }
    },
    //加载图片列表
    apiImageList() {
      this.imgLoading = true;
      mApi
        .list({
          isWx: this.isWxSource ? 1 : 0,
          type: config.FILE_TYPES.IMAGE,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          groupId: this.selectGroupId || undefined,
          originalName: this.originalName
        })
        .then(res => {
          const data = res.data || [];
          if (this.pageNo == 1) {
            this.tableData = data;
          } else {
            this.tableData = this.tableData.concat(data);
          }
          this.totalCount = res.totalCount;
        })
        .always(() => {
          this.imgLoading = false;
        });
    },
    apiLoadImage() {
      this.pageNo += 1;
      this.apiImageList();
    },

    searchImage() {
      this.pageNo = 1;
      this.apiImageList();
    },
    //添加分组
    addNewGroup() {
      this.editGrouping = true;
    },
    //分组添加回调
    onGroupAdded(group) {
      this.editGrouping = false;
      if (!!group) {
        this.groups.push(group);
      }
    },
    //图片上传完成
    onImageUploaded(url) {
      this.pickGroup(this.selectGroupId, true);
    },
    //点击选中
    clickSure() {
      let images = [];
      for (let id in this.selectImg) {
        let index = this.tableData.findIndex(item => parseInt(item.id) === parseInt(id));
        let wxMediaId = ~index ? this.tableData[index].wxMediaId : null;
        let wxUrl = ~index ? this.tableData[index].wxUrl : null;
        images.push({ id: parseInt(id), imgUrl: this.selectImg[id], wxMediaId, wxUrl });
      }
      if (this.multiple) {
        this.$emit('picked', images);
      } else {
        this.$emit('picked', images[0]);
      }
    },
    //点击取消
    clickCancel(e) {
      this.$emit('cancel');
    }
  },
  mounted() {
    console.log('image/index.vue this.isWxSource==', this.isWxSource);
    //加载分组列表
    mApi
      .listGroup()
      .then(res => {
        let choose;
        (res.data || []).forEach(item => {
          if (!!item.name) this.groups.push(item);
          if (item.type == 1) {
            choose = item.id;
          }
        });
        if (choose !== undefined) {
          this.pickGroup(choose);
        }
      })
      .always(() => {
        this.groupLoading = false;
      });
  }
};
</script>
<style lang="less">
.choose-img {
  right: 0 !important;

  .el-dialog__header {
    padding: 0;
    height: 72px;
    line-height: 72px;
    text-align: center;
  }
  .el-dialog {
    /*margin-top: 10vh!important;*/
    right: 61px !important;
    bottom: 94px !important;
  }
  .el-dialog__headerbtn .el-dialog__close {
    display: none;
  }
}
</style>
