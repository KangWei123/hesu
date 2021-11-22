/*
 * @Author: LCW 
 * @Date: 2019-04-02 10:30:18 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-05-29 21:43:20
 */
<template>
    <div class="choosed-materials">
      <div style="position:relative;display:inline-block">
        <!-- 图片 -->
        <el-card class="choosed-materials-image" v-if="type == ButtonTypes.IMAGE"> 
          <div 
          v-bind:style="{backgroundImage:'url(' + (materials.imgUrl || (materials.value && materials.value.imgUrl)) + ')'}"></div>
        </el-card>

        <!-- 图文 -->
        <!-- <article-card v-else-if="type == ButtonTypes.Article" :articleItem="materials.article" /> -->

        <!-- 音频 -->
        <!-- <audio-player-card 
          v-else-if="type == ButtonTypes.AUDIO" 
          :value="materials.value" 
          :originalName="materials.originalName"
          :url="materials.url"/> -->

        <!-- 视频 -->
        <!-- <video-player-card 
          v-else-if="type == ButtonTypes.VIDEO"
          :value="materials.value"
          :originalName="materials.originalName"
          :url="materials.url">
        </video-player-card> -->

        <div class="choosed-materials--toggle" @click="toggleMaterials">
            <span>替换素材</span>
        </div>
      </div>
    </div>
</template>
<script>
import { ButtonTypes } from '@/dss-wechat3rd/src/constants/wx-msg';
// import articleCard from '@/dss-wechat3rd/src/components/materials/article/article-card.vue';
// import audioPlayerCard from '@/dss-wechat3rd/src/components/materials/video-and-audio/audio-player-card.vue';
// import videoPlayerCard from '@/dss-wechat3rd/src/components/materials/video-and-audio/video-player-card.vue';
export default {
  // components: { articleCard, audioPlayerCard, videoPlayerCard },
  props: {
    materials: {
      type: Object
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      ButtonTypes,
      showVideo: false
    };
  },
  mounted() {},
  methods: {
    toggleMaterials() {
      this.$emit('toggleMaterials');
    }
  }
};
</script>

<style lang="less">
.choosed-materials {
  padding: 17px 20px;
  min-height: 215px;
  &--toggle {
    position: absolute;
    padding: 6px 12px;
    top: 0px;
    right: -90px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .choosed-materials-image {
    width: 200px;
    height: 130px;
    display: inline-block;
    .el-card__body {
      padding: 0;
    }
    div {
      width: 100%;
      height: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  .choosed-video-audio {
    width: 300px;
    margin-bottom: 10px;
    .el-card__body {
      padding: 10px;
    }
    .video-audio-icon {
      width: 15%;
      vertical-align: middle;
      vertical-align: middle;
      cursor: pointer;
    }
    .videoDetail {
      width: 205px;
      display: inline-block;
      margin-left: 13px;
      vertical-align: middle;
    }
    p {
      line-height: 20px;
      font-size: 14px;
      color: #888;
    }
    .videoName {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
      word-break: break-all;
    }
  }
}
</style>

