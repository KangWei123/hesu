<template>
  <div>
    <div class="minapp-card">
      <header>
        <i class="logo" />
        <p>{{ title }}</p>
      </header>
      <choose-images v-model="model" @delete="onDeleteImg" />
      <footer>
        <span>小程序</span>
      </footer>
    </div>
    <p class="tip">建议图片尺寸为 5:4，大小不超过 2M，暂不支持动图</p>
  </div>
</template>

<script>
// 包装 uploader => v-model
import Uploader from '../material-picker/single-uploader';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';

export default {
  components: {
    Uploader,
    ChooseImages
  },

  props: {
    value: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '小程序'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      visible: false
    };
  },

  methods: {
    handleUploadSuccess(data) {
      if (typeof data === 'string') {
        this.$emit('input', '' + JSON.parse(data).localUrl);
      } else {
        this.$emit('input', '' + data.localUrl);
      }
    },
    onDeleteImg() {
      this.$emit('input', '');
    }
  },

  computed: {
    model: {
      get() {
        return { imgUrl: this.value };
      },
      set(val) {
        this.$emit('input', val && val.imgUrl);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.minapp-card {
  display: flex;
  flex-direction: column;
  width: 172px;
  height: 220px;
  padding: 0 10px;
  background: rgb(250, 250, 255);
  border: 1px solid #eee;
  border-radius: 2px;
  justify-content: space-evenly;
  header {
    display: flex;
    align-items: center;
    height: 30px;
    i {
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #3d7dfa;
    }
    p {
      margin: 0;
      margin-left: 4px;
      line-height: 1em;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 10em;
      word-wrap: break-word;
      white-space: nowrap;
    }
  }
  .upload {
    background: #fff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 120px;
    border: 1px dotted #eee;
    position: relative;
    p {
      position: relative;
      top: -8px;
      line-height: 1.4em;
      font-size: 12px;
      color: #999;
    }
    .upload-btn-minapp {
      position: absolute;
      bottom: 16px;
    }
  }
  footer {
    height: 30px;

    span {
      font-size: 12px;
      color: #ccc;
    }
  }
}
.tip {
  color: #999;
  font-size: 12px;
}
</style>
