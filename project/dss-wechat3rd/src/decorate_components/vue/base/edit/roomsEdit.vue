<template>
  <div class="wd-image-editor">
    <div class="com-title">
      <span>{{ type.label }}</span>
    </div>

    <!--点击上传图片-->
    <div class="com-row" style="padding-left: 20px">
      <span class="com-column">上传图片：</span>
      <span class="com-column">
        <div class="theme-img">
          <div class="add-img" @click="visibleUpload = true">
            <i class="el-icon-plus"></i>
          </div>
          <div class="theme-img-operate">
            <div class="operate-box">
              <a class="label-color">添加图片</a>
            </div>
            <span style="font-size: 12px" class="label-color">建议尺寸1500*2100</span>
          </div>
        </div>
      </span>
    </div>

    <!-- <div class="one-row-upload">
      <a class="dss-link" @click="visibleUpload=true">+添加图片</a>
      <div>建议尺寸1500*2100</div>
    </div> -->

    <!--已存在图片的预览-->
    <div class="image-container">
      <div class="img-preview1" v-for="(item, index) in dataSource.posterData" :key="index">
        <i class="com-close" @click="detelePoster(item)"></i>

        <div class="nav-row">
          <span class="nav-column">图片：</span>
          <div class="nav-column">
            <div class="img" :style="{ 'background-image': 'url(' + item.src + ')' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="com-body">
      <size :data-source="dataSource"></size>

      <div class="com-row com-show-type">
        <span class="com-column">显示方式：</span>
        <span class="nav-column">
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
        <span class="com-column">选择{{ type.label }}：</span>
        <span class="com-column">
          <!-- <span class="com-upload-button" @click="showDialog=true"></span> -->
          <div class="theme-img">
            <div class="add-img" @click="showDialog = true">
              <i class="el-icon-plus"></i>
            </div>
            <div class="theme-img-operate">
              <span style="font-size: 12px" class="label-color">请选择{{ type.label }}</span>
            </div>
          </div>
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

    <!--已存在图片的预览-->
    <div class="img-preview-container">
      <div class="img-preview" v-for="(item, index) in computeDataList" :key="index" :draggable="true">
        <div class="img" :style="{ 'background-image': 'url(' + item.thumbnail + ')' }"></div>
        <i class="com-close" @click="deteleImage(item)"></i>
      </div>
    </div>

    <select-dialog
      v-model="showDialog"
      @choosed="onChooseGoods"
      :selected-list="selectedList"
      :goods-type="type"
    ></select-dialog>
  </div>
</template>

<script>
  import './css/common.less';
  // import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import commonEdit from './commonEdit.vue';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import size from './size.vue';
  import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
  import drag from './drag.js';

  export default {
    name: 'GoodsModuleEdit',
    components: {
      commonEdit,
      size,
      selectDialog,
      MaterialsImage,
    },
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
      type: {
        type: Object,
        default: null,
      },
    },

    data() {
      return {
        goodsTypeEnum,
        showDialog: false,
        selectedList: [],
        visibleUpload: false,
      };
    },
    watch: {
      'dataSource.data': {
        handler(newVal, oldVal) {
          this.selectedList = this.dataSource.data;
          drag.list = this.computeDataList;
        },
      },
    },
    computed: {
      computeDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
    },
    mounted() {
      this.selectedList = this.dataSource.data;
      // 绑定拖拽容器，绑定拖拽事件
      const node = document.querySelector('.img-preview-container');
      node.ondragstart = drag.ondragstart;
      node.ondragover = drag.ondragover;
      drag.list = this.computeDataList;
      drag.nodeClassName = 'img-preview';
      drag.nodeChildName = 'img';
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
        // 删除不需要的字段
        this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.goods);
      },
      typeChange() {},
      deteleImage(item) {
        utils.deteleItem(this.dataSource.data, item);
      },
    },
  };
</script>
