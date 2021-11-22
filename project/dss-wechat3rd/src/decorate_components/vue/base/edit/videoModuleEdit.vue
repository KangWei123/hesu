
<template>
  <div class="wd-image-editor"
       v-if="dataSource">
    <edit-header :data-source="dataSource" name="视频"></edit-header>

    <div class="com-body">
      <size :dataSource="dataSource"></size>
    </div>

    <template>
      <!--点击上传图片-->
      <div class="com-row" v-if="!dataSource.data" style="padding-left: 20px;">
        <span class="com-column">选择视频：</span>
        <span class="com-column">
          <!-- <span class="com-upload-button" @click="showDialog = true"></span> -->

          <div class="theme-img">
            <div class="add-img" @click="showChooseVideoDialog=true">
              <i class="el-icon-plus"></i>
            </div>
            <div class="theme-img-operate">
              <div class="operate-box">
                <a class="label-color">添加视频</a>
              </div>
              <span style="font-size: 12px;" class="label-color">建议尺寸750*1050</span>
            </div>
          </div>
        </span>
      </div>

      <!-- <div class="one-row-upload" v-if="!dataSource.data">
        <a class="dss-link"
          @click="showChooseVideoDialog=true">+添加视频</a>
        <div>建议尺寸750*1050</div>
      </div> -->

        <!--已存在图片的预览-->
      <div class="image-container" v-else>
        <div class="img-preview1">
          <i class="com-close"
            @click="deteleVideo"></i>

          <div class="nav-row" style="margin-top: -10px;">
            <span class="nav-column">视频：</span>
            <span style="color: #2E8DFF;">{{dataSource.data.materialName}}</span>
            <span class="nav-column">
              <img
                class="voice-icon"
                :src="videoIcon"
                style="cursor:pointer; width:18px; height:18px; vertical-align: middle; margin-left: 10px;"
                @click="showVideoPlayer(dataSource.data)"
              />
            </span>
          </div>
        </div>
      </div>
    </template>

    <materials-video
      v-if="showChooseVideoDialog"
      :is-video="true"
      @picked="onPickedVideo"
      @cancel="onCancelChooseVideo"
    ></materials-video>

    <video-player
      v-if="showVideo && currentVideoPlayer.url"
      :value="currentVideoPlayer.value"
      :url="currentVideoPlayer.url"
      :originalName="currentVideoPlayer.originalName"
      @closeVideo="closeVideoPlayer"
    />
  </div>
</template>
<script>
// import MaterialsImage from '@/dss-wechat3rd/src/components/materials/image/index.vue';
// import MaterialsImage from '@/dss-wechat3rd/src/components/material-picker/img-material/index.vue';
// import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
import MaterialsVideo from '@/dss-wechat3rd/src/components/material-picker/video-audio-material/index.vue';
import VideoPlayer from '@/dss-wechat3rd/src/components/video-player/index';
import videoIcon from '@/dss-wechat3rd/src/images/decorate/videoModule.png';
// import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import size from './size.vue';
import './css/common.less';
// import './css/imageModuleEdit.less';
import './css/select-detail.less';
import { mapState } from 'vuex';
import EditHeader from './edit-header.vue';

export default {
  name: 'videoModuleEdit',
  props: {
    dataSource: {
      type: Object,
      default: null
    }
  },
  components: {
    size,
    MaterialsVideo,
    VideoPlayer,
    EditHeader
  },

  data() {
    return {
      showChooseVideoDialog: false,
      videoIcon: videoIcon,
      showVideo: false,
      currentVideoPlayer: {
        value: 0,
        url: '',
        originalName: ''
      }
    };
  },

  mounted() {},

  methods: {
    // 删除视频
    deteleVideo(val) {
      this.dataSource.data = null;
    },

    onPickedVideo(res) {
      if (!res.cdnUrl) {
        this.$message({
          type: 'warning',
          message: '该视频cdn地址为空'
        });
        return;
      }
      this.dataSource.data = res;
      this.showChooseVideoDialog = false;
    },

    onCancelChooseVideo() {
      this.showChooseVideoDialog = false;
    },

    // player
    showVideoPlayer(video) {
      this.currentVideoPlayer = {
        value: video.id,
        url: video.cdnUrl,
        originalName: video.originalName
      };
      this.showVideo = true;
    },

    closeVideoPlayer() {
      this.showVideo = false;
    }
  }
};
</script>
