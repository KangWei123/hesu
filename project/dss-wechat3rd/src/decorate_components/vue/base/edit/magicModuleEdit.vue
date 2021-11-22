<template>
  <div class="wd-magic-editor" v-if="dataSource">
    <edit-header :data-source="dataSource" name="魔方"></edit-header>

    <div class="com-body">
      <size :data-source="dataSource" v-if="!dataSource.isMineCenter"></size>
      <div class="com-row" v-if="dataSource.showType !== 'banner'">
        <span class="com-column">图片间隙：</span>
        <span class="com-column">
          <div class="com-slide">
            <el-slider v-model="dataSource.margin" :max="30" :show-tooltip="false" input-size="mini"></el-slider>
          </div>
        </span>
        <span class="px-title">{{ dataSource.margin }}</span>
      </div>
      <div class="com-row" style="display: flex">
        <span class="com-column">显示样式：</span>
        <span class="com-column magic-show-mode">
          <div v-for="(item, index) in modeList" :key="index" @click="pickMode(item.name)" class="magic-mode">
            <i class="block" :class="dataSource.name == item.name ? 'on_' + item.name : 'off_' + item.name"></i>
            <span :class="dataSource.name == item.name ? 'on_bg_title' : 'off_bg_title'">{{ item.title }}</span>
          </div>

          <!-- <i
            class="block"
            v-for="(name,index) in modeList"
            :key="index"
            @click="pickMode(name)"
            :class="dataSource.name==name?('on_'+name):'off_'+name"
          ></i> -->
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">布局：</span>
        <span class="com-column" style="width: 240px">
          <template v-for="(group, key) in styles">
            <div :key="key" class="cube-magic" :class="'cube-' + group.name" v-if="dataSource.name === group.name">
              <div style="border: 1px solid #dce1e6; height: 120px">
                <div
                  class="cube-item"
                  v-for="(item, index) in group.itemStyle"
                  @click="clickLayout(index, item)"
                  :key="index"
                  :class="selectLayoutIndex === index ? 'on_select' : 'off_select'"
                  :style="{ 'background-image': 'url(' + dataSource.data[index].src + ')' }"
                >
                  <img src="../images/decorate-bg.png" alt="" v-if="!dataSource.data[index].src" />
                </div>
              </div>

              <div style="color: #858c99; font-size: 12px; font-weight: 400; margin-top: 2px; text-align: start">
                {{ group.imageSizeDesc }}
              </div>
            </div>
          </template>
        </span>
      </div>
    </div>

    <template v-for="(item, index) in dataSource.data">
      <div class="upload-image" v-if="index === selectLayoutIndex" :key="index">
        <!--点击上传图片-->
        <div class="com-row" v-if="!item.src" style="padding-left: 20px">
          <span class="com-column">添加图片：</span>
          <span class="com-column">
            <div class="theme-img">
              <div class="add-img" @click="visibleUpload = true">
                <i class="el-icon-plus"></i>
              </div>
              <div class="theme-img-operate">
                <span style="font-size: 12px" class="label-color">添加图片</span>
              </div>
            </div>
          </span>
        </div>
        <!-- <div class="one-row-upload" v-if="!item.src">
        <a class="dss-link" @click="visibleUpload=true">+添加图片</a>
      </div> -->

        <!--已存在图片的预览-->
        <div v-else class="image-container image-container-preview">
          <div class="img-preview1">
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
                    <select-link :link-pages="linkPages" @confirm="e => handleChange(e, item)"></select-link>
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
      </div>
    </template>

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
  import './css/magicModuleEdit.less';
  import './css/common.less';
  import './css/select-detail.less';
  import styles from './magicModuleItemStyle.js';
  // import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import navParamsAssember from '../../../utils/nav-params-assember.js';
  import size from './size.vue';
  import { mapState } from 'vuex';
  import EditHeader from './edit-header.vue';
  import SelectLink from '@/dss-wechat3rd/src/components/select-link/index.vue';
  import FilterDataMixin from '../../../mixins/filter-data-mixin';

  export default {
    name: 'MagicModuleEdit',
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
        dialogVisible: false,
        visibleUpload: false,
        addImage: '',
        input: '',
        styles: styles,
        selectItem: null,
        modeList: [
          { name: '1left1right', title: '左1右1' },
          { name: '1left2right', title: '左1右2' },
          { name: '1up2down', title: '上1下2' },
          { name: '1row3', title: '1行3个' },
          { name: '2row2cell', title: '上2下2' },
          { name: '1left3right', title: '左1右3' },
        ],
        selectLayoutIndex: 0,
        linkPages: null,

        detailDialog: false,
        detailType: goodsTypeEnum.product,

        showLabel: false,
        filterList: [
          {
            type: 'select', // 选择器类型
            label: '活动类型',
          },
        ],
      };
    },

    watch: {
      'dataSource.data': {
        immediate: true,
        handler(newVal, oldVal) {
          if (this.dataSource.data && this.dataSource.data.length) {
            this.selectItem = this.dataSource.data[0];
          }
        },
      },
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
      navParamsAssember.initLinkPages.bind(this)();
    },

    methods: {
      pickMode(mode) {
        this.dataSource.name = mode;
        let selectStyle;
        this.styles.forEach(item => {
          if (item.name === mode) {
            // 比对当前选择的样式
            selectStyle = JSON.parse(JSON.stringify(item.itemStyle));
          }
        });
        let maxIndex = 0;

        selectStyle.forEach((item, index) => {
          maxIndex++;
          if (maxIndex > this.dataSource.data.length) {
            // 如果选择的样式里面的数目大于之前的，就增加
            this.dataSource.data.push(item);
          } else {
            // 如果没有超额就将配置数据赋值
            const obj = this.dataSource.data[index];
            for (const key in obj) {
              if (obj.hasOwnProperty(key) && !!item[key] && (key !== 'src' || !obj[key])) {
                obj[key] = item[key];
              }
            }
          }
        });
        if (this.dataSource.data.length > maxIndex) {
          this.dataSource.data.splice(maxIndex, this.dataSource.data.length - maxIndex);
        }
      },

      onCancelPickImage() {
        this.visibleUpload = false;
      },
      onSuccessPickedImage(src) {
        this.visibleUpload = false;
        // this.dataSource.data[this.selectLayoutIndex].src = src.imgUrl;
        this.$set(this.dataSource.data[this.selectLayoutIndex], 'src', src.imgUrl);
      },

      clickLayout(index) {
        this.selectLayoutIndex = index;
      },

      selecImageButton() {
        return {
          'background-image': 'url(' + this.selectItem.src + ')',
        };
      },

      clickImage(image) {
        this.selectItem = image;
      },
      handleChange(choosedVals, item) {
        if (!choosedVals || !choosedVals.length) return;
        navParamsAssember.handleChangeLinkPage.bind(this)(choosedVals, item);
      },
      // 删除图片对应链接
      deleteItemLinkPage(item) {
        item.linkPage = '';
        item.linkName = '';
        item.linkType = 0;
        item.detailId = '';
        item.detailUrl = '';
        item.detailText = '';
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
      deteleImage(item) {
        item.src = '';
        item.linkPage = '';
        item.linkName = '';
        item.detailId = '';
        item.detailUrl = '';
      },
    },
  };
</script>
