<template>
  <div class="materials-video-player">
    <div class="video-player-popover" @click="closeVideo"></div>
    <div class="video-player-main">
      <i class="el-icon-circle-close video-player-closer" @click="closeVideo"></i>
      <video v-if="!!url" id="material-video" class="video-js vjs-big-play-centered">
        <source :src="url" :type="videoType" />
      </video>
    </div>
  </div>
</template>

<script>
import VideoJS from 'video.js';
import 'video.js/dist/video-js.css';
import video_zhCN from 'video.js/dist/lang/zh-CN.json';
VideoJS.addLanguage('zh-CN', video_zhCN);

export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    originalName: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '800px'
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  watch: {
    url(newVal) {
      if (!!newVal) this.play();
    }
  },
  data() {
    return {
      player: null
    };
  },
  mounted() {
    if (!!this.url) {
      this.play();
    }
  },
  computed: {
    videoType() {
      // 视频
      // 支持格式：mp4,AVI,wmv
      let type = 'video/mp4';
      let originalName = (this.originalName || '').toLocaleLowerCase();
      if (!!originalName) {
        if (originalName.indexOf('.avi') > 0) {
          type = 'video/avi';
        } else if (originalName.indexOf('.wmv') > 0) {
          type = 'video/x-ms-wmx';
        }
      }
      return type;
    }
  },
  methods: {
    play() {
      this.$nextTick(() => {
        if (!this.player) {
          this.player = VideoJS('material-video', {
            controls: true, //播放器控件
            autoplay: true, //自动播放
            preload: 'auto', //预加载
            width: this.width,
            height: this.height
          });
          this.player.on('error', e => {
            console.log(e);
          });
        } else {
          this.player.src(this.url);
          this.player.load();
        }
      });
    },
    closeVideo() {
      this.player && this.player.dispose();
      this.$emit('closeVideo');
    }
  }
};
</script>

<style lang="less">
.materials-video-player {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.5);
  .video-player-popover {
    position: absolute;
    width: 100vw;
    height: 100vh;
  }
  .video-player-main {
    position: relative;
    width: 800px;
    margin: 10% auto 0;
  }
  .video-player-closer {
    position: absolute;
    right: -15px;
    top: -15px;
    z-index: 900;
    color: #e4e7ed;
    font-size: 30px;
    cursor: pointer;
  }
}
</style>
