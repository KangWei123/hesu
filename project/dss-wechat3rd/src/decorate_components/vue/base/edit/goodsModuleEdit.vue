<template>
  <div>
    <!-- <div class="com-title">
      <span>{{ type.label }}</span>
    </div> -->
    <edit-header :data-source="dataSource" :name="type.label"></edit-header>
    <div class="com-body">
      <size :data-source="dataSource"></size>
      <commonEdit
        :data-source="dataSource"
        :type="type"
        :enable-edit-nav="false"
        :nav-text="navText"
        :nav-page="navPage"
        @chooseList="onChooseGoods"
      >
        <template slot="bottom">
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
          <div class="com-row" v-if="type.value === goodsTypeEnum.product.value">
            <span class="com-column">背景颜色：</span>
            <span class="com-column">
              <colorSelect
                v-model="dataSource.backgroundColor"
                :color-model.sync="dataSource.bgMode"
                :default-color="defaultBgColor"
                show-border
              ></colorSelect>
            </span>
          </div>
        </template>
      </commonEdit>
    </div>
    <!--已存在图片的预览-->
    <div class="img-preview-container">
      <div class="img-preview" v-for="(item, index) in computeDataList" :key="index" :draggable="true">
        <div class="img" :style="{ 'background-image': 'url(' + item.thumbnail + ')' }"></div>
        <i class="com-close" @click="deteleImage(item)"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import './css/common.less';
  import linkedPages from '@/dss-wechat3rd/src/constants/wxLinkPages.js';
  import commonEdit from './commonEdit.vue';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index.vue';
  import size from './size.vue';
  import drag from './drag.js';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'GoodsModuleEdit',
    components: {
      commonEdit,
      size,
      colorSelect,
      EditHeader,
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
        defaultBgColor: 'rgba(255,255,255,1)',
      };
    },

    watch: {
      'dataSource.data': {
        deep: true,
        handler(newVal, oldVal) {
          drag.list = this.computeDataList;
        },
      },
    },

    computed: {
      computeDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
      navText() {
        switch (this.type.value) {
          case goodsTypeEnum.product.value:
            return '更多商品';
          case goodsTypeEnum.server.value:
            return '更多服务';
          case goodsTypeEnum.estate.value:
            return '更多楼盘';
          default:
            return '更多';
        }
      },
      navPage() {
        switch (this.type.value) {
          case goodsTypeEnum.product.value:
            return linkedPages.page.MORE_GOODS_PAGE;
          case goodsTypeEnum.server.value:
            return linkedPages.page.MORE_SERVER_PAGE;
          case goodsTypeEnum.estate.value:
            return linkedPages.page.MORE_ESTATE_PAGE;
          default:
            return '';
        }
      },
    },
    mounted() {
      // 绑定拖拽容器，绑定拖拽事件
      const node = document.querySelector('.img-preview-container');
      node.ondragstart = drag.ondragstart;
      node.ondragover = drag.ondragover;
      drag.list = this.computeDataList;
      drag.nodeClassName = 'img-preview';
      drag.nodeChildName = 'img';
      this.addDataSourceProps();
      console.log('goodsModuleEdit', this.dataSource);
    },

    methods: {
      onChooseGoods(choosedGoodsList) {
        // 删除不需要的字段
        this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.goods);
      },
      typeChange() {},
      deteleImage(item) {
        utils.deteleItem(this.dataSource.data, item);
      },
      addDataSourceProps() {
        const dataSource = this.dataSource;
        if (!dataSource.backgroundColor) {
          this.$set(dataSource, 'backgroundColor', 'rgba(246,249,251,1)');
        }
        if (!dataSource.bgMode) {
          this.$set(dataSource, 'bgMode', 'default');
        }
      },
    },
  };
</script>
