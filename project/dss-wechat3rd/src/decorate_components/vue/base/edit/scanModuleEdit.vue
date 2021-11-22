<template>
  <div class="wd-scan-editor wd-image-editor" v-if="dataSource">
    <edit-header :data-source="dataSource" name="扫码购图标"></edit-header>

    <div class="com-body">
      <size :data-source="dataSource"></size>
      <div class="com-row">
        <span class="com-column">选择图片</span>
        <el-radio-group v-model="dataSource.bgMode">
          <el-radio label="default" border>默认</el-radio>
          <el-radio label="custom" border>自定义</el-radio>
        </el-radio-group>
      </div>
    </div>

    <!--点击上传图片-->
    <div class="com-row" v-if="dataSource.bgMode === 'custom'" style="padding-left: 20px">
      <span class="com-column">选择图片：</span>
      <span class="com-column">
        <!-- <span class="com-upload-button" @click="showDialog = true"></span> -->

        <div class="theme-img">
          <div class="add-img" @click="visibleUpload = true">
            <i class="el-icon-plus"></i>
          </div>
          <div class="theme-img-operate">
            <span style="font-size: 12px" class="label-color">建议尺寸750px*460px</span>
          </div>
        </div>
      </span>
    </div>

    <!-- <div class="one-row-upload" v-if="dataSource.bgMode === 'custom'">
      <a class="dss-link" @click="visibleUpload=true">+{{!dataSource.bgUrl ? '选择图片' : '重新选择图片'}}</a>
      <div>建议尺寸750px*460px</div>
    </div> -->

    <!--上传选择图片-->
    <materials-image
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
    />

    <!--已存在图片的预览-->
    <div class="image-container">
      <div class="scan-img-preview">
        <div
          class="img"
          v-if="dataSource.bgMode === 'custom'"
          :style="{ 'background-image': 'url(' + dataSource.bgUrl + ')' }"
        ></div>
        <div
          class="img"
          v-if="dataSource.bgMode === 'default'"
          :style="{ 'background-image': 'url(' + defaultScanBg + ')' }"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import size from './size.vue';
  import './css/common.less';
  import './css/imageModuleEdit.less';
  import './css/select-detail.less';
  import defaultScanBg from '../images/scan/ic-scan-buy.png';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'ScanModuleEdit',
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      MaterialsImage,
      size,
      EditHeader,
    },

    data() {
      return {
        defaultScanBg,
        linkPages: [],
        visibleUpload: false,
        detailDialog: false,
        detailType: goodsTypeEnum.product,
        editIndex: 0,
      };
    },

    methods: {
      onCancelPickImage() {
        this.visibleUpload = false;
      },
      onSuccessPickedImage(src) {
        this.visibleUpload = false;
        this.dataSource.bgUrl = src.imgUrl;
      },
    },
  };
</script>

<style lang="less">
  .wd-scan-editor {
    .scan-img-preview {
      margin: 20px;
      border: 1px solid #dcdfe6;
      position: relative;

      .nav-column {
        display: inline-block;
        margin-top: 10px;
      }

      .nav-column:first-child {
        width: 72px;
        text-align: right;
      }

      .img {
        width: 320px;
        height: 230px;
        display: inline-block;
        vertical-align: top;
        background-size: cover;
        background-position: center;
      }
    }
  }
</style>
