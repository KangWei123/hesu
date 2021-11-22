<template>
  <div class="wd-image-editor" v-if="dataSource">
    <edit-header :data-source="dataSource" name="VR展示"></edit-header>

    <div class="com-body">
      <size :data-source="dataSource"></size>

      <div class="com-row">
        <span class="com-column">显示导航：</span>
        <span class="com-column">
          <!--  eslint-disable-next-line vue/no-mutating-props -->
          <el-radio-group v-model="dataSource.showNav">
            <el-radio :label="true" border>是</el-radio>
            <el-radio :label="false" border>否</el-radio>
          </el-radio-group>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column input-title">标题：</span>
        <span class="nav-column">
          <!--  eslint-disable-next-line vue/no-mutating-props -->
          <el-input class="com-input" :maxlength="20" v-model="dataSource.textNavSource.title" placeholder="" />
        </span>
      </div>

      <div class="com-row">
        <span class="com-column input-title">链接标题：</span>
        <span class="nav-column">
          <!-- eslint-disable-next-line vue/no-mutating-props -->
          <el-input class="com-input" :maxlength="20" v-model="dataSource.textNavSource.subTitle" placeholder="" />
        </span>
      </div>

      <!--已存在VR的预览-->
      <div class="image-container image-container-preview">
        <dnd-container class="VR-draggable" group-name="VR-draggable" @drop="onDrop($event)">
          <dnd-draggable v-for="(item, index) in dataSource.data" :key="index">
            <div class="img-preview1" style="margin: 20px 0">
              <i class="com-close" @click="deteleVR(index)"></i>

              <div class="nav-row">
                <!-- <span class="nav-column">VR背景图：</span> -->
                <div class="nav-column">
                  <div
                    class="img"
                    :style="{ 'background-image': item.imgUrl ? 'url(' + item.imgUrl + ')' : '' }"
                    @click="handleShowImgPopup(index)"
                  >
                    <template v-if="!item.imgUrl">
                      <img src="../images/VR-decoratebg.png" alt="" srcset="" />
                      <div>添加图片</div>
                    </template>
                  </div>
                </div>
              </div>

              <div class="link-container">
                <div class="nav-row">
                  <span class="nav-column">标题：</span>
                  <div class="nav-column" @mousedown.stop="stop">
                    <el-input v-model.trim="item.VRTitle" placeholder="请输入VR标题" maxlength="25" />
                  </div>
                </div>
                <div class="nav-row">
                  <span class="nav-column">链接：</span>
                  <div class="nav-column" @mousedown.stop="stop">
                    <el-input v-model.trim="item.VRLink" placeholder="请输入VR链接" />
                  </div>
                </div>
              </div>
            </div>
          </dnd-draggable>
        </dnd-container>
      </div>

      <!--点击上传图片-->
      <div class="com-row">
        <span class="com-column">添加VR：</span>
        <span class="com-column">
          <!-- <span class="com-upload-button" @click="showDialog = true"></span> -->

          <div class="theme-img">
            <div class="add-img" @click="addVR">
              <i class="el-icon-plus"></i>
            </div>
            <div class="theme-img-operate">
              <span style="font-size: 12px" class="label-color">建议尺寸16:9</span>
            </div>
          </div>
        </span>
      </div>
    </div>

    <!--点击上传图片-->
    <!-- <div class="one-row-upload">
      <a class="dss-link" @click="addVR">+添加VR展示</a>
    </div> -->

    <!--上传选择图片-->
    <materials-image
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="showImgPopup"
      :visible.sync="showImgPopup"
    />
  </div>
</template>

<script>
  import materialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import size from './size.vue';
  import './css/common.less';
  import './css/imageModuleEdit.less';
  import './css/select-detail.less';
  import { Container, Draggable } from 'vue-smooth-dnd';
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index.vue';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'VRModuleEdit',
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      materialsImage,
      size,
      'dnd-container': Container,
      'dnd-draggable': Draggable,
      colorSelect,
      EditHeader,
    },

    data() {
      return {
        showImgPopup: false,
        defaultBgColor: 'rgba(255,255,255,1)',
        defaultTitleColor: '#333',
        imgIndex: 0,
      };
    },

    mounted() {},

    methods: {
      addVR() {
        const obj = {
          imgUrl: '',
          VRLink: '',
          VRTitle: '',
        };

        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.data.push(obj);
      },

      handleShowImgPopup(index) {
        this.imgIndex = index;
        this.showImgPopup = true;
      },

      onCancelPickImage() {
        this.showImgPopup = false;
      },

      onSuccessPickedImage(image) {
        const index = this.imgIndex;
        const item = this.dataSource.data[index];

        item.imgUrl = image.imgUrl;
        this.$set(this.dataSource.data, index, item);
        this.showImgPopup = false;
      },

      // 删除图片
      deteleVR(index) {
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.data.splice(index, 1);
      },

      // 拖拽VR
      onDrop(dropResult) {
        const { removedIndex, addedIndex } = dropResult;

        // 不需要处理的情况
        if (!removedIndex && !addedIndex) {
          return false;
        }

        // eslint-disable-next-line vue/no-mutating-props
        const addImage = this.dataSource.data.splice(removedIndex, 1)[0];
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.data.splice(addedIndex, 0, addImage);
      },

      stop() {},
    },
  };
</script>
<style lang="less" scoped>
  .VR-draggable {
    .img-preview1 {
      margin: 0;
      cursor: move;

      .img {
        padding-top: 2px;
        text-align: center;
        width: 72px;
        height: 72px;
        background-color: #e9ecf1;
        color: #2e8dff;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border: 1px solid #ff7844;

        img {
          width: 18px;
          height: 18px;
          margin: 0 auto;
        }
      }
    }

    .nav-column {
      min-width: 80px;
    }
  }

  .link-container {
    .nav-column {
      min-width: 63px;
      line-height: 36px;
    }
  }

  .one-row-upload {
    display: flex;
    align-items: center;
    justify-content: center;

    .dss-link {
      padding: 0;
    }
  }
</style>
