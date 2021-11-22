

<template>
  <div class="haggle-module-edit">
    <edit-header :data-source="dataSource" name="积分商城"></edit-header>

    <div class="com-body">
      <size :dataSource="dataSource"></size>
      <commonEdit :dataSource="dataSource"
                  :type="type"
                  :enable-edit-nav="false"
                  nav-text="积分商城"
                  :nav-page="linkedPages.page.MORE_INTEGRAL"
                  @chooseList="onChooseGoods"></commonEdit>

      <!--已存在图片的预览-->
      <div class="img-preview-container" style="margin-left: 103px;width: auto;">
        <div class="img-preview"
             v-for="(item,index) in dataSource.data"
             :draggable="true"
             :key="index">
          <div class="img"
               :style="{'background-image': 'url(' + item.itemThumbnail + ')'}"></div>
          <i class="com-close"
             @click="deteleImage(item)"></i>
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
import drag from './drag.js';
import EditHeader from './edit-header.vue';

export default {
  name: 'integralModuleEdit',
  components: {
    commonEdit,
    size,
    EditHeader
  },
  props: {
    dataSource: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      linkedPages,
      type: goodsTypeEnum.integral
    };
  },

  computed: {
    computeDataList() {
      return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
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
    onChooseGoods(choosedGoodsList) {
      //删除不需要的字段
      this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.integral);
    },

    deteleImage(item) {
      utils.deteleItem(this.dataSource.data, item);
    }
  }
};
</script>

