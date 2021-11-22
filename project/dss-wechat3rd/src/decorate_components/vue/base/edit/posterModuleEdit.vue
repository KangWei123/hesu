<template>
  <div class="wd-image-editor" v-if="dataSource">
    <!-- <div class="com-title">
      <span>图片</span>
    </div> -->
    <edit-header :data-source="dataSource" name="海报"></edit-header>
    <div class="com-body">
      <size :data-source="dataSource"></size>
      <div class="com-row">
        <span class="com-column">图片间隙：</span>
        <span class="com-column">
          <div class="com-slide">
            <el-slider v-model="dataSource.margin" :max="30" :show-tooltip="false" input-size="mini"></el-slider>
          </div>
        </span>
        <span class="px-title">{{ dataSource.margin }}</span>
      </div>

      <!--已存在图片的预览-->
      <div class="image-container image-container-preview">
        <div class="img-preview1" v-for="(item, index) in dataSource.data" :key="index" style="margin: 20px 0">
          <i class="com-close" @click="deteleImage(item)"></i>

          <div class="nav-row">
            <!-- <span class="nav-column">图片：</span> -->
            <div class="nav-column">
              <div class="img" :style="{ 'background-image': 'url(' + item.src + ')' }"></div>
            </div>
          </div>

          <div class="link-container">
            <div class="nav-row" style="margin-top: -5px">
              <span class="nav-column link-title">链接：</span>
              <div class="nav-column info">
                <div v-if="!item.linkPage">
                  <!-- <el-cascader
                    expand-trigger="hover"
                    :options="linkPages"
                    @change="e => handleChange(e, item)"
                  ></el-cascader> -->
                  <select-link :link-pages="linkPages" @confirm="e => handleChange(e, item)" />
                </div>
                <div v-else class="link-page">
                  <div class="link-page-name">{{ item.linkName }}</div>
                  <div class="delete" @click="deleteItemLinkPage(item)"></div>
                </div>
              </div>
            </div>

            <!-- <div class="nav-row"> -->
            <div class="nav-row" v-if="item.linkType && item.linkId">
              <span class="nav-column">{{ item.tips }}：</span>
              <div class="nav-column">
                <div v-if="!!item.detailUrl">
                  <div
                    class="detail-image"
                    :style="{ background: 'transparent url(' + item.detailUrl + ') no-repeat center / cover' }"
                  >
                    <div class="delete" @click="deleteDetail(item)"></div>
                  </div>
                </div>
                <div v-else-if="!!item.detailText">
                  <div class="detail-image detail-text">
                    {{ item.detailText }}
                    <div class="delete" @click="deleteDetail(item)"></div>
                  </div>
                </div>
                <div class="dss-link1" v-else @click="chooseDetail(item.linkId, index)">选择{{ item.tips }}</div>
              </div>
            </div>
            <!-- 小程序跳转填写 appid -->
            <div class="nav-row" v-if="item.linkPage === 'miniProgram'">
              <span class="nav-column link-title">小程序：</span>
              <span class="nav-column">
                <el-input v-model="item.linkId" style="width: 150px" placeholder="对应小程序 appid" />
              </span>
            </div>
            <!-- 腾讯珊瑚url -->
            <div class="nav-row" v-if="item.linkPage === 'coral-url'">
              <span class="nav-column link-title">url：</span>
              <span class="nav-column">
                <el-input v-model="item.linkId" style="width: 150px" placeholder="腾讯珊瑚url" />
              </span>
            </div>
            <!-- 24好玩游戏url -->
            <div class="nav-row" v-if="item.linkPage === '24haowan-url'">
              <span class="nav-column link-title">url：</span>
              <span class="nav-column">
                <el-input v-model="item.linkId" style="width: 150px" placeholder="游戏url" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="com-row">
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
              <span style="font-size: 12px" class="label-color">建议尺寸300*100</span>
            </div>
          </div>
        </span>
      </div>
    </div>

    <!--点击上传图片-->
    <!-- <div class="one-row-upload">
      <a class="dss-link" @click="visibleUpload=true">+添加图片</a>
      <div>建议尺寸750*1050</div>
    </div> -->

    <!--上传选择图片-->
    <materials-image
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
    />

    <select-dialog
      v-model="detailDialog"
      @choosed="onChooseGoods"
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
  // import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import navParamsAssember from '../../../utils/nav-params-assember.js';
  import size from './size.vue';
  import './css/common.less';
  import './css/imageModuleEdit.less';
  import './css/select-detail.less';
  import { mapState } from 'vuex';
  import EditHeader from './edit-header.vue';
  import SelectLink from '@/dss-wechat3rd/src/components/select-link/index.vue';
  import FilterDataMixin from '../../../mixins/filter-data-mixin';

  export default {
    name: 'PosterModuleEdit',
    mixins: [FilterDataMixin],
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      MaterialsImage,
      selectDialog,
      size,
      EditHeader,
      SelectLink,
    },

    data() {
      return {
        linkPages: [],
        visibleUpload: false,
        detailDialog: false,
        detailType: goodsTypeEnum.product,
        editIndex: 0,
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
      this.linkPages.push({
        label: '小程序跳转',
        linkType: 0,
        index: 'miniProgram',
        linkName: '小程序跳转',
        value: 'miniProgram',
        tip: '小程序app id',
      });
    },

    methods: {
      onCancelPickImage() {
        this.visibleUpload = false;
      },
      onSuccessPickedImage(src) {
        this.visibleUpload = false;
        const obj = {
          src: src.imgUrl,
          linkPage: '',
          linkName: '',
          linkType: 0,
        };
        this.dataSource.data.push(obj);
      },

      // 选择图片对应的链接地址
      handleChange(choosedVals, item) {
        if (!choosedVals || !choosedVals.length) return;
        navParamsAssember.handleChangeLinkPage.bind(this)(choosedVals, item);
      },

      // 删除图片对应链接
      deleteItemLinkPage(item) {
        item.linkPage = '';
        item.linkName = '';
        item.detailText = '';
        this.$set(item, 'detailUrl', null);
        this.$set(item, 'detailId', null);
        this.$set(item, 'linkType', null);
      },

      // 点击选择图片对应的详情
      chooseDetail(id, index) {
        this.detailType = goodsTypeEnum[id];
        this.editIndex = index;
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
          case 'merchant':
            this.filterList = [
              {
                type: 'input',
                paramName: 'name',
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
            break;
        }
      },

      // 图片选择对应的详情
      onChooseGoods(val) {
        navParamsAssember.getNavLinkParams.bind(this)(this.dataSource.data[this.editIndex], val);
      },

      // 删除图片对应的详情
      deleteDetail(item) {
        item.detailId = '';
        item.detailUrl = '';
        item.detailText = '';
        this.detailDialog = false;
      },

      // 删除图片
      deteleImage(val) {
        this.dataSource.data.slice().forEach((item, index) => {
          if (val == item) {
            this.dataSource.data.splice(index, 1);
          }
        });
      },
    },
  };
</script>
