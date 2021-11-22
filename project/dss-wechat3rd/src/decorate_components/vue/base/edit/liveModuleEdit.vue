<template>
  <div class="wd-image-editor" v-if="dataSource">
    <edit-header :data-source="dataSource" name="直播"></edit-header>

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
      <div class="com-row">
        <span class="com-column input-title">房间ID：</span>
        <span class="nav-column">
          <el-input class="com-input" v-model="dataSource.data.roomId" placeholder />
        </span>
        <!-- <el-select v-model="dataSource.data.roomId" clearable placeholder="请选择房间ID">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
      </div>
      <materials-image-field label="活动图片" :img.sync="dataSource.data.src" />
    </div>
  </div>
</template>
<script>
  import MaterialsImageField from './materials-image-field';
  import wpBaseApi from '@/dss-wechat3rd/src/api/index.js';
  import size from './size.vue';
  import EditHeader from './edit-header.vue';
  import './css/common.less';
  import './css/imageModuleEdit.less';
  import './css/select-detail.less';

  export default {
    name: 'LiveModuleEdit',
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      MaterialsImageField,
      size,
      EditHeader,
    },
    data() {
      return {
        defaultLayoutImg: process.env.VUE_APP_CDN_URL + '/resources/dss-web-portal/cdn/live/live-default-bg-tiny.png',
        visibleUpload: false,
      };
    },
    watch: {},
    mounted() {
      // this.fetchLiveRoomId();
    },
    methods: {
      fetchLiveRoomId() {
        wpBaseApi
          .getLiveRoomId()
          .then(res => {
            console.log('res-->', res);
          })
          .always(() => {});
      },
    },
  };
</script>
