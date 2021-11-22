<template>
  <div class="collage-module-edit">
    <edit-header :data-source="dataSource" name="拼团"></edit-header>

    <div class="com-body">
      <size :data-source="dataSource"></size>

      <div class="com-row com-show-type">
        <span class="com-column">显示方式：</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.showType" class="decorate-radio">
            <el-radio :label="decorateStyleEnum.SHOW_TYPE.vertical" border>列表</el-radio>
            <el-radio :label="decorateStyleEnum.SHOW_TYPE.horizon" border>滑动</el-radio>
            <el-radio :label="decorateStyleEnum.SHOW_TYPE.rowOne" border>大图</el-radio>
            <el-radio :label="decorateStyleEnum.SHOW_TYPE.rowTwo" border>1行2个</el-radio>
            <el-radio :label="decorateStyleEnum.SHOW_TYPE.rowThree" border>1行3个</el-radio>
          </el-radio-group>
        </span>
      </div>

      <commonEdit
        :data-source="dataSource"
        :type="type"
        :enable-edit-nav="false"
        nav-text="更多拼团"
        :filter-list="filterList"
        :show-label="showLabel"
        :nav-page="linkedPages.page.MORE_GROUP_PAGE"
        @chooseList="onChooseGoods"
      ></commonEdit>

      <!--已存在图片的预览-->
      <div class="img-preview-container img-preview-margin">
        <div class="img-preview" v-for="(item, index) in computeDataList" :draggable="true" :key="index">
          <div class="img" :style="{ 'background-image': 'url(' + getImg(item) + ')' }"></div>
          <i class="com-close" @click="deteleImage(item)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import './css/common.less';
  import linkedPages from '@/dss-wechat3rd/src/constants/wxLinkPages.js';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import decorateStyleEnum from '@/dss-wechat3rd/src/constants/decorateStyleEnum.js';
  import commonEdit from './commonEdit.vue';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
  import size from './size.vue';
  import drag from './drag.js';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'CollageModuleEdit',
    components: {
      commonEdit,
      size,
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
        filterList: [
          {
            type: 'input', // 选择器类型
            paramName: 'name',
            label: '活动名称',
            showFormLabel: true,
          },
          {
            type: 'select-store', // 选择器类型
            paramName: 'storeIds',
            label: '活动门店',
            showFormLabel: true,
          },
        ],
        linkedPages,
        type: goodsTypeEnum.group,
        decorateStyleEnum,
        showLabel: false,
      };
    },

    computed: {
      computeDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
    },

    watch: {
      'dataSource.data': {
        deep: true,
        handler(newVal, oldVal) {
          drag.list = this.computeDataList;
        },
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
    },

    methods: {
      onChooseGoods(choosedGoodsList) {
        // 删除不需要的字段
        this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.collage);
      },

      getImg(item) {
        return item.backgroundUrl || item.thumbnail;
      },

      deteleImage(item) {
        utils.deteleItem(this.dataSource.data, item);
      },
    },
  };
</script>
