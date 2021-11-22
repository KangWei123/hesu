<template>
  <div class="page-info-editor" v-if="dataSource">
    <!-- <div class="com-title"><span>页面信息</span></div> -->
    <edit-header :data-source="dataSource" name="页面信息"></edit-header>

    <div class="com-body">
      <div class="com-row">
        <span class="com-column" style="line-height: 30px">页面名称：</span>
        <span class="com-column">
          <el-input class="com-input" v-model="dataSource.name" placeholder=""></el-input>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">页面描述：</span>
        <span class="com-column">
          <el-input
            class="com-textarea"
            type="textarea"
            style="width: 240px"
            :rows="4"
            placeholder="请输入"
            v-model="dataSource.description"
          >
          </el-input>
        </span>
        <span class="text-title">通过微信朋友圈分享给朋友时，会自动显示页面描述;</span>
      </div>

      <div class="com-row">
        <span class="com-column">背景颜色：</span>
        <span class="com-column">
          <colorSelect
            v-model="dataSource.bgColor"
            :color-model.sync="dataSource.bgMode"
            :default-color="defaultColor"
            show-border
          ></colorSelect>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import colorSelect from '@/dss-wechat3rd/src/bz_components/colorSelect/index.vue';
  import './css/pageInfoNavModuleEdit.less';
  import './css/common.less';
  import EditHeader from './edit-header.vue';

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
      EditHeader,
    },
    data() {
      return {
        // 背景颜色
        defaultColor: '#FFFFFF',
      };
    },
    methods: {
      pickLink() {},
    },
  };
</script>
