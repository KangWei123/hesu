<style lang="less">
  .poster-recommend-module-edit {
    .addImage {
      padding: 0 10px;
      border: 1px solid rgba(67, 121, 237, 1);
      border-radius: 2px;
      font-weight: 400;
      color: rgba(67, 121, 237, 1);
      font-family: PingFangSC-Regular;
      cursor: pointer;
      display: inline-block;
      text-align: center;
      height: 19px;
      line-height: 19px;
    }

    .poster-image {
      width: 78px;
      height: 78px;
      position: relative;

      .com-close {
        position: absolute;
        right: -5px;
        top: -5px;
      }
    }
  }
</style>

<template>
  <div class="poster-recommend-module-edit">
    <edit-header :data-source="dataSource" name="猜你喜欢"></edit-header>

    <div class="com-body">
      <decorate-size :data-source="dataSource"></decorate-size>
      <div class="com-row">
        <span class="com-column">显示图片：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.showPoster">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </span>
      </div>
      <div class="com-row" v-if="dataSource.showPoster">
        <span class="com-column">主题图片：</span>
        <span class="com-column">
          <div class="theme-img" v-if="!dataSource.posterUrl">
            <div class="add-img" @click="addImage">
              <i class="el-icon-plus"></i>
            </div>
            <div class="theme-img-operate">
              <div class="operate-box">
                <a class="label-color">选择图片</a>
              </div>
              <span style="font-size: 12px" class="label-color">建议尺寸：750*250px</span>
            </div>
          </div>
          <!-- <div v-if="!dataSource.posterUrl" class="addImage" @click="addImage">+添加图片</div> -->
          <div
            v-else
            class="poster-image"
            :style="{ background: 'transparent url(' + dataSource.posterUrl + ') no-repeat center center / 100% 100%' }"
          >
            <i class="com-close" @click="deteleImage()"></i>
          </div>
          <!-- <div
            style="color: #858c99; font-size: 12px; font-weight: 400;margin-top: 2px"
          >建议尺寸：750*250px</div> -->
        </span>
      </div>

      <div class="com-row" v-else>
        <span class="com-column">标题：</span>
        <span class="nav-column">
          <el-input class="com-input" v-model="dataSource.posterTitle" placeholder></el-input>
        </span>
      </div>

      <div class="com-row com-show-type">
        <span class="com-column">显示方式：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.display" class="decorate-radio">
            <el-radio label="vertical" border>列表</el-radio>
            <el-radio label="horizon" border>滑动</el-radio>
            <el-radio label="oneRowOne" border>大图</el-radio>
            <el-radio label="oneRowTwo" border>1行2个</el-radio>
            <el-radio label="oneRowThree" border>1行3个</el-radio>
          </el-radio-group>
        </span>
      </div>
      <div class="com-row">
        <span class="com-column input-title">显示数量：</span>
        <span class="nav-column">
          <el-input-number
            style="width: 160px"
            class="com-input com-input-number"
            :min="4"
            :max="100"
            type="number"
            v-model="dataSource.limitNum"
            placeholder
          ></el-input-number>
        </span>
      </div>
    </div>

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
  import './css/common.less';
  import commonEdit from './commonEdit.vue';
  import DecorateSize from './size.vue';
  // import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'GoodsModuleEdit',
    components: {
      commonEdit,
      DecorateSize,
      MaterialsImage,
      EditHeader,
    },
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        visibleUpload: false,
      };
    },
    methods: {
      deteleImage() {
        this.dataSource.posterUrl = '';
      },

      addImage() {
        this.visibleUpload = true;
      },
      onCancelPickImage() {
        this.visibleUpload = false;
      },
      onSuccessPickedImage(src) {
        this.visibleUpload = false;
        this.dataSource.posterUrl = src.imgUrl;
      },
    },
  };
</script>
<style lang="less" scoped>
  .com-row {
    .title {
      width: 100px;
    }
  }
</style>
