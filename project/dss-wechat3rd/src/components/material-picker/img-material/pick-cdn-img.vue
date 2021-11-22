<template>
  <div class="materials-image">
    <div class="v-modal"
         @click="clickCancel"></div>
    <div class="dialog">
      <!--头部-->
      <div class="dialog_hd">
        <h3>
          选择图片
          <span class="error">{{error}}</span>
        </h3>
        <a href="javascript:;"
           @click="clickCancel"
           class="weui-desktop-icon-btn weui-desktop-dialog__close-btn pop_closed">
          <svg width="18"
               height="18"
               viewBox="0 0 18 18"
               xmlns="http://www.w3.org/2000/svg">
            <title>Element / Icon - Close</title>
            <path d="M10.01 8.996l7.922-7.922c.086-.086.085-.21.008-.289l-.73-.73c-.075-.074-.208-.075-.29.007L9 7.984 1.077.062C.995-.02.863-.019.788.055l-.73.73c-.078.078-.079.203.007.29l7.922 7.92-7.922 7.922c-.086.086-.085.212-.007.29l.73.73c.075.074.207.074.29-.008l7.92-7.921 7.922 7.921c.082.082.215.082.29.008l.73-.73c.077-.078.078-.204-.008-.29l-7.921-7.921z" />
          </svg>
        </a>
      </div>

      <!--中间-->
      <div class="dialog_bd">
        <!--分组栏-->
        <div class="inner_side table-cell">
          <div class="group_list">
            <dl class="inner_menu"
                v-loading="groupLoading"
                element-loading-spinner="el-icon-loading">
              <dd v-for="(item, index) in groups"
                  class="inner_menu_item"
                  @click="pickGroup(item.id)"
                  :key="index"
                  :class="item.id == selectGroupId ? 'selected' : ''">
                <a href="javascript:;"
                   class="inner_menu_link inline-text"
                   :title="item.groupName">
                  <strong>{{ item.groupName }}</strong>
                  <em class="num"
                      v-if="item.num > 0">
                    (
                    <span>{{ item.num || 0 }}</span>)
                  </em>
                </a>
              </dd>
            </dl>

            <!-- <div class="inner_menu_item">
              <a href="javascript:;" @click="addNewGroup" class="inner_menu_link inline-text">
                <i class="new-group-btn"></i>
                新建分组
              </a>
            </div>

            <add-group v-if="editGrouping" :callback="onGroupAdded"></add-group>-->
          </div>
        </div>
        <!--图片列表-->
        <div class="inner_main table-cell"
             v-loading="imgLoading"
             element-loading-spinner="el-icon-loading">
          <div class="img_pick_area">
            <!--上传按钮-->
            <div class="sub_title_bar in_dialog">
              <div class="search table-cell">
                <el-input placeholder="搜索图片"
                          @keydown.native.enter="onSearch"
                          v-model="materialName" />
              </div>
              <Uploader :groupId="selectGroupId"
                        :fileType="FILE_TYPES.IMAGE"
                        @on-success="handleUploadSuccess">
                <el-button class="dss-btn-primary dss-btn-middle"
                           type="primary">本地上传</el-button>
              </Uploader>

              <!-- <div class="upload-tip table-cell">
                <span class="error">{{error}}</span>
                大小不超过2MB,支持bmp/png/jpeg/jpg/gif格式
              </div>-->
            </div>
            <!--图片显示区域-->
            <div class="img_pick_area_inner"
                 @scroll="handleScroll"
                 ref="imgPickArea">
              <div class="img_pick">
                <div class="img_block img_float"
                     v-for="item in tableData"
                     :key="item.id"
                     @click="pickImg(item.id, item)"
                     :class="item.id in selectImg ? 'img_selected' : ''">
                  <div class="img_box">
                    <img :src="item.localUrl" />
                  </div>
                  <div class="desc inline-text">{{ item.materialName }}</div>
                  <div class="selected_mask">
                    <div class="selected_mask_inner"></div>
                    <!-- <div class="selected_mask_icon"></div> -->
                    <div class="selected_mask_icon el-icon-check"></div>
                  </div>
                </div>

                <div v-if="!imgLoading"
                     class="area-tail">
                  <span v-if="!tableData.length">没有更多数据</span>
                  <a @click="apiLoadImage"
                     href="javascript:;"
                     v-if="tableData.length < totalCount"
                     class="dss-link">加载更多</a>
                  <span v-else>没有更多数据</span>
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
          <span>{{ selectLength }}</span>个
        </p>
      </div>

      <!--尾巴-->
      <div class="dialog_ft">
        <el-button class="dss-btn-primary dss-btn-middle"
                   type="primary"
                   :disabled="selectLength == 0"
                   :loading="submitting"
                   @click="clickSure">确定</el-button>
        <el-button class="dss-btn-plain dss-btn-middle"
                   :loading="submitting"
                   @click="clickCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Uploader from '../single-uploader';
import './index.less';
import mApi from '../materials.js';
import config from '../MaterialsConfig';

export default {
  components: { Uploader },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    //素材来源是否 微信素材库，否则只存本地素材
    isWxSource: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      FILE_TYPES: config.FILE_TYPES,
      error: '',
      submitting: false,
      groupLoading: true,
      imgLoading: false,
      editGrouping: false,
      materialName: '',
      totalCount: 0,
      pageNo: 1,
      pageSize: 10,
      tableData: [],

      selectLength: 0,
      selectImg: {},
      selectGroupId: 0,
      //id ;name 分组名称 ; type 0普通分组1默认分组
      groups: []
    };
  },
  methods: {
    handleUploadSuccess() {
      this.pageNo = 1;
      this.apiImageList();
    },
    handleScroll() {
      // 所有数据据加载完成
      if (this.tableData.length >= this.totalCount) {
        return;
      }
      const scrollHeight = this.$refs.imgPickArea.scrollHeight;
      const scrollBottom = this.$refs.imgPickArea.clientHeight + this.$refs.imgPickArea.scrollTop;
      // 触底加载
      if (scrollHeight <= scrollBottom) {
        this.apiLoadImage();
      }
    },
    onUpload() {
      const url = location.protocol + '//' + location.host + '/dsp.html#' + '/materials/picture/list';
      window.open(url, '_blank');
    },
    onUploadError(ermsg) {
      this.error = ermsg;
      setTimeout(() => {
        this.error = null;
      }, 2500);
    },
    //选中图片
    pickImg(id, imgItem) {
      const url = imgItem.cdnUrl || imgItem.localUrl;
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
          this.selectImg[id] = url;
          this.selectLength += 1;
        }
      }
    },
    //选中分组
    pickGroup(id, force) {
      if (this.selectGroupId != id || force) {
        this.selectGroupId = id - 0;
        this.pageNo = 1;
        this.apiImageList();
      }
    },
    onSearch() {
      this.pageNo = 1;
      this.apiImageList();
    },
    //加载图片列表
    apiImageList() {
      this.imgLoading = true;
      mApi
        .getPicList({
          isWx: this.isWxSource ? 1 : 0,
          type: config.FILE_TYPES.IMAGE,
          materialType: 1,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          groupId: this.selectGroupId || undefined,
          materialName: this.materialName
        })
        .then(res => {
          const data = res.data || [];
          this.totalCount = res.totalCount;
          this.pageNo = res.pageNo;
          if (this.pageNo == 1) {
            this.tableData = data;
          } else {
            this.tableData = this.tableData.concat(data);
          }
          console.log('load more', this.totalCount > this.tableData.length, this.tableData);
        })
        .always(() => {
          this.imgLoading = false;
        });
    },
    apiLoadImage() {
      this.pageNo += 1;
      this.apiImageList();
    },
    //添加分组
    addNewGroup() {
      this.editGrouping = true;
    },
    // 分组添加回调
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
        let materialName = ~index ? this.tableData[index].materialName : null;
        images.push({ id: parseInt(id), imgUrl: this.selectImg[id], wxMediaId, wxUrl, materialName });
      }
      if (images.length > this.limit && this.multiple) {
        //如果是多选判断限制条件，单选不判断直接替换
        this.error = `最多选择 ${this.limit} 张图片`;
      } else if (this.multiple) {
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
      .getGroupList({ materialType: 1, pageNo: 1, pageSize: 100 })
      .then(res => {
        console.log(res);
        let choose;
        (res.data || []).forEach(item => {
          if (!!item.groupName) this.groups.push(item);
          if (item.groupType == 1) {
            choose = item.id; // 选中默认分组
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
