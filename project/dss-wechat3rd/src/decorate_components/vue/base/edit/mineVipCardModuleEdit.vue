<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="mine-vipcard-editor" v-if="dataSource">
    <div class="com-title">
      <span>会员卡</span>
    </div>

    <div class="com-body">
      <div class="com-row">
        <span class="com-column">样式:</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.cardMode">
            <el-radio-button label="1">样式一</el-radio-button>
            <el-radio-button label="2">样式二</el-radio-button>
          </el-radio-group>
        </span>
      </div>
      <size :data-source="dataSource" />

      <div class="com-row">
        <span class="com-column">字体颜色:</span>
        <span class="com-column">
          <colorSelect
            v-model="dataSource.textColor"
            :color-model.sync="dataSource.textMode"
            :default-color="dataSource.defaultTextColor"
            show-border
          />
        </span>
      </div>

      <div class="com-row-title">背景图设置：</div>
      <div class="com-row">
        <span class="com-column">正式会员背景:</span>
        <div class="com-column">
          <el-radio-group class="radio-group" v-model="dataSource.bgMode">
            <el-radio-button label="default">会员等级图片</el-radio-button>
            <el-radio-button label="custom">自定义背景</el-radio-button>
          </el-radio-group>
          <div v-if="dataSource.bgMode === 'custom'" class="com-img-item">
            <image-select
              param="bgUrl"
              img-content-size="78px"
              img-tip-size="750 x 420"
              :img-url="dataSource.bgUrl"
              @handleShow="addImage"
              @handleDeleteImg="deteleImage"
            />
          </div>
          <div class="com-row-tip">设置用户为正式会员时展示的背景图<br />未添加图片，将展示系统默认图</div>
        </div>
      </div>

      <div class="com-row">
        <span class="com-column">未授权会员背景:</span>
        <div class="com-column">
          <image-select
            param="noLoginBgUrl"
            img-content-size="78px"
            img-tip-size="750 x 420"
            :img-url="dataSource.noLoginBgUrl"
            @handleShow="addImage"
            @handleDeleteImg="deteleImage"
          />
          <div class="com-row-tip">设置用户未登录授权时展示的背景图<br />未添加图片，将展示系统默认图</div>
          <div class="com-row-view">
            <el-popover placement="right" width="260" trigger="click">
              <div class="view-con">
                <div class="view-bg" :style="{ backgroundImage: `url(${dataSource.noLoginBgUrl})` }">
                  <img class="left-avatar" :src="defaultAvatar" />
                  <div class="view-btn">授权获取更多权益</div>
                </div>
              </div>
              <el-button slot="reference" type="text">效果预览</el-button>
            </el-popover>
          </div>
        </div>
      </div>

      <div class="com-row" v-if="dataSource.cardMode === '2'">
        <div class="com-column" style="width: 200px">信息展示设置（至少选择一个）</div>
        <el-checkbox-group v-model="dataSource.checkedItems" :min="1">
          <div class="item-check-box-wrapper" v-for="item in infoItems" :key="item.value">
            <el-checkbox class="item-check-box" :label="item.value">{{ item.label }}</el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </div>

    <!--上传选择图片-->
    <materials-image
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
    />
  </div>
</template>

<script>
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material';
  import cdnResConfig from '@/business-common/utils/cdnResConfig';
  import Size from './size.vue';
  import ImageSelect from './image-select.vue';
  import './css/pageInfoNavModuleEdit.less';
  import './css/common.less';

  export default {
    name: 'PageVipCardModuleEdit',
    props: {
      dataSource: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    components: {
      Size,
      colorSelect,
      MaterialsImage,
      ImageSelect,
    },
    data() {
      return {
        visibleUpload: false,
        currentImage: '',
        defaultAvatar: cdnResConfig.mine.defaultAvatar,
        infoItems: [
          {
            label: '余额',
            value: 'charge',
          },
          {
            label: '积分',
            value: 'integral',
          },
          {
            label: '优惠券',
            value: 'coupon',
          },
          {
            label: '礼品卡',
            value: 'giftCard',
          },
        ],
      };
    },
    methods: {
      deteleImage(key) {
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource[key] = '';
        this.$forceUpdate();
      },
      addImage(key) {
        this.currentImage = key;
        this.visibleUpload = true;
      },
      onCancelPickImage() {
        this.currentImage = '';
        this.visibleUpload = false;
      },
      onSuccessPickedImage(src) {
        this.visibleUpload = false;
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource[this.currentImage] = src.imgUrl;
        this.currentImage = '';
      },
    },
  };
</script>

<style lang="less">
  .mine-vipcard-editor {
    .com-row-title {
      margin-top: 30px;
      font-size: 16px;
      font-weight: 500;
      color: #303133;
      line-height: 22px;
    }

    .addImage {
      border: 1px solid #dce1e6;
      border-radius: 5px;
      font-size: 30px;
      font-weight: 400;
      font-family: PingFangSC-Regular;
      cursor: pointer;
      display: inline-block;
      color: #717378;
      width: 78px;
      height: 78px;
      line-height: 70px;
      text-align: center;
      margin-right: 6px;
    }

    .radio-group {
      margin: 4px 0 10px;
    }

    .poster-image {
      width: 78px;
      height: 78px;
      position: relative;
      margin-right: 6px;

      .com-close {
        position: absolute;
        right: 0;
        top: 0;
      }
    }

    .com-img-item {
      display: flex;
      align-items: flex-end;
    }

    .item-check-box-wrapper {
      height: 50px;
      border: 1px solid #f0f2f7;
      margin-top: 10px;
      background: #f5f7fa;
    }

    .item-check-box {
      margin-top: 15px;
      margin-left: 10px;
    }

    .com-row-tip {
      color: #858c99;
      font-size: 12px;
      font-weight: 400;
      margin-top: 2px;
    }

    .com-row-view {
      font-size: 12px;
      position: relative;

      .view-action {
        margin-top: 4px;
        cursor: pointer;
        color: #1890ff;
      }
    }
  }

  .view-con {
    .view-bg {
      width: 216px;
      height: 104px;
      background-size: contain;
      background-repeat: no-repeat;
      padding: 20px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    img {
      width: 34px;
      height: 34px;
      margin-right: 2px;
    }

    .view-btn {
      padding: 4px;
      text-align: center;
      color: #fff;
      border-radius: 3px;
      background-image: linear-gradient(to right, #ff7232, #ff5537);
    }
  }
</style>
