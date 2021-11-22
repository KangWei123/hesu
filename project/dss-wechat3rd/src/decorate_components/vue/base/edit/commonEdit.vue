<template>
  <div>
    <div class="com-row">
      <span class="com-column">显示导航：</span>
      <span class="com-column">
        <el-radio-group v-model="dataSource.showNav">
          <el-radio :label="true" border>是</el-radio>
          <el-radio :label="false" border>否</el-radio>
        </el-radio-group>
      </span>
    </div>

    <div v-if="dataSource.showNav">
      <div class="com-row">
        <span class="com-column input-title">主标题：</span>
        <span class="nav-column">
          <el-input
            class="com-input"
            :maxlength="20"
            v-model="dataSource.textNavSource.title"
            placeholder=""
          ></el-input>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column input-title">链接标题：</span>
        <span class="nav-column">
          <el-input
            class="com-input"
            :maxlength="20"
            v-model="dataSource.textNavSource.subTitle"
            placeholder=""
          ></el-input>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column input-title">导航链接：</span>
        <template v-if="enableEditNav">
          <span class="com-column" v-if="!dataSource.textNavSource.linkName">
            <el-cascader expand-trigger="hover" :options="linkPages" @change="e => handleChange(e, item)">
            </el-cascader>
          </span>
          <span v-else class="link-page">
            <div class="link-name input-title">{{ dataSource.textNavSource.linkName }}</div>
            <div class="delete" @click="deleteItemLinkPage()"></div>
          </span>
        </template>
        <template v-else>
          <span class="input-title" style="display: inline-block">{{ navText || '' }}</span>
        </template>
      </div>
      <!-- <div class="nav-row"> -->
      <div class="com-row" v-if="dataSource.textNavSource.linkType && dataSource.textNavSource.linkId">
        <span class="com-column">对应{{ dataSource.textNavSource.tips }}</span>
        <div class="com-column">
          <div class="dss-link" v-if="!dataSource.textNavSource.detailUrl" @click="chooseDetail()">
            选择{{ dataSource.textNavSource.tips }}
          </div>
          <div v-else>
            <div
              class="detail-image"
              :style="{
                background: 'transparent url(' + dataSource.textNavSource.detailUrl + ') no-repeat center / cover',
              }"
            >
              <div class="delete" @click="deleteDetailData()"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <slot name="bottom"></slot>
    <div class="com-row" v-if="customBgMode">
      <span class="com-column">背景颜色：</span>
      <span class="com-column">
        <colorSelect
          v-model="dataSource.backgroundColor"
          :color-model.sync="dataSource.bgMode"
          :default-color="defaultBgColor"
          :show-border="true"
          :default-label="[
            { value: 'default', name: '默认' },
            { value: 'custom', name: '自定义' },
          ]"
        ></colorSelect>
      </span>
    </div>

    <div class="com-row">
      <span class="com-column">选择{{ tipsLabel || type.label }}：</span>
      <span class="com-column">
        <!-- <span class="com-upload-button" @click="showDialog = true"></span> -->

        <div class="theme-img">
          <div class="add-img" @click="showDialog = true">
            <i class="el-icon-plus"></i>
          </div>
          <div class="theme-img-operate">
            <span style="font-size: 12px" class="label-color">请选择{{ type.label || tipsLabel }}</span>
          </div>
        </div>
      </span>
    </div>

    <select-dialog
      v-model="showDialog"
      @choosed="onChooseGoods"
      :selected-list="selectedList"
      :goods-type="type"
      :show-goods-type-tab="showGoodsTypeTab"
      :limit-params="limitParams"
      :show-label="showLabel"
      :is-area-manger="isAreaManger"
      :filter-list="filterList"
      :title="title"
    >
    </select-dialog>

    <select-dialog v-model="detailDialog" @choosed="chooseDetailData" :enable-multiple="false" :goods-type="detailType">
    </select-dialog>
  </div>
</template>

<script>
  import './css/common.less';
  import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
  import { mapState } from 'vuex';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
  import navParamsAssember from '../../../utils/nav-params-assember.js';
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index.vue';

  export default {
    name: 'GoodsModuleEdit',
    components: {
      selectDialog,
      colorSelect,
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
      title: {
        type: String,
        default: '',
      },
      enableEditNav: {
        type: Boolean,
        default: true,
      },
      showLabel: {
        type: Boolean,
        default: true,
      },
      navText: {
        type: String,
        default: '更多',
      },
      navPage: {
        type: String,
        default: '',
      },
      limitParams: {
        type: Array,
        default() {
          return [];
        },
      },
      filterList: {
        type: Array,
        default() {
          return [];
        },
      },
      customBgMode: {
        type: Boolean,
        default: false,
      },
      tipsLabel: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        linkPages: null,
        showDialog: false,
        detailDialog: false,
        detailType: null,
        selectedList: [],
        defaultBgColor: 'rgba(246,249,251,1)',
        goodsTypeEnum,
      };
    },

    watch: {
      'dataSource.data': {
        handler(newVal, oldVal) {
          this.selectedList = this.dataSource.data;
        },
      },
    },

    computed: {
      ...mapState({
        curApp: 'curApp',
        roleList: 'roleList',
      }),

      // 区域管理员
      isAreaManger() {
        return (
          (!!~this.roleList.split(',').indexOf('common_role_area_manager') ||
            !!~this.roleList.split(',').indexOf('common_role_dealer_manager')) &&
          !!this.curApp.canCustomDecorate
        );
      },

      showImage() {
        return !!this.dataSource.textNavSource.detailUrl;
      },

      // 是否允许子组件显示商品类型tab切换
      showGoodsTypeTab() {
        // 商品类型为产品
        if (this.type.type === goodsTypeEnum.product.type) {
          return true;
        }
        return false;
      },
    },

    mounted() {
      this.selectedList = this.dataSource.data;
      navParamsAssember.initLinkPages.bind(this)();
      if (!this.enableEditNav) {
        const item = this.dataSource.textNavSource;
        item.linkName = this.navText;
        item.linkPage = this.navPage;
        this.$set(item, 'linkType', 0);
      }
    },

    methods: {
      onChooseGoods(choosedGoodsList) {
        this.$emit('chooseList', choosedGoodsList);
      },

      // 选择图片对应的链接地址
      handleChange(choosedVals, item) {
        navParamsAssember.handleChangeLinkPage.bind(this)(choosedVals, item);
      },

      // 删除对应的链接地址
      deleteItemLinkPage() {
        const item = this.dataSource.textNavSource;
        item.linkName = '';
        item.linkPage = '';
        this.$set(item, 'detailUrl', null);
        this.$set(item, 'detailId', null);
        this.$set(item, 'linkType', null);
      },

      // 如果链接是详情类的，则需要选择对应的详情数据
      chooseDetail() {
        if (!this.detailType) {
          this.detailType = goodsTypeEnum[this.dataSource.textNavSource.linkId];
        }
        this.detailDialog = true;
      },

      // 获取详情数据
      chooseDetailData(val) {
        navParamsAssember.getNavLinkParams.bind(this)(this.dataSource.textNavSource, val);
      },

      // 删除图片对应的详情
      deleteDetailData() {
        const item = this.dataSource.textNavSource;
        this.$set(item, 'detailUrl', null);
        this.$set(item, 'detailId', null);
      },
    },
  };
</script>
