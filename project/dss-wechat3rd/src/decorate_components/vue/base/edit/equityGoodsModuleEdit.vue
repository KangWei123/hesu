<template>
  <div class="equityGoods-module-edit">
    <edit-header :data-source="dataSource" name="权益商品"></edit-header>
    <div class="com-body">
      <size :data-source="dataSource"></size>
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

      <commonEdit
        :data-source="dataSource"
        :type="type"
        :enable-edit-nav="false"
        nav-text="更多权益商品"
        title="选择权益商品"
        tips-label="商品"
        custom-bg-mode
        :nav-page="linkedPages.page.EQUITYGOODS"
        @chooseList="onChooseGoods"
      ></commonEdit>

      <!--已存在图片的预览-->
      <div class="preview-container">
        <!-- <span class="tips">默认显示前三条图文</span> -->
        <div class="article-preview" v-for="(item, index) in dataSource.data" :key="index" :draggable="true">
          <div class="img" :style="{ 'background-image': 'url(' + item.icon + ')' }"></div>
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
  import commonEdit from './commonEdit.vue';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
  import size from './size.vue';
  import EditHeader from './edit-header.vue';
  import drag from './drag.js';

  export default {
    name: 'ArticleModuleEdit',
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
        linkedPages,
        type: goodsTypeEnum.equityGoods,
      };
    },
    watch: {},

    computed: {
      computeDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
    },

    methods: {
      onChooseGoods(choosedGoodsList) {
        // 删除不需要的字段
        this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.equityGoods);
      },

      deteleImage(item) {
        utils.deteleItem(this.dataSource.data, item);
      },
    },

    mounted() {
      // 绑定拖拽容器，绑定拖拽事件
      const node = document.querySelector('.preview-container');
      node.ondragstart = drag.ondragstart;
      node.ondragover = drag.ondragover;
      drag.list = this.computeDataList;
      drag.nodeClassName = 'article-preview';
      drag.nodeChildName = 'img';
    },
  };
</script>
<style lang="less" scoped>
  .preview-container {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 320px;
    margin-top: 20px;

    .tips {
      color: #999;
      margin: 5px;
      font-size: 14px;
    }

    .article-preview {
      width: 64px;
      height: 64px;
      position: relative;
      margin-right: 10px;
      margin-top: 10px;

      .img {
        width: 64px;
        height: 64px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }

      .com-close {
        position: absolute;
        right: -1px;
        top: -1px;
      }
    }
  }

  .article-selector {
    width: 228px;
  }
</style>
