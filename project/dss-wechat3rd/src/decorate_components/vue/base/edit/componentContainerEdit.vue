<template>
  <div class="component-container-edit">
    <edit-header :data-source="dataSource" name="容器"></edit-header>
    <div class="com-body">
      <div class="com-row">
        <span class="com-column">背景图片：</span>
        <span class="com-column">
          <div class="theme-img">
            <div class="add-img" @click="visibleUpload = true">
              <img v-if="dataSource.bg" :src="dataSource.bg" />
              <i v-else class="el-icon-plus"></i>
            </div>
          </div>
        </span>
      </div>
      <div class="com-row">
        <span class="com-column">图片模式：</span>
        <span class="com-column">
          <!-- eslint-disable-next-line vue/no-mutating-props -->
          <el-select v-model="dataSource.bgMode">
            <el-option label="填充" value="fill"></el-option>
            <el-option label="包含" value="contain"></el-option>
            <el-option label="重复" value="repeat"></el-option>
          </el-select>
        </span>
      </div>
    </div>
    <!--上传选择图片-->
    <materials-image
      @cancel="visibleUpload = false"
      @picked="handlePick"
      v-if="visibleUpload"
      :visible.sync="visibleUpload"
    />
  </div>
</template>

<script>
  import EditHeader from './edit-header.vue';
  import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/image-material';

  export default {
    name: 'ComponentContainerEdit',
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      MaterialsImage,
      EditHeader,
    },
    data() {
      return { visibleUpload: false };
    },
    methods: {
      handlePick(src) {
        this.visibleUpload = false;
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.bg = src.imgUrl;
      },
    },
  };
</script>

<style></style>
