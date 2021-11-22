<template>
  <div class="wd-magic-editor" v-if="dataSource">
    <edit-header :data-source="dataSource" name="热区图片"></edit-header>

    <div class="com-body">
      <size :data-source="dataSource" />
      <div class="com-row" v-if="!dataSource.src">
        <!--点击上传图片-->
        <span class="com-column">选择图片：</span>
        <span class="com-column">
          <div class="theme-img">
            <div class="add-img" @click="visibleUpload = true">
              <i class="el-icon-plus"></i>
            </div>
            <div class="theme-img-operate">
              <div class="operate-box">
                <a class="label-color">选择图片</a>
              </div>
              <span style="font-size: 12px" class="label-color">建议最小宽度375px</span>
            </div>
          </div>
        </span>

        <!-- <div class="one-row-upload" v-if="!dataSource.src">
          <a class="dss-link" @click="visibleUpload = true">+添加背景图（建议最小宽度375px）</a>
        </div> -->
      </div>

      <div class="com-row" v-else>
        <!--已存在图片的预览-->
        <div class="image-container" style="position: relative">
          <!--热区编辑-->
          <hot-area
            ref="$hotArea"
            :src="dataSource.src"
            @picked="onPickedArea"
            :max-width="dataSource.EditAreaMaxWidth"
            @imgLoaded="onImgLoaded"
            @change="onAreaChange"
          />
          <!--替换图片按钮-->
          <a class="replace" @click="visibleUpload = true">替换</a>

          <div class="img-preview1 area-editor">
            <div class="nav-row">
              <span class="nav-column">名称展示：</span>
              <div class="nav-column info">
                <el-switch
                  v-model="dataSource.showTips"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="显示"
                  inactive-text="隐藏"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </div>
            </div>
          </div>

          <div
            class="img-preview1 area-editor"
            :class="selectLayoutIndex === index ? 'select-row' : ''"
            @click="onPickedRow(index)"
            v-for="(item, index) in dataSource.data"
            :key="index"
          >
            <div class="nav-row">
              <span class="nav-column">名称：</span>
              <div class="nav-column info">
                <el-input
                  class="com-input"
                  style="width: 205px"
                  @input="onNameInput(index, $event)"
                  v-model="item.name"
                  maxlength="10"
                />
              </div>
            </div>
            <div class="nav-row">
              <span class="nav-column">链接：</span>
              <div class="nav-column info">
                <div v-if="!item.linkPage">
                  <select-link :link-pages="linkPages" @confirm="e => handleChange(e, item)"></select-link>
                </div>
                <div v-else class="link-page">
                  <div>{{ item.linkName }}</div>
                  <div class="delete" @click="deleteItemLinkPage(index)"></div>
                </div>
              </div>
            </div>
            <div class="nav-row" v-if="item.linkType && item.linkId">
              <span class="nav-column">对应{{ item.tips }}：</span>
              <div class="nav-column info">
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
          </div>
        </div>
      </div>
    </div>

    <!--上传选择图片-->
    <materials-image
      @cancel="onFinishedPickImage"
      @picked="onFinishedPickImage"
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
  import './css/common.less';
  import './css/select-detail.less';
  import styles from './magicModuleItemStyle.js';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import navParamsAssember from '../../../utils/nav-params-assember.js';
  import size from './size.vue';
  import { mapState } from 'vuex';
  import HotArea from './hot-area-help/index.vue';
  import { HotAreaData, initHotAreaData } from './hot-area-help/config';
  import EditHeader from './edit-header.vue';
  import SelectLink from '@/dss-wechat3rd/src/components/select-link/index.vue';

  export default {
    name: 'HotAreaModuleEdit',
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
      HotArea,
      EditHeader,
      SelectLink,
    },
    data() {
      return {
        dialogVisible: false,
        visibleUpload: false,
        styles: styles,
        selectLayoutIndex: -1,
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
      initHotAreaData(this.dataSource.data);
      navParamsAssember.initLinkPages.bind(this)();
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
      // 背景图加载完，获取的高宽设置到配置中
      onImgLoaded(event) {
        const { width, height } = event;
        this.dataSource.width = width;
        this.dataSource.height = height;
      },
      // 选中背景图，图片å地址设置到配置中
      onFinishedPickImage(src) {
        this.visibleUpload = false;
        if (!!src && !!src.imgUrl) {
          this.dataSource.src = src.imgUrl;
          initHotAreaData([]);
          this.dataSource.data = [];
        }
      },
      onNameInput(index, value) {
        // console.log('onNameInput',index,value);
        HotAreaData[index].name = value;
      },
      onPickedArea(index) {
        this.selectLayoutIndex = index;
      },
      onPickedRow(index) {
        this.selectLayoutIndex = index;
        this.$refs.$hotArea.invokePickRow(index);
      },
      // 热区发生改变，热区信息记录到配置中
      // dataSource.data 与 HotAreaData处于隔离状态
      onAreaChange() {
        const newData = [];
        HotAreaData.forEach(item => {
          const oldItem = this.dataSource.data.find(iItem => {
            return iItem.id === item.id;
          });
          const isUpdate = !!oldItem;
          if (isUpdate) {
            // 仅对layout属性保持更新同步
            newData.push({
              ...oldItem,
              shape: { ...item.shape },
            });
          } else {
            newData.push(item);
          }
        });
        this.dataSource.data = newData;
      },
      handleChange(choosedVals, item) {
        if (!choosedVals || !choosedVals.length) return;
        navParamsAssember.handleChangeLinkPage.bind(this)(choosedVals, item);
      },
      // 删除图片对应链接
      deleteItemLinkPage(index) {
        const newItem = { ...this.dataSource.data[index] };

        newItem.linkPage = '';
        newItem.linkName = '';
        newItem.linkType = 0;
        newItem.detailId = '';
        newItem.detailUrl = '';
        newItem.detailText = '';

        this.dataSource.data.splice(index, 1);
        this.dataSource.data.splice(index, 0, newItem);
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
      deleteImage() {
        this.dataSource.src = '';
      },
    },
  };
</script>

<style lang="less" scoped>
  .replace {
    background: #000;
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    font-size: 12px;
    z-index: 300;
    border-radius: 10px;
    color: #fff;
  }

  .area-editor {
    padding: 5px;
    margin: 5px 0;
    border: 1px dashed gray;
    position: relative;
  }

  .image-container .img-preview1 .nav-column:first-child {
    margin-top: 5px;
  }

  .select-row {
    border-style: solid;
  }
</style>
