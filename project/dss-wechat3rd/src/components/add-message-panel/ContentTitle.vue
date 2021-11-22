<template>
  <ul class="wx-msg-title">
    <!-- <li
      class="_tab _Article"
      :class="getCurrent(ButtonTypes.Article)"
      @click="click(ButtonTypes.Article)"
      v-if="!hiddenOption[ButtonTypes.Article]"
    >图文消息</li> -->
    <li
      class="_tab _text"
      :class="getCurrent(ButtonTypes.TEXT)"
      v-if="!hiddenOption[ButtonTypes.TEXT]"
      @click="click(ButtonTypes.TEXT)"
    >文字</li>
    <li
      class="_tab _img"
      :class="getCurrent(ButtonTypes.IMAGE)"
      v-if="!hiddenOption[ButtonTypes.IMAGE]"
      @click="click(ButtonTypes.IMAGE)"
    >图片</li>
    <!-- <li
      class="_tab _audio"
      :class="getCurrent(ButtonTypes.AUDIO)"
      v-if="!hiddenOption[ButtonTypes.AUDIO]"
      @click="click(ButtonTypes.AUDIO)"
    >语音</li>
    <li
      class="_tab _video"
      :class="getCurrent(ButtonTypes.VIDEO)"
      v-if="!hiddenOption[ButtonTypes.VIDEO]"
      @click="click(ButtonTypes.VIDEO)"
    >视频</li> -->
  </ul>
</template>
<style rel="stylesheet/less" lang="less" scoped>
ul {
  padding-left: 0;
  list-style-type: none;
}
li {
  display: list-item;
  text-align: -webkit-match-parent;
}

.wx-msg-title:after {
  content: '\200B';
  display: block;
  height: 0;
  clear: both;
}
.wx-msg-title {
  line-height: 38px;
  background-color: #f3f3f3;
  ._tab {
    float: left;
    padding: 0 20px;
    cursor: pointer;
    line-height: 38px;
  }
  ._selected {
    color: #2e8dff;
  }

  // ._text:before {
  //   background: transparent url('./svg/sender_text.svg') no-repeat 0 0;
  // }
  // ._selected._text:before {
  //   background: transparent url('./svg/sender_text_current.svg') no-repeat 0 0;
  // }

  // ._img:before {
  //   background: transparent url('./svg/sender_img.svg') no-repeat 0 0;
  // }
  // ._selected._img:before {
  //   background: transparent url('./svg/sender_img_current.svg') no-repeat 0 0;
  // }

  // ._audio:before {
  //   background: transparent url('./svg/sender_audio.svg') no-repeat 0 0;
  // }
  // ._selected._audio:before {
  //   background: transparent url('./svg/sender_audio_current.svg') no-repeat 0 0;
  // }

  // ._video:before {
  //   background: transparent url('./svg/sender_video.svg') no-repeat 0 0;
  // }
  // ._selected._video:before {
  //   background: transparent url('./svg/sender_video_current.svg') no-repeat 0 0;
  // }

  ._tab:before {
    content: ' ';
    display: inline-block;
    width: 22px;
    height: 20px;
    vertical-align: middle;
    margin: -0.2em 5px 0 0;
  }
}
</style>
<script>
import { ButtonTypes } from '@/dss-wechat3rd/src/constants/wx-msg';
const CurClass = '_selected';
const CurNoClass = '';
export default {
  props: {
    type: {
      type: String
    },
    hiddenOption: {
      type: Object,
      default: _ => {}
    },
    store: {
      type: Object,
      default: _ => {}
    }
  },
  watch: {
    type(val) {
      this.current = val;
    }
  },
  data() {
    return {
      current: this.type,
      ButtonTypes: ButtonTypes
    };
  },
  methods: {
    getCurrent(key) {
      return this.current == key ? CurClass : CurNoClass;
    },
    click(key) {
      this.$emit('titleChange', (this.current = key));
    }
  }
};
</script>
