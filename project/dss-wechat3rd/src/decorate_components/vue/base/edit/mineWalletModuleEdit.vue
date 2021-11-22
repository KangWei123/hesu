<template>
  <div class="mine-info-editor" v-if="dataSource">
    <div class="com-title">
      <span>钱包</span>
    </div>

    <div class="com-body">
      <size :data-source="dataSource"></size>

      <div class="com-row" style="display: flex">
        <span class="com-column">字体颜色:</span>
        <color-select
          v-model="dataSource.textColor"
          :color-model.sync="dataSource.textMode"
          :default-color="dataSource.defaultTextColor"
          :default-label="defaultColorSelectLabel"
          show-border
        />
      </div>

      <div class="com-row" style="display: flex">
        <span class="com-column">背景颜色：</span>
        <color-select
          v-model="dataSource.backgroundColor"
          :color-model.sync="dataSource.bgMode"
          :default-color="dataSource.defaultBgColor"
          show-border
        />
      </div>
      <div class="com-row">
        <div class="com-column" style="width: 200px">功能展示（至少选择一个）</div>
        <el-checkbox-group v-model="dataSource.checkedItems" :min="1">
          <div class="item-check-box-wrapper" v-for="item in infoItems" :key="item.value" :min="1">
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
  import './css/pageInfoNavModuleEdit.less';
  import ColorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index';
  import size from './size.vue';
  import './css/common.less';

  export default {
    name: 'PageWalletModuleEdit',
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: { size, ColorSelect },
    data() {
      return {
        visibleUpload: false,
        value: {},
        defaultColorSelectLabel: [
          { value: 'default', name: '默认' },
          { value: 'custom', name: '自定义' },
        ],
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
  };
</script>

<style lang="less">
  .mine-info-editor {
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
