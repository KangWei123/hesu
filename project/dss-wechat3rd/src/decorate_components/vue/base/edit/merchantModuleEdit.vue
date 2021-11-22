<template>
  <div>
    <edit-header :data-source="dataSource" name="商户"></edit-header>
    <div class="com-body">
      <size :data-source="dataSource"></size>
      <commonEdit
        :data-source="dataSource"
        :type="type"
        :enable-edit-nav="false"
        nav-text="更多"
        nav-page="wxat-common/pages/tabbar-merchant/index"
        @chooseList="onChooseGoods"
        title="选择商户"
        :show-label="false"
        :filter-list="filterList"
      >
        <template slot="bottom">
          <div class="com-row com-show-type">
            <span class="com-column">显示方式：</span>
            <span class="nav-column">
              <el-radio-group v-model="dataSource.display" class="decorate-radio">
                <el-radio label="vertical" border>列表</el-radio>
                <el-radio label="horizon" border>滑动</el-radio>
                <el-radio label="oneRowTwo" border>1行2个</el-radio>
                <el-radio label="oneRowThree" border>1行3个</el-radio>
              </el-radio-group>
            </span>
          </div>
          <div class="com-row">
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
        <div class="img" :style="{ 'background-image': 'url(' + item.logo + ')' }"></div>
        <i class="com-close" @click="deteleImage(item)"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index.vue';
  import FilterDataMixin from '@/dss-wechat3rd/src/decorate_components/mixins/filter-data-mixin';
  import './css/common.less';
  import commonEdit from './commonEdit.vue';
  import size from './size.vue';
  import drag from './drag';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'MerchantModuleEdit',
    mixins: [FilterDataMixin],
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
    },

    data() {
      return {
        type: goodsTypeEnum.merchant,
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
        console.log(
          this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData
        );
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
      filterList() {
        return [
          {
            type: 'input',
            paramName: 'nameOrCode',
            label: '关键字',
            showFormLabel: true,
          },
          {
            type: 'select',
            paramName: 'merchantStoreId',
            label: '项目：',
            showFormLabel: true,
            selectOptions: this.storeOptions,
          },
          {
            type: 'select',
            paramName: 'tenantCategoryId',
            label: '经营类目',
            showFormLabel: true,
            selectOptions: this.categoryOptions,
          },
        ];
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
    },

    methods: {
      onChooseGoods(choosedGoodsList) {
        // 删除不需要的字段
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.merchant);
      },
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
