<template>
  <el-dialog title="插入视频" :visible="visible" @close="close">
    <div class="insert-video-input">
      <span class="insert-video-input-label">视频地址:</span>
      <el-input placeholder="复制视频地址到这里" size="small" v-model="address"></el-input>
    </div>
    <p class="insert-video-tip">
      只支持插入
      <a href="https://v.qq.com/">腾讯视频</a>
    </p>
    <div class="insert-video-preview" v-if="!preview">
      <span class="insert-video-preview-text">预览区</span>
    </div>
    <iframe
      frameborder="0"
      v-else
      class="insert-video-iframe"
      :src="videoAddress"
      allowfullscreen="true"
    ></iframe>
    <div slot="footer" class="wx-user-dialog-footer">
      <!-- <el-button @click="close">取 消</el-button> -->
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { utils } from '@/dss-common/utils/url';
const utilsUrl = utils.url;

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      address: '',
      preview: false,
      videoAddress: ''
    };
  },
  watch: {
    address(val) {
      let regx = /^(https:\/\/v.qq.com|https:\/\/m.qq.com)/;
      this.preview = regx.test(val);
      if (!this.preview) return;
      let vid = utilsUrl.queryString('vid', val);
      if (!vid) {
        let arr = val.split('/');
        vid = arr[arr.length - 1].split('.')[0];
      }
      this.videoAddress = 'https://v.qq.com/txp/iframe/player.html?vid=' + vid;
      this.preview = true;
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submit() {
      if (!this.preview) {
        this.$message({
          type: 'warning',
          message: '请插入正确腾讯视频地址'
        });
        return false;
      }
      this.$emit('submit', this.videoAddress);
    }
  }
};
</script>

<style lang="less">
.insert-video-input {
  display: flex;
  .insert-video-input-label {
    width: 80px;
  }
}
.insert-video-tip {
  font-size: 12px;
  a {
    color: #38f;
  }
}
.insert-video-preview {
  min-height: 280px;
  margin-top: 10px;
  background-color: #ddd;
  text-align: center;
  font-size: 20px;
  position: relative;
  .insert-video-preview-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.insert-video-iframe {
  width: 100%;
  margin-top: 10px;
  min-height: 280px;
}
</style>

