<template>
  <div>
    <el-dialog
      title="选择图标"
      width="1050px"
      :visible="true"
      :before-close="close"
      class="icon-nav-dialog"
    >
      <div class="nav-dialog-content">
        <div class="tip">选择图标</div>
        <div
          class="icon-item"
          v-for="(item,index) in AllIcons"
          :key="index"
          @click="picked(item.name)"
        >
          <span class="img-box" :style="{background: themeColor}">
            <img :src="item.onIcon" />
          </span>
          <img :src="item.offIcon" />
          <span>{{item.text}}</span>
        </div>
        <div class="tip">自定义上传</div>
        <div class="custom-upload clearfix">
          <div class="select-img-content clearfix">
            <div class="xx">选中：</div>
            <div v-if="!selectedIconPath" class="img add" @click="clickAddImageUrl('on')"></div>
            <div
              v-else
              class="img real-img"
              :style="{background: 'transparent url(' + selectedIconPath + ') no-repeat center center / cover'}"
            >
              <div class="delete" @click="deleteImage('on')"></div>
            </div>
          </div>
          <div class="img-content clearfix">
            <div class="xx">未选中：</div>
            <div v-if="!iconPath" class="img add" @click="clickAddImageUrl('off')"></div>
            <div
              v-else
              class="img real-img"
              :style="{background: 'transparent url(' + iconPath + ') no-repeat center center / cover'}"
            >
              <div class="delete" @click="deleteImage('off')"></div>
            </div>
          </div>
          <div class="comfire-btn" @click="comfired">确认</div>
        </div>
        <div class="suggest">建议：图片尺寸为96px X 96px，图片大小不超过20KB，透明底</div>
      </div>
    </el-dialog>
    <!--上传选择图片-->
    <materials-image
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
    />
  </div>
</template>

<script>
// import { ALL_ICONS } from './util';
import imageLibrary from './imageLibrary';
import { mapState } from 'vuex';
// import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
export default {
  mixins: [industryHelperMixin],
  components: {
    MaterialsImage
  },
  props: {
    themeColor: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      // AllIcons: ALL_ICONS
      selectedIconPath: null,
      iconPath: null,
      type: null,
      visibleUpload: false
    };
  },

  computed: {
    ...mapState({
      env: 'env'
    }),

    AllIcons() {
      return imageLibrary.icons(this.mGetIndustryKey());
    }
  },

  methods: {
    picked(name) {
      this.$emit('picked', name);
    },
    close() {
      this.$emit('closed');
    },
    clickAddImageUrl(type) {
      this.type = type;
      this.visibleUpload = true;
    },
    onCancelPickImage() {
      this.visibleUpload = false;
    },
    onSuccessPickedImage(src) {
      this.visibleUpload = false;
      if (this.type === 'on') {
        this.selectedIconPath = src.imgUrl;
      } else {
        this.iconPath = src.imgUrl;
      }
    },
    comfired() {
      const x = {};
      if (this.selectedIconPath) {
        x.selectedIconPath = this.selectedIconPath;
      }
      if (this.iconPath) {
        x.iconPath = this.iconPath;
      }

      this.$emit('picked', x);
    },

    deleteImage(type) {
      if (type === 'on') {
        this.selectedIconPath = null;
      } else {
        this.iconPath = null;
      }
    }
  }
};
</script>

<style lang="less">
.nav-dialog-content {
  .tip {
    text-align: left;
    border-bottom: 1px solid rgba(220, 220, 220, 220);
    // border-bottom: 1px solid rebeccapurple;
    padding: 10px;
    margin: 10px 0 20px;
  }

  .custom-upload {
    text-align: left;
    padding-left: 30px;
    font-size: 0;
    height: 58px;

    .select-img-content {
      float: left;
      & > div:nth-child(n) {
        float: left;
      }
    }

    .img-content {
      float: left;
      margin-left: 20px;
      & > div:nth-child(n) {
        float: left;
      }
    }

    .xx {
      font-size: 14px;
    }

    .img {
      width: 48px;
      height: 48px;
      background: lightgray;
      border-radius: 2px;
      text-align: center;
      // line-height: 48px;
    }

    .real-img {
      position: relative;
      .delete {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 10px;
        height: 10px;
        background: transparent url(../../../../images/close.png) no-repeat center center / cover;
      }
    }

    .add {
      cursor: pointer;
      background: transparent url(../../../../images/decorate/upload-btn.png) no-repeat 0 0;
      background-size: cover;
    }

    .comfire-btn {
      float: left;
      font-size: 14px;
      margin-left: 100px;
      padding: 7px 20px;
      background-color: #2e8dff;
      border-radius: 5px;
      color: white;
      cursor: pointer;
    }
  }

  .suggest {
    text-align: left;
    padding: 20px 10px;
  }

  .clearfix:after {
    content: ' ';
    display: block;
    clear: both;
    height: 0;
  }
  　.clearfix {
    zoom: 1;
  }
}
</style>



