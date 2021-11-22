<template>
  <div class="wd-image-editor coupon-module-edit" v-if="dataSource">
    <edit-header :data-source="dataSource" name="电子画册"></edit-header>

    <div class="com-body">
      <size :dataSource="dataSource"></size>
      <commonEdit
        :dataSource="dataSource"
        :type="type"
        :enable-edit-nav="false"
        nav-text="更多画册"
        :nav-page="linkedPages.page.ELECTRONIC_BOOKS"
        @chooseList="onChooseGoods"
      ></commonEdit>
      <!--已存在图片的预览-->
      <div class="img-preview-container">
        <div class="img-preview" v-for="(item, index) in dataSource.data" :key="index" :draggable="true">
          <div class="img" :style="{ 'background-image': 'url(' + item.coverUrl + ')' }"></div>
          <div class="com-close" @click="deteleImage(item)"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import size from './size.vue';
import drag from './drag.js';
import commonEdit from './commonEdit.vue';
import linkedPages from '@/dss-wechat3rd/src/constants/wxLinkPages.js';
import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import EditHeader from './edit-header.vue';

export default {
  name: 'ebooksModule',
  components: {
    size,
    commonEdit,
    EditHeader
  },
  props: {
    dataSource: {
      type: Object,
      default: {}
    }
  },
  watch: {
    'dataSource.data': {
      deep: true,
      handler(newVal, oldVal) {
        drag.list = this.computeDataList;
      }
    }
  },
  data() {
    return {
      linkedPages,
      type: goodsTypeEnum.ebooks
    };
  },
  computed: {
    computeDataList() {
      return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
    }
  },
  mounted() {
    //绑定拖拽容器，绑定拖拽事件
    let node = document.querySelector('.img-preview-container');
    node.ondragstart = drag.ondragstart;
    node.ondragover = drag.ondragover;
    drag.list = this.computeDataList;
    drag.nodeClassName = 'img-preview';
    drag.nodeChildName = 'img';
  },
  methods: {
    onChooseGoods(choosedList) {
      //删除不需要的字段
      this.dataSource.data = utils.saveAvailableFields(choosedList, fields.ebooks);
    },
    deteleImage(item) {
      utils.deteleItem(this.dataSource.data, item);
    }
  }
};
</script>

