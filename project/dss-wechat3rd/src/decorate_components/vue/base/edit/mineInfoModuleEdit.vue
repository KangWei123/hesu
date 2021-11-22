<template>
  <div class="mine-info-editor" v-if="dataSource">
    <div class="com-title">
      <span>个人信息</span>
    </div>

    <div class="com-body">
      <div class="com-row">
        <span class="com-column">背景图片:</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.bgMode">
            <el-radio label="default">默认背景</el-radio>
            <el-radio label="custom">自定义背景</el-radio>
          </el-radio-group>
          <div v-if="dataSource.bgMode === 'custom'" style="margin-top: 10px">
            <div v-if="!dataSource.bgUrl" class="addImage" @click="addImage">+添加图片</div>
            <div
              v-else
              class="poster-image"
              :style="{ background: 'transparent url(' + dataSource.bgUrl + ') no-repeat center center / 100% 100%' }"
            >
              <i class="com-close" @click="deteleImage()"></i>
            </div>
            <div style="color: #858c99; font-size: 12px; font-weight: 400; margin-top: 2px">建议尺寸：750*300px</div>
          </div>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">头像位置:</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.avatarDisplay">
            <el-radio label="left">左</el-radio>
            <el-radio label="center">中</el-radio>
            <el-radio label="right">右</el-radio>
          </el-radio-group>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">字体颜色:</span>
        <span class="com-column">
          <colorSelect
            v-model="dataSource.textColor"
            :color-model.sync="dataSource.textMode"
            :default-color="dataSource.defaultTextColor"
            show-border
          ></colorSelect>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">会员等级:</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.showLevel">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </span>
      </div>

      <div class="com-row">
        <div class="com-column" style="width: 200px">信息展示设置（至少选择两个）</div>
        <el-checkbox-group @change="handleChange" v-model="dataSource.checkedItems" :min="2">
          <div class="item-check-box-wrapper" v-for="item in infoItems" :key="item.value">
            <el-checkbox class="item-check-box" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
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
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index.vue';
  import './css/pageInfoNavModuleEdit.less';
  import './css/common.less';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';

  export default {
    name: 'PageInfoModuleEdit',
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      colorSelect,
      MaterialsImage,
    },
    data() {
      return {
        visibleUpload: false,
        infoItems: [
          {
            label: '余额·充值',
            value: 'charge',
          },
          {
            label: '积分商城',
            value: 'integral',
          },
          {
            label: '礼品卡',
            value: 'giftCard',
          },
          {
            label: '优惠券',
            value: 'coupon',
          },
        ],
      };
    },
    methods: {
      handleChange() {
        console.log('handleChange', this.dataSource);
      },
      deteleImage() {
        this.dataSource.bgUrl = '';
      },

      addImage() {
        this.visibleUpload = true;
      },
      onCancelPickImage() {
        this.visibleUpload = false;
      },
      onSuccessPickedImage(src) {
        this.visibleUpload = false;
        this.dataSource.bgUrl = src.imgUrl;
      },
    },
  };
</script>

<style lang="less">
  .mine-info-editor {
    .addImage {
      padding: 0 10px;
      border: 1px solid rgba(67, 121, 237, 1);
      border-radius: 2px;
      font-weight: 400;
      color: rgba(67, 121, 237, 1);
      font-family: PingFangSC-Regular;
      cursor: pointer;
      display: inline-block;
      text-align: center;
      height: 19px;
      line-height: 19px;
    }

    .poster-image {
      width: 100px;
      height: 40px;
      position: relative;

      .com-close {
        position: absolute;
        right: -5px;
        top: -5px;
      }
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
  }
</style>
