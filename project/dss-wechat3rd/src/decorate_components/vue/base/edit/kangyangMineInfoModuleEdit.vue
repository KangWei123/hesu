<template>
  <div v-if="dataSource" class="mine-info-editor">
    <div class="com-title">
      <span>个人信息</span>
    </div>

    <el-form label-width="120px" :model="dataSource" :rules="rules">
      <el-form-item label="背景图片：">
        <el-radio-group v-model="dataSource.bgMode">
          <el-radio label="default">默认背景</el-radio>
          <el-radio label="custom">自定义背景</el-radio>
        </el-radio-group>
        <div v-if="dataSource.bgMode === 'custom'" style="margin-top: 10px">
          <div v-if="!dataSource.bgUrl" class="addImage" @click="addImage">+添加图片</div>
          <div
            v-else
            class="poster-image"
            :style="{
              background: 'transparent url(' + dataSource.bgUrl + ') no-repeat center center / 100% 100%',
            }"
          >
            <i class="com-close" @click="deteleImage()"></i>
          </div>
          <div style="color: #858c99; font-size: 12px; font-weight: 400; margin-top: 2px">建议尺寸：375*175px</div>
        </div>
      </el-form-item>

      <el-form-item label="是否显示状态：">
        <el-checkbox v-model="dataSource.showStatus"></el-checkbox>
      </el-form-item>
      <el-form-item label="服务监督热线" prop="hotline">
        <el-input v-model="dataSource.hotline" style="width: 200px" size="mini" />
        <div style="color: gray; font-size: 12px">区号-电话号码，手机号码，或400客服热线</div>
      </el-form-item>
    </el-form>

    <!--上传选择图片-->
    <materials-image
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
      @cancel="onCancelPickImage"
      @picked="onSuccessPickedImage"
    />
  </div>
</template>

<script>
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index.vue';
  import regexps from '@/dss-common/utils/regexps';
  import './css/pageInfoNavModuleEdit.less';
  import './css/common.less';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material/index.vue';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';

  const rules = {
    hotline: [{ pattern: regexps.servicePhone.reg, message: '请输入正确的联系电话' }],
  };

  export default {
    name: 'MineInfoModuleEdit',
    components: {
      colorSelect,
      MaterialsImage,
    },
    mixins: [industryHelperMixin],
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        visibleUpload: false,
        rules,
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
    }

    .item-check-box {
      margin-top: 15px;
      margin-left: 10px;
    }
  }
</style>
