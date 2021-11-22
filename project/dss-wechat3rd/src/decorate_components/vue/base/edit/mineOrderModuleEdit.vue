<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="mine-info-editor" v-if="dataSource">
    <div class="com-title">
      <span>我的订单</span>
    </div>
    <div class="com-body">
      <size :data-source="dataSource" />
      <div class="com-row">
        <div class="com-column" style="width: 200px">信息展示设置（至少选择两个）</div>
        <el-checkbox-group @change="handleChange" v-model="dataSource.checkedItems" :min="2">
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
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin';
  import './css/pageInfoNavModuleEdit.less';
  import './css/common.less';
  import Size from './size.vue';

  export default {
    name: 'MineOrderModuleEdit',
    mixins: [industryHelperMixin],
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      Size,
      MaterialsImage,
    },
    data() {
      return {
        visibleUpload: false,
      };
    },
    computed: {
      infoItems() {
        return this.mGetMineOrderItems();
      },
    },
    methods: {
      handleChange() {
        console.log('handleChange', this.dataSource);
      },
      deteleImage() {
        // eslint-disable-next-line vue/no-mutating-props
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
        // eslint-disable-next-line vue/no-mutating-props
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
      margin-right: 20px;
    }
    .item-check-box {
      margin-top: 15px;
      margin-left: 10px;
    }
  }
</style>
