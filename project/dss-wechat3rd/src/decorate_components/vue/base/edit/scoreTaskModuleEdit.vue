<template>
  <div class="article-module-edit">
    <edit-header :data-source="dataSource" name="积分任务"></edit-header>
    <div class="com-body">
      <size :data-source="dataSource"></size>
      <commonEdit
        :data-source="dataSource"
        :type="type"
        :enable-edit-nav="false"
        nav-text="更多任务"
        title="选择积分任务"
        tips-label="任务"
        :nav-page="linkedPages.page.SCORETASK"
        @chooseList="onChooseGoods"
      ></commonEdit>
      <!--已存在图片的预览-->
      <div class="preview-container">
        <!-- <span class="tips">默认显示前三条图文</span> -->
        <div class="article-preview" v-for="(item, index) in dataSource.data" :key="index" :draggable="true">
          <div class="img" :style="{ 'background-image': 'url(' + item.coverUrl + ')' }"></div>
          <span class="article-preview-title">{{ item.title }}</span>
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
  import services from '@/dss-common/utils/services';
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
        type: goodsTypeEnum.scoreTask,
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
        this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.scoreTask);
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
    justify-content: space-between;
    flex-wrap: wrap;
    width: 320px;
    margin: 0 auto;

    .tips {
      color: #999;
      margin: 5px;
      font-size: 14px;
    }

    .article-preview {
      width: 100%;
      // height: 90px;
      position: relative;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border: 1px solid #dcdfe6;
      padding: 10px;
      box-sizing: border-box;
      background: #f5f7fa;

      .article-preview-title {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #303133;
        margin-left: 10px;
      }

      .img {
        width: 90px;
        height: 60px !important;
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
