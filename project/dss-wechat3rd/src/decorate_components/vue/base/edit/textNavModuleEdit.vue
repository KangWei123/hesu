<template>
  <div class="text-nav-editor" v-if="dataSource">
    <edit-header :data-source="dataSource" name="文本导航"></edit-header>

    <div class="com-body">
      <size :data-source="dataSource"></size>
      <div class="com-row">
        <span class="com-column">背景颜色：</span>
        <span class="com-column">
          <colorSelect
            v-model="dataSource.bgColor"
            :color-model.sync="dataSource.bgMode"
            :default-color="defaultBgColor"
            show-border
          ></colorSelect>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">文字颜色：</span>
        <span class="com-column">
          <colorSelect
            v-model="dataSource.titleColor"
            :color-model.sync="dataSource.textMode"
            :default-color="defaultTitleColor"
            show-border
          ></colorSelect>
        </span>
      </div>

      <div>
        <div class="com-row">
          <span class="com-column input-title">主标题：</span>
          <span class="nav-column">
            <el-input class="com-input" v-model="dataSource.title" placeholder></el-input>
          </span>
        </div>

        <div class="com-row" v-if="!isXiCha">
          <span class="com-column input-title">链接标题：</span>
          <span class="nav-column">
            <el-input class="com-input" v-model="dataSource.subTitle" placeholder></el-input>
          </span>
        </div>
        <div class="com-row">
          <span class="com-column input-title">导航链接：</span>
          <span class="com-column" v-if="!dataSource.linkName">
            <!-- <el-cascader
              expand-trigger="hover"
              :options="linkPages"
              @change="e => handleChange(e, dataSource)">
              </el-cascader> -->
            <select-link :link-pages="linkPages" @confirm="e => handleChange(e, dataSource)"></select-link>
          </span>
          <span v-else class="link-page">
            <div class="link-name input-title">{{ dataSource.linkName }}</div>
            <div class="delete" @click="deleteItemLinkPage()"></div>
          </span>
        </div>
        <!-- <div class="nav-row"> -->
        <div class="com-row" v-if="dataSource.linkType && dataSource.linkId">
          <span class="com-column">对应{{ dataSource.tips }}：</span>
          <div class="com-column">
            <div v-if="!!dataSource.detailUrl">
              <div
                class="detail-image"
                :style="{ background: 'transparent url(' + dataSource.detailUrl + ') no-repeat center / cover' }"
              >
                <div class="delete" @click="deleteDetailData()"></div>
              </div>
            </div>

            <div v-else-if="!!dataSource.detailText">
              <div class="detail-image detail-text">
                {{ dataSource.detailText }}
                <div class="delete" @click="deleteDetailData()"></div>
              </div>
            </div>

            <div class="dss-link" v-else @click="chooseDetail()">选择{{ dataSource.tips }}</div>
          </div>
        </div>
        <!-- 腾讯珊瑚url -->
        <div class="com-row" v-if="dataSource.linkPage === 'coral-url'">
          <span class="com-column link-title">url：</span>
          <span class="com-column">
            <el-input v-model="dataSource.linkId" style="width: 150px" placeholder="腾讯珊瑚url" />
          </span>
        </div>
        <!-- 24好玩游戏url -->
        <div class="com-row" v-if="dataSource.linkPage === '24haowan-url'">
          <span class="com-column link-title">url：</span>
          <span class="com-column">
            <el-input v-model="dataSource.linkId" style="width: 150px" placeholder="游戏url" />
          </span>
        </div>
      </div>
    </div>
    <select-dialog
      v-model="detailDialog"
      @choosed="chooseDetailData"
      :enable-multiple="false"
      :goods-type="detailType"
      :is-area-manger="isAreaManger"
      :show-label="showLabel"
      :filter-list="filterList"
      :title="'选择' + detailType.label"
    ></select-dialog>
  </div>
</template>

<script>
  import './css/textNavModuleEdit.less';
  import './css/common.less';
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index.vue';
  import { mapState } from 'vuex';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import navParamsAssember from '../../../utils/nav-params-assember';
  import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
  import size from './size.vue';
  import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';
  import EditHeader from './edit-header.vue';
  import SelectLink from '@/dss-wechat3rd/src/components/select-link/index.vue';

  export default {
    name: 'TextNavModuleEdit',
    mixins: [appFeaturesMixin],
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      selectDialog,
      colorSelect,
      size,
      EditHeader,
      SelectLink,
    },
    data() {
      return {
        link: '',
        title: '导航一',
        detailType: goodsTypeEnum.product,
        detailDialog: false,
        navList: [],
        // 滑动设置
        slideMode: '1',
        // 文字颜色
        txtColor: '',
        // 背景颜色
        bgColor: '',
        linkPages: [],

        // 背景颜色
        bgList: [
          { value: 'default', name: '默认' },
          { value: 'custom', name: '自定义' },
        ],
        defaultBgColor: '#FFFFFF',

        // 文字颜色
        titleList: [
          { value: 'default', name: '默认' },
          { value: 'custom', name: '自定义' },
        ],
        defaultTitleColor: 'rgba(55,58,68,1)',

        showLabel: false,
        filterList: [
          {
            type: 'select', // 选择器类型
            label: '活动类型',
          },
        ],
      };
    },

    computed: {
      ...mapState({
        customPages: 'customPages',
        linkedPages: 'linkedPages',
        roleList: 'roleList',
        curApp: 'curApp',
      }),
      // 区域管理员
      isAreaManger() {
        return (
          (!!~this.roleList.split(',').indexOf('common_role_area_manager') ||
            !!~this.roleList.split(',').indexOf('common_role_dealer_manager')) &&
          !!this.curApp.canCustomDecorate
        );
      },
    },

    mounted() {
      navParamsAssember.initLinkPages.bind(this)(true);
    },

    methods: {
      pickLink() {},

      changeBgColor(val) {
        this.dataSource.bgMode = val;
        if (val === 'default') {
          this.customBgColor = this.dataSource.bgColor;
          this.dataSource.bgColor = this.defaultBgColor;
        } else {
          this.dataSource.bgColor = this.customBgColor ? this.customBgColor : this.defaultBgColor;
        }
      },

      changeTitleColor(val) {
        this.dataSource.textMode = val;
        if (val === 'default') {
          this.customTitleColor = this.dataSource.titleColor;
          this.dataSource.titleColor = this.defaultTitleColor;
        } else {
          this.dataSource.titleColor = this.customTitleColor ? this.customTitleColor : this.defaultTitleColor;
        }
      },

      // 选择图片对应的链接地址
      handleChange(choosedVals, item) {
        if (!choosedVals || !choosedVals.length) return;
        navParamsAssember.handleChangeLinkPage.bind(this)(choosedVals, item);
      },

      // 删除对应的链接地址
      deleteItemLinkPage() {
        const item = this.dataSource;
        item.linkName = '';
        item.linkPage = '';
        this.$set(item, 'detailUrl', null);
        this.$set(item, 'detailId', null);
        this.$set(item, 'detailText', null);
        this.$set(item, 'linkType', null);
      },

      // 如果链接是详情类的，则需要选择对应的详情数据
      chooseDetail() {
        this.detailType = goodsTypeEnum[this.dataSource.linkId];
        this.detailDialog = true;
        switch (this.detailType.type) {
          case 'haggle':
            this.filterList[0].paramName = 'createStoreId';
            this.filterList[0].selectOptions = [
              { label: '品牌活动', value: 0 },
              { label: '门店活动', value: 1 },
            ];
            break;
          case 'seckill':
          case 'group':
            this.filterList[0].paramName = 'activityLevel';
            this.filterList[0].selectOptions = [
              { label: '品牌活动', value: 1 },
              { label: '门店活动', value: 10 },
            ];
            break;
        }
      },

      // 获取详情数据
      chooseDetailData(val) {
        navParamsAssember.getNavLinkParams.bind(this)(this.dataSource, val);
      },

      // 删除图片对应的详情
      deleteDetailData() {
        const item = this.dataSource;
        this.$set(item, 'detailUrl', null);
        this.$set(item, 'detailId', null);
        this.$set(item, 'detailText', null);
      },
    },
  };
</script>
