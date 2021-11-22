<template>
  <div class="wd-image-editor">
    <edit-header :data-source="dataSource" name="促销活动"></edit-header>

    <div class="com-body">
      <div v-if="!dataSource.showPoster">
        <div class="com-row">
          <span class="com-column">主标题</span>
          <span class="nav-column">
            <el-input class="com-input" :maxlength="20" v-model="dataSource.textNavSource.title" placeholder></el-input>
          </span>
        </div>

        <div class="com-row">
          <span class="com-column">副标题</span>
          <span class="nav-column">
            <el-input
              class="com-input"
              :maxlength="20"
              v-model="dataSource.textNavSource.subTitle"
              placeholder
            ></el-input>
          </span>
        </div>
      </div>

      <decorate-size :data-source="dataSource"></decorate-size>

      <div class="com-row com-show-type">
        <span class="com-column">显示方式：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.display" class="display-radio decorate-radio">
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
            :min="1"
            v-model="dataSource.limitNum"
            type="number"
            placeholder
          />
          <!-- <el-input class="com-input" v-model="dataSource.limitNum" placeholder></el-input> -->
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">主题图片：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.showPoster">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">不显示</el-radio>
          </el-radio-group>
        </span>
      </div>

      <div class="one-row-upload" v-if="dataSource.showPoster">
        <a class="dss-link" @click="visibleUpload = true"><i class="el-icon-plus"></i>添加图片</a>
        <div>建议尺寸1500*600</div>
      </div>

      <!--已存在图片的预览-->
      <div class="image-container" v-if="dataSource.showPoster">
        <div class="img-preview" v-for="(item, index) in dataSource.posterData" :key="index">
          <div class="close">
            <i class="el-icon-close" @click="detelePoster(item)"></i>
          </div>

          <div class="nav-row">
            <div class="nav-column">
              <div class="img" :style="{ 'background-image': 'url(' + item.src + ')' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="com-row">
        <span class="com-column">促销活动：</span>
        <span class="com-column">
          <span class="com-select-button" @click="showDialog = true"><i class="el-icon-plus"></i></span>
          <span class="com-select-tip">请选择促销活动</span>
        </span>
      </div>

      <!--已存在活动的预览-->
      <div class="name-preview-container">
        <div class="name-preview" v-for="(item, index) in computeDataList" :key="index" :draggable="true">
          <div class="name limit-line-ellipsis">{{ item.name }}</div>
          <i class="el-icon-close close" @click="deteleImage(item)"></i>
        </div>
      </div>
    </div>
    <select-dialog
      v-model="showDialog"
      show-goods-type-tab
      @choosed="onChooseGoods"
      :enable-multiple="true"
      :selected-list="selectedList"
      :goods-type="type"
    ></select-dialog>

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
  import './css/imageModuleEdit.less';
  import commonEdit from './commonEdit.vue';
  import service from '@/dss-wechat3rd/src/api/activity.js';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
  import DecorateSize from './size.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
  import { mapState } from 'vuex';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import discountApi from '@/dss-wechat3rd/src/api/discount';
  import drag from './drag.js';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'PromotionModuleEdit',
    components: {
      commonEdit,
      DecorateSize,
      selectDialog,
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
        showDialog: false,
        type: goodsTypeEnum.promotion,
        visibleUpload: false,
        selectedList: [],
      };
    },
    watch: {
      'dataSource.data': {
        deep: true,
        handler(newVal, oldVal) {
          drag.list = this.computeDataList;
          this.selectedList = this.dataSource.data;
        },
      },
    },

    computed: {
      computeDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : [];
      },
    },

    mounted() {
      // 绑定拖拽容器，绑定拖拽事件
      const node = document.querySelector('.name-preview-container');
      node.ondragstart = drag.ondragstart;
      node.ondragover = drag.ondragover;
      drag.list = this.computeDataList;
      drag.nodeClassName = 'name-preview';
      drag.nodeChildName = 'name';
      this.selectedList = this.dataSource.data;
    },

    methods: {
      onCancelPickImage() {
        this.visibleUpload = false;
      },

      onSuccessPickedImage(src) {
        this.visibleUpload = false;
        const obj = {
          src: src.imgUrl,
        };
        const data = [obj];
        this.dataSource.posterData = data;
      },

      // 删除图片
      detelePoster(val) {
        this.dataSource.posterData.slice().forEach((item, index) => {
          if (val == item) {
            this.dataSource.posterData.splice(index, 1);
          }
        });
      },

      onChooseGoods(choosedGoodsList) {
        this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.promotion);
      },

      deteleImage(item) {
        utils.deteleItem(this.dataSource.data, item);
      },

      deleteActivity() {
        this.dataSource.activityId = '';
        this.dataSource.data = {};
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

  .name-preview-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 36px;
  }

  .name-preview {
    position: relative;
    width: 96px;
    height: 22px;
    margin-right: 10px;
    line-height: 22px;
    padding-left: 6px;
    background: rgba(46, 141, 255, 0.13);
    border: 1px solid #2e8dff;

    .name {
      font-size: 12px;
      font-weight: 400;
      color: #303133;
    }

    .close {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
    }
  }

  .img-preview {
    position: relative;
    width: 330px;
    height: 104px;
    margin-top: 18px;

    .img {
      width: 330px;
      height: 104px;
      display: inline-block;
      vertical-align: top;
      background-size: cover;
      background-position: center;
    }

    .close {
      position: absolute;
      top: 4px;
      right: 4px;
      z-index: 9;
      width: 14px;
      height: 14px;
      text-align: center;
      line-height: 14px;
      background: #fff;
      color: #ff6b41;
      border: 1px solid #ff6b41;
    }
  }
</style>
